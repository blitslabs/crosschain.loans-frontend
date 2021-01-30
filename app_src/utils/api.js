const API_HOST = process.env.API_HOST
const API_WALLET = process.env.API_WALLET

// CROSS-CHAIN LOANS

export function getLoanAssets(params) {
    return fetch(API_HOST + `loanAssets/${params.blockchain}/${params.network}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getProtocolContracts() {
    return fetch(API_HOST + `protocolContracts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getNewEngineSecretHash(params) {
    return fetch(API_HOST + `engine/secretHash/${params.blockchain}/new`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function confirmLoanOperation(params) {
    return fetch(API_HOST + `loan/${params.blockchain}/operation/confirm`, {
        method:  'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(params)
    })
}

export function confirmCollateralLockOperation(params) {
    return fetch(API_HOST + `collateralLock/${params.blockchain}/operation/confirm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
}

export function getAvailableLoans(params) {
    return fetch(API_HOST + 'loans/available/' + params.network, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

//
export function getLoansSettings(params) {
    return fetch(API_HOST + 'loans/settings/' + params.network, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getPrices() {
    return fetch(API_WALLET + 'assetPrices', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getLoanDetails(params) {
    return fetch(API_HOST + 'loan/' + params.loanId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getActivityHistory(params) {
    return fetch(API_HOST + 'activity/history/' + params.page, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getAccountLoans(params) {
    return fetch(API_HOST + 'loans/account/' + params.account + '/' + params.network, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function saveEmailNotification(params) {
    return fetch(API_HOST + 'notification/email', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getNotificationEmail(params) {
    return fetch(API_HOST + `notification/email/${params.account}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

//

export function getLockedCollateral(params) {
    return fetch(API_HOST + 'lockedCollateral/' + params.account, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getLoansHistory() {
    return fetch(API_HOST + 'loans/history', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getAccountLoansCount(params) {
    return fetch(API_HOST + `loans/accountCount/${params.account}/${params.actor}/${params.blockchain}` , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getLoanNonce(params) {
    return fetch(API_HOST + `loans/loanNonce/${params.loanId}/${params.blockchain}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}