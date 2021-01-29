import {
    SAVE_LOAN_DETAILS
} from '../actions/loanDetails'

export default function loanDetails(state = {}, action) {
    switch (action.type) {
        case SAVE_LOAN_DETAILS:
            return {
                ...state,
                [action.loanDetails.id]: {
                    ...action.loanDetails,
                }
            }
        default:
            return state
    }
}