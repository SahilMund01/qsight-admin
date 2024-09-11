import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Descope, useDescope } from '@descope/react-sdk';
import { Button } from '@mui/material';

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
      {!isActive ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 250px)', // Adjusted for viewport height
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
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '2rem',
            }}
          >
            <Button onClick={onLogout} variant="contained" color="primary">
              Logout
            </Button>
          </div>
          <div
            style={{
              fontSize: '20px',
              height: 'calc(100vh - 300px)', // Adjusted for viewport height
            }}
          >
            {/* <div>tenantName - {loginResp[0]?.tenantName}</div>
            <div>tenantId - {loginResp[0]?.tenantId}</div> */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '1rem',
              }}
            >
              <div style={{ fontWeight: '500' }}>tenantName -</div>
              <div>{loginResp[0]?.tenantName}</div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                gap: '55px',
              }}
            >
              <div style={{ fontWeight: '500' }}>tenantId -</div>
              <div>{loginResp[0]?.tenantId}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
