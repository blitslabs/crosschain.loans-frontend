export const SAVE_LEND_REQUEST = 'SAVE_LEND_REQUEST'

export function saveLendRequest(lendRequest) {
    return {
        type: SAVE_LEND_REQUEST,
        lendRequest
    }
}