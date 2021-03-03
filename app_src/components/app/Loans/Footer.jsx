import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class Footer extends Component {
    render() {

        const { shared } = this.props
        return (
            <footer className="footer-three">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="footer">
                                <div className="footer-nav-wrapper">
                                    <nav className="footer-widget">
                                        <h5>Protocol</h5>
                                        <ul>
                                            <li>
                                                <Link to={'/app/faq'}>FAQ</Link>
                                            </li>
                                            <li>
                                                <Link to={'/app/risks'}>Risks</Link>
                                            </li>
                                            <li>
                                                <a href="#">Documentation (coming soon)</a>
                                            </li>
                                            <li>
                                                <a href="#">Tutorials (coming soon)</a>
                                            </li>
                                        </ul>
                                    </nav>
                                    {/* widget end */}
                                    <nav className="footer-widget">
                                        <h5>Useful Links</h5>
                                        <ul>
                                            <li>
                                                <a href="https://github.com/blitslabs/crosschain.loans-contracts">Github</a>
                                            </li>
                                            <li>
                                                <a href="https://twitter.com/crosschainloans">Twitter</a>
                                            </li>
                                            <li>
                                                <a href="https://t.me/blitslabs">Telegram</a>
                                            </li>
                                            <li>
                                                <a href="https://medium.com/blits-labs">Blog</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                                <div className="footer-about">
                                    <div className="brand-logo">
                                        <a href="#">
                                            <img className="navigation-main__logo" src={process.env.SERVER_HOST + ((shared?.theme === 'dark' || !shared?.theme) ? '/assets/images/logo_white.png' : '/assets/images/logo.png')} alt="blits logo" />
                                        </a>
                                    </div>
                                    <p className="brand-info">
                                        <span className="brand__name">Developed By <a href="https://blits.net">Blits Labs</a></span>
                                        <br />
                                    </p>
                                    {/* <ul className="footer-social">
                                        <li>
                                            <a target="_blank" href="https://twitter.com/blitslabs">
                                                <i className="fa fa-twitter" />
                                            </a>
                                        </li>
                                        <li>
                                            <a target="_blank" href="https://t.me/blitslabs">
                                                <i className="fa fa-telegram" />
                                            </a>
                                        </li>
                                        <li>
                                            <a target="_blank" href="https://medium.com/@blitslabs">
                                                <i className="fa fa-medium" />
                                            </a>
                                        </li>
                                        <li>
                                            <a target="_blank" href="https://github.com/blitslabs">
                                                <i className="fa fa-github" />
                                            </a>
                                        </li>
                                        <li>
                                            <a target="_blank" href="https://instagram.com/@blitslabs">
                                                <i className="fa fa-instagram" />
                                            </a>
                                        </li>
                                        <li>
                                            <a target="_blank" href="https://facebook.com/blitslabs">
                                                <i className="fa fa-facebook" />
                                            </a>
                                        </li>
                                    </ul> */}
                                </div>
                                {/* about end */}
                            </div>
                        </div>
                    </div>
                </div>

            </footer>

        )
    }
}

function mapStateToProps({ shared }) {
    return {
        shared
    }
}

export default connect(mapStateToProps)(Footer)