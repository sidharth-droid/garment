// import React, { useEffect, useState } from 'react';
// import { Row, Col, Card, ProgressBar, Modal, Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
// import { FaChartLine, FaCalendarDay, FaCalendarAlt } from 'react-icons/fa';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import api from "../../api";

// const apiEndpoints = [
//   { key: 'daily', title: 'Daily Sales Report', url: '/api/retailsale/dailysales/' },
//   { key: 'monthly', title: 'Monthly Sales Report', url: '/api/retailsale/monthlysales/' },
//   { key: 'yearly', title: 'Yearly Sales Report', url: '/api/retailsale/yearlysales/' },
// ];

// const DashDefault = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState(null);

//   const targets = {
//     daily: 500,
//     monthly: 1000,
//     yearly: 700,
//   };

//      useEffect(() => {
//     const fetchSalesData = async () => {
//       try {
//         const responses = await Promise.all(
//           apiEndpoints.map(async (endpoint) => {
//             const res = await api.get(endpoint.url);

//             if (endpoint.key === 'daily') {
//               const { title, current_date, current_day_sales, all_sales } = res.data;
//               const salesInfo = current_day_sales && current_day_sales[0]
//                 ? current_day_sales[0]
//                 : { total_amount: '0', total_units: 0 };

//               return {
//                 key: endpoint.key,
//                 title: title || endpoint.title,
//                 date: current_date || 'N/A',
//                 total_amount: parseFloat(salesInfo.total_amount),
//                 total_units: salesInfo.total_units,
//                 all_sales: all_sales || []
//               };
//             } else if (endpoint.key === 'monthly') {
//               const { title, current_month, current_month_sales, all_sales } = res.data;
//               const salesInfo = current_month_sales && current_month_sales[0]
//                 ? current_month_sales[0]
//                 : { total_amount: '0', total_units: 0 };

//               return {
//                 key: endpoint.key,
//                 title: title || endpoint.title,
//                 month: current_month || 'N/A',
//                 total_amount: parseFloat(salesInfo.total_amount),
//                 total_units: salesInfo.total_units,
//                 all_sales: all_sales || []
//               };
//             } else if (endpoint.key === 'yearly') {
//               const { title, current_year, current_year_sales, all_sales } = res.data;
//               const salesInfo = current_year_sales && current_year_sales[0]
//                 ? current_year_sales[0]
//                 : { total_amount: '0', total_units: 0 };

//               return {
//                 key: endpoint.key,
//                 title: title || endpoint.title,
//                 year: current_year || 'N/A',
//                 total_amount: parseFloat(salesInfo.total_amount),
//                 total_units: salesInfo.total_units,
//                 all_sales: all_sales || []
//               };
//             }

//             return {};
//           })
//         );
//         setSalesData(responses);
//       } catch (error) {
//         console.error('Error fetching sales data:', error);
//       }
//     };

//     fetchSalesData();
//   }, []);

//   const handleProgressClick = (data) => {
//     setModalData(data);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.text(`${modalData.title}`, 14, 10);
//     autoTable(doc, {
//       startY: 20,
//       head: [[modalData.key === 'daily' ? 'Date' : modalData.key === 'monthly' ? 'Month' : 'Year', 'Sale Type', 'Total Amount', 'Total Units']],
//       body: modalData.all_sales.map(sale => [
//         modalData.key === 'daily' ? sale.date : modalData.key === 'monthly' ? sale.month : sale.year,
//         sale.sale_type,
//         `${parseFloat(sale.total_amount).toLocaleString('en-IN')}`,
//         sale.total_units
//       ])
//     });
//     doc.save(`${modalData.title}.pdf`);
//   };

