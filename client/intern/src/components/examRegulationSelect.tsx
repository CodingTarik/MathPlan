// Importing necessary hooks and utilities from React and Axios
import { useState, useEffect } from 'react'; // React's useState and useEffect hooks
import axios, { AxiosResponse } from 'axios'; // Axios for making HTTP requests

// Importing necessary icons from Material UI
import SearchIcon from '@mui/icons-material/Search'; // Icon for search functionality
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Icon for expand functionality
import DeleteIcon from '@mui/icons-material/Delete'; // Icon for delete functionality
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'; // Icon for download functionality

// Importing necessary components and utilities from Material UI
import {
  Accordion,
  Typography,
  Box,
  Button,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  IconButton,
  TablePagination,
  TextField,
  DialogContentText
} from '@mui/material'; // Material UI components for UI design
import { Refresh } from '@mui/icons-material'; // Icon for refresh functionality

// Importing custom components
import { CustomSnackbarContent } from './customSnackbarContent'; // Custom Snackbar component for displaying messages
import { fetchExamRegulations } from '../database_services/ExamRegulationService';

/**
 * @typedef {Object} ExamRegulation
 * @property {string} name - The name of the exam regulation.
 * @property {string} jsonSchema - The JSON schema of the exam regulation.
 */
export interface ExamRegulation {
  name: string;
  jsonSchema: string;
}
// editor is not fully typed so we have to disable the eslint rule
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @typedef {Object} ExamRegulationSelectProps
 * @property {any} jsoneditor - The JSON editor instance.
 * @property {React.Dispatch<React.SetStateAction<string>>} setInternalName - The state setter for the internal name.
 */
