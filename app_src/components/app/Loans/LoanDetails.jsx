import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import Navbar from './Navbar'
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import Loading from '../../Loading'

// Styles
import '../styles.css'

// Libraries
import Web3 from 'web3'
import { sha256 } from '@liquality-dev/crypto'
import moment from 'moment'
import { Harmony, HarmonyExtension } from '@harmony-js/core'
import { ChainID, ChainType } from '@harmony-js/utils'
import ReactLoading from 'react-loading'
import BigNumber from 'bignumber.js'
import { toast } from 'react-toastify'
import Stepper from 'react-stepper-horizontal'
import BlitsLoans from '../../../crypto/BlitsLoans'
import ETH from '../../../crypto/ETH'
import ONE from '../../../crypto/ONE'
import ParticleEffectButton from 'react-particle-effect-button'
import MyParticles from './MyParticles'
import ABI from '../../../crypto/ABI'
import { fromBech32 } from '@harmony-js/crypto'

// API
import {
    getLoanDetails, getNewEngineSecretHash,
    getAccountLoansCount, getLoanNonce,
    confirmLoanOperation,
    confirmCollateralLockOperation
} from '../../../utils/api'

// Actions
import { saveLoanDetails } from '../../../actions/loanDetails'
import { saveLoanSettings } from '../../../actions/loanSettings'


class LoanDetails extends Component {

    intervalId = 0

