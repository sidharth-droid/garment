import React, { useState, useRef,useEffect } from 'react';
import {
  TextField, Button, Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Download,Edit, Delete } from '@mui/icons-material';
import api from "../../../api";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function TaxDetails() {
  const [taxDetails, setTaxDetails] = useState({
    tax_name: '',
    tax_percentage: '',
    description: ''
  });

  const [taxList, setTaxList] = useState([]); // List to hold all tax entries
  const [loading, setLoading] = useState({ add: false });
  const [open, setOpen] = useState(false); // State to control dialog visibility
  const [editIndex, setEditIndex] = useState(null); // Track index of the tax being edited
  const [deleteIndex, setDeleteIndex] = useState(null); // Track index of the tax to be deleted
  const [confirmOpen, setConfirmOpen] = useState(false); // State to control delete confirmation dialog

  // Refs for each field
  const taxNameRef = useRef(null);
  const taxPercentageRef = useRef(null);
  const descriptionRef = useRef(null);

//   useEffect(() => {
 
//   const fetchTaxList = async () => {
//     try {
//       setLoading({ ...loading, fetch: true });
//       const response = await api.get('/api/user/taxes/'); // Replace with your API endpoint
//       setTaxList(response.data.data);
//       //alert(response.data.message);
//     } catch (error) {
//       console.error("Error fetching tax list", error);
//     } finally {
//       setLoading({ ...loading, fetch: false });
//     }
//   };

//   fetchTaxList(); // Fetch tax details when the component mounts
// }, []);
const fetchTaxList = async () => {
  try {
      setLoading((prev) => ({ ...prev, fetch: true }));
      const response = await api.get("/api/user/taxes/"); // Replace with your API endpoint
      setTaxList(response.data.data);
  } catch (error) {
      console.error("Error fetching tax list", error);
  } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
  }
};

