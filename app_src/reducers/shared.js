import { SET_PROVIDER_STATUS, TOGGLE_SIDEBAR } from '../actions/shared'

const initialState = {
    sidebar: false
}

export default function shared(state = initialState, action) {
    switch (action.type) {
        case SET_PROVIDER_STATUS:
            return {
                ...state,
                [action.providerStatus.name]: action.providerStatus.status
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