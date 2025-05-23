// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   TextField,
//   FormControl,
//   Select,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
//   TablePagination,
// } from '@mui/material';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import * as XLSX from 'xlsx';
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // PDF icon
// import DescriptionIcon from '@mui/icons-material/Description'; // Excel icon

// const Discountreport = () => {
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [saleType, setSaleType] = useState('');
//   const [exportFormat, setExportFormat] = useState('');
//   const [reportData] = useState([
//     { 
//       id: 1, 
//       date: '2024-09-01', 
//       discountAmount: 200, 
//       discountPercentage: 10, 
//       customerDetails: {
//         name: 'John Doe', 
//         address: 'Kendrapada',
        
//       }, 
//       saleType: 'Retail' 
//     },
//     { 
//       id: 2, 
//       date: '2024-09-05', 
//       discountAmount: 150, 
//       discountPercentage: 7, 
//       customerDetails: {
//         name: 'Jane Smith', 
//         address: 'Cuttack,CDA-54'
//       }, 
//       saleType: 'Wholesale' 
//     },
//     { 
//       id: 3, 
//       date: '2024-09-10', 
//       discountAmount: 300, 
//       discountPercentage: 15, 
//       customerDetails: {
//         name: 'Bob Johnson', 
//         address: 'Bhubaneswar,Lig-90'
//       }, 
//       saleType: 'Retail' 
//     },
//     // Add more data as needed
//   ]);

//   const [filteredData, setFilteredData] = useState(reportData);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [order, setOrder] = useState('asc');
//   const [orderBy, setOrderBy] = useState('date');

//   const handleExportPDF = () => {
//     if (filteredData.length === 0) {
//       alert("No data to export");
//       return;
//     }
//     const doc = new jsPDF();
//     doc.text("Discount Report", 14, 10);
//     doc.autoTable({
//       head: [['Date', 'Sale Type', 'Discount Amount', 'Discount Percentage', 'Customer Details']],
//       body: filteredData.map(row => [
//         row.date, 
//         row.saleType, 
//         row.discountAmount.toFixed(2), 
//         row.discountPercentage, 
//         `${row.customerDetails.name}\n${row.customerDetails.address.replace(/, /g, '\n')}`
//       ]),
//       startY: 20,
//     });
//     doc.save('discount_report.pdf');
//   };

//   const handleExportExcel = () => {
//     if (filteredData.length === 0) {
//       alert("No data to export");
//       return;
//     }
//     const ws = XLSX.utils.json_to_sheet(filteredData.map(row => ({
//       'Date': row.date,
//       'Sale Type': row.saleType,
//       'Discount Amount': row.discountAmount.toFixed(2),
//       'Discount Percentage': row.discountPercentage,
//       'Customer Name': row.customerDetails.name,
//       'Customer Address': row.customerDetails.address.replace(/, /g, '\n'),
//     })));

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Discount Report');

//     XLSX.writeFile(wb, 'discount_report.xlsx');
//   };

//   const handleExportChange = (event) => {
//     setExportFormat(event.target.value);
//     if (event.target.value === 'pdf') {
//       handleExportPDF();
//     } else if (event.target.value === 'excel') {
//       handleExportExcel();
//     }
//   };

//   const filterData = () => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const filtered = reportData.filter(row => {
//       const rowDate = new Date(row.date);
//       const dateMatch = (!startDate || rowDate >= start) && (!endDate || rowDate <= end);
//       const saleTypeMatch = saleType ? row.saleType === saleType : true;
//       return dateMatch && saleTypeMatch;
//     });
//     setFilteredData(filtered);
//   };

//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const sortedData = filteredData.slice().sort((a, b) => {
//     if (a[orderBy] < b[orderBy]) {
//       return order === 'asc' ? -1 : 1;
//     }
//     if (a[orderBy] > b[orderBy]) {
//       return order === 'asc' ? 1 : -1;
//     }
//     return 0;
//   });

//   useEffect(() => {
//     filterData();
//   }, [startDate, endDate, saleType]);

