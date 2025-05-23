import React from 'react';
import { Card} from 'react-bootstrap';
import { NavLink} from 'react-router-dom';

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

//import { CopyToClipboard } from 'react-copy-to-clipboard';

import AuthLogin from './JWTLogin';

const Signin1 = () => {
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <Card className="borderless text-center" style={{ 
  backgroundColor: '#d8dede', 
  backgroundImage: 'linear-gradient(315deg, #d8dede 0%, #e5bdf6 74%)', 
  borderRadius: '10px' 
}}>
            <Card.Body>
              <div className="mb-4">
                <i className="feather icon-unlock auth-icon" />
              </div>
              <AuthLogin />
              {/* <p className="mb-2 text-muted">
                Forgot password?{' '}
                <NavLink to={'#'} className="f-w-400">
                  Reset
                </NavLink>
              </p> */}
              {/* <p className="mb-0 text-muted">
                Don’t have an account?{' '}
                <NavLink to="/auth/signup-1" className="f-w-400">
                  Signup
                </NavLink>
              </p> */}
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
