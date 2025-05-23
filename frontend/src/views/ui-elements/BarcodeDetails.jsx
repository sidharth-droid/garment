
import React, { useState, useEffect ,useRef} from 'react';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import api from '../../api'; // Assumed Axios instance

export default function StockEntry() {
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [itemSize, setItemSize] = useState('');
  const [shopName, setShopName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [itemName, setItemName] = useState('');
  const [stockEntries, setStockEntries] = useState([]);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [previewModal, setPreviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  
  const quantityRef = useRef(null);
  const itemPriceRef = useRef(null);
  const itemSizeRef = useRef(null);
  const shopNameRef = useRef(null);


  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      if (nextRef?.current) {
        nextRef.current.focus(); // Move focus to the next input field
      }
    }
  };


  // Fetch stock entries and categories on component mount
  useEffect(() => {
    api
      .get('api/barcode/code/')
      .then((response) => {
        setStockEntries(response.data.barcodes || []);
      })
      .catch((error) => {
        console.error('Error fetching stock entries:', error);
      });

    api
      .get('api/user/categories/')
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });
  }, []);

  // Fetch items from API
  useEffect(() => {
    api
      .get('api/user/items/')
      .then((response) => {
        if (response.data && response.data.data) {
          setItems(response.data.data);
        }
      })
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  // Fetch subcategories based on category selection
  useEffect(() => {
    if (categoryName) {
      api
        .get(`api/user/subcategories/${categoryName}`)
        .then((response) => setSubCategories(response.data))
        .catch((error) => console.error('Error fetching subcategories:', error));
    }
  }, [categoryName]);

  const handleCheckboxChange = (e, item) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((selected) => selected.id !== item.id));
    }
  };

  const handlePreview = () => {
    if (selectedItems.length === 0) {
      setError('No items selected for preview.');
      return;
    }
    setError('');
    setPreviewModal(true);
  };

  


  const validateInputs = () => {
    const quantityRegex = /^[0-9]+$/; // Allow only digits
    const itemPriceRegex = /^[0-9]+(\.[0-9]+)?$/; // Allow digits and dot
    const itemSizeRegex = /^[A-Za-z0-9]+$/; // Allow upper, lower, digits
    const shopNameRegex = /^[A-Za-z\s]+$/; // Allow upper, lower, space
  
    if (!quantity || !quantityRegex.test(quantity)) {
      setError("Invalid quantity: Only digits are allowed.");
      return false;
    }
  
    if (!itemPrice || !itemPriceRegex.test(itemPrice)) {
      setError("Invalid price: Only numbers and a decimal point are allowed.");
      return false;
    }
  
    if (!itemSize || !itemSizeRegex.test(itemSize)) {
      setError("Invalid item size: Only letters and numbers are allowed.");
      return false;
    }
  
    if (!shopName || !shopNameRegex.test(shopName)) {
      setError("Invalid shop name: Only letters and spaces are allowed.");
      return false;
    }
  
    setError(""); // Clear error if validation passes
    return true;
  };
  
  const resetForm = () => {
    setSelectedItem('');
    setBarcode('');
    setQuantity('');
    setItemSize('');
    setShopName('');
    setItemPrice('');
    setCategoryName('');
    setItemName('');
    setSubCategoryName('');
    setError('');
    setOpenModal(false);
  };
  
  const handleModalSubmit = () => {
    if (!validateInputs()) {
      return;
    }
  
    const newEntry = {
      item_name: selectedItem, // No validation
      quantity: parseInt(quantity, 10),
      item_price: parseFloat(itemPrice),
      item_size: itemSize,
      shop_name: shopName,
      category_name: categoryName, // No validation
      sub_category: subCategoryName, // No validation
    };
  
    console.log("New entry data:", newEntry);
  
    api
      .post("api/barcode/code/", newEntry)
      .then((response) => {
        setStockEntries([...stockEntries, response.data]);
        resetForm(); // Reset form after successful submission
      })
      .catch((error) => {
        console.error("Error in barcoding:", error);
        setError("Error in barcoding. Please try again."); // Show error inside modal
      });
  };
  
  

  const handlePrint = () => {
    if (selectedItems.length === 0) {
      setError('Please select items to print.');
      return;
    }

    const printContent = `
      <html>
        <head>
          <title>Barcode Print</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .barcode { margin: 10px 0; }
            .barcode img { width: 200px; height: auto; }
            .item-name { font-weight: bold; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>Barcode Preview</h1>
          ${selectedItems
            .map(
              (item) => `
              <div class="barcode">
                <div class="item-name">${item.item_name}</div>
                <img src="data:image/png;base64,${item.barcode_image_base64}" alt="Barcode">
              </div>
            `
            )
            .join('')}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div>
      <Box sx={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button onClick={() => setOpenModal(true)} variant="contained" color="secondary">
          Add Barcode
        </Button>
        <Box>
          <Button onClick={handlePreview} variant="contained" color="primary" sx={{ marginRight: '10px' }}>
            Preview
          </Button>
          <Button onClick={handlePrint} variant="contained" color="secondary">
            Print
          </Button>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>

      {/* Modal for adding stock */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 700, bgcolor: '#f9dff5', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography variant="h6">Add Barcode Details</Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select value={categoryName} onChange={(e) => setCategoryName(e.target.value)}>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.category_name}>
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Item Name</InputLabel>
            <Select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
              {items.map((item) => (
                <MenuItem key={item.id} value={item.item_name}>
                  {item.item_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* <FormControl fullWidth margin="normal">
            <InputLabel>Sub Categories</InputLabel>
            <Select value={itemName} onChange={(e) => setItemName(e.target.value)}>
              {subCategories.map((sub) => (
                <MenuItem key={sub.id} value={sub.name}>
                  {sub.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          
          <FormControl fullWidth margin="normal">
  <InputLabel>Sub Categories</InputLabel>
  <Select
    value={subCategoryName} // Ensure this state holds the selected value
    onChange={(e) => setSubCategoryName(e.target.value)} // Update state on change
  >
    {subCategories.map((sub) => (
      <MenuItem key={sub.id} value={sub.name}>
        {sub.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>


          <TextField 
          label="Quantity" 
          type="number" 
          value={quantity} onChange={(e) => setQuantity(e.target.value)} 
          margin="normal" 
          inputRef={quantityRef}
          onKeyDown={(e) => handleKeyDown(e, itemPriceRef)}
          fullWidth />
          <TextField 
          label="Item Price" 
          value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} 
          margin="normal" 
          inputRef={itemPriceRef}
        onKeyDown={(e) => handleKeyDown(e, itemSizeRef)}
          fullWidth />
          <TextField 
          label="Item Size" 
          value={itemSize} onChange={(e) => setItemSize(e.target.value)} 
          margin="normal" 
          inputRef={itemSizeRef}
          onKeyDown={(e) => handleKeyDown(e, shopNameRef)}
          fullWidth />
          <TextField l
          label="Shop Name" 
          value={shopName} onChange={(e) => setShopName(e.target.value)} 
          margin="normal" 
          inputRef={shopNameRef}
        onKeyDown={(e) => handleKeyDown(e, null)} // Last field, no nextRef
          fullWidth />

          <Button onClick={handleModalSubmit} variant="contained" color="secondary" sx={{ mt: 2 }}>
            Save
          </Button>
        </Box>
      </Modal>

      {/* Preview modal */}
             <Modal open={previewModal} onClose={() => setPreviewModal(false)}>
         <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: '20px' }}>
            Barcode Preview
          </Typography>
          {selectedItems.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img
                src={`data:image/png;base64,${item.barcode_image_base64}`}
                alt="Barcode"
                style={{ width: '200px', marginRight: '10px' }}
              />
              <Typography>{item.item_name}</Typography>
            </Box>
          ))}
        </Box>
      </Modal>

      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>SL. No</TableCell>
              <TableCell>Barcode</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Item Size</TableCell>
              <TableCell>Shop Name</TableCell>
              <TableCell>Category Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockEntries.map((entry, index) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <Checkbox
                    onChange={(e) => handleCheckboxChange(e, entry)}
                    checked={selectedItems.includes(entry)}
                  />
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{entry.serial_number}</TableCell>
                <TableCell>{entry.item_name}</TableCell>
                <TableCell>{entry.item_size}</TableCell>
                <TableCell>{entry.shop_name}</TableCell>
                <TableCell>{entry.category_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
    </div>
  );
}
