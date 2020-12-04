import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

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

class Header extends Component {

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

    render() {
        return (
            <Fragment>
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
                <section
                    id="home"
                    className="section welcome-area bg-overlay overflow-hidden d-flex align-items-center"
                >
                    <div className="container">
                        <div className="row align-items-center">
                            {/* Welcome Intro Start */}
                            <div className="col-12 col-md-7 col-lg-7">
                                <div className="welcome-intro">
                                    <h1 className="">Decentralized Finance for Humans</h1>
                                    <p className="page-subtitle my-4">
                                        Borrow, Lend, Exchange, Send, Receive in one place.
                                </p>
                                    <div>
                                        <button onClick={this.handleOpenModal} className="btn btn-blits">Get Early Access</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-5 col-lg-5">
                                {/* Welcome Thumb */}

                                <div className="welcome-thumb mx-auto">
                                    <img className="wow fadeInRight" data-wow-delay='0.4s' style={{ visibility: 'visible', animationDelay: '0.4s', animationName: 'fadeInRight' }} src="assets/images/wallet1.png" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Shape Bottom */}
                </section>
            </Fragment>
        )
    }
}

function mapStateToProps({ preCreditRequest, preFormController }) {
    return {

    }
}

export default connect(mapStateToProps)(Header)