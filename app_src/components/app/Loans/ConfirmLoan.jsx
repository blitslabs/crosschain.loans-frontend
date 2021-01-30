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
import { Prompt } from 'react-router'

// API
import { getNewEngineSecretHash, confirmLoanOperation } from '../../../utils/api'

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
        document.title = 'Confirm Loan | Cross-chain Loans'
        const { lendRequest, providers, protocolContracts } = this.props
        const { amount, tokenContractAddress } = lendRequest
        const loansContract = protocolContracts[providers.ethereum].CrosschainLoans.address

        let allowanceRes = await ETH.getAllowance(loansContract, tokenContractAddress)
        console.log('Allowance: ', allowanceRes)
        if (allowanceRes.status === 'OK') {
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
        const { lendRequest, providers, protocolContracts } = this.props
        const loansContract = protocolContracts[providers.ethereum].CrosschainLoans.address
        const { amount, tokenContractAddress } = lendRequest

        this.setState({ loading: true, btnLoading: true })
        const response = await ETH.approveAllowance(loansContract, '10000', tokenContractAddress)
        console.log(response)

        if (response.status === 'OK') {
            let allowanceInterval = setInterval(async () => {

                let allowanceRes = await ETH.getAllowance(loansContract, tokenContractAddress)

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
        } else {
            this.setState({ loading: false, btnLoading: false })
        }
    }

    handleCreateLoanBtn = async (e) => {
        e.preventDefault()

        const { lendRequest, protocolContracts, providers, dispatch, history } = this.props
        const loansContract = protocolContracts[providers.ethereum].CrosschainLoans.address

        const {
            secretHash, amount, tokenContractAddress, aCoinLender
        } = lendRequest

        this.setState({ loading: true, btnLoading: true })

        let arbiter
        try {
            arbiter = (await (await getNewEngineSecretHash({ blockchain: 'ETH' })).json()).payload
        } catch (e) {
            toast.error('Error fetching arbiter data', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loading: false, btnLoading: false })
            return
        }

        const response = await BlitsLoans.ETH.createLoan(
            arbiter.account,
            secretHash,
            arbiter.secretHash,
            amount,
            tokenContractAddress,
            loansContract,
            aCoinLender
        )

        console.log(response)

        if (response.status !== 'OK') {
            toast.error('Missing required fields', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ loading: false, btnLoading: false })
            return
        }

        const params = {
            blockchain: 'ETH',
            network: providers.ethereum,
            txHash: response.payload.transactionHash
        }


        const intervalId = setInterval(() => {
            confirmLoanOperation(params)
                .then(data => data.json())
                .then((res) => {
                    console.log(res)
                    if (res.status === 'OK') {
                        toast.success('New Loan Created!', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
                        this.setState({ loading: false, btnLoading: true })
                        clearInterval(intervalId)
                        history.push('/app/lend/done')
                        return
                    }
                }).catch((e) => console.log(e))
        }, 5000)
    }

    componentDidUpdate = () => {
        const { loading } = this.state
        if (loading) {
            window.onbeforeunload = () => true
        } else {
            window.onbeforeunload = undefined
        }
    }


    handleBackBtn = (e) => {
        e.preventDefault()
        this.props.history.push('/app/lend/new')
    }

    render() {

        const { lendRequest, loanAssets, assetTypes } = this.props
        const { interestRate } = assetTypes[lendRequest.tokenContractAddress]
        let { tokenContractAddress, amount, aCoinLender, secret, secretHash, duration } = lendRequest
        const token = loanAssets[tokenContractAddress]
        const interest = (amount && interestRate ? parseFloat(BigNumber(amount).multipliedBy(interestRate)) : 0).toFixed(2)
        const apy = parseFloat(BigNumber(interestRate).multipliedBy(1200)).toFixed(2)
        const repaymentAmount = parseFloat(BigNumber(amount).plus(interest)).toFixed(2)

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
                                                            <div style={{ color: '#32CCDD', fontWeight: 'bold', textAlign: 'justify' }}>Awaiting Confirmation</div>
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

                <Prompt
                    when={this.state.loading}
                    message='You have a pending transaction, are you sure you want to leave?'
                />
            </Fragment >
        )
    }
}


function mapStateToProps({ lendRequest, loanAssets, protocolContracts, providers, assetTypes }) {
    return {
        lendRequest,
        protocolContracts,
        loanAssets,
        providers,
        assetTypes
    }
}

export default connect(mapStateToProps)(LoanTerms)