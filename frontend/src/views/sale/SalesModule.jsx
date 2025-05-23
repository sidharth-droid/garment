import React, { useState } from 'react';
import RetailSale from './Retailsale';
import BulkSale from './Bulksale'; // Assuming you have a SaleReport component
import BulkSaleInvoice from './Bulksalereturn';



const SalesModule = () => {
  const [activeComponent, setActiveComponent] = useState('retailSale'); // Default component

  return (
    <div style={{ textAlign: 'center', marginTop:"-67px" }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveComponent('retailSale')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeComponent === 'retailSale' ? '#007bff' : '#ddd',
            color: activeComponent === 'retailSale' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Retail Sale
        </button>
        <button
          onClick={() => setActiveComponent('saleReport')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeComponent === 'saleReport' ? '#007bff' : '#ddd',
            color: activeComponent === 'saleReport' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Sale Report
        </button>
      </div>
      <div>
        {activeComponent === 'retailSale' && <RetailSale />}
        {activeComponent === 'saleReport' && <BulkSale/>}
      </div>
    </div>
  );
};

export default SalesModule;
