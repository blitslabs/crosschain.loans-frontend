import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'



// import withAuth from './withAuth'
// import withAdminAuth from './withAdminAuth'


// App Router
import AppRouter from './app/AppRouter'
import Home from './app/Loans/Home'
import BorrowDashboard from './app/Loans/BorrowDashboard'
import Lend from './app/Loans/Lend'
import NewLoan from './app/Loans/NewLoan'
// Admin Router
// import Admin from './admin/Admin'

import './styles.css'

// API
import { getLoanAssets, getProtocolContracts } from '../utils/api'

// Actions
import { saveLoanAssets } from '../actions/loanAssets'
import { saveProtocolContracts } from '../actions/protocolContracts'
import { saveProvider } from '../actions/providers'

// Web3
import Web3 from 'web3'

class App extends Component {

  componentDidMount() {
    this.loadInitialData()
  }

  loadInitialData = async () => {
    const { dispatch } = this.props

    let web3, accounts
    try {
      web3 = new Web3(window.ethereum)
      accounts = await web3.eth.getAccounts()
    } catch (e) {
      console.log(e)
    }

    // Check network
    const networkId = await web3.eth.net.getId()
    const network = networkId == 1 ? 'mainnet' : networkId == 3 ? 'ropsten' : networkId == 4 ? 'rinkeby' : ''

    dispatch(saveProvider({ blockchain: 'ethereum', network }))

    getLoanAssets({ blockchain: 'ETH', network: network })
      .then(data => data.json())
      .then((res) => {
        console.log(res)
        dispatch(saveLoanAssets(res.payload))
      })

    getProtocolContracts()
      .then(data => data.json())
      .then((res) => {
        console.log(res)
        dispatch(saveProtocolContracts(res.payload))
      })
  }

  render() {

    const { loading, match } = this.props

    return (
      <Router>
        <Fragment>
          {
            loading === true
              ? <Loading />
              :
              <Fragment>
                <Route path='/app' exact component={Home} />
                <Route path='/app/borrow' component={BorrowDashboard} />
                <Route path='/app/lend' exact component={Lend} />
                <Route path='/app/lend/:contractAddress' component={NewLoan} />
                {/* <Route path='/admin' component={Admin} /> */}
              </Fragment>
          }
        </Fragment>
      </Router>
    )
  }
}


function mapStateToProps({ loading }) {
  return {
    loading
  }
}

export default connect(mapStateToProps)(App)