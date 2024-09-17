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
    name: 'City Hospital',
    adminEmail: 'admin@cityhospital.com',
    description: 'A major hospital offering comprehensive healthcare services.',
    address: '123 Main St, Springfield, IL, 62701',
    adminName: 'John Doe',
    status: 'pending',
    tenantId: 'T123'
  },
  {
    name: 'Greenwood Medical',
    adminEmail: 'contact@greenwoodmc.com',
    description: 'Specializes in orthopedic and emergency care.',
    address: '456 Elm St, Springfield, IL, 62702',
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
      const response = await fetch('https://api.example.com/hospitals');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setHospitals(data);
    } catch (error) {
      console.log('error', error);
      setHospitals(initialHospitals);
      setLoading(false);
    } finally {
      setLoading(false);
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
    return selectedHospital?.name && selectedHospital?.description && selectedHospital?.address && selectedHospital?.adminName && selectedHospital?.adminEmail && selectedHospital?.tenantId;
  };

  const handleSave = () => {
    if (!validateFields()) {
      setSnackbarMessage('Please fill out all fields before saving.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true); // Start loading

    setTimeout(() => { // Simulate a save operation
      try {
        if (isNew) {
          setHospitals([...hospitals, {...selectedHospital, status: 'pending'}]);
          setSnackbarMessage('Hospital onboarded successfully!');
          setSnackbarSeverity('success');
        } else {
          const updatedHospitals = hospitals.map(hospital =>
            hospital.name === initialValues.name ? selectedHospital : hospital
          );
          setHospitals(updatedHospitals);
        }

        
        setSnackbarOpen(true);
      } catch (error) {
        setSnackbarMessage('An error occurred while saving.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false); // Stop loading
        handleClose();
      }
    }, 2000); // Simulate a delay (e.g., 2 seconds)
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
        <Button variant="contained" onClick={() => handleOpen(null, true)}>Add New</Button>
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
              <h3>{hospital.name}</h3>
              <div style={{
                display: 'flex',
                justifyContent: "space-between",
                gap: '20px',
                alignItems: 'center',
              }}>
                <div style={{ width: '200px' }}><strong>Status:</strong> {hospital.status}</div>
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
            label="Name"
            name="name"
            value={selectedHospital?.name || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={selectedHospital?.description || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            multiline
            minRows={2}
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={selectedHospital?.address || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            margin="normal"
          />
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
          <TextField
            label="Tenant ID"
            name="tenantId"
            value={selectedHospital?.tenantId || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            margin="normal"
          />
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
