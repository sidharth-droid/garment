// import React, { useState } from 'react';
// import { Card, ListGroup, Dropdown } from 'react-bootstrap';
// import { Link } from 'react-router-dom';


// import ChatList from './ChatList';

// import avatar1 from '../../../../assets/images/user/avatar-1.jpg';


// const NavRight = () => {
//   const [listOpen, setListOpen] = useState(false);

 
//   return (
//     <React.Fragment>
//       <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        
//         <ListGroup.Item as="li" bsPrefix=" ">
//           <Dropdown align={'end'} className="drp-user">
//             <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
//               <i className="icon feather icon-settings" />
//             </Dropdown.Toggle>
//             <Dropdown.Menu align="end" className="profile-notification">
//               <div className="pro-head">
//                 <img src={avatar1} className="img-radius" alt="User Profile" />
//                 <span>John Doe</span>
//                 <Link to="#" className="dud-logout" title="Logout">
//                   <i className="feather icon-log-out" />
//                 </Link>
//               </div>
//               <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                
//                 <ListGroup.Item as="li" bsPrefix=" ">
//                   <Link to="#" className="dropdown-item">
//                     <i className="feather icon-user" /> Profile
//                   </Link>
//                 </ListGroup.Item>
//                 <ListGroup.Item as="li" bsPrefix=" ">
//                   <Link to="#" className="dropdown-item">
//                     <i className="feather icon-mail" /> My Messages
//                   </Link>
//                 </ListGroup.Item>
//                 <ListGroup.Item as="li" bsPrefix=" ">
//                   <Link to="#" className="dropdown-item">
//                     <i className="feather icon-lock" /> Lock Screen
//                   </Link>
//                 </ListGroup.Item>
//               </ListGroup>
//             </Dropdown.Menu>
//           </Dropdown>
//         </ListGroup.Item>
//       </ListGroup>
//       <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
//     </React.Fragment>
//   );
// };

// export default NavRight;








import React, { useState, useEffect } from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ChatList from './ChatList';
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import { getLoggedInUserInfo , logout} from '../../../../auth';

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const [userName, setUserName] = useState("Loading..."); // Default text

  useEffect(() => {
    const fetchUser = () => {
      try {
        const userData = getLoggedInUserInfo(); // ✅ Get from token
        console.log("User Data:", userData); // Debugging
        setUserName(userData?.user_id || "Unknown User"); // ✅ Use `user_id`
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserName("Guest"); // Fallback
      }
    };

    fetchUser();

    // Auto-refresh username when token changes
    const handleStorageChange = () => fetchUser();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    logout();
     // Redirect to login page
  };
    
  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align={'end'} className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <img src={avatar1} className="img-radius" alt="User Profile" />
                <span>{userName}</span>
                
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                
               
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/auth/signin-1" className="dropdown-item"onClick={handleLogout}>
                  <i className="feather icon-log-out" /> Log Out
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
