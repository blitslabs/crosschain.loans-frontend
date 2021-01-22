import React, { Component, Fragment } from 'react'
import { Link, withRouter } from "react-router-dom"
import { connect } from 'react-redux'
import BlitsLoans from '../../../crypto/BlitsLoans'
import ETH from '../../../crypto/ETH'
import BigNumber from 'bignumber.js'

// Actions
import { saveAssetType } from '../../../actions/assetTypes'
import { saveLendRequest } from '../../../actions/lendRequest'

class AssetCard extends Component {

    state = {
        apy: '-',
        liquidity: '-'
    }

    componentDidMount() {
        this.loadAssetTypeData()
    }

    loadAssetTypeData = async () => {
        const { protocolContracts, providers, asset, dispatch } = this.props

        let account, assetTypeData, liquidity
        if (asset.blockchain === 'ETH') {
            const contract = protocolContracts[providers.ethereum].CrosschainLoans.address
            assetTypeData = await BlitsLoans.ETH.getAssetTypeData(
                asset.contractAddress,
                contract
            )
            dispatch(saveAssetType({ contractAddress: asset.contractAddress, ...assetTypeData }))

            const apy = parseFloat(BigNumber(assetTypeData.interestRate).multipliedBy(12).multipliedBy(100)).toFixed(2)
            liquidity = (await ETH.getERC20Balance(contract, asset.contractAddress)).payload
            this.setState({
                apy,
                liquidity,
            })
        }
    }

    handleLendBtn = (e) => {
        e.preventDefault()
        const { dispatch, asset, history } = this.props
        dispatch(saveLendRequest({ contractAddress: asset.contractAddress }))
        history.push('lend/new')
    }

    render() {
        const { asset } = this.props
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
                            <div className="card-value">{asset.blockchain}</div>
                        </div>
                    </div>
                    <div className="col-6 text-right">
                        <div>
                            <div className="card-title">APY</div>
                            <div className="card-value">{apy}%</div>
                        </div>
                        <div>
                            <div className="card-title">Liquidity</div>
                            <div className="card-value">${liquidity}</div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12">
                        <button onClick={this.handleLendBtn} className="btn" style={{ width: '100%' }}>LEND</button>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps({ protocolContracts, providers }) {
    return {
        protocolContracts,
        providers
    }
}

export default connect(mapStateToProps)(withRouter(AssetCard))