import React, { useState, useEffect, useRef } from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  TextField, Button, Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Edit, Delete,Download } from '@mui/icons-material';
import api from "../../../api";

export default function FinancialYearForm() {
  const [financialYearDetails, setFinancialYearDetails] = useState({
    start_date: '',
    end_date: '',
    status: true,
    financial_year_name: '',
    description: ''
  });

  const [financialYearList, setFinancialYearList] = useState([]);
  const [loading, setLoading] = useState({ add: false });
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // State for the delete confirmation dialog
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const statusRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (financialYearDetails.start_date && financialYearDetails.end_date) {
      const startYear = new Date(financialYearDetails.start_date).getFullYear();
      const endYear = new Date(financialYearDetails.end_date).getFullYear();
      setFinancialYearDetails({
        ...financialYearDetails,
        financial_year_name: `${startYear}-${endYear}`
      });
    }
  }, [financialYearDetails.start_date, financialYearDetails.end_date]);
  
  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const response = await api.get('/api/user/financial-years/'); // Replace with your API endpoint
        setFinancialYearList(response.data.data);
      } catch (error) {
        console.error('Error fetching financial year data:', error);
      } finally {
        setLoading({ ...loading, fetch: false });
      }
    };

    fetchFinancialYears();
  }, []);

  const handleChange = (e) => {
    setFinancialYearDetails({
      ...financialYearDetails,
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
    setLoading({ ...loading, add: true });

    const apiUrl = editIndex !== null
      ? `/api/user/financial-years/${financialYearList[editIndex].id}/` // Update endpoint
      : '/api/user/financial-years/'; // Add endpoint

    const method = editIndex !== null ? 'put' : 'post';

    try {
      const response = await api({
        method,
        url: apiUrl,
        data: financialYearDetails,
      });

      if (editIndex !== null) {
        const updatedList = [...financialYearList];
        updatedList[editIndex] = response.data.data;
        setFinancialYearList(updatedList);
      } else {
        setFinancialYearList([...financialYearList, response.data.data]);
      }

      console.log(editIndex !== null ? "Updated" : "Added", response.data);
      alert(response.data.message);
      setOpen(false);
    } catch (error) {
      console.error('Error saving financial year:', error);
    } finally {
      setLoading({ ...loading, add: false });
    }

    setFinancialYearDetails({
      start_date: '',
      end_date: '',
      status: true,
      financial_year_name: '',
      description: ''
    });
  };


  const handleEdit = (index) => {
    setFinancialYearDetails(financialYearList[index]);
    setEditIndex(index);
    setOpen(true);
  };

  const handleOpenDeleteConfirm = (index) => {
    setDeleteIndex(index);
    setOpenDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      const id = financialYearList[deleteIndex].id;
      await api.delete(`/api/user/financial-years/${id}`); // Replace with your DELETE API endpoint

      const updatedList = financialYearList.filter((_, i) => i !== deleteIndex);
      setFinancialYearList(updatedList);

      console.log("Deleted financial year at index", deleteIndex);
      alert("Deleted financial year at index", deleteIndex);
    } catch (error) {
      console.error('Error deleting financial year:', error);
    } finally {
      setOpenDeleteConfirm(false);
    }
  };


  // Handle key press for navigating between fields and form submission
  const handleKeyPress = (e, ref) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextField = ref.current?.nextElementSibling;
      if (nextField) {
        nextField.focus();
      } else {
        handleAddOrUpdate(e);
      }
    }
  };

  const generateFinancialYearPDF = () => {
    const doc = new jsPDF();
    doc.text("Financial Year Report", 14, 15); // Title
  
    doc.autoTable({
      startY: 25, // Moves table closer to the title
      head: [["#", "Financial Year Name", "Start Date", "End Date", "Status", "Description"]],
      body: financialYearList.map((year, index) => [
        index + 1,
        year.financial_year_name,
        year.start_date,
        year.end_date,
        year.status ? "Active" : "Inactive",
        year.description,
      ]),
      theme: "striped",
    });
  
    doc.save("Financial_Year_List.pdf");
  };
  

  return (
    <Box sx={{ maxWidth: '100%', padding: 2 }}>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        {editIndex !== null ? 'Edit Financial Year' : 'Add Financial Year'}
      </Button>
       

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{backgroundColor:'#f9dff5'}}>{editIndex !== null ? 'Edit Financial Year' : 'Add Financial Year'}</DialogTitle>
        <DialogContent style={{backgroundColor:'#f9dff5'}}>
          <Paper sx={{ padding: "10px" , backgroundColor: "#f9dff5"}} elevation={0}>
            <form>
              {/* Start Date */}
              <TextField
                fullWidth
                label="Financial Year Start Date"
                name="start_date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={financialYearDetails.start_date}
                onChange={handleChange}
                margin="normal"
                required
                inputRef={startDateRef}
                onKeyDown={(e) => handleKeyPress(e, endDateRef)}
              />

              {/* End Date */}
              <TextField
                fullWidth
                label="Financial Year End Date"
                name="end_date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={financialYearDetails.end_date}
                onChange={handleChange}
                margin="normal"
                required
                inputRef={endDateRef}
                onKeyDown={(e) => handleKeyPress(e, statusRef)}
              />

              {/* Status */}
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={financialYearDetails.status}
                  name="status"
                  onChange={handleChange}
                  label="Status"
                  inputRef={statusRef}
                  onKeyDown={(e) => handleKeyPress(e, descriptionRef)}
                >
                  <MenuItem value={true}>Active</MenuItem>
                  <MenuItem value={false}>Inactive</MenuItem>
                </Select>
              </FormControl>

              {/* Financial Year Name (Auto-generated) */}
              <TextField
                fullWidth
                label="Financial Year Name"
                name="financial_year_name"
                value={financialYearDetails.financial_year_name}
                InputProps={{ readOnly: true }}
                margin="normal"
              />

              {/* Description */}
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={financialYearDetails.description}
                onChange={handleChange}
                margin="normal"
                inputRef={descriptionRef}
                onKeyDown={(e) => handleKeyPress(e, null)}
              />
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

      {/* Table to Display Financial Year Details */}
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Financial Year Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
               <TableCell>
                  <IconButton color="primary" onClick={generateFinancialYearPDF}>
                    <Download />
                    </IconButton>
                                                                                
                  </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {financialYearList.map((year, index) => (
              <TableRow key={index}>
                <TableCell>{year.financial_year_name}</TableCell>
                <TableCell>{year.start_date}</TableCell>
                <TableCell>{year.end_date}</TableCell>
                <TableCell>{year.status ? 'Active' : 'Inactive'}</TableCell> {/* Updated line */}
                <TableCell>{year.description}</TableCell>
                <TableCell>
                  <IconButton color="secondary" onClick={() => handleEdit(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDeleteConfirm(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
        <DialogTitle>Delete Financial Year</DialogTitle>
        <DialogContent>Are you sure you want to delete this financial year?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

