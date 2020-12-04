import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'

// Actions
import { setProviderStatus } from '../../../actions/shared'
import { saveAccount } from '../../../actions/accounts'

Modal.setAppElement('#root')

class DownloadModal extends Component {

    handleDownloadBtn = (e) => {
        e.preventDefault()
        window.open('https://chrome.google.com/webstore/detail/harmony/bjaeebonnimhcakeckbnemejhdpngdmd')
    }

    render() {

        const { isOpen, missingWallet, toggleModal } = this.props

        return (
            <Modal
                isOpen={isOpen}
                style={customStyles}
            >
                <div className="row" style={{ padding: '20px 50px 10px 50px' }}>
                    <div className="col-12 text-center">
                        <div className="modal-wallet-title mb-4" style={{ color: '#a42fff' }}>Wallet Not Detected!</div>
                        <div className="modal-wallet-title mb-4">Download & Install Wallet</div>
                        <div className="row ">
                            <div className="col-sm-12 col-md-12 text-center mt-4">
                                {
                                    missingWallet === 'ONE'
                                        ?
                                        (
                                            <Fragment>
                                                <img style={{ height: '48px' }} src={process.env.SERVER_HOST + '/assets/images/one_logo.png'} />
                                                <div className="modal-wallet-name mt-4">Harmony ONE Wallet</div>
                                            </Fragment>
                                        )
                                        :
                                        (
                                            <Fragment>
                                                <img style={{ height: '48px' }} src={process.env.SERVER_HOST + '/assets/images/metamask_logo.png'} />
                                                <div className="modal-wallet-name mt-4">Metamask Wallet</div>
                                            </Fragment>
                                        )
                                }
                                <button onClick={this.handleDownloadBtn} className="btn btn-blits mt-4">Go to Download</button>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-12 text-center">
                                <button className="btn btn-blits-white" onClick={(e) => { e.preventDefault(); toggleModal(false) }}>Cancel</button>
                            </div>
                        </div>
                    </div>
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

function mapStateToProps({ shared }) {
    return {
        shared
    }
}

export default connect(mapStateToProps)(DownloadModal)