import { SAVE_ASSET_TYPE } from '../actions/assetTypes'

export default function assetTypes(state = {}, action) {
    switch (action.type) {
        case SAVE_ASSET_TYPE:
            return {
                ...state,
                [action.assetType.contractAddress]: {
                    ...action.assetType
                }
            }
        default:
            return state
    }
}