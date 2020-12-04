export const SAVE_ACCOUNT_LOANS = 'SAVE_ACCOUNT_LOANS'
export const SAVE_ACCOUNT_COLLATERAL_TXS = 'SAVE_ACCOUNT_COLLATERAL_TXS'
export const REMOVE_ACCOUNT_LOANS = 'REMOVE_ACCOUNT_LOANS'

export function saveAccountLoans(loans) {
    return {
        type: SAVE_ACCOUNT_LOANS,
        loans
    }
}

export function saveAccountCollateralTxs(collateralTxs) {
    return {
        type: SAVE_ACCOUNT_COLLATERAL_TXS,
        collateralTxs
    }
}

export function removeAccountLoans() {
    return {
        type: REMOVE_ACCOUNT_LOANS,
    }
}