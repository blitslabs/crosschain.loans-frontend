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
import { saveActivityHistory } from '../../../actions/activity'

// API
import { getActivityHistory } from '../../../utils/api'

const ETHERSCAN = 'https://etherscan.io/'

const EXPLORER = {
    '1': 'https://etherscan.io/',
    '3': 'https://ropsten.etherscan.io/',
    '56': 'https://bscscan.com/',
    '97': 'https://testnet.bscscan.com/',
    '1666600000': 'https://explorer.harmony.one/#/',
    '1666700000': 'https://explorer.testnet.harmony.one/#/'
}

class Activity extends Component {
    state = {
        loading: true,
        activity: '',
    }

    componentDidMount() {
        document.title = 'Activity | Cross-chain Loans'
        this.loadInitialData()
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

    handleViewDetailsBtn = async (loanId) => {
        const { history } = this.props
        history.push('/loan/' + loanId)
    }

    render() {
        const { loading } = this.state
        const { activity } = this.props

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
                                        <div style={{ fontWeight: 'bold', fontSize: '24px' }}>Activity Explorer</div>
                                        <div style={{ fontSize: '18px', marginTop: '10px' }}>Explore the protocol's recent activity</div>
                                    </div>

                                    {

                                        (activity && Object.values(activity).length > 0)
                                            ?
                                            <table className="table loanBook table-striped " >
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
                                                        Object.values(activity).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((e, i) => {

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


function mapStateToProps({ activity }) {
    return {
        activity
    }
}

export default connect(mapStateToProps)(Activity)