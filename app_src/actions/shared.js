export const SHOW_LOADING = 'SHOW_LOADING'
export const HIDE_LOADING = 'HIDE_LOADING'
export const SHOW_SIDEBAR = 'SHOW_SIDEBAR'
export const HIDE_SIDEBAR = 'HIDE_SIDEBAR'
export const RESET_SIDEBAR = 'RESET_SIDEBAR'
export const SET_PROVIDER_STATUS = 'SET_PROVIDER_STATUS'

export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'
export const SAVE_NETWORK = 'SAVE_NETWORK'
export const SAVE_ACCOUNT = 'SAVE_ACCOUNT'
export const SAVE_NOTIFICATION_EMAIL = 'SAVE_NOTIFICATION_EMAIL'
export const SAVE_SELECTED_COLLATERAL_ASSET = 'SAVE_SELECTED_COLLATERAL_ASSET'
export const CHANGE_THEME = 'CHANGE_THEME'
export const TOGGLE_TESTNET_DATA = 'TOGGLE_TESTNET_DATA'
export const SAVE_REFERRER = 'SAVE_REFERRER'

export function saveReferrer(referrer) {
    return {
        type: SAVE_REFERRER,
        referrer
    }
}

export function saveNotificationEmail(email) {
    return {
        type: SAVE_NOTIFICATION_EMAIL,
        email
    }
}

export function saveNetwork(networkId) {
    return {
        type: SAVE_NETWORK,
        networkId
    }
}

export function saveAccount(account) {
    return {
        type: SAVE_ACCOUNT,
        account
    }
}

export function saveSelectedCollateralAsset(asset) {
    return {
        type: SAVE_SELECTED_COLLATERAL_ASSET,
        asset
    }
}

export function setProviderStatus(providerStatus) {
    return {
        type: SET_PROVIDER_STATUS,
        providerStatus,
    }
}

export function showLoading() {
    return {
        type: SHOW_LOADING,
        loading: true
    }
}

export function hideLoading() {
    return {
        type: HIDE_LOADING,
        loading: false
    }
}

export function showSidebar() {
    return {
        type: SHOW_SIDEBAR,
        sidebar: true
    }
}

export function hideSidebar() {
    return {
        type: HIDE_SIDEBAR,
        sidebar: false
    }
}

export function resetSidebar() {
    return {
        type: RESET_SIDEBAR,
        sidebar: null
    }
}

export function toggleSidebar(value) {
    return {
        type: TOGGLE_SIDEBAR,
        sidebar: value
    }
}

export function changeTheme(theme) {
    return {
        type: CHANGE_THEME,
        theme,
    }
}

export function toggleTestnetData(value) {
    return {
        type: TOGGLE_TESTNET_DATA,
        value
    }
}