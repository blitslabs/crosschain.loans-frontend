import { HarmonyAddress } from '@harmony-js/crypto'
import { HarmonyExtension } from '@harmony-js/core'

const ONE = {
    isAddressValid: (address) => {
        try {
            return HarmonyAddress.isValidBech32(address)
        } catch (e) {
            return false
        }
    },

    getAccount: async () => {
        
        if(!window.onewallet) {
            return { status: 'ERROR', message: 'ONE Provider not found'}
        }

        try {
            const harmony = await new HarmonyExtension(window.onewallet)
            const account = await harmony.login()            
            return { status: 'OK', payload: account }
        } catch (e) {
            console.log(e)
            return { status: 'ERROR', message: 'Error connecting Harmony provider' }
        }
    }
}

export default ONE