    state = {
        loading: true,
        loadingBtn: false,
        loanId: '',
        loadingMsg: 'Awaiting Confirmation'
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

                // Get ETH Account
                let eth_account
                try {
                    eth_account = await ETH.getAccount()
                    eth_account = eth_account.payload
                } catch (e) {
                    console.log(e)
                }

                // Get ONE Account
                let one_account
                try {
                    one_account = await ONE.getAccount()
                    one_account = fromBech32(one_account.payload.address)

                } catch (e) {
                    console.log(e)
                    one_account = ''
                }

                this.setState({
                    loanId,
                    loading: false,
                    eth_account,
                    one_account,
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
    handleLockCollateralBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, prices, protocolContracts, providers } = this.props
        const {
            aCoinLenderAddress, secretHashB1, principal, contractLoanId, loansContractAddress
        } = loanDetails

        const collateralLockContract = protocolContracts[providers.ethereum].CollateralLockV2_ONE.address
        const requiredCollateral = parseFloat(BigNumber(principal).div(prices.ONE.usd).times(1.5)).toFixed(2)

        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        const bCoinBorrowerAddress = (await ETH.getAccount()).payload
        const loansContract = protocolContracts[providers.ethereum].CrosschainLoans.address

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

        response = await BlitsLoans.ONE.lockCollateral(
            requiredCollateral,
            aCoinLenderAddress,
            secretHash,
            secretHashB1,
            collateralLockContract,
            bCoinBorrowerAddress,
            contractLoanId,
            loansContractAddress,
            '0', // shard
            providers.ethereum === 'mainnet' ? 'mainnet' : 'testnet'
        )

        console.log(response)

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            network: providers.ethereum,
            txHash: response.payload,
            blockchain: 'ONE',
            operation: 'LockCollateral'
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
        const { loanDetails, protocolContracts, providers } = this.props
        const { contractLoanId } = loanDetails
        const loansContract = protocolContracts[providers.ethereum].CrosschainLoans.address

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
            network: providers.ethereum,
            blockchain: 'ETH',
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

    handleWithdrawBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, protocolContracts, providers } = this.props
        const { contractLoanId } = loanDetails
        const loansContract = protocolContracts[providers.ethereum].CrosschainLoans.address
        const collateralLockContract = protocolContracts[providers.ethereum].CollateralLockV2_ONE.address

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
            network: providers.ethereum,
            blockchain: 'ETH',
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
        const { loanDetails, protocolContracts, providers } = this.props
        const { contractLoanId } = loanDetails
        const loansContract = protocolContracts[providers.ethereum].CrosschainLoans.address

        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        const response = await BlitsLoans.ETH.repayLoan(contractLoanId, loansContract)

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            network: providers.ethereum,
            blockchain: 'ETH',
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
        const { loanDetails, protocolContracts, providers } = this.props
        const { contractLoanId } = loanDetails
        const loansContract = protocolContracts[providers.ethereum].CrosschainLoans.address

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
            network: providers.ethereum,
            blockchain: 'ETH',
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
        const { loanDetails, protocolContracts, providers } = this.props
        const { collateralLock, secretB1 } = loanDetails
        const collateralLockContract = protocolContracts[providers.ethereum].CollateralLockV2_ONE.address
        const { contractLoanId } = collateralLock

        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        const response = await BlitsLoans.ONE.unlockCollateral(
            contractLoanId,
            secretB1,
            collateralLockContract,
            '0',
            providers.ethereum === 'mainnet' ? 'mainnet' : 'testnet'
        )

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            network: providers.ethereum,
            txHash: response.payload,
            blockchain: 'ONE',
            operation: 'UnlockAndClose'
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
        const { loanDetails, protocolContracts, providers } = this.props
        const { collateralLock, secretA1 } = loanDetails
        const collateralLockContract = protocolContracts[providers.ethereum].CollateralLockV2_ONE.address
        const { contractLoanId } = collateralLock

        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        const response = await BlitsLoans.ONE.seizeCollateral(
            contractLoanId,
            secretA1,
            collateralLockContract,
            '0',
            providers.ethereum === 'mainnet' ? 'mainnet' : 'testnet'
        )

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            network: providers.ethereum,
            txHash: response.payload,
            blockchain: 'ONE',
            operation: 'SeizeCollateral'
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
        const { loanDetails, protocolContracts, providers } = this.props
        const { contractLoanId } = loanDetails
        const loansContract = protocolContracts[providers.ethereum].CrosschainLoans.address

        this.setState({ loadingBtn: true, loadingMsg: 'Awaiting Confirmation' })

        const response = await BlitsLoans.ETH.refundPayback(contractLoanId, loansContract)

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const params = {
            network: providers.ethereum,
            blockchain: 'ETH',
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

                            if (res.payload.collateralLock.status == 0 && res.payload.status == 1) {
                                this.setState({ loadingMsg: 'Awaiting Loan Approval' })
                                dispatch(saveLoanDetails(res.payload))
                                return
                            }

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

    render() {

        const { loanDetails, prices } = this.props
        const { loanId, loading, loadingBtn, eth_account, one_account, loadingMsg } = this.state

        if (loading) {
            return <Loading />
        }

        const {
            tokenSymbol, principal, interest, loanExpiration, acceptExpiration,
            status, lender, borrower, blockchainLoanId, collateralLock, aCoinLenderAddress
        } = loanDetails

        const collateralPrice = BigNumber(prices.ONE.usd)
        const requiredCollateral = parseFloat(BigNumber(principal).div(collateralPrice).times(1.5)).toFixed(2)
        const requiredCollateralValue = parseFloat(BigNumber(requiredCollateral).times(collateralPrice)).toFixed(2)
        const repaymentAmount = parseFloat(BigNumber(principal).plus(interest)).toFixed(8)
        const apr = parseFloat(BigNumber(interest).times(100).div(principal).times(12)).toFixed(2)
        const loanStatus = status == 1 ? 'Funded' : status == 2 ? 'Approved' : status == 3 ? 'Withdrawn' : status == 4 ? 'Repaid' : status == 5 ? 'Payback Refunded' : status == 6 ? 'Closed' : status == 7 ? 'Canceled' : ''
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
                                        <h2>Loan Details ID #{loanId}</h2>
                                        {/* <div className="app-page-subtitle mt-2">ID #{loanId}</div> */}
                                    </div>
                                    <div className="app-card shadow-lg">
                                        <div className="row">
                                            <div className="col-sm-12 col-md-4">
                                                <div className="label-title">Borrow (Principal)</div>
                                                <div className="label-value">{principal} {tokenSymbol}</div>
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
                                                <div className="label-value">{requiredCollateral} ONE</div>
                                                <div className="label-title mt-4">Collateral Value</div>
                                                <div className="label-value">${requiredCollateralValue}</div>
                                                <div className="label-title mt-4">Coll. Ratio</div>
                                                <div className="label-value">150%</div>
                                            </div>
                                            <div className="col-sm-12 col-md-4">
                                                <div className="label-title">Loan Status</div>
                                                <div className="label-value" style={{ color: '#32ccdd' }}>{loanStatus}</div>
                                                <div className="label-title mt-4">Collateral Status</div>
                                                <div className="label-value" style={{ color: '#32ccdd' }}>{collateralStatus}</div>
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
                                                    loadingBtn && (
                                                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                                            <div style={{ color: '#32CCDD', fontWeight: 'bold', textAlign: 'center' }}>{loadingMsg}</div>
                                                            <ReactLoading className="loading-icon" type={'cubes'} color="#32CCDD" height={40} width={60} />
                                                        </div>
                                                    )
                                                }

                                                {
                                                    (status == 1 && !loadingBtn) && (
                                                        <button onClick={this.handleLockCollateralBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/one_logo.png'} alt="" />
                                                            Lock Collateral
                                                        </button>
                                                    )
                                                }

                                                {
                                                    (status == 2 && !loadingBtn) && (
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
                                                        eth_account.toUpperCase() == lender.toUpperCase() &&
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
                                                        eth_account.toUpperCase() == lender.toUpperCase() &&
                                                        parseInt(acceptExpiration) < Math.floor(Date.now() / 1000)
                                                    ) && (
                                                        <button onClick={this.handleRefundRepaymentBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/metamask_logo.png'} alt="" />
                                                            Refund Payback
                                                        </button>
                                                    )
                                                }

                                                {
                                                    (status == 4 && !loadingBtn && eth_account.toUpperCase() != lender.toUpperCase()) && (
                                                        <div className="text-left mt-2 mb-4" style={{ color: 'black' }}>
                                                            Awaiting for Lender to accept repayment. Once it's accepted you'll be able to unlock your collateral.
                                                            If the repayment is not accepted before the expiration, then you'll be able to refund your repayment and unlock your refundable collateral.
                                                        </div>
                                                    )
                                                }

                                                {
                                                    (status == 6 && !loadingBtn && collateralStatus === 'Locked' && one_account.toUpperCase() == collateralLock.borrower.toUpperCase()) && (
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
                                                            one_account.toUpperCase() == collateralLock.borrower.toUpperCase() ||
                                                            one_account.toUpperCase() == collateralLock.lender.toUpperCase()
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
                                                        status == 1 && !loadingBtn && eth_account.toUpperCase() == lender.toUpperCase()
                                                    ) && (
                                                        <button onClick={this.handleCancelBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/metamask_logo.png'} alt="" />
                                                            Cancel Loan
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
                                                { title: 'Withdraw Principal' },
                                                { title: 'Seize Collateral' },
                                            ]
                                            :
                                            [
                                                { title: 'Funded' },
                                                { title: 'Lock Collateral' },
                                                { title: 'Withdraw Principal' },
                                                { title: 'Repay Loan' },
                                                { title: 'Repayment Accepted' },
                                            ]
                                }
                                activeStep={parseInt(status)}
                                completeBarColor="#32CCDD"
                                completeColor="#32CCDD"
                                activeColor="black"
                            />
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}


function mapStateToProps({ loanDetails, prices, loanSettings, providers, protocolContracts }, ownProps) {
    
    const loanId = ownProps.match.params.loanId
    
    return {
        loanDetails: loanDetails[loanId], 
        prices, 
        loanSettings, 
        providers, 
        protocolContracts,
    }
}

export default connect(mapStateToProps)(LoanDetails)