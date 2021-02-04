import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'



// API
import { getPrices } from '../../../utils/api'

// Actions
import { savePrices } from '../../../actions/prices'
import { setProviderStatus, toggleSidebar } from '../../../actions/shared'
import { saveAccount } from '../../../actions/accounts'

// Libraries
import Emoji from "react-emoji-render"
import Web3 from 'web3'
import ONE from '../../../crypto/ONE'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MediaQuery from 'react-responsive'
import Gravatar from 'react-gravatar'

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

        // if (networkId != 3) {
        //     toast.error('Please connect to the Ropsten Network', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, });
        // }

        if (window.ethereum && accounts.length > 0) {
            dispatch(setProviderStatus({ name: 'ethereum', status: true }))
            dispatch(saveAccount({ blockchain: 'ETH', account: accounts[0] }))
        } else {
            dispatch(setProviderStatus({ name: 'ethereum', status: false }))
            dispatch(saveAccount({ blockchain: 'ETH', account: '' }))
        }

        let harmonyAccount
        try {
            const res = await ONE.getAccount()
            if (res.status === 'OK') {
                harmonyAccount = res.payload
            }
        } catch (e) {
            console.log(e)
        }

        if (harmonyAccount) {
            dispatch(setProviderStatus({ name: 'harmony', status: true }))
            dispatch(saveAccount({ blockchain: 'ONE', account: harmonyAccount.address }))
        } else {
            dispatch(setProviderStatus({ name: 'harmony', status: false }))
        }
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
                                            <img className="navigation-main__logo" src={process.env.SERVER_HOST + '/assets/images/logo.png'} alt="blits logo" />
                                            <img className="sticky-nav__logo" src={process.env.SERVER_HOST + '/assets/images/logo_white.png'} alt="blits logo" />
                                        </a>
                                        <button onClick={this.toggleMenu} className="navigation__toggler" />
                                        {/* offcanvas toggle button */}
                                        <nav className={sidebar ? "navigation-wrapper offcanvas__is-open" : "navigation-wrapper"}>
                                            <button onClick={this.toggleMenu} className="offcanvas__close">✕</button>
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
                                                {
                                                    accounts?.ETH
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
                                            !accounts?.ETH
                                                ?
                                                <div className="navigation-button navigation-button-couple">
                                                    <button onClick={() => this.handleToggleConnectModal(true)} style={{ backgroundColor: 'black' }} className="db-btn nav-cta-btn navigation-button-couple__fill">Connect</button>
                                                </div>
                                                :
                                                <div className="navigation-menu__item">
                                                    <Gravatar
                                                        email={accounts?.ETH}
                                                        size={30}
                                                        rating="pg" default="retro" className="gravatar"
                                                    />
                                                    <a href="#" className='navigation-menu__link'>ETH: {accounts?.ETH?.substring(0, 4)}...{accounts?.ETH?.substring(accounts?.ETH?.length - 4)}</a>
                                                </div>
                                        }

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
                                            <img className="navigation-main__logo" src={process.env.SERVER_HOST + '/assets/images/logo.png'} alt="blits logo" />
                                            <img className="sticky-nav__logo" src={process.env.SERVER_HOST + '/assets/images/logo_white.png'} alt="blits logo" />
                                        </a>
                                        <button onClick={this.toggleMenu} className="navigation__toggler" />
                                        {/* offcanvas toggle button */}
                                        <nav className={sidebar ? "navigation-wrapper offcanvas__is-open" : "navigation-wrapper"}>
                                            <button onClick={this.toggleMenu} className="offcanvas__close">✕</button>
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
                                                {
                                                    accounts?.ETH
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
                                            !accounts?.ETH
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