import { useState, useEffect } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import './App.css';
import { Descope, useDescope } from '@descope/react-sdk';
import { IconButton } from '@mui/material';
import logo from './assets/QSight.png'
import Hospital from './hospital';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const getInitialTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

function App() {
  // const [count, setCount] = useState(0);
  const [isActive, setActive] = useState(true);
  const descopeSdk = useDescope();
  const sessionToken = descopeSdk.getSessionToken();
  const [loginResp, setLoginResp] = useState([]);

  useEffect(() => {
    console.log('resss', loginResp);
    if (sessionToken) {
      if (descopeSdk?.isJwtExpired(sessionToken)) {
        setActive(false);
      } else {
        setActive(true);
      }
    } else {
      setActive(false);
    }
  }, [sessionToken]);

  const onLogout = async () => {
    try {
      const resp = await descopeSdk.logout();
      console.log('Token', resp);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  const [anchorEl, setAnchorEl] = useState(null);

  // const handleChange = (event) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (val) => {
    if(val==='logout'){
      onLogout()
    }
    setAnchorEl(null);
  };

  return (
    <div>
        
      {!isActive ? (
        <div
          style={{
            display: 'grid',
            justifyContent: 'center',
            alignItems: 'center',
            gridTemplateColumns:"50% 50%"
            
          }}
        >
          <div style={{ display:'flex', justifyContent:'center', background:'#3852',height:'100dvh', alignItems:'center'}}>
          <img
          src={logo}
          alt="App Logo"
          style={{width:'50%'}}
        />
          </div>
          <Descope
            flowId="sign-in"
            theme={getInitialTheme()}
            onSuccess={(e) => {
              setLoginResp(e?.detail.user?.userTenants);
              console.log(e?.detail);
              console.log(e?.detail?.user?.email);
            }}
            onError={(err) => {
              console.log('Error!', err);
            }}
          />
        </div>
      ) : (
        <>
          {/* <div
            
            style={{
              padding:'20px',
              display: 'grid',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              gridTemplateColumns:'auto auto'

            }}
          >
              <div
            style={{
              fontSize: '20px',
              
            }}
          >
            
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '1rem',
                marginBottom:'20px'
              }}
            >
              <div style={{ fontWeight: '500', width:'220px' }}>Hospital Name -</div>
               <div>{loginResp[0]?.tenantName}</div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '55px',
              }}
            >
              <div style={{ fontWeight: '500',minWidth:'50px' }}>Hospital Tenant Id -</div>
               <div>{loginResp[0]?.tenantId}</div>
            </div>
          </div>
            
          </div> */}
          {/* <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 20px',
      backgroundColor: '#3852',
      borderBottom: '1px solid #ddd'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <img
          src={logo}
          alt="App Logo"
          style={{ height: '50px' }}
        />
      </div>
      
      <IconButton
      onClick={onLogout}
      edge="end"
      color="inherit"
      aria-label="edit"
    >
      <ExitToAppIcon fontSize='large'  />
    </IconButton>
    </header> */}
    <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={()=>{handleClose('profile')}}>Profile</MenuItem>
                <MenuItem onClick={()=>{handleClose('logout')}}>Logout</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
         <Hospital/>
        </>
      )}
    </div>
  );
}

export default App;
