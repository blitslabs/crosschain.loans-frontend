import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import Navbar from './Navbar'
import Footer from './Footer'
import Loading from '../../Loading'
import TestnetDataCheckbox from './TestnetDataCheckbox'
import { NETWORKS, TESTNET_NETWORKS } from '../../../crypto/Networks'

class SupportedNetworks extends Component {

    state = {
        networkId: '',
        loading: true
    }

    componentDidMount() {
        document.title = "Supported Networks | Cross-chain Loans"
        this.setState({ loading: false })
    }

    render() {
        const { loanAssets, shared } = this.props
        const { loading } = this.state

        if (loading) {
            return <Loading />
        }

        return (
            <Fragment>
                <div className="main">
                    <Navbar />

                    <section className="section" style={{ paddingTop: '10rem' }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-md-12">
                                    <div className="mb-2 text-left">
                                        <div className="mb-2 text-left">
                                            <div style={{ fontWeight: 'bold', fontSize: '24px' }}>Supported Networks</div>
                                            <div style={{ fontSize: '18px', marginTop: '10px' }}>Configure Metamask to connect to the following networks</div>
                                        </div>


                                        <div className="row mt-5 mb-2">
                                            <div className="col-sm-12 col-md-6">
                                                <div style={{ fontSize: 18 }} className="loanBook__apr mb-2">Binance Mainnet</div>
                                                <div className="table-responsive">
                                                    <table className="table loanBook table-striped">
                                                        <tbody>
                                                            <tr>
                                                                <td>Name</td>
                                                                <td>BNB-mainnet</td>
                                                            </tr>
                                                            <tr>
                                                                <td>RPC Endpoint</td>
                                                                <td>https://bsc-dataseed.binance.org</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Chain ID</td>
                                                                <td>56</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Explorer</td>
                                                                <td>https://bscscan.com/</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6">
                                                <div style={{ fontSize: 18 }} className="loanBook__apr mb-2">Harmony Mainnet</div>
                                                <div className="table-responsive">
                                                    <table className="table loanBook table-striped">
                                                        <tbody>
                                                            <tr>
                                                                <td>Name</td>
                                                                <td>ONE-mainnet</td>
                                                            </tr>
                                                            <tr>
                                                                <td>RPC Endpoint</td>
                                                                <td>https://api.s0.t.hmny.io</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Chain ID</td>
                                                                <td>1666600000</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Explorer</td>
                                                                <td>https://explorer.harmony.one/#/</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row mt-5 mb-2">
                                            <div className="col-sm-12 col-md-6">
                                                <div style={{ fontSize: 18 }} className="loanBook__apr mb-2">Binance Testnet</div>
                                                <div className="table-responsive">
                                                    <table className="table loanBook table-striped">
                                                        <tbody>
                                                            <tr>
                                                                <td>Name</td>
                                                                <td>BNB-testnet</td>
                                                            </tr>
                                                            <tr>
                                                                <td>RPC Endpoint</td>
                                                                <td>https://data-seed-prebsc-2-s1.binance.org:8545/</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Chain ID</td>
                                                                <td>97</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Explorer</td>
                                                                <td>https://testnet.bscscan.com/</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-6">
                                                <div style={{ fontSize: 18 }} className="loanBook__apr mb-2">Harmony Testnet</div>
                                                <div className="table-responsive">
                                                    <table className="table loanBook table-striped">
                                                        <tbody>
                                                            <tr>
                                                                <td>Name</td>
                                                                <td>ONE-testnet</td>
                                                            </tr>
                                                            <tr>
                                                                <td>RPC Endpoint</td>
                                                                <td>https://api.s0.b.hmny.io</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Chain ID</td>
                                                                <td>1666700000</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Explorer</td>
                                                                <td>https://explorer.pops.one/#/</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row mt-4">
                                            <div className="col-sm-12">
                                                <div style={{ fontSize: 18 }} className="loanBook__apr mb-2">Help</div>
                                                <div>If you need help configuring Metamask please read the following guide: </div>
                                                <a className="mt-2" href="https://docs.harmony.one/home/network/wallets/browser-extensions-wallets/metamask-wallet">https://docs.harmony.one/home/network/wallets/browser-extensions-wallets/metamask-wallet</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <img src={process.env.SERVER_HOST + '/assets/images/abs_2_1.png'} className="abstract_img_1" />
                </div>
                <Footer/>
            </Fragment>
        )
    }
}

function mapStateToProps({ loanAssets, shared }) {
    return {
        loanAssets,
        shared
    }
}

export default connect(mapStateToProps)(SupportedNetworks)