//   return (
//     <Container maxWidth="lg" sx={{ marginTop: 4 }}>
//       <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#f9dff5' }}>
//         <Typography variant="h4" gutterBottom align="center" color='purple'>
//           Discount Report
//         </Typography>

//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             flexWrap: 'wrap',
//             gap: 2,
//             marginBottom: 3,
//           }}
//         >
//           <TextField
//             label="Start Date"
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             sx={{ minWidth: 150 }}
//           />

//           <TextField
//             label="End Date"
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             sx={{ minWidth: 150 }}
//           />

//           <FormControl sx={{ minWidth: 150 }}>
//             <Select
//               value={saleType}
//               onChange={(e) => setSaleType(e.target.value)}
//               displayEmpty
//               renderValue={() => (saleType ? saleType : "Select Sale Type")}
//             >
//               <MenuItem value="">
//                 <em>All</em>
//               </MenuItem>
//               <MenuItem value="Retail">Retail</MenuItem>
//               <MenuItem value="Wholesale">Wholesale</MenuItem>
//             </Select>
//           </FormControl>

//           <FormControl sx={{ minWidth: 150 }}>
//             <Select
//               value={exportFormat}
//               onChange={handleExportChange}
//               displayEmpty
//               renderValue={() => (exportFormat ? exportFormat : "Export As")}
//             >
//               <MenuItem value="pdf">
//                 <PictureAsPdfIcon sx={{ marginRight: 1, color: 'red' }} />
//                 PDF
//               </MenuItem>
//               <MenuItem value="excel">
//                 <DescriptionIcon sx={{ marginRight: 1, color: "green" }} />
//                 Excel
//               </MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         {sortedData.length > 0 && (
//           <>
//             <TableContainer component={Paper} sx={{ marginTop: 4 ,backgroundColor:'#f4c4ec'}}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell onClick={() => handleRequestSort('date')} sx={{cursor: 'pointer',backgroundColor:'#ea8cdb',fontStyle:'bold',color:'purple'}}><strong>Date</strong></TableCell>
//                     <TableCell onClick={() => handleRequestSort('saleType')} sx={{cursor: 'pointer',backgroundColor:'#ea8cdb',fontStyle:'bold',color:'purple'}}><strong>Sale Type</strong></TableCell>
//                     <TableCell onClick={() => handleRequestSort('discountAmount')} sx={{cursor: 'pointer',backgroundColor:'#ea8cdb',fontStyle:'bold',color:'purple'}}><strong>Total Discount Amount</strong></TableCell>
//                     <TableCell onClick={() => handleRequestSort('discountPercentage')} sx={{cursor: 'pointer',backgroundColor:'#ea8cdb',fontStyle:'bold',color:'purple'}}><strong>Discount Percentage</strong></TableCell>
//                     <TableCell onClick={() => handleRequestSort('customerDetails')} sx={{cursor: 'pointer',backgroundColor:'#ea8cdb',fontStyle:'bold',color:'purple'}}><strong>Customer Details</strong></TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
//                     <TableRow key={row.id}>
//                       <TableCell>{row.date}</TableCell>
//                       <TableCell>{row.saleType}</TableCell>
//                       <TableCell>{row.discountAmount.toFixed(2)}</TableCell>
//                       <TableCell>{row.discountPercentage}</TableCell>
//                       <TableCell>
//                         <strong>{row.customerDetails.name}</strong><br/>
//                         <span style={{whiteSpace: 'pre-line'}}>{row.customerDetails.address.replace(/, /g, '\n')}</span>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             <TablePagination
//               rowsPerPageOptions={[5, 10, 25]}
//               component="div"
//               count={sortedData.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={(e, newPage) => setPage(newPage)}
//               onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
//             />
//           </>
//         )}
//       </Paper>
//     </Container>
//   );
// };

// export default Discountreport;


import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TablePagination,
} from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // PDF icon
import DescriptionIcon from '@mui/icons-material/Description'; // Excel icon
import api from "../../api"