// Call fetchTaxList when the component mounts
useEffect(() => {
  fetchTaxList();
}, []);


  const handleChange = (e) => {
    setTaxDetails({
      ...taxDetails,
      [e.target.name]: e.target.value
    });
  };

  // const handleKeyDown = (e, nextRef) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     nextRef.current?.focus();
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
  

  const handleClickOpen = () => {
    setOpen(true); // Open the dialog when "Add Tax" button is clicked
    setEditIndex(null); // Reset the edit index
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog when "Cancel" button is clicked
  };

  // const handleAddOrUpdate = async (e) => {
  //   e.preventDefault();
  //   setLoading({ ...loading, add: true });
  
  //   // Input validation
  //   if (!taxDetails.tax_name || !taxDetails.tax_percentage) {
  //     alert("Tax Name and Tax Percentage are required.");
  //     setLoading({ ...loading, add: false });
  //     return;
  //   }
  
  //   try {
  //     if (editIndex !== null) {
  //       // Update logic
  //       const responce =await api.put(`/api/user/taxes/${taxList[editIndex].id}/`, taxDetails); // Ensure this endpoint and payload are correct
  //       const updatedList = [...taxList];
  //       updatedList[editIndex] = taxDetails;
  //       setTaxList(updatedList);
  //       console.log("Updated", taxDetails);
  //       alert(responce.data.message);
  //     } else {
  //       // Add logic
  //       const response = await api.post('/api/user/taxes/', taxDetails); // Ensure this is correct
  //       setTaxList([...taxList, response.data]); // Assuming the response contains the added tax data
  //       console.log("Added", taxDetails);
  //       alert(response.data.message);
  //     }
  
  //     // Reset the form and state
  //     setTaxDetails({
  //       tax_name: '',
  //       tax_percentage: '',
  //       description: ''
  //     });
  //     setEditIndex(null); // Reset edit index after successful update
  //     setOpen(false); // Close the dialog after adding or updating
  //   } catch (error) {
  //     console.error("Error adding/updating tax", error);
  //   } finally {
  //     setLoading({ ...loading, add: false }); // Ensure loading state is correctly set
  //   }
  // };
  

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, add: true }));

    // Validation rules
    const errors = [];

    const taxNameRegex = /^[A-Za-z-\s]+$/; // Allows letters, hyphens (-), and spaces
    const descriptionRegex = /^[A-Za-z0-9-\s,]+$/; // Allows letters, numbers, spaces, hyphens (-), and commas (,)

    if (!taxDetails.tax_name.trim()) {
        errors.push("Tax Name is required.");
    } else if (!taxNameRegex.test(taxDetails.tax_name)) {
        errors.push("Tax Name can only contain letters, hyphens (-), and spaces.");
    }

    if (!taxDetails.tax_percentage) {
        errors.push("Tax Percentage is required.");
    } else if (isNaN(taxDetails.tax_percentage) || taxDetails.tax_percentage < 0) {
        errors.push("Tax Percentage must be a valid positive number.");
    }

    if (taxDetails.description.trim() && !descriptionRegex.test(taxDetails.description)) {
        errors.push("Description can only contain letters, numbers, spaces, hyphens (-), and commas (,).");
    }

    if (errors.length > 0) {
        alert("Validation Errors:\n" + errors.join("\n"));
        setLoading((prev) => ({ ...prev, add: false }));
        return;
    }

    try {
        let response;
        if (editIndex !== null) {
            // Update logic
            response = await api.put(`/api/user/taxes/${taxList[editIndex].id}/`, taxDetails);
            alert(response.data.message);
        } else {
            // Add logic
            response = await api.post("/api/user/taxes/", taxDetails);
            alert(response.data.message);
        }

        // ✅ Fetch updated tax list after add/update
        fetchTaxList();

        // Reset form
        setTaxDetails({
            tax_name: "",
            tax_percentage: "",
            description: "",
        });
        setEditIndex(null);
        setOpen(false);
    } catch (error) {
        console.error("Error adding/updating tax:", error);
        
        // Show backend validation error (if available)
        if (error.response && error.response.data && error.response.data.error) {
            const backendErrors = Object.values(error.response.data.error).flat().join("\n");
            alert(`Backend Error:\n${backendErrors}`);
        } else {
            alert("An unexpected error occurred. Please try again.");
        }
    } finally {
        setLoading((prev) => ({ ...prev, add: false }));
    }
};

  const handleEdit = (index) => {
    setTaxDetails(taxList[index]); // Populate form with the selected tax's details
    setEditIndex(index); // Set the index of the tax being edited
    setOpen(true); // Open the dialog to edit
  };

  const handleDeleteConfirmation = (index) => {
    setDeleteIndex(index); // Store the index of the item to be deleted
    setConfirmOpen(true); // Open the confirmation dialog
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/user/taxes/${taxList[deleteIndex].id}`); // Replace with your API endpoint
      const updatedList = taxList.filter((_, i) => i !== deleteIndex); // Remove the selected tax
      setTaxList(updatedList);
      console.log("Deleted tax at index", deleteIndex);ae%$%$
      setConfirmOpen(false); // Close the confirmation dialog
    } catch (error) {
      console.error("Error deleting tax", error);
    }
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false); // Close the confirmation dialog without deleting
  };


  const generateTaxPDF = () => {
    const doc = new jsPDF();
    doc.text("Tax List Report", 14, 15); // Title
  
    doc.autoTable({
      startY: 25, // Moves table closer to title
      head: [["#", "Tax Name", "Tax Percentage", "Description"]],
      body: (Array.isArray(taxList) ? taxList : []).map((tax, index) => [
        index + 1,
        tax.tax_name,
        tax.tax_percentage + " %",
        tax.description,
      ]),
      theme: "striped",
    });
  
    doc.save("Tax_List.pdf");
  };

  return (
    <Box sx={{ maxWidth: '100%', padding: 2 }}>
      {/* Add Tax Button */}
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        {editIndex !== null ? 'Edit Tax' : 'Add Tax'}
      </Button>

     
      

      {/* Dialog (Popup) Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: '#f9dff5' }}>
          {editIndex !== null ? 'Edit Tax Details' : 'Add Tax Details'}
        </DialogTitle>
        <DialogContent style={{ backgroundColor: '#f9dff5' }}>
          <Paper sx={{ padding: '10px', backgroundColor: '#f9dff5' }} elevation={0}>
            <form>
              {/* Tax Name */}
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Tax Name</InputLabel>
                <Select
                  value={taxDetails.tax_name}
                  name="tax_name"
                  onChange={handleChange}
                  label="Tax Name"
                  inputRef={taxNameRef}
                  onKeyDown={(e) => handleKeyDown(e, taxPercentageRef)}
                >
                  <MenuItem value="CGST">CGST</MenuItem>
                  <MenuItem value="SGST">SGST</MenuItem>
                  <MenuItem value="IGST">IGST</MenuItem>
                </Select>
              </FormControl>

              {/* Tax Percentage */}
              <TextField
                fullWidth
                label="Tax Percentage"
                name="tax_percentage"
                value={taxDetails.tax_percentage}
                onChange={handleChange}
                margin="normal"
                required
                inputRef={taxPercentageRef}
                onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
              />

              {/* Description */}
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={taxDetails.description}
                onChange={handleChange}
                margin="normal"
                inputRef={descriptionRef}
              />
            </form>
          </Paper>
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#f9dff5' }}>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdate} color="secondary" disabled={loading.add}>
            {loading.add ? <CircularProgress size={24} /> : editIndex !== null ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table to Display Tax Details */}
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tax Name</TableCell>
              <TableCell>Tax Percentage</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>
                                                      <IconButton color="primary" onClick={generateTaxPDF}>
                                                        <Download />
                                                      </IconButton>
                                                    </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {(Array.isArray(taxList) ? taxList : []).map((tax, index) => (
              <TableRow key={index}>
                <TableCell>{tax.tax_name}</TableCell>
                <TableCell>{tax.tax_percentage}</TableCell>
                <TableCell>{tax.description}</TableCell>
                <TableCell>
                  <IconButton color="secondary" onClick={() => handleEdit(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteConfirmation(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this tax entry?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="secondary">Cancel</Button>
          <Button onClick={handleDelete} color="error">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
