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


class LoanCreated extends Component {
    
    componentDidMount = async () => {
        document.title = 'Loan Created | Cross-chain Loans'
    }

    handleReturnBtn = (e) => {
        e.preventDefault()
        const { history } = this.props
        history.push('/app/lend')
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
                    <section className="section app-section" style={{marginTop: '12rem'}}>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-md-8 offset-md-2">
                                    <div className="mb-4 text-center">
                                        <h2>✅ Loan Created!</h2>
                                        <div className="app-page-subtitle mt-2">You have created a new loan successfully</div>
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
                                            
                                            <div className="col-sm-12 col-md-6 offset-md-3 text-center">
                                                <button onClick={this.handleReturnBtn} className="btn btn-blits mt-4" style={{ width: '100%' }}>
                                                   Return
                                                </button>
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


function mapStateToProps({ lendRequest, loanAssets, protocolContracts, providers, assetTypes }) {
    return {
        lendRequest,
        protocolContracts,
        loanAssets,
        providers,
        assetTypes
    }
}

export default connect(mapStateToProps)(LoanCreated)