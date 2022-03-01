import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GLOBAL_CONST from '../common/GlobalConst';
import API from '../config/customAxios';
import {RESPONSE_STATUS} from '../common/ResponseStatus';
import { getAccountsDataByJwt, getLocalStorageData } from '../common/Utils';
import { ButtonGroup } from '@mui/material';

function Header(props) {
  const {sections, title} = props;
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [jwt, setJwt] = useState('')
  const [accounts, setAccounts] = useState(null)

  useEffect(() => {
    const {_jwt, _accounts, is_ok} = getLocalStorageData();
    if (is_ok) {
      
      let tmp_accounts = JSON.parse(_accounts)
      setAccounts(tmp_accounts)
      setJwt(_jwt)
      setIsAuthorized(true)

      if (!tmp_accounts.emailVerified) {
        checkEmailVerified(_jwt);
      }
      async function checkEmailVerified(_jwt) {
        const {data, status} = await getAccountsDataByJwt(_jwt)
        if (status && data.emailVerified) {
          setAccounts(data)
          localStorage.setItem(GLOBAL_CONST.ACCOUNTS, JSON.stringify(data))
        }
      }
    }
  }, [])

  const logout = async () => {
    const {status} = await API.post("/logout", {
      headers : {
        'Authorization': jwt
      }
    })
    if (status === RESPONSE_STATUS.OK) {
      localStorage.removeItem(GLOBAL_CONST.ACCESS_TOKEN)
      localStorage.removeItem(GLOBAL_CONST.ACCOUNTS)
      setIsAuthorized(false)
      setJwt('')
      setAccounts(null)
    }
  }

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <ButtonGroup sx={{ flex: 1 }} variant="text" aria-label="text button group">
          <Button>
            <Typography
              component="h2"
              variant="h5"
              color="inherit"
              align="left"
              noWrap
              
            >
              {title}
            </Typography>
          </Button>
          {
            accounts && !accounts.emailVerified ?
            (
              <Button 
                variant="outlined" 
                color="warning"
              >
                이메일 인증이 필요합니다.
              </Button>
            )
            :
            (
              <>
              </>
            )
          }
          
        </ButtonGroup>
        <IconButton>
          <SearchIcon />
        </IconButton>
        {
          !isAuthorized ? 
          (
            <Button variant="outlined" size="small" href='/login'>
              로그인
            </Button>
          ) 
          :
          (
            <>
              <Button variant="outlined" size="small" href='/profile'>
                {accounts.name}
              </Button>
              {/* <Button variant="outlined" size="small" onClick={logout}>
                로그아웃
              </Button> */}
            </>
          ) 
        }
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        {sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            sx={{ p: 1, flexShrink: 0 }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;