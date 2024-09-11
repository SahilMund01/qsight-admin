import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Descope, useDescope } from '@descope/react-sdk';
import { Button,TextField } from '@mui/material';
import logo from './assets/QSight.png'
function App() {
  const [count, setCount] = useState(0);
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
      console.log('Token', loginResp);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div>
        <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 10px 20px',
      // backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #ddd'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <img
          src={logo}
          alt="App Logo"
          style={{ height: '40px' }}
        />
      </div>
      {isActive ? <Button onClick={onLogout} variant="contained" color="primary">
              Logout
            </Button> : <></>}
    </header>
      {!isActive ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            
          }}
        >
          <Descope
            flowId="sign-in"
            theme="light"
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
          <div
            
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
              // Adjusted for viewport height
            }}
          >
            {/* <div>tenantName - {loginResp[0]?.tenantName}</div>
            <div>tenantId - {loginResp[0]?.tenantId}</div> */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '1rem',
                marginBottom:'20px'
              }}
            >
              <div style={{ fontWeight: '500', width:'220px' }}>Hospital Name -</div>
              <TextField sx={{width:'500px'}} id="outlined-basic" value={loginResp[0]?.tenantName} label="" variant="outlined" />
              {/* <div>{loginResp[0]?.tenantName}</div> */}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '55px',
              }}
            >
              <div style={{ fontWeight: '500',minWidth:'50px' }}>Hospital Tenant Id -</div>
              <TextField sx={{width:'500px'}} id="outlined-basic" value={loginResp[0]?.tenantId} label="" variant="outlined" />
              {/* <div>{}</div> */}
            </div>
          </div>
            
          </div>
         
        </>
      )}
    </div>
  );
}

export default App;
