import {
    SET_PROVIDER_STATUS, TOGGLE_SIDEBAR,
    SET_BLOCKCHAIN_NETWORK, SAVE_NOTIFICATION_EMAIL

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

        case SET_BLOCKCHAIN_NETWORK:
            return {
                ...state,
                [action.details.blockchain + '_network']: action.details.network
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