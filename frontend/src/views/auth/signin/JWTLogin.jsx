

// import React, { useState } from 'react';
// import { Row, Col, Alert, Button } from 'react-bootstrap';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { setUserInfo } from '../../../store';
// import { login } from '../../../auth';

// const JWTLogin = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [loginMessage, setLoginMessage] = useState(null);

//   return (
//     <div style={{ 
//       backgroundColor: '#d8dede', 
//       backgroundImage: 'linear-gradient(315deg, #d8dede 0%, #e5bdf6 74%)' 
//     }}>
//       <Formik
//         initialValues={{ username: '', password: '' }}
//         validationSchema={Yup.object().shape({
//           username: Yup.string().max(255).required('Username is required'),
//           password: Yup.string().max(255).required('Password is required')
//         })}
//         onSubmit={async (values, { setSubmitting, setErrors }) => {
//           try {
//             const response = await login(values.username, values.password);

//             if (response) {
//               const { msg, user, Token } = response;
//               const { access, refresh } = Token;

//               dispatch(setUserInfo(user));

//               localStorage.setItem('accessToken', access);
//               localStorage.setItem('refreshToken', refresh);

//               setLoginMessage(msg);

//               navigate('/app/dashboard/default',{ state: { userInfo: user } } ); // Redirect to dashboard
//               setTimeout(() => {
//                 console.log('User Info:', user);
//               }, 500);
//             } else {
//               setErrors({ submit: 'Invalid username or password.' });
//             }
//           } catch (error) {
//             setErrors({ submit: 'Login failed. Please check your credentials.' });
//           } finally {
//             setSubmitting(false);
//           }
//         }}
//       >
//         {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
//           <form noValidate onSubmit={handleSubmit}>
//             {loginMessage && <Alert variant="success">{loginMessage}</Alert>}
//             {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}

//             <div className="form-group mb-3">
//               <label htmlFor="username">Username</label>
//               <input
//                 className="form-control"
//                 id="username"
//                 name="username"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 type="text"
//                 value={values.username}
//               />
//               {touched.username && errors.username && <small className="text-danger">{errors.username}</small>}
//             </div>

//             <div className="form-group mb-4">
//               <label htmlFor="password">Password</label>
//               <input
//                 className="form-control"
//                 id="password"
//                 name="password"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 type="password"
//                 value={values.password}
//               />
//               {touched.password && errors.password && <small className="text-danger">{errors.password}</small>}
//             </div>

//             <Row>
//               <Col>
//                 <Button
//                   className="btn-block mb-4"
//                   style={{ backgroundColor: '#6f1d99', borderColor: '#6f1d99' }}
//                   disabled={isSubmitting}
//                   type="submit"
//                 >
//                   Sign In
//                 </Button>
//               </Col>
//             </Row>
//           </form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default JWTLogin;


// import React, { useState } from 'react';
// import { Row, Col, Alert, Button } from 'react-bootstrap';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { setUserInfo } from '../../../store';
// import { login } from '../../../auth';

// const JWTLogin = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [loginMessage, setLoginMessage] = useState(null);

//   return (
//     <div style={{ 
//       backgroundColor: '#d8dede', 
//       backgroundImage: 'linear-gradient(315deg, #d8dede 0%, #e5bdf6 74%)' 
//     }}>
//       <Formik
//         initialValues={{ username: '', password: '' }}
//         validationSchema={Yup.object().shape({
//           username: Yup.string().max(255).required('Username is required'),
//           password: Yup.string().max(255).required('Password is required')
//         })}
//         onSubmit={async (values, { setSubmitting, setErrors }) => {
//           try {
//             const response = await login(values.username, values.password);

//             if (response) {
//               const { msg, user, Token } = response;
//               const { access, refresh } = Token;

//               dispatch(setUserInfo(user));

//               localStorage.setItem('accessToken', access);
//               localStorage.setItem('refreshToken', refresh);

//               setLoginMessage(msg);
//               const redirectUrl = user.is_admin 
//   ? '/garmentproject/#/app/dashboard/default' 
//   : getFirstAccessibleModuleUrl(user.modules, user.is_admin);
// navigate(redirectUrl, { state: { userInfo: user } });


