// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import { Provider } from 'react-redux'; // Import Provider from react-redux
// import { ConfigProvider } from './contexts/ConfigContext';
// import './index.scss';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import store from './store';

// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(
//   <Provider store={store}> {/* Wrap ConfigProvider in Provider */}
//     <ConfigProvider>
//       <App />
//     </ConfigProvider>
//   </Provider>
// );

// reportWebVitals();



import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; 
import { HashRouter } from 'react-router-dom'; 
import { ConfigProvider } from './contexts/ConfigContext';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <ConfigProvider>
      <HashRouter> 
        <App />
      </HashRouter>
    </ConfigProvider>
  </Provider>
);

reportWebVitals();
