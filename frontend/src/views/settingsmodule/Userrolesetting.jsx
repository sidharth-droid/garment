


// import React, { useState, useEffect } from 'react';
// import {
//   TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, Paper,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, MenuItem,
//   Select, InputLabel, FormControl, Radio, RadioGroup, FormControlLabel, FormLabel, Checkbox,
//   DialogContentText, Divider, Typography
// } from '@mui/material';
// import ClearIcon from "@mui/icons-material/Clear";

// import { Edit, Delete } from '@mui/icons-material';
// import axios from 'axios';
// import api from '../../api'
// export default function RoleForm() {
//   const [roleDetails, setRoleDetails] = useState({
//     roleName: '',
//     userName: '',
//     permissions: [],
//     status: 'Active',
//     selectedModule: '',  // Track selected module
//     selectedSubModules: []  // Track selected sub-modules
//   });

//   const [roleList, setRoleList] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
//   const [deleteIndex, setDeleteIndex] = useState(null);

//   const [modules, setModules] = useState([]);  // Store module data, initially an empty array
  

//   useEffect(() => {
//     // Fetch modules from the API using axios.get
//     api.get('api/garmentmodule/modules/')
//       .then((response) => {
//         const fetchedModules = response.data.data;

//         if (Array.isArray(fetchedModules)) {
//           setModules(fetchedModules);
//         } else {
//           console.error('API response is not an array:', fetchedModules);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching modules:', error);
//       });
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setRoleDetails({
//       ...roleDetails,
//       [name]: value
//     });
//   };

//   const handlePermissionsChange = (e) => {
//     const { value, checked } = e.target;
//     setRoleDetails((prevDetails) => {
//       const permissions = checked
//         ? [...prevDetails.permissions, value]
//         : prevDetails.permissions.filter((permission) => permission !== value);
//       return { ...prevDetails, permissions };
//     });
//   };

//   const handleClickOpen = () => {
//     setOpen(true);
//     setEditIndex(null);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleClearSelection = () => {
//     setRoleDetails({ ...roleDetails, selectedSubModules: [] });
//   };

  


//   // const handleAddOrUpdate = async (e) => {
//   //   e.preventDefault();
  
//   //   const requestData = {
//   //     role: roleDetails.roleName,
//   //     user_name: roleDetails.userName,
//   //     is_active: roleDetails.status === "Active",
//   //     modules: roleDetails.selectedSubModules.map(moduleName => ({
//   //       name: moduleName
//   //     }))
//   //   };
  
//   //   try {
//   //     const response = await api.post('api/userrole/role-based-user/', requestData);
//   //     console.log("Response:", response.data);
  
//   //     if (response.data.success) {
//   //       alert("User role added successfully!");
  
//   //       // Fetch updated list or update UI accordingly
//   //       setRoleList([...roleList, roleDetails]);
  
//   //       // Reset the form
//   //       setRoleDetails({
//   //         roleName: '',
//   //         userName: '',
//   //         permissions: [],
//   //         status: 'Active',
//   //         selectedModule: '',
//   //         selectedSubModules: []
//   //       });
  
//   //       setOpen(false);
//   //     } else {
//   //       alert("Failed to add user role: " + response.data.error);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error submitting form:", error);
//   //     alert("Error submitting form. Check console for details.");
//   //   }
//   // };
//   const handleAddOrUpdate = async (e) => {
//     e.preventDefault();
  
//     const requestData = {
//       role: roleDetails.roleName,
//       user_name: roleDetails.userName,
//       is_active: roleDetails.status === "Active",
//       modules: roleDetails.selectedSubModules.map(moduleName => ({
//         name: moduleName
//       }))
//     };
  
//     try {
//       let response;
  
//       if (editIndex !== null) {
//         // Update existing role (PUT request)
//         response = await api.put(`api/userrole/role-based-user/${roleDetails.userName}/update/`, requestData);
//         console.log("Update Response:", response.data);
//       } else {
//         // Create new role (POST request)
//         response = await api.post('api/userrole/role-based-user/', requestData);
//         console.log("Create Response:", response.data);
//       }
  
//       if (response.data.success) {
//         alert(editIndex !== null ? "User role updated successfully!" : "User role added successfully!");
  
//         // Refresh role list (Fetch roles after update)
//         const updatedRoles = await api.get('api/userrole/role-based-user/');
//         setRoleList(updatedRoles.data.data);
  
//         // Reset the form
//         setRoleDetails({
//           roleName: '',
//           userName: '',
//           permissions: [],
//           status: 'Active',
//           selectedModule: '',
//           selectedSubModules: []
//         });
  
//         setOpen(false);
//         setEditIndex(null);
//       } else {
//         alert("Operation failed: " + response.data.error);
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("Error submitting form. Check console for details.");
//     }
//   };
  

  
  

//   const handleDeleteConfirmation = (index) => {
//     setDeleteIndex(index);
//     setConfirmDeleteOpen(true);
//   };

//   const handleDelete = () => {
//     const updatedList = roleList.filter((_, i) => i !== deleteIndex);
//     setRoleList(updatedList);
//     setConfirmDeleteOpen(false);
//     setDeleteIndex(null);
//   };

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const response = await api.get('api/userrole/role-based-user/all');
//         if (response.data.success) {
//           setRoleList(response.data.data);
//         } else {
//           console.error("Failed to fetch roles:", response.data.error);
//         }
//       } catch (error) {
//         console.error("Error fetching roles:", error);
//       }
//     };
  
//     fetchRoles();
//   }, []);
  

//   const handleEdit = async (index) => {
//     const userName = roleList[index].user_name; // Get the user name

//     try {
//         const response = await api.get(`api/userrole/role-based-user/${userName}/`);
//         const fetchedData = response.data; // Store fetched data

//         setRoleDetails({
//             roleName: fetchedData.role || "",  // Set role name
//             userName: fetchedData.user_name || "", // Set username
//             selectedSubModules: fetchedData.modules 
//                 ? fetchedData.modules.flatMap((module) => 
//                     module.children 
//                         ? module.children.flatMap((subModule) =>
//                             subModule.children
//                                 ? subModule.children.flatMap((thirdLevel) =>
//                                     thirdLevel.children
//                                         ? thirdLevel.children.map((fourthLevel) => fourthLevel.name)
//                                         : thirdLevel.name
//                                 )
//                                 : subModule.name
//                         )
//                         : module.name
//                 )
//                 : [],
//             status: fetchedData.is_active ? "Active" : "Inactive", // Set status
//         });

//         setOpen(true); // Open modal
//     } catch (error) {
//         console.error("Error fetching role data:", error);
//     }
// };



//   // Handle Edit Modal Close
//   const handleCloseEditModal = () => {
//     setOpenEditModal(false);
//     setEditData(null);
//   };

//   return (
//     <Box sx={{ maxWidth: '100%', padding: 2 }}>
//       <Button variant="contained" color="secondary" onClick={handleClickOpen}>
//         {editIndex !== null ? 'Edit Role' : 'Add Role'}
//       </Button>

//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle style={{ backgroundColor: '#f9dff5' }}>
//           {editIndex !== null ? 'Edit Role' : 'Add Role'}
//         </DialogTitle>
//         <DialogContent style={{ backgroundColor: '#f9dff5' }}>
//           <Paper sx={{ padding: '10px', backgroundColor: '#f9dff5' }} elevation={0}>
//             <form>
//               {/* Role Name (Select box) */}
//               <FormControl fullWidth margin="normal" required>
//                 <InputLabel>Role Name</InputLabel>
//                 <Select
//                   value={roleDetails.roleName}
//                   name="roleName"
//                   onChange={handleChange}
//                   label="Role Name"
//                 >
//                   <MenuItem value="Admin">Admin</MenuItem>
//                   <MenuItem value="Manager">Manager</MenuItem>
//                   <MenuItem value="Salesperson">Salesperson</MenuItem>
//                 </Select>
//               </FormControl>

//               {/* User Name (TextField) */}
//               <TextField
//                 fullWidth
//                 label="User Name"
//                 name="userName"
//                 value={roleDetails.userName}
//                 onChange={handleChange}
//                 margin="normal"
//                 required
//               />


// <FormControl fullWidth margin="normal" required>
//       <InputLabel>Select Module</InputLabel>
//       <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
//         <Select
//           multiple
//           value={roleDetails.selectedSubModules}
//           onChange={handleChange}
//           name="selectedSubModules"
//           label="Select Module"
//           renderValue={(selected) => selected.join(", ")}
//           sx={{ width: "100%", pr: 5 }} // Ensure padding for Clear Icon
//         >
//           {/* Add Dashboard as a separate selectable item */}
//           {modules.map((module) => (
//             <MenuItem key={module.id} value={module.name}>
//               <Checkbox checked={roleDetails.selectedSubModules.includes(module.name)} />
//               {module.name}
//             </MenuItem>
//           ))}

//           {modules.flatMap((module) =>
//             module.children.flatMap((subModule) =>
//               subModule.children.flatMap((thirdLevelChild) => [
//                 <MenuItem key={thirdLevelChild.id} value={thirdLevelChild.name} sx={{ pl: 2 }}>
//                   <Checkbox checked={roleDetails.selectedSubModules.includes(thirdLevelChild.name)} />
//                   {thirdLevelChild.name}
//                 </MenuItem>,
//                 thirdLevelChild.children.map((fourthLevelChild) => (
//                   <MenuItem key={fourthLevelChild.id} value={fourthLevelChild.name} sx={{ pl: 4 }}>
//                     <Checkbox checked={roleDetails.selectedSubModules.includes(fourthLevelChild.name)} />
//                     └ {fourthLevelChild.name}
//                   </MenuItem>
//                 )),
//               ])
//             )
//           )}
//         </Select>

//         {/* Clear (X) Button */}
//         {roleDetails.selectedSubModules.length > 0 && (
//           <IconButton
//             size="small"
//             onClick={handleClearSelection}
//             sx={{
//               position: "absolute",
//               right: 10,
//               top: "50%",
//               transform: "translateY(-50%)",
//               backgroundColor: "white",
//               zIndex: 10, // Ensure it's visible
//               pointerEvents: "auto",
//             }}
//           >
//             <ClearIcon />
//           </IconButton>
//         )}
//       </Box>
//     </FormControl>


//               {/* Status (Radio button) */}
//               <FormControl component="fieldset" margin="normal">
//                 <FormLabel component="legend">Status</FormLabel>
//                 <RadioGroup
//                   name="status"
//                   value={roleDetails.status}
//                   onChange={handleChange}
//                 >
//                   <FormControlLabel value="Active" control={<Radio />} label="Active" />
//                   <FormControlLabel value="Inactive" control={<Radio />} label="Inactive" />
//                 </RadioGroup>
//               </FormControl>
//             </form>
//           </Paper>
//         </DialogContent>
//         <DialogActions style={{ backgroundColor: '#f9dff5' }}>
//           <Button onClick={handleClose} color="error">Cancel</Button>
//           <Button onClick={handleAddOrUpdate} color="secondary">
//             {editIndex !== null ? 'Update' : 'Add'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <TableContainer component={Paper} sx={{ marginTop: 3 }}>
//   <Table>
//     <TableHead>
//       <TableRow>
//         <TableCell>Role Name</TableCell>
//         <TableCell>User Name</TableCell>
//         <TableCell>Modules & Sub-Modules</TableCell>
//         <TableCell>Status</TableCell>
//         <TableCell>Actions</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {roleList.map((role, index) => (
//         <TableRow key={index}>
//           <TableCell>{role.role}</TableCell>
//           <TableCell>{role.user_name}</TableCell>
//           <TableCell>
//             {role.modules.map((module, idx) => (
//               <div key={idx}>
//                 <strong>{module.name}</strong>
//                 {module.sub_modules && module.sub_modules.length > 0 && (
//                   <ul style={{ margin: 0, paddingLeft: 16 }}>
//                     {module.sub_modules.map((sub, subIdx) => (
//                       <li key={subIdx}>{sub.name}</li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             ))}
//           </TableCell>
//           <TableCell>
//             <span
//               style={{
//                 color: role.is_active ? "green" : "red",
//                 fontWeight: "bold",
//               }}
//             >
//               {role.is_active ? "Active" : "Inactive"}
//             </span>
//           </TableCell>
//           <TableCell>
//             <IconButton color="secondary" onClick={() => handleEdit(index)}>
//               <Edit />
//             </IconButton>
//             <IconButton color="error" onClick={() => handleDeleteConfirmation(index)}>
//               <Delete />
//             </IconButton>
//           </TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// </TableContainer>



//       {/* Confirmation Dialog for Delete */}
//       <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this role?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setConfirmDeleteOpen(false)} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleDelete} color="error">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }







import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, MenuItem,
  Select, InputLabel, FormControl, Radio, RadioGroup, FormControlLabel, FormLabel, Checkbox,
  DialogContentText, Divider, Typography
} from '@mui/material';
import ClearIcon from "@mui/icons-material/Clear";

import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import api from '../../api'
export default function RoleForm() {
  const [roleDetails, setRoleDetails] = useState({
    roleName: '',
    userName: '',
    permissions: [],
    status: 'Active',
    selectedModule: '',  // Track selected module
    selectedSubModules: []  // Track selected sub-modules
  });

  const [roleList, setRoleList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [modules, setModules] = useState([]);  // Store module data, initially an empty array
  

  // useEffect(() => {
  //   // Fetch modules from the API using axios.get
  //   api.get('api/garmentmodule/modules/')
  //     .then((response) => {
  //       const fetchedModules = response.data.data;

  //       if (Array.isArray(fetchedModules)) {
  //         setModules(fetchedModules);
  //       } else {
  //         console.error('API response is not an array:', fetchedModules);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching modules:', error);
  //     });
  // }, []);
// 🔹 Function to fetch modules
const fetchModules = async () => {
  try {
    const response = await api.get("api/garmentmodule/modules/");
    if (Array.isArray(response.data.data)) {
      setModules(response.data.data);
    } else {
      console.error("API response is not an array:", response.data.data);
    }
  } catch (error) {
    console.error("Error fetching modules:", error);
  }
};

// 🔹 Call fetchModules when component mounts
useEffect(() => {
  fetchModules();
}, []);

// 🔹 Handle adding a role (Instant UI Update)
const handleAddRole = async () => {
  try {
    const response = await api.post("api/userrole/role-based-user/", {
      role: roleDetails.roleName,
      user_name: roleDetails.userName,
      modules: roleDetails.selectedSubModules.map((name) => ({ name })),
      is_active: roleDetails.status === "Active",
    });

    console.log("✅ Added successfully:", response.data);

    // 🔥 Update `modules` state **immediately** before fetching
    setModules((prevModules) => [
      ...prevModules,
      ...roleDetails.selectedSubModules.map((name) => ({ name })),
    ]);

    // 🔄 Fetch the latest data from the API
    await fetchModules();

    // Reset form after adding
    handleClose();
  } catch (error) {
    console.error("❌ Error adding role:", error);
  }
};

// 🔹 Handle deleting a user (Instant UI Update)
const handleDelete = async () => {
  try {
    if (!roleDetails.userName) {
      console.error("⚠ No user selected for deletion");
      return;
    }

    console.log("🗑 Deleting user:", roleDetails.userName);

    await api.delete(`api/userrole/role-based-user/${roleDetails.userName}/delete/`);

    console.log("✅ User deleted successfully");

    // 🔥 Instantly remove deleted user from modules before fetching
    setModules((prevModules) => prevModules.filter((mod) => mod.name !== roleDetails.userName));

    // 🔄 Fetch the latest data from the API
    await fetchModules();

    // Close delete confirmation modal
    setConfirmDeleteOpen(false);

    // Reset roleDetails state
    setRoleDetails({
      roleName: "",
      userName: "",
      selectedSubModules: [],
      status: "Active",
    });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
  }
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoleDetails({
      ...roleDetails,
      [name]: value
    });
  };

  const handlePermissionsChange = (e) => {
    const { value, checked } = e.target;
    setRoleDetails((prevDetails) => {
      const permissions = checked
        ? [...prevDetails.permissions, value]
        : prevDetails.permissions.filter((permission) => permission !== value);
      return { ...prevDetails, permissions };
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
    setEditIndex(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClearSelection = () => {
    setRoleDetails({ ...roleDetails, selectedSubModules: [] });
  };

  




// const handleAddRole = async () => {
//   try {
//       const response = await api.post('api/userrole/role-based-user/', {
//           role: roleDetails.roleName,
//           user_name: roleDetails.userName,
//           modules: roleDetails.selectedSubModules.map((name) => ({ name })), 
//           is_active: roleDetails.status === "Active",
//       });

//       console.log("Added successfully:", response.data);

//       // Reset form after adding
//       handleClose();
//   } catch (error) {
//       console.error("Error adding role:", error);
//   }
// };




const handleUpdateRole = async () => {
  if (editIndex === null) {
      console.warn("Update button clicked but editIndex is null.");
      return; 
  }

  try {
      const response = await api.put(`api/userrole/role-based-user/${roleDetails.userName}/update/`, {
          role: roleDetails.roleName,
          user_name: roleDetails.userName,
          modules: roleDetails.selectedSubModules.map((name) => ({ name })), 
          is_active: roleDetails.status === "Active",
      });

      console.log("Updated successfully:", response.data);

      // Reset state after update
      handleClose();
  } catch (error) { // ✅ Add a catch block to handle errors
      console.error("Error updating role:", error);
  }
};



  

  const handleDeleteConfirmation = (index) => {
    setDeleteIndex(index);
    setConfirmDeleteOpen(true);
  };

  

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('api/userrole/role-based-user/all');
        if (response.data.success) {
          setRoleList(response.data.data);
        } else {
          console.error("Failed to fetch roles:", response.data.error);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
  
    fetchRoles();
  }, []);
  



const handleModuleChange = (event) => {
  const { value } = event.target;
  setRoleDetails((prev) => ({
      ...prev,
      selectedSubModules: typeof value === "string" ? value.split(",") : value, // Ensure array format
  }));
};




const handleEdit = async (index) => {
  const userName = roleList[index].user_name; // Get the user name

  try {
      const response = await api.get(`api/userrole/role-based-user/${userName}/`);
      const fetchedData = response.data.data; // ✅ Ensure correct data path

      setRoleDetails({
          roleName: fetchedData.role || "",  // ✅ Ensure the correct key
          userName: fetchedData.user_name || "", // ✅ Ensure correct key
          selectedSubModules: fetchedData.modules 
              ? fetchedData.modules.map((module) => module.name)  // ✅ Extract names correctly
              : [],
          status: fetchedData.is_active ? "Active" : "Inactive", // ✅ Ensure boolean mapping
      });

      setEditIndex(index); // ✅ Set index for update
      setOpen(true); // ✅ Open modal to show data
  } catch (error) {
      console.error("Error fetching role data:", error);
  }
};
// const handleDelete = async () => {
//   try {
//       if (!roleDetails.userName) {
//           console.error("⚠ No user selected for deletion");
//           return;
//       }

//       console.log("🗑 Deleting user:", roleDetails.userName);

//       await api.delete(`api/userrole/role-based-user/${roleDetails.userName}/delete/`);
      
//       console.log("✅ User deleted successfully");

//       // Close delete confirmation modal
//       setConfirmDeleteOpen(false);

//       // Reset roleDetails state
//       setRoleDetails({
//           roleName: "",
//           userName: "",
//           selectedSubModules: [],
//           status: "Active",
//       });

//   } catch (error) {
//       console.error("❌ Error deleting user:", error);
//   }
// };



  

  return (
    <Box sx={{ maxWidth: '100%', padding: 2 }}>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        {editIndex !== null ? 'Edit Role' : 'Add Role'}
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: '#f9dff5' }}>
          {editIndex !== null ? 'Edit Role' : 'Add Role'}
        </DialogTitle>
        <DialogContent style={{ backgroundColor: '#f9dff5' }}>
          <Paper sx={{ padding: '10px', backgroundColor: '#f9dff5' }} elevation={0}>
            <form>
              {/* Role Name (Select box) */}
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Role Name</InputLabel>
                <Select
                  value={roleDetails.roleName}
                  name="roleName"
                  onChange={handleChange}
                  label="Role Name"
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Salesperson">Salesperson</MenuItem>
                </Select>
              </FormControl>

              {/* User Name (TextField) */}
              <TextField
                fullWidth
                label="User Name"
                name="userName"
                value={roleDetails.userName}
                onChange={handleChange}
                margin="normal"
                required
              />


<FormControl fullWidth margin="normal" required>
  <InputLabel>Select Module</InputLabel>
  <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
    <Select
      multiple
      value={roleDetails.selectedSubModules}
      onChange={handleModuleChange}
      name="selectedSubModules"
      label="Select Module"
      renderValue={(selected) => selected.join(", ")}
      sx={{ width: "100%", pr: 5 }} // Ensure padding for Clear Icon
    >
      {modules.map((module) => (
        <MenuItem key={module.id} value={module.name}>
          <Checkbox checked={roleDetails.selectedSubModules.includes(module.name)} />
          {module.name}
        </MenuItem>
      ))}

      {modules.flatMap((module) =>
        module.children?.flatMap((subModule) =>
          subModule.children?.flatMap((thirdLevelChild) => [
            <MenuItem key={thirdLevelChild.id} value={thirdLevelChild.name} sx={{ pl: 2 }}>
              <Checkbox checked={roleDetails.selectedSubModules.includes(thirdLevelChild.name)} />
              {thirdLevelChild.name}
            </MenuItem>,
            thirdLevelChild.children?.map((fourthLevelChild) => (
              <MenuItem key={fourthLevelChild.id} value={fourthLevelChild.name} sx={{ pl: 4 }}>
                <Checkbox checked={roleDetails.selectedSubModules.includes(fourthLevelChild.name)} />
                └ {fourthLevelChild.name}
              </MenuItem>
            )),
          ])
        )
      )}
    </Select>

    {/* Clear (X) Button */}
    {roleDetails.selectedSubModules.length > 0 && (
      <IconButton
        size="small"
        onClick={() => setRoleDetails({ ...roleDetails, selectedSubModules: [] })}
        sx={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "white",
          zIndex: 10,
          pointerEvents: "auto",
        }}
      >
        <ClearIcon />
      </IconButton>
    )}
  </Box>
</FormControl>

              {/* Status (Radio button) */}
              {/* <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Status</FormLabel>
                <RadioGroup
                  name="status"
                  value={roleDetails.status}
                  onChange={handleChange}
                >
                  <FormControlLabel value="Active" control={<Radio />} label="Active" />
                  <FormControlLabel value="Inactive" control={<Radio />} label="Inactive" />
                </RadioGroup>
              </FormControl> */}
            </form>
          </Paper>
        </DialogContent>
        <DialogActions style={{ backgroundColor: '#f9dff5' }}>
          <Button onClick={handleClose} color="error">Cancel</Button>
          {/* <Button onClick={handleAddOrUpdate} color="secondary">
            {editIndex !== null ? 'Update' : 'Add'}
          </Button> */}
          <Button onClick={handleAddRole} color="secondary">
    Add
</Button>

<Button onClick={handleUpdateRole} color="secondary" disabled={editIndex === null}>
    UPDATE
</Button>


        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Role Name</TableCell>
        <TableCell>User Name</TableCell>
        <TableCell>Modules & Sub-Modules</TableCell>
        {/* <TableCell>Status</TableCell> */}
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {roleList.map((role, index) => (
        <TableRow key={index}>
          <TableCell>{role.role}</TableCell>
          <TableCell>{role.user_name}</TableCell>
          <TableCell>
            {role.modules.map((module, idx) => (
              <div key={idx}>
                <strong>{module.name}</strong>
                {module.sub_modules && module.sub_modules.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {module.sub_modules.map((sub, subIdx) => (
                      <li key={subIdx}>{sub.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </TableCell>
          {/* <TableCell>
            <span
              style={{
                color: role.is_active ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {role.is_active ? "Active" : "Inactive"}
            </span>
          </TableCell> */}
          <TableCell>
            <IconButton color="secondary" onClick={() => handleEdit(index)}>
              <Edit />
            </IconButton>
            
            <IconButton color="error"
    onClick={() => {
        setRoleDetails({ 
            ...roleDetails, 
            userName: roleList[index].user_name  // ✅ Get user_name from roleList
        });  
        setConfirmDeleteOpen(true);  // ✅ Open confirmation modal
    }}
>
    <Delete />
</IconButton>


          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>



      {/* Confirmation Dialog for Delete */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this role?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="secondary">
            Cancel
          </Button>
          {/* <Button onClick={handleDelete} color="error">
            Delete
          </Button> */}
          <Button onClick={handleDelete} color="error">
    Delete
</Button>

        </DialogActions>
      </Dialog>
    </Box>
  );
}














