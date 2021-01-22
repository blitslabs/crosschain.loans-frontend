import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import loading from './loading'
import availableLoans from './availableLoans'
import loanSettings from './loanSettings'
import loanAssets from './loanAssets'
import lendRequest from './lendRequest'
import prices from './prices'
import loanDetails from './loanDetails'
import shared from './shared'
import accounts from './accounts'
import accountLoans from './accountLoans'
import protocolContracts from './protocolContracts'
import providers from './providers'

const appReducer = combineReducers({    
    loading,    
    availableLoans,
    loanSettings,
    loanAssets,
    lendRequest,
    prices,
    loanDetails,
    shared,
    accounts,
    accountLoans,
    protocolContracts,
    providers,
})

const rootReducer = (state, action) => {
    if (action.type == 'USER_LOGOUT') {
        storage.removeItem('persist:root')
        state = undefined
    }
    return appReducer(state, action)
}

export default rootReducer