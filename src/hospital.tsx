import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField, Button, Typography, CircularProgress,
  Snackbar, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

// Array of hospital objects
const initialHospitals = [
  {
    hospitalName: 'City Hospital',
    adminEmail: 'admin@cityhospital.com',
    hospitalDesc: 'A major hospital offering comprehensive healthcare services.',
    adminName: 'John Doe',
    status: 'pending',
    tenantId: 'T123'
  },
  {
    hospitalName: 'Greenwood Medical',
    adminEmail: 'contact@greenwoodmc.com',
    hospitalDesc: 'Specializes in orthopedic and emergency care.',
    adminName: 'Jane Smith',
    status: 'active',
    tenantId: 'T456'
  },
];

const Hospital = () => {
  const [hospitals, setHospitals] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<any>({});
  const [initialValues, setInitialValues] = useState<any>({});
  const [editMode, setEditMode] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchHospitals();
  }, []);
  
  const fetchHospitals = async () => {
    setLoading(true);
    try {
      fetch('https://1b11-139-167-129-22.ngrok-free.app/api/Tenant/all-tenants', {
        method: "get",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      })
        .then((response) => response.json()
      )
        .then((data) => setHospitals(data))
        .catch((err) => console.log(err));
      // const response = await fetch('https://1b11-139-167-129-22.ngrok-free.app/api/Tenant/all-tenants');
      // if (!response.ok) {
      //   throw new Error(`Network response was not ok: ${response.statusText}`);
      // }
      // console.log('res',response)
      // setHospitals(data);
    } catch (error) {
      
      // setHospitals(initialHospitals); // Reset to initial state on error
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  const createHospitals = async (selectedHospital) => {
    setLoading(true);
    try {
      const response = await fetch('https://1b11-139-167-129-22.ngrok-free.app/api/Tenant/create-new-tenant', {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        }),
        body: JSON.stringify(selectedHospital), // Pass the payload here
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const data = await response.json();
       setSnackbarMessage('Hospital onboarded successfully!');
       setSnackbarSeverity('success');
       setSnackbarOpen(true);
       handleClose()
       fetchHospitals()
      // setHospitals(data);
    } catch (error) {
      console.log(error);
      // setHospitals(initialHospitals); // Uncomment if you want to reset on error
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };
  

  const handleOpen = (hospital = null, isNew = false) => {
    setSelectedHospital(hospital);
    setInitialValues(hospital); // Save the initial values
    setIsNew(isNew); // Identify if it's for adding a new hospital
    setOpen(true);
    setEditMode(isNew); // Set edit mode based on whether it's new or existing
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedHospital(null);
    setInitialValues(null);
    setEditMode(false);
    setIsNew(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedHospital({
      ...selectedHospital,
      [name]: value,
    });
  };

  const validateFields = () => {
    if(isNew) {
      return selectedHospital?.hospitalName && selectedHospital?.hospitalDesc  && selectedHospital?.adminName && selectedHospital?.adminEmail
  
    }
    else {
      return selectedHospital?.hospitalName && selectedHospital?.hospitalDesc  && selectedHospital?.adminName && selectedHospital?.adminEmail && selectedHospital?.tenantId;
  
    } };

  const handleSave = () => {
    if (!validateFields()) {
      setSnackbarMessage('Please fill out all fields before saving.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true); // Start loading

   
      try {
        if (isNew) {
          createHospitals(selectedHospital)
          // setHospitals([...hospitals, {...selectedHospital, status: 'pending'}]);
          // setSnackbarMessage('Hospital onboarded successfully!');
          // setSnackbarSeverity('success');
        } else {
          const updatedHospitals = hospitals.map(hospital =>
            hospital.hospitalName === initialValues.hospitalName ? selectedHospital : hospital
          );
          setHospitals(updatedHospitals);
        }

        
        // setSnackbarOpen(true);
      } catch (error) {
        // setSnackbarMessage('An error occurred while saving.');
        // setSnackbarSeverity('error');
        // setSnackbarOpen(true);
      } finally {
        // setLoading(false); // Stop loading
        // handleClose();
      }
    
  };

  const handleDiscard = () => {
    setSelectedHospital(initialValues); // Reset to initial values
    setEditMode(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" sx={{ margin: '20px 5px' }}>Hospitals</Typography>
        <Button  sx={{background:''}} variant="contained" onClick={() => handleOpen(null, true)}>Add New</Button>
      </div>
      {hospitals.length ? (
        <div style={{ width: '100%' }}>
          {hospitals.map((hospital, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '10px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                display: 'grid',
                gridTemplateColumns: 'auto auto',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <h3>{hospital.hospitalName}</h3>
              <div style={{
                display: 'flex',
                justifyContent: "space-between",
                gap: '20px',
                alignItems: 'center',
              }}>
                <div style={{ minWidth: '200px' }}><strong>Status:</strong> <span style={{color:'green'}}>{hospital?.status ? hospital?.status:'Onboarded'}</span></div>
                <button
                  style={{
                    backgroundColor: 'green',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    borderRadius: '3px',
                  }}
                  onClick={() => handleOpen(hospital)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: '100px', justifyContent: 'center', display: 'flex' }}>
          {!loading ? <CircularProgress /> : <div>No Data Found</div>}
        </div>
      )}
      <Dialog
        open={open}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        disableEscapeKeyDown
      >
        <DialogTitle id="dialog-title">
          <Typography variant="h6">{isNew ? 'Add New Hospital' : 'Hospital Details'}</Typography>
          {!isNew && (
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleEdit}
              aria-label="edit"
              style={{ position: 'absolute', right: 70, top: 8 }}
            >
              <EditIcon />
            </IconButton>
          )}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            style={{ position: 'absolute', right: 20, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="hospital Name"
            name="hospitalName"
            value={selectedHospital?.hospitalName || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Hospital Description"
            name="hospitalDesc"
            value={selectedHospital?.hospitalDesc || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            multiline
            minRows={2}
            margin="normal"
          />
          {/* <TextField
            label="Address"
            name="address"
            value={selectedHospital?.address || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            margin="normal"
          /> */}
          <TextField
            label="Admin Name"
            name="adminName"
            value={selectedHospital?.adminName || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Admin Email"
            name="adminEmail"
            value={selectedHospital?.adminEmail || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            margin="normal"
          />
         {!isNew &&  <TextField
            label="Tenant ID"
            name="tenantId"
            value={selectedHospital?.tenantId || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            margin="normal"
          />}
        </DialogContent>
        <DialogActions sx={{ marginRight: '15px', marginBottom: '20px' }}>
          {editMode && (
            <>
              <Button onClick={handleDiscard} variant='outlined' color="secondary">
                Discard
              </Button>
              <Button
                onClick={handleSave}
                color="primary"
                disabled={loading} // Disable button while loading
                startIcon={loading ? <CircularProgress size={24} /> : null} // Show loader when loading
              >
                {loading ? 'Saving' : 'Save'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Hospital;
