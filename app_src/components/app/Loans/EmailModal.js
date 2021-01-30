import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'

// Actions
import { saveProvider } from '../../../actions/providers'
import { saveNotificationEmail } from '../../../actions/shared'

// API
import { saveEmailNotification } from '../../../utils/api'

Modal.setAppElement('#root')

class EmailModal extends Component {

    state = {
        email: '',
        emailsIsInvalid: false,
        errorMsg: 'Enter a valid email',
        emailSave: false,
        emailSaved: false,
    }

    handleEmailChange = (e) => this.setState({ email: e.target.value })

    handleSaveBtn = (e) => {
        e.preventDefault()

        const { email } = this.state
        const { accounts, dispatch } = this.props

        if (!this.validEmail(email)) {
            this.setState({ emailsIsInvalid: true })
            return
        }

        const params = {
            email,
            account: accounts?.ETH
        }

        saveEmailNotification(params)
            .then(data => data.json())
            .then((res) => {
                console.log(res)
                if (res.status === 'OK') {
                    dispatch(saveNotificationEmail(email))
                    this.setState({ emailSaved: true })
                }
            })
    }

    validEmail(e) {
        var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
        return String(e).search(filter) != -1;
    }

    render() {

        const { isOpen, toggleModal } = this.props
        const { email, emailsIsInvalid, errorMsg, emailSaved } = this.state

        return (
            <Modal
                isOpen={isOpen}
                style={customStyles}
            >

                <button onClick={() => toggleModal(false)} className="btn btn-blits-white" style={{ right: '20px', top: '20px', position: 'absolute', padding: '5px' }}>x</button>

                <div className="row" style={{ padding: '20px 50px 10px 50px' }}>
                    {
                        emailSaved === false
                            ?
                            <div className="col-12 text-center">
                                <div className="modal-wallet-title mb-4">Enter your Email to receive updates on this loan</div>

                                <div className="row ">
                                    <div className="col-sm-12">
                                        <div className="input-group">
                                            <input autoFocus={true} style={{ height: '60px', border: '1px solid #bfbfbf', width: '100%', borderRadius: '5px', }} type='email' onChange={this.handleEmailChange} value={email} className={emailsIsInvalid ? "form-control is-invalid" : "form-control"} />
                                            <div className="invalid-feedback">
                                                {errorMsg}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="row mt-4">
                                    <div className="col-12 text-center">
                                        <button style={{ width: '100%' }} className="btn btn-blits-blits" onClick={this.handleSaveBtn}>Save</button>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="col-12 text-center">
                                <div className="modal-wallet-title mb-4">Email Saved! You'll receive notifications when the status of any of your loans is updated</div>

                                <i style={{ color: '#32ccdd', fontSize: '70px' }} className="fa fa-check"></i>

                                <div className="row mt-4">
                                    <div className="col-12 text-center">
                                        <button style={{ width: '100%' }} className="btn btn-blits-blits" onClick={() => toggleModal(false)}>Close</button>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </Modal>
        )
    }
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '25px',
        maxHeight: '100vh',
        width: '450px',
        maxWidth: '100%'
    },
    overlay: {
        backgroundColor: '#0000004a'
    },
    parent: {
        overflow: 'hidden',
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
}

function mapStateToProps({ shared, accounts }) {
    return {
        shared,
        accounts
    }
}

export default connect(mapStateToProps)(EmailModal)