const Discountreport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saleType, setSaleType] = useState('');
  const [exportFormat, setExportFormat] = useState('');
  const [reportData, setReportData] = useState([]);  // Replace static data with state
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');

  useEffect(() => {
    // Fetch data when the component mounts or when filters change
    const fetchData = async () => {
      try {
        const response = await api.post('api/retailsale/salediscount-summary/', {
          start_date: startDate,
          end_date: endDate,
          saletype: saleType,
        });
        setReportData(response.data.sales_summary);  // Assuming response contains sales_summary
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate, saleType]);

  useEffect(() => {
    filterData();
  }, [startDate, endDate, saleType, reportData]);

  const filterData = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = reportData.filter(row => {
      const rowDate = new Date(row.date);
      const dateMatch = (!startDate || rowDate >= start) && (!endDate || rowDate <= end);
      const saleTypeMatch = saleType ? row.saletype === saleType : true;
      return dateMatch && saleTypeMatch;
    });
    setFilteredData(filtered);
  };

  const handleExportPDF = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }
    const doc = new jsPDF();
    doc.text("Discount Report", 14, 10);
    doc.autoTable({
      head: [['Date', 'Sale Type', 'Discount Amount', 'Discount Percentage', 'Customer Details']],
      body: filteredData.map(row => [
        row.date,
        row.saletype,
        row.total_discount.toFixed(2),
        row.discountPercentage,
        row.customer_details.map(customer => `${customer.fullname}\n${customer.phone_number}\n${customer.address}`).join("\n")
      ]),
      startY: 20,
    });
    doc.save('discount_report.pdf');
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(filteredData.map(row => ({
      'Date': row.date,
      'Sale Type': row.saletype,
      'Discount Amount': row.total_discount.toFixed(2),
      'Discount Percentage': row.discountPercentage,
      'Customer Name': row.customer_details.map(customer => customer.fullname).join(", "),
      'Customer Address': row.customer_details.map(customer => customer.address).join("\n"),
      'Customer Phone': row.customer_details.map(customer => customer.phone_number).join(", ")
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Discount Report');

    XLSX.writeFile(wb, 'discount_report.xlsx');
  };

  const handleExportChange = (event) => {
    setExportFormat(event.target.value);
    if (event.target.value === 'pdf') {
      handleExportPDF();
    } else if (event.target.value === 'excel') {
      handleExportExcel();
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = filteredData.slice().sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#f9dff5' }}>
        <Typography variant="h4" gutterBottom align="center" color="purple">
          Discount Report
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            marginBottom: 3,
          }}
        >
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />

          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />

          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={saleType}
              onChange={(e) => setSaleType(e.target.value)}
              displayEmpty
              renderValue={() => (saleType ? saleType : "Select Sale Type")}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="RetailSale">Retail</MenuItem>
              <MenuItem value="BulkSale">BulkSale</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={exportFormat}
              onChange={handleExportChange}
              displayEmpty
              renderValue={() => (exportFormat ? exportFormat : "Export As")}
            >
              <MenuItem value="pdf">
                <PictureAsPdfIcon sx={{ marginRight: 1, color: 'red' }} />
                PDF
              </MenuItem>
              <MenuItem value="excel">
                <DescriptionIcon sx={{ marginRight: 1, color: "green" }} />
                Excel
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {sortedData.length > 0 && (
          <>
            <TableContainer component={Paper} sx={{ marginTop: 4, backgroundColor: '#f4c4ec' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => handleRequestSort('date')} sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}><strong>Date</strong></TableCell>
                    <TableCell onClick={() => handleRequestSort('saletype')} sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}><strong>Sale Type</strong></TableCell>
                    <TableCell onClick={() => handleRequestSort('total_discount')} sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}><strong>Total Discount</strong></TableCell>
                    <TableCell sx={{ backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}><strong>Customer Details</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.saletype}</TableCell>
                      <TableCell>{row.total_discount.toFixed(2)}</TableCell>
                      <TableCell>
                        {row.customer_details.map((customer, index) => (
                          <div key={index} style={{ marginBottom: '8px' }}>
                            <strong>{customer.fullname}</strong><br />
                            Phone: {customer.phone_number}<br />
                            Address: {customer.address}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={sortedData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Discountreport;
