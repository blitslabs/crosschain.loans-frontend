export const SAVE_ACTIVITY_HISTORY = 'SAVE_ACTIVITY_HISTORY'

export function saveActivityHistory(activityHistory) {
    return {
        type: SAVE_ACTIVITY_HISTORY,
        activityHistory
    }
}