import React, { Component, Fragment } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'

// Components
import LoansHome from './Loans/LoansHome'
import NewLoan from './Loans/NewLoan'
import ConfirmLoan from './Loans/ConfirmLoan'
import BorrowDashboard from './Loans/BorrowDashboard'
import LoanDetails from './Loans/LoanDetails'
import MyLoans from './Loans/MyLoans'
import Activity from './Loans/Activity'
import LoanCreated from './Loans/LoanCreated'
// import SelectAsset from './Loans/SelectAsset'

// Styles
import './Loans/loans_styles.css'

class AppRouter extends Component {
    render() {
        const { match, auth } = this.props

        return (
            <Fragment>
                <Route path={match.path} exact component={LoansHome} />
                <Route path={`${match.path}loans`} exact component={LoansHome} />
                <Route path={`${match.path}borrow`} component={BorrowDashboard} />
                <Route path={`${match.path}lend`} exact={true} component={NewLoan} />
                <Route path={`${match.path}lend/confirm`} component={ConfirmLoan} />
                <Route path={`${match.path}loan/:loanId`} component={LoanDetails} />
                <Route path={`${match.path}myloans`} component={MyLoans} />
                <Route path={`${match.path}activity`} component={Activity} />                
                <Route path={`${match.path}loan_created`} component={LoanCreated} />
            </Fragment>
        )
    }
}

function PrivateRoute({ component: Component, ...rest }) {
    const { auth } = rest
    return (
        <Route
            {...rest}
            render={props =>
                auth !== null ? (
                    <Component {...props} />
                )
                    : (
                        <Redirect
                            to={{
                                pathname: '/admin/login',
                                state: { from: props.location.pathname }
                            }}
                        />
                    )
            }
        />
    )
}

function mapStateToProps({ auth }) {
    return {

        auth
    }
}

export default connect(mapStateToProps)(AppRouter)



