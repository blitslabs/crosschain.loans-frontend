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
import ConfirmLoan from './app/Loans/ConfirmLoan'
import LoanCreated from './app/Loans/LoanCreated'
import LoanDetails from './app/Loans/LoanDetails'
import Activity from './app/Loans/Activity'
import MyLoans from './app/Loans/MyLoans'
import SupportedNetworks from './app/Loans/SupportedNetworks'
// import './styles.css'

// API
import {
  getLoanAssets, getProtocolContracts, getPrices,
  getNotificationEmail
} from '../utils/api'

// Actions
import { saveLoanAssets } from '../actions/loanAssets'
import { saveProtocolContracts } from '../actions/protocolContracts'
import { saveProvider } from '../actions/providers'
import { savePrices } from '../actions/prices'
import { saveNotificationEmail, saveAccount, saveNetwork } from '../actions/shared'

// Web3
import Web3 from 'web3'


class App extends Component {

  componentDidMount() {
    const { shared } = this.props

    if(shared?.theme === 'dark' || !shared?.theme) {
      require('./styles_dark.css')
    } else {
      require('./styles.css')
    }
    this.loadInitialData()

 
    // document.querySelector('.navigation-menu__link').removeEventListener('click')
  }

  loadInitialData = async () => {
    const { dispatch } = this.props

    let web3, providerAccounts, networkId
    try {
      // Connect Provider
      web3 = new Web3(window.ethereum)

      // Get Connected Account
      providerAccounts = await web3.eth.getAccounts()

      // Save Account
      dispatch(saveAccount(providerAccounts[0]))

      // Save network
      networkId = await web3.eth.net.getId()
      dispatch(saveNetwork(networkId))

      setInterval(async () => {
        const { shared } = this.props

        // Get Network ID
        networkId = await web3.eth.net.getId()

        // Check if Network ID changed
        if (networkId != shared?.networkId) {
          dispatch(saveNetwork(networkId))
          // Reload ...
          // window.location.href = process.env.SERVER_HOST + '/app/borrow';
        }

        // Get Account
        providerAccounts = await web3.eth.getAccounts()
        const account = providerAccounts[0] !== undefined ? providerAccounts[0] : ''
        
        // Check if Account changed
        if (shared?.account != account) {
          dispatch(saveAccount(account))
          // window.location.href = process.env.SERVER_HOST + '/app/borrow';
        }

      }, 1000)

    } catch (e) {
      console.log(e)
    }

    // dispatch(saveNotificationEmail(''))
    getNotificationEmail({ account: providerAccounts[0] })
      .then(data => data.json())
      .then((res) => {
        console.log(res)
        if (res.status === 'OK') {
          const email = 'email' in res.payload && res.payload.email ? res.payload.email : ''
          console.log(email)
          dispatch(saveNotificationEmail(email))
          return
        }
        dispatch(saveNotificationEmail(''))
      })



    getLoanAssets({ networkId: 'ALL' })
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

    getPrices()
      .then(data => data.json())
      .then((res) => {
        dispatch(savePrices(res.payload))
      })

    setInterval(() => {
      getPrices()
        .then(data => data.json())
        .then((res) => {
          dispatch(savePrices(res.payload))
        })
    }, 60000)
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
                <Route path='/app' exact component={BorrowDashboard} />
                <Route path='/app/borrow' component={BorrowDashboard} />
                <Route path='/app/lend' exact component={Lend} />
                <Route path='/app/lend/new' component={NewLoan} />
                <Route path='/app/lend/confirm' component={ConfirmLoan} />
                <Route path='/app/lend/done' component={LoanCreated} />
                <Route path='/app/loan/:loanId' component={LoanDetails} />
                <Route path='/app/activity' component={Activity} />
                <Route path='/app/myloans' component={MyLoans} />
                <Route path='/app/supported_networks' component={SupportedNetworks} />
              </Fragment>
          }
        </Fragment>
      </Router>
    )
  }
}


function mapStateToProps({ loading, shared }) {
  return {
    loading,
    shared
  }
}

export default connect(mapStateToProps)(App)