import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import Navbar from './Navbar'
import Footer from './Footer'
import AssetCard from './AssetCard'
import Loading from '../../Loading'
import TestnetDataCheckbox from './TestnetDataCheckbox'
import { NETWORKS, TESTNET_NETWORKS } from '../../../crypto/Networks'

class Lend extends Component {

    state = {
        networkId: '',
        loading: true
    }

    componentDidMount() {
        document.title = "Lend | Cross-chain Loans"
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
                                            <div style={{ fontWeight: 'bold', fontSize: '24px' }}>Lend</div>
                                            <div style={{ fontSize: '18px', marginTop: '10px' }}>Lend your stablecoins to earn APY</div>
                                        </div>
                                        <TestnetDataCheckbox />
                                        <div className="row">
                                            {
                                                Object.values(loanAssets).length > 0
                                                    ? Object.values(loanAssets)
                                                        .filter(l => shared?.hide_testnet_data ? !TESTNET_NETWORKS.includes(l?.networkId) : true)
                                                        .sort((a, b) => {
                                                            if (a?.networkId == shared?.networkId) return 1
                                                            else if (b?.networkId != shared?.networkId) return 1
                                                        })
                                                        .map((a, i) => (
                                                            <div key={i} className="col-sm-12 col-md-4">
                                                                <AssetCard asset={a} />
                                                            </div>
                                                        ))
                                                    : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <img src='http://localhost:3000/assets/images/abs_2_1.png' className="abstract_img_1" />
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

export default connect(mapStateToProps)(Lend)