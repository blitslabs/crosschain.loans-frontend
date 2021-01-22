export const SAVE_ASSET_TYPE = 'SAVE_ASSET_TYPE'

export function saveAssetType(assetType) {
    return {
        type: SAVE_ASSET_TYPE,
        assetType
    }
}