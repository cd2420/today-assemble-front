import { LoadingButton } from '@mui/lab';
import { Button, Grid, TextField, Typography} from '@mui/material';
import React, {useState, useEffect} from 'react';
import { RESPONSE_STATUS } from '../common/ResponseStatus';
import { validatePassword } from '../common/Utils';
import API from '../config/customAxios';
import PopUpPage from './PopUpPage';


const PasswordPage = ({accounts, jwt}) => {

    const [anchorEl, setAnchorEl] = useState(null);

    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorText, setPasswordErrorText] = useState('');

    const [updateButton, setUpdateButton] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isOk, setIsOk] = useState(false);

    useEffect(() => {
        
    }, [])

    const onChange = (event) => {
        
        const {target: {name,value}} = event;
         if(name ==="password") {
            setPassword(value);
        } else if(name ==="password-check") {
            setPasswordCheck(value);
        } 
        validateProps(name,value)
    };

    const validateProps = (name,value) => {
        if(name ==="password") {
            validatePassword(value, passwordCheck, setPasswordError, setPasswordErrorText, setUpdateButton)
        } else if(name ==="password-check") {
            validatePassword(value, password, setPasswordError, setPasswordErrorText, setUpdateButton)
        } 
    };

    const updatePassword = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const currentTarget = event.currentTarget;

        accounts.password = password
        try {
            const {status} = await API.put(
                `/api/v1/accounts/${accounts.id}`
                , JSON.stringify(accounts)
                , {
                    headers : {
                        'Authorization': jwt
                    }
                }
            )

            if (status === RESPONSE_STATUS.OK) {
                setIsOk(true)
            }
        } catch(e) {
            const errorStatus = e.response.status;
            if (errorStatus === RESPONSE_STATUS.FORBIDDEN) {
                setAnchorEl(currentTarget);
            }

        } finally {
            setIsLoading(false)
        }
        
    }

    return (
        <Grid container spacing={2}>

            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    name="password"
                    label="변경 할 비밀번호"
                    type="password"
                    id="password"
                    autoComplete="password"
                    value={password}
                    onChange={onChange}
                    error={passwordError}
                    helperText={passwordErrorText}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    name="password-check"
                    label="비밀번호 확인"
                    type="password"
                    id="password-check"
                    autoComplete="password-check"
                    value={passwordCheck}
                    onChange={onChange}
                    error={passwordError}
                    helperText={passwordErrorText}
                />
            </Grid>
            {
                isOk && (
                    <Grid item xs={12}>
                         <Button variant="outlined" >변경 완료</Button>
                    </Grid>
                )
            }
            <LoadingButton
                type="submit"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={updatePassword}
                disabled={updateButton}
                loading={isLoading}
            >
                변경
            </LoadingButton>
            <PopUpPage anchorEl={anchorEl} setAnchorEl={setAnchorEl}/>
        </Grid>
    )
}

export default PasswordPage;