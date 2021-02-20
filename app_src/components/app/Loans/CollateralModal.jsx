import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'

// Actions
import { saveSelectedCollateralAsset } from '../../../actions/shared'

// API
import { saveEmailNotification } from '../../../utils/api'

Modal.setAppElement('#root')

class CollateralModal extends Component {

    state = {
        selectedAsset: ''
    }

    handleSaveBtn = (e) => {
        e.preventDefault()
        const { selectedAsset } = this.state
        const { lockCollateral, toggleModal, dispatch } = this.props
        dispatch(saveSelectedCollateralAsset(selectedAsset))
        lockCollateral(selectedAsset)
        toggleModal(false)
    }

    render() {

        const { isOpen, toggleModal } = this.props
        const { selectedAsset } = this.state

        return (
            <Modal
                isOpen={isOpen}
                style={customStyles}
            >

                <button onClick={() => toggleModal(false)} className="btn btn-blits-white" style={{ right: '20px', top: '20px', position: 'absolute', padding: '5px' }}>x</button>

                <div className="row" style={{ padding: '20px 50px 10px 50px' }}>

                    <div className="col-12 text-center">
                        <div className="modal-wallet-title mb-4">Select the Asset you want to use as Collateral</div>

                        <div className="row ">
                            <div className="col-sm-12">
                                <div className="row">
                                    <div className="col-6 text-center" style={{ padding: 0 }}>
                                        <button onClick={() => this.setState({ selectedAsset: 'ONE' })} className="btn asset-select-btn" style={selectedAsset === 'ONE' ? { background: 'black' } : {}}>
                                            <img style={{ height: 80 }} src={process.env.API_HOST + `/logo/ONE/ONE`} />
                                            <div className="asset-select-text" style={selectedAsset === 'ONE' ? { color: 'white' } : { color: 'black' }}>Harmony (ONE)</div>
                                        </button>
                                    </div>
                                    <div className="col-6 text-center" style={{ padding: 0 }}>
                                        <button onClick={() => this.setState({ selectedAsset: 'BNB' })} className="btn asset-select-btn" style={selectedAsset === 'BNB' ? { background: 'black' } : {}}>
                                            <img style={{ height: 80 }} src={process.env.API_HOST + `/logo/BNB/BNB`} />
                                            <div className="asset-select-text" style={selectedAsset === 'BNB' ? { color: 'white' } : { color: 'black' }}>Binance Coin (BNB)</div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="row mt-4">
                            <div className="col-12 text-center">
                                <button disabled={selectedAsset == '' ? true : false} style={{ width: '100%' }} className="btn btn-blits-blits" onClick={this.handleSaveBtn}>Lock Collateral</button>
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

function mapStateToProps({ shared, accounts }) {
    return {
        shared,
        accounts
    }
}

export default connect(mapStateToProps)(CollateralModal)