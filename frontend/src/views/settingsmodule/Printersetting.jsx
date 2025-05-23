
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  FormControl,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


const PrinterSetting = () => {
  const [printerSettings, setPrinterSettings] = useState({
    defaultPrinter: '',
    paperSize: '',
    printFormat: '',
    numberOfCopies: 1,
    margins: '',
    saveGlobally: false,
  });

  const [openPreview, setOpenPreview] = useState(false);
  const [customPrinters, setCustomPrinters] = useState([]);

  const handleChange = (e) => {
    setPrinterSettings({
      ...printerSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setPrinterSettings({
      ...printerSettings,
      [e.target.name]: e.target.checked,
    });
  };

  const handleAddPrinter = () => {
    if (printerSettings.defaultPrinter && !customPrinters.includes(printerSettings.defaultPrinter)) {
      setCustomPrinters([...customPrinters, printerSettings.defaultPrinter]);
      setPrinterSettings({ ...printerSettings, defaultPrinter: '' });
    }
  };

  const handleRemovePrinter = (printer) => {
    setCustomPrinters(customPrinters.filter(item => item !== printer));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Printer Settings:', printerSettings);
    console.log('Custom Printers:', customPrinters);
  };

  const handlePreviewOpen = () => {
    setOpenPreview(true);
  };

  const handlePreviewClose = () => {
    setOpenPreview(false);
  };

  return (
    <Box
      component="form"
      sx={{
        maxWidth: 600,
        mx: 'auto',
        p: 2,
        bgcolor: 'white', 
        color: 'purple',
        
      }}
      onSubmit={handleSubmit}
    >
      <Grid container spacing={2}>
        {/* Default Printer Input with Chip Display */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <TextField
              label="Add Printer"
              name="defaultPrinter"
              value={printerSettings.defaultPrinter}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <>
                    {customPrinters.map((printer, index) => (
                      <Chip
                        key={index}
                        label={printer}
                        onDelete={() => handleRemovePrinter(printer)}
                        sx={{ marginRight: '5px' }}
                      />
                    ))}
                  </>
                ),
              }}
            />
          </FormControl>
        </Grid>

        {/* Add Printer Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddPrinter}
            startIcon={<AddIcon />}
            fullWidth
          >
            Add Printer
          </Button>
        </Grid>

        {/* Paper Size Select */}
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <TextField
              label="Paper Size"
              name="paperSize"
              value={printerSettings.paperSize}
              onChange={handleChange}
              select
            >
              <MenuItem value="A4">A4</MenuItem>
              <MenuItem value="A5">A5</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </TextField>
          </FormControl>
        </Grid>

        {/* Print Format Select */}
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <TextField
              label="Print Format"
              name="printFormat"
              value={printerSettings.printFormat}
              onChange={handleChange}
              select
            >
              <MenuItem value="Portrait">Portrait</MenuItem>
              <MenuItem value="Landscape">Landscape</MenuItem>
            </TextField>
          </FormControl>
        </Grid>

        {/* Number of Copies */}
        <Grid item xs={12}>
          <TextField
            label="Number of Copies"
            name="numberOfCopies"
            type="number"
            fullWidth
            value={printerSettings.numberOfCopies}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>

        {/* Margins */}
        <Grid item xs={12}>
          <TextField
            label="Margins"
            name="margins"
            placeholder="e.g., 10px 15px 10px 15px"
            fullWidth
            value={printerSettings.margins}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>

        {/* Save Globally Checkbox */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="saveGlobally"
                checked={printerSettings.saveGlobally}
                onChange={handleCheckboxChange}
              />
            }
            label="Save configuration globally"
          />
        </Grid>

        {/* Save and Preview Buttons */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Save Settings
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
            onClick={handlePreviewOpen}
          >
            Preview
          </Button>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog open={openPreview} onClose={handlePreviewClose}>
        <DialogTitle>Preview Printer Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <strong>Default Printer:</strong> {customPrinters.join(', ')}
          </Typography>
          <Typography variant="body1">
            <strong>Paper Size:</strong> {printerSettings.paperSize}
          </Typography>
          <Typography variant="body1">
            <strong>Print Format:</strong> {printerSettings.printFormat}
          </Typography>
          <Typography variant="body1">
            <strong>Number of Copies:</strong> {printerSettings.numberOfCopies}
          </Typography>
          <Typography variant="body1">
            <strong>Margins:</strong> {printerSettings.margins}
          </Typography>
          <Typography variant="body1">
            <strong>Save Globally:</strong> {printerSettings.saveGlobally ? 'Yes' : 'No'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrinterSetting;
