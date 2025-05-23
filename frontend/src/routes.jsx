


// import React, { Suspense, Fragment, lazy } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';

// import Loader from './components/Loader/Loader';
// import AdminLayout from './layouts/AdminLayout';

// import { BASE_URL } from './config/constant';

// export const renderRoutes = (routes = []) => (
//   <Suspense fallback={<Loader />}>
//     <Routes>
//       {routes.map((route, i) => {
//         const Guard = route.guard || Fragment;
//         const Layout = route.layout || Fragment;
//         const Element = route.element;

//         return (
//           <Route
//             key={i}
//             path={route.path}
//             element={
//               <Guard>
//                 <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
//               </Guard>
//             }
//           />
//         );
//       })}
//     </Routes>
//   </Suspense>
// );

// const routes = [

//   {
//     exact: 'true',
//     path: '/login',
//     element: lazy(() => import('./views/auth/signin/SignIn1'))
//   },
//   {
//     exact: 'true',
//     path: '/auth/signin-1',
//     element: lazy(() => import('./views/auth/signin/SignIn1'))
//   },
//   {
//     exact: 'true',
//     path: '/auth/signup-1',
//     element: lazy(() => import('./views/auth/signup/SignUp1'))
//   },
//   {
//     path: '*',
//     layout: AdminLayout,
//     routes: [
//       {
//         exact: 'true',
//         path: '/app/dashboard/default',
//         element: lazy(() => import('./views/dashboard'))
//       },
//       {
//         exact: 'true',
//         path: '/basic/companydetails',
//         element: lazy(() => import('./views/ui-elements/basic/Companydetails'))
//       },
//       {
//         exact: 'true',
//         path: '/basic/catagorymaster',
//         element: lazy(() => import('./views/ui-elements/basic/Catagorymaster'))
//       },
//       {
//         exact: 'true',
//         path: '/basic/itemmaster',
//         element: lazy(() => import('./views/ui-elements/basic/Itemmaster'))
//       },
//       {
//         exact: 'true',
//         path: '/basic/purchasemaster',
//         element: lazy(() => import('./views/ui-elements/PurchaseDetails'))
//       },
     
//       {
//         exact: 'true',
//         path: '/basic/partydetails',
//         element: lazy(() => import('./views/ui-elements/basic/Partydetails'))
//       },
//       {
//         exact: 'true',
//         path: '/basic/taxdetails',
//         element: lazy(() => import('./views/ui-elements/basic/Taxdetails'))
//       },
//       {
//         exact: 'true',
//         path: '/basic/userdetails',
//         element: lazy(() => import('./views/ui-elements/basic/Userdetails'))
//       },
//       {
//         exact: 'true',
//         path: '/basic/financialyeardetails',
//         element: lazy(() => import('./views/ui-elements/basic/Financialyeardetails'))
//       },
//       {
//         exact: 'true',
//         path: '/basic/barcodedetails',
//         element: lazy(() => import('./views/ui-elements/BarcodeDetails'))
//       },
//       {
//         exact: 'true',

//         path: '/forms/Retailsales',
//         element: lazy(() => import('./views/sale/Retailsale'))
//       },
//       {
//         exact: 'true',

//         path: '/sale/Bulksale',
//         element: lazy(() => import('./views/sale/Bulksale'))
//       },
//       {
//         exact: 'true',

//         path: '/sale/bulksalereturn',
//         element: lazy(() => import('./views/sale/Bulksalereturn'))
//       },
//       {
//         exact: 'true',
//         path: '/sale/bulksalereturn',
//         element: lazy(() => import('./views/sale/Bulksalereturn'))
//       },
//       {
//         exact: 'true',
//         path: '/reports/salesreports',
//         element: lazy(() => import('./views/reports/salesreports'))
//       },
//       {
//         exact: 'true',
//         path: '/reports/salestaxreports',
//         element: lazy(() => import('./views/reports/SaletaxReport'))
//       },
//       {
//         exact: 'true',
//         path: '/reports/salesreports',
//         element: lazy(() => import('./views/reports/salesreports'))
//       },
      
      
//       {
//         exact: 'true',
//         path: '/reports/stockreport',
//         element: lazy(() => import('./views/reports/StockReport'))
//       },
//       {
//         exact: 'true',
//         path: '/reports/discountreport',
//         element: lazy(() => import('./views/reports/Discountreport'))
//       },
//       {
//         exact: 'true',
//         path: '/reports/customerreport',
//         element: lazy(() => import('./views/reports/Customerreport'))
//       },
      
