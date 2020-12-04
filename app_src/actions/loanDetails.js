export const SAVE_LOAN_DETAILS = 'SAVE_LOAN_DETAILS'

export function saveLoanDetails(loanDetails) {
    return {
        type: SAVE_LOAN_DETAILS,
        loanDetails
    }
}