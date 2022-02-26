import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GLOBAL_CONST from '../common/GlobalConst';

function Header(props) {
  const {sections, title} = props;
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const jwt = localStorage.getItem(GLOBAL_CONST.ACCESS_TOKEN)
    if (jwt) {
      setIsAuthorized(true)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem(GLOBAL_CONST.ACCESS_TOKEN)
    setIsAuthorized(false)
  }

  return (
    <React.Fragment>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="left"
          noWrap
          sx={{ flex: 1 }}
        >
          {title}
        </Typography>
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
                프로필
              </Button>
              <Button variant="outlined" size="small" onClick={logout}>
                로그아웃
              </Button>
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