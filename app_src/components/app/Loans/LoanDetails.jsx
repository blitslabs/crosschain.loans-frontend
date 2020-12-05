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

// API
import { getLoanDetails, getLoansSettings } from '../../../utils/api'

// Actions
import { saveLoanDetails } from '../../../actions/loanDetails'
import { saveLoanSettings } from '../../../actions/loanSettings'


class LoanDetails extends Component {
    state = {
        loading: true,
        loadingBtn: false,
        loanId: '',
    }

    componentDidMount() {
        const { history, match, dispatch, loanDetails } = this.props
        const { loanId } = match.params

        console.log(loanId)

        document.title = `🦄 Loan Details #${loanId} | Cross-chain Loans`

        if (!loanId) {
            history.push('/borrow')
        }

        const network = window.ethereum.chainId === '0x1' ? mainnet : 'testnet'

        Promise.all([
            getLoansSettings({ network }),
            getLoanDetails({ loanId })
        ])
            .then((responses) => {
                return Promise.all(responses.map(res => res.json()))
            })
            .then(async (data) => {
                console.log(data)

                if (data[0].status === 'OK') {
                    dispatch(saveLoanSettings(data[0].payload))
                }

                if (data[1].status === 'OK') {
                    dispatch(saveLoanDetails(data[1].payload))
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
                    one_account = one_account.payload.address
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


    /**
     * @dev Lock Collateral
     */
    handleLockCollateralBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, prices, loanSettings } = this.props
        const {
            aCoinLenderAddress, secretHashB1, principal
        } = loanDetails
        const { one_lock_contract } = loanSettings

        const collateralPrice = BigNumber(prices.ONE.priceBTC).times(prices.BTC.priceUSD)
        const requiredCollateral = parseFloat(BigNumber(principal).div(collateralPrice).times(1.5)).toFixed(2)

        this.setState({ loadingBtn: true })

        // Generate secretHash
        const message = 'You are signing this message to generate secrets for the Hash Time Locked Contracts required to lock the collateral.'
        const signResponse = await ETH.generateSecret(message)

        if (signResponse.status !== 'OK') {
            console.log(signResponse)
            toast.error(signResponse.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const { secret, secretHash } = signResponse.payload
        const secretA1 = secret
        const secretHashA1 = secretHash

        // Get ETH account
        const ethAccountResponse = await ETH.getAccount()

        if (ethAccountResponse.status !== 'OK') {
            console.log(ethAccountResponse)
            toast.error(ethAccountResponse.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const bCoinBorrowerAddress = ethAccountResponse.payload

        const response = await BlitsLoans.ONE.lockCollateral(
            //requiredCollateral,
            '100', // testnet - change in production
            aCoinLenderAddress,
            secretHashA1,
            secretHashB1,
            one_lock_contract,
            bCoinBorrowerAddress,
            '0', // shard
            'testnet' // change in production
        )

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        toast.success('Collateral Locked', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
    }

    handleWithdrawBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, loanSettings } = this.props
        const { blockchainLoanId } = loanDetails
        const { eth_loans_contract } = loanSettings

        this.setState({ loadingBtn: true })

        // Generate secretHash
        const message = 'You are signing this message to generate secrets for the Hash Time Locked Contracts required to lock the collateral.'
        const signResponse = await ETH.generateSecret(message)

        if (signResponse.status !== 'OK') {
            console.log(signResponse)
            toast.error(signResponse.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            return
        }

        const { secret, secretHash } = signResponse.payload
        const secretA1 = `0x${secret}`
        const secretHashA1 = secretHash

        const response = await BlitsLoans.ETH.withdrawPrincipal(
            blockchainLoanId,
            secretA1,
            eth_loans_contract
        )

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        toast.success('Principal Withdrawn', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
    }

    handleRepayBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, loanSettings } = this.props
        const { blockchainLoanId } = loanDetails
        const { eth_loans_contract } = loanSettings

        this.setState({ loadingBtn: true })

        const response = await BlitsLoans.ETH.repayLoan(blockchainLoanId, eth_loans_contract)

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        toast.success('Loan Repaid', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
    }

    handleAcceptRepaymentBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, loanSettings } = this.props
        const { blockchainLoanId } = loanDetails
        const { eth_loans_contract } = loanSettings

        this.setState({ loadingBtn: true })

        // Generate secretHash        
        const message = 'You are signing this message to generate secrets for the Hash Time Locked Contracts required to create the loan.'
        const signResponse = await ETH.generateSecret(message)

        if (signResponse.status !== 'OK') {
            toast.error(signResponse.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        const { secret, secretHash } = signResponse.payload
        const secretB1 = `0x${secret}`
        const secretHashB1 = secretHash

        const response = await BlitsLoans.ETH.acceptRepayment(blockchainLoanId, secretB1, eth_loans_contract)

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        toast.success('Loan Payback Accepted', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
    }

    handleUnlockCollateralBtn = async (e) => {
        e.preventDefault()
        const { loanDetails, loanSettings } = this.props
        const { collateralLock, secretB1 } = loanDetails
        const { one_lock_contract } = loanSettings
        const { blockchainLoanId } = collateralLock

        this.setState({ loadingBtn: true })

        const response = await BlitsLoans.ONE.unlockCollateral(
            blockchainLoanId,
            secretB1,
            one_lock_contract,
            '0',
            'testnet'
        )

        if (response.status !== 'OK') {
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loadingBtn: false })
            return
        }

        toast.success('Collateral Unlocked', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
    }

    checkLoanStatus = async (loanId) => {

        const { loanDetails, dispatch } = this.props
        const { status, collateralLock } = loanDetails

        if (!loanId || !status) return

        setInterval(() => {
            getLoanDetails({ loanId })
                .then(data => data.json())
                .then((res) => {
                    console.log('Loan Status: ', res.payload.status)
                    if (res.status === 'OK') {
                        if (status != res.payload.status) {
                            console.log(res)
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
        const { loanId, loading, loadingBtn, eth_account, one_account } = this.state

        if (loading) {
            return <Loading />
        }

        const {
            tokenSymbol, tokenName, tokenContractAddress, principal, interest, loanExpiration,
            status, lender, borrower, blockchainLoanId, collateralLock, aCoinLenderAddress
        } = loanDetails

        const collateralPrice = BigNumber(prices.ONE.priceBTC).times(prices.BTC.priceUSD)
        const requiredCollateral = parseFloat(BigNumber(principal).div(collateralPrice).times(1.5)).toFixed(2)
        const requiredCollateralValue = parseFloat(BigNumber(requiredCollateral).times(collateralPrice)).toFixed(2)
        const repaymentAmount = parseFloat(BigNumber(principal).plus(interest)).toFixed(8)
        const apr = parseFloat(BigNumber(interest).times(100).div(principal).times(12)).toFixed(2)
        const loanStatus = status == 1 ? 'Funded' : status == 2 ? 'Approved' : status == 3 ? 'Withdrawn' : status == 4 ? 'Repaid' : status == 5 ? 'Payback Refunded' : status == 6 ? 'Closed' : status == 7 ? 'Canceled' : ''
        const collateralStatus = collateralLock && 'status' in collateralLock && collateralLock.status == 0 ? 'Locked' : 'Unlocked'

        return (
            <Fragment>
                <MyParticles />
                <div className="main">
                    <Navbar />
                    <section className="section app-section" style={{ marginTop: '12rem' }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-md-8 offset-md-2">
                                    <div className="mb-4 text-center">
                                        <h2>🦄 Loan Details </h2>
                                        <div className="app-page-subtitle mt-2">ID #{loanId}</div>
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
                                                <div className="label-value">30 days</div>
                                            </div>
                                            <div className="col-sm-12 col-md-4">
                                                <div className="label-title">APR</div>
                                                <div className="label-value">{apr}%</div>
                                                <div className="label-title mt-4">Required Collateral</div>
                                                <div className="label-value">{requiredCollateral} ONE</div>
                                                <div className="label-title mt-4">Collateral Value</div>
                                                <div className="label-value">${requiredCollateralValue} USDT</div>
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
                                                            <div style={{ color: '#32CCDD', fontWeight: 'bold', textAlign: 'justify' }}>Waiting for TX to confirm. Please be patient, Ethereum can be slow sometimes :)</div>
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
                                                    (status == 4 && !loadingBtn && eth_account.toUpperCase() == lender.toUpperCase()) && (
                                                        <button onClick={this.handleAcceptRepaymentBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/metamask_logo.png'} alt="" />
                                                            Accept Repayment
                                                        </button>
                                                    )
                                                }

                                                {
                                                    (status == 4 && !loadingBtn && eth_account.toUpperCase() != lender.toUpperCase()) && (
                                                        <div className="text-left mt-2 mb-4" style={{ color: 'black' }}>
                                                            Waiting for Lender to accept repayment. Once it's accepted you'll be able to unlock your collateral. 
                                                            If the repayment is not accepted before the expiration, then you'll be able to refund your repayment and unlock your refundable collateral.
                                                        </div>
                                                    )
                                                }

                                                {
                                                    (status == 6 && !loadingBtn && collateralStatus === 'LOCKED' && one_account.toUpperCase() == aCoinLenderAddress.toUpperCase()) && (
                                                        <button onClick={this.handleUnlockCollateralBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                            <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/one_logo.png'} alt="" />
                                                            Unlock Collateral
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
                                steps={[
                                    { title: 'Funded' },
                                    { title: 'Lock Collateral' },
                                    { title: 'Withdraw Principal' },
                                    { title: 'Repay Loan' },
                                    { title: 'Repayment Accepted' },
                                ]}
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


function mapStateToProps({ loanDetails, prices, loanSettings }) {
    return {
        loanDetails, prices, loanSettings
    }
}

export default connect(mapStateToProps)(LoanDetails)