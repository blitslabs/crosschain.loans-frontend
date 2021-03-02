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
import { saveActivityHistory } from '../../../actions/activity'
import { saveReferrer } from '../../../actions/shared'

// API
import { getActivityHistory } from '../../../utils/api'


class Activity extends Component {
    state = {
        loading: true,
        activity: '',
    }

    componentDidMount() {
        document.title = 'Activity | Cross-chain Loans'
        this.loadInitialData()
        this.safeReferrer()
    }

    loadInitialData = async () => {
        const { accounts, dispatch } = this.props

        getActivityHistory({ page: 1 })
            .then(data => data.json())
            .then((res) => {
                console.log(res)
                if (res.status === 'OK') {
                    this.setState({
                        loading: false
                    })
                    dispatch(saveActivityHistory(res.payload))
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
        const { activity, shared } = this.props

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
                                        <div style={{ fontWeight: 'bold', fontSize: '24px' }}>Activity Explorer</div>
                                        <div style={{ fontSize: '18px', marginTop: '10px' }}>Explore the protocol's recent activity</div>
                                    </div>
                                    <TestnetDataCheckbox />
                                    {

                                        (activity && Object.values(activity).length > 0)
                                            ?
                                            <div className="table-responsive">
                                                <table className="table loanBook table-striped" >
                                                    <thead>
                                                        <tr>
                                                            <th>TxHash</th>
                                                            <th>Event</th>
                                                            <th>Blockchain</th>
                                                            <th>Network</th>
                                                            <th>Contract</th>
                                                            <th>Loan ID</th>
                                                            {/* <th>Account</th> */}
                                                            <th>Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Object.values(activity).filter(l => shared?.hide_testnet_data ? !TESTNET_NETWORKS.includes(l?.networkId) : true).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((e, i) => {

                                                                const explorer = EXPLORER[e.networkId]
                                                                const txHashUrl = `${explorer}tx/${e.txHash}`
                                                                const contractUrl = `${explorer}address/${e.contractAddress}`
                                                                const loanId = 'bCoinContractLoanId' in e.details ? e.details.bCoinContractLoanId : e.details.contractLoanId
                                                                const loanUrl = `${process.env.SERVER_HOST}/app/loan/${loanId}`

                                                                return (
                                                                    <tr key={i}>
                                                                        <td><a target='_blank' href={txHashUrl}>{e.txHash.substring(0, 4)}...{e.txHash.substr(e.txHash.length - 4)}</a></td>
                                                                        <td style={{ textAlign: 'left' }}>
                                                                            <div className="loanBook__apr">
                                                                                {e.event}
                                                                            </div>
                                                                        </td>
                                                                        <td>{e.blockchain}</td>
                                                                        <td>{e.networkId}</td>
                                                                        <td><a target='_blank' href={contractUrl}>{e.contractAddress.substring(0, 4)}...{e.contractAddress.substring(e.contractAddress.length - 4)}</a></td>
                                                                        <td>{loanId}</td>
                                                                        <td>{moment(e.createdAt).format()}</td>
                                                                        {/* <td style={{ fontWeight: 'bold', color: 'black' }}>{currencyFormatter.format(l.principal, { code: 'USD', symbol: '' })} {l.tokenSymbol} ({l.blockchain})</td> */}


                                                                    </tr>
                                                                )
                                                            })
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
                                                : <div className="loading-table text-center">🔍 No borrows found</div>
                                    }

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


function mapStateToProps({ activity, shared }) {
    return {
        activity,
        shared
    }
}

export default connect(mapStateToProps)(Activity)