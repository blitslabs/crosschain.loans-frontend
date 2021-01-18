import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import Loading from '../../Loading'


// Components
import Modal from 'react-modal'

// API
import { subscribeEmail } from '../../../utils/api'

// Styles
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#212529',

    },
    overlay: {
        backgroundColor: '#0000004a',
        zIndex: 1000
    },
    parent: {
        overflow: 'hidden',
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
}

Modal.setAppElement('body')

// styles
import '../styles.css'


class Home extends Component {

    state = {
        modalIsOpen: false,
        email: '',
        emailIsInvalid: false,
        subscribed: false,
        serverMsg: ''
    }

    handleOpenModal = (e) => {
        e.preventDefault()
        this.setState({ modalIsOpen: true })
    }

    handleCloseModal = (e) => {
        e.preventDefault()
        this.setState({ modalIsOpen: false })
    }

    handleEmailChange = (e) => {

        if (!this.validateEmail(e.target.value)) {
            this.setState({ emailIsInvalid: true, emailErrorMsg: 'Ingresa un correo electrónico válido' })
        } else {
            this.setState({ emailIsInvalid: false, emailErrorMsg: 'Este campo es obligatorio.' })
        }

        this.setState({ email: e.target.value })
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    handleSubscribeBtn = (e) => {
        e.preventDefault()
        const { email, emailIsInvalid } = this.state

        if (!email || emailIsInvalid) {
            this.setState({ emailIsInvalid: true })
            return
        }

        subscribeEmail({ email })
            .then(data => data.json())
            .then((res) => {
                console.log(res)
                if (res.status === 'OK') {
                    this.setState({ email: '', subscribed: true, serverMsg: res.message })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    componentDidMount() {

    }

    handleScrollToTop() {
        window.scrollTo(0, 0)
    }


    render() {
        const { loading } = this.state

        // if (loading == true) {            
        //     return <Loading />
        // }

        return (


            <div className="main-wrapper home-13 layout-strong">
                {/* =========== Navigation Start ============ */}
                <header className="navigation navigation__transparent navigation__caps navigation__separate navigation__right navigation__btn-fill">
                    <div className="container-full">
                        <div className="row">
                            <div className="col-12">
                                <div className="navigation-content">
                                    <a href="#" className="navigation__brand">
                                        <img className="navigation-main__logo" src="assets/images/logo_white_full.png" alt="blits logo" />
                                        <img className="sticky-nav__logo" src="assets/images/logo_white.png" alt="blits logo" />
                                    </a>
                                    <button className="navigation__toggler" />
                                    {/* offcanvas toggle button */}
                                    <nav className="navigation-wrapper">
                                        <button className="offcanvas__close">✕</button>
                                        {/* offcanvas close button */}
                                        <ul className="navigation-menu" id="nav">
                                            <li className="navigation-menu__item">
                                                <a className="navigation-menu__link" href="#feature">Features</a>
                                            </li>
                                            <li className="navigation-menu__item">
                                                <a className="navigation-menu__link" target="_blank" href="#">Telegram</a>
                                            </li>
                                            <li className="navigation-menu__item">
                                                <a className="navigation-menu__link" href="#">Blog</a>
                                            </li>
                                            <li className="navigation-menu__item">
                                                <a className="navigation-menu__link" href="https://crosschain.loans">crosschain.loans</a>
                                            </li>
                                            {/* <li class="navigation-menu__item">
                                                      <a class="navigation-menu__link" href="#">Pages</a>
                                                      
                                                      <ul class="navigation-dropdown">
                                                          <li class="navigation-menu__item">
                                                              <a class="navigation-menu__link" href="#">Blog</a>
                                                              <ul class="navigation-dropdown">
                                                                  <li class="navigation-menu__item">
                                                                      <a class="navigation-menu__link"
                                                                          href="blog-right-sidebar.html">Blog Right Sidebar</a>
                                                                  </li>
                                                                  <li class="navigation-menu__item">
                                                                      <a class="navigation-menu__link"
                                                                          href="blog-left-sidebar.html">Blog Left Sidebar</a>
                                                                  </li>
                                                                  <li class="navigation-menu__item">
                                                                      <a class="navigation-menu__link" href="blog-full.html">Blog
                                                                          Full</a>
                                                                  </li>
                                                                  <li class="navigation-menu__item">
                                                                      <a class="navigation-menu__link"
                                                                          href="blog-details-right-sidebar.html">Blog details Right
                                                                          Sidebar</a>
                                                                  </li>
                                                                  <li class="navigation-menu__item">
                                                                      <a class="navigation-menu__link"
                                                                          href="blog-details-left-sidebar.html">Blog Details Left
                                                                          Sidebar</a>
                                                                  </li>
                                                                  <li class="navigation-menu__item">
                                                                      <a class="navigation-menu__link"
                                                                          href="blog-details-full.html">Blog Details Full</a>
                                                                  </li>
                                                              </ul>
                                                          </li>
                                                          <li class="navigation-menu__item">
                                                              <a class="navigation-menu__link" href="#">Download</a>
                                                              <ul class="navigation-dropdown algin-left">
                                                                  <li class="navigation-menu__item">
                                                                      <a class="navigation-menu__link" href="download.html">Download
                                                                          One</a>
                                                                  </li>
                                                                  <li class="navigation-menu__item">
                                                                      <a class="navigation-menu__link" href="download-2.html">Download
                                                                          Two</a>
                                                                  </li>
                                                              </ul>
              
                                                          </li>
                                                          <li class="navigation-menu__item">
                                                              <a class="navigation-menu__link" href="reviews.html">Reviews Page</a>
                                                          </li>
                                                          <li class="navigation-menu__item">
                                                              <a class="navigation-menu__link" href="faq.html">FAQs</a>
                                                          </li>
                                                          <li class="navigation-menu__item">
                                                              <a class="navigation-menu__link" href="sign-in.html">Login</a>
                                                          </li>
                                                          <li class="navigation-menu__item">
                                                              <a class="navigation-menu__link" href="sign-up.html">Sign up</a>
                                                          </li>
                                                          <li class="navigation-menu__item">
                                                              <a class="navigation-menu__link" href="thank-you.html">Thank you</a>
                                                          </li>
                                                          <li class="navigation-menu__item">
                                                              <a class="navigation-menu__link" href="404.html">Error Page</a>
                                                          </li>
                                                      </ul>
                                                  </li> */}
                                        </ul>
                                    </nav>
                                    {/* nav item end */}
                                    <div className="navigation-button navigation-button-couple">
                                        <a href="#download" style={{ backgroundColor: 'black' }} className="db-btn nav-cta-btn navigation-button-couple__fill">Download</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* row end */}
                    </div>
                </header>
                {/* =========== Navigation End ============ */}
                {/* =========== Hero Start ============ */}
                <section className="hero-thirteen hero-text-light content-left ">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="hero">
                                    <div className="hero-wrapper">
                                        <div className="hero-content">
                                            <h1 className="hero__title">Decentralized Finance for Humans</h1>
                                            <p className="hero__caption">Download Wallet</p>
                                            <a href="https://play.google.com/store/apps/details?id=com.blits.wallet">
                                                <img style={{ height: '62px' }} src="assets/images/play.png" />
                                            </a>
                                            <a href="https://apps.apple.com/app/blits-wallet/id1533509547">
                                                <img style={{ height: '60px' }} src="assets/images/Appstore.png" />
                                            </a>
                                        </div>
                                        <div className="hero-media reveal">
                                            <picture className="hero-media__img">
                                                <img src="assets/images/m12.png" alt="blits wallet" />
                                            </picture>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span className="hero__wave">
                        <img className="svg hero__wave--svg" src="assets/dist/layout/hero-wave-13.svg" alt="hero-wave" />
                    </span>
                </section>
                {/* =========== Hero End ============ */}
                {/* =========== Features-4 Start ============ */}
                <section className="features-four" id="feature">
                    <div className="container">
                        {/* section title row end */}
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <div className="feature">
                                    <span className="feature__icon">
                                        <img style={{ height: 'auto', width: '100px' }} src="assets/images/wallet.png" />
                                    </span>
                                    <h5 className="feature__title">Non-custodial</h5>
                                    <p className="feature__description">You never share your private keys so only you control your
                                  assets.</p>
                                </div>
                            </div>
                            {/* single item end */}
                            <div className="col-12 col-md-4">
                                <div className="feature">
                                    <span className="feature__icon">
                                        <img style={{ height: 'auto', width: '100px' }} src="assets/images/shield_check.png" />
                                    </span>
                                    <h5 className="feature__title">Secure</h5>
                                    <p className="feature__description">Manage your Harmony, Ethereum, HRC20, HRC721, ERC20 &amp; ERC721
                                  Tokens in a trustless manner.</p>
                                </div>
                            </div>
                            {/* single item end */}
                            <div className="col-12 col-md-4">
                                <div className="feature">
                                    <span className="feature__icon">
                                        <img style={{ height: 'auto', width: '100px' }} src="assets/images/graph.png" />
                                    </span>
                                    <h5 className="feature__title">DeFi</h5>
                                    <p className="feature__description">The easiest way to access DEFI protocols across multiple
                                  Harmony &amp; Ethereum.</p>
                                </div>
                            </div>
                            {/* single item end */}
                        </div>
                        {/* row end */}
                    </div>
                </section>
                {/* =========== Features-4 End ============ */}
                {/* =========== Features-2 Start ============ */}
                <section className="features-two" id="feature" style={{ paddingTop: '0px !important' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="section-title" style={{ marginBottom: '5.25rem !important' }}>
                                    <h2>Welcome to a New DeFi Experience</h2>
                                </div>
                            </div>
                            {/* section title end */}
                        </div>
                        {/* section title row end */}
                        <div className="row">
                            <div className="col-12 col-md-11 offset-md-1">
                                <div className="feature-wrapper">
                                    <ul className="feature">
                                        <li className="feature__list">
                                            <span className="feature__icon" />
                                            <div>
                                                <h5 className="feature__title">Mobile Native DeFi Protocols</h5>
                                                <p className="feature__description">All of your favorite DeFi protocols for the
                                        mobile world.</p>
                                            </div>
                                        </li>
                                        {/* single item end */}
                                        <li className="feature__list">
                                            <span className="feature__icon" />
                                            <div>
                                                <h5 className="feature__title">Cross-chain DeFi</h5>
                                                <p className="feature__description">Explore new DeFi worlds beyond the Ethereum
                                        blockchain.</p>
                                            </div>
                                        </li>
                                        {/* single item end */}
                                        <li className="feature__list">
                                            <span className="feature__icon" />
                                            <div>
                                                <h5 className="feature__title">CeFi - DeFi Interoperability</h5>
                                                <p className="feature__description">Combine the best of Tradicional Finance and DeFi
                                                in a seamless experience.
                                      </p>
                                            </div>
                                        </li>
                                        {/* single item end */}
                                    </ul>
                                    {/* feature content end */}
                                    <div id="wallet_mockup_02" className="feature-media reveal">
                                        <picture className="feature-media__img">
                                            <source srcSet="assets/images/mockup_white_hd-min.png" media="(min-width: 768px)" />
                                            <img style={{ maxWidth: '450px' }} src="assets/images/mockup_white_hd-min.png" alt="features--smaller" />
                                        </picture>
                                    </div>
                                    {/* media content end */}
                                </div>
                            </div>
                        </div>
                        {/* row end */}
                    </div>
                </section>
                {/* =========== Features-2 End ============ */}
                {/* =========== switchable content End ============ */}
                <section className="switchable switchable-2" style={{ marginTop: '5rem' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="switchable-wrapper">
                                    <div className="switchable-content">
                                        <h2 className="switchable__title">DeFi For Everyone</h2>
                                        <p className="switchable__description">We make DeFi protocols easy to use and understand by
                                        building human-focused interfaces and seamless integration between Tradicional
                                        Finance and Decentralized Finance.
                                  </p>
                                    </div>
                                    {/* content end */}
                                    <div id="globe-img" className="switchable-media reveal">
                                        <picture className="switchable-media__img">
                                            <img style={{ height: 'auto', maxWidth: '200px' }} src="assets/images/globe.png" alt="" />
                                        </picture>
                                        {/* media end */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* row end */}
                    </div>
                </section>
                {/* =========== switchable content End ============ */}
                {/* =========== switchable content start ============ */}
                <section className="switchable switchable-2 reverse">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="switchable-wrapper">
                                    <div className="switchable-content">
                                        <h2 className="switchable__title">Decentralized Economy (DeEco)</h2>
                                        <p className="switchable__description">First we Decentralize Finance, then we Decentralize
                                        the Economy, then we Decentralize the World.
                                  </p>
                                    </div>
                                    {/* content end */}
                                    <div id="puzzle-img" className="switchable-media reveal">
                                        <picture className="switchable-media__img">
                                            <img style={{ height: 'auto', maxWidth: '200px' }} src="assets/images/puzzle.png" alt="" />
                                        </picture>
                                        {/* media end */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* row end */}
                    </div>
                </section>
                {/* =========== switchable content End ============ */}
                {/* =========== Testimonial-3 Start ============ */}
                <section className="testimonial-three" id="testimonial">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="section-title">
                                    <h2>What People Are Saying About <a target="_blank" href="https://twitter.com/blitslabs">@blitslabs</a></h2>
                                </div>
                            </div>
                            {/* section title end */}
                        </div>
                        {/* section title row end */}
                        <div className="row">
                            <div className="col-12">
                                <div className="testimonial reveal">
                                    <div className="testimonial-item">
                                        <div className="testimonial-content">
                                            <div>
                                                <blockquote className="twitter-tweet" width="“325">
                                                    <p lang="en" dir="ltr">can't wait for this to pop up on the app
                                          store! <br /><br />impressed by the <a href="https://twitter.com/blitslabs?ref_src=twsrc%5Etfw">@blitslabs</a>
                                          team's execution. <a href="https://t.co/SEYu0kRGhU">https://t.co/SEYu0kRGhU</a></p>
                                        — Li Jiang 🎽 (@lijiang2087) <a href="https://twitter.com/lijiang2087/status/1346225607584133120?ref_src=twsrc%5Etfw">January
                                          4, 2021</a>
                                                </blockquote>
                                            </div>
                                        </div>
                                    </div>
                                    {/* single item end */}
                                    <div className="testimonial-item">
                                        <div className="testimonial-content">
                                            <div>
                                                <blockquote className="twitter-tweet">
                                                    <p lang="en" dir="ltr">Blits is a GO 🚀🚀🚀 <a href="https://t.co/DmLU3XLas3">https://t.co/DmLU3XLas3</a></p>
                                        — Crypto's Wolf Of All Streets (@danboyden) <a href="https://twitter.com/danboyden/status/1346221268497006597?ref_src=twsrc%5Etfw">January
                                          4, 2021</a>
                                                </blockquote>
                                            </div>
                                        </div>
                                    </div>
                                    {/* single item end */}
                                    {/* single item end */}
                                    <div className="testimonial-item">
                                        <div className="testimonial-content">
                                            <div>
                                                <blockquote className="twitter-tweet">
                                                    <p lang="en" dir="ltr">Congrats to the <a href="https://twitter.com/blitslabs?ref_src=twsrc%5Etfw">@blitslabs</a>
                                          team. Our community is very excited for this. <a href="https://t.co/2ZpjNeZkzw">https://t.co/2ZpjNeZkzw</a> <a href="https://t.co/sC8tDwsxqv">pic.twitter.com/sC8tDwsxqv</a></p>
                                        — Harmony (@harmonyprotocol) <a href="https://twitter.com/harmonyprotocol/status/1346230318794084353?ref_src=twsrc%5Etfw">January
                                          4, 2021</a>
                                                </blockquote>
                                            </div>
                                        </div>
                                    </div>
                                    {/* single item end */}
                                    {/* single item end */}
                                    <div className="testimonial-item">
                                        <div className="testimonial-content">
                                            <div>
                                                <blockquote className="twitter-tweet">
                                                    <p lang="en" dir="ltr">anticipating, good work by <a href="https://twitter.com/blitslabs?ref_src=twsrc%5Etfw">@blitslabs</a>
                                                        <a href="https://t.co/rkI4cOirPt">https://t.co/rkI4cOirPt</a>
                                                    </p>—
                                        Leo Chen (@leo_hao) <a href="https://twitter.com/leo_hao/status/1346222290195738624?ref_src=twsrc%5Etfw">January
                                          4, 2021</a>
                                                </blockquote>
                                            </div>
                                        </div>
                                    </div>
                                    {/* single item end */}
                                </div>
                            </div>
                        </div>
                        {/* testimonial row end */}
                    </div>
                </section>
                {/* =========== Testimonial-3 End ============ */}
                {/* =========== cta-3 Start ============ */}
                <section id="download" className="cta-one" style={{ backgroundColor: 'black', paddingTop: '20px' }}>
                    <img src="assets/images/shape-1.svg" alt="" className="media__content" />
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-lg-11 offset-lg-1">
                                <div className="cta-wrapper reveal">
                                    <div className="cta-content">
                                        <h2 className="cta__title" style={{ color: 'white' }}>Download Blits Wallet Now</h2>
                                        <p className="cta__description" style={{ color: 'white' }}>
                                            Supported Blockchains: <br />
                                    - Harmony (ONE)<br />
                                    - Ethereum (ETH)<br />
                                        </p>
                                        {/* title end */}
                                        <div className="cta__buttons">
                                            <a href="https://play.google.com/store/apps/details?id=com.blits.wallet" className="db-btn db-btn__type-sm db-btn__outline">
                                                <i className="db-btn__icon nc-icon nc-ic_android_48px" />Play store
                                    </a>
                                            <a href="https://apps.apple.com/app/blits-wallet/id1533509547" className="db-btn db-btn__type-sm db-btn__outline">
                                                <i className="db-btn__icon nc-icon nc-apple" /> App store
                                    </a>
                                        </div>
                                    </div>
                                    {/* content end */}
                                    <div className="cta-media">
                                        <picture className="cta-media__img">
                                            <source srcSet="assets/images/mockup_front.png" media="(min-width: 1200px)" />
                                            <source srcSet="assets/images/mockup_front.png" media="(min-width: 992px)" />
                                            <img style={{ height: 'auto', width: '300px', marginRight: '100px', marginBottom: '30px' }} src="assets/images/mockup_front.png" alt="cta-mobile" />
                                        </picture>
                                    </div>
                                    {/* media content end */}
                                </div>
                            </div>
                        </div>
                        {/* row end */}
                    </div>
                </section>
                {/* =========== cta-3 End ============ */}
                {/* =========== footer-2 End ============ */}
                <footer className="footer-three">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="footer">
                                    <div className="footer-nav-wrapper">
                                        <nav className="footer-widget">
                                            <h5>Useful Links</h5>
                                            <ul>
                                                <li>
                                                    <a href="https://crosschain.loans">Cross-chain Loans</a>
                                                </li>
                                                <li>
                                                    <a href="https://blits.net/blog">Blog</a>
                                                </li>
                                                <li>
                                                    <a href="https://twitter.com/blitslabs">Twitter</a>
                                                </li>
                                            </ul>
                                        </nav>
                                        {/* widget end */}
                                        <nav className="footer-widget">
                                            <h5>Product Help</h5>
                                            <ul>
                                                <li>
                                                    <a href="https://blits.net/faq">FAQ</a>
                                                </li>
                                                <li>
                                                    <a href="https://t.me/blitslabs">Telegram</a>
                                                </li>
                                                <li>
                                                    <a href="https://blits.net/privacy">Privacy Policy</a>
                                                </li>
                                                <li>
                                                    <a href="https://blits.net/terms">Terms</a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                    <div className="footer-about">
                                        <div className="brand-logo">
                                            <a href="#">
                                                <img style={{ height: '40px' }} src="assets/images/logo.png" alt="blits labs logo" />
                                            </a>
                                        </div>
                                        <p className="brand-info">
                                            <span className="brand__name">Genesis Block SAPI de CV</span>
                                            <br />
                                        </p>
                                        <ul className="footer-social">
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
                                        </ul>
                                    </div>
                                    {/* about end */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="footer-bottom-wrapper">
                                        <nav className="footer-bottom-nav">
                                            <a href="https://blits.net/privacy">Privacy Policy</a>
                                            <a href="https://blits.net/terms">Terms and Conditions</a>
                                        </nav>
                                        <div className="footer-copyright">
                                            <span className="footer-copyright__text">© 2020-2021 Copyright, All Rights Reserved by
                                      <a href="#">Blits Labs</a>
                                            </span>
                                        </div>
                                        {/* copyright content end */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
                {/* =========== footer-2 End ============ */}
            </div>
        );




    }
}

function mapStateToProps({ }) {
    return {

    }
}

export default connect(mapStateToProps)(Home)