//       {
//         exact: 'true',
//         path: '/reports/purchasereport',
//         element: lazy(() => import('./views/reports/purchasereport'))
//       },
//       {
//         exact: 'true',
//         path: '/setting/printer',
//         element: lazy(() => import('./views/settingsmodule/Printersetting'))
//       },
//       {
//         exact: 'true',
//         path: '/setting/module',
//         element: lazy(() => import('./views/settingsmodule/Userrolesetting'))
//       },
//       {
//         exact: 'true',
//         path: '/basic/financialtargetdetails',
//         element: lazy(() => import('./views/ui-elements/basic/SalesTargetSettings'))
//       },
      
      
      
//       {
//         path: '*',
//         exact: 'true',
//         element: () => <Navigate to={BASE_URL} />
//       }
//     ]
//   }
// ];

// export default routes;



import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import { BASE_URL } from './config/constant';
import { isUserAuthenticated } from './auth'; // Adjust the import path as needed

// Inline AuthGuard component
const AuthGuard = ({ children }) => {
  if (!isUserAuthenticated()) {
    // If user is not authenticated, redirect to login
    return <Navigate to="/auth/signin-1" replace />;
  }
  return children;
};

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;
        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>
                  {route.routes ? renderRoutes(route.routes) : <Element props={true} />}
                </Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  // Public Routes
  {
    exact: true,
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: true,
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: true,
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  // Protected Routes wrapped with AuthGuard
  {
    path: '*',
    guard: AuthGuard, // This guard will check for authentication
    layout: AdminLayout,
    routes: [
      {
        exact: true,
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: true,
        path: '/basic/companydetails',
        element: lazy(() => import('./views/ui-elements/basic/Companydetails'))
      },
      {
        exact: true,
        path: '/basic/catagorymaster',
        element: lazy(() => import('./views/ui-elements/basic/Catagorymaster'))
      },
      {
        exact: true,
        path: '/basic/itemmaster',
        element: lazy(() => import('./views/ui-elements/basic/Itemmaster'))
      },
      {
        exact: true,
        path: '/basic/purchasemaster',
        element: lazy(() => import('./views/ui-elements/PurchaseDetails'))
      },
      {
        exact: true,
        path: '/basic/partydetails',
        element: lazy(() => import('./views/ui-elements/basic/Partydetails'))
      },
      {
        exact: true,
        path: '/basic/taxdetails',
        element: lazy(() => import('./views/ui-elements/basic/Taxdetails'))
      },
      {
        exact: true,
        path: '/basic/userdetails',
        element: lazy(() => import('./views/ui-elements/basic/Userdetails'))
      },
      {
        exact: true,
        path: '/basic/financialyeardetails',
        element: lazy(() => import('./views/ui-elements/basic/Financialyeardetails'))
      },
      {
        exact: true,
        path: '/basic/barcodedetails',
        element: lazy(() => import('./views/ui-elements/BarcodeDetails'))
      },
      {
        exact: true,
        path: '/forms/Retailsales',
        element: lazy(() => import('./views/sale/Retailsale'))
      },
      {
        exact: true,
        path: '/sale/Bulksale',
        element: lazy(() => import('./views/sale/Bulksale'))
      },
      {
        exact: true,
        path: '/sale/bulksalereturn',
        element: lazy(() => import('./views/sale/Bulksalereturn'))
      },
      {
        exact: true,
        path: '/reports/salesreports',
        element: lazy(() => import('./views/reports/salesreports'))
      },
      {
        exact: true,
        path: '/reports/salestaxreports',
        element: lazy(() => import('./views/reports/SaletaxReport'))
      },
      {
        exact: true,
        path: '/reports/stockreport',
        element: lazy(() => import('./views/reports/StockReport'))
      },
      {
        exact: true,
        path: '/reports/discountreport',
        element: lazy(() => import('./views/reports/Discountreport'))
      },
      {
        exact: true,
        path: '/reports/customerreport',
        element: lazy(() => import('./views/reports/Customerreport'))
      },
      {
        exact: true,
        path: '/reports/purchasereport',
        element: lazy(() => import('./views/reports/purchasereport'))
      },
      {
        exact: true,
        path: '/setting/printer',
        element: lazy(() => import('./views/settingsmodule/Printersetting'))
      },
      {
        exact: true,
        path: '/setting/module',
        element: lazy(() => import('./views/settingsmodule/Userrolesetting'))
      },
      {
        exact: true,
        path: '/basic/financialtargetdetails',
        element: lazy(() => import('./views/ui-elements/basic/SalesTargetSettings'))
      },
      {
        path: '*',
        exact: true,
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;


