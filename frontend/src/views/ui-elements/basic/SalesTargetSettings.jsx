// import React, { useEffect, useState } from 'react';
// import { Card, Button, Modal, Form } from 'react-bootstrap';
// import api from "../../../api";

// const SalesTargetSettings = () => {
//   const [targets, setTargets] = useState({ daily: 0, monthly: 0, yearly: 0 });
//   const [showModal, setShowModal] = useState(false);
//   const [newTargets, setNewTargets] = useState({ daily: 0, monthly: 0, yearly: 0 });

//   useEffect(() => {
//     const fetchTargets = async () => {
//       try {
//         const res = await api.get('/api/retailsale/salestargets/');
//         setTargets(res.data);
//         setNewTargets(res.data);
//       } catch (error) {
//         console.error('Error fetching sales targets:', error);
//       }
//     };

//     fetchTargets();
//   }, []);

//   const handleChange = (e) => {
//     setNewTargets({ ...newTargets, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     try {
//       await api.put('/api/retailsale/salestargets/', newTargets);
//       setTargets(newTargets);
//       setShowModal(false);
//     } catch (error) {
//       console.error('Error updating sales targets:', error);
//     }
//   };

//   return (
//     <Card className="p-3">
//       <h4>Sales Targets</h4>
//       <p><strong>Daily Target:</strong> ₹{targets.daily.toLocaleString('en-IN')}</p>
//       <p><strong>Monthly Target:</strong> ₹{targets.monthly.toLocaleString('en-IN')}</p>
//       <p><strong>Yearly Target:</strong> ₹{targets.yearly.toLocaleString('en-IN')}</p>
//       <Button variant="primary" onClick={() => setShowModal(true)}>Edit Targets</Button>

//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Sales Targets</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Daily Target</Form.Label>
//               <Form.Control type="number" name="daily" value={newTargets.daily} onChange={handleChange} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Monthly Target</Form.Label>
//               <Form.Control type="number" name="monthly" value={newTargets.monthly} onChange={handleChange} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Yearly Target</Form.Label>
//               <Form.Control type="number" name="yearly" value={newTargets.yearly} onChange={handleChange} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
//           <Button variant="primary" onClick={handleSave}>Save Changes</Button>
//         </Modal.Footer>
//       </Modal>
//     </Card>
//   );
// };

// export default SalesTargetSettings;








import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import api from "../../../api";

const SalesTargetSettings = () => {
  const [targets, setTargets] = useState({ daily: 0, monthly: 0, yearly: 0 });
  const [showModal, setShowModal] = useState(false);
  const [newTargets, setNewTargets] = useState({ daily: 0, monthly: 0, yearly: 0 });

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        // Fetch using GET endpoint (ensure this URL is correct in your backend)
        const res = await api.get('/api/salestarget/salestargets/');
        setTargets(res.data);
        setNewTargets(res.data);
      } catch (error) {
        console.error('Error fetching sales targets:', error);
      }
    };

    fetchTargets();
  }, []);

  const handleChange = (e) => {
    setNewTargets({ ...newTargets, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Use the update endpoint here
      await api.put('/api/salestarget/salestargets/update/', newTargets);
      setTargets(newTargets);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating sales targets:', error);
    }
  };

  return (
    <Card className="p-3">
      <h4>Sales Targets</h4>
      <p><strong>Daily Target:</strong> ₹{targets.daily.toLocaleString('en-IN')}</p>
      <p><strong>Monthly Target:</strong> ₹{targets.monthly.toLocaleString('en-IN')}</p>
      <p><strong>Yearly Target:</strong> ₹{targets.yearly.toLocaleString('en-IN')}</p>
      <Button variant="primary" onClick={() => setShowModal(true)}>Edit Targets</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Sales Targets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Daily Target</Form.Label>
              <Form.Control 
                type="number" 
                name="daily" 
                value={newTargets.daily} 
                onChange={handleChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Monthly Target</Form.Label>
              <Form.Control 
                type="number" 
                name="monthly" 
                value={newTargets.monthly} 
                onChange={handleChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Yearly Target</Form.Label>
              <Form.Control 
                type="number" 
                name="yearly" 
                value={newTargets.yearly} 
                onChange={handleChange} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default SalesTargetSettings;
