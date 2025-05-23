
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
import api from "../../api";

const SalesReports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saleType, setSaleType] = useState('');
  const [exportFormat, setExportFormat] = useState('');
  const [reportData, setReportData] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');

  // Function to fetch the filtered report from API
  const fetchReport = async () => {
    try {
      const requestData = {
        start_date: startDate || null, // Pass null if no start date is provided
        end_date: endDate || null,    // Pass null if no end date is provided
        sale_type: saleType || null,  // Pass null if no sale type is provided
      };

      const response = await api.post('api/retailsale/sales-report/', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setReportData(response.data.report || []);
      setTotalSum(response.data.total_sum || 0);
      setFilteredData(response.data.report || []);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    }
  };

  // Handle PDF export
  const handleExportPDF = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 10);
    doc.autoTable({
      head: [['Date', 'Item Type', 'Category', 'Amount', 'Quantity']],
      body: filteredData.map(row => [row.date, row.sale_type, row.category, row.total_amount.toFixed(2), row.total_unit]),
      startY: 20,
    });
    doc.save('sales_report.pdf');
  };

  // Handle Excel export
  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("No data to export");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(filteredData.map(row => ({
      'Date': row.date,
      'Sale Type': row.sale_type,
      'Category': row.category,
      'Amount': row.total_amount.toFixed(2),
      'Quantity': row.total_unit,
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sale Tax Report');
    XLSX.writeFile(wb, 'sale_report.xlsx');
  };

  // Handle export format change
  const handleExportChange = (event) => {
    setExportFormat(event.target.value);
    if (event.target.value === 'pdf') {
      handleExportPDF();
    } else if (event.target.value === 'excel') {
      handleExportExcel();
    }
  };

  // Sorting data
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sorting data by the selected column
  const sortedData = filteredData.slice().sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination logic
  useEffect(() => {
    fetchReport();
  }, [startDate, endDate, saleType]);

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#f9dff5' }}>
        <Typography variant="h4" gutterBottom align="center" color='purple'>
          Sales Report
        </Typography>

        {/* Box for Input Fields in One Line */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            marginBottom: 3,
          }}
        >
          {/* Start Date Input */}
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />

          {/* End Date Input */}
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />

          {/* Sale Type Dropdown */}
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={saleType}
              onChange={(e) => setSaleType(e.target.value)}
              displayEmpty
              renderValue={() => (saleType ? saleType : "Select Sale Type")}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="RetailSale">Retail Sale</MenuItem>
              <MenuItem value="BulkSale">Bulk Sale</MenuItem>
            </Select>
          </FormControl>

          {/* Export Format Dropdown */}
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

        {/* Report Table */}
        {sortedData.length > 0 && (
          <>
            <TableContainer component={Paper} sx={{ marginTop: 4, backgroundColor: '#f4c4ec' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => handleRequestSort('date')} sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontWeight: 'bold', color: 'purple' }}><strong>Date</strong></TableCell>
                    <TableCell onClick={() => handleRequestSort('sale_type')} sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontWeight: 'bold', color: 'purple' }}><strong>Sale Type</strong></TableCell>
                    <TableCell onClick={() => handleRequestSort('category')} sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontWeight: 'bold', color: 'purple' }}><strong>Category</strong></TableCell>
                    <TableCell align="right" onClick={() => handleRequestSort('total_amount')} sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontWeight: 'bold', color: 'purple' }}><strong>Amount</strong></TableCell>
                    <TableCell align="right" onClick={() => handleRequestSort('total_unit')} sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontWeight: 'bold', color: 'purple' }}><strong>Quantity</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.sale_type}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell align="right">{parseFloat(row.total_amount).toFixed(2)}</TableCell>
                      <TableCell align="right">{row.total_unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Controls */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={sortedData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              sx={{ marginTop: 2 }}
            />
            {/* Total Sum */}
    <Box sx={{ textAlign: 'right', marginTop: 2, padding: 2 }}>
      <Typography variant="h6" color="purple">
        Total Sum: ₹{parseFloat(totalSum).toFixed(2)}
      </Typography>
    </Box>
          </>
        )}
        {sortedData.length === 0 && (
          <Typography variant="h6" color="error" align="center">
            No data found
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default SalesReports;
