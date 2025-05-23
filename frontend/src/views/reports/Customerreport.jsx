
import React, { useState, useEffect } from 'react';
import {
  Container,
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

const CustomerReport = () => {
  const [customerType, setCustomerType] = useState('');
  const [exportFormat, setExportFormat] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  const fetchReportData = async (saleType) => {
    try {
      const response = await api.post('api/retailsale/customer-report/', {
        saletype: saleType,
      });
      setFilteredData(response.data); // Set the response data to filteredData
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const handleSort = (column) => {
    let direction = 'ascending';
    if (sortConfig.key === column && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key: column, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[column] < b[column]) return direction === 'ascending' ? -1 : 1;
      if (a[column] > b[column]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedData);
  };

  const getSortSymbol = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleExportPDF = () => {
    if (filteredData.length === 0) {
      alert('No data to export');
      return;
    }
    const doc = new jsPDF();
    doc.text('Customer Sales Report', 14, 10);
    doc.autoTable({
      head: [
        ['Customer Name', 'Phone Number', 'Total Sales', 'Total Quantity', 'Average Purchase Value'],
      ],
      body: filteredData.map((row) => [
        row.fullname,
        row.phone_number,
        parseFloat(row.total_amount).toFixed(2),
        row.total_quantity,
        parseFloat(row.average_amount).toFixed(2),
      ]),
      startY: 20,
    });
    doc.save('customer_sales_report.pdf');
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert('No data to export');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((row) => ({
        'Customer Name': row.fullname,
        'Phone Number': row.phone_number,
        'Total Sales': parseFloat(row.total_amount).toFixed(2),
        'Total Quantity': row.total_quantity,
        'Average Purchase Value': parseFloat(row.average_amount).toFixed(2),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customer Sales Report');

    XLSX.writeFile(wb, 'customer_sales_report.xlsx');
  };

  const handleExportChange = (event) => {
    setExportFormat(event.target.value);
    if (event.target.value === 'pdf') {
      handleExportPDF();
    } else if (event.target.value === 'excel') {
      handleExportExcel();
    }
  };

  useEffect(() => {
    fetchReportData(customerType); // Fetch data when the customerType is updated
  }, [customerType]);

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#f9dff5' }}>
        <Typography variant="h4" gutterBottom align="center" color="purple">
          Customer Sales Report
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
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              displayEmpty
              renderValue={() =>
                customerType ? customerType : 'Select Customer Type'
              }
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="RetailSale">Retail</MenuItem>
              <MenuItem value="BulkSale">Bulk</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={exportFormat}
              onChange={handleExportChange}
              displayEmpty
              renderValue={() => exportFormat ? exportFormat : 'Export As'}
            >
              <MenuItem value="pdf">
                <PictureAsPdfIcon sx={{ marginRight: 1, color: 'red' }} />
                PDF
              </MenuItem>
              <MenuItem value="excel">
                <DescriptionIcon sx={{ marginRight: 1, color: 'green' }} />
                Excel
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {filteredData.length > 0 && (
          <>
            <TableContainer
              component={Paper}
              sx={{ marginTop: 4, backgroundColor: '#f4c4ec' }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      onClick={() => handleSort('fullname')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Customer Name</strong>
                      {getSortSymbol('fullname')}
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort('phone_number')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Phone Number</strong>
                      {getSortSymbol('phone_number')}
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort('total_amount')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Total Sales Amount</strong>
                      {getSortSymbol('total_amount')}
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort('total_quantity')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Total Quantity Purchased</strong>
                      {getSortSymbol('total_quantity')}
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort('average_amount')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Average Purchase Value</strong>
                      {getSortSymbol('average_amount')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.fullname}</TableCell>
                        <TableCell>{row.phone_number}</TableCell>
                        <TableCell>{parseFloat(row.total_amount).toFixed(2)}</TableCell>
                        <TableCell>{row.total_quantity}</TableCell>
                        <TableCell>{parseFloat(row.average_amount).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
              sx={{ marginTop: 2 }}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default CustomerReport;
