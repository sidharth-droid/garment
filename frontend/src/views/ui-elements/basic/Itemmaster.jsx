
import React, { useState, useRef, useEffect } from 'react';
import { AddCircle, RemoveCircle,Download } from "@mui/icons-material";
import {
  TextField, Button, Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from "../../../api"; // Ensure to import your API instance
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ItemMaster() {
  const [itemDetails, setItemDetails] = useState({
    item_name: '',
    item_code: '',
    category_item: '',
    sub_category: '',
    hsn_code: '',
    unit_price: '',
    stock_quantity: '',
    description: '',
    sizes: [],
  });

  const [itemList, setItemList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState({ add: false });
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const fieldRefs = useRef([]);  
  
  const itemRef = useRef(null);
  const itemcodeRef = useRef(null);
  const categoryRef = useRef(null);
  const subcategoryRef = useRef(null);
  const hsnRef = useRef(null);
  const unitpriceRef = useRef(null);
  const quantityRef = useRef(null);
  const descriptionRef = useRef(null);
  const sizesRef = useRef(null);
  

  

  const fetchItems = async () => {
    try {
        const response = await api.get('/api/user/items/');
        setItemList(response.data.data);
    } catch (error) {
        console.error("Error fetching items:", error);
    }
};


    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/user/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

  

  useEffect(() => {
    fetchItems();
    fetchCategories();
}, []);



  

const validateInputs = () => {
  let errors = [];

  // ✅ Required Fields Validation
  if (!itemDetails.item_name) errors.push("⚠️ Item Name is required.");
  if (!itemDetails.item_code) errors.push("⚠️ Item Code is required.");
  if (!itemDetails.hsn_code) errors.push("⚠️ HSN Code is required.");
  if (!itemDetails.category_name) errors.push("⚠️ Category is required.");
  if (!itemDetails.sub_category) errors.push("⚠️ Sub-Category is required.");

  // ✅ Regex validations
  const itemNameRegex = /^[A-Za-z\s']+$/; 
  const itemCodeRegex = /^[A-Za-z0-9_]+$/;
  const hsnCodeRegex = /^[A-Za-z0-9_]+$/;
  const sizeRegex = /^[A-Za-z0-9]+$/;
  const unitPriceRegex = /^[0-9]+(\.[0-9]+)?$/;
  const stockQuantityRegex = /^[0-9]+$/;
  const descriptionRegex = /^[A-Za-z0-9\s,]*$/; 

  // ✅ Format validation (only if field is filled)
  if (itemDetails.item_name && !itemNameRegex.test(itemDetails.item_name)) 
    errors.push("⚠️ Item Name: Only letters, spaces, and apostrophe are allowed.");

  if (itemDetails.item_code && !itemCodeRegex.test(itemDetails.item_code)) 
    errors.push("⚠️ Item Code: Only alphanumeric and underscore are allowed.");

  if (itemDetails.hsn_code && !hsnCodeRegex.test(itemDetails.hsn_code)) 
    errors.push("⚠️ HSN Code: Only alphanumeric and underscore are allowed.");

  // ✅ Validate sizes **only if they are provided**
  itemDetails.sizes.forEach((sizeObj, index) => {
    if (sizeObj.size && !sizeRegex.test(sizeObj.size)) 
      errors.push(`⚠️ Size ${index + 1}: Only letters and numbers allowed.`);
    
    if (sizeObj.unit_price && !unitPriceRegex.test(sizeObj.unit_price)) 
      errors.push(`⚠️ Unit Price ${index + 1}: Only numbers and dot allowed.`);
    
    if (sizeObj.stock_quantity && !stockQuantityRegex.test(sizeObj.stock_quantity)) 
      errors.push(`⚠️ Stock Quantity ${index + 1}: Only digits allowed.`);
  });

  // ✅ Validate description **only if it's provided**
  if (itemDetails.description && !descriptionRegex.test(itemDetails.description)) 
    errors.push("⚠️ Description: Only letters, digits, spaces, and commas allowed.");

  if (errors.length > 0) {
    alert(errors.join("\n")); // Show all errors in an alert box
    return false;
  }
  return true;
};
const handleAddOrUpdate = async (e) => {
  e.preventDefault();
  setLoading({ ...loading, add: true });

  if (!validateInputs()) {
    setLoading({ ...loading, add: false });
    return; // Stop submission if validation fails
  }

  try {
    let response;
    if (editIndex !== null) {
      response = await api.put(`/api/user/items/update/${itemDetails.item_code}/`, itemDetails);
    } else {
      response = await api.post('/api/user/items-post/', itemDetails);
    }

    alert("✅ Success: " + response.data.message);
    await fetchItems();
  } catch (error) {
    console.error("❌ Backend Error:", error);

    if (error.response) {
      // If backend returns validation errors
      if (error.response.data && typeof error.response.data === "object") {
        let backendErrors = Object.values(error.response.data).flat(); // Convert errors into an array
        alert("❌ Backend Errors:\n" + backendErrors.join("\n"));
      } else {
        alert("❌ Error: " + error.response.data.message || "Something went wrong.");
      }
    } else {
      alert("❌ Network error. Please try again.");
    }
  } finally {
    setLoading({ ...loading, add: false });
    handleClose();
  }
};



  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setItemDetails({ ...itemDetails, category_name: selectedCategory, sub_category_name: '' });

    try {
      const response = await api.get(`/api/user/subcategories/${selectedCategory}/`);
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleChange = (e) => {
    setItemDetails({
      ...itemDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
    setEditIndex(null);
    setItemDetails({
      item_name: '',
      item_code: '',
      category_name: '',
      sub_category: '',
      hsn_code: '',
      unit_price: '',
      stock_quantity: '',
      description: '',
      sizes: [],
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addSize = () => {
    setItemDetails((prevState) => ({
      ...prevState,
      sizes: [...prevState.sizes, { size: "", unit_price: "", stock_quantity: "" }],
    }));
  };
  
  const removeSize = (index) => {
    setItemDetails((prevState) => ({
      ...prevState,
      sizes: prevState.sizes.filter((_, i) => i !== index),
    }));
  };

  
  const handleEdit = (index) => {
    setEditIndex(index);
    setItemDetails(itemList[index]);
    setOpen(true);
  };

  const handleDeleteDialogOpen = (index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
    setItemDetails(itemList[index]);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/user/items/delete/${itemDetails.item_code}/`);
      setItemList(itemList.filter((_, i) => i !== deleteIndex));
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  


  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      if (nextRef && nextRef.current) {
        nextRef.current.focus(); // Move focus to the next input field
      }
    }
  };
  

  const handleSizeChange = (e, index, field) => {
    const { value } = e.target;
    setItemDetails((prevState) => {
      const updatedSizes = [...prevState.sizes];
      updatedSizes[index] = { ...updatedSizes[index], [field]: value };
      return { ...prevState, sizes: updatedSizes };
    });
  };


  

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Item List Report", 14, 15);
  
    itemList.forEach((item, index) => {
      // Main Table with Numbering
      doc.autoTable({
        startY: doc.autoTable.previous.finalY ? doc.autoTable.previous.finalY + 10 : 20,
        head: [["#", "Item Name", "Item Code", "Category", "Sub-Category", "HSN Code", "Description"]],
        body: [[index + 1, item.item_name, item.item_code, item.category_name, item.sub_category, item.hsn_code, item.description]],
        theme: "striped",
      });
  
      // Nested Stock Table with Numbering
      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 5,
        head: [["#", "Size", "Unit Price", "Stock Quantity"]],
        body: item.sizes.map((size, sizeIndex) => [sizeIndex + 1, size.size, size.unit_price, size.stock_quantity]),
        theme: "grid",
        styles: { cellPadding: 2, fontSize: 10 },
      });
    });
  
    doc.save("Item_List.pdf");
  };
  

  

  return (
    <Box sx={{ maxWidth: '100%', padding: 2 }}>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        Add Item
      </Button>

     

      <Dialog open={open} onClose={handleClose} handleClose={handleClose}
  editIndex={editIndex}
  itemDetails={itemDetails}
  categories={categories}
  subCategories={subCategories}
  handleCategoryChange={handleCategoryChange}
  handleChange={handleChange}
  handleDeleteDialogOpen={handleDeleteDialogOpen} 
  handleAddOrUpdate={handleAddOrUpdate}
  loading={loading}
  fieldRefs={fieldRefs}
  handleKeyDown={handleKeyDown}
  handleSizeChange={handleSizeChange}  
  addSize={addSize}
  removeSize={removeSize}>
      <DialogTitle style={{ backgroundColor: '#f9dff5' }}>
        {editIndex !== null ? 'Edit Item Details' : 'Add Item Details'}
      </DialogTitle>
      <DialogContent style={{ backgroundColor: '#f9dff5' }}>
        <Paper sx={{ padding: "10px", backgroundColor: "#f9dff5" }} elevation={0}>
          <form>
            <TextField
              fullWidth
              label="Brand Name"
              name="item_name"
              value={itemDetails.item_name}
              onChange={handleChange}
              inputRef={itemRef}
              onKeyDown={(e) => handleKeyDown(e, itemcodeRef)}
              margin="normal"

            />

            <TextField
              fullWidth
              label="Brand Code"
              name="item_code"
              value={itemDetails.item_code}
              onChange={handleChange}
              inputRef={itemcodeRef}
              onKeyDown={(e) => handleKeyDown(e, categoryRef)}
              margin="normal"
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                value={itemDetails.category_item}
                name="category_item"
                onChange={handleCategoryChange}
                inputRef={categoryRef}
                onKeyDown={(e) => handleKeyDown(e, subcategoryRef)}
              >
                {Array.isArray(categories) && categories.map((category) => (
                  <MenuItem key={category.id} value={category.category_name}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
   <InputLabel>Sub-Category</InputLabel>
   <Select
    value={itemDetails.sub_category}
    name="sub_category"
    onChange={handleChange}
    label="Sub-Category"
    disabled={!itemDetails.category_name}
    inputRef={subcategoryRef}
    onKeyDown={(e) => handleKeyDown(e, hsnRef)}
  >
    {Array.isArray(subCategories) && subCategories.map((subCategory) => (
      <MenuItem key={subCategory.id} value={subCategory.name}>
        {subCategory.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

            <TextField
              fullWidth
              label="HSN Code"
              name="hsn_code"
              value={itemDetails.hsn_code}
              onChange={handleChange}
              inputRef={hsnRef}
              onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={itemDetails.description}
              onChange={handleChange}
              inputRef={descriptionRef}
              onKeyDown={(e) => handleKeyDown(e, sizesRef)}
              margin="normal"
            />

            {itemDetails.sizes.map((sizeObj, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <TextField
                  fullWidth
                  label="Size"
                  name="size"
                  value={sizeObj.size}
                  onChange={(e) => handleSizeChange(e, index, "size")}
                  inputRef={sizesRef}
                  onKeyDown={(e) => handleKeyDown(e, unitpriceRef)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Unit Price"
                  name="unit_price"
                  type="number"
                  value={sizeObj.unit_price}
                  onChange={(e) => handleSizeChange(e, index, "unit_price")}
                  inputRef={unitpriceRef}
                  onKeyDown={(e) => handleKeyDown(e, quantityRef)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  name="stock_quantity"
                  type="number"
                  value={sizeObj.stock_quantity}
                  onChange={(e) => handleSizeChange(e, index, "stock_quantity")}
                  inputRef={quantityRef}
                  onKeyDown={(e) => handleKeyDown(e, null)} // Last field
                  margin="normal"
                />
                <IconButton color="secondary" onClick={() => removeSize(index)}>
                  <RemoveCircle />
                </IconButton>
              </div>
            ))}
            <Button variant="outlined" startIcon={<AddCircle />} onClick={addSize}>
              Add Size
            </Button>
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

      

    <TableContainer component={Paper} sx={{ marginTop: 3, boxShadow: 3, borderRadius: 2, maxHeight: 400, overflowY: "auto", scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}>
    <TableCell>
                                                                  <IconButton color="primary" onClick={generatePDF}>
                                                                    <Download />
                                                                  </IconButton>
                                                                  <b>DOWNLOAD STOCK DETAILS</b>
                                                                </TableCell>
        <Table stickyHeader>
          
          <TableHead sx={{ backgroundColor: '#e0f7fa' }}>
            <TableRow>
              {[ 'Brand Name', 'Brand Code', 'Category', 'Sub-Category', 'HSN Code', 'Stock details (size,price & quantities)', 'Description', 'Actions'].map(header => (
                <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
              ))}
            </TableRow>
            
          </TableHead>
          <TableBody>
            {Array.isArray(itemList) && itemList.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.item_name}</TableCell>
                <TableCell>{item.item_code}</TableCell>
                <TableCell>{item.category_name}</TableCell>
                <TableCell>{item.sub_category}</TableCell>
                <TableCell>{item.hsn_code}</TableCell>
                <TableCell>
                  <div style={{ maxHeight: '100px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow style={{ backgroundColor: '#DDA0DD', position: 'sticky', top: 0, zIndex: 1 }}>
                          <TableCell sx={{ fontWeight: 'bold' }}>Size</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Unit Price</TableCell>
                          <TableCell sx={{ fontWeight: 'bold' }}>Stock Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {item.sizes.map((size, sizeIndex) => (
                          <TableRow key={sizeIndex}>
                            <TableCell>{size.size}</TableCell>
                            <TableCell>{size.unit_price}</TableCell>
                            <TableCell>{size.stock_quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <IconButton color="secondary" onClick={() => handleEdit(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteDialogOpen(index)}>
                    <Delete />
                  </IconButton>
                  <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    Are you sure you want to delete {itemDetails?.item_name}?
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
  </DialogActions>
</Dialog>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}



