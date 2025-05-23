
// NavLeft.jsx
import React, { useState } from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useWindowSize from '../../../../hooks/useWindowSize'; // adjust the path accordingly
import PrinterSetting from 'views/settingsmodule/printersetting'; // Import the PrinterSetting component
import UserRole from 'views/settingsmodule/Userrolesetting'; // Import the UserRole component
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon

const NavLeft = () => {
  const windowSize = useWindowSize();

  // Modal open/close state for Printer Settings and User Role
  const [printerOpen, setPrinterOpen] = useState(false);
  const [userRoleOpen, setUserRoleOpen] = useState(false);

  const handlePrinterOpen = () => {
    setPrinterOpen(true);
  };

  const handlePrinterClose = () => {
    setPrinterOpen(false);
  };

  const handleUserRoleOpen = () => {
    setUserRoleOpen(true);
  };

  const handleUserRoleClose = () => {
    setUserRoleOpen(false);
  };

  let navItemClass = ['nav-item'];
  if (windowSize.width <= 575) {
    navItemClass = [...navItemClass, 'd-none'];
  }

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav mr-auto">
        <ListGroup.Item as="li" bsPrefix=" " className={navItemClass.join(' ')}>
          <Dropdown align={'start'}>
            {/* <Dropdown.Toggle variant={'link'} id="dropdown-basic">
              SETTINGS
            </Dropdown.Toggle> */}
            <ul>
              <Dropdown.Menu>
                <li>
                  <Link to="#" className="dropdown-item" onClick={handlePrinterOpen}>
                    Printer Setting
                  </Link>
                </li>
                <li>
                  <Link to="#" className="dropdown-item" onClick={handleUserRoleOpen}>
                    Module Access
                  </Link>
                </li>
              </Dropdown.Menu>
            </ul>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>

      {/* Modal for Printer Settings */}
      <Dialog open={printerOpen} onClose={handlePrinterClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Printer Settings
          {/* Close Icon at the top-right corner */}
          <IconButton
            aria-label="close"
            onClick={handlePrinterClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <PrinterSetting /> {/* Display PrinterSetting component */}
        </DialogContent>
      </Dialog>

      {/* Modal for User Role */}
      <Dialog open={userRoleOpen} onClose={handleUserRoleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          User Role
          {/* Close Icon at the top-right corner */}
          <IconButton
            aria-label="close"
            onClick={handleUserRoleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <UserRole /> {/* Display UserRole component */}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default NavLeft;

