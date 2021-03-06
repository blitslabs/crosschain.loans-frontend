import React, { Component, Fragment } from 'react'
import { Link, withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import BlitsLoans from '../../../crypto/BlitsLoans'
import ETH from '../../../crypto/ETH'
import BigNumber from 'bignumber.js'
import currencyFormatter from 'currency-formatter'

// Actions
import { saveAssetType } from '../../../actions/assetTypes'
import { saveLendRequest } from '../../../actions/lendRequest'

const NETWORKS = {
    '1': 'ETH-mainnet',
    '3': 'ETH-ropsten',
    '56': 'BNB-mainnet',
    '97': 'BNB-testnet',
    '1666600000': 'ONE-mainnet',
    '1666700000': 'ONE-testnet'
}

class AssetCard extends Component {

    state = {
        apy: '-',
        liquidity: '-',
        networkId: ''
    }

    componentDidMount() {
        const { shared } = this.props
        this.setState({ networkId: shared?.networkId })
        this.loadAssetTypeData()
    }

    componentWillReceiveProps(prevProps, prevState) {
        setTimeout(() => {
            this.loadAssetTypeData()
        }, 1000)
    }

    loadAssetTypeData = async () => {
        const { protocolContracts, shared, asset, dispatch } = this.props

        // Check Network
        if (asset?.networkId != shared?.networkId) {
            return
        }

        // Get Loans Contract
        const contract = protocolContracts[shared?.networkId].CrosschainLoans.address

        // Get AssetType data
        const assetTypeData = await BlitsLoans.ETH.getAssetTypeData(
            asset.contractAddress,
            contract
        )

        // Save AssetType data
        dispatch(saveAssetType({ contractAddress: asset.contractAddress, ...assetTypeData }))

        // Calculate APY
        const apy = parseFloat(BigNumber(assetTypeData.interestRate).multipliedBy(12).multipliedBy(100)).toFixed(2)

        // Get AssetType Liquidity
        const liquidity = (await ETH.getERC20Balance(contract, asset.contractAddress)).payload

        // Update APY & Liquidity
        this.setState({
            apy,
            liquidity,
        })
    }

    handleLendBtn = (e) => {
        e.preventDefault()
        const { dispatch, asset, history } = this.props
        dispatch(saveLendRequest({ contractAddress: asset.contractAddress }))
        history.push('lend/new')
    }

    render() {
        const { asset, shared } = this.props
        const { apy, liquidity } = this.state

        return (
            <div className="assetCard mt-4" >
                <div>
                    <img src={`${process.env.API_HOST}logo/${asset.blockchain}/${asset.symbol}`} style={{ height: 80 }} />
                </div>
                <div className="row pl-4 pr-4">
                    <div className="col-6 text-left">
                        <div>
                            <div className="card-title">Asset</div>
                            <div className="card-value">{asset.symbol}</div>
                        </div>
                        <div>
                            <div className="card-title">Blockchain</div>
                            <div className="card-value" style={{ fontSize: '16px' }}>{NETWORKS[asset?.networkId]}</div>
                        </div>
                    </div>
                    <div className="col-6 text-right">
                        <div>
                            <div className="card-title">APY</div>
                            <div className="card-value">{currencyFormatter.format(apy, { code: 'USD', symbol: '' })}%</div>
                        </div>
                        <div>
                            <div className="card-title">Liquidity Providing</div>
                            <div className="card-value" style={{ fontSize: 14 }}>{asset?.networkId == 56 || asset?.networkId == 97 ? 'Venus + Cross-chain Loans' : 'Cross-chain Loans'}</div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12">
                        <button
                            disabled={asset?.networkId != shared?.networkId ? true : false}
                            onClick={this.handleLendBtn} className="btn btn-blits"
                            style={{ width: '100%' }}
                        >
                            {asset?.networkId == shared?.networkId ? 'LEND' : `CONNECT ${NETWORKS[asset?.networkId]}`}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps({ protocolContracts, shared }) {
    return {
        protocolContracts,
        shared
    }
}

export default connect(mapStateToProps)(withRouter(AssetCard))