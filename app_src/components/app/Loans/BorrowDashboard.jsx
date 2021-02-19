import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import Navbar from './Navbar'
import Footer from './Footer'

// Styles
import '../styles.css'

// Actions
import { saveAvailableLoans } from '../../../actions/availableLoans'

// API
import { getAvailableLoans } from '../../../utils/api'

// Libraries
import Web3 from 'web3'
import moment from 'moment'
import currencyFormatter from 'currency-formatter'
import BigNumber from 'bignumber.js'
import Particles from 'react-particles-js'
import Emoji from "react-emoji-render"
import ParticleEffectButton from 'react-particle-effect-button'
import MyParticles from './MyParticles'

class BorrowDashboard extends Component {
    state = {
        loans: '',
        myLoans: '',
        contracts: ''
    }

    componentDidMount() {
        document.title = "Borrow | Cross-chain Loans"
        const { dispatch, providers, shared } = this.props

        getAvailableLoans({})
            .then(data => data.json())
            .then((res) => {
                console.log(res)
                if (res.status === 'OK') {
                    dispatch(saveAvailableLoans(res.payload))
                }
            })
    }

    handleViewDetailsBtn = async (loanId) => {
        const { history } = this.props
        history.push('/app/loan/' + loanId)
    }

    render() {

        const { availableLoans } = this.props


        return (
            <Fragment>
                <div className="main">
                    <Navbar />
                    <section className="section " style={{ paddingTop: '10rem' }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 col-md-12">

                                    <div className="mb-4 text-left">
                                        <div style={{ fontWeight: 'bold', fontSize: '24px', color: 'black' }}>Loan Book: Available Loans</div>
                                        <div style={{ fontSize: '18px', marginTop: '10px' }}>Borrow assets across different blockchains</div>
                                    </div>


                                    {

                                        availableLoans && Object.values(availableLoans).length > 0
                                            ?
                                            <div className="panel panel-default">
                                                <table className="table loanBook table-striped ">
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Amount</th>
                                                            <th>Asset</th>
                                                            <th>Chain</th>
                                                            <th>APR</th>
                                                            <th>Term</th>
                                                            <th>Repayment</th>
                                                            <th>Interest</th>
                                                            <th>Lender</th>
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Object.values(availableLoans).map((l, i) => (
                                                                <tr key={i}>
                                                                    <td>#{l.contractLoanId}</td>
                                                                    <td className="loanBook__amount">{currencyFormatter.format(l.principal, { code: 'USD', symbol: '' })} </td>
                                                                    <td>{l.tokenSymbol}<img style={{ height: 20 }} src={process.env.SERVER_HOST + '/api/logo/ETH/' + l.tokenSymbol}></img></td>
                                                                    <td>{l.blockchain}</td>
                                                                    <td>
                                                                        <div className="loanBook__apr">
                                                                            {parseFloat(BigNumber(l.interest).times(100).div(l.principal).times(12)).toFixed(2)}%
                                                                    </div>
                                                                    </td>
                                                                    <td>30d</td>

                                                                    <td>
                                                                        {currencyFormatter.format((parseFloat(l.principal) + parseFloat(l.interest)), { code: 'USD', symbol: '' })} {l.tokenSymbol}
                                                                    </td>
                                                                    <td>
                                                                        {currencyFormatter.format(l.interest, { code: 'USD', symbol: '' })} {l.tokenSymbol}
                                                                    </td>
                                                                    <td><a href={"#"}>{l.lender.substring(0, 4)}...{l.lender.substr(l.lender.length - 4)}</a></td>
                                                                    <td>
                                                                        <div className="loanBook__apr">
                                                                            {l.status === '1' ? 'Funded' : '-'}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <a href={'/app/loan/' + l.id} className="btn btn-blits" style={{}}>Borrow</a>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>

                                                </table>
                                            </div>
                                            : <div className="text-center">No available loans found</div>
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


function mapStateToProps({ availableLoans, shared }) {
    return {
        availableLoans,
        shared
    }
}

export default connect(mapStateToProps)(BorrowDashboard)