interface ExamRegulationSelectProps {
  jsoneditor: any;
  setInternalName: React.Dispatch<React.SetStateAction<string>>;
  examRegulations: ExamRegulation[];
  setExamRegulations: React.Dispatch<React.SetStateAction<ExamRegulation[]>>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */



/**
 * ExamRegulationSelect is a component that allows users to select, load, and delete exam regulations.
 * It also provides a search functionality to filter through the exam regulations.
 *
 * @param {Object} props - The properties passed to this component.
 * @param {any} props.jsoneditor - The JSON editor instance.
 * @param {React.Dispatch<React.SetStateAction<string>>} props.setInternalName - The state setter for the internal name.
 */
const ExamRegulationSelect = ({
  jsoneditor,
  setInternalName,
  examRegulations,
  setExamRegulations
}: ExamRegulationSelectProps) => {
  // State variables
  const [selectedExamRegulation, setSelectedExamRegulation] =
    useState<ExamRegulation | null>(null); // Holds the currently selected exam regulation
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Controls the visibility of the snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Holds the message to be displayed in the snackbar
  const [saveSuccess, setSaveSuccess] = useState(false); // Indicates whether the last save operation was successful
  const [page, setPage] = useState(0); // Holds the current page number for the table pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // Holds the number of rows per page for the table pagination
  const [searchTerm, setSearchTerm] = useState(''); // Holds the current search term for filtering exam regulations
  const [dialogOpen, setDialogOpen] = useState(false); // Controls the visibility of the delete confirmation dialog
  const [selectedDeleteExamRegulation, setSelectedDeleteExamRegulation] =
    useState<ExamRegulation | null>(null); // Holds the exam regulation to be deleted

  /**
   * Deletes an exam regulation from the server.
   *
   * @param {string} internalName - The internal name of the exam regulation to be deleted.
   */
  const deleteExamRegulation = async (internalName: string) => {
    try {
      // Send axios post request to /api/intern/deleteExamRegulationByName
      const response: AxiosResponse = await axios.post(
        '/api/intern/deleteExamRegulationByName',
        { name: internalName }
      );
      // Return the success status and error message (if any)
      if (response.status === 200) {
        return { success: true };
      } else {
        return { success: false, error: response.data };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Fetch exam regulations when the component mounts
  useEffect(() => {
    try {
      fetchExamRegulations(setExamRegulations);
    } catch (error) {
      console.error(error);
    }
  }, []);

  /**
   * Loads the selected exam regulation into the JSON editor.
   *
   * @param {ExamRegulation} examRegulation - The exam regulation to load.
   */
  const handleLoadExamRegulation = async (examRegulation: ExamRegulation) => {
    try {
      setSelectedExamRegulation(examRegulation);
      console.log('Loading: ' + examRegulation.jsonSchema);

      const parse = JSON.parse(examRegulation.jsonSchema);
      (await jsoneditor).setValue(parse);
      setInternalName(examRegulation.name);
      setSnackbarMessage('Exam Regulation loaded successfully.');
      setSaveSuccess(true);
      setSnackbarOpen(true);
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Error loading Exam Regulation.');
      setSaveSuccess(false);
      setSnackbarOpen(true);
    }
  };

  /**
   * Prepares to delete an exam regulation by setting it as the selected exam regulation for deletion and opening the confirmation dialog.
   *
   * @param {ExamRegulation} toDelete - The exam regulation to delete.
   */
  const handleDeleteExamRegulation = (toDelete: ExamRegulation) => {
    setSelectedDeleteExamRegulation(toDelete);
    setDialogOpen(true);
  };

  /**
   * Deletes the selected exam regulation after confirmation and updates the list of exam regulations.
   */
  const handleConfirmDelete = async () => {
    try {
      let reponse = null;
      if (selectedDeleteExamRegulation !== null)
        reponse = await deleteExamRegulation(selectedDeleteExamRegulation.name);
      else throw new Error('selectedDeleteExamRegulation cannot be null');
      if (!reponse.success) {
        throw new Error(reponse.error);
      }
      setSelectedExamRegulation(null);
      // Remove toDelete
      const updatedExamRegulations = examRegulations.filter(
        (examRegulation) => examRegulation !== selectedDeleteExamRegulation
      );
      setExamRegulations(updatedExamRegulations);
      setSnackbarMessage('Exam Regulation deleted successfully.');
      setSaveSuccess(true);
      setSnackbarOpen(true);
      setDialogOpen(false);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error)
        setSnackbarMessage('Error deleting Exam Regulation. ' + error.message);
      setSaveSuccess(false);
      setSnackbarOpen(true);
      setDialogOpen(false);
    }
  };

  /**
   * Refreshes the list of exam regulations.
   */
  const handleRefreshList = () => {
    fetchExamRegulations(setExamRegulations)
      .then(() => {
        setSnackbarMessage('Exam Regulations list refreshed.');
        setSaveSuccess(true);
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error(error);
        setSnackbarMessage('Error refreshing Exam Regulations list.');
        setSaveSuccess(false);
        setSnackbarOpen(true);
      });
  };

  /**
   * Closes the snackbar.
   */
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  /**
   * Changes the current page of the table pagination.
   *
   * @param {unknown} event - The event object.
   * @param {number} newPage - The new page number.
   */
  const handleChangePage = (event: unknown, newPage: number) => {
    event;
    setPage(newPage);
  };

  /**
   * Changes the number of rows per page of the table pagination and resets the page number to 0.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event object.
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /**
   * Updates the search term for filtering exam regulations.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The event object.
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  /**
   * Filters the list of exam regulations based on the search term.
   */
  const filteredExamRegulations = examRegulations.filter((examRegulation) =>
    examRegulation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Bestätigung</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bist du dir sicher, dass du das die Prüfungsordnung{' '}
            {selectedDeleteExamRegulation?.name}, löschen möchtest?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Abbrechen
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
      <Accordion defaultExpanded sx={{ marginBottom: '20px' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>exam regulations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    exam regulation name
                    <IconButton color="primary" onClick={handleRefreshList}>
                      <Refresh />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Actions</Typography>
                      <TextField
                        label="Search"
                        variant="outlined"
                        onChange={handleSearchChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                          sx: {
                            borderRadius: '15px',
                            height: '45px'
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExamRegulations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((examRegulation, index) => (
                    <TableRow
                      key={index}
                      selected={selectedExamRegulation === examRegulation}
                    >
                      <TableCell>{examRegulation.name}</TableCell>
                      <TableCell>
                        <Button
                          startIcon={<CloudDownloadIcon />}
                          variant="outlined"
                          color="primary"
                          onClick={() =>
                            handleLoadExamRegulation(examRegulation)
                          }
                          sx={{ marginRight: '10px' }} // Fügt einen rechten Rand hinzu
                        >
                          Apply
                        </Button>
                        <Button
                          startIcon={<DeleteIcon />}
                          variant="outlined"
                          color="secondary"
                          onClick={() =>
                            handleDeleteExamRegulation(examRegulation)
                          }
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredExamRegulations.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <div>
          <CustomSnackbarContent
            message={snackbarMessage}
            variant={saveSuccess ? 'success' : 'error'}
            onClose={handleSnackbarClose}
          />
        </div>
      </Snackbar>
    </>
  );
};

export default ExamRegulationSelect;
