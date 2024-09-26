import { useState, useEffect } from 'react';
import './App.css';
import { Descope, useDescope } from '@descope/react-sdk';
import logo from './assets/QSight.png'
import Header from './Header';
import { fetchAndProcessAdminData } from './api';
import Admin from './Admin';
import { Typography } from '@mui/material';

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
  const [data, setData] = useState({
    user: null,
    admin: null
  });
  const [user, setUser] = useState({
    email: "",
    role : ""
  });
  const [isAdmin, setIsAdmin] = useState(false);


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

  useEffect(() => {

    const userData = JSON.parse(localStorage.getItem('user-data'));
    setUser((prev) => {
      return {
        ...prev,
        role: userData?.role,
        email : userData?.email
      }
     })
    fetchData();


  }, [])


  const fetchData = async () => {
    const adminData = await fetchAndProcessAdminData();
    // const filteredAdminData = adminData.filter((ele) => ele.adminEmail === user.email)
    setData((prev) => {
      return {
        ...prev,
        admin: adminData
      }
    });
  }


  const onLogout = async () => {
    try {
      const resp = await descopeSdk.logout();
      localStorage.clear();
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
    console.log(event.currentTarget);
  };

  const handleClose = (val) => {
    if(val==='logout'){
      onLogout()
      localStorage.clear();
    }
    setAnchorEl(null);
  };

  return (
    <div>
 
      {!isActive ? (
       <div className="grid justify-center items-center grid-cols-2">
       <div className="flex justify-center bg-[#3852] h-screen items-center">
         <img src={logo} alt="App Logo" className="w-1/2" />
       </div>
       <Descope
         flowId="sign-in"
         theme={getInitialTheme()}
         onSuccess={(e) => {
           setLoginResp(e?.detail.user?.userTenants);
           console.log(e?.detail);
           console.log(e?.detail?.user?.email);
           localStorage.setItem('user-data', JSON.stringify({
            role: "admin",
            email : e?.detail?.user?.name
           }))
           setUser((prev) => {
            return {
              ...prev,
              role: "admin",
              email : e?.detail?.user?.name
            }
           })
           const roleNames = e?.detail.user?.userTenants[0].roleNames;
           setIsAdmin(roleNames.length == 0 ? false : true)
           fetchData();
         }}
         onError={(err) => {
           console.log('Error!', err);
         }}
       />
     </div>
     
      ) : (
        <>
         
        <Header handleClose={handleClose} handleMenu={handleMenu} anchorEl={anchorEl} userRole={user.role}/>

       {
        !isAdmin &&  
        <div className='w-[90%] m-auto mt-6'>
        <div className="bg-blue-100 border border-blue-300 rounded-md p-4 my-4">
        <Typography className="text-lg font-bold text-red-700">
        Access Denied: You need an admin account to proceed with this application.
        </Typography>
      </div>
      </div>
       }

        {
          isAdmin && user?.role === "admin" && data?.admin 
          && <Admin data={data?.admin} email={user.email} onSetUser = {setUser} role={isAdmin}/> 
        }
       
        </>
      )}
    </div>
  );
}

export default App;
