import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import {LOCAL_STORAGE_CONST} from '../common/GlobalConst';
import API from '../config/customAxios';
import {RESPONSE_STATUS} from '../common/ResponseStatus';
import { getLocalStorageData } from '../common/Utils';
import { ButtonGroup, Menu, MenuItem } from '@mui/material';
import { useLocation } from 'react-router-dom';
import QueryString from 'qs';

function Header(props) {
  const {sections, title} = props;

  const location = useLocation();

  const [isAuthorized, setIsAuthorized] = useState(false)
  const [jwt, setJwt] = useState('')
  const [accounts, setAccounts] = useState(null)

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const queryData = QueryString.parse(location.search, { ignoreQueryPrefix: true })
    const {token, email, type} = queryData;
    if (token && email && type) {
      
      if (type === LOCAL_STORAGE_CONST.EMAIL_LOGIN) {
        emailAPI(email, token, 'login-email-token')
      } else if(type === LOCAL_STORAGE_CONST.EMAIL_VERIFY) {
        emailAPI(email, token, 'check-email-token')
      }

      async function emailAPI(email, token, url) {
        const {data, headers, status} = await API.get(`/api/v1/email/${url}?email=${email}&token=${token}`)
        if (status) {
          setAccounts(data)
          localStorage.setItem(LOCAL_STORAGE_CONST.ACCOUNTS, JSON.stringify(data))
          setJwt(headers.authorization)
          setIsAuthorized(true)
        }
      }

    } else {

      let {_jwt, _accounts, is_ok} = getLocalStorageData();
      if (is_ok) {

        if (_jwt && _accounts) {
          let tmp_accounts = JSON.parse(_accounts)
          setAccounts(tmp_accounts)
          setJwt(_jwt)
          setIsAuthorized(true)
        }
      }

    }

  }, [])

  const priflePage = () => {
    window.location.href='/profile'
  }

  const logout = async () => {
    const {status} = await API.post("/logout", {
      headers : {
        'Authorization': jwt
      }
    })
    if (status === RESPONSE_STATUS.OK) {
      localStorage.removeItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN)
      localStorage.removeItem(LOCAL_STORAGE_CONST.ACCOUNTS)
      setIsAuthorized(false)
      setJwt('')
      setAccounts(null)
      window.location.href='/home'
    }
  }

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <ButtonGroup sx={{ flex: 1 }} variant="text" aria-label="text button group">
          <Button href='/home'>
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
            accounts 
            && !accounts.emailVerified
            && 
            <Button 
              variant="outlined" 
              color="warning"
            >
              이메일 인증이 필요합니다.
            </Button>

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
            < >
              <Button 
                variant="outlined" 
                size="small"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                {accounts.name}
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={priflePage} >계정</MenuItem>
                <MenuItem onClick={logout}>로그아웃</MenuItem>
              </Menu>
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