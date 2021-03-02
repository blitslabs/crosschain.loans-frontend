import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

// Components
import Navbar from './Navbar'
import Footer from './Footer'
import TestnetDataCheckbox from './TestnetDataCheckbox'

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
import { EXPLORER, NETWORKS, TESTNET_NETWORKS } from '../../../crypto/Networks'
import queryString from 'query-string'
import ETH from '../../../crypto/ETH'

// Styles
import '../styles.css'

// Actions
import { saveAccountLoans, saveAccountCollateralTxs, removeAccountLoans } from '../../../actions/accountLoans'
import { saveReferrer } from '../../../actions/shared'

// API
import { getAccountLoans, getLockedCollateral } from '../../../utils/api'


class MyLoans extends Component {
    state = {
        loading: true,
    }

    componentDidMount() {
        document.title = 'My Loans | Cross-chain Loans'
        this.loadInitialData()
        this.safeReferrer()
    }

    loadInitialData = async () => {
        const { shared, dispatch } = this.props

        console.log(shared?.account)
        getAccountLoans({ account: shared?.account })
            .then(data => data.json())
            .then((res) => {
                console.log(res)
                if (res.status === 'OK') {
                    const loans = { ...res.payload }
                    dispatch(saveAccountLoans(loans))
                    this.setState({ loading: false })
                }
            })
    }

    safeReferrer = async () => {
        const { dispatch, location } = this.props
        // Save Referrer
        const params = queryString.parse(location.search)
        if ('rid' in params && params.rif != '') {
            const addressIsValid = await ETH.isAddressValid(params.rid)             
            console.log('REFERRER', params.rid)      
            // Check if rif is valid address
            if (addressIsValid) {
                dispatch(saveReferrer(params.rid))
                return
            }
        }
    }

    handleViewDetailsBtn = async (loanId) => {
        const { history } = this.props
        history.push('/loan/' + loanId)
    }

    render() {
        const { loading } = this.state
        const { shared, accountLoans } = this.props
        const borrowed = Object.values(accountLoans).filter((l, i) => l?.borrower?.toUpperCase() == shared?.account?.toUpperCase())
        const lent = Object.values(accountLoans).filter((l, i) => l?.lender?.toUpperCase() == shared?.account?.toUpperCase())

        return (
            <Fragment>
                {/* <MyParticles /> */}
                <div className="main">
                    <Navbar />
                    <section className="section " style={{ paddingTop: '10rem' }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-md-12">

                                    <div className="mb-2 text-left">
                                        <div style={{ fontWeight: 'bold', fontSize: '24px', }}>My Loans</div>
                                        {/* <div style={{ fontSize: '18px', marginTop: '10px' }}>Check account's loans</div> */}
                                    </div>
                                    <TestnetDataCheckbox />

                                    <Tabs>
                                        <TabList>
                                            <Tab>Borrowed</Tab>
                                            <Tab>Lent</Tab>
                                        </TabList>


                                        <TabPanel>

                                            {

                                                (borrowed && Object.values(borrowed).length > 0)
                                                    ?
                                                    <div className="table-responsive">
                                                        <table className="table loanBook table-striped" >
                                                            <thead>
                                                                <tr>
                                                                    <th>ID</th>
                                                                    <th>Amount</th>
                                                                    <th>Blockchain</th>
                                                                    <th>Network</th>
                                                                    <th>Repayment</th>
                                                                    <th>Interest</th>
                                                                    <th>APR</th>
                                                                    <th>Duration</th>
                                                                    <th>Lender</th>
                                                                    <th>Status</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    Object.values(borrowed).filter(l => shared?.hide_testnet_data ? !TESTNET_NETWORKS.includes(l?.networkId) : true).map((l, i) => (
                                                                        <tr key={i}>
                                                                            <td>#{l.id}</td>
                                                                            <td style={{ fontWeight: 'bold' }}>{currencyFormatter.format(l.principal, { code: 'USD', symbol: '' })} {l.tokenSymbol}</td>
                                                                            <td>{l.blockchain}</td>
                                                                            <td>{l.networkId}</td>
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
                                                                                <div className="loanBook__apr">
                                                                                    {
                                                                                        l.status == 1 ? 'Funded' :
                                                                                            l.status == 1.5 ? 'Awaiting Approval' :
                                                                                                l.status == 2 ? 'Approved' :
                                                                                                    l.status == 3 ? 'Withdrawn' :
                                                                                                        l.status == 4 ? 'Repaid' :
                                                                                                            l.status == 5 ? 'PaybackRefunded' :
                                                                                                                l.status == 6 ? 'Closed' :
                                                                                                                    l.status == 7 ? 'Canceled' : ''
                                                                                    }
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <a href={'/app/loan/' + l.id}>Details</a>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    :
                                                    loading ? (
                                                        <div className="loading-table text-center">
                                                            ⌛ Loading...
                                                        </div>
                                                    )
                                                        : <div className="loading-table text-center">🔍 No loans found</div>
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
                                                        <div className="table-responsive">
                                                            <table className="table loanBook table-striped" >
                                                                <thead>
                                                                    <tr>
                                                                        <th>ID</th>
                                                                        <th>Amount</th>
                                                                        <th>Blockchain</th>
                                                                        <th>Network</th>
                                                                        <th>Repayment</th>
                                                                        <th>Interest</th>
                                                                        <th>APR</th>
                                                                        <th>Duration</th>
                                                                        <th>Lender</th>
                                                                        <th>Status</th>
                                                                        <th></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        Object.values(lent).filter(l => shared?.hide_testnet_data ? !TESTNET_NETWORKS.includes(l?.networkId) : true).map((l, i) => (
                                                                            <tr key={i}>
                                                                                <td>#{l.id}</td>
                                                                                <td style={{ fontWeight: 'bold' }}>{currencyFormatter.format(l.principal, { code: 'USD', symbol: '' })} {l.tokenSymbol}</td>
                                                                                <td>{l.blockchain}</td>
                                                                                <td>{l.networkId}</td>
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
                                                                                    <div className="loanBook__apr">
                                                                                        {
                                                                                            l.status == 1 ? 'Funded' :
                                                                                                l.status == 1.5 ? 'Awaiting Approval' :
                                                                                                    l.status == 2 ? 'Approved' :
                                                                                                        l.status == 3 ? 'Withdrawn' :
                                                                                                            l.status == 4 ? 'Repaid' :
                                                                                                                l.status == 5 ? 'PaybackRefunded' :
                                                                                                                    l.status == 6 ? 'Closed' :
                                                                                                                        l.status == 7 ? 'Canceled' : ''
                                                                                        }
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <a href={'/app/loan/' + l.id}>Details</a>
                                                                                </td>
                                                                            </tr>
                                                                        ))
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        :
                                                        loading ? (
                                                            <div className="loading-table text-center">
                                                                ⌛ Loading...
                                                            </div>
                                                        )
                                                            : <div className="loading-table text-center">🔍 No loans found</div>
                                            }
                                        </TabPanel>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </section>
                    <img src='http://localhost:3000/assets/images/abs_2_1.png' className="abstract_img_1" />
                </div>
                <Footer/>
            </Fragment >
        )
    }
}


function mapStateToProps({ accountLoans, shared }) {
    return {
        accountLoans,
        shared
    }
}

export default connect(mapStateToProps)(MyLoans)