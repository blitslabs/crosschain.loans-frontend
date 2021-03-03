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
import CrosschainLoans from '../../../crypto/CrosschainLoans'

// Styles
import '../styles.css'

// Actions
import { saveAccountLoans, saveAccountCollateralTxs, removeAccountLoans } from '../../../actions/accountLoans'
import { saveReferrer } from '../../../actions/shared'

// API
import { getAccountLoans, getLockedCollateral } from '../../../utils/api'


class MyLoans extends Component {
    state = {
        referrals: [],
        loading: true,
    }

    componentDidMount() {
        document.title = 'My Loans | Cross-chain Loans'
        this.loadInitialData()
        this.saveReferrer()
    }

    loadInitialData = async () => {
        const { shared, protocolContracts, dispatch } = this.props
        const loansContract = protocolContracts[shared?.networkId].CrosschainLoans.address
        const referrals = await CrosschainLoans.getReferrals(loansContract)
        console.log(referrals)
        this.setState({
            referrals,
            loading: false
        })
    }

    saveReferrer = async () => {
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
        const { loading, referrals } = this.state
        const { shared, protocolContracts } = this.props

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
                                        <div style={{ fontWeight: 'bold', fontSize: '24px', }}>Referrals</div>
                                        {/* <div style={{ fontSize: '18px', marginTop: '10px' }}>Check account's loans</div> */}
                                    </div>
                                    
                                    <Tabs>
                                        <TabList>
                                            <Tab>My URL</Tab>
                                            <Tab>Referrals</Tab>
                                        </TabList>

                                        <TabPanel>
                                            <div className="row mt-4">
                                                <div className="col-sm-12 text-center">
                                                    <div className="mt-5" style={{ fontWeight: 'bold', fontSize: 18 }}>Share this link to earn up to 10% of the yield of your referrals</div>
                                                    <input style={{ borderRadius: '5px', fontSize: '18px' }} className="mt-4" readOnly={true} type='text' value={process.env.SERVER_HOST + '/app/lend?rid=' + shared?.account} />
                                                </div>
                                            </div>
                                        </TabPanel>

                                        <TabPanel>
                                            {
                                                loading ? (
                                                    <div className="text-center">
                                                        ⌛ Loading...
                                                    </div>
                                                )
                                                    :

                                                    <div className="table-responsive">
                                                        <table className="table loanBook table-striped" >
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Referral</th>
                                                                    <th>Network</th>
                                                                    <th>Loans Contract</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>                                                               
                                                                {
                                                                    referrals.length > 0
                                                                        ?
                                                                        referrals.map((r, i) => (
                                                                            <tr key={i}>
                                                                                <td>#{i}</td>
                                                                                <td>{r}</td>
                                                                                <td>{shared?.networkId}</td>
                                                                                <td>{protocolContracts[shared?.networkId].CrosschainLoans.address}</td>
                                                                            </tr>
                                                                        ))
                                                                        :
                                                                        <tr>
                                                                            <td>-</td>
                                                                            <td>-</td>
                                                                            <td>-</td>
                                                                            <td>-</td>
                                                                        </tr>
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                            }
                                        </TabPanel>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </section>
                    <img src={process.env.SERVER_HOST + '/assets/images/abs_2_1.png'} className="abstract_img_1" />
                </div>
                <Footer />
            </Fragment >
        )
    }
}


function mapStateToProps({ accountLoans, shared, protocolContracts }) {
    return {
        accountLoans,
        shared,
        protocolContracts
    }
}

export default connect(mapStateToProps)(MyLoans)