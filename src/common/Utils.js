import API from "../config/customAxios"
import {LOCAL_STORAGE_CONST} from "./GlobalConst"

export function getLocalStorageData() {
    const _jwt = localStorage.getItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN)
    const _accounts = localStorage.getItem(LOCAL_STORAGE_CONST.ACCOUNTS)
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

export async function getAccountsDataByJwt(jwt) {
    
    let result = {}
    try {
        const {data, status} = await API.get("/api/v1/accounts", {
            headers : {
                'Authorization': jwt
            }
        })
        result = {
            data
            , status
        }
    } catch(e) {
        result = {
            status: false
        }
    }
    return result
    
}
