import { SAVE_ACTIVITY_HISTORY } from '../actions/activity'

export default function activity(state = {}, action) {
    switch (action.type) {
        case SAVE_ACTIVITY_HISTORY:
            return {
                ...action.activityHistory,               
            }
        default:
            return state
    }
}