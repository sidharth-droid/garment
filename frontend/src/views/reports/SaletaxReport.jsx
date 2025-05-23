

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
  CircularProgress,
} from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // PDF icon
import DescriptionIcon from '@mui/icons-material/Description'; // Excel icon
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'; // Sort Ascending Icon
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'; // Sort Descending Icon
import axios from 'axios'; // For making API requests
import api from "../../api"
const SaleTaxReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [taxType, setTaxType] = useState('');
  const [exportFormat, setExportFormat] = useState('');
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false); // To handle loading state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('total_price');

  // Fetch report data from API with filters
  const fetchReportData = async () => {
    setLoading(true); // Set loading to true before API call
    try {
      const response = await api.post('/api/retailsale/saletax-report/', {
        start_date: startDate,
        end_date: endDate,
        tax_type: taxType,
      });
      const data = response.data.data; // Assuming the response data is in this format
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false); // Set loading to false once API call is done
    }
  };

  useEffect(() => {
    fetchReportData(); // Fetch data when the component mounts or filters change
  }, [startDate, endDate, taxType]);

  useEffect(() => {
    // Filter the report data based on selected filters
    const filterData = () => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const filtered = reportData.filter((row) => {
        const rowDate = new Date(row.date);
        const dateMatch =
          (!startDate || rowDate >= start) && (!endDate || rowDate <= end);
        const taxMatch = !taxType || row.sale_type === taxType;
        return dateMatch && taxMatch;
      });
      setFilteredData(filtered);
    };

    filterData();
  }, [startDate, endDate, taxType, reportData]);

  const handleExportPDF = () => {
    if (filteredData.length === 0) {
      alert('No data to export');
      return;
    }
    const doc = new jsPDF();
    doc.text('Sale Tax Report', 14, 10);
    doc.autoTable({
      head: [['Date', 'Category', 'Sale Type', 'Total Price', 'Total Tax']],
      body: filteredData.map((row) => [
        row.date,
        row.category,
        row.sale_type,
        row.total_price.toFixed(2),
        row.total_tax.toFixed(2),
      ]),
      startY: 20,
    });
    doc.save('sale_tax_report.pdf');
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert('No data to export');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((row) => ({
        Date: row.date,
        Category: row.category,
        'Sale Type': row.sale_type,
        'Total Price': row.total_price.toFixed(2),
        'Total Tax': row.total_tax.toFixed(2),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sale Tax Report');

    XLSX.writeFile(wb, 'sale_tax_report.xlsx');
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

  const sortedData = filteredData.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    }
    return a[orderBy] < b[orderBy] ? 1 : -1;
  });

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#f9dff5' }}>
        <Typography variant="h4" gutterBottom align="center" color="purple">
          Sale Tax Report
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

          {/* Tax Type Dropdown */}
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={taxType}
              onChange={(e) => setTaxType(e.target.value)}
              displayEmpty
              renderValue={() => (taxType ? taxType : 'Select Sale Type')}
            >
              <MenuItem value="RetailSale">Retail Sale</MenuItem>
              {/* Add more sale types as needed */}
            </Select>
          </FormControl>

          {/* Export Format Dropdown */}
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={exportFormat}
              onChange={handleExportChange}
              displayEmpty
              renderValue={() => (exportFormat ? exportFormat : 'Export As')}
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

        {/* Show loading indicator while fetching data */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Report Table */}
            {filteredData.length > 0 ? (
              <>
                <TableContainer component={Paper} sx={{ marginTop: 4, backgroundColor: '#f4c4ec' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          onClick={() => handleRequestSort('date')}
                          sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                        >
                          <strong>Date</strong>
                        </TableCell>
                        <TableCell
                          onClick={() => handleRequestSort('category')}
                          sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                        >
                          <strong>Category</strong>
                        </TableCell>
                        <TableCell
                          onClick={() => handleRequestSort('sale_type')}
                          sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                        >
                          <strong>Sale Type</strong>
                        </TableCell>
                        <TableCell
                          onClick={() => handleRequestSort('total_price')}
                          align="right"
                          sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                        >
                          <strong>Total Price {orderBy === 'total_price' ? (order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />) : null}</strong>
                        </TableCell>
                        <TableCell
                          onClick={() => handleRequestSort('total_tax')}
                          align="right"
                          sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                        >
                          <strong>Total Tax {orderBy === 'total_tax' ? (order === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />) : null}</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow key={row.date}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell>{row.sale_type}</TableCell>
                          <TableCell align="right">{row.total_price.toFixed(2)}</TableCell>
                          <TableCell align="right">{row.total_tax.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
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
                />
              </>
            ) : (
              <Typography variant="h6" align="center" color="text.secondary" sx={{ marginTop: 4 }}>
                No data available for the selected filters.
              </Typography>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default SaleTaxReport;
