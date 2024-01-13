import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import {
  Accordion,
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
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { CustomSnackbarContent } from './customSnackbarContent';

interface ExamRegulation {
  name: string;
  jsonSchema: string;
}

interface ExamRegulationSelectProps {
  jsoneditor: any;
  setInternalName: React.Dispatch<React.SetStateAction<string>>;
}

const ExamRegulationSelect = ({
  jsoneditor,
  setInternalName
}: ExamRegulationSelectProps) => {
  const [examRegulations, setExamRegulations] = useState<ExamRegulation[]>([]);
  const [selectedExamRegulation, setSelectedExamRegulation] =
    useState<ExamRegulation | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDeleteExamRegulation, setSelectedDeleteExamRegulation] =
    useState<ExamRegulation | null>(null);

  const fetchExamRegulations = async () => {
    try {
      const response: AxiosResponse<ExamRegulation[]> = await axios.get(
        '/api/intern/getAllexamRegulationsMin'
      );
      setExamRegulations(response.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteExamRegulation = async (internalName: string) => {
    try {
      // Send axios post request to /api/intern/deleteExamRegulationByName
      const response: AxiosResponse = await axios.post(
        '/api/intern/deleteExamRegulationByName',
        internalName
      );
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

  useEffect(() => {
    try {
      fetchExamRegulations();
    } catch (error) {
      console.error(error);
    }
  }, []);

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

  const handleDeleteExamRegulation = (toDelete: ExamRegulation) => {
    setSelectedDeleteExamRegulation(toDelete);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      let reponse = null;
      if (selectedDeleteExamRegulation !== null)
        reponse = await deleteExamRegulation(selectedDeleteExamRegulation.name);
      else throw new Error('selectedDeleteExamRegulation cannot be null');
      if(!reponse.success) {
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
    } catch (error: any) {
      console.error(error);
      setSnackbarMessage('Error deleting Exam Regulation. ' + error.message);
      setSaveSuccess(false);
      setSnackbarOpen(true);
    }
  };

  const handleRefreshList = () => {
    fetchExamRegulations()
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    event;
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

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
          <Typography>Control Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Internal Name
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
