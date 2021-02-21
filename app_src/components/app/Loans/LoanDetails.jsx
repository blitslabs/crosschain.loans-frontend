import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import Navbar from './Navbar'
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import Loading from '../../Loading'
import EmailModal from './EmailModal'
import CollateralModal from './CollateralModal'

// Styles
import '../styles.css'

// Libraries
import moment from 'moment'
import ReactLoading from 'react-loading'
import BigNumber from 'bignumber.js'
import { toast } from 'react-toastify'
import Stepper from 'react-stepper-horizontal'
import BlitsLoans from '../../../crypto/BlitsLoans'
import ETH from '../../../crypto/ETH'
import { Prompt } from 'react-router'
import ParticleEffectButton from 'react-particle-effect-button'
import MyParticles from './MyParticles'
import { NETWORKS, MAINNET_NETWORKS } from '../../../crypto/Networks'

// API
import {
    getLoanDetails,
    confirmLoanOperation,
    confirmCollateralLockOperation
} from '../../../utils/api'

// Actions
import { saveLoanDetails } from '../../../actions/loanDetails'

class LoanDetails extends Component {

    intervalId = 0

    state = {
        loading: true,
        loadingBtn: false,
        loanId: '',
        loadingMsg: 'Awaiting Confirmation',
        showEmailModal: false,
        showCollateralModal: false
    }

    componentDidMount() {
        const { history, match, dispatch, loanDetails } = this.props
        const { loanId } = match.params

        document.title = `Loan Details #${loanId} | Cross-chain Loans`

        if (!loanId) {
            history.push('/borrow')
        }

        getLoanDetails({ loanId })
            .then(res => res.json())
            .then(async (data) => {
                console.log(data)

                if (data.status === 'OK') {
                    dispatch(saveLoanDetails(data.payload))
                }

                this.setState({
                    loanId,
                    loading: false,
                })

                this.checkLoanStatus(loanId)
            })
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    /**
     * @dev Lock Collateral
     */
    handleLockCollateralBtn = async (selectedCollateralAsset) => {

        const { loanDetails, prices, protocolContracts, shared } = this.props
        const {
            aCoinLenderAddress, secretHashB1, principal, contractLoanId, loansContractAddress
        } = loanDetails

        const collateralLockContract = protocolContracts[shared?.networkId]?.CollateralLockV2?.address
        const requiredCollateral = parseFloat(BigNumber(principal).div(prices[selectedCollateralAsset].usd).times(1.5))

        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        const bCoinBorrowerAddress = (await ETH.getAccount()).payload

        // Generate secretHash
        const message = `You are signing this message to generate secrets for the Hash Time Locked Contracts required to lock the collateral. LoanID: ${contractLoanId}. Collateral Lock Contract: ${collateralLockContract}`
        let response = await ETH.generateSecret(message)

        if (response.status !== 'OK') {
            console.log(response)
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false, })
            return
        }

        const { secret, secretHash } = response.payload

        response = await BlitsLoans.ETH.lockCollateral(
            requiredCollateral,
            aCoinLenderAddress,
            secretHash,
            secretHashB1,
            collateralLockContract,
            bCoinBorrowerAddress,
            contractLoanId,
            loansContractAddress,
        )

