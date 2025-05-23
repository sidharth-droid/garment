

import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Box,Grid, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Edit, Delete ,Download} from '@mui/icons-material';
import api from "../../../api";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function SimplePaper() {
  const [companyDetails, setCompanyDetails] = useState({
    company_name: '',
    gst: '',
    phone: '',
    email: '',
    address: ''
  });
  const [companyList, setCompanyList] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState({ add: false, fetch: false, delete: false });
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Refs for focusing on input fields
  const companyNameRef = useRef(null);
  const gstRef = useRef(null);
  const panRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const addressRef = useRef(null);

  // Fetch company list on component mount
  // useEffect(() => {
  //   const fetchCompanyList = async () => {
  //     setLoading((prevLoading) => ({ ...prevLoading, fetch: true }));
  //     try {
  //       const response = await api.get('/api/user/companies'); // Adjust endpoint as needed
  //       console.log("Fetched Company List Response:", response.data);
  //       //alert("Fetched Company List Response:", response.data);
        
  //       // Use response.data.data to get the array of companies
  //       setCompanyList(Array.isArray(response.data.data) ? response.data.data : []);
  //     } catch (error) {
  //       console.error("Error fetching companies:", error);

  //     } finally {
  //       setLoading((prevLoading) => ({ ...prevLoading, fetch: false }));
  //     }
  //   };

  //   fetchCompanyList();
  // }, []);
  useEffect(() => {
    fetchCompanyList();
}, []);
const fetchCompanyList = async () => {
  setLoading((prevLoading) => ({ ...prevLoading, fetch: true }));
  try {
      const response = await api.get('/api/user/companies'); // Adjust endpoint as needed
      console.log("Fetched Company List Response:", response.data);

      // ✅ Ensure correct data format
      setCompanyList(Array.isArray(response.data.data) ? response.data.data : []);
  } catch (error) {
      console.error("Error fetching companies:", error);
  } finally {
      setLoading((prevLoading) => ({ ...prevLoading, fetch: false }));
  }
};



  const handleChange = (e) => {
    setCompanyDetails({
      ...companyDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
    setEditIndex(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setLoading((prevLoading) => ({ ...prevLoading, add: true }));
    try {
        if (editIndex !== null) {
            // Update company
            const response = await api.put(`/api/user/companies/${companyDetails.gst}/`, companyDetails);
            const updatedList = [...companyList];
            updatedList[editIndex] = response.data;
            setCompanyList(updatedList);
            alert(response.data.message || "Company updated successfully");
        } else {
            // Add new company
            const response = await api.post('/api/user/companies/', companyDetails);
            setCompanyList((prevList) => [...prevList, response.data]);
            alert(response.data.message || "Company added successfully");
        }
        fetchCompanyList()
    } catch (error) {
        console.error("Error adding/updating company:", error);

        if (error.response && error.response.data && error.response.data.error) {
            const errorDetails = error.response.data.error;
            let errorMessages = '';

            // Loop through the error details to construct a readable message
            for (const [field, messages] of Object.entries(errorDetails)) {
                errorMessages += `${field.toUpperCase()}: ${messages.join(", ")}\n`;
            }

            alert(`Validation Errors:\n${errorMessages}`);
        } else if (error.message) {
            alert(`Error: ${error.message}`); // General error
        } else {
            alert("An unknown error occurred."); // Fallback error message
        }
    } finally {
        setLoading((prevLoading) => ({ ...prevLoading, add: false }));
        setCompanyDetails({
            company_name: '',
            pan: '',
            gst: '',
            phone: '',
            email: '',
            address: ''
        });
        setOpen(false);
    }
};


  const handleEdit = (index) => {
    setCompanyDetails(companyList[index]);
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
  setCompanyDetails(companyList[index]); // Ensure this sets the correct company details
  setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setLoading((prevLoading) => ({ ...prevLoading, delete: true }));
    console.log("GST for deletion:", companyDetails.gst); // Check GST value
    try {
      if (!companyDetails.gst) {
        console.error("GST value is missing.");
        return;
      }
      await api.delete(`/api/user/companies/${companyDetails.gst}/`);
      const updatedList = companyList.filter((_, i) => i !== deleteIndex);
      setCompanyList(updatedList);
      console.log("Company deleted successfully!");
      alert("Company deleted successfully!");
    } catch (error) {
      console.error("Error deleting company", error);
    } finally {
      setLoading((prevLoading) => ({ ...prevLoading, delete: false }));
      setDeleteDialogOpen(false);
    }
  };
  
  

  // const handleKeyDown = (e, ref) => {
  //   if (e.key === 'Enter') {
  //     ref.current.focus();
  //   }
  // };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      if (nextRef?.current) {
        nextRef.current.focus(); // Move focus to the next field
      }
    }
  };
  
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Company List", 14, 15);
    
    const tableColumn = ["Company Name", "GST", "Phone", "PAN", "Email", "Address"];
    const tableRows = companyList.map(company => [
      company.company_name,
      company.gst,
      company.phone,
      company.pan,
      company.email,
      company.address
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save("company_list.pdf");
  };


  return (
    <Box sx={{ maxWidth: '100%', padding: 2 }}>

      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        {editIndex !== null ? 'Edit Company' : 'Add Company'}
      </Button>

      {/* Dialog Form */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth > 
      <DialogTitle style={{backgroundColor:'#f9dff5'}}>{editIndex !== null ? 'Edit Company Details' : 'Add Company Details'}</DialogTitle>
        <DialogContent style={{backgroundColor:'#f9dff5'}}>
         <Paper sx={{ padding: "10px" ,backgroundColor:'#f9dff5'}} elevation={0}>
           <form>
           <Grid container spacing={2} marginBottom={2}>
           <Grid item xs={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="company_name"
                value={companyDetails.company_name}
                onChange={handleChange}
                margin="normal"
                required
                inputRef={companyNameRef}  // Ref for this field
                onKeyDown={(e) => handleKeyDown(e, gstRef)}  // Move to GST field on Enter
              />
              </Grid>
              <Grid item xs={6}>
              <TextField
                fullWidth
                label="Company Registration Number/GST Number"
                name="gst"
                value={companyDetails.gst}
                onChange={handleChange}
                margin="normal"
                required
                inputRef={gstRef}  // Ref for this field
                onKeyDown={(e) => handleKeyDown(e, panRef)}  // Move to Phone field on Enter
              />
              </Grid>
              </Grid>
              <Grid container spacing={2} marginBottom={2}>
              <Grid item xs={6}>
              <TextField
                fullWidth
                label="PAN Number"
                name="pan"
                value={companyDetails.pan}
                onChange={handleChange}
                margin="normal"
                required
                inputRef={panRef}  // Ref for this field
                onKeyDown={(e) => handleKeyDown(e, phoneRef)}  // Move to Phone field on Enter
              />
              </Grid>
              <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={companyDetails.phone}
                onChange={handleChange}
                margin="normal"
                required
                inputRef={phoneRef}  // Ref for this field
                onKeyDown={(e) => handleKeyDown(e, emailRef)}  // Move to Email field on Enter
              />
              </Grid>
              </Grid>
              <Grid container spacing={2} marginBottom={2}>
              <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={companyDetails.email}
                onChange={handleChange}
                margin="normal"
                required
                inputRef={emailRef}  // Ref for this field
                onKeyDown={(e) => handleKeyDown(e, addressRef)}  // Move to Address field on Enter
              />
              </Grid>
              <Grid item xs={6}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Address"
                name="address"
                value={companyDetails.address}
                onChange={handleChange}
                required
                margin="normal"
                inputRef={addressRef}  // Ref for this field
              />
              </Grid>
              </Grid>
            </form>
          </Paper>
        </DialogContent>
        <DialogActions style={{backgroundColor:'#f9dff5'}}>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdate} color="secondary" disabled={loading.add}>
            {loading.add ? <CircularProgress size={24} /> : editIndex !== null ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table */}
      <TableContainer component={Paper} sx={{ marginTop: 3 ,position: "relative" }}>
      <Button 
    variant="contained" 
    color="primary" 
    startIcon={<Download />} 
    onClick={downloadPDF}
    sx={{ 
      position: "absolute", 
      right: 16, 
      top: -50,  // Adjust this value as needed
      backgroundColor: "purple", 
      "&:hover": { backgroundColor: "darkviolet" } 
    }}
  >
    Download PDF
  </Button>
        <Table>
          <TableHead>
            <TableRow>
              
              <TableCell>Company Name</TableCell>
              <TableCell>GST</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>PAN</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>
          <IconButton color="primary" onClick={downloadPDF}>
            <Download />
          </IconButton>
        </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(companyList) && companyList.map((company, index) => (
              <TableRow key={index}>
                <TableCell>{company.company_name}</TableCell>
                <TableCell>{company.gst}</TableCell>
                <TableCell>{company.phone}</TableCell>
                <TableCell>{company.pan}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>{company.address}</TableCell>
                <TableCell>
                  <IconButton color="secondary" onClick={() => handleEdit(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this company?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" disabled={loading.delete}>
            {loading.delete ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
