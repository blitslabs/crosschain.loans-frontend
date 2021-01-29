import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import Loading from '../../Loading'


// Components
import Modal from 'react-modal'
import Navbar from './Navbar'

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

    componentDidMount() {
        console.log('hello world')
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
        console.log('test')
        const { loading } = this.state

        // if (loading == true) {            
        //     return <Loading />
        // }

        return (


            <Fragment>
                <Navbar/>
                
            </Fragment>
        );




    }
}

function mapStateToProps({ }) {
    return {

    }
}

export default connect(mapStateToProps)(Home)