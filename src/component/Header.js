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
import { getAccountsDataByJwt, getLocalStorageData } from '../common/Utils';
import { ButtonGroup, Menu, MenuItem, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
import QueryString from 'qs';
import { useNavigate } from 'react-router-dom';

function Header(props) {
  const {sections, title, _getAccounts} = props;

  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [jwt, setJwt] = useState('');
  const [accounts, setAccounts] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [searchTarget, setSearchTarget] = useState('');

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const queryData = QueryString.parse(location.search, { ignoreQueryPrefix: true });
    const {token, email, type} = queryData;
    if (token && email && type) {
      
      if (type === LOCAL_STORAGE_CONST.EMAIL_LOGIN) {
        emailAPI(email, token, 'login-email-token');
      } else if(type === LOCAL_STORAGE_CONST.EMAIL_VERIFY) {
        emailAPI(email, token, 'check-email-token');
      }

    } else {

      let {_jwt, is_ok} = getLocalStorageData();
      if (is_ok && _jwt) {
          getAccounts(_jwt);
      }
    }

  }, [])

  const emailAPI = async (email, token, url) => {
    const {data, headers, status} = await API.get(`/api/v1/email/${url}?email=${email}&token=${token}`);
    if (status === RESPONSE_STATUS.OK) {
      setAccounts(data);
      localStorage.setItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN, headers.authorization)
      setJwt(headers.authorization);
      setIsAuthorized(true);
    }
  }

  const getAccounts = async (_jwt) => {
    try {
      const {data, status} = await getAccountsDataByJwt(_jwt);
      
      if (status === RESPONSE_STATUS.OK) {
        setAccounts(data);
        setJwt(_jwt);
        setIsAuthorized(true);
        _getAccounts(data);
      } else {
        dataInit();
        navigate('/login');
      }
    } catch(e) {
      console.log(e);
      if (e.response.data && e.response.data.indexOf('ExpiredJwtException') > -1) {
        // JWT 토큰 만료
        dataInit();
        navigate('/login');
      }
    }
  }

  const priflePage = () => {
    navigate('/setting');
  }

  const logout = async () => {
    const {status} = await API.post("/logout"
                                    , {
                                      headers : {
                                        'Authorization': jwt
                                      }
                                    });

    if (status === RESPONSE_STATUS.OK) {
      dataInit();
      navigate('/home');
    }
  }

  const dataInit = () => {
    localStorage.removeItem(LOCAL_STORAGE_CONST.ACCESS_TOKEN);
    setIsAuthorized(false);
    setJwt('');
    setAccounts(null);
    _getAccounts(null);

  }

  const onChange = (e) => {
    const {target: {value}} = e;
    setSearchTarget(value);
  }

  const search = (e) => {

    let keyword = encodeURI(searchTarget, "UTF-8");
    navigate(`/search?keyword=${keyword}`)
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
        <TextField 
          variant="standard"
          placeholder='모임이름, 태그 검색'
          value={searchTarget}
          onChange={onChange}
        />
        <IconButton onClick={search}>
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