//               // navigate('/app/dashboard/default',{ state: { userInfo: user } } ); // Redirect to dashboard
//               setTimeout(() => {
//                 console.log('User Info:', user);
//               }, 500);
//             } else {
//               setErrors({ submit: 'Invalid username or password.' });
//             }
//           } catch (error) {
//             setErrors({ submit: 'Login failed. Please check your credentials.' });
//           } finally {
//             setSubmitting(false);
//           }
//         }}
//       >
//         {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
//           <form noValidate onSubmit={handleSubmit}>
//             {loginMessage && <Alert variant="success">{loginMessage}</Alert>}
//             {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}

//             <div className="form-group mb-3">
//               <label htmlFor="username">Username</label>
//               <input
//                 className="form-control"
//                 id="username"
//                 name="username"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 type="text"
//                 value={values.username}
//               />
//               {touched.username && errors.username && <small className="text-danger">{errors.username}</small>}
//             </div>

//             <div className="form-group mb-4">
//               <label htmlFor="password">Password</label>
//               <input
//                 className="form-control"
//                 id="password"
//                 name="password"
//                 onBlur={handleBlur}
//                 onChange={handleChange}
//                 type="password"
//                 value={values.password}
//               />
//               {touched.password && errors.password && <small className="text-danger">{errors.password}</small>}
//             </div>

//             <Row>
//               <Col>
//                 <Button
//                   className="btn-block mb-4"
//                   style={{ backgroundColor: '#6f1d99', borderColor: '#6f1d99' }}
//                   disabled={isSubmitting}
//                   type="submit"
//                 >
//                   Sign In
//                 </Button>
//               </Col>
//             </Row>
//           </form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default JWTLogin;





import React, { useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../../store';
import { login } from '../../../auth';
import { redirectToAdminDashboard, redirectToNonAdminModule } from '../../../menu-items';


const JWTLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginMessage, setLoginMessage] = useState(null);

  return (
    <div style={{ 
      backgroundColor: '#d8dede', 
      backgroundImage: 'linear-gradient(315deg, #d8dede 0%, #e5bdf6 74%)' 
    }}>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required('Username is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const response = await login(values.username, values.password);

//             if (response) {
//               const { msg, user, Token } = response;
//               const { access, refresh } = Token;

//               dispatch(setUserInfo(user));

//               localStorage.setItem('accessToken', access);
//               localStorage.setItem('refreshToken', refresh);

//               setLoginMessage(msg);
//               const redirectUrl = user.is_admin 
//   ? '/garmentproject/#/app/dashboard/default' 
//   : getFirstAccessibleModuleUrl(user.modules, user.is_admin);
// navigate(redirectUrl, { state: { userInfo: user } });


//               // navigate('/app/dashboard/default',{ state: { userInfo: user } } ); // Redirect to dashboard
//               setTimeout(() => {
//                 console.log('User Info:', user);
//               }, 500);
//             } else {
//               setErrors({ submit: 'Invalid username or password.' });
//             }
if (response) {
  const { msg, user, Token } = response;
  const { access, refresh } = Token;

  dispatch(setUserInfo(user));
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);

  setLoginMessage(msg);

  // Use the appropriate redirection based on role:
  if (user.is_admin) {
    redirectToAdminDashboard();
  } else {
    redirectToNonAdminModule(user);
  }

  setTimeout(() => {
    console.log('User Info:', user);
  }, 500);
} else {
  setErrors({ submit: 'Invalid username or password.' });
}

          } catch (error) {
            setErrors({ submit: 'Login failed. Please check your credentials.' });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            {loginMessage && <Alert variant="success">{loginMessage}</Alert>}
            {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}

            <div className="form-group mb-3">
              <label htmlFor="username">Username</label>
              <input
                className="form-control"
                id="username"
                name="username"
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={values.username}
              />
              {touched.username && errors.username && <small className="text-danger">{errors.username}</small>}
            </div>

            <div className="form-group mb-4">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                id="password"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
              />
              {touched.password && errors.password && <small className="text-danger">{errors.password}</small>}
            </div>

            <Row>
              <Col>
                <Button
                  className="btn-block mb-4"
                  style={{ backgroundColor: '#6f1d99', borderColor: '#6f1d99' }}
                  disabled={isSubmitting}
                  type="submit"
                >
                  Sign In
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default JWTLogin;
