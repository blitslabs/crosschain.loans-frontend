export const SHOW_LOADING = 'SHOW_LOADING'
export const HIDE_LOADING = 'HIDE_LOADING'
export const SHOW_SIDEBAR = 'SHOW_SIDEBAR'
export const HIDE_SIDEBAR = 'HIDE_SIDEBAR'
export const RESET_SIDEBAR = 'RESET_SIDEBAR'
export const SET_PROVIDER_STATUS = 'SET_PROVIDER_STATUS'
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'

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