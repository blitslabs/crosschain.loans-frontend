import {
    SET_PROVIDER_STATUS, TOGGLE_SIDEBAR,
    SAVE_NETWORK, SAVE_NOTIFICATION_EMAIL,
    SAVE_ACCOUNT, SAVE_SELECTED_COLLATERAL_ASSET,
    CHANGE_THEME, TOGGLE_TESTNET_DATA,
    SAVE_REFERRER
} from '../actions/shared'

const initialState = {
    sidebar: false,
    collatera_asset: 'ONE',
    theme: 'dark',
    hide_testnet_data: true,
}

export default function shared(state = initialState, action) {
    switch (action.type) {
        case SAVE_NOTIFICATION_EMAIL:
            return {
                ...state,
                email: action.email
            }

        case SET_PROVIDER_STATUS:
            return {
                ...state,
                [action.providerStatus.name]: action.providerStatus.status
            }

        case SAVE_NETWORK:
            return {
                ...state,
                networkId: action.networkId
            }

        case SAVE_SELECTED_COLLATERAL_ASSET:
            return {
                ...state,
                collateral_asset: action.asset
            }

        case SAVE_ACCOUNT:
            return {
                ...state,
                account: action.account
            }

        case TOGGLE_SIDEBAR:
            return {
                ...state,
                sidebar: action.sidebar
            }

        case CHANGE_THEME:
            return {
                ...state,
                theme: action.theme
            }

        case TOGGLE_TESTNET_DATA:
            return {
                ...state,
                hide_testnet_data: action.value
            }

        case SAVE_REFERRER:
            return {
                ...state,
                referrer: action.referrer
            }

        default:
            return state
    }
}