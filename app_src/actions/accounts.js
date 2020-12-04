export const SAVE_ACCOUNT = 'SAVE_ACCOUNT'

export function saveAccount(accountData) {
    return {
        type: SAVE_ACCOUNT,
        accountData
    }
}