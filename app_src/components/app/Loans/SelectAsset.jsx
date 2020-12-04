import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import Navbar from './Navbar'
import Footer from './Footer'

// Styles
import '../styles.css'

// Actions
import { saveLoanRequestAsset } from '../../../actions/loanRequest'

class SelectAsset extends Component {
    state = {

    }

    componentDidMount() {
        const { loanRequest, history } = this.props
        const { requestType } = loanRequest
        document.title = requestType === 'borrow' ? 'Select Asset to Borrow | Blits': 'Select Asset to Lend | Blits'
        if(!loanRequest.requestType) {
            history.push('/loans')
        }
    }

    handleOptionClick = (option) => {
        const { loanRequest, dispatch, history } = this.props
        dispatch(saveLoanRequestAsset(option))
        const r = loanRequest.requestType === 'borrow' ? '/borrow/dashboard' : '/lend/new'
        history.push(r)
    }

    render() {

        const { loanRequest } = this.props
        const { requestType } = loanRequest

        return (
            <Fragment>
                <div className="main">
                    <Navbar />
                    <section className="section app-section">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-md-10 offset-md-1 text-center">
                                    <div className="mb-4">
                                        <h1>{requestType === 'borrow' ? 'Select a stablecoin to Borrow' : 'Select a stablecoin to Lend'}</h1>
                                    </div>
                                    <div className="row mt-5 ">
                                        <div className="col-sm-12 col-md-6 mb-2 text-center">
                                            <div onClick={() => this.handleOptionClick('DAI')} className="app-option-btn shadow-lg">
                                                <div><img src={process.env.SERVER_HOST + '/assets/images/dai_logo.png'} alt="" /></div>
                                                <div className="option-title text-black mt-4">DAI</div>
                                                <div className="option-desc text-black mt-3">{requestType === 'borrow' ? 'Borrow DAI on Ethereum\'s blockchain using ONE as collateral' : 'Lend DAI on Ethereum\'s blockchain to earn interest.'}</div>
                                                <button className="btn btn-blits mt-4">Select</button>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-6 mb-2 text-center">
                                            <div onClick={() => this.handleOptionClick('BUSD')} className="app-option-btn shadow-lg">
                                                <div><img src={process.env.SERVER_HOST + '/assets/images/busd_logo.png'} alt="" /></div>
                                                <div className="option-title text-black mt-4">BUSD</div>
                                                <div className="option-desc text-black mt-3">{requestType === 'borrow' ? 'Borrow BUSD on Ethereum\'s blockchain using ONE as collateral' : 'Lend BUSD on Ethereum\'s blockchain to earn interest.'}</div>
                                                <button className="btn btn-blits mt-4">Select</button>
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


function mapStateToProps({ loanRequest }) {
    return {
        loanRequest,
    }
}

export default connect(mapStateToProps)(SelectAsset)