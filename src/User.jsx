import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, AlertTitle, Chip, Typography, Button } from '@mui/material'
import React, { useState } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';

const User = ({ data: hospital, email }) => {


  if (!hospital) return;
  return (
    <div className='w-[90%] m-auto mt-6'>
      <div className="bg-blue-100 border border-blue-300 rounded-md p-4 my-4">
        <Typography className="text-lg font-bold text-blue-700">
          Welcome <strong>{email}</strong>, you have successfully logged into your account!
        </Typography>
        <Typography className="text-md text-blue-600 mt-2">
          Please find the below details.
        </Typography>
      </div>





      <div className="border border-gray-200 rounded-lg p-6 text-center shadow-lg bg-white grid grid-cols-2 gap-6 justify-between items-center mb-8">
        <h3 className="text-xl font-semibold text-gray-800">{hospital?.hospitalName}</h3>
        <div className="flex justify-between gap-6 items-center">
          <div className="min-w-[200px] text-left">
            <strong className="font-medium text-gray-700">Admin Name:</strong>
            <span className="text-gray-600 ml-2">{hospital?.adminName}</span>
          </div>
          <div className="min-w-[200px] text-left">
            <strong className="font-medium text-gray-700">Tenant ID:</strong>
            <span className="text-gray-600 ml-2">{hospital?.tenantId}</span>
          </div>
          <div className="min-w-[200px] text-left">
            <strong className="font-medium text-gray-700">Admin ID:</strong>
            <span className="text-gray-600 ml-2">{hospital?.adminId}</span>
          </div>
        </div>
      </div>


     
    </div>
  )
}

export default User