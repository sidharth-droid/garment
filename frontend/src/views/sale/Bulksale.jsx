

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Container, Paper, Grid, Divider, IconButton
} from '@mui/material';
import { Send as SendIcon, Print as PrintIcon } from '@mui/icons-material';

export default function RetailSaleWithSMS() {
  const [formData, setFormData] = useState({
    billNumber: '',
    salesDateTime: new Date().toISOString().slice(0, 16),
    partyName: '',
    partyMobileNumber: '',
    partyAddress: '',
    partyGSTNumber: '',
    barcodeNumber: '',
    itemName: '',
    unit: '',
    unitPrice: '',
    tax: '',
    discount: '',
    totalPrice: '',
    paymentMethod1: 'Cash',
    paymentMethod2: 'UPI',
    narration: ''
  });

  const [isDiscountApplicable, setIsDiscountApplicable] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    }, calculateTotalPrice);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [formData.unitPrice, formData.tax, formData.discount, isDiscountApplicable]);

  const calculateTotalPrice = () => {
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const discount = parseFloat(formData.discount) || 0;

    const taxAmount = isDiscountApplicable ? (unitPrice * tax) / 100 : 0;
    const discountAmount = (unitPrice * discount) / 100;
    const totalPrice = unitPrice + taxAmount - discountAmount;

    setFormData((prev) => ({
      ...prev,
      totalPrice: totalPrice.toFixed(2)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleSendNotification = () => {
    alert('Notification sent!');
  };

    const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    const printContent = `
      <html>
      <head>
        <title>Retail Sale Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: blue;
            background-color: #f9f9f9;
          }
          .invoice-container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            border: 1px solid #ccc;
            padding: 20px;
            background-color: #fff;
          }
          .header {
            text-align: center;
            padding: 10px;
            background-color: #4caf50;
            color: red;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section h2 {
            margin-bottom: 10px;
            font-size: 18px;
            color: #4caf50;
          }
          .section p {
            margin: 5px 0;
            font-size: 14px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
          }
          .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 14px;
          }
          .table th {
            background-color: #f2f2f2;
            text-align: left;
          }
          .footer {
            text-align: center;
            padding: 10px;
            background-color: #4caf50;
            color: red;
            font-size: 14px;
          }
          .footer p {
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>Retail Sale Receipt</h1>
            <p>Sales Date & Time: ${formData.salesDateTime}</p>
          </div>
  
          <!-- Customer Information -->
          <div class="section">
            <h2>Customer Information</h2>
            <p><strong>Party Name:</strong> ${formData.partyName}</p>
            <p><strong>Mobile Number:</strong> ${formData.partyMobileNumber}</p>
            <p><strong>Address:</strong> ${formData.partyAddress}</p>
            <p><strong>GST Number:</strong> ${formData.partyGSTNumber}</p>
          </div>
  
          <!-- Item Information -->
          <div class="section">
            <h2>Item Information</h2>
            <table class="table">
              <tr>
                <th>Barcode</th>
                <td>${formData.barcodeNumber}</td>
              </tr>
              <tr>
                <th>Item Name</th>
                <td>${formData.itemName}</td>
              </tr>
              <tr>
                <th>Unit</th>
                <td>${formData.unit}</td>
              </tr>
              <tr>
                <th>Unit Price</th>
                <td>${formData.unitPrice}</td>
              </tr>
            </table>
          </div>
  
          <!-- Pricing and Tax -->
          <div class="section">
            <h2>Pricing and Tax</h2>
            <table class="table">
              <tr>
                <th>Tax (%)</th>
                <td>${formData.tax}</td>
              </tr>
              ${isDiscountApplicable ? `
                <tr>
                  <th>Discount (%)</th>
                  <td>${formData.discount}</td>
                </tr>` : ''}
              <tr>
                <th>Total Price</th>
                <td>${formData.totalPrice}</td>
              </tr>
            </table>
          </div>
  
          <!-- Payment and Narration -->
          <div class="section">
            <h2>Payment and Narration</h2>
            <p><strong>Payment Method1:</strong> ${formData.paymentMethod1}</p>
            <p><strong>Payment Method2:</strong> ${formData.paymentMethod2}</p>
            <p><strong>Narration:</strong> ${formData.narration}</p>
          </div>
  
          <!-- Footer -->
          <div class="footer">
            <p>Thank you for your purchase! Visit again!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };
  
  



  const handleKeyPress = (e, nextInput) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: '#f9dff5', position: 'relative' }}>
      <Paper sx={{ p: 3, backgroundColor: '#f9dff5' }} elevation={0}>
        <Typography variant="h5" gutterBottom align="center" color="secondary">Bulk Sale</Typography>
        <Typography variant="body2" color="textSecondary" align="center">Sales Date & Time: {formData.salesDateTime}</Typography>

        <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
          <IconButton onClick={handleSendNotification} sx={{ color: '#370140' }}>
            <SendIcon />
          </IconButton>
          <IconButton onClick={handlePrint} sx={{ color: '#370140' }}>
            <PrintIcon />
          </IconButton>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {/* Party Information */}
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" sx={{marginTop:'-30px'}}  color="textPrimary">Party Information</Typography>
              <TextField
                fullWidth
                label="Bill Number"
                name="billNumber"
                value={formData.billNumber}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                onKeyDown={(e) => handleKeyPress(e, document.getElementById('partyName'))}
                sx={{marginBottom:"39px"}}
              />
              <TextField
                id="partyName"
                fullWidth
                label="Party Name"
                name="partyName"
                value={formData.partyName}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                onKeyDown={(e) => handleKeyPress(e, document.getElementById('partyMobileNumber'))}
              />
              <TextField
                id="partyMobileNumber"
                fullWidth
                label="Mobile Number"
                name="partyMobileNumber"
                value={formData.partyMobileNumber}
                onChange={handleChange}
                margin="normal"
                type="tel"
                variant="outlined"
                onKeyDown={(e) => handleKeyPress(e, document.getElementById('partyAddress'))}
              />
              <TextField
                id="partyAddress"
                fullWidth
                multiline
                rows={1}
                label="Address"
                name="partyAddress"
                value={formData.partyAddress}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                onKeyDown={(e) => handleKeyPress(e, document.getElementById('partyGSTNumber'))}
              />
             
            </Grid>

            {/* Item Information */}
            <Grid item xs={12} md={3}>
            <TextField
                id="partyGSTNumber"
                fullWidth
                label="GST Number"
                name="partyGSTNumber"
                value={formData.partyGSTNumber}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                onKeyDown={(e) => handleKeyPress(e, document.getElementById('barcodeNumber'))}
              />
              <Typography variant="subtitle1"  color="textPrimary">Item Information</Typography>
              <TextField
                id="barcodeNumber"
                fullWidth
                label="Barcode Number"
                name="barcodeNumber"
                value={formData.barcodeNumber}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                onKeyDown={(e) => handleKeyPress(e, document.getElementById('itemName'))}
              />
              <TextField
                id="itemName"
                fullWidth
                label="Item Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                onKeyDown={(e) => handleKeyPress(e, document.getElementById('unit'))}
              />
               <TextField
                id="unit"
                fullWidth
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                onKeyDown={(e) => handleKeyPress(e, document.getElementById('unitPrice'))}
              />
             
            </Grid>

            {/* Pricing and Tax */}
            <Grid item xs={12} md={3}>
           
              <TextField
                id="unitPrice"
                fullWidth
                label="Unit Price"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                margin="normal"
                type="number"
                variant="outlined"
                onKeyDown={(e) => handleKeyPress(e, document.getElementById('tax'))}
              />
              <Typography variant="subtitle1" gutterBottom color="textPrimary">Pricing and Tax</Typography>
              <TextField
                id="tax"
                fullWidth
                label="Tax (%)"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                margin="normal"
                type="number"
                variant="outlined"
                onKeyDown={(e) => handleKeyPress(e, document.getElementById('isDiscountApplicable'))}
              />
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Apply Discount</InputLabel>
                <Select
                  id="isDiscountApplicable"
                  name="isDiscountApplicable"
                  value={isDiscountApplicable ? 'true' : 'false'}
                  onChange={(e) => setIsDiscountApplicable(e.target.value === 'true')}
                  label="Apply Discount"
                  onKeyDown={(e) => handleKeyPress(e, document.getElementById('discount'))}
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                </Select>
              </FormControl>
              {isDiscountApplicable && (
                <TextField
                  id="discount"
                  fullWidth
                  label="Discount (%)"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  margin="normal"
                  type="number"
                  variant="outlined"
                  onKeyDown={(e) => handleKeyPress(e, document.getElementById('totalPrice'))}
                />
              )}
              <Divider sx={{ my: 1 }} />

            </Grid>

            {/* Payment Method and Narration */}
            
            <Grid item xs={10} md={3}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Payment Method1</InputLabel>
                <Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  label="Payment Method1"
                  onKeyDown={(e) => handleKeyPress(e, document.getElementById('narration'))}
                  sx={{marginBottom:"33px"}}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Credit">Credit</MenuItem>
                  <MenuItem value="Debit">Debit</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Payment Method2</InputLabel>
                <Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  label="Payment Method2"
                  onKeyDown={(e) => handleKeyPress(e, document.getElementById('narration'))}
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Credit">Credit</MenuItem>
                  <MenuItem value="Debit">Debit</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                id="narration"
                fullWidth
                label="Narration"
                name="narration"
                value={formData.narration}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
                variant="outlined"
                onKeyDown={(e) => handleKeyPress(e, null)} // No next input
              />
            </Grid>
          </Grid>
          <Typography variant="h6" align="center">Total Price: ₹{formData.totalPrice}</Typography>
          

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 2 ,marginTop:"-5px"}}
              >
                Submit
              </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
