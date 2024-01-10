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
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  IconButton,
  TablePagination,
  TextField
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { CustomSnackbarContent } from './customSnackbarContent';

interface ExamRegulation {
  name: string;
  jsonSchema: any; // Replace with the actual type of your jsonschema
}

const ExamRegulationSelect = () => {
  const [examRegulations, setExamRegulations] = useState<ExamRegulation[]>([]);
  const [selectedExamRegulation, setSelectedExamRegulation] =
    useState<ExamRegulation | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchExamRegulations = async () => {
    try {
      const response: AxiosResponse<ExamRegulation[]> = await axios.get(
        '/api/intern/getAllexamRegulationsMin'
      );
      setExamRegulations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchExamRegulations();
  }, []);

  const handleLoadExamRegulation = (examRegulation: ExamRegulation) => {
    setSelectedExamRegulation(examRegulation);
    setSnackbarMessage('Exam Regulation loaded successfully.');
    setSaveSuccess(true);
    setSnackbarOpen(true);
  };

  const handleDeleteExamRegulation = (index: number) => {
    setSelectedExamRegulation(null);
    const updatedExamRegulations = [...examRegulations];
    updatedExamRegulations.splice(index, 1);
    setExamRegulations(updatedExamRegulations);
    setSnackbarMessage('Exam Regulation deleted successfully.');
    setSaveSuccess(true);
    setSnackbarOpen(true);
  };

  const handleRefreshList = () => {
    fetchExamRegulations();
    setSnackbarMessage('Exam Regulations list refreshed.');
    setSaveSuccess(true);
    setSnackbarOpen(true);
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
                          onClick={() => handleDeleteExamRegulation(index)}
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
        <CustomSnackbarContent
          message={snackbarMessage}
          variant={saveSuccess ? 'success' : 'error'}
          onClose={handleSnackbarClose}
        />
      </Snackbar>
    </>
  );
};

export default ExamRegulationSelect;
