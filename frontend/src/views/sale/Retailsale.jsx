
import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Grid, TextField, Typography, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,IconButton,FormControl,InputLabel,Select,MenuItem ,InputAdornment} from '@mui/material';
import { Send as SendIcon, Print as PrintIcon } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Container from '@mui/material/Container';
import dayjs from 'dayjs';
import api from "../../api";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SmsIcon from '@mui/icons-material/Sms';



export default function RetailSale() {
  const [formData, setFormData] = useState({
    fullName: '',
    number: '',
    address: '',
    tax: '',
    discount: '',
    totalPrice: '',
    paymentMethod1: 'Cash',
    paymentMethod2: 'UPI',
    amount1: '',
    amount2: '',
    saletype: 'RetailSale',
    narration: ''
  });
  
  const [items, setItems] = useState([
    { barcode: "", category: "", sub_category: "", size: "", item_name: "", unit: "1", unit_price: "0.00" }
  ]);

  

  const previousBarcode = useRef(""); // Track last barcode to prevent duplicate calls
  
  const [isDiscountApplicable, setIsDiscountApplicable] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null); // Track the expanded index
  const salesDateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const [modalOpen, setModalOpen] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);
  const [taxOptions, setTaxOptions] = useState([]); // Store tax options
  const [modalPreviewItems, setModalPreviewItems] = useState([]);
  const [billNumber, setBillNumber] = useState(null); // State for bill number
  const [loadingBill, setLoadingBill] = useState(false); // Show loading text


  // const [previewItem, setPreviewItem] = useState(null);
  const [previewItems, setPreviewItems] = useState([]);
  
  const inputRefs = useRef([]);

 

  useEffect(() => {
    console.log("🔄 Updated Preview Items:", previewItems);
  }, [previewItems]); // Runs when previewItems updates
  

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
  
      // If amount1 changes, calculate amount2
      if (name === "amount1" && value !== "") {
        calculatePaymentMethod2Amount(updatedData);
      }
  
      return updatedData;
    });
  };
  
  

  // Fetch tax data from API
  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await api.get("api/user/taxes/");
        
        // Ensure response.data exists and contains a 'data' key
        if (response.data && Array.isArray(response.data.data)) {
          setTaxOptions(response.data.data); // Extract 'data' array
        } else {
          console.error("Unexpected API response:", response.data);
          setTaxOptions([]); // Set empty array if response is invalid
        }
      } catch (error) {
        console.error("Error fetching tax data:", error);
        setTaxOptions([]);
      }
    };
  
    fetchTaxes();
  }, []);
  
  

  const fetchPhoneNumberData = async () => {
    if (formData.number.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    try {
      const response = await api.post(
        "api/retailsale/phone/",
        { phone_number: formData.number }
      );

      if (response.data) {
        setFormData((prevState) => ({
          ...prevState,
          fullName: response.data.fullname || "",
          address: response.data.address || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data");
    }
  };

  
  
  useEffect(() => {
    const fetchData = async () => {
      const lastItem = items[items.length - 1]; 
      if (!lastItem || !lastItem.barcode || lastItem.barcode === previousBarcode.current) return;
  
      previousBarcode.current = lastItem.barcode;
  
      try {
        console.log("Fetching data for barcode:", lastItem.barcode);
        const response = await api.get(`api/barcode/get-barcode-details/${lastItem.barcode}/`);
        console.log("API Response:", response.data);
  
        if (response.data?.item_details) {
          const { item_name, item_price, category_name, sub_category, item_size } = response.data.item_details;
  
          setItems((prevItems) =>
            prevItems.map((item, idx) =>
              idx === prevItems.length - 1
                ? {
                    ...item,
                    item_name: item_name || item.item_name,
                    unit_price: item_price || item.unit_price,
                    category: category_name || item.category,
                    sub_category: sub_category || item.sub_category,
                    size: item_size || item.size,
                  }
                : item
            )
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [items]);
  

 
  
  

  useEffect(() => {
    const fetchTotalPrice = async () => {
      try {
        // Ensure we have items before making the request
        if (previewItems.length === 0) return;
  
        const calculatedGrandTotal = previewItems.reduce((sum, item) => sum + Number(item.total_item_price || 0), 0);
  
        const requestData = {
          grand_total: calculatedGrandTotal, // First show the grand total
          discount: formData.discount ? Number(formData.discount) : 0,
          tax: formData.tax ? Number(formData.tax) : 0,
        };
  
        console.log("Sending request data:", requestData);
  
        // Set grand_total first before API response
        setFormData((prev) => ({
          ...prev,
          totalPrice: Number(parseFloat(calculatedGrandTotal).toFixed(2)), // Show grandTotal immediately
        }));
  
        const response = await api.post("api/retailsale/calculate-total-price/", requestData);
  
        console.log("API Response:", response.data);
  
        if (response.data && response.data.total_price !== undefined) {
          setFormData((prev) => ({
            ...prev,
            totalPrice: Number(parseFloat(response.data.total_price).toFixed(2)), // Show updated value
          }));
        }
      } catch (error) {
        console.error("Error fetching total price:", error);
      }
    };
  
    if (previewItems.length > 0) {
      fetchTotalPrice(); // Fetch total price whenever items change
    }
  }, [previewItems, formData.tax, formData.discount]); 
  



const validatePayload = (formData, previewItems) => {
  let errors = [];

  // ✅ Required Fields Validation
  if (!formData.fullName.trim()) errors.push("⚠️ Full Name is required.");
  if (!formData.number.trim()) errors.push("⚠️ Phone Number is required.");
  if (!formData.address.trim()) errors.push("⚠️ Address is required.");
  if (!formData.tax) errors.push("⚠️ Tax is required.");
  if (!formData.paymentMethod1.trim()) errors.push("⚠️ Payment Method 1 is required.");
  if (!formData.amount1) errors.push("⚠️ Payment Method 1 Amount is required.");
  if (!formData.paymentMethod2.trim()) errors.push("⚠️ Payment Method 2 is required.");
  if (!formData.amount2) errors.push("⚠️ Payment Method 2 Amount is required.");
  if (!formData.saletype.trim()) errors.push("⚠️ Sale Type is required.");
  if (previewItems.length === 0) errors.push("⚠️ No items added! Please add at least one item.");

  // ✅ Format Validations
  const phoneRegex = /^[0-9]{10}$/; // Only 10-digit numbers allowed
  const taxRegex = /^\d+(\.\d{1,2})?$/; // Number with up to 2 decimal places
  const amountRegex = /^\d+(\.\d{1,2})?$/; // Number with up to 2 decimal places

  if (!phoneRegex.test(formData.number.trim())) 
    errors.push("⚠️ Phone Number must be 10 digits.");

  if (!taxRegex.test(formData.tax)) 
    errors.push("⚠️ Tax must be a valid number with up to 2 decimal places.");

  if (!amountRegex.test(formData.amount1)) 
    errors.push("⚠️ Payment Method 1 Amount must be a valid number with up to 2 decimal places.");

  if (!amountRegex.test(formData.amount2)) 
    errors.push("⚠️ Payment Method 2 Amount must be a valid number with up to 2 decimal places.");

  // ✅ Validate Items
  previewItems.forEach((item, index) => {
    if (!item.barcode.trim()) errors.push(`⚠️ Item ${index + 1}: Barcode is required.`);
    if (!item.category.trim()) errors.push(`⚠️ Item ${index + 1}: Category is required.`);
    if (!item.sub_category.trim()) errors.push(`⚠️ Item ${index + 1}: Sub-Category is required.`);
    if (!item.item_name.trim()) errors.push(`⚠️ Item ${index + 1}: Item Name is required.`);
    if (!item.unit_price || !amountRegex.test(item.unit_price)) 
      errors.push(`⚠️ Item ${index + 1}: Unit Price must be a valid number.`);
  });

  if (errors.length > 0) {
    alert(errors.join("\n")); // Show all errors in an alert box
    return false;
  }
  return true;
};

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!validatePayload(formData, previewItems)) return; // Stop if validation fails

//   const payload = {
//     fullname: formData.fullName.trim(),
//     phone_number: formData.number.trim(),
//     address: formData.address.trim(),
//     tax: parseFloat(formData.tax).toFixed(2),
//     tax_type: "SGST",
//     discount: formData.discount ? parseFloat(formData.discount).toFixed(2) : null,
//     payment_method1: formData.paymentMethod1.trim(),
//     payment_method1_amount: parseFloat(formData.amount1).toFixed(2),
//     payment_method2: formData.paymentMethod2.trim(),
//     payment_method2_amount: parseFloat(formData.amount2).toFixed(2),
//     narration: formData.narration.trim(),
//     saletype: formData.saletype.trim(),
//     items: previewItems.map(({ barcode, category, sub_category, size, item_name, unit, unit_price }) => ({
//       barcode: barcode?.trim() || "",
//       category: category?.trim() || "",
//       sub_category: sub_category?.trim() || "",
//       size: size?.trim() || "",
//       item_name: item_name?.trim() || "",
//       unit: Number(unit) || 1,
//       unit_price: unit_price ? parseFloat(unit_price).toFixed(2) : "0.00",
//     })),
//     msg_via: msgVia,
//   };

//   try {
//     const response = await api.post("api/retailsale/create-order/", payload);
    
//     // ✅ Extract bill number from response
//     const billNumberFromResponse = response.data?.bill_number || null;
//     setBillNumber(billNumberFromResponse); // Store bill number in state

//     alert(`✅ Form submitted successfully! Bill Number: ${billNumberFromResponse}`);

//     // Reset form and state
//     setFormData({
//       fullName: "",
//       number: "",
//       address: "",
//       tax: "",
//       discount: "",
//       totalPrice: "",
//       paymentMethod1: "Cash",
//       paymentMethod2: "UPI",
//       amount1: "",
//       amount2: "",
//       saletype: "RetailSale",
//       narration: "",
//     });

//     setPreviewItems([]);
//     setItems([{ barcode: "", category: "", sub_category: "", size: "", item_name: "", unit: "1", unit_price: "0.00" }]);

//   } catch (error) {
//     console.error("❌ Submission Error:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    
//     // Show backend errors in an alert
//     if (error.response && error.response.data) {
//       const backendErrors = Object.values(error.response.data).flat();
//       alert(`❌ Submission failed:\n${backendErrors.join("\n")}`);
//     } else {
//       alert(`❌ Submission failed: ${error.message}`);
//     }
//   }
// };


const handleSubmit = async (e, msgVia) => {
  e.preventDefault();

  if (!validatePayload(formData, previewItems)) return; // Stop if validation fails

  if (!msgVia) {
    console.error("❌ msgVia is not defined");
    alert("Please select WhatsApp or SMS before submitting.");
    return;
  }

  const payload = {
    fullname: formData.fullName.trim(),
    phone_number: formData.number.trim(),
    address: formData.address.trim(),
    tax: parseFloat(formData.tax).toFixed(2),
    tax_type: "SGST",
    discount: formData.discount ? parseFloat(formData.discount).toFixed(2) : null,
    payment_method1: formData.paymentMethod1.trim(),
    payment_method1_amount: parseFloat(formData.amount1).toFixed(2),
    payment_method2: formData.paymentMethod2.trim(),
    payment_method2_amount: parseFloat(formData.amount2).toFixed(2),
    narration: formData.narration.trim(),
    saletype: formData.saletype.trim(),
    items: previewItems.map(({ barcode, category, sub_category, size, item_name, unit, unit_price }) => ({
      barcode: barcode?.trim() || "",
      category: category?.trim() || "",
      sub_category: sub_category?.trim() || "",
      size: size?.trim() || "",
      item_name: item_name?.trim() || "",
      unit: Number(unit) || 1,
      unit_price: unit_price ? parseFloat(unit_price).toFixed(2) : "0.00",
    })),
    msg_via: msgVia, // ✅ Now correctly passing msg_via
  };

  try {
    const response = await api.post("api/retailsale/create-order/", payload);
    
    const billNumberFromResponse = response.data?.bill_number || null;
    setBillNumber(billNumberFromResponse); // Store bill number in state

    alert(`✅ Form submitted successfully! Bill Number: ${billNumberFromResponse}`);

    // Reset form and state
    setFormData({
      fullName: "",
      number: "",
      address: "",
      tax: "",
      discount: "",
      totalPrice: "",
      paymentMethod1: "Cash",
      paymentMethod2: "UPI",
      amount1: "",
      amount2: "",
      saletype: "RetailSale",
      narration: "",
    });

    setPreviewItems([]);
    setItems([{ barcode: "", category: "", sub_category: "", size: "", item_name: "", unit: "1", unit_price: "0.00" }]);

  } catch (error) {
    console.error("❌ Submission Error:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    
    if (error.response && error.response.data) {
      const backendErrors = Object.values(error.response.data).flat();
      alert(`❌ Submission failed:\n${backendErrors.join("\n")}`);
    } else {
      alert(`❌ Submission failed: ${error.message}`);
    }
  }
};



  const handleSendNotification = () => {
    alert('Notification sent!');
  };



  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      const nextIndex = index + 1;
      if (nextIndex < inputRefs.current.length) {
        inputRefs.current[nextIndex].focus(); // Move focus to the next input
      }
    }
  };

  

  // const handleItemChange = (index, e) => {
  //   const { name, value } = e.target;
    
  //   setItems((prevItems) =>
  //     prevItems.map((item, idx) =>
  //       idx === index ? { ...item, [name]: value } : item
  //     )
  //   );
  // };
  
  const handleItemChange = (index, event) => {
    const { name, value } = event.target;
  
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };
  
  

  
  const addItem = () => {
    if (items.length > 0) {
      const lastItem = items[items.length - 1];
  
      console.log("📌 Last item before adding:", lastItem); // Debugging log
  
      // Check for missing fields
      const missingFields = [];
      if (!lastItem.barcode) missingFields.push("Barcode");
      if (!lastItem.item_name) missingFields.push("Item Name");
      if (!lastItem.unit) missingFields.push("Unit");
      if (!lastItem.unit_price) missingFields.push("Unit Price");
  
      if (missingFields.length > 0) {
        alert(`Please fill out the required fields: ${missingFields.join(", ")}`);
        return;
      }
  
      setPreviewItems((prevItems) => [
        ...prevItems,
        {
          barcode: lastItem.barcode,
          item_name: lastItem.item_name || "",
          category: lastItem.category || "",
          sub_category: lastItem.sub_category || "",
          size: lastItem.size || "",
          unit: Number(lastItem.unit) || 1,
          unit_price: Number(lastItem.unit_price).toFixed(2) || "0.00",
        },
      ]);
  
      // ✅ Reset input fields after adding
      setItems([{ barcode: "", category: "", sub_category: "", size: "", item_name: "", unit: "1", unit_price: "0.00" }]);
    } else {
      alert("No items to add.");
    }
  };
  
  // ✅ Log Updated `previewItems` after state change
  useEffect(() => {
    console.log("✅ Updated Preview Items:", previewItems);
  }, [previewItems]);
  


  // ✅ Define calculateTotalPrice function
  const calculateTotalPrice = (updatedData) => {
    // Example logic (Modify as needed)
    const { tax, discount } = updatedData;
    const basePrice = 100; // Example base price

    const taxAmount = tax ? parseFloat(tax) : 0;
    const discountAmount = discount ? parseFloat(discount) : 0;
    const total = basePrice + taxAmount - discountAmount;

    setFormData((prevData) => ({
      ...prevData,
      totalPrice: total.toFixed(2),
    }));
  };
  

  


  

const handlePrint = () => {
  const printWindow = window.open('', '', 'height=600,width=800');
  const currentDateTime = new Date().toLocaleString(); // Get current date and time
  
  const unitPrice = parseFloat(formData.unitPrice) || 0;
  const tax = parseFloat(formData.tax) || 0;
  const discount = parseFloat(formData.discount) || 0;
  const unit = parseFloat(formData.unit) || 0;

  // Calculate the base amount (unit * unitPrice)
  const baseAmount = unit * unitPrice;

  // Calculate tax amount based on the base amount
  const taxAmount = (baseAmount * tax) / 100;

  // Calculate total price after tax
  const totalAfterTax = baseAmount + taxAmount;

  // Calculate discount amount based on the total after tax
  const discountAmount = isDiscountApplicable ? (totalAfterTax * discount) / 100 : 0;

  // Final total price after applying discount
  const finalTotalPrice = totalAfterTax - discountAmount;

  const printContent = `
    <html>
    <head>
      <title>Retail Sale Invoice</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; padding: 0; color: blue; background-color: #f9f9f9; }
        hr { border: none; border-bottom: 2px solid blue; margin: 20px 0; }/
        .invoice-container { width: 100%; max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px; background-color: #fff; }
        .header { text-align: center; padding: 20px 0; background-color: #4caf50; color: blue; }
        .header h1 { margin: 0; font-size: 24px; }
        .section { margin-bottom: 20px; }
        .section h2 { margin-bottom: 10px; font-size: 18px; color: #4caf50; }
        .section p { margin: 5px 0; font-size: 14px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th, .table td { border: 1px solid #ddd; padding: 10px; font-size: 14px; }
        .table th { background-color: #f2f2f2; text-align: left; }
        .footer { text-align: center; padding: 20px 0; background-color: #4caf50; color: blue; font-size: 14px; }
        .footer p { margin: 0;}
        .flex-container { display: flex; justify-content: space-between; align-items: center; }
        .left-info { text-align: left; }
        .right-info { text-align: right; }
        .right-info p { margin: 0; }
        .pricing-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .pricing-row span {
          padding: 0 10px;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <h1>NAARI FASHIONS</h1>
          <h2>MARKET BUILDING UNIT-II</h2>
          <hr>
          <h2>GSTIN:21AXKPR9141G1ZD</h2>
          <br><br>
          <h4>Retail Invoice</h4>
        </div>
\

        <div class="section">
          <div class="flex-container">
            <div class="left-info">
              <p><strong>Full Name:</strong> ${formData.fullName}</p>
              <p><strong>Number:</strong> ${formData.number}</p>
            </div>
            <div class="right-info">
              <p><strong>Date:</strong> ${currentDateTime}</p>
              <p><strong>Invoice Number:</strong> ${billNumberFromResponse || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Item Information</h2>
          <table class="table">
            <tr>
              <th>Sl#</th>
              <th>Particulars</th>
              <th>Qty</th>
              <th>Amount</th>
            </tr>
            <tr>
              <td>1</td>
              <td>${formData.itemName}</td>
              <td>${formData.unit}</td>
              <td>₹${totalAfterTax.toFixed(2)}</td> <!-- Updated to show total after tax -->
            </tr>
          </table>
        </div>

        <div class="section">
          <h2>Pricing and Tax</h2>
          <div class="pricing-row">
            <span>Total</span>
            <span>${formData.unit}</span>
            <span>₹ ${totalAfterTax.toFixed(2)}</span>
          </div>
          <!--<div class="pricing-row">
            <span>Tax:</span>
            <span>${tax}%</span>
            <span>+₹${taxAmount.toFixed(2)}</span>
          </div>-->
          ${isDiscountApplicable ? `
            <div class="pricing-row">
              <span>Discount:</span>
              <span>${formData.discount}%</span>
              <span>-₹${discountAmount.toFixed(2)}</span>
            </div>` : ''}
          <div class="pricing-row">
            <span><strong>Net Payable:</strong></span>
            <span><strong>₹${finalTotalPrice.toFixed(2)}</strong></span>
          </div>
        </div>

        <div class="section">
          <h2>Payment and Narration</h2>
          <p><strong>Payment Method1:</strong> ${formData.paymentMethod1} ₹ ${formData.amount1 || 0}</p>
          <p><strong>Payment Method2:</strong> ${formData.paymentMethod2} ₹ ${formData.amount2 || 0}</p>
          <p><strong>Narration:</strong> ${formData.narration}</p>
        </div>
        <div class="section">
        <h6>Terms & Condition</h6>
        <hr>
        <ul>
        <li>No cash return</li>
        <li>No Exchange without Bill</li>
        <li>Exchange within 7 days</li>
        <li>No Exchange on Satureday and Sunday</li>
        <li>Exchange within 12 p.m to 4 p.m only</li>
        <li>No Colour Guarantee on any item</li>
        </ul>
        </div>

        <div class="footer">
          <p>Thank you visit again!</p>
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


const handlePreview = async () => {
  if (previewItems.length === 0) {
    alert("No items to preview.");
    return;
  }

  try {
    // Send only necessary fields to API
    const formattedItems = previewItems.map(({ item_name, unit, unit_price }) => ({
      item_name: item_name.trim(),
      unit: parseFloat(unit) || 1,
      unit_price: parseFloat(unit_price) || 0.0,
    }));

    const response = await api.post("api/retailsale/item-preview/", { items: formattedItems });

    console.log("✅ API Response:", response.data);

    if (response.data && response.data.created_items) {
      // 🔹 Keep full data in previewItems for submission
      setPreviewItems((prev) => 
        prev.map((item, index) => ({
          ...item, // Keep existing fields like category, sub_category, size
          unit: response.data.created_items[index]?.unit || item.unit,
          unit_price: response.data.created_items[index]?.unit_price || item.unit_price,
          total_item_price: response.data.created_items[index]?.total_item_price || "0.00",
        }))
      );

      // 🔹 Store only required fields for modal display
      setModalPreviewItems(response.data.created_items.map((item, index) => ({
        barcode: previewItems[index]?.barcode || "",
        item_name: item.item_name,
        unit: item.unit,
        unit_price: item.unit_price,
        total_item_price: item.total_item_price || "0.00",  // ✅ Ensure this value is set
      })));

      setGrandTotal(response.data.grand_total || 0);
      setModalOpen(true);
    } else {
      console.error("🚨 Unexpected API Response Structure:", response.data);
      alert("Unexpected response format. Please check the API.");
    }
  } catch (error) {
    console.error("❌ Error fetching preview:", error.response ? error.response.data : error.message);
    alert(`Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
  }
};


const calculatePaymentMethod2Amount = async () => {
  if (!formData.totalPrice) return; // Ensure total price is available

  try {
    const response = await api.post("api/retailsale/calculate-payment-amount2/", {
      total_price: formData.totalPrice, 
      payment_method1_amount: formData.amount1 || "0"  // Default to 0 if empty
    });

    const formattedAmount2 = parseFloat(response.data.payment_method2_amount).toFixed(2); // Format to 2 decimal places

    setFormData((prevData) => ({
      ...prevData,
      amount2: formattedAmount2,  // Update field
    }));
  } catch (error) {
    console.error("Error calculating Payment Amount 2:", error);
  }
};

// Call function when totalPrice or amount1 changes
useEffect(() => {
  calculatePaymentMethod2Amount();
}, [formData.totalPrice, formData.amount1]);


  
 
  //const handlePreview = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  
  
  
   
  return (
    <Container maxWidth="lg" sx={{ backgroundColor: '#f9dff5', position: 'relative' }}>
      <Paper sx={{ p: 3, backgroundColor: '#f9dff5' }} elevation={0}>
        <Typography variant="h5" gutterBottom align="center" color="secondary">SALE MODULE</Typography>
        <Typography variant="body2" color="textSecondary" align="center">Sales Date & Time: {salesDateTime}</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sale Type</InputLabel>
        <Select
          value={formData.saletype}
          onChange={handleChange}
          name="saletype"
          label="Sale Type"
        >
          <MenuItem value="RetailSale">Retail Sale</MenuItem>
          <MenuItem value="BulkSale">Bulk Sale</MenuItem>
        </Select>
      </FormControl>

        {/* Notification and Print options */}
        <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
  {/* WhatsApp Button */}
  <IconButton onClick={(e) => handleSubmit(e, 'whatsapp')} sx={{ color: '#25D366' }}>
    <WhatsAppIcon />
  </IconButton>

  {/* SMS Button */}
  <IconButton onClick={(e) => handleSubmit(e, 'sms')} sx={{ color: '#370140' }}>
    <SmsIcon />
  </IconButton>

  {/* Print Button */}
  <IconButton onClick={handlePrint} sx={{ color: '#370140' }}>
    <PrintIcon />
  </IconButton>
</Box>

        

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          {items.map((item, index) => (
            <Grid container spacing={2} key={index} style={{marginTop:"0.7px"}}>
              
              <Typography variant="subtitle1" gutterBottom color="textPrimary">
  Item Information {index + 1}
</Typography>

<Grid container spacing={2} alignItems="center">
  {/* Barcode Field */}
  <Grid item xs={6}>
    <TextField
      style={{ width: "100%" }} // Ensures proper alignment
      label="Barcode"
      name="barcode"
      value={item.barcode}
      onChange={(e) => handleItemChange(index, e)}
      margin="normal"
      variant="outlined"
      inputRef={(el) => (inputRefs.current[0] = el)}
      onKeyDown={(e) => handleKeyDown(e, 0)}
    />
  </Grid>

  {/* Item Name Field */}
  <Grid item xs={6}>
    <TextField
      style={{ width: "100%" }}
      label="Item Name"
      name="item_name"
      value={item.item_name}
      onChange={(e) => handleItemChange(index, e)}
      margin="normal"
      variant="outlined"
    />
  </Grid>
</Grid>



{/* 🔹 New Field: Category */}
<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
  {/* Category Field */}
  <TextField
    style={{ width: "150px" }} 
    label="Category"
    name="category"
    value={item.category}
    onChange={(e) => handleItemChange(index, e)}
    margin="dense"
    variant="outlined"
    inputRef={(el) => (inputRefs.current[2] = el)}
    onKeyDown={(e) => handleKeyDown(e, 2)}
  />

  {/* Sub-category Field */}
  <TextField
    style={{ width: "120px" }} 
    label="Sub-category"
    name="sub_category"
    value={item.sub_category}
    onChange={(e) => handleItemChange(index, e)}
    margin="dense"
    variant="outlined"
    inputRef={(el) => (inputRefs.current[3] = el)}
    onKeyDown={(e) => handleKeyDown(e, 3)}
  />
</div>


{/* 🔹 New Field: Size */}
<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
  {/* Size Field */}
  <TextField
    style={{ width: "150px" }} 
    label="Size"
    name="size"
    value={item.size}
    onChange={(e) => handleItemChange(index, e)}
    margin="dense"
    variant="outlined"
    inputRef={(el) => (inputRefs.current[4] = el)}
    onKeyDown={(e) => handleKeyDown(e, 4)}
  />

  {/* Unit Field */}
  <TextField
    style={{ width: "120px" }} 
    label="Unit"
    name="unit"
    value={item.unit}
    onChange={(e) => handleItemChange(index, e)}
    margin="dense"
    variant="outlined"
    inputRef={(el) => (inputRefs.current[5] = el)}
    onKeyDown={(e) => handleKeyDown(e, 5)}
  />
</div>


<TextField
  style={{ width: "100%" }} 
  label="Unit Price"
  name="unit_price"
  value={item.unit_price}
  onChange={(e) => handleItemChange(index, e)}
  margin="normal"
  variant="outlined"
  inputRef={(el) => (inputRefs.current[6] = el)}
  onKeyDown={(e) => handleKeyDown(e, 6)}
/>

              {/* Optional line for visual separation */}
              {index !== items.length - 1 && <hr style={{ margin: '10px 0' }} />}
            </Grid>
          ))}
          <Grid>
          <Button
            variant="contained"
            color="secondary"
            onClick={addItem}
            style={{
              marginTop: '20px',
              borderRadius: '50%',
              height: '60px',
              width: '60px',
              padding: 0,
            }}
          >
            <AddIcon style={{ fontSize: '32px', fontWeight: 'bold' }} />
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handlePreview} // Preview last added item
            style={{ marginTop: '20px', marginLeft: '20px' }}
          >
        CHECK HERE
          </Button>
          </Grid>

        </Grid>
      

      {/* Modal for Preview */}
      {/* Modal for Preview */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
  <Box
    sx={{
      bgcolor: "background.paper",
      borderRadius: 2,
      boxShadow: 24,
      p: 4,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "600px",
      overflowY: "auto",
      maxHeight: "400px",
    }}
  >
    <Typography variant="h6" component="h2" gutterBottom style={{ color: "secondary" }}>
      Preview Items
      <IconButton onClick={handleCloseModal} style={{ float: "right" }}>
        <CloseIcon />
      </IconButton>
    </Typography>

    {modalPreviewItems.length === 0 ? (
      <Typography variant="body1">No items added yet.</Typography>
    ) : (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: "secondary" }}>Sl.No</TableCell>
              <TableCell style={{ color: "secondary" }}>Item Name</TableCell>
              <TableCell style={{ color: "secondary" }}>Unit</TableCell>
              <TableCell style={{ color: "secondary" }}>Unit Price</TableCell>
              <TableCell style={{ color: "secondary" }}>Total Item Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modalPreviewItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell style={{ textAlign: "center", color: "secondary" }}>{index + 1}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.item_name}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.unit}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{parseFloat(item.unit_price).toFixed(2)}</TableCell>
                <TableCell style={{ textAlign: "center" }}>{item.total_item_price}</TableCell>
              </TableRow>
            ))}
            {/* Grand Total */}
            <TableRow>
              <TableCell colSpan={4} align="right">
                <strong>Grand Total:</strong>
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {parseFloat(grandTotal).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Box>
</Modal>



            {/* Customer Information */}
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" gutterBottom color="textPrimary">Customer Information</Typography>
              
              <TextField
          fullWidth
          label="Number"
          name="number"
          value={formData.number}
          onChange={handleChange}
          onBlur={fetchPhoneNumberData} // Call API on blur instead of every keystroke
          margin="normal"
          type="tel"
          variant="outlined"
        />

        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
  label="Bill Number"
  name="bill_number"
  value={loadingBill ? "Generating Bill Number..." : billNumber || ""}
  variant="outlined"
  margin="normal"
  style={{ width: "200px", fontWeight: "bold" }}
  InputProps={{ readOnly: true }} // Makes field non-editable
/>

            </Grid>

            {/* Pricing and Tax */}
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" gutterBottom color="textPrimary">Pricing and Tax</Typography>
              <FormControl fullWidth margin="normal" variant="outlined">
  <InputLabel>Tax Type</InputLabel>
  <Select
    name="taxType"
    value={formData.taxType}
    onChange={handleChange}
    label="Tax Type"
  >
    {taxOptions.map((tax) => (
      <MenuItem key={tax.id} value={tax.tax_name}>
        {tax.tax_name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

              <TextField
                fullWidth
                label="Tax (%)"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
                margin="normal"
                
                variant="outlined"
                inputRef={el => (inputRefs.current[7] = el)}
                onKeyDown={(e) => handleKeyDown(e, 7)}
              />
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Discount Applicable</InputLabel>
                <Select
                  name="isDiscountApplicable"
                  value={isDiscountApplicable ? 'Yes' : 'No'}
                  onChange={(e) => setIsDiscountApplicable(e.target.value === 'Yes')}
                  label="Discount Applicable"
                >
                  <MenuItem value="No">No</MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                </Select>
              </FormControl>
              {isDiscountApplicable && (
                <TextField
                  fullWidth
                  label="Discount (%)"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  margin="normal"
                  type="number"
                  variant="outlined"
                  inputRef={el => (inputRefs.current[8] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 8)}
                />
              )}
              <TextField
                fullWidth
                label="Total Price"
                name="totalPrice"
                value={formData.totalPrice}
                margin="normal"
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                variant="outlined"
                inputRef={el => (inputRefs.current[9] = el)}
                onKeyDown={(e) => handleKeyDown(e, 9)}
              />
            </Grid>


 {/* Payment and Narration */}
   <Grid item xs={12} md={3}>
      <Typography variant="subtitle1" gutterBottom color="textPrimary">
         Payment and Narration
      </Typography>
              <Grid container spacing={2}>
                {/* Payment Method 1 and Amount 1 */}
                <Grid item xs={6}>
                  <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel>Payment Method 1</InputLabel>
                    <Select
                      name="paymentMethod1"
                      value={formData.paymentMethod1}
                      onChange={handleChange}
                      label="Payment Method 1"
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                      <MenuItem value="Debit Card">Debit Card</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
  fullWidth
  label="Payment Amount 1"
  name="amount1"
  value={formData.amount1}
  onChange={handleChange}  // Ensure this is correctly set
  margin="normal"
  InputProps={{
    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
  }}
  variant="outlined"
  inputRef={(el) => (inputRefs.current[10] = el)}
  onKeyDown={(e) => handleKeyDown(e, 10)}
/>

                </Grid>

                {/* Payment Method 2 and Amount 2 */}
                <Grid item xs={6}>
                  <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel>Payment Method 2</InputLabel>
                    <Select
                      name="paymentMethod2"
                      value={formData.paymentMethod2}
                      onChange={handleChange}
                      label="Payment Method 2"
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Credit Card">Credit Card</MenuItem>
                      <MenuItem value="Debit Card">Debit Card</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  
                  <TextField
  fullWidth
  label="Payment Amount 2"
  name="amount2"
  value={formData.amount2}
  margin="normal"
  InputProps={{
    //readOnly: true,  // Make it read-only as it's API calculated
    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
  }}
  variant="outlined"
/>


                </Grid>
              </Grid>

              {/* Narration Field */}
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Narration"
                name="narration"
                value={formData.narration}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                inputRef={(el) => (inputRefs.current[12] = el)}
                onKeyDown={(e) => handleKeyDown(e, 12)}
              />
            </Grid>
          </Grid>
          <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
        </Box>
      </Paper>
    </Container>
  );
}
