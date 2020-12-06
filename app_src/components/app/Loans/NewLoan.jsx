import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import Navbar from './Navbar'
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import Loading from '../../Loading'
import DownloadModal from './DownloadModal'

// Styles
import '../styles.css'

// Actions
import { saveLendRequest } from '../../../actions/lendRequest'
import { saveLoanSettings } from '../../../actions/loanSettings'
import { saveLoanAssets } from '../../../actions/loanAssets'

// API
import {
    getLoansSettings, getLoanAssets, getAccountLoansCount
} from '../../../utils/api'

// Libraries
import ONE from '../../../crypto/ONE'
import ETH from '../../../crypto/ETH'
import BlitsLoans from '../../../crypto/BlitsLoans'
import BigNumber from 'bignumber.js'
import { toast } from 'react-toastify'
import MyParticles from './MyParticles'
import ParticleEffectButton from 'react-particle-effect-button'
import Emoji from "react-emoji-render"

class NewLoan extends Component {
    state = {
        assetSymbol: 'DAI',
        assetSymbolIsInvalid: false,
        amount: '',
        amountIsInvalid: false,
        amountErrorMsg: 'This field is required',
        collateralizationRatio: 150,
        apr: '',
        aprIsInvalid: false,
        aprErrorMsg: 'This field is required',
        duration: '',
        durationIsInvalid: false,
        durationErrorMsg: 'This field is required',
        aCoinLender: '',
        aCoinLenderIsInvalid: false,
        aCoinLenderErrorMsg: 'This field is required',
        loading: true,
        duration: '30',
        showDownloadModal: false,
        missingWallet: '',
        loansCount: ''
    }

    componentDidMount() {
        document.title = "🚀 New Loan | Cross-chain Loans"
        this.loadInitialData()
    }

