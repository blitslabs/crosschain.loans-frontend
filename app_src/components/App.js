import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'



// import withAuth from './withAuth'
// import withAdminAuth from './withAdminAuth'

import Home from './app/Home/Home'

// App Router
import AppRouter from './app/AppRouter'

// Admin Router
// import Admin from './admin/Admin'

import './styles.css'

class App extends Component {

  componentDidMount() {
    //this.props.dispatch(handleInitialData())
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
              <Route path='/' component={AppRouter} />
              
              {/* <Route path='/admin' component={Admin} /> */}
            </Fragment>
          }
        </Fragment>
      </Router>
    )
  }
}


function mapStateToProps({  loading }) {
  return {    
    loading
  }
}

export default connect(mapStateToProps)(App)