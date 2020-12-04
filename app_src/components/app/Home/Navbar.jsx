import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'


class Navbar extends Component {
    render() {
        return (

            < header className="navbar navbar-sticky navbar-expand-lg navbar-dark" >
                <div className="container position-relative">
                    <a className="navbar-brand" href="index.html">
                        <img
                            className="navbar-brand-regular"
                            src="assets/images/logo.png"
                            alt="brand-logo"
                        />
                        <img
                            className="navbar-brand-sticky"
                            src="assets/img/logo/logo.png"
                            alt="sticky brand-logo"
                        />
                    </a>
                    <button
                        className="navbar-toggler d-lg-none"
                        type="button"
                        data-toggle="navbarToggler"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="navbar-inner">
                        {/*  Mobile Menu Toggler */}
                        <button
                            className="navbar-toggler d-lg-none"
                            type="button"
                            data-toggle="navbarToggler"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <nav>
                            <ul className="navbar-nav" id="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link scroll" href="#">Wallet</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link scroll" href="#">Atomic Loans</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link scroll" href="#">Docs</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link scroll" href="#">Blog</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header >

        )
    }
}

function mapStateToProps({ preCreditRequest, preFormController }) {
    return {

    }
}

export default connect(mapStateToProps)(Navbar)