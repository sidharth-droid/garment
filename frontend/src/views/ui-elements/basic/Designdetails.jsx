import React, { useState, useRef ,useEffect} from 'react';
import {
  TextField, Button, Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from "../../../api";

export default function DesignReport() {
  const [designDetails, setDesignDetails] = useState({
    design_name: '',
    design_code: '',
    description: '',
    associated_items: []
  });

  const [designList, setDesignList] = useState([]);
  const [items, setItems] = useState([]);  
  const [loading, setLoading] = useState({ add: false });
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    async function fetchDesigns() {
      try {
        const response = await api.get('api/user/designs/');
        setDesignList(response.data.data);
        alert(response.data.message) // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching designs:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/user/items/'); // Endpoint to fetch categories
        setItems(response.data.data); // Update state with categories from backend
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchDesigns();
    fetchCategories();
  }, []);

  // Create refs for each field
  const fieldRefs = useRef([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Special handling for associated_items to ensure it's treated as an array
    if (name === "associated_items") {
      setDesignDetails(prevState => ({
        ...prevState,
        [name]: Array.isArray(value) ? value : [value] // Wrap in an array if not already
      }));
    } else {
      setDesignDetails(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  

  const handleClickOpen = () => {
    setOpen(true);
    setEditIndex(null);
    setDesignDetails({
      design_name: '',
      design_code: '',
      description: '',
      associated_items: []
    })
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, add: true });
  
    try {
      if (editIndex !== null) {
        // Update existing design
        const response = await api.put(`api/user/designs/${designDetails.design_code}/`, designDetails);
        const updatedList = [...designList];
        updatedList[editIndex] = response.data; // Update with response data if needed
        setDesignList(updatedList);
        console.log('Updated', response.data);
        alert(response.data.message);
      } else {
        // Add new design
        const response = await api.post('api/user/designs/', designDetails);
        setDesignList([...designList, response.data]); // Add new item based on response
        console.log('Added', response.data);
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error saving design:', error);
      alert(error);
    } finally {
      setLoading({ ...loading, add: false });
      // Resetting to initial state, including associated_items as an empty array
      // setDesignDetails({ design_name: '', design_code: '', description: '', associated_items: [] });
      setOpen(false);
    }
    
  };
  

  const handleEdit = (index) => {
    setDesignDetails(designList[index]);
    setEditIndex(index);
    setOpen(true);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setConfirmOpen(true);
    setDesignDetails(designList[index]);
  };

  const handleDeleteConfirm = async () => {
    try {
       const response= await api.delete(`api/user/designs/${designDetails.design_code}` ,designDetails);
      const updatedList = designList.filter((_, i) => i !== deleteIndex);
      setDesignList(updatedList);
      console.log('Deleted design at index', deleteIndex);
      alert(response.data.message);
    } catch (error) {
      console.error('Error deleting design:', error);
    } finally {
      setConfirmOpen(false);
    }
  };
  

  const handleDeleteCancel = () => {
    setConfirmOpen(false);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextIndex = index + 1;
      if (fieldRefs.current[nextIndex]) {
        fieldRefs.current[nextIndex].focus();
      }
    }
  };

  return (
    <Box sx={{ maxWidth: '100%', padding: 2 }}>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        {editIndex !== null ? 'Edit Design' : 'Add Design'}
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: '#f9dff5' }}>
          {editIndex !== null ? 'Edit Design Details' : 'Add Design Details'}
        </DialogTitle>
        <DialogContent style={{ backgroundColor: '#f9dff5' }}>
          <Paper sx={{ padding: "10px", backgroundColor: "#f9dff5" }} elevation={0}>
            <form>
              <TextField
                fullWidth
                label="Design Name"
                name="design_name"
                value={designDetails.design_name}
                onChange={handleChange}
                margin="normal"
                required
                inputRef={el => (fieldRefs.current[0] = el)}
                onKeyDown={(e) => handleKeyDown(e, 0)}
              />
              <TextField
                fullWidth
                label="Design Code"
                name="design_code"
                value={designDetails.design_code}
                onChange={handleChange}
                margin="normal"
                required
                inputRef={el => (fieldRefs.current[1] = el)}
                onKeyDown={(e) => handleKeyDown(e, 1)}
              />
              <FormControl fullWidth margin="normal" required>
  <InputLabel>Associated Items</InputLabel>
  <Select
  multiple
  value={designDetails.associated_items || []}
  name="associated_items"
  onChange={handleChange}
  label="Associated Items"
  inputRef={el => (fieldRefs.current[2] = el)}
  onKeyDown={(e) => handleKeyDown(e, 2)}
>
  {items.map(item => (
    <MenuItem key={item.id} value={item.item_name}>
      {item.item_name}
    </MenuItem>
  ))}
</Select>

</FormControl>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={designDetails.description}
                onChange={handleChange}
                margin="normal"
                inputRef={el => (fieldRefs.current[3] = el)}
                onKeyDown={(e) => handleKeyDown(e, 3)}
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

      <Dialog open={confirmOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>Are you sure to delete?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Design Name</TableCell>
              <TableCell>Design Code</TableCell>
              <TableCell>Associated Items</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {designList.map((design, index) => (
              <TableRow key={index}>
                <TableCell>{design.design_name}</TableCell>
                <TableCell>{design.design_code}</TableCell>
                <TableCell>{Array.isArray(design.associated_items) ? design.associated_items.join(", ") : design.associated_items}</TableCell>
                <TableCell>{design.description}</TableCell>
                <TableCell>
                  <IconButton color="secondary" onClick={() => handleEdit(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
