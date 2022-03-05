import API from "../config/customAxios"
import {LOCAL_STORAGE_CONST} from "./GlobalConst"

export function getLocalStorageData() {
    const _jwt = localStorage.getItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN)
    const _accounts = localStorage.getItem(LOCAL_STORAGE_CONST.ACCOUNTS)
    const is_ok = true

    let result = {}
    if (_jwt && _accounts) {
        result = {
            _jwt
            , _accounts
            , is_ok
        }
    } else {
        result = {
            is_ok: false
        }
    }

    return result
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

export function getAge(birth) {
    return new Date().getFullYear() - birth.getFullYear() + 1;
}
