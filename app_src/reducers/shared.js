import {
    SET_PROVIDER_STATUS, TOGGLE_SIDEBAR,
    SAVE_NETWORK, SAVE_NOTIFICATION_EMAIL,
    SAVE_ACCOUNT
} from '../actions/shared'

const initialState = {
    sidebar: false
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

        
        default:
            return state
    }
}