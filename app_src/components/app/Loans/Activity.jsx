import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

// Components
import Navbar from './Navbar'
import Footer from './Footer'

// Libraries
import Web3 from 'web3'
import moment from 'moment'
import currencyFormatter from 'currency-formatter'
import BigNumber from 'bignumber.js'
import Particles from 'react-particles-js'
import Emoji from "react-emoji-render"
import ParticleEffectButton from 'react-particle-effect-button'
import MyParticles from './MyParticles'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { fromBech32 } from '@harmony-js/crypto'
import ReactLoading from 'react-loading'

// Styles
import '../styles.css'

// Actions
import { saveAccountLoans, saveAccountCollateralTxs, removeAccountLoans } from '../../../actions/accountLoans'

// API
import { getLoansHistory } from '../../../utils/api'

const ETHERSCAN = 'https://etherscan.io/address/'


class Activity extends Component {
    state = {
        loading: true,
        activity: '',
    }

    componentDidMount() {
        document.title = '📜 Activity | Cross-chain Loans'
        this.loadInitialData()
    }

    loadInitialData = async () => {
        const { accounts, dispatch } = this.props

        getLoansHistory()
            .then(data => data.json())
            .then((res) => {
                console.log(res)
                if (res.status === 'OK') {
                    this.setState({
                        activity: res.payload,
                        loading: false
                    })
                }
            })
    }

    handleViewDetailsBtn = async (loanId) => {
        const { history } = this.props
        history.push('/loan/' + loanId)
    }

    render() {
        const { activity, loading } = this.state


        return (
            <Fragment>
                <MyParticles />
                <div className="main">
                    <Navbar />
                    <section className="section " style={{ paddingTop: '10rem' }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-md-12">

                                    <div className="mb-4 text-left">
                                        <div style={{ fontWeight: 'bold', fontSize: '24px', color: 'black' }}>📜 Activity Explorer</div>
                                        <div style={{ fontSize: '18px', marginTop: '10px' }}>Check the protocol's activity</div>
                                    </div>

                                    {

                                        (activity && Object.values(activity).length > 0)
                                            ?
                                            <table className="table table-hover loans-table" style={{ background: '#f8f9fa', borderRadius: '25px' }}>
                                                <thead>
                                                    <tr>
                                                        {/* <th>ID</th> */}
                                                        <th><Emoji text="💵" /> Amount</th>                                                        
                                                        <th><Emoji text="💸" /> Repayment</th>
                                                        <th><Emoji text="🧃" /> Interest</th>
                                                        <th><Emoji text="🌈" /> APR</th>
                                                        <th><Emoji text="⌛" /> Duration</th>
                                                        <th><Emoji text="🧿" /> Borrower</th>
                                                        <th><Emoji text="🎱" /> Lender</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        Object.values(activity).map((l, i) => (
                                                            <tr key={i}>
                                                                {/* <td>#{l.blockchainLoanId}</td> */}
                                                                <td style={{ fontWeight: 'bold', color: 'black' }}>{currencyFormatter.format(l.principal, { code: 'USD', symbol: '' })} {l.tokenSymbol} ({l.blockchain})</td>                                                                
                                                                <td>
                                                                    {/* <Emoji text="💸" /> */}
                                                                    {currencyFormatter.format((parseFloat(l.principal) + parseFloat(l.interest)), { code: 'USD', symbol: '' })} {l.tokenSymbol}
                                                                </td>
                                                                <td>
                                                                    {/* <Emoji text="🧃" /> */}
                                                                    {currencyFormatter.format(l.interest, { code: 'USD', symbol: '' })} {l.tokenSymbol}
                                                                </td>
                                                                <td>
                                                                    {/* <Emoji text="🌈" /> */}
                                                                    {parseFloat(BigNumber(l.interest).times(100).div(l.principal).times(12)).toFixed(2)}%
                                                                    </td>
                                                                <td>30 days</td>
                                                                <td><a target='_blank' href={ETHERSCAN + l.borrower}>{l.borrower.substring(0, 4)}...{l.borrower.substr(l.lender.length - 4)}</a></td>
                                                                <td><a target='_blank' href={ETHERSCAN + l.lender}>{l.lender.substring(0, 4)}...{l.lender.substr(l.lender.length - 4)}</a></td>
                                                                <td>
                                                                    <button onClick={e => { e.preventDefault(); this.handleViewDetailsBtn(l.id) }} className="btn btn-light" style={{}}>Details</button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                            :
                                            loading ? (
                                                <div className="loading-table text-center">
                                                    ⌛ Loading...
                                                </div>
                                            )
                                                : <div className="loading-table text-center">🔍 No borrows found</div>
                                    }

                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </Fragment >
        )
    }
}


function mapStateToProps({ accounts, accountLoans }) {
    return {
        accounts,
        accountLoans
    }
}

export default connect(mapStateToProps)(Activity)