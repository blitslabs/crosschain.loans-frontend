import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

class Footer extends Component {
    render() {
        return (
            <footer className="footer-area footer-fixed" >
                {/* Footer Top */}
                <div className="footer-top ptb_100" >
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-sm-6 col-lg-3">
                                {/* Footer Items */}
                                <div className="footer-items" >
                                    {/* Logo */}
                                    <a className="navbar-brand" href="#">
                                        <img className="logo" src="assets/images/logo_white.png" style={{ width: '60%' }} />
                                    </a>

                                    {/* Social Icons */}
                                    <div className="social-icons d-flex" >
                                        <a className="blits" style={{ background: 'black !important' }} href="https://twitter.com/blitslabs">
                                            <i className="fab fa-twitter" />
                                            <i className="fab fa-twitter" />
                                        </a>
                                        <a className="blits" href="https://t.me/blitslabs">
                                            <i className="fab fa-telegram" />
                                            <i className="fab fa-telegram" />
                                        </a>
                                        <a className="blits" href="https://medium.com/@blitslabs">
                                            <i className="fab fa-medium" />
                                            <i className="fab fa-medium" />
                                        </a>
                                        <a className="blits" href="https://github.com/blitslabs">
                                            <i className="fab fa-github" />
                                            <i className="fab fa-github" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3">
                                {/* Footer Items */}
                                <div className="footer-items">
                                    {/* Footer Title */}
                                    <h3 className="footer-title mb-2" style={{ color: 'white' }}>Useful Links</h3>
                                    <ul>
                                        <li className="py-2">
                                            <a className="footer-link" href="#">Wallet</a>
                                        </li>
                                        <li className="py-2">
                                            <a className="footer-link" href="#">Atomic Loans</a>
                                        </li>
                                        <li className="py-2">
                                            <a className="footer-link" href="#">Docs</a>
                                        </li>
                                        <li className="py-2">
                                            <a className="footer-link" href="#">Blog</a>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3">
                                {/* Footer Items */}
                                <div className="footer-items">
                                    {/* Footer Title */}
                                    <h3 className="footer-title mb-2" style={{ color: 'white' }}>Product Help</h3>
                                    <ul>
                                        <li className="py-2">
                                            <a className="footer-link" href="#">FAQ</a>
                                        </li>
                                        <li className="py-2">
                                            <a className="footer-link" href="#">Privacy Policy</a>
                                        </li>
                                        <li className="py-2">
                                            <a className="footer-link" href="#">Terms &amp; Conditions</a>
                                        </li>
                                        <li className="py-2">
                                            <a className="footer-link" href="#">Contact</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3">
                                {/* Footer Items */}
                                <div className="footer-items">
                                    {/* Footer Title */}
                                    <h3 className="footer-title mb-2" style={{ color: 'white' }}>Coming Soon!</h3>
                                    {/* Store Buttons */}
                                    <div className="button-group store-buttons store-black d-flex flex-wrap">
                                        <a href="#">
                                            <img src="assets/img/icon/google-play.png" />
                                        </a>
                                        <a href="#">
                                            <img src="assets/img/icon/app-store.png" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                {/* Footer Bottom */}
                < div className="footer-bottom" >
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                {/* Copyright Area */}
                                <div className="copyright-area d-flex flex-wrap justify-content-center justify-content-sm-between text-center py-4">
                                    {/* Copyright Left */}
                                    <div className="copyright-left">
                                        © Copyrights 2020. Blits Labs All rights reserved.
                            </div>
                                    {/* Copyright Right */}
                                    <div className="copyright-right">
                                        Built  with  <i className="fas fa-heart" /> on {" "}
                                        <a className="dark-link" href="https://harmony.one">Harmony</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </footer >
           
        )
    }
}

function mapStateToProps({ preCreditRequest, preFormController }) {
    return {

    }
}

export default connect(mapStateToProps)(Footer)