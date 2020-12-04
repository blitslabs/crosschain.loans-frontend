import {
    SAVE_LEND_REQUEST
} from '../actions/lendRequest'

export default function lendRequest(state = {}, action) {
    switch(action.type) {
        case SAVE_LEND_REQUEST:
            return {
                ...state,
                ...action.lendRequest
            }
       default:
            return state
    }
}