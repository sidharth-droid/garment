
import React, { useState, useEffect, useRef } from 'react';
import {
  TextField, Button, Box, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, IconButton, DialogContentText
} from '@mui/material';
import { Edit, Delete ,Download} from '@mui/icons-material';
import api from "../../../api";
import "jspdf-autotable";
import jsPDF from "jspdf";

export default function SimplePaper() {
  const [categoryDetails, setCategoryDetails] = useState({
    category_name: '',
    category_code: '',
    sub_category_name: {},
    description: '',
  });

  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState({ add: false, fetch: true });
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const nameRef = useRef(null);
  const codeRef = useRef(null);
  const subCategoryRef = useRef(null);
  const descriptionRef = useRef(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/user/categories/');
        const dataDict = response.data.reduce((acc, category) => {
          acc[category.category_code] = {
            ...category,
            sub_category_name: category.sub_category_name ?? [], // Ensure it's always an array
          };
          return acc;
        }, {});
  
        setCategoryList(dataDict);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading((prevLoading) => ({ ...prevLoading, fetch: false }));
      }
    };
  
    fetchData();
  }, []);
  

  const handleChange = (e) => {
    setCategoryDetails({
      ...categoryDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
    setEditIndex(null);
    setCategoryDetails({
      category_name: '',
      category_code: '',
      sub_category_name: '',
      description: '',
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  

  const handleEdit = (category) => {
    setCategoryDetails({
      category_name: category.category_name || '',
      category_code: category.category_code || '',
      sub_category_name: Array.isArray(category.sub_category_name) 
        ? category.sub_category_name.map(sub => sub.name).join(', ') 
        : '',  // ✅ Ensure it's a string, even if sub_category_name is undefined
      description: category.description || '',
    });
  
    setEditIndex(category.category_code);
    setOpen(true);
  };
  

  // const handleAddOrUpdate = async (e) => {
  //   e.preventDefault();
  //   setLoading((prevLoading) => ({ ...prevLoading, add: true }));
  
  //   const payload = {
  //     ...categoryDetails,
  //     sub_category_name: categoryDetails.sub_category_name.split(',').map((name) => ({ name: name.trim() })), // Convert to object format
  //   };
  
  //   try {
  //     if (editIndex !== null) {
  //       // Update existing category
  //       const response = await api.put(`/api/user/categories/${categoryDetails.category_name}/`, payload);
  //       setCategoryList((prevList) => ({
  //         ...prevList,
  //         [categoryDetails.category_code]: response.data.data,
  //       }));
  //       alert(response.data.message);
  //       setEditIndex(null);
  //     } else {
  //       // Add new category
  //       const response = await api.post('/api/user/categories/', payload);
  //       setCategoryList((prevList) => ({
  //         ...prevList,
  //         [response.data.data.category_code]: response.data.data,
  //       }));
  //       alert(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error saving category:', error);
  //   } finally {
  //     setLoading((prevLoading) => ({ ...prevLoading, add: false }));
  //     setCategoryDetails({
  //       category_name: '',
  //       category_code: '',
  //       sub_category_name: '',
  //       description: '',
  //     });
  //     setOpen(false);
  //   }
  // };
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setLoading((prevLoading) => ({ ...prevLoading, add: true }));

    // Validation rules
    const errors = [];

    const categoryNameRegex = /^[A-Za-z\s']+$/; // Allows letters, spaces, and apostrophes (')
    const categoryCodeRegex = /^[A-Za-z0-9-]+$/; // Allows letters, numbers, and hyphens (-)
    const subCategoryRegex = /^[A-Za-z-,\s]+$/; // Allows letters, hyphens, commas, and spaces
    //const descriptionRegex = /^[A-Za-z0-9-]+$/; // Allows only letters, spaces, and hyphens (-)
    const descriptionRegex = /^[A-Za-z0-9-\s]+$/; 


    if (!categoryDetails.category_name.trim()) {
        errors.push("Category Name is required.");
    } else if (!categoryNameRegex.test(categoryDetails.category_name)) {
        errors.push("Category Name can only contain letters (A-Z, a-z), spaces, and apostrophes (').");
    }

    if (!categoryDetails.category_code.trim()) {
        errors.push("Category Code is required.");
    } else if (!categoryCodeRegex.test(categoryDetails.category_code)) {
        errors.push("Category Code can only contain letters, numbers, and hyphens (-).");
    }

    if (!categoryDetails.sub_category_name.trim()) {
        errors.push("Sub-Category Name is required.");
    } else if (!subCategoryRegex.test(categoryDetails.sub_category_name)) {
        errors.push("Sub-Category Name can only contain letters, hyphens (-), commas (,), and spaces.");
    }

    if (categoryDetails.description.trim() && !descriptionRegex.test(categoryDetails.description)) {
        errors.push("Description can only contain letters,disits, spaces, and hyphens (-).");
    }

    if (errors.length > 0) {
        alert("Validation Errors:\n" + errors.join("\n"));
        setLoading((prevLoading) => ({ ...prevLoading, add: false })); // ✅ Reset loading state on error
        return;
    }

    const payload = {
        ...categoryDetails,
        sub_category_name: categoryDetails.sub_category_name
            .split(',')
            .map((name) => ({ name: name.trim() })), // Convert to object format
    };

    try {
        if (editIndex !== null) {
            // Update existing category
            const response = await api.put(`/api/user/categories/${categoryDetails.category_name}/`, payload);
            setCategoryList((prevList) => ({
                ...prevList,
                [categoryDetails.category_code]: response.data.data,
            }));
            alert(response.data.message);
            setEditIndex(null);
        } else {
            // Add new category
            const response = await api.post('/api/user/categories/', payload);
            setCategoryList((prevList) => ({
                ...prevList,
                [response.data.data.category_code]: response.data.data,
            }));
            alert(response.data.message);
        }
    } catch (error) {
        console.error('Error saving category:', error);
    } finally {
        setLoading((prevLoading) => ({ ...prevLoading, add: false })); // ✅ Ensure loading is reset
        setCategoryDetails({
            category_name: '',
            category_code: '',
            sub_category_name: '',
            description: '',
        });
        setOpen(false);
    }
};

  

  const handleDelete = (index) => {
    setDeleteDialogOpen(true);
    setDeleteIndex(index);
  };

  

  const confirmDelete = async () => {
    try {
      const categoryToDelete = categoryList[deleteIndex];
  
      if (!categoryToDelete) {
        console.error("Error: Category not found for deletion.");
        return;
      }
  
      await api.delete(`/api/user/categories/${categoryToDelete.category_name}/`);
  
      // ✅ Correctly update categoryList by removing the deleted category
      const updatedList = Object.values(categoryList).filter(
        (category) => category.category_code !== categoryToDelete.category_code
      );
  
      // ✅ Convert array back to object format
      const updatedListAsObject = updatedList.reduce((acc, category) => {
        acc[category.category_code] = category;
        return acc;
      }, {});
  
      setCategoryList(updatedListAsObject);
      alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // const handleKeyDown = (e, nextRef) => {
  //   if (e.key === 'Enter' && nextRef.current) {
  //     e.preventDefault();
  //     nextRef.current.focus();
  //   }
  // };
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      if (nextRef?.current) {
        nextRef.current.focus(); // Move focus to the next field
      }
    }
  };
  

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Category List", 14, 15);

    const tableColumn = ["Category Name", "Category Code", "Sub-Category Names", "Description"];
    const tableRows = Object.values(categoryList).map(category => [
      category.category_name,
      category.category_code,
      Array.isArray(category.sub_category_name) && category.sub_category_name.length > 0
        ? category.sub_category_name.map(sub => sub?.name || "Unnamed Subcategory").join(", ")
        : "No Subcategories",
      category.description
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25
    });

    doc.save("category_list.pdf");
  };


  return (
    <Box sx={{ maxWidth: '100%', padding: 2 }}>


      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        {editIndex !== null ? 'Edit Category' : 'Add Category'}
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? 'Edit Category Details' : 'Add Category Details'}</DialogTitle>
        <DialogContent>
          <Paper sx={{ padding: "10px" }} elevation={0}>
            <form>
              <TextField
                fullWidth
                label="Category Name"
                name="category_name"
                value={categoryDetails.category_name}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, codeRef)}
                inputRef={nameRef}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Category Code"
                name="category_code"
                value={categoryDetails.category_code}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, subCategoryRef)}
                inputRef={codeRef}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Sub-Category Names "
                name="sub_category_name"
                value={categoryDetails.sub_category_name}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                inputRef={subCategoryRef}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={categoryDetails.description}
                onChange={handleChange}
                inputRef={descriptionRef}
                margin="normal"
              />
            </form>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdate} color="secondary" disabled={loading.add}>
            {loading.add ? <CircularProgress size={24} /> : editIndex !== null ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {loading.fetch ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category Name</TableCell>
                <TableCell>Category Code</TableCell>
                <TableCell>Sub-Category Names</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>
                          <IconButton color="primary" onClick={downloadPDF}>
                            <Download />
                          </IconButton>
                        </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {Object.values(categoryList).map((category) => (
     
    <TableRow key={category.category_code}>
      <TableCell>{category.category_name}</TableCell>
      <TableCell>{category.category_code}</TableCell>
<TableCell style={{ width: '350px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
  {Array.isArray(category.sub_category_name) && category.sub_category_name.length > 0
    ? category.sub_category_name
        .map((sub) => sub?.name || "Unnamed Subcategory") // ✅ Corrected this part
        .join(", ")
    : "No Subcategories"}
</TableCell>


      <TableCell>{category.description}</TableCell>
      <TableCell>
       
        <IconButton color="secondary" onClick={() => handleEdit(category)}>
  <Edit />
</IconButton>

        <IconButton color="error" onClick={() => handleDelete(category.category_code)}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
     
  ))}
</TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="secondary">
            CANCEL
          </Button>
          <Button onClick={confirmDelete} color="error">
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}





