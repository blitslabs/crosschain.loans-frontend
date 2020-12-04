import { SAVE_ACCOUNT } from '../actions/accounts'

export default function accounts(state = {}, action) {
    switch (action.type) {
        case SAVE_ACCOUNT:
            return {
                ...state,
                [action.accountData.blockchain]: action.accountData.account
            }
        default:
            return state
    }
}