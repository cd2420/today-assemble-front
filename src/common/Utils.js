import GLOBAL_CONST from "./GlobalConst"

export function getLocalStorageData() {
    const _jwt = localStorage.getItem(GLOBAL_CONST.ACCESS_TOKEN)
    const _accounts = localStorage.getItem(GLOBAL_CONST.ACCOUNTS)
    if (_jwt && _accounts) {
        return {
            _jwt
            , _accounts
            , is_ok: true
        }
    } else {
        return {
            is_ok: false
        }
    }
}
