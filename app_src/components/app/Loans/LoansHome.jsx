import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import Navbar from './Navbar'
import Footer from './Footer'

// Styles
import '../styles.css'

class LoansHome extends Component {
    state = {

    }

    componentDidMount = () => {
        document.title = "Intro | Cross-chain Loans"
    }

    handleOptionClick = (option) => {
        const { history } = this.props        
        history.push('/' + option)
    }

    render() {
        return (
            <Fragment>
                

                <div className="main">
                    <Navbar />

                    <section className="section app-section">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-md-10 offset-md-1 text-center">
                                    <div className="mb-4">
                                        <h1>Cross-chain Loans</h1>
                                        <h3 >Select an option</h3>
                                    </div>
                                    <div className="row mt-5 ">
                                        <div className="col-sm-12 col-md-6 mb-2 text-center">
                                            <div onClick={() => this.handleOptionClick('borrow')} className="app-option-btn main-color-bg">
                                                <div className="option-title">Borrow</div>
                                                <div className="option-desc mt-3">Deposit ONE  as collateral and borrow stablecoins on Ethereum's blockchain.</div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 mb-2 text-center">
                                            <div onClick={() => this.handleOptionClick('lend')} className="app-option-btn secondary-color-bg">
                                                <div className="option-title">Lend</div>
                                                <div className="option-desc mt-3">Deposit your stablecoins on Ethereum's blockchain and earn interest.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                   
                </div>
            </Fragment>
        )
    }
}


function mapStateToProps({ }) {
    return {

    }
}

export default connect(mapStateToProps)(LoansHome)