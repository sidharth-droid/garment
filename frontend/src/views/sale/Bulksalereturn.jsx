


import React, { useState,useEffect } from 'react';
import {
  Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField
} from '@mui/material';
import { Download } from '@mui/icons-material';
import api from "../../api";

export default function BillEntry() {
  const [billDetails, setBillDetails] = useState({
    bill_number: '',
    fullname: '',
    phone_number: '',
    address: '',
  });

  const [itemList, setItemList] = useState([
    { barcode: '', category: '', sub_category: '', size: '', item_name: '' }
  ]);
  const [loading, setLoading] = useState({ add: false, fetch: false });
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [salesReturnList, setSalesReturnList] = useState([]);
  const [returnedItems, setReturnedItems] = useState([]); // Store returned items here

  useEffect(() => {
    fetchSalesReturns(); // Fetch data when the component loads
  }, []);



const fetchSalesReturns = async () => {
  setLoading(prevState => ({ ...prevState, tableFetch: true }));
  try {
      const response = await api.get("api/salesreturn/returns/");
      const salesData = Array.isArray(response.data.data) ? response.data.data : [];
      
      // Debugging: log the response
      console.log("Fetched data:", salesData);

      const transformedData = salesData.map(returnItem => ({
          return_id: returnItem.return_id || "N/A",
          full_name: returnItem.bill_number?.full_name || "Unknown",
          phone_number: returnItem.bill_number?.phone_number || "N/A",
          address: returnItem.bill_number?.address || "N/A",
          items: returnItem.items || []
      }));

      // Debugging: log the transformed data
      console.log("Transformed data:", transformedData);

      if (transformedData.length > 0) {
          setSalesReturnList(transformedData);
      }
  } catch (error) {
      console.error("Error fetching sales return data", error);
  } finally {
      setLoading(prevState => ({ ...prevState, tableFetch: false }));
  }
};


  const handleChange = (e) => {
    setBillDetails({
      ...billDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleItemChange = (e, index, field) => {
    const updatedItems = [...itemList];
    updatedItems[index][field] = e.target.value;
    setItemList(updatedItems);
  };

  const handleRemoveSalesReturn = () => {
    const updatedItems = itemList.filter((_, i) => i !== editIndex);
    setItemList(updatedItems);
    alert("Item removed from the sales return list.");
    setConfirmOpen(false);  // Close the confirmation dialog
  };
  

  const handleClickOpen = () => {
    setOpen(true);
    setEditIndex(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFetchData = async () => {
    const billNumber = billDetails.bill_number;
    if (billNumber.length > 0) {
      setLoading({ ...loading, fetch: true });
      try {
        const response = await api.get(`/api/retailsale/orders/${billNumber}/`);
        const data = response.data; // Assuming response contains the details for the bill
        setBillDetails({
          bill_number: data.bill_number,
          fullname: data.fullname,
          phone_number: data.phone_number,
          address: data.address,
        });
        if (data.items) {
          setItemList(data.items); // Populate items if available
        }
      } catch (error) {
        console.error("Error fetching bill details", error);
        alert("Failed to fetch bill details.");
      } finally {
        setLoading({ ...loading, fetch: false });
      }
    } else {
      alert("Please enter a valid Bill Number.");
    }
  };

  
  const handleCheckboxChange = (e, index) => {
    const updatedItems = [...itemList];
    const selectedItem = updatedItems[index];
  
    // Check if the item is already returned
    if (returnedItems.includes(selectedItem.barcode)) {
      alert("This item has already been returned and cannot be selected again.");
      return;
    }
  
    // Toggle the selected state of the checkbox
    updatedItems[index].selected = e.target.checked;
    setItemList(updatedItems);
  };
  
  

const handleAddSalesReturn = async (e) => {
  e.preventDefault();
  setLoading({ ...loading, add: true });

  // Filter the items to include only those that are selected
  const selectedItems = itemList.filter(item => item.selected);

  // Validate if any items are selected
  if (selectedItems.length === 0) {
    alert("Please select at least one item.");
    setLoading({ ...loading, add: false });
    return;
  }

  const salesReturnData = {
    bill_number: {
      full_name: billDetails.fullname,
      phone_number: billDetails.phone_number,
      address: billDetails.address,
    },
    items: selectedItems.map(item => ({
      barcode: item.barcode,
      category: item.category,
      sub_category: item.sub_category,
      size: item.size,
      item_name: item.item_name,
    }))
  };

  try {
    const response = await api.post('api/salesreturn/salesreturn/', salesReturnData);
    console.log('Sales return data sent successfully:', response.data);

    // After a successful return, mark items as returned
    const returnedBarcodes = selectedItems.map(item => item.barcode);
    setReturnedItems(prevReturnedItems => [
      ...prevReturnedItems,
      ...returnedBarcodes
    ]);

    const returnId = response.data.data.return_id;
    setItemList(prevItems => [
      ...prevItems,
      {
        ...salesReturnData,
        return_id: returnId,
        items: selectedItems,
      }
    ]);

    alert("Sales return processed successfully.");
  } catch (error) {
    console.error("Error processing sales return", error);
    alert("Failed to process sales return.");
  } finally {
    setLoading({ ...loading, add: false });
    setOpen(false);  // Close the dialog after submission
  }
};

  const generatePDF = () => {
    alert("PDF generation is not implemented yet.");
  };

  return (
    <Box sx={{ maxWidth: '100%', padding: 2, overflow: 'hidden' }}>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        {editIndex !== null ? 'Edit Item' : 'Add Sales Return'}
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: '#f9dff5' }}>
          {editIndex !== null ? 'Edit Bill Details' : 'Add Bill Details'}
        </DialogTitle>
        <DialogContent style={{ backgroundColor: '#f9dff5' }}>
          <Paper sx={{ padding: '20px', backgroundColor: '#f9dff5' }} elevation={0}>
            <form>
              <Box sx={{ marginBottom: 3 }}>
                <h3>Customer Information</h3>
                <TextField
                  fullWidth
                  label="Bill Number"
                  name="bill_number"
                  value={billDetails.bill_number}
                  onChange={handleChange}
                  margin="normal"
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleFetchData}
                  disabled={loading.fetch}
                >
                  {loading.fetch ? <CircularProgress size={24} /> : 'CHECK HERE'}
                </Button>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Full Name"
                    name="fullname"
                    value={billDetails.fullname}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    label="Phone Number"
                    name="phone_number"
                    value={billDetails.phone_number}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={billDetails.address}
                  onChange={handleChange}
                  margin="normal"
                />
              </Box>



<Box sx={{ marginBottom: 3 }}>
  <h3>Item Information</h3>
  {itemList.map((item, index) => (
    <Box key={index} sx={{ marginBottom: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2 }}>
        <TextField
          label="Item Name"
          value={item.item_name}
          disabled // Make it readonly
          margin="normal"
        />
        <TextField
          label="Category"
          value={item.category}
          disabled // Make it readonly
          margin="normal"
        />
        <TextField
          label="Sub Category"
          value={item.sub_category}
          disabled // Make it readonly
          margin="normal"
        />
        <TextField
          label="Size"
          value={item.size}
          disabled // Make it readonly
          margin="normal"
        />
      </Box>
      <TextField
        fullWidth
        label="Barcode"
        value={item.barcode}
        disabled // Make it readonly
        margin="normal"
      />
      <Box sx={{ marginTop: 1 }}>
        <label>
          <input
            type="checkbox"
            checked={item.selected || false}
            onChange={(e) => handleCheckboxChange(e, index)}
          />
          Select Item
        </label>
      </Box>
    </Box>
  ))}
</Box>


            </form>
          </Paper>
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#f9dff5' }}>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddSalesReturn} color="secondary" disabled={loading.add}>
            {loading.add ? <CircularProgress size={24} /> : editIndex !== null ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      
      

<TableContainer component={Paper} sx={{ marginTop: 3, overflow: 'hidden' }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Return ID</TableCell>
        <TableCell>Full Name</TableCell>
        <TableCell>Phone Number</TableCell>
        <TableCell>Address</TableCell>
        <TableCell>Item Name</TableCell>
        <TableCell>Barcode</TableCell>
        <TableCell>Category</TableCell>
        <TableCell>Sub Category</TableCell>
        <TableCell>Size</TableCell>
       
      </TableRow>
    </TableHead>
    <TableBody>
      {loading.tableFetch ? (
        <TableRow>
          <TableCell colSpan={5} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      ) : (
        salesReturnList && salesReturnList.length > 0 ? (
          salesReturnList.map((returnItem, index) => (
            <React.Fragment key={index}>
              {/* Main Return Row */}
              <TableRow>
                <TableCell rowSpan={returnItem.items?.length + 1}>
                  {returnItem.return_id || 'N/A'}
                </TableCell>
                <TableCell rowSpan={returnItem.items?.length + 1}>
                  {returnItem.full_name || 'Unknown'}
                </TableCell>
                <TableCell rowSpan={returnItem.items?.length + 1}>
                  {returnItem.phone_number || 'N/A'}
                </TableCell>
                <TableCell rowSpan={returnItem.items?.length + 1}>
                  {returnItem.address || 'N/A'}
                </TableCell>
                
              </TableRow>

              {/* Nested Item Rows */}
              {returnItem.items && returnItem.items.length > 0 ? (
                returnItem.items.map((item, nestedIndex) => (
                  <TableRow key={nestedIndex}>
                    <TableCell>{item.item_name || 'Unknown'}</TableCell>
                    <TableCell>{item.barcode || 'N/A'}</TableCell>
                    <TableCell>{item.category || 'N/A'}</TableCell>
                    <TableCell>{item.sub_category || 'N/A'}</TableCell>
                    <TableCell>{item.size || 'N/A'}</TableCell>
                    
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No items available
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} align="center">
              No returns available
            </TableCell>
          </TableRow>
        )
      )}
    </TableBody>
  </Table>
</TableContainer>


      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleRemoveSalesReturn} color="error">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
