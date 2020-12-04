import { SAVE_LOAN_SETTINGS } from '../actions/loanSettings'

export default function loanSettings(state = {}, action) {
    switch(action.type) {
        case SAVE_LOAN_SETTINGS:
            return {
                ...action.settings
            }
        default:
            return state
    }
}