    loadInitialData = async () => {
        const { dispatch } = this.props

        if (!window.ethereum) {
            this.setState({ loading: false })
            return
        }

        const network = window.ethereum.chainId === '0x1' ? 'mainnet' : 'testnet'

        let account
        try {
            account = await ETH.getAccount()
            account = account.payload
        } catch (e) {
            account = ''
        }


        Promise.all([
            getLoansSettings({ network }),
            getLoanAssets({ operation: 'LEND', network }),
            getAccountLoansCount({ account, actor: 'lender', blockchain: 'ETH' })
        ])
            .then((responses) => {
                return Promise.all(responses.map(res => res.json()))
            })
            .then((data) => {
                console.log(data)
                const loanSettings = data[0].payload
                const loanAssets = data[1].payload
                const loansCount = data[2].payload

                dispatch(saveLoanSettings(loanSettings))
                dispatch(saveLoanAssets(loanAssets))


                const dai = Object.values(loanAssets).filter((a) => a.symbol === 'DAI')[0]

                this.setState({ loading: false })
                BlitsLoans.ETH.getAssetTypeData(dai.contractAddress, loanSettings.eth_loans_contract)
                    .then((data) => {
                        console.log(data)
                        dispatch(saveLendRequest(data))
                        this.setState({
                            asset: dai.contractAddress,
                            network, amount: data.minLoanAmount,
                            loansCount
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
    }

    handleAmountChange = (e) => {
        let amount = e.target.value
        const { lendRequest } = this.props
        amount = BigNumber(amount)
        const { maxLoanAmount, minLoanAmount } = lendRequest

        if (amount.gt(maxLoanAmount) || amount.lt(minLoanAmount)) {
            this.setState({ amountIsInvalid: true, amountErrorMsg: 'Enter a valid amount' })
        } else {
            this.setState({ amountIsInvalid: false, amountErrorMsg: 'This field is required' })
        }

        this.setState({ amount: amount.toString() })
    }

    // handleCRateChange = (e) => this.setState({ collateralizationRatio: e })

    // handleAPRChange = (e) => {
    //     const apr = e.target.value
    //     if (apr < 1 || apr > 30) {
    //         this.setState({ aprIsInvalid: true, aprErrorMsg: 'Enter a valid amount' })
    //     } else {
    //         this.setState({ aprIsInvalid: false, aprErrorMsg: 'This field is required' })
    //     }

    //     this.setState({ apr })
    // }

    // handleDurationChange = (e) => {
    //     const duration = e.target.value
    //     if (duration < 1 || duration > 30) {
    //         this.setState({ durationIsInvalid: true, durationErrorMsg: 'Enter a valid amount' })
    //     } else {
    //         this.setState({ durationIsInvalid: false, durationErrorMsg: 'This field is required' })
    //     }

    //     this.setState({ duration })
    // }

    handleACoinLenderChange = (e) => {
        const aCoinLender = e.target.value
        // TO DO
        // Check if address is valid
        if (!aCoinLender || !ONE.isAddressValid(aCoinLender)) {
            this.setState({ aCoinLenderIsInvalid: true, aCoinLenderErrorMsg: 'Enter a valid address' })
        } else {
            this.setState({ aCoinLenderIsInvalid: false, aCoinLenderErrorMsg: 'This field is required' })
        }

        this.setState({ aCoinLender })
    }

    // handleInputChange = (name) => (e) => this.setState({ [name]: e.target.value, [name + 'IsInvalid']: false })

    handleAssetChange = (e) => {
        const contractAddress = e.target.value
        const { loanAssets, loanSettings, dispatch } = this.props
        const asset = loanAssets[contractAddress]

        this.setState({
            asset: contractAddress,
            assetSymbol: asset.symbol,
            assetSymbolIsInvalid: false,
        })

        BlitsLoans.ETH.getAssetTypeData(contractAddress, loanSettings.eth_loans_contract)
            .then((data) => {
                console.log(data)
                dispatch(saveLendRequest(data))
            })
    }

    handleCollateralAddressBtn = async (e) => {
        e.preventDefault()
        const response = await ONE.getAccount()

        if (response.status === 'OK') {
            this.setState({ aCoinLender: response.payload.address, aCoinLenderIsInvalid: false })
            return
        }

        this.setState({ missingWallet: 'ONE' })
        this.handleToggleDownloadModal(true)
    }

    handleToggleDownloadModal = async (value) => this.setState({ showDownloadModal: value })


    handleContinueBtn = async (e) => {
        e.preventDefault()
        const { asset, amount, aCoinLender, duration, network, loansCount } = this.state
        const { dispatch, history } = this.props
        this.setState({ btnLoading: true })

        if (!asset || !amount || !aCoinLender) {
            if (!asset) this.setState({ assetSymbolIsInvalid: true })
            if (!amount) this.setState({ amountIsInvalid: true })
            if (!aCoinLender) this.setState({ aCoinLenderIsInvalid: true })
            this.setState({ btnLoading: false })
            toast.error('Missing required fields', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            return
        }

        if(!window.ethereum) {
            this.setState({ btnLoading: false, showDownloadModal: true, missingWallet: 'ETH' })
            toast.error('Missing web3 provider', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            return
        }

        const message = `You are signing this message to generate secrets for the Hash Time Locked Contracts required to create the loan. Lender Loan Nonce: ${parseInt(loansCount) + 1}`
        const response = await ETH.generateSecret(message)

        if (response.status !== 'OK') {
            console.log(response)
            toast.error(response.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
            this.setState({ btnLoading: false, })
            return
        }

        const { secret, secretHash } = response.payload

        const params = {
            tokenContractAddress: asset, amount, aCoinLender, secret, secretHash, duration, network
        }

        dispatch(saveLendRequest(params))
        history.push('/lend/confirm')
    }

    handleBackBtn = (e) => {
        e.preventDefault()
        this.props.history.push('/loans/select-asset')
    }

    render() {

        const { loanAssets, lendRequest } = this.props
        const { loading } = this.state

        if (loading) {
            return <Loading />
        }

        return (
            <Fragment>
                <MyParticles />
                <div className="main">
                    <Navbar />

                    <section className="section app-section" style={{ marginTop: '8rem' }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-md-8 offset-md-2">

                                    <div className="mb-4 text-center">
                                        <h2>New Loan<Emoji text=":rocket:" onlyEmojiClassName="make-emojis-large" /></h2>
                                        <div className="app-page-subtitle mt-2">Enter the loan details to create the offer</div>
                                    </div>
                                    <div className="app-card shadow-lg">

                                        <div className="form-group">
                                            <div className="app-form-label text-black">1. Asset</div>
                                            <select value={this.state.asset} onChange={this.handleAssetChange} className={this.state.assetSymbolIsInvalid ? "form-control is-invalid" : "form-control"}>
                                                {
                                                    Object.values(loanAssets).length > 0
                                                        ? Object.values(loanAssets).map((a, i) => (
                                                            <option key={i} value={a.contractAddress}>{a.name}</option>
                                                        ))
                                                        : <option>Loading...</option>
                                                }
                                            </select>
                                            <div className="invalid-feedback">
                                                Select an asset to lend
                                            </div>
                                        </div>

                                        {/* <div className="form-group mt-4">
                                            <div className="app-form-label text-black">2. Amount</div>
                                            <div className="input-group mb-3">
                                                <input value={this.state.amount} onChange={this.handleAmountChange} type="number" className={this.state.amountIsInvalid ? "form-control is-invalid" : "form-control"} placeholder="Amount" />
                                                <div className="input-group-append">
                                                    <span className="input-group-text">{this.state.assetSymbol.toUpperCase()}</span>
                                                </div>
                                                <div className="invalid-feedback">
                                                    {this.state.amountErrorMsg}
                                                </div>
                                            </div>
                                            <div className="text-right text-black">Min: {lendRequest.minLoanAmount} | Max: {lendRequest.maxLoanAmount} </div>
                                        </div> */}

                                        <div className="form-group mt-4">
                                            <div className="app-form-label text-black">2. Amount: {this.state.amount ? this.state.amount : '0'} {this.state.assetSymbol.toUpperCase()}</div>
                                            <div className="mt-3">
                                                <Slider min={100} max={1000} step={10} value={this.state.amount} onChange={value => this.setState({ amount: value })} />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div className="text-black mt-3"></div>
                                                <div className="text-black mt-3">Min: {lendRequest.minLoanAmount} | Max: {lendRequest.maxLoanAmount}</div>
                                            </div>
                                        </div>

                                        {/* <div className="app-form-label text-black mt-4">2. Select required collateral amount</div>
                                        <div className="mt-3">
                                            <Slider min={100} max={200} step={10} value={this.state.collateralizationRatio} onChange={this.handleCRateChange} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div className="text-black mt-3">Value: {this.state.collateralizationRatio}</div>
                                            <div className="text-black mt-3">Min: 100% | Max: 200% </div>
                                        </div> */}

                                        {/* <div className="app-form-label text-black mt-4">3. Annual Percentage Rate</div>
                                        <div className="input-group mb-3">
                                            <input value={this.state.apr} onChange={this.handleAPRChange} type="number" className={this.state.aprIsInvalid ? "form-control is-invalid" : "form-control"} placeholder="APR" />
                                            <div className="input-group-append">
                                                <span className="input-group-text">%</span>
                                            </div>
                                            <div className="invalid-feedback">
                                                {this.state.aprErrorMsg}
                                            </div>
                                        </div>
                                        <div className="text-right text-black">Min: 1% | Max: 30% </div> */}


                                        {/* <div className="app-form-label text-black mt-4">4. Loan duration</div>
                                        <div className="input-group mb-3">
                                            <input value={this.state.duration} onChange={this.handleDurationChange} type="number" className={this.state.durationIsInvalid ? "form-control is-invalid" : "form-control"} placeholder="Days" />
                                            <div className="input-group-append">
                                                <span className="input-group-text">DAYS</span>
                                            </div>
                                            <div className="invalid-feedback">
                                                {this.state.durationErrorMsg}
                                            </div>
                                        </div>
                                        <div className="text-right text-black">Min: 1 | Max: 30 </div> */}

                                        <div className="app-form-label text-black mt-2">3. Your Harmony (ONE) Address</div>
                                        {
                                            this.state.aCoinLender ?
                                                <div className="input-group mt-3">
                                                    <input value={this.state.aCoinLender} readOnly={true} onChange={this.handleACoinLenderChange} type="text" className={this.state.aCoinLenderIsInvalid ? "form-control is-invalid" : "form-control"} placeholder="Harmony Address" autoCorrect="false" autoComplete="false" />
                                                    <div className="invalid-feedback">
                                                        {this.state.aCoinLenderErrorMsg}
                                                    </div>
                                                </div>
                                                :
                                                <div className="mt-3">
                                                    <button onClick={this.handleCollateralAddressBtn} className="btn btn-blits" style={{ fontSize: '14px', background: 'linear-gradient(-47deg, #8731E8 0%, #4528DC 100%)' }}>
                                                        <Emoji text="🔓" onlyEmojiClassName="sm-emoji" />
                                                        Unlock ONE Wallet
                                                    </button>
                                                </div>

                                        }
                                        <div style={{ color: this.state.aCoinLenderIsInvalid ? 'red' : 'black' }} className="text-left mt-2 mb-4">You will receive the borrower's seizable collateral to this address if he fails to repay the loan. </div>

                                        {/* <hr className="" /> */}

                                        <div className="form-group mt-4">
                                            <div className="app-form-label text-black mt-2">Details</div>
                                            <label className="details-label text-black mt-4">You are lending {this.state.amount} {this.state.assetSymbol} for {this.state.duration} days</label>
                                            <table className="table mt-2">
                                                <tbody>
                                                    <tr>
                                                        <td className="details-title">Interest:</td>
                                                        <td className="details-label">{(lendRequest.interestRate && this.state.amount ? parseFloat(BigNumber(this.state.amount).multipliedBy(lendRequest.interestRate)) : 0).toFixed(2)} {this.state.assetSymbol} <Emoji text=":moneybag:" /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="details-title">Duration:</td>
                                                        <td className="details-label">{this.state.duration} days <Emoji text=":hourglass:" /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="details-title">APR:</td>
                                                        <td className="details-label">{(parseFloat(BigNumber(lendRequest.interestRate).multipliedBy(12).multipliedBy(100))).toFixed(2)}% <Emoji text="💸" /></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="details-title">Allowed collateral:</td>
                                                        <td className="details-label">ONE <Emoji text=":locked:" /></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="row">
                                            {/* <div className="col-sm-12 col-md-5 offset-md-1">
                                                <button onClick={this.handleBackBtn} className="btn btn-blits-white mt-4" style={{ width: '100%' }}>Back</button>
                                            </div> */}
                                            <div className="col-sm-12 col-md-12 text-center">
                                                <ParticleEffectButton
                                                    color='#32CCDD'
                                                    hidden={this.state.btnLoading}
                                                    type="triangle"
                                                >
                                                    <button onClick={this.handleContinueBtn} className="btn btn-blits" style={{ fontSize: '16px' }}>
                                                        <img style={{ height: 15 }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAMFBMVEVHcEz/rDP/rDP/rDP/rDP/rDP/rDP/rDP/rDP/rDP/rDP/rDP/rDP/rDP/rDP/rDNIzNElAAAAD3RSTlMA7xBgnzDPgCDfj0C/r3DHfpOdAAABLklEQVR42q2XSxLDIAzFbCCBJml9/9v2s3kbdwGKDsBoRvXL1OY5IrpxyjM+GKbs8aUYZPP40gxyevwYxqgRTEi57hAqLSSEc3GhTe80nv2HD5RLkPPoIbzYMi1uESpX3CI09sBCysWFqgcTUnYupFziBUY1QjzYlYoKcmGh0wMLKRcXOiKhglEFQsqFhbb8nYtlF+d0rln6n1GdJ7/SBdJRXeDIRnWBmuWax2s2qvP4RrKLfSRXusCVLHgs0MzAQ/QXzcfg/JtrkivPtZHtFnuxWR5prmJMSFcKhG7/uvlpTEjZsZBycaHn2juv5EpXKI5yiZ6MKhFSLiakUWVCGlUmpFxUiP9DQ9nFcJRLNOVC7wx2paIlo4qEDmM05UIMjSqjKTuiKBdEowrpS7neXD5UXwGvjogAAAAASUVORK5CYII=" />
                                                        Sign & Continue
                                                    </button>
                                                </ParticleEffectButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <DownloadModal
                    isOpen={this.state.showDownloadModal}
                    missingWallet={this.state.missingWallet}
                    toggleModal={this.handleToggleDownloadModal}
                />
            </Fragment>
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

export default connect(mapStateToProps)(NewLoan)