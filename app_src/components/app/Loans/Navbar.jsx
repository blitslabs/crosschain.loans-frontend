import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

// API
import { getPrices } from '../../../utils/api'

// Actions
import { savePrices } from '../../../actions/prices'
import { changeTheme, toggleSidebar } from '../../../actions/shared'
import { saveAccount } from '../../../actions/accounts'

// Libraries
import Emoji from "react-emoji-render"
import Web3 from 'web3'
import ONE from '../../../crypto/ONE'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MediaQuery from 'react-responsive'
import Gravatar from 'react-gravatar'
import { NETWORKS, MAINNET_NETWORKS } from '../../../crypto/Networks'

// Components
import ConnectModal from './ConnectModal'

class Navbar extends Component {

    state = {
        ethereum: false,
        onewallet: false,
        showConnectModal: false,
    }

    componentDidMount() {
        const { dispatch, providers } = this.props

        if (!(providers?.ethereum !== 'mainnet' || providers?.ethereum !== 'testnet')) {
            toast.error('Network not supported. Please switch to Mainnet or Ropsten', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
        }

        dispatch(toggleSidebar(false))
        // getPrices()
        //     .then(data => data.json())
        //     .then((res) => {
        //         console.log(res)
        //         if (res.status === 'OK') {
        //             dispatch(savePrices(res.payload))
        //         }
        //     })

        // this.loandInitialData()

        document.body.addEventListener('click', () => {
            const { dispatch, shared } = this.props
            if (shared.sidebar === true) {
                dispatch(toggleSidebar(false))
            }
        })
    }

    loandInitialData = async () => {

    }

    handleToggleConnectModal = async (value) => this.setState({ showConnectModal: value })

    handleMobileNavbarBtn = (e) => {
        e.preventDefault()
        const { shared, dispatch } = this.props
        dispatch(toggleSidebar(!shared.sidebar))
    }

    toggleMenu = (e) => {
        e.preventDefault()        
        const { dispatch, shared } = this.props
        dispatch(toggleSidebar(!shared.sidebar))
    }

    closeMenu = (e) => {
        e.preventDefault()
        const { dispatch } = this.props
        dispatch(toggleSidebar(false))
    }

    toggleTheme = (e) => {
        e.preventDefault()
        const { shared, dispatch } = this.props
        if (shared?.theme === 'dark') {
            dispatch(changeTheme('light'))
        } else {
            dispatch(changeTheme('dark'))
        }
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

    render() {

        const { showConnectModal } = this.state
        const { shared, accounts } = this.props
        const { sidebar } = shared

        return (
            <Fragment>
                <ToastContainer />
                {/* =========== Navigation Start ============ */}
                <MediaQuery minDeviceWidth={1224}>
                    <header className={sidebar ? 'navigation navigation__transparent navigation__caps navigation__separate navigation__right navigation__btn-fill navigation__portrait offcanvas__overlay' : 'navigation navigation__transparent navigation__caps navigation__separate navigation__right navigation__btn-fill navigation__landscape'}>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="navigation-content">
                                        <a href="#" className="navigation__brand">
                                            <img className="navigation-main__logo" src={process.env.SERVER_HOST + ((shared?.theme === 'dark' || !shared?.theme) ? '/assets/images/logo_white.png' : '/assets/images/logo.png')} alt="blits logo" />
                                            <img className="sticky-nav__logo" src={process.env.SERVER_HOST + '/assets/images/logo_white.png'} alt="blits logo" />
                                        </a>
                                        <button onClick={this.toggleMenu} className="navigation__toggler" />
                                        {/* offcanvas toggle button */}
                                        <nav className={sidebar ? "navigation-wrapper offcanvas__is-open" : "navigation-wrapper"}>
                                            <button onClick={this.closeMenu} className="offcanvas__close">✕</button>
                                            {/* offcanvas close button */}
                                            <ul className="navigation-menu" id="nav">

                                                <li className="navigation-menu__item">
                                                    <Link className="navigation-menu__link" to="/app/borrow">Borrow</Link>
                                                </li>
                                                <li className="navigation-menu__item">
                                                    <Link className="navigation-menu__link" to="/app/lend">Lend</Link>
                                                </li>
                                                <li className="navigation-menu__item">
                                                    <Link className="navigation-menu__link" to="/app/activity">Activity</Link>
                                                </li>
                                                <li className="navigation-menu__item">
                                                    <Link className="navigation-menu__link" to="/app/referrals">Referrals</Link>
                                                </li>
                                                <li className="navigation-menu__item">
                                                    <Link className="navigation-menu__link" to="/app/supported_networks">Networks</Link>
                                                </li>
                                                {
                                                    shared?.account
                                                        ?
                                                        <li className="navigation-menu__item">
                                                            <Link className="navigation-menu__link" to="/app/myloans">My Loans</Link>
                                                        </li>
                                                        : null
                                                }
                                            </ul>
                                        </nav>

                                        {/* nav item end */}
                                        {
                                            !shared?.account
                                                ?
                                                <div className="navigation-button navigation-button-couple">
                                                    <button onClick={() => this.handleToggleConnectModal(true)} style={{ backgroundColor: 'black' }} className="db-btn nav-cta-btn navigation-button-couple__fill">Connect</button>
                                                </div>
                                                :
                                                <div className="navigation-menu__item">
                                                    <Gravatar
                                                        email={shared?.account}
                                                        size={30}
                                                        rating="pg" default="retro" className="gravatar"
                                                    />
                                                    <a id="#wallet_details" href="#" className='navigation-menu__link'>{NETWORKS[shared?.networkId] ? NETWORKS[shared?.networkId] : 'unsupported network'}: {shared?.account?.substring(0, 4)}...{shared?.account?.substring(shared?.account?.length - 4)}</a>
                                                </div>
                                        }

                                        <button onClick={this.toggleTheme} className="" style={{ marginLeft: '15px', background: 'transparent' }}>
                                            {
                                                shared?.theme === 'dark' || !shared?.theme
                                                    ? <i className="fa fa-sun" style={{ color: 'white' }} />
                                                    : <i className="fa fa-moon" style={{ color: 'black' }} />
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* row end */}
                        </div>
                    </header>
                </MediaQuery>
                <MediaQuery maxDeviceWidth={1224}>
                    <header className={sidebar ? 'navigation navigation__transparent navigation__caps navigation__separate navigation__right navigation__btn-fill navigation__portrait offcanvas__overlay' : 'navigation navigation__transparent navigation__caps navigation__separate navigation__right navigation__btn-fill navigation__portrait'}>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="navigation-content">
                                        <a href="#" className="navigation__brand">
                                            <img className="navigation-main__logo" src={process.env.SERVER_HOST + ((shared?.theme === 'dark' || !shared?.theme) ? '/assets/images/logo_white.png' : '/assets/images/logo.png')} alt="blits logo" />
                                            <img className="sticky-nav__logo" src={process.env.SERVER_HOST + '/assets/images/logo_white.png'} alt="blits logo" />
                                        </a>
                                        <button onClick={this.toggleMenu} className="navigation__toggler" />
                                        {/* offcanvas toggle button */}
                                        <nav className={sidebar ? "navigation-wrapper offcanvas__is-open" : "navigation-wrapper"}>
                                            <button onClick={this.closeMenu} className="offcanvas__close">✕</button>
                                            {/* offcanvas close button */}
                                            <ul className="navigation-menu" id="nav">

                                                <li className="navigation-menu__item">
                                                    <Link className="navigation-menu__link nav-link" to="/app/borrow">Borrow</Link>
                                                </li>
                                                <li className="navigation-menu__item">
                                                    <Link className="navigation-menu__link nav-link" to="/app/lend">Lend</Link>
                                                </li>
                                                <li className="navigation-menu__item">
                                                    <Link className="navigation-menu__link nav-link" to="/app/activity">Activity</Link>
                                                </li>
                                                <li className="navigation-menu__item">
                                                    <Link className="navigation-menu__link nav-link" to="/app/referrals">Referrals</Link>
                                                </li>
                                                <li className="navigation-menu__item">
                                                    <Link className="navigation-menu__link nav-link" to="/app/supported_networks">Networks</Link>
                                                </li>
                                                {
                                                    shared?.account
                                                        ?
                                                        <li className="navigation-menu__item">
                                                            <Link className="navigation-menu__link nav-link" to="/app/myloans">My Loans</Link>
                                                        </li>
                                                        : null
                                                }

                                            </ul>
                                        </nav>
                                        {/* nav item end */}
                                        {
                                            !shared?.account
                                                ?
                                                <div className="navigation-button navigation-button-couple">
                                                    <button onClick={() => this.handleToggleConnectModal(true)} style={{ backgroundColor: 'black' }} className="db-btn nav-cta-btn navigation-button-couple__fill">Connect</button>
                                                </div>
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>
                            {/* row end */}
                        </div>
                    </header>
                </MediaQuery>
                <ConnectModal isOpen={showConnectModal} toggleModal={this.handleToggleConnectModal} />
            </Fragment >

        )
    }
}

function mapStateToProps({ shared, accounts, providers }) {
    return {
        shared,
        accounts,
        providers
    }
}

export default connect(mapStateToProps)(Navbar)