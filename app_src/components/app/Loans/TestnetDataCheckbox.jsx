import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { toggleTestnetData } from '../../../actions/shared'

class TestnetDataCheckbox extends Component {

    toggleHideTestnet = (e) => {
        const { shared, dispatch } = this.props
        dispatch(toggleTestnetData(shared?.hide_testnet_data === true ? false : true))
    }

    render() {
        const { shared } = this.props
        return (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <input onChange={this.toggleHideTestnet} checked={shared?.hide_testnet_data === true ? true : false} type="checkbox" style={{ marginTop: '5px' }} />
                <div style={{ marginLeft: '10px' }}>Hide Testnet Loans</div>
            </div>
        )
    }
}

function mapStateToProps({ shared }) {
    return {
        shared
    }
}

export default connect(mapStateToProps)(TestnetDataCheckbox)