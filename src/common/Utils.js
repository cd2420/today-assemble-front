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

export function validateUserName(val, setNameErrorFunc, setNameErrorMsgFunc, setButtonFunc) {
    const regUserName = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{0,10}$/

    setNameErrorFunc(false)
    setNameErrorMsgFunc('')

    if (val === '') {

        setButtonFunc(true)
        return
    }

    if (val.length < 3 || val.length > 10) {
        setNameErrorFunc(true)
        setNameErrorMsgFunc('이름은 최소 3, 최대 10자리')

        setButtonFunc(true)

        return 
    }

    if (!regUserName.test(val)) {
        setNameErrorFunc(true)
        setNameErrorMsgFunc('잘못된 이름 형식입니다.')

        setButtonFunc(true)

        return 
    }

    setButtonFunc(false)

}

export function validatePassword(val, check_val, setPasswordError, setPasswordErrorText, setUpdateButton) {
        
    setPasswordError(false)
    setPasswordErrorText('')

    if (val === '') {

        setUpdateButton(true)

        return
    }

    if (val.length < 6 || val.length > 20) {
        setPasswordError(true)
        setPasswordErrorText('비밀번호는 최소 6, 최대 20자리')
        
        setUpdateButton(true)

        return
    }

    if (val !== check_val) {
        setPasswordError(true)
        setPasswordErrorText('비밀번호가 일치하지 않습니다.')
        
        setUpdateButton(true)

        return
    }
 
    setUpdateButton(false)
}

export function createMainImage(event) {
    const checkMainImages = event.eventsImagesDtos.filter(
        item => {
            return item.imagesType === 'MAIN'
        }
    )

    if (checkMainImages.length > 0 && checkMainImages[0].image) {
        event.mainImage = checkMainImages[0].image
    } else {
        event.mainImage = 'https://source.unsplash.com/random'
    }
}