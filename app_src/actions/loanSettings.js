export const SAVE_LOAN_SETTINGS = 'SAVE_LOAN_SETTINGS'

export function saveLoanSettings(settings) {
    return {
        type: SAVE_LOAN_SETTINGS,
        settings
    }
}