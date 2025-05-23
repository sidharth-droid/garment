

import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button,Grid, MenuItem, Box, Dialog, DialogActions, InputLabel, Select, FormControl, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../api';

export default function PurchaseVoucher() {
  const [partyInfo, setPartyInfo] = useState({ party_name: '', address: '', item: '' });
  const [partyList, setPartyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voucherInfo, setVoucherInfo] = useState({ voucher_number: '', voucher_date: '' });
  const [itemList, setItemList] = useState([]);
  const [itemDetails, setItemDetails] = useState({
    quantity: '',
    rate: '',
    discount_percentage: '',
    gst_percentage: '',
    discount_amount: 0,
    taxable_amount: 0,
    gst_amount: 0,
    purchase_amount: 0
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  // const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
//   const [error, setError] = useState('');
//   const [editIndex, setEditIndex] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const partyNameRef = useRef(null);
  const addressRef = useRef(null);
  const itemRef = useRef(null);
  const voucherNumberRef = useRef(null);
  const voucherDateRef = useRef(null);
  const quantityRef = useRef(null);
  const rateRef = useRef(null);
  const discountRef = useRef(null);
  const gstRef = useRef(null);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      if (nextRef && nextRef.current) {
        nextRef.current.focus(); // Move focus to the next input field
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('api/purchase/purchase-entry/');
        setItemList(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchParties = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/user/party/');
        setPartyList(response.data.data);
      } catch (err) {
        setError('Failed to load parties');
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
    fetchData();
  }, []);


  const handlePartyChange = (event) => {
    const { name, value } = event.target;
    if (name === 'party_name') {
      const selectedParty = partyList.find(party => party.party_name === value);
      if (selectedParty) {
        setPartyInfo({
          ...partyInfo,
          party_name: selectedParty.party_name,
          address: selectedParty.address,
          item: selectedParty.item || ''
        });
      }
    } else {
      setPartyInfo({ ...partyInfo, [name]: value });
    }
  };

  const handleVoucherChange = (e) => {
    const { name, value } = e.target;
    setVoucherInfo({ ...voucherInfo, [name]: value });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    const updatedItem = { ...itemDetails, [name]: value };
    const quantity = parseFloat(updatedItem.quantity) || 0;
    const rate = parseFloat(updatedItem.rate) || 0;
    const amount = quantity * rate;
    const discountAmount = (parseFloat(updatedItem.discount_percentage) / 100) * amount;
    const taxableAmount = amount - discountAmount;
    const gstAmount = (parseFloat(updatedItem.gst_percentage) / 100) * taxableAmount;
    const purchaseAmount = taxableAmount + gstAmount;

    setItemDetails({
      ...updatedItem,
      discount_amount: discountAmount || 0,
      taxable_amount: taxableAmount || 0,
      gst_amount: gstAmount || 0,
      purchase_amount: purchaseAmount || 0
    });
  };

 

  // const handleSaveItem = async () => {
  //   const { party_name, address, item } = partyInfo;
  //   const { voucher_number, voucher_date } = voucherInfo;
  //   const { quantity, rate, discount_percentage, gst_percentage } = itemDetails;
  
  //   if (!party_name || !address || !voucher_number || !voucher_date || !quantity || !rate  || !item) {
  //     setError('Please fill in all fields.');
  //     return;
  //   }
  
  //   const newItem = {
  //     ...itemDetails,
  //     party_name,
  //     address,
  //     item,
  //     voucher_number,
  //     voucher_date,
  //   };
  //   console.log(JSON.stringify(newItem, null, 2));
  
  //   try {
  //     let response;
  //     if (editIndex !== null) {
  //       response = await api.put(`api/purchase/purchase-entries/${newItem.party_name}/`, newItem);
  //     } else {
  //       response = await api.post('api/purchase/purchase-entry/', newItem);
  //     }
  //     const savedItem = response.data;
  
  //     // Update the list with the newly saved item
  //     if (editIndex !== null) {
  //       const updatedItemList = itemList.map((item, index) => index === editIndex ? savedItem : item);
  //       setItemList(updatedItemList);
  //       setEditIndex(null);
  //     } else {
  //       setItemList([...itemList, savedItem]);
  //     }
  
  //     // Fetch the updated data without page refresh
  //     fetchData();
  
  //     resetFormFields();
  //   } catch (error) {
  //     console.error('Error saving data:', error);
  //     setError('Error saving data. Please try again.');
  //   }
  // };

  const handleSaveItem = async () => {
    setError(""); // Clear previous errors

    const { party_name, address, item } = partyInfo;
    const { voucher_number, voucher_date } = voucherInfo;
    const { quantity, rate, discount_percentage, gst_percentage } = itemDetails;

    if (!party_name || !address || !voucher_number || !voucher_date || !quantity || !rate || !item) {
        alert("Please fill in all fields.");
        setError("Please fill in all fields.");
        return;
    }

    const newItem = {
        ...itemDetails,
        party_name,
        address,
        item,
        voucher_number,
        voucher_date,
    };

    console.log("Saving Item:", JSON.stringify(newItem, null, 2));

    try {
        let response;
        if (editIndex !== null) {
            response = await api.put(`api/purchase/purchase-entries/${newItem.party_name}/`, newItem);
        } else {
            response = await api.post("api/purchase/purchase-entry/", newItem);
        }

        const savedItem = response.data;

        if (editIndex !== null) {
            const updatedItemList = itemList.map((item, index) => (index === editIndex ? savedItem : item));
            setItemList(updatedItemList);
            setEditIndex(null);
        } else {
            setItemList([...itemList, savedItem]);
        }

        fetchData();
        resetFormFields();

        alert("✅ Item saved successfully!");
    } catch (error) {
        console.error("Error saving data:", error);

        let errorMessage = "Error saving data. Please try again.";
        if (error.response && error.response.data) {
            console.log("Error response data:", error.response.data);

            if (error.response.data.error) {
                const backendErrors = error.response.data.error;
                errorMessage = Object.keys(backendErrors)
                    .map((key) => `${key}: ${backendErrors[key].join(", ")}`)
                    .join("\n");
            } else if (error.response.data.detail) {
                errorMessage = error.response.data.detail;
            }
        }

        alert("⚠️ " + errorMessage);
        setError(errorMessage);
    }
};

  
  // Fetch function to get data from the backend
  const fetchData = async () => {
    try {
      const response = await api.get('api/purchase/purchase-entry/');
      setItemList(response.data.data);  // Assuming the response structure has 'data' as the key
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const resetFormFields = () => {
    setPartyInfo({ party_name: '', address: '', item: '' });
    setVoucherInfo({ voucher_number: '', voucher_date: '' });
    setItemDetails({
      quantity: '',
      rate: '',
      discount_percentage: '',
      gst_percentage: '',
      discount_amount: 0,
      taxable_amount: 0,
      gst_amount: 0,
      purchase_amount: 0
    });
    setOpenDialog(false);
    setError('');
  };

  const handleOpenDialog = (index = null) => {
    if (index !== null) {
      const itemToEdit = itemList[index];
      setItemDetails({
        quantity: itemToEdit.quantity,
        rate: itemToEdit.rate,
        discount_percentage: itemToEdit.discount_percentage,
        gst_percentage: itemToEdit.gst_percentage,
        discount_amount: itemToEdit.discount_amount,
        taxable_amount: itemToEdit.taxable_amount,
        gst_amount: itemToEdit.gst_amount,
        purchase_amount: itemToEdit.purchase_amount,
      });
      setPartyInfo({ party_name: itemToEdit.party_name, address: itemToEdit.address, item: itemToEdit.item });
      setVoucherInfo({ voucher_number: itemToEdit.voucher_number, voucher_date: itemToEdit.voucher_date });
      setEditIndex(index);
    } else {
      setEditIndex(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError('');
  };
  //   // Close Dialog
//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setError(''); // Clear any previous errors
//   };

  // Open Confirmation Dialog
  const handleOpenConfirmDialog = (index) => {
    setItemToDelete(index);
    setOpenConfirmDialog(true);
  };

  // Close Confirmation Dialog
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setItemToDelete(null);
  };

  // Confirm and Delete Item from List
  const handleConfirmDelete = async () => {
    if (itemToDelete !== null) {
      const itemToDeleteData = itemList[itemToDelete]; // Get the item to delete (optional for API)
      try {
        // Assuming you have an endpoint like 'api/user/purchase-entries/{id}/' for deleting
        // Modify the URL and ID/identifier as per your API
        await api.delete(`api/purchase/purchase-entries/${itemToDeleteData.party_name}/`);
  
        // Update the local state after successful deletion
        setItemList(itemList.filter((_, itemIndex) => itemIndex !== itemToDelete));
        setItemToDelete(null);
        setOpenConfirmDialog(false);
      } catch (error) {
        console.error('Error deleting item:', error);
        setError('Failed to delete the item. Please try again.');
        setOpenConfirmDialog(false); // Optionally keep dialog open for retry
      }
    }
  };
  


  return (
    <Box sx={{ maxWidth: '100%', padding: 2 }}>
      <Button variant="contained" color="secondary" onClick={() => handleOpenDialog()}>
        {editIndex !== null ? 'Edit Purchase' : 'Add Purchase'}
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle style={{ backgroundColor: '#f9dff5' }}>{editIndex !== null ? 'Edit Purchase' : 'Add Purchase'}</DialogTitle>
        <DialogContent style={{ backgroundColor: '#f9dff5' }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Party Name</InputLabel>
            <Select
              value={partyInfo.party_name}
              onChange={handlePartyChange}
              label="Party Name"
              name="party_name"
              required
              disabled={loading}
              inputRef={partyNameRef}
              onKeyDown={(e) => handleKeyDown(e, itemRef)}
            >
              {loading ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                partyList.map((party) => (
                  <MenuItem key={party.id} value={party.party_name}>
                    {party.party_name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          </Grid>
          <Grid item xs={6}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={partyInfo.address}
            onChange={handlePartyChange}
            required
            margin="normal"
            inputRef={addressRef}
            onKeyDown={(e) => handleKeyDown(e, voucherNumberRef)}
          />
          </Grid>
          </Grid>
          <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={6}>
          <TextField
            fullWidth
            label="Item"
            name="item"
            value={partyInfo.item}
            onChange={handlePartyChange}
            required
            margin="normal"
            inputRef={itemRef}
            onKeyDown={(e) => handleKeyDown(e, voucherDateRef)}
          />
          </Grid>
          <Grid item xs={6}>
          <TextField
            fullWidth
            label="Voucher Number"
            name="voucher_number"
            value={voucherInfo.voucher_number}
            onChange={handleVoucherChange}
            required
            margin="normal"
            inputRef={voucherNumberRef}
            onKeyDown={(e) => handleKeyDown(e, quantityRef)}
          />
          </Grid>
          </Grid>
          <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={6}>
          <TextField
            fullWidth
            label="Voucher Date"
            type="date"
            name="voucher_date"
            value={voucherInfo.voucher_date}
            onChange={handleVoucherChange}
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputRef={voucherDateRef}
            onKeyDown={(e) => handleKeyDown(e, rateRef)}
          />
          </Grid>
          <Grid item xs={6}>
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            value={itemDetails.quantity}
            onChange={handleItemChange}
            required
            margin="normal"
            inputRef={quantityRef}
            onKeyDown={(e) => handleKeyDown(e, discountRef)}
          />
          </Grid>
          </Grid>

          <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={6}>
          <TextField
            fullWidth
            label="Rate"
            name="rate"
            value={itemDetails.rate}
            onChange={handleItemChange}
            required
            margin="normal"
            inputRef={rateRef}
            onKeyDown={(e) => handleKeyDown(e, gstRef)}
          />
          </Grid>
          <Grid item xs={6}>
          <TextField
            fullWidth
            label="Discount (%)"
            name="discount_percentage"
            value={itemDetails.discount_percentage}
            onChange={handleItemChange}
            margin="normal"
          />
          </Grid>
          </Grid>
          <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={6}>
          <TextField
            fullWidth
            label="GST (%)"
            name="gst_percentage"
            value={itemDetails.gst_percentage}
            onChange={handleItemChange}
            margin="normal"
          />
          </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#f9dff5' }}>
        <Button onClick={handleSaveItem} color="secondary">
            Save
          </Button>
          <Button onClick={handleCloseDialog} color="error">
            Cancel
          </Button>
         
        </DialogActions>
      </Dialog>
       {/* Confirmation Dialog for Deleting an Item */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this item?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}color='secondary'>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

        {/* Table to Display Items */}
       <TableContainer component={Paper} sx={{ overflowX: 'auto', marginTop: 3 }}>
         <Table>
           <TableHead>
             <TableRow>
               <TableCell>Party Name</TableCell>
               <TableCell>Item</TableCell>
               <TableCell>Voucher Number</TableCell>
              
               <TableCell>Voucher Date</TableCell>
               <TableCell>Quantity</TableCell>
              <TableCell>Rate</TableCell>
               <TableCell>Discount (%)</TableCell>
               <TableCell>GST (%)</TableCell>
               <TableCell>Discount Amount</TableCell>
               <TableCell>Taxable Amount</TableCell>
               <TableCell>GST Amount</TableCell>
               <TableCell>Purchase Amount</TableCell>
               <TableCell>Reference Voucher Number</TableCell> 
               <TableCell>Actions</TableCell>
             </TableRow>
          </TableHead>
           <TableBody>
             {itemList.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.party_name}</TableCell>
                <TableCell>{item.item}</TableCell>
                <TableCell>{item.voucher_number}</TableCell>
                <TableCell>{item.voucher_date}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.rate}</TableCell>
                <TableCell>{item.discount_percentage}</TableCell>
                <TableCell>{item.gst_percentage}</TableCell>
                <TableCell>{item.discount_amount}</TableCell>
                <TableCell>{item.taxable_amount}</TableCell>
                <TableCell>{item.gst_amount}</TableCell>
                <TableCell>{item.purchase_amount}</TableCell>
                <TableCell>{item.reference_voucher_number}</TableCell>
                <TableCell>
                  <IconButton color="secondary" onClick={() => handleOpenDialog(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenConfirmDialog(index)}>
                    <DeleteIcon />
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

