const API_WALLET = process.env.API_WALLET

// CROSS-CHAIN LOANS
export function getAvailableLoans() {
    return fetch(API_WALLET + 'loans/available', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getLoanAssets(params) {
    return fetch(API_WALLET + `loans/assets/${params.operation}/${params.network}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getLoansSettings(params) {
    return fetch(API_WALLET + 'loans/settings/' + params.network, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getPrices() {
    return fetch(API_WALLET + 'prices', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getLoanDetails(params) {
    return fetch(API_WALLET + 'loan/' + params.loanId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getAccountLoans(params) {
    return fetch(API_WALLET + 'loans/account/' + params.account, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getLockedCollateral(params) {
    return fetch(API_WALLET + 'lockedCollateral/' + params.account, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getLoansHistory() {
    return fetch(API_WALLET + 'loans/history', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}