        console.log(response)

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            operation: 'LockCollateral',
            networkId: shared?.networkId,
            txHash: response.payload.transactionHash
        }

        const intervalId = setInterval(() => {
            confirmCollateralLockOperation(params)
                .then(data => data.json())
                .then((res) => {
                    console.log(res)
                    if (res.status === 'OK') {
                        toast.success('Collateral Locked', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
                        clearInterval(intervalId)
                        return
                    }
                }).catch((e) => console.log(e))
        }, 5000)
    }

    handleCancelBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, protocolContracts, shared } = this.props
        const { contractLoanId } = loanDetails
        const loansContract = protocolContracts[shared?.networkId].CrosschainLoans.address

        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        const account = (await ETH.getAccount()).payload
        const accountLoans = (await BlitsLoans.ETH.getAccountLoans(account, loansContract))

        let userLoansCount = 0
        for (let l of accountLoans) {
            userLoansCount++
            if (l == contractLoanId) break;
        }

        // Generate secretHash        
        const message = `You are signing this message to generate secrets for the Hash Time Locked Contracts required to create the loan. Lender Nonce: ${userLoansCount}. Loans Contract: ${loansContract}`
        const signResponse = await ETH.generateSecret(message)

        if (signResponse.status !== 'OK') {
            toast.error(signResponse.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const { secret, secretHash } = signResponse.payload
        const secretB1 = `0x${secret}`
        const secretHashB1 = secretHash

        const response = await BlitsLoans.ETH.cancelLoan(contractLoanId, secretB1, loansContract)

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            operation: 'CancelLoan',
            networkId: shared?.networkId,
            txHash: response.payload.transactionHash
        }

        const intervalId = setInterval(() => {
            confirmLoanOperation(params)
                .then(data => data.json())
                .then((res) => {
                    console.log(res)
                    if (res.status === 'OK') {
                        toast.success('Loan Canceled', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
                        clearInterval(intervalId)
                        return
                    }
                }).catch((e) => console.log(e))
        }, 5000)
    }

    handleApproveBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, protocolContracts, shared } = this.props
        const { contractLoanId, collateralLock } = loanDetails
        const loansContract = protocolContracts[shared?.networkId].CrosschainLoans.address

        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        const txResponse = await BlitsLoans.ETH.approveLoan(
            contractLoanId,
            collateralLock?.bCoinBorrowerAddress,
            collateralLock?.secretHashA1,
            loansContract
        )

        if (txResponse.status !== 'OK') {
            toast.error(txResponse.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            operation: 'LoanAssignedAndApproved',
            networkId: shared?.networkId,
            txHash: txResponse.payload.transactionHash
        }

        const intervalId = setInterval(() => {
            confirmLoanOperation(params)
                .then(data => data.json())
                .then((res) => {
                    console.log(res)
                    if (res.status === 'OK') {
                        toast.success('Loan Approved', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
                        clearInterval(intervalId)
                        return
                    }
                }).catch((e) => console.log(e))
        }, 5000)
    }

    handleWithdrawBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, protocolContracts, shared } = this.props
        const { contractLoanId } = loanDetails
        const loansContract = protocolContracts[shared?.networkId].CrosschainLoans.address
        const collateralNetworkId = loanDetails?.collateralLock?.networkId
        const collateralLockContract = protocolContracts[collateralNetworkId]?.CollateralLockV2?.address
        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        // Generate secretHash
        const message = `You are signing this message to generate secrets for the Hash Time Locked Contracts required to lock the collateral. LoanID: ${contractLoanId}. Collateral Lock Contract: ${collateralLockContract}`
        let response = await ETH.generateSecret(message)

        if (response.status !== 'OK') {
            console.log(response)
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false, })
            return
        }

        const { secret, secretHash } = response.payload

        const txResponse = await BlitsLoans.ETH.withdrawPrincipal(
            contractLoanId,
            `0x${secret}`, // secretA1
            loansContract
        )

        if (txResponse.status !== 'OK') {
            toast.error(txResponse.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            operation: 'LoanPrincipalWithdrawn',
            networkId: shared?.networkId,
            txHash: txResponse.payload.transactionHash
        }

        const intervalId = setInterval(() => {
            confirmLoanOperation(params)
                .then(data => data.json())
                .then((res) => {
                    console.log(res)
                    if (res.status === 'OK') {
                        toast.success('Principal Withdrawn', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
                        clearInterval(intervalId)
                        return
                    }
                }).catch((e) => console.log(e))
        }, 5000)
    }

    handleRepayBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, protocolContracts, shared } = this.props
        const { contractLoanId, tokenContractAddress, principal, interest } = loanDetails
        const loansContract = protocolContracts[shared?.networkId].CrosschainLoans.address

        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        // Check Allowance
        const repayment = new BigNumber(principal).plus(interest)
        const allowance = await ETH.getAllowance(loansContract, tokenContractAddress)
        console.log(allowance)

        if (!repayment.lt(allowance?.payload)) {
            const allowance_res = await ETH.approveAllowance(loansContract, '10000', tokenContractAddress)
            console.log(allowance_res)
            this.setState({ loadingBtn: false })
            toast.success('Allowance Approved', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            return
        }

        const response = await BlitsLoans.ETH.repayLoan(contractLoanId, loansContract)

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            operation: 'Payback',
            networkId: shared?.networkId,
            txHash: response.payload.transactionHash
        }

        const intervalId = setInterval(() => {
            confirmLoanOperation(params)
                .then(data => data.json())
                .then((res) => {
                    console.log(res)
                    if (res.status === 'OK') {
                        toast.success('Loan Repaid', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
                        clearInterval(intervalId)
                        return
                    }
                }).catch((e) => console.log(e))
        }, 5000)
    }

    handleAcceptRepaymentBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, protocolContracts, shared } = this.props
        const { contractLoanId } = loanDetails
        const loansContract = protocolContracts[shared?.networkId].CrosschainLoans.address

        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        const account = (await ETH.getAccount()).payload
        const accountLoans = (await BlitsLoans.ETH.getAccountLoans(account, loansContract))
        console.log(accountLoans)
        let userLoansCount = 0
        for (let l of accountLoans) {
            userLoansCount++
            if (l == contractLoanId) break;
        }
        console.log(userLoansCount)

        // Generate secretHash        
        const message = `You are signing this message to generate secrets for the Hash Time Locked Contracts required to create the loan. Lender Nonce: ${userLoansCount}. Loans Contract: ${loansContract}`
        const signResponse = await ETH.generateSecret(message)

        if (signResponse.status !== 'OK') {
            toast.error(signResponse.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const { secret, secretHash } = signResponse.payload
        const secretB1 = `0x${secret}`
        const secretHashB1 = secretHash

        const response = await BlitsLoans.ETH.acceptRepayment(contractLoanId, secretB1, loansContract)

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            operation: 'LoanRepaymentAccepted',
            networkId: shared?.networkId,
            txHash: response.payload.transactionHash
        }

        const intervalId = setInterval(() => {
            confirmLoanOperation(params)
                .then(data => data.json())
                .then((res) => {
                    console.log(res)
                    if (res.status === 'OK') {
                        toast.success('Loan Payback Accepted', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
                        clearInterval(intervalId)
                        return
                    }
                }).catch((e) => console.log(e))
        }, 5000)
    }

    handleUnlockCollateralBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, protocolContracts, shared } = this.props
        const { collateralLock, secretB1 } = loanDetails
        const collateralLockContract = protocolContracts[shared?.networkId].CollateralLockV2.address
        const { contractLoanId } = collateralLock

        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        const response = await BlitsLoans.ETH.unlockCollateral(
            contractLoanId,
            secretB1,
            collateralLockContract,
        )

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            operation: 'UnlockAndClose',
            networkId: shared?.networkId,
            txHash: response.payload.transactionHash
        }

        const intervalId = setInterval(() => {
            confirmCollateralLockOperation(params)
                .then(data => data.json())
                .then((res) => {
                    console.log(res)
                    if (res.status === 'OK') {
                        toast.success('Collateral Unlocked', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
                        clearInterval(intervalId)
                        this.setState({ loadingBtn: false })
                        return
                    }
                }).catch((e) => console.log(e))
        }, 5000)
    }

    handleSeizeCollateralBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, protocolContracts, shared } = this.props
        const { collateralLock, secretA1 } = loanDetails
        const collateralLockContract = protocolContracts[shared?.networkId].CollateralLockV2.address
        const { contractLoanId } = collateralLock

        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        const response = await BlitsLoans.ETH.seizeCollateral(
            contractLoanId,
            secretA1,
            collateralLockContract,
        )

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            operation: 'SeizeCollateral',
            networkId: shared?.networkId,
            txHash: response.payload.transactionHash,
        }

        const intervalId = setInterval(() => {
            confirmCollateralLockOperation(params)
                .then(data => data.json())
                .then((res) => {
                    console.log(res)
                    if (res.status === 'OK') {
                        toast.success('Collateral Seized', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
                        clearInterval(intervalId)
                        this.setState({ loadingBtn: false })
                        return
                    }
                }).catch((e) => console.log(e))
        }, 5000)
    }

    handleRefundRepaymentBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, protocolContracts, shared } = this.props
        const { contractLoanId } = loanDetails
        const loansContract = protocolContracts[shared?.networkId].CrosschainLoans.address

        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        const response = await BlitsLoans.ETH.refundPayback(contractLoanId, loansContract)

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            operation: 'RefundPayback',
            networkId: shared?.networkId,
            txHash: response.payload.transactionHash
        }

        const intervalId = setInterval(() => {
            confirmLoanOperation(params)
                .then(data => data.json())
                .then((res) => {
                    console.log(res)
                    if (res.status === 'OK') {
                        toast.success('Payback Refunded', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
                        clearInterval(intervalId)
                        return
                    }
                }).catch((e) => console.log(e))
        }, 5000)
    }

    checkLoanStatus = async (loanId) => {

        if (!loanId) return
        const self = this

        this.intervalId = setInterval(() => {
            getLoanDetails({ loanId })
                .then(data => data.json())
                .then((res) => {
                    const { loanDetails, dispatch } = self.props
                    const { status, collateralLock } = loanDetails
                    console.log('Loan Status: ', res.payload.status)
                    if (res.status === 'OK') {
                        if (status != res.payload.status ||
                            collateralLock.status != res.payload.collateralLock.status
                        ) {
                            console.log(res)

                            // if (res.payload.collateralLock.status == 0 && res.payload.status == 1 && providers.ethereum === 'testnet') {
                            //     this.setState({ loadingMsg: 'Awaiting Loan Approval' })
                            //     dispatch(saveLoanDetails(res.payload))
                            //     return
                            // }

                            this.setState({ loadingBtn: false })
                            dispatch(saveLoanDetails(res.payload))
                        }
                    }
                })
        }, 2000)
    }

    handleBackBtn = (e) => {
        e.preventDefault()
        this.props.history.push('/lend/new')
    }

    componentDidUpdate = () => {
        const { loadingBtn } = this.state
        if (loadingBtn) {
            window.onbeforeunload = () => true
        } else {
            window.onbeforeunload = undefined
        }
    }

    toggleEmailModal = (value) => this.setState({ showEmailModal: value })
    toggleCollateralModal = (value) => this.setState({ showCollateralModal: value })

    render() {

        const { loanDetails, prices, shared } = this.props
        const {
            loanId, loading, loadingBtn, loadingMsg, showEmailModal,
            showCollateralModal
        } = this.state

        if (loading) {
            return <Loading />
        }

        const {
            tokenSymbol, principal, interest, loanExpiration, acceptExpiration,
            status, lender, borrower, blockchainLoanId, collateralLock, aCoinLenderAddress,
            networkId
        } = loanDetails

        const collateralPrice = BigNumber(prices[shared?.collateral_asset].usd)
        const requiredCollateral = parseFloat(BigNumber(principal).div(collateralPrice).times(1.5))
        const requiredCollateralValue = parseFloat(BigNumber(requiredCollateral).times(collateralPrice)).toFixed(2)
        const repaymentAmount = parseFloat(BigNumber(principal).plus(interest)).toFixed(8)
        const apr = parseFloat(BigNumber(interest).times(100).div(principal).times(12)).toFixed(2)
        const loanStatus = status == 1 ? 'Funded' : status == 1.5 ? 'Awating Approval' : status == 2 ? 'Approved' : status == 3 ? 'Withdrawn' : status == 4 ? 'Repaid' : status == 5 ? 'Payback Refunded' : status == 6 ? 'Closed' : status == 7 ? 'Canceled' : ''
        const collateralStatus = collateralLock && 'status' in collateralLock && collateralLock.status == 0 ? 'Locked' : collateralLock.status == 1 ? 'Seized' : 'Unlocked'

        return (
            <Fragment>
                {/* <MyParticles /> */}
                <div className="main">
                    <Navbar />
                    <section className="section app-section" style={{ marginTop: '12rem' }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-md-8 offset-md-2">
                                    <div className="mb-4 text-center">
                                        <div className="loanBook__apr mb-4">Network: {NETWORKS[networkId]}</div>
                                        <h2>Loan Details ID #{loanId}</h2>

                                    </div>
                                    <div className="app-card shadow-lg">
                                        <div className="row">
                                            <div className="col-sm-12 col-md-4">
                                                <div className="label-title">Borrow (Principal)</div>
                                                <div className="label-value">{principal} {tokenSymbol} <span style={{ fontSize: 12 }}>{NETWORKS[networkId]}</span></div>
                                                <div className="label-title mt-4">Interest</div>
                                                <div className="label-value">{parseFloat(interest).toFixed(2)} {tokenSymbol}</div>
                                                <div className="label-title mt-4">Repay</div>
                                                <div className="label-value">{parseFloat(repaymentAmount).toFixed(2)} {tokenSymbol}</div>
                                                <div className="label-title mt-4">Loan Expiration</div>
                                                <div style={loanExpiration && loanExpiration != 0 ? { fontSize: 14 } : {}} className="label-value">{loanExpiration && loanExpiration != 0 ? `${moment.unix(loanExpiration).format('MMMM Do YYYY, h:mm:ss a')} UTC` : '30 days'}</div>
                                            </div>
                                            <div className="col-sm-12 col-md-4">
                                                <div className="label-title">APR</div>
                                                <div className="label-value">{apr}%</div>
                                                <div className="label-title mt-4">Required Collateral</div>
                                                <div className="label-value">{requiredCollateral.toFixed(8)} {shared?.collateral_asset}</div>
                                                <div className="label-title mt-4">Collateral Value</div>
                                                <div className="label-value">${requiredCollateralValue}</div>
                                                <div className="label-title mt-4">Coll. Ratio</div>
                                                <div className="label-value">150%</div>
                                            </div>
                                            <div className="col-sm-12 col-md-4">
                                                <div className="label-title">Loan Status</div>
                                                <div className="label-value" style={{ color: '#32ccdd' }}>{loanStatus}</div>
                                                <div className="label-title mt-4">Collateral Status</div>
                                                <div className="label-value" style={{ color: '#32ccdd' }}><span style={{}}>{collateralStatus === 'Locked' ? parseFloat(loanDetails?.collateralLock?.collateral)?.toFixed(8) : ''} {loanDetails?.collateralLock?.blockchain}</span>  {collateralStatus} </div>
                                                <div className="label-title mt-4">Lender</div>
                                                <div className="label-value">
                                                    <a target='_blank' href={'https://etherscan.com/address/' + lender}>{lender.substring(0, 4)}...{lender.substr(lender.length - 4)}</a>
                                                </div>
                                                <div className="label-title mt-4">Borrower</div>
                                                <div className="label-value">
                                                    <a target='_blank' href={'https://etherscan.com/address/' + borrower}>{borrower.substring(0, 4)}...{borrower.substr(borrower.length - 4)}</a>
                                                </div>
                                            </div>
                                        </div>



                                        <div className="row mt-4">
                                            <div className="col-sm-12 col-md-8 offset-md-2 text-center">

                                                {
                                                    MAINNET_NETWORKS.includes(networkId?.toString()) != MAINNET_NETWORKS.includes(shared?.networkId?.toString())
                                                    &&
                                                    <div className="error_msg">
                                                        This Loan is located in a {MAINNET_NETWORKS.includes(networkId?.toString()) ? 'mainnet' : 'testnet'} and you are connected to a {MAINNET_NETWORKS.includes(networkId?.toString()) ? 'testnet' : 'mainnet'} or an unsupported network. Please connect to a network compatible with {NETWORKS[networkId]}.
                                                    </div>
                                                }

                                                {
                                                    loadingBtn && (
                                                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                                            <div style={{ color: '#32CCDD', fontWeight: 'bold', textAlign: 'center' }}>{loadingMsg}</div>
                                                            <ReactLoading className="loading-icon" type={'cubes'} color="#32CCDD" height={40} width={60} />
                                                        </div>
                                                    )
                                                }

                                                {
                                                    (status == 1 && !loadingBtn) && (
                                                        <button disabled={MAINNET_NETWORKS.includes(networkId?.toString()) != MAINNET_NETWORKS.includes(shared?.networkId?.toString()) ? true : false} onClick={() => this.toggleCollateralModal(true)} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            {/* <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/one_logo.png'} alt="" /> */}
                                                            Lock Collateral
                                                        </button>
                                                    )
                                                }

                                                {
                                                    (status == 2 && !loadingBtn && shared?.account?.toUpperCase() == borrower?.toUpperCase()) && (
                                                        <button onClick={this.handleWithdrawBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/metamask_logo.png'} alt="" />
                                                            Withdraw Principal
                                                        </button>
                                                    )
                                                }

                                                {
                                                    (status == 3 && !loadingBtn) && (
                                                        <button onClick={this.handleRepayBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/metamask_logo.png'} alt="" />
                                                            Repay Loan
                                                        </button>
                                                    )
                                                }

                                                {
                                                    (
                                                        status == 4 &&
                                                        !loadingBtn &&
                                                        shared?.account?.toUpperCase() == lender?.toUpperCase() &&
                                                        parseInt(acceptExpiration) > Math.floor(Date.now() / 1000)
                                                    ) && (
                                                        <button onClick={this.handleAcceptRepaymentBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/metamask_logo.png'} alt="" />
                                                            Accept Repayment
                                                        </button>
                                                    )
                                                }

                                                {
                                                    (
                                                        status == 4 &&
                                                        !loadingBtn &&
                                                        shared?.account?.toUpperCase() == lender?.toUpperCase() &&
                                                        parseInt(acceptExpiration) < Math.floor(Date.now() / 1000)
                                                    ) && (
                                                        <button onClick={this.handleRefundRepaymentBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/metamask_logo.png'} alt="" />
                                                            Refund Payback
                                                        </button>
                                                    )
                                                }

                                                {
                                                    (status == 4 && !loadingBtn && shared?.account?.toUpperCase() != lender?.toUpperCase()) && (
                                                        <div className="text-left mt-2 mb-4" style={{ color: 'black' }}>
                                                            Awaiting for the Lender to accept the payback. Once it's accepted you'll be able to unlock your collateral.
                                                            If the payback is not accepted before the expiration, then you'll be able to refund your payback and unlock your refundable collateral.
                                                        </div>
                                                    )
                                                }

                                                {
                                                    ((status == 6 || status == 7) && !loadingBtn && collateralStatus === 'Locked' && shared?.account?.toUpperCase() == collateralLock.borrower?.toUpperCase()) && (
                                                        <button onClick={this.handleUnlockCollateralBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/one_logo.png'} alt="" />
                                                            Unlock Collateral
                                                        </button>
                                                    )
                                                }

                                                {
                                                    (
                                                        !loadingBtn &&
                                                        'loanExpiration' in collateralLock && parseInt(collateralLock.loanExpiration) < Math.floor(Date.now() / 1000) &&
                                                        (
                                                            shared?.account?.toUpperCase() == collateralLock.borrower?.toUpperCase() ||
                                                            shared?.account?.toUpperCase() == collateralLock.lender?.toUpperCase()
                                                        ) &&
                                                        collateralStatus === 'Locked' &&
                                                        parseInt(status) >= 3
                                                    ) && (
                                                        <button onClick={this.handleSeizeCollateralBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/one_logo.png'} alt="" />
                                                            Seize Collateral
                                                        </button>
                                                    )
                                                }

                                                {
                                                    (
                                                        (status == 1 || status == 1.5) && collateralStatus === 'Locked' && !loadingBtn && shared?.account?.toUpperCase() == lender?.toUpperCase()
                                                    ) && (
                                                        <button onClick={this.handleApproveBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/metamask_logo.png'} alt="" />
                                                            Approve Loan
                                                        </button>
                                                    )
                                                }

                                                {
                                                    (
                                                        (status == 1 || status == 1.5) && collateralStatus === 'Locked' && !loadingBtn && shared?.account.toUpperCase() != lender?.toUpperCase()
                                                    ) && (
                                                        <div className="text-left mt-2 mb-4" style={{ color: 'black' }}>
                                                            Please wait while the lender approves the loan. We will notify you once it is approved. You are one step away from withdrawing the loan's principal.
                                                        </div>
                                                    )
                                                }

                                                {
                                                    (
                                                        (status == 1 || status == 1.5) && collateralStatus === 'Locked' && !loadingBtn && shared?.account.toUpperCase() == lender?.toUpperCase()
                                                    ) && (
                                                        <div className="text-left mt-4 mb-4" style={{ color: 'black' }}>
                                                            Approve the loan if the Borrower Locked enough Collateral. We will notify him once it is approved so he can withdraw the principal.
                                                        </div>
                                                    )
                                                }

                                                {
                                                    (
                                                        status == 1 && !loadingBtn && shared?.account?.toUpperCase() == lender?.toUpperCase()
                                                    ) && (
                                                        <button onClick={this.handleCancelBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/metamask_logo.png'} alt="" />
                                                            Cancel Loan
                                                        </button>
                                                    )
                                                }

                                                {
                                                    !('email' in shared) || shared.email === undefined || shared.email === '' && (
                                                        <button onClick={() => this.toggleEmailModal(true)} className="btn btn-primary mt-4" style={{ width: '100%' }}>
                                                            Receive Email Notifications
                                                        </button>
                                                    )
                                                }


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="row" style={{ marginTop: '60px' }}>
                        <div className="col-sm-6 offset-sm-3 text-center">
                            <Stepper
                                steps={
                                    parseInt(acceptExpiration) < Math.floor(Date.now() / 1000) && status == 4
                                        ?
                                        [
                                            { title: 'Funded' },
                                            { title: 'Lock Collateral' },
                                            { title: 'Approve Loan' },
                                            { title: 'Withdraw Principal' },
                                            { title: 'Repay Loan' },
                                            { title: 'Redund Payback' },
                                            { title: 'Seize Collateral' }
                                        ]
                                        :
                                        parseInt(loanExpiration) < Math.floor(Date.now() / 1000) && status == 3
                                            ?
                                            [
                                                { title: 'Funded' },
                                                { title: 'Lock Collateral' },
                                                { title: 'Approve Loan' },
                                                { title: 'Withdraw Principal' },
                                                { title: 'Seize Collateral' },
                                            ]
                                            :
                                            [
                                                { title: 'Funded' },
                                                { title: 'Lock Collateral' },
                                                { title: 'Approve Loan' },
                                                { title: 'Withdraw Principal' },
                                                { title: 'Repay Loan' },
                                                { title: 'Repayment Accepted' },
                                            ]
                                }
                                activeStep={status >= 2 ? parseInt(status) + 1 : parseInt(status)}
                                completeBarColor="#32CCDD"

                                completeColor={shared?.theme === 'dark' || !shared?.theme ? 'grey' : "#32CCDD"}
                                defaultColor={shared?.theme === 'dark' || !shared?.theme ? 'white' : "#E0E0E0"}
                                activeColor={shared?.theme === 'dark' || !shared?.theme ? '#32CCDD' : "black"}
                                completeTitleColor={shared?.theme === 'dark' || !shared?.theme ? 'white' : '#000'}

                                activeTitleColor={shared?.theme === 'dark' || !shared?.theme ? '#32CCDD' : "black"}
                                defaultTitleColor={shared?.theme === 'dark' || !shared?.theme ? 'white' : "#757575"}
                                circleFontColor={shared?.theme === 'dark' || !shared?.theme ? 'black' : "#FFF"}
                            />
                        </div>
                    </div>
                </div>
                {
                    showEmailModal && <EmailModal isOpen={showEmailModal} toggleModal={this.toggleEmailModal} />
                }

                {
                    showCollateralModal &&
                    <CollateralModal
                        isOpen={showCollateralModal}
                        toggleModal={this.toggleCollateralModal}
                        lockCollateral={this.handleLockCollateralBtn}
                    />
                }

                <Prompt
                    when={loadingBtn}
                    message='You have a pending transaction, are you sure you want to leave?'
                />
            </Fragment>
        )
    }
}


function mapStateToProps({ loanDetails, prices, loanSettings, protocolContracts, shared }, ownProps) {

    const loanId = ownProps.match.params.loanId

    return {
        loanDetails: loanDetails[loanId],
        prices,
        loanSettings,
        protocolContracts,
        shared
    }
}

export default connect(mapStateToProps)(LoanDetails)