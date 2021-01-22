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

class LenderDashboard extends Component {
    state = {
        loans: '',
        myLoans: '',
        contracts: ''
    }

    componentDidMount() {
        document.title = "Borrow | Cross-chain Loans"
        const { dispatch } = this.props

        getAvailableLoans()
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
        history.push('/loan/' + loanId)
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
                                        <div style={{ fontWeight: 'bold', fontSize: '24px', color: 'black' }}>Available Loans</div>
                                        <div style={{ fontSize: '18px', marginTop: '10px' }}>Borrow assets across different blockchains</div>
                                    </div>

                                    <table className="table table-hover">
                                        <thead>
                                            <th>Loan ID</th>
                                            <th>Amount</th>
                                            <th>Term</th>
                                            <th>APY</th>
                                            <th>Lender</th>
                                            <th>Created on</th>
                                            <th>Status</th>
                                        </thead>
                                    </table>

                                    {

                                        // availableLoans && Object.values(availableLoans).length > 0
                                        //     ?
                                        //     <table className="table table-hover loans-table" style={{ background: '#f8f9fa', borderRadius: '25px' }}>
                                        //         <thead>
                                        //             <tr>
                                        //                 {/* <th>ID</th> */}
                                        //                 <th><Emoji text="💵" /> Amount</th>
                                        //                 <th><Emoji text="🧿" /> Blockchain</th>
                                        //                 <th><Emoji text="💸" /> Repayment</th>
                                        //                 <th><Emoji text="🧃" /> Interest</th>
                                        //                 <th><Emoji text="🌈" /> APR</th>
                                        //                 <th><Emoji text="⌛" /> Duration</th>
                                        //                 <th><Emoji text="🎱" /> Lender</th>
                                        //                 <th></th>
                                        //             </tr>
                                        //         </thead>
                                        //         <tbody>
                                        //             {
                                        //                 Object.values(availableLoans).map((l, i) => (
                                        //                     <tr key={i}>
                                        //                         {/* <td>#{l.blockchainLoanId}</td> */}
                                        //                         <td style={{ fontWeight: 'bold', color: 'black' }}>{currencyFormatter.format(l.principal, { code: 'USD', symbol: '' })} {l.tokenSymbol}</td>
                                        //                         <td>{l.blockchain}</td>
                                        //                         <td>
                                        //                             {/* <Emoji text="💸" /> */}
                                        //                             {currencyFormatter.format((parseFloat(l.principal) + parseFloat(l.interest)), { code: 'USD', symbol: '' })} {l.tokenSymbol}
                                        //                         </td>
                                        //                         <td>
                                        //                             {/* <Emoji text="🧃" /> */}
                                        //                             {currencyFormatter.format(l.interest, { code: 'USD', symbol: '' })} {l.tokenSymbol}
                                        //                         </td>
                                        //                         <td>
                                        //                             {/* <Emoji text="🌈" /> */}
                                        //                             {parseFloat(BigNumber(l.interest).times(100).div(l.principal).times(12)).toFixed(2)}%
                                        //                         </td>
                                        //                         <td>30 days</td>
                                        //                         <td><a href={"#"}>{l.lender.substring(0, 4)}...{l.lender.substr(l.lender.length - 4)}</a></td>
                                        //                         <td>
                                        //                             <button onClick={e => { e.preventDefault(); this.handleViewDetailsBtn(l.id) }} className="btn btn-blits" style={{}}>Borrow</button>
                                        //                         </td>
                                        //                     </tr>
                                        //                 ))
                                        //             }
                                        //         </tbody>
                                        //     </table>
                                        //     : <div className="text-center">No available loans found</div>
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


function mapStateToProps({ availableLoans }) {
    return {
        availableLoans,
    }
}

export default connect(mapStateToProps)(LenderDashboard)