import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  TablePagination,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import api from "../../api"; // Make sure you have this API file setup properly

const PurchaseReport = () => {
  const [filterTerm, setFilterTerm] = useState('');
  const [reportData, setReportData] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('party_name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Fetch purchase report data from the API
    const fetchPurchaseData = async () => {
      try {
        const response = await api.post('api/purchase/purchase-details/'); // Replace with your API endpoint
        setReportData(response.data.data); // Set the fetched data to reportData state
      } catch (error) {
        console.error('Error fetching purchase report data:', error);
      }
    };

    fetchPurchaseData();
  }, []);

  const handleFilterChange = (e) => {
    setFilterTerm(e.target.value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredData = reportData.filter((item) =>
    item.party_name.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] > b[orderBy] ? -1 : 1;
    }
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Purchase Report', 20, 10);

    const tableColumn = [
      'Party Name',
      'Address',
      'Item',
      'Voucher Number',
      'Voucher Date',
      'Quantity',
      'Rate',
      'Discount Percentage',
      'Discount Amount',
      'Taxable Amount',
      'GST Percentage',
      'GST Amount',
      'Purchase Amount',
      'Reference Voucher Number',
    ];
    const tableRows = filteredData.map((row) => [
      row.party_name,
      row.address,
      row.item,
      row.voucher_number,
      row.voucher_date,
      row.quantity,
      row.rate,
      row.discount_percentage,
      row.discount_amount,
      row.taxable_amount,
      row.gst_percentage,
      row.gst_amount,
      row.purchase_amount,
      row.reference_voucher_number,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('purchase_report.pdf');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Purchase Report');
    XLSX.writeFile(workbook, 'purchase_report.xlsx');
  };

  const handleExportChange = (e) => {
    const format = e.target.value;
    if (format === 'pdf') {
      exportPDF();
    } else if (format === 'excel') {
      exportExcel();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#f9dff5' }}>
        <Typography variant="h4" gutterBottom align="center" color="purple">
          Purchase Report
        </Typography>

        {/* Search Input and Export Select Box in One Line */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          {/* Search Input */}
          <TextField
            label="Search Party Name"
            value={filterTerm}
            onChange={handleFilterChange}
            sx={{ flexGrow: 1, marginRight: 2 }}
          />

          {/* Export Select Box */}
          <FormControl sx={{ minWidth: 160 }}>
            <Select
              value="" // Initial state empty
              onChange={handleExportChange}
              displayEmpty
              renderValue={() => 'Export As'}
            >
              <MenuItem value="pdf">
                <PictureAsPdfIcon sx={{ color: 'red', marginRight: 1 }} />
                PDF
              </MenuItem>
              <MenuItem value="excel">
                <InsertDriveFileIcon sx={{ color: 'green', marginRight: 1 }} />
                Excel
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Table */}
        {sortedData.length > 0 ? (
          <>
            <TableContainer component={Paper} sx={{ marginTop: 4, backgroundColor: '#f4c4ec' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      onClick={() => handleRequestSort('party_name')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Party Name</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('address')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Address</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('item')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Item</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('voucher_number')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Voucher Number</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('voucher_date')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Voucher Date</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('quantity')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Quantity</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('rate')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Rate</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('discount_percentage')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Discount Percentage</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('discount_amount')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Discount Amount</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('taxable_amount')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Taxable Amount</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('gst_percentage')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>GST Percentage</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('gst_amount')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>GST Amount</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('purchase_amount')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Purchase Amount</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('reference_voucher_number')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold', color: 'purple' }}
                    >
                      <strong>Reference Voucher Number</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.voucher_number}>
                        <TableCell>{row.party_name}</TableCell>
                        <TableCell>{row.address}</TableCell>
                        <TableCell>{row.item}</TableCell>
                        <TableCell>{row.voucher_number}</TableCell>
                        <TableCell>{row.voucher_date}</TableCell>
                        <TableCell>{row.quantity}</TableCell>
                        <TableCell>{row.rate}</TableCell>
                        <TableCell>{row.discount_percentage}</TableCell>
                        <TableCell>{row.discount_amount}</TableCell>
                        <TableCell>{row.taxable_amount}</TableCell>
                        <TableCell>{row.gst_percentage}</TableCell>
                        <TableCell>{row.gst_amount}</TableCell>
                        <TableCell>{row.purchase_amount}</TableCell>
                        <TableCell>{row.reference_voucher_number}</TableCell>
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
          <Typography variant="body1" color="textSecondary" align="center">
            No items found.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default PurchaseReport;
