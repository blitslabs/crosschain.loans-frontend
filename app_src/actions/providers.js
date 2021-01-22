
export const SAVE_PROVIDER = 'SAVE_PROVIDER'

export function saveProvider(provider) {
    return {
        type: SAVE_PROVIDER,
        provider
    }
}