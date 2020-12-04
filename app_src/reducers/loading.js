import { SHOW_LOADING, HIDE_LOADING } from '../actions/shared'

export default function loading(state = null, action) {
    switch(action.type) {
        case SHOW_LOADING:
            return action.loading
        case HIDE_LOADING:
            return action.loading
        default:
            return state
    }
}