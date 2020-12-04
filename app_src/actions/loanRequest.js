export const SAVE_LOAN_REQUEST_TYPE = 'SAVE_LOAN_REQUEST_TYPE'
export const SAVE_LOAN_REQUEST_ASSET = 'SAVE_LOAN_REQUEST_ASSET'
export const SAVE_LOAN_REQUEST_TERMS = 'SAVE_LOAN_REQUEST_TERMS'
export const SAVE_SECRET_HASH_B1 = 'SAVE_SECRET_HASH_B1'
export const SAVE_SECRET_HASH_A1 = 'SAVE_SECRET_HASH_A1'

export function saveLoanRequestType(requestType) {
    return {
        type: SAVE_LOAN_REQUEST_TYPE,
        requestType
    }
}

export function saveLoanRequestAsset(asset) {
    return {
        type: SAVE_LOAN_REQUEST_ASSET,
        asset,
    }
}

export function saveLoanRequestTerms(loanTerms) {
    return {
        type: SAVE_LOAN_REQUEST_TERMS,
        loanTerms
    }
}

export function saveSecretHashB1(secretHashB1) {
    return {
        type: SAVE_SECRET_HASH_B1,
        secretHashB1,
    }
}

export function saveSecretHashA1(secretHashA1) {
    return {
        type: SAVE_SECRET_HASH_A1,
        secretHashA1,
    }
}