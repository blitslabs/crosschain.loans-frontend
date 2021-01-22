import { SAVE_PROVIDER } from '../actions/providers'

export default function saveProvider(state = {}, action) {
    switch(action.type) {
        case SAVE_PROVIDER:
            return {
                ...state,
                [action.provider.blockchain]: action.provider.network
            }

        default:
            return state
    }
}