//   return (
//     <React.Fragment>
//       <Row>
//         {salesData.map((data, index) => {
//           const progress = Math.min((data.total_amount / targets[data.key]) * 100, 100);
//           const progressBarVariant = progress < 50 ? 'danger' : progress < 75 ? 'warning' : progress < 100 ? 'primary' : 'success';
//           const iconColor = data.key === 'daily' ? '#1976D2' : data.key === 'monthly' ? '#388E3C' : '#FBC02D';
//           const icon = data.key === 'daily' ? <FaCalendarDay size={24} color={iconColor} /> : data.key === 'monthly' ? <FaCalendarAlt size={24} color={iconColor} /> : <FaChartLine size={24} color={iconColor} />;
//           const cardBg = data.key === 'daily' ? 'linear-gradient(to right, #E3F2FD, #BBDEFB)' : data.key === 'monthly' ? 'linear-gradient(to right, #E8F5E9, #C8E6C9)' : 'linear-gradient(to right, #FFF9C4, #FFF59D)';
//           return (
//             <Col key={index} xl={6} xxl={4}>
//               <Card style={{ background: cardBg, border: 'none', borderRadius: '10px', padding: '10px' }}>
//                 <Card.Body>
//                   <h5>{icon} {data.title}</h5>
//                   <p>{data.key === 'daily' ? `Date: ${data.date}` : data.key === 'monthly' ? `Month: ${data.month}` : `Year: ${data.year}`}</p>
//                   <p>Total Amount: <strong>₹{data.total_amount.toLocaleString('en-IN')}</strong></p>
//                   <p>Total Units: <strong>{data.total_units}</strong></p>
//                   <OverlayTrigger placement="top" overlay={<Tooltip>Click to view details</Tooltip>}>
//                     <ProgressBar now={progress} label={`${progress.toFixed(1)}%`} variant={progressBarVariant} style={{ cursor: 'pointer' }} onClick={() => handleProgressClick(data)} />
//                   </OverlayTrigger>
//                 </Card.Body>
//               </Card>
//             </Col>
//           );
//         })}
//       </Row>

//       {modalData && (
//         <Modal show={showModal} onHide={handleCloseModal} size="lg">
//           <Modal.Header closeButton>
//             <Modal.Title>{modalData.title}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th>{modalData.key === 'daily' ? 'Date' : modalData.key === 'monthly' ? 'Month' : 'Year'}</th>
//                   <th>Sale Type</th>
//                   <th>Total Amount</th>
//                   <th>Total Units</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {modalData.all_sales.map((sale, index) => (
//                   <tr key={index}>
//                     <td>{modalData.key === 'daily' ? sale.date : modalData.key === 'monthly' ? sale.month : sale.year}</td>
//                     <td>{sale.sale_type}</td>
//                     <td>₹{parseFloat(sale.total_amount).toLocaleString('en-IN')}</td>
//                     <td>{sale.total_units}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="primary" onClick={handleDownloadPDF}>Download PDF</Button>
//             <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//     </React.Fragment>
//   );
// };

// export default DashDefault;







import React, { useEffect, useState } from 'react';
import { Row, Col, Card, ProgressBar, Modal, Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaChartLine, FaCalendarDay, FaCalendarAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from "../../api";

const apiEndpoints = [
  { key: 'daily', title: 'Daily Sales Report', url: '/api/retailsale/dailysales/' },
  { key: 'monthly', title: 'Monthly Sales Report', url: '/api/retailsale/monthlysales/' },
  { key: 'yearly', title: 'Yearly Sales Report', url: '/api/retailsale/yearlysales/' },
];

const DashDefault = () => {
  const [salesData, setSalesData] = useState([]);
  const [targets, setTargets] = useState({ daily: 0, monthly: 0, yearly: 0 });
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Fetch dynamic targets from the backend API
  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const res = await api.get('/api/salestarget/salestargets/');
        setTargets(res.data);
      } catch (error) {
        console.error('Error fetching sales targets:', error);
      }
    };

    fetchTargets();
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const responses = await Promise.all(
          apiEndpoints.map(async (endpoint) => {
            const res = await api.get(endpoint.url);

            if (endpoint.key === 'daily') {
              const { title, current_date, current_day_sales, all_sales } = res.data;
              const salesInfo = current_day_sales && current_day_sales[0]
                ? current_day_sales[0]
                : { total_amount: '0', total_units: 0 };

              return {
                key: endpoint.key,
                title: title || endpoint.title,
                date: current_date || 'N/A',
                total_amount: parseFloat(salesInfo.total_amount),
                total_units: salesInfo.total_units,
                all_sales: all_sales || []
              };
            } else if (endpoint.key === 'monthly') {
              const { title, current_month, current_month_sales, all_sales } = res.data;
              const salesInfo = current_month_sales && current_month_sales[0]
                ? current_month_sales[0]
                : { total_amount: '0', total_units: 0 };

              return {
                key: endpoint.key,
                title: title || endpoint.title,
                month: current_month || 'N/A',
                total_amount: parseFloat(salesInfo.total_amount),
                total_units: salesInfo.total_units,
                all_sales: all_sales || []
              };
            } else if (endpoint.key === 'yearly') {
              const { title, current_year, current_year_sales, all_sales } = res.data;
              const salesInfo = current_year_sales && current_year_sales[0]
                ? current_year_sales[0]
                : { total_amount: '0', total_units: 0 };

              return {
                key: endpoint.key,
                title: title || endpoint.title,
                year: current_year || 'N/A',
                total_amount: parseFloat(salesInfo.total_amount),
                total_units: salesInfo.total_units,
                all_sales: all_sales || []
              };
            }

            return {};
          })
        );
        setSalesData(responses);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, []);

  const handleProgressClick = (data) => {
    setModalData(data);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`${modalData.title}`, 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [[modalData.key === 'daily' ? 'Date' : modalData.key === 'monthly' ? 'Month' : 'Year', 'Sale Type', 'Total Amount', 'Total Units']],
      body: modalData.all_sales.map(sale => [
        modalData.key === 'daily' ? sale.date : modalData.key === 'monthly' ? sale.month : sale.year,
        sale.sale_type,
        `${parseFloat(sale.total_amount).toLocaleString('en-IN')}`,
        sale.total_units
      ])
    });
    doc.save(`${modalData.title}.pdf`);
  };

  return (
    <React.Fragment>
      <Row>
        {salesData.map((data, index) => {
          // Use dynamically fetched target for progress calculations.
          const targetValue = targets[data.key] || 0;
          const progress = targetValue ? Math.min((data.total_amount / targetValue) * 100, 100) : 0;
          const progressBarVariant = progress < 50 ? 'danger' : progress < 75 ? 'warning' : progress < 100 ? 'primary' : 'success';
          const iconColor = data.key === 'daily' ? '#1976D2' : data.key === 'monthly' ? '#388E3C' : '#FBC02D';
          const icon = data.key === 'daily' ? <FaCalendarDay size={24} color={iconColor} /> : data.key === 'monthly' ? <FaCalendarAlt size={24} color={iconColor} /> : <FaChartLine size={24} color={iconColor} />;
          const cardBg = data.key === 'daily' ? 'linear-gradient(to right, #E3F2FD, #BBDEFB)' : data.key === 'monthly' ? 'linear-gradient(to right, #E8F5E9, #C8E6C9)' : 'linear-gradient(to right, #FFF9C4, #FFF59D)';
          return (
            <Col key={index} xl={6} xxl={4}>
              <Card style={{ background: cardBg, border: 'none', borderRadius: '10px', padding: '10px' }}>
                <Card.Body>
                  <h5>{icon} {data.title}</h5>
                  <p>{data.key === 'daily' ? `Date: ${data.date}` : data.key === 'monthly' ? `Month: ${data.month}` : `Year: ${data.year}`}</p>
                  <p>Total Amount: <strong>₹{data.total_amount.toLocaleString('en-IN')}</strong></p>
                  <p>Total Units: <strong>{data.total_units}</strong></p>
                  {targetValue ? (
                    <OverlayTrigger placement="top" overlay={<Tooltip>Click to view details</Tooltip>}>
                      <ProgressBar now={progress} label={`${progress.toFixed(1)}%`} variant={progressBarVariant} style={{ cursor: 'pointer' }} onClick={() => handleProgressClick(data)} />
                    </OverlayTrigger>
                  ) : (
                    <p>Loading targets...</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {modalData && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{modalData.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>{modalData.key === 'daily' ? 'Date' : modalData.key === 'monthly' ? 'Month' : 'Year'}</th>
                  <th>Sale Type</th>
                  <th>Total Amount</th>
                  <th>Total Units</th>
                </tr>
              </thead>
              <tbody>
                {modalData.all_sales.map((sale, index) => (
                  <tr key={index}>
                    <td>{modalData.key === 'daily' ? sale.date : modalData.key === 'monthly' ? sale.month : sale.year}</td>
                    <td>{sale.sale_type}</td>
                    <td>₹{parseFloat(sale.total_amount).toLocaleString('en-IN')}</td>
                    <td>{sale.total_units}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleDownloadPDF}>Download PDF</Button>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default DashDefault;
