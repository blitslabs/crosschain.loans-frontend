import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import Loading from '../../Loading'
import Navbar from './Navbar'
import Header from './Header'
import Footer from './Footer'

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
            <div>
                {/* {this.state.loading ? <Loading /> : null} */}
                
                <div className="preloader-main">
                    <div className="preloader-wapper">
                        <svg className="preloader" xmlns="http://www.w3.org/2000/svg" version="1.1" width="600" height="200">
                            <defs>
                                <filter id="goo" x="-40%" y="-40%" height="200%" width="400%">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" result="goo" />
                                </filter>
                            </defs>
                            <g filter="url(#goo)">
                                <circle className="dot" cx="50" cy="50" r="25" fill="#32ccdd" />
                                <circle className="dot" cx="50" cy="50" r="25" fill="#32ccdd" />
                            </g>
                        </svg>
                        <div>
                            <div className="loader-section section-left"></div>
                            <div className="loader-section section-right"></div>
                        </div>
                    </div>
                </div>
                {/*====== Scroll To Top Area Start ======*/}
                <div onClick={this.handleScrollToTop} id="scrollUp" title="Scroll To Top">
                    <i className="fas fa-arrow-up" />
                </div>
                {/*====== Scroll To Top Area End ======*/}
                <div ref={ this.cointainer} className="main">

                    <Navbar />
                    <Header />

                    {/* ***** Features Area Start ***** */}
                    <section
                        id="features"
                        className="section features-area style-two overflow-hidden pt-5 "
                        style={{ paddingBottom: '100px', backgroundColor: '#f8f9fa' }}
                    >
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-10 col-lg-7">
                                    {/* Section Heading */}
                                    <div className="section-heading text-center">
                                        <span className="d-inline-block rounded-pill shadow-sm fw-5 px-4 py-2 mb-3">
                                            <i className="far fa-lightbulb text-primary mr-1" />
                                            <span className="text-primary">Ecosystem</span>
                                        </span>

                                        <h2>Products</h2>
                                        <p className="d-none d-sm-block mt-4">
                                            Enter the future of finance
                                        </p>
                                        {/* <p className="d-block d-sm-none mt-4">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                            Laborum obcaecati.
                                        </p> */}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-4 res-margin">
                                    {/* Image Box */}
                                    <div
                                        className="image-box text-center icon-1 p-5 wow fadeInLeft"
                                        data-wow-delay="0.4s"
                                    >
                                        {/* Featured Image */}
                                        <div className="featured-img mb-3">
                                            <img
                                                className="avatar-sm"
                                                src="assets/images/layers.png"

                                            />
                                        </div>
                                        {/* Icon Text */}
                                        <div className="icon-text">
                                            <h3 className="mb-2">DEFI Wallet</h3>
                                            <p>
                                                Get direct & easy access to DEFI protocols on multiple blockchains.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4 res-margin">
                                    {/* Image Box */}
                                    <div
                                        className="image-box text-center icon-1 p-5 wow fadeInUp"
                                        data-wow-delay="0.2s"
                                    >
                                        {/* Featured Image */}
                                        <div className="featured-img mb-3">
                                            <img
                                                className="avatar-sm"
                                                src="assets/images/atomic_loan_icon.png"

                                            />
                                        </div>
                                        {/* Icon Text */}
                                        <div className="icon-text">
                                            <h3 className="mb-2">Atomic Loans</h3>
                                            <p>
                                                Get liquidity across blockchains without selling your assets.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-4">
                                    {/* Image Box */}
                                    <div
                                        className="image-box text-center icon-1 p-5 wow fadeInRight"
                                        data-wow-delay="0.4s"
                                    >
                                        {/* Featured Image */}
                                        <div className="featured-img mb-3">
                                            <img
                                                className="avatar-sm"
                                                src="assets/images/stablecoin.png"

                                            />
                                        </div>
                                        {/* Icon Text */}
                                        <div className="icon-text">
                                            <h3 className="mb-2">Stablecoin</h3>
                                            <p>
                                                Go from Fiat to DEFI in seconds (Coming soon).
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* ***** Features Area End ***** */}
                    {/* ***** Service Area Start ***** */}
                    <section className="section service-area bg-gray overflow-hidden ptb_100" style={{ backgroundColor: 'white' }}>
                        <div className="container">
                            <div className="row justify-content-between align-items-center">
                                <div className="col-12 col-lg-6 order-2 order-lg-1">
                                    {/* Service Text */}
                                    <div className="service-text pt-4 pt-lg-0">
                                        <h2 className="text-capitalize mb-4">Wallet</h2>


                                        {/* Service List */}
                                        <ul className="service-list">
                                            {/* Single Service */}
                                            <li className="single-service media py-2">
                                                <div className="service-icon pr-4">
                                                    <span>
                                                        <i className="fab fa-buffer" />
                                                    </span>
                                                </div>
                                                <div className="service-text media-body">
                                                    <div className="feature-text mt-3"><span style={{ color: '#32ccdd' }}>Multicoin:</span> Manage your Harmony, Ethereum, HRC20, HRC721, ERC20 & ERC721 Tokens</div>
                                                </div>
                                            </li>
                                            {/* Single Service */}
                                            <li className="single-service media py-2">
                                                <div className="service-icon pr-4">
                                                    <span>
                                                        <i className="fas fa-lock" />
                                                    </span>
                                                </div>
                                                <div className="service-text media-body">
                                                    <div className="feature-text mt-3"><span style={{ color: '#32ccdd' }}>Non-custodial:</span> You never share your private keys so only you control your assets.</div>
                                                </div>
                                            </li>
                                            {/* Single Service */}
                                            <li className="single-service media py-2">
                                                <div className="service-icon pr-4">
                                                    <span>
                                                        <i className="fas fa-burn" />
                                                    </span>
                                                </div>
                                                <div className="service-text media-body">
                                                    <div className="feature-text mt-3"><span style={{ color: '#32ccdd' }}>DEFI:</span> The easiest way to access DEFI protocols across multiple Harmony & Ethereum.</div>
                                                </div>
                                            </li>
                                            {/* Single Service */}

                                        </ul>

                                    </div>
                                </div>
                                <div className="col-12 col-lg-6 order-1 order-lg-2 d-none d-lg-block " >

                                    {/* Service Thumb */}
                                    <div className="service-thumb mx-auto  text-center">
                                        <img style={{ borderRadius: '1.5rem', maxWidth: '80%' }} className="vcenter" src="assets/images/blits_compressed.gif" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* ***** Service Area End ***** */}
                    {/* ***** Discover Area Start ***** */}
                    <section className="section discover-area overflow-hidden ptb_100">
                        <div className="container">
                            <div className="row justify-content-between">
                                <div className="col-12 col-lg-6 order-2 order-lg-1">
                                    {/* Discover Thumb */}
                                    <div className="service-thumb discover-thumb mx-auto pt-5 pt-lg-0">
                                        <img src="assets/images/atomic_loan-3.svg" />
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6 order-1 order-lg-2">
                                    {/* Discover Text */}
                                    <div className="discover-text pt-4 pt-lg-0">
                                        <h2 className="pb-4 pb-sm-0">Atomic Loans</h2>


                                        <p className="d-none d-sm-block pt-3 pb-4">
                                            Cross-chain collaterized loans allow people to borrow Ethereum-based stablecoins while locking Harmony as collateral, or vice versa.
                                            
                                        </p>
                                        {/* Check List */}
                                        <ul className="check-list">
                                            <li className="py-1">
                                                {/* List Box */}
                                                <div className="list-box media">
                                                    <span className="icon align-self-center">
                                                        <i className="fas fa-check" />
                                                    </span>
                                                    <span className="media-body pl-2">
                                                        Combined with a handful of model sentence structures looks
                                                        reasonable.
                                                    </span>
                                                </div>
                                            </li>
                                            <li className="py-1">
                                                {/* List Box */}
                                                <div className="list-box media">
                                                    <span className="icon align-self-center">
                                                        <i className="fas fa-check" />
                                                    </span>
                                                    <span className="media-body pl-2">
                                                        Without intermediaries (Non-custodial).
                                                    </span>
                                                </div>
                                            </li>
                                            <li className="py-1">
                                                {/* List Box */}
                                                <div className="list-box media">
                                                    <span className="icon align-self-center">
                                                        <i className="fas fa-check" />
                                                    </span>
                                                    <span className="media-body pl-2">
                                                        Across Blockchains (Cross-chain).
                                                    </span>
                                                </div>
                                            </li>
                                            <li className="py-1">
                                                {/* List Box */}
                                                <div className="list-box media">
                                                    <span className="icon align-self-center">
                                                        <i className="fas fa-check" />
                                                    </span>
                                                    <span className="media-body pl-2">
                                                        Get liquidity without selling your assets.
                                                    </span>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="icon-box d-flex mt-3">
                                            <div className="service-icon">
                                                <span>
                                                    <i className="fas fa-book" />
                                                </span>
                                            </div>
                                            <div className="service-icon px-3">
                                                <span>
                                                    <i className="fab fa-github" />
                                                </span>
                                            </div>
                                            <div className="service-icon">
                                                <span>
                                                    <i className="fas fa-video" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* ***** Discover Area End ***** */}
                    {/* ***** Work Area Start ***** */}
                    <section className="section work-area bg-overlay overflow-hidden ptb_100" style={{ background: 'rgb(0 0 0)' }}>
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-12 col-lg-6">
                                    {/* Work Content */}
                                    <div className="work-content text-center">
                                        <h2 className="text-white">How to get an <span style={{ color: '#32ccdd' }}>Atomic Loan</span>?</h2>
                                        <p className="text-white my-3 mt-sm-4 mb-sm-5">
                                            Non-custodial Cross-chain loans (Atomic Loans) allow users to borrow/lend assets across different Blockchains
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-md-4">
                                    {/* Single Work */}
                                    <div className="single-work text-center p-3">
                                        {/* Work Icon */}
                                        <div className="work-icon">
                                            <img
                                                className="avatar-md"
                                                src="assets/img/icon/work/app-blits.png"

                                            />
                                        </div>
                                        <h3 className="text-white py-3">1. Loan Terms</h3>
                                        <p className="text-white">
                                            Select the amount, length and collateralization rate.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    {/* Single Work */}
                                    <div className="single-work text-center p-3">
                                        {/* Work Icon */}
                                        <div className="work-icon">
                                            <img
                                                className="avatar-md"
                                                src="assets/img/icon/work/settings-blits.png"

                                            />
                                        </div>
                                        <h3 className="text-white py-3">2. Collaterize your Loan</h3>
                                        <p className="text-white">
                                            Secure your loan with Harmony (ONE) or Ethereum (ETH) directly from your wallet or the web platform.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    {/* Single Work */}
                                    <div className="single-work text-center p-3">
                                        {/* Work Icon */}
                                        <div className="work-icon">
                                            <img
                                                className="avatar-md"
                                                src="assets/img/icon/work/download-blits.png"

                                            />
                                        </div>
                                        <h3 className="text-white py-3">3. Withdraw your stablecoin</h3>
                                        <p className="text-white">
                                            Withdraw stablecoins on the Harmony or Ethereum blockchain.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* ***** Work Area End ***** */}



                    {/* ***** FAQ Area Start ***** */}
                    <section className="section faq-area style-two ptb_100">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-10 col-lg-7">
                                    {/* Section Heading */}
                                    <div className="section-heading text-center">
                                        <h2 className="text-capitalize">Frequently asked questions</h2>
                                        {/* <p className="d-none d-sm-block mt-4">
                                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                            Laborum obcaecati dignissimos quae quo ad iste ipsum officiis
                                            deleniti asperiores sit.
                                        </p> */}
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center" >
                                <div className="col-12">
                                    {/* FAQ Content */}
                                    <div className="faq-content">
                                        {/* sApp Accordion */}
                                        <div className="accordion" id="sApp-accordion">
                                            <div className="row justify-content-center">
                                                <div className="col-12 col-md-6">
                                                    {/* Single Card */}
                                                    <div className="card border-0">
                                                        {/* Card Header */}
                                                        <div className="card-header bg-inherit border-0 p-0">
                                                            <h2 className="mb-0">
                                                                <button className="btn px-0 py-3" type="button">
                                                                    How do Atomic Loans work?
                                                                </button>
                                                            </h2>
                                                        </div>
                                                        {/* Card Body */}
                                                        <div className="card-body px-0 py-3">
                                                            The protocol uses Hashed Time Lock Contracts (HTLC) on the Harmony and Ethereum blockchains to facilitate trustless exchange and the collateralization of loans without a central authority.
                                                        </div>
                                                    </div>
                                                    {/* Single Card */}
                                                    <div className="card border-0">
                                                        {/* Card Header */}
                                                        <div className="card-header bg-inherit border-0 p-0">
                                                            <h2 className="mb-0">
                                                                <button className="btn px-0 py-3" type="button">
                                                                    Why do we need Non-custodial Cross-chain loans?
                                                                </button>
                                                            </h2>
                                                        </div>
                                                        {/* Card Body */}
                                                        <div className="card-body px-0 py-3">
                                                            Atomic Loans allow us to create interoperability between Ethereum (where the majority of the DEFI ecosystem is locked) and other blockains like Harmony where we can take advantage of the lower fees and fast finality.
                                                        </div>
                                                    </div>
                                                    {/* Single Card */}
                                                    <div className="card border-0">
                                                        {/* Card Header */}
                                                        <div className="card-header bg-inherit border-0 p-0">
                                                            <h2 className="mb-0">
                                                                <button className="btn px-0 py-3" type="button">
                                                                   What's a Hashed Time Lock Contract (HTLC)?
                                                                </button>
                                                            </h2>
                                                        </div>
                                                        {/* Card Body */}
                                                        <div className="card-body px-0 py-3">
                                                            A HTLC enables a user to lock funds and have another part redeem them using a preimage (or secret). If they do not redeem the funds within the lock time, the original party can refund the amount.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    {/* Single Card */}
                                                    <div className="card border-0">
                                                        {/* Card Header */}
                                                        <div className="card-header bg-inherit border-0 p-0">
                                                            <h2 className="mb-0">
                                                                <button className="btn px-0 py-3" type="button">
                                                                    What Assets will it support?
                                                                </button>
                                                            </h2>
                                                        </div>
                                                        {/* Card Body */}
                                                        <div className="card-body px-0 py-3">
                                                            At launch, users will be able to borrow/lend stablecoins (on the Harmony or Ethereum blockchains) using ONE or ETH as collateral.
                                                        </div>
                                                    </div>
                                                    {/* Single Card */}
                                                    <div className="card border-0">
                                                        {/* Card Header */}
                                                        <div className="card-header bg-inherit border-0 p-0">
                                                            <h2 className="mb-0">
                                                                <button className="btn px-0 py-3" type="button">
                                                                    How to interact with the Smart Contracts?
                                                                </button>
                                                            </h2>
                                                        </div>
                                                        {/* Card Body */}
                                                        <div className="card-body px-0 py-3">
                                                            Users will be able to interact with the Smart Contracts system through a web interface using browser extensions and through the Blits mobile wallet.
                                                        </div>
                                                    </div>
                                                    {/* Single Card */}
                                                    <div className="card border-0">
                                                        {/* Card Header */}
                                                        <div className="card-header bg-inherit border-0 p-0">
                                                            <h2 className="mb-0">
                                                                <button className="btn px-0 py-3" type="button">
                                                                    Why should I use it instead of Centralized Crypto-Backed Loans?
                                                                </button>
                                                            </h2>
                                                        </div>
                                                        {/* Card Body */}
                                                        <div className="card-body px-0 py-3">
                                                            Centralized lending solutions require users to deposit assets into a centralized escrow. Thus, these loans require users to trust a central party that can seize or steal the funds at any moment. With Non-custodial loans you never have to give up your private keys or trust a central escrow.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row justify-content-center">
                                                <p className="text-body text-center pt-4 fw-5">
                                                    Haven't find suitable answer?{" "}
                                                    <a href="#">Contact Us</a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* ***** FAQ Area End ***** */}

                    {/* ***** Download Area Start ***** */}
                    <section className="section download-area overlay-dark overylay-blits ptb_100">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-10 col-lg-8">
                                    {/* Download Text */}
                                    <div className="download-text text-center">
                                        <h2 className="text-white">Coming Soon!</h2>
                                        <p className="text-white my-3 d-none d-sm-block">
                                            Blits Wallet will available on iOS and Android devices. Subscribe to get updates and get early access.
                                        </p>
                                        
                                        {/* Store Buttons */}
                                        <div className="button-group store-buttons d-flex justify-content-center">
                                            <a href="#">
                                                <img src="assets/img/icon/google-play.png" />
                                            </a>
                                            <a href="#">
                                                <img src="assets/img/icon/app-store.png" />
                                            </a>
                                        </div>
                                        <span className="d-inline-block text-white fw-3 font-italic mt-3">
                                            * Android and iOS devices
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* ***** Download Area End ***** */}
                    {/* ***** Subscribe Area Start ***** */}
                    <section className="section subscribe-area ptb_100">
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-10 col-lg-7">
                                    <div className="subscribe-content text-center">
                                        <h2>Subscribe to get updates</h2>
                                        <p className="my-4">
                                            By subscribing you will get newsleter, you will be able to get Early Access and other amazing benefits!
                                            </p>
                                        {/* Subscribe Form */}
                                        <div className="subscribe-form">
                                            {/* <div className="form-group">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="exampleInputEmail1"
                                                    aria-describedby="emailHelp"
                                                    placeholder="Enter your email"
                                                />
                                            </div> */}
                                            <button onClick={this.handleOpenModal} className="btn btn-lg btn-block">
                                                Subscribe
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* ***** Subscribe Area End ***** */}

                    {/*====== Height Emulator Area Start ======*/}
                    <div className="height-emulator d-none d-lg-block" />
                    {/*====== Height Emulator Area End ======*/}

                    <Modal
                        isOpen={this.state.modalIsOpen}
                        onAfterOpen={this.afterOpenModal}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        contentLabel="Modal"
                    >
                        <div className="row">
                            <div className="col-12 text-center p-5">
                                <div style={{ position: 'absolute', right: '10px', top: '-10px' }}><button onClick={this.handleCloseModal} className="icon-btn"><i style={{ color: 'white' }} className="fa fa-times-circle" style={{ fontSize: '26px', color: 'white' }}></i></button></div>
                                <h2 className="modal-title">Subscribe to Get Early Access!</h2>
                                <img className="modal-image mt-4" src="assets/images/blits_rocket.png" alt="" />

                                {this.state.subscribed === false
                                    ?
                                    <Fragment>
                                        <div className="form-group">
                                            <input onChange={this.handleEmailChange} placeholder="Enter your email" type="text" className={this.state.emailIsInvalid ? 'form-control is-invalid mt-4' : 'form-control mt-4'} />
                                            <div className="invalid-feedback">Enter a valid email</div>
                                        </div>
                                        <button onClick={this.handleSubscribeBtn} className="btn btn-blits " style={{ width: '100%' }}>Subscribe</button>
                                    </Fragment>
                                    :
                                    <h3 className="text-white mt-3">{this.state.serverMsg}</h3>
                                }
                            </div>
                        </div>
                    </Modal>                       
                    <Footer />
                </div>
            </div>

        )
    }
}

function mapStateToProps({  }) {
    return {

    }
}

export default connect(mapStateToProps)(Home)