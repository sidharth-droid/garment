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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement, // Import PointElement
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const ItemSalesReport = () => {
  const [itemCategory, setItemCategory] = useState('');
  const [exportFormat, setExportFormat] = useState('');
  const [reportData] = useState([
    { id: 1, name: 'Item A', totalQuantitySold: 150, totalSalesAmount: 3000, category: 'Electronics', profitMargin: 20 },
    { id: 2, name: 'Item B', totalQuantitySold: 100, totalSalesAmount: 1500, category: 'Clothing', profitMargin: 15 },
    { id: 3, name: 'Item C', totalQuantitySold: 200, totalSalesAmount: 4000, category: 'Electronics', profitMargin: 25 },
    { id: 4, name: 'Item D', totalQuantitySold: 80, totalSalesAmount: 800, category: 'Furniture', profitMargin: 30 },
  ]);

  const [filteredData, setFilteredData] = useState(reportData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

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
    doc.text('Item Sales Report', 14, 10);
    doc.autoTable({
      head: [
        ['Item Name', 'Total Quantity Sold', 'Total Sales Amount', 'Item Category', 'Profit Margin'],
      ],
      body: filteredData.map((row) => [
        row.name,
        row.totalQuantitySold,
        row.totalSalesAmount.toFixed(2),
        row.category,
        row.profitMargin,
      ]),
      startY: 20,
    });
    doc.save('item_sales_report.pdf');
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert('No data to export');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      filteredData.map((row) => ({
        'Item Name': row.name,
        'Total Quantity Sold': row.totalQuantitySold,
        'Total Sales Amount': row.totalSalesAmount.toFixed(2),
        'Item Category': row.category,
        'Profit Margin': row.profitMargin,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Item Sales Report');
    XLSX.writeFile(wb, 'item_sales_report.xlsx');
  };

  const handleExportChange = (event) => {
    setExportFormat(event.target.value);
    if (event.target.value === 'pdf') {
      handleExportPDF();
    } else if (event.target.value === 'excel') {
      handleExportExcel();
    }
  };

  const filterDataByCategory = () => {
    const filtered = itemCategory ? reportData.filter((row) => row.category === itemCategory) : reportData;
    setFilteredData(filtered);
  };

  useEffect(() => {
    filterDataByCategory();
  }, [itemCategory]);

  // Prepare data for the line chart
  const labels = filteredData.map(item => item.name);
  const quantitiesSold = filteredData.map(item => item.totalQuantitySold);
  const salesAmounts = filteredData.map(item => item.totalSalesAmount);

  const combinedData = {
    labels,
    datasets: [
      {
        label: 'Total Quantity Sold',
        data: quantitiesSold,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: true,
      },
      {
        label: 'Total Sales Amount',
        data: salesAmounts,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: true,
      },
    ],
  };

  // Tooltip configuration
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const datasetIndex = tooltipItem.datasetIndex;
            const item = filteredData[tooltipItem.dataIndex];
            const label = datasetIndex === 0 ? 'Quantity Sold' : 'Sales Amount';
            return [
              `${label}: ${item[datasetIndex === 0 ? 'totalQuantitySold' : 'totalSalesAmount'].toFixed(2)}`,
              `Item: ${item.name}`,
            ];
          },
        },
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#f9dff5', borderRadius: '5px' }}>
        <Typography variant="h4" gutterBottom align="center" color="purple">
          Item Sales Report
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
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              displayEmpty
              renderValue={() => itemCategory ? itemCategory : 'Select Item Category'}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
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
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => handleSort('name')} sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontWeight: 'bold', color: 'purple' }}>
                      Item Name{getSortSymbol('name')}
                    </TableCell>
                    <TableCell onClick={() => handleSort('totalQuantitySold')} sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontWeight: 'bold', color: 'purple' }}>
                      Total Quantity Sold{getSortSymbol('totalQuantitySold')}
                    </TableCell>
                    <TableCell onClick={() => handleSort('totalSalesAmount')} sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontWeight: 'bold', color: 'purple' }}>
                      Total Sales Amount{getSortSymbol('totalSalesAmount')}
                    </TableCell>
                    <TableCell onClick={() => handleSort('category')} sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontWeight: 'bold', color: 'purple' }}>
                      Item Category{getSortSymbol('category')}
                    </TableCell>
                    <TableCell onClick={() => handleSort('profitMargin')} sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontWeight: 'bold', color: 'purple' }}>
                      Profit Margin{getSortSymbol('profitMargin')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.totalQuantitySold}</TableCell>
                      <TableCell>{row.totalSalesAmount.toFixed(2)}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.profitMargin}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />

            <Typography variant="h5" gutterBottom align="center" color="purple" sx={{ marginTop: 3 }}>
              Sales Trends
            </Typography>
            <Line data={combinedData} options={options} />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ItemSalesReport;
