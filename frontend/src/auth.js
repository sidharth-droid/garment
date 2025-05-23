

import axios from 'axios';
import { API_BASE_URL } from "./constant";
import { jwtDecode } from "jwt-decode";

// Store tokens in localStorage
const storeToken = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);

  // ✅ Debugging: Print tokens after storing
  console.log("Stored Access Token:", accessToken);
  console.log("Stored Refresh Token:", refreshToken);
};

// Retrieve tokens from localStorage
const getToken = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // ✅ Debugging: Print retrieved tokens
  console.log("Retrieved Access Token:", accessToken);
  console.log("Retrieved Refresh Token:", refreshToken);

  return { accessToken, refreshToken };
};

// Remove tokens from localStorage
const removeToken = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  console.log("Tokens removed from storage.");
};

// Remove user-specific data from localStorage
const removeUserLocalStorage = () => {
  localStorage.removeItem('userRole');
  console.log("User data removed from storage.");
};

// User login
// const login = async (user_name, password) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/api/user/login/`, {
//       user_name,
//       password
//     });

//     const { access, refresh } = response.data;
//     storeToken(access, refresh);

//     // ✅ Debugging: Print login response
//     console.log("Login Successful. User Data:", response.data);

//     return response.data;
//   } catch (error) {
//     console.error("Login Error:", error);
//     throw error;
//   }
// };

const login = async (user_name, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/user/login/`, {
      user_name,
      password
    });

    const { access, refresh, user } = response.data;
    
    storeToken(access, refresh);  // Store tokens
    localStorage.setItem("userInfo", JSON.stringify(user)); // Store user info immediately
    window.dispatchEvent(new Event("userInfoUpdated")); // Notify other components

    console.log("Login Successful. User Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};


// User logout
// const logout = () => {
//   removeToken();
//   removeUserLocalStorage();
//   window.location = "/";
// };
const logout = () => {
  removeToken(); // Remove access & refresh tokens
  localStorage.removeItem("userInfo"); // Remove user role & permissions
  localStorage.removeItem("userRole"); // Remove any other user-related data
  
  // Dispatch event to update components
  window.dispatchEvent(new Event("userInfoUpdated"));

  console.log("All user data cleared. Logging out...");

  window.location = "/"; // Redirect to login or home page
};


// Get a new access token using refresh token
const getNewAccessToken = async () => {
  try {
    const { refreshToken } = getToken();
    if (!refreshToken) {
      console.warn("No refresh token found. Logging out...");
      logout();
      return;
    }

    const decodedRefreshToken = jwtDecode(refreshToken);
    if (decodedRefreshToken.exp < Date.now() / 1000) {
      console.warn("Refresh token expired. Logging out...");
      logout();
      return;
    }

    const response = await axios.post(`${API_BASE_URL}/api/user/token/`, {
      refresh: refreshToken
    });

    const newAccessToken = response.data.access;
    storeToken(newAccessToken, refreshToken);

    // ✅ Debugging: Print new access token
    console.log("New Access Token:", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error('Refresh token error:', error);
    logout();
  }
};

//Get logged-in user info from the JWT token
const getLoggedInUserInfo = () => {
  try {
    const { accessToken } = getToken();
    if (!accessToken) {
      console.error("No access token found.");
      return null;
    }

    const decodedToken = jwtDecode(accessToken);
    console.log("Decoded Token:", decodedToken); // Debugging output

    return { user_id: decodedToken.user_id 
    }; // Ensure this matches token structure
  } catch (error) {
    console.error("Error decoding user info:", error);
    return null;
  }
};




// Check if user is authenticated
const isUserAuthenticated = () => {
  const { accessToken } = getToken();
  if (!accessToken) return false;

  try {
    const decodedToken = jwtDecode(accessToken);
    return decodedToken.exp > Date.now() / 1000; // Token is valid if expiration is in the future
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};

export {
  login,
  logout,
  getNewAccessToken,
  getToken,
  removeToken,
  storeToken,
  getLoggedInUserInfo,
  isUserAuthenticated,
};
