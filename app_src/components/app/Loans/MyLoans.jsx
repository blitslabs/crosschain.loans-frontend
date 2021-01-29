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
import { getAccountLoans, getLockedCollateral } from '../../../utils/api'


class MyLoans extends Component {
    state = {
        loading: true,
    }

    componentDidMount() {
        document.title = 'My Loans | Cross-chain Loans'
        this.loadInitialData()
    }

    loadInitialData = async () => {
        const { accounts, dispatch } = this.props

        Promise.all([
            getAccountLoans({ account: accounts?.ETH }),
            // getAccountLoans({ account: fromBech32(accounts.ONE) })
        ])
            .then((responses) => {
                return Promise.all(responses.map(res => res.json()))
            })
            .then((data) => {
                console.log(data)
                const loans_1 = data[0].status === 'OK' ? data[0].payload : {}
                // const loans_2 = data[0].status === 'OK' ? data[1].payload : {}
                // const loans = { ...loans_1, ...loans_2 }
                const loans = { ...loans_1 }
                // dispatch(removeAccountLoans())
                dispatch(saveAccountLoans(loans))
                this.setState({ loading: false })
            })

        // getAccountLoans({ account: accounts.ETH })
        //     .then(data => data.json())
        //     .then((res) => {
        //         console.log(res)
        //         if (res.status === 'OK') {
        //             dispatch(saveAccountLoans(res.payload))
        //         }
        //     })

        // if ('ONE' in accounts && accounts.ONE) {
        //     getAccountLoans({ account: fromBech32(accounts.ONE) })
        //         .then(data => data.json())
        //         .then((res) => {
        //             console.log(res)
        //             if (res.status === 'OK') {
        //                 dispatch(saveAccountCollateralTxs(res.payload))
        //             }
        //         })
        // }

    }

    handleViewDetailsBtn = async (loanId) => {
        const { history } = this.props
        history.push('/loan/' + loanId)
    }

    render() {
        const { loading } = this.state
        const { accounts, accountLoans } = this.props
        const borrowed = Object.values(accountLoans).filter((l, i) => l.borrower.toUpperCase() == accounts.ETH.toUpperCase())
        const lent = Object.values(accountLoans).filter((l, i) => l.lender.toUpperCase() == accounts.ETH.toUpperCase())

        return (
            <Fragment>
                {/* <MyParticles /> */}
                <div className="main">
                    <Navbar />
                    <section className="section " style={{ paddingTop: '10rem' }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-md-12">

                                    <div className="mb-4 text-left">
                                        <div style={{ fontWeight: 'bold', fontSize: '24px', color: 'black' }}>My Loans</div>
                                        {/* <div style={{ fontSize: '18px', marginTop: '10px' }}>Check account's loans</div> */}
                                    </div>

                                    <Tabs>
                                        <TabList>
                                            <Tab>Borrowed</Tab>
                                            <Tab>Lent</Tab>
                                        </TabList>


                                        <TabPanel>

                                            {

                                                (borrowed && Object.values(borrowed).length > 0)
                                                    ?
                                                    <table className="table loanBook table-striped" >
                                                        <thead>
                                                            <tr>
                                                                {/* <th>ID</th> */}
                                                                <th>Amount</th>
                                                                <th>Blockchain</th>
                                                                <th>Repayment</th>
                                                                <th>Interest</th>
                                                                <th>APR</th>
                                                                <th>Duration</th>
                                                                <th>Lender</th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                Object.values(borrowed).map((l, i) => (
                                                                    <tr key={i}>
                                                                        {/* <td>#{l.blockchainLoanId}</td> */}
                                                                        <td style={{ fontWeight: 'bold', color: 'black' }}>{currencyFormatter.format(l.principal, { code: 'USD', symbol: '' })} {l.tokenSymbol}</td>
                                                                        <td>{l.blockchain}</td>
                                                                        <td>
                                                                            {/* <Emoji text="💸" /> */}
                                                                            {currencyFormatter.format((parseFloat(l.principal) + parseFloat(l.interest)), { code: 'USD', symbol: '' })} {l.tokenSymbol}
                                                                        </td>
                                                                        <td>
                                                                            {currencyFormatter.format(l.interest, { code: 'USD', symbol: '' })} {l.tokenSymbol}
                                                                        </td>
                                                                        <td>
                                                                            <div className="loanBook__apr">
                                                                                {parseFloat(BigNumber(l.interest).times(100).div(l.principal).times(12)).toFixed(2)}%
                                                                            </div>
                                                                        </td>
                                                                        <td>30 days</td>
                                                                        <td><a href={"#"}>{l.lender.substring(0, 4)}...{l.lender.substr(l.lender.length - 4)}</a></td>
                                                                        <td>
                                                                            <a href={'/app/loan/' + l.id}>Details</a>
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
                                        </TabPanel>

                                        <TabPanel>
                                            {
                                                loading ? (
                                                    <div className="text-center">
                                                        ⌛ Loading...
                                                    </div>
                                                )
                                                    :
                                                    lent && Object.values(lent).length > 0
                                                        ?
                                                        <table className="table loanBook table-striped" >
                                                            <thead>
                                                                <tr>
                                                                    {/* <th>ID</th> */}
                                                                    <th>Amount</th>
                                                                    <th>Blockchain</th>
                                                                    <th>Repayment</th>
                                                                    <th>Interest</th>
                                                                    <th>APR</th>
                                                                    <th>Duration</th>
                                                                    <th>Lender</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    Object.values(lent).map((l, i) => (
                                                                        <tr key={i}>
                                                                            {/* <td>#{l.blockchainLoanId}</td> */}
                                                                            <td style={{ fontWeight: 'bold', color: 'black' }}>{currencyFormatter.format(l.principal, { code: 'USD', symbol: '' })} {l.tokenSymbol}</td>
                                                                            <td>{l.blockchain}</td>
                                                                            <td>
                                                                                {/* <Emoji text="💸" /> */}
                                                                                {currencyFormatter.format((parseFloat(l.principal) + parseFloat(l.interest)), { code: 'USD', symbol: '' })} {l.tokenSymbol}
                                                                            </td>
                                                                            <td>
                                                                                {/* <Emoji text="🧃" /> */}
                                                                                {currencyFormatter.format(l.interest, { code: 'USD', symbol: '' })} {l.tokenSymbol}
                                                                            </td>
                                                                            <td>
                                                                                <div className="loanBook__apr">
                                                                                    {parseFloat(BigNumber(l.interest).times(100).div(l.principal).times(12)).toFixed(2)}%
                                                                                </div>
                                                                            </td>
                                                                            <td>30 days</td>
                                                                            <td><a href={"#"}>{l.lender.substring(0, 4)}...{l.lender.substr(l.lender.length - 4)}</a></td>
                                                                            <td>
                                                                                <a href={'/app/loan/' + l.id}>Details</a>
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
                                                            : <div className="loading-table text-center">🔍 No lends found</div>
                                            }
                                        </TabPanel>
                                    </Tabs>
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

export default connect(mapStateToProps)(MyLoans)