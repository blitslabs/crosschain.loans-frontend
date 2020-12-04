import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import Navbar from './Navbar'
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
// Styles
import '../styles.css'

// Libraries
import Web3 from 'web3'
import { sha256 } from '@liquality-dev/crypto'
import ReactLoading from 'react-loading'
import BigNumber from 'bignumber.js'
import { toast } from 'react-toastify'
import BlitsLoans from '../../../crypto/BlitsLoans'
import ETH from '../../../crypto/ETH'
import MyParticles from './MyParticles'


class LoanTerms extends Component {
    state = {
        interestAmount: 0,
        repaymentAmount: 0,
        collateralAmount: 0,
        liquidationPrice: 0,
        assets: [],
        abi: '',
        signed: false,
        contracts: '',
        loading: true,
        showAllowanceBtn: false
    }

    componentDidMount = async () => {
        document.title = '🚀 Confirm Loan | Cross-chain Loans'
        const { lendRequest, loanSettings, history } = this.props
        const { amount, tokenContractAddress } = lendRequest
        const { eth_loans_contract } = loanSettings

        let allowanceRes = await ETH.getAllowance(eth_loans_contract, tokenContractAddress)

        if (allowanceRes.status === 'OK') {
            console.log('Allowance: ', allowanceRes)
            let allowance = BigNumber(allowanceRes.payload)
            if (allowance.lt(amount)) {
                this.setState({ showAllowanceBtn: true, loading: false })
                return
            }
        }

        this.setState({ loading: false })
    }

    handleAllowanceBtn = async (e) => {
        e.preventDefault()
        const { loanSettings, lendRequest } = this.props
        const { eth_loans_contract } = loanSettings
        const { amount, tokenContractAddress } = lendRequest

        this.setState({ loading: true, btnLoading: true })
        const response = await ETH.approveAllowance(eth_loans_contract, '1000000000', tokenContractAddress)
        console.log(response)

        let allowanceInterval = setInterval(async () => {

            let allowanceRes = await ETH.getAllowance(eth_loans_contract, tokenContractAddress)

            if (allowanceRes.status === 'OK') {
                console.log('Allowance: ', allowanceRes)
                let allowance = BigNumber(allowanceRes.payload)
                if (allowance.gte(amount)) {
                    clearInterval(allowanceInterval)
                    this.setState({ showAllowanceBtn: false, loading: false, btnLoading: false })
                    return
                }
            }

        }, 1000)
    }

    handleCreateLoanBtn = async (e) => {
        e.preventDefault()

        const { lendRequest, loanSettings, dispatch, history } = this.props
        const {
            secretHash, amount, tokenContractAddress, aCoinLender
        } = lendRequest
        const { eth_public_key, eth_loans_contract, autolender_secret_hash } = loanSettings

        this.setState({ loading: true, btnLoading: true })

        const response = await BlitsLoans.ETH.createLoan(
            eth_public_key,
            secretHash,
            autolender_secret_hash,
            amount,
            tokenContractAddress,
            eth_loans_contract,
            aCoinLender
        )

        console.log(response)

        if (response.status !== 'OK') {
            toast.error('Missing required fields', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loading: false, btnLoading: false })
            return
        }

        toast.success('New Loan Created!', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
        this.setState({ loading: false, btnLoading: true })
        history.push('/loan_created')
    }




    handleBackBtn = (e) => {
        e.preventDefault()
        this.props.history.push('/lend')
    }

    render() {

        const { lendRequest, loanAssets, loanSettings } = this.props
        let { tokenContractAddress, amount, aCoinLender, secret, secretHash, interestRate, duration } = lendRequest
        const token = loanAssets[tokenContractAddress]
        const interest = (amount && interestRate ? parseFloat(BigNumber(amount).multipliedBy(lendRequest.interestRate)) : 0).toFixed(2)
        const apy = parseFloat(BigNumber(lendRequest.interestRate).multipliedBy(1200)).toFixed(2)
        const repaymentAmount = parseFloat(BigNumber(amount).plus(interest)).toFixed(2)

        return (
            <Fragment>
                <MyParticles />
                <div className="main">
                    <Navbar />
                    <section className="section app-section" style={{marginTop: '12rem'}}>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-md-8 offset-md-2">
                                    <div className="mb-4 text-center">
                                        <h2>Confirm Loan</h2>
                                        <div className="app-page-subtitle mt-2">You are about to create a loan with the following details</div>
                                    </div>
                                    <div className="app-card shadow-lg">
                                        <div className="row">
                                            <div className="col-sm-12 col-md-6">
                                                <div className="label-title">Loan Principal</div>
                                                <div className="label-value">{amount} {token.symbol}</div>
                                                <div className="label-title mt-4">Interest</div>
                                                <div className="label-value">{interest} {token.symbol}</div>
                                                <div className="label-title mt-4">Total Repayment Amount</div>
                                                <div className="label-value">{repaymentAmount} {token.symbol}</div>
                                                <div className="label-title mt-4">Duration</div>
                                                <div className="label-value">{duration} Days</div>
                                            </div>
                                            <div className="col-sm-12 col-md-6">
                                                <div className="label-title">Asset / Blockchain / Network</div>
                                                <div className="label-value">{token.symbol} / {token.blockchain} / {token.network}</div>
                                                <div className="label-title mt-4">APY</div>
                                                <div className="label-value">{apy}%</div>
                                                <div className="label-title mt-4">Collateralization Ratio</div>
                                                <div className="label-value">150%</div>
                                                <div className="label-title mt-4">Secret Hash</div>
                                                <div className="label-value">{lendRequest.secretHash.substring(0, 20)}...</div>
                                            </div>
                                        </div>

                                        <div className="row mt-4">
                                            <div className="col-sm-12 col-md-5 offset-md-1">
                                                <button onClick={this.handleBackBtn} className="btn btn-blits-white mt-4" style={{ width: '100%' }}>Back</button>
                                            </div>
                                            <div className="col-sm-12 col-md-5">
                                                {
                                                    !this.state.loading
                                                        ?
                                                        this.state.showAllowanceBtn
                                                            ?

                                                            <button onClick={this.handleAllowanceBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                                <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/metamask_logo.png'} alt="" />
                                                                Approve Allowance
                                                            </button>

                                                            :

                                                            <button onClick={this.handleCreateLoanBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                                <img className="metamask-btn-img" src={process.env.SERVER_HOST + '/assets/images/metamask_logo.png'} alt="" />
                                                                Lend
                                                            </button>

                                                        :
                                                        <div style={{ marginTop: '15px', }}>
                                                            <div style={{ color: '#32CCDD', fontWeight: 'bold', textAlign: 'justify' }}>Waiting for TX to confirm. Please be patient, Ethereum can be slow sometimes :)</div>
                                                            <ReactLoading type={'cubes'} color="#32CCDD" height={40} width={60} />
                                                        </div>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </Fragment >
        )
    }
}


function mapStateToProps({ lendRequest, loanAssets, loanSettings }) {
    return {
        lendRequest,
        loanAssets,
        loanSettings
    }
}

export default connect(mapStateToProps)(LoanTerms)