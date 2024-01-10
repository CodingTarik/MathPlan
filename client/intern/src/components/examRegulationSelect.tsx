import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  IconButton
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

  return (
    <>
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examRegulations.map((examRegulation, index) => (
              <TableRow
                key={index}
                selected={selectedExamRegulation === examRegulation}
              >
                <TableCell>{examRegulation.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleLoadExamRegulation(examRegulation)}
                  >
                    Load
                  </Button>
                  <Button
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
      </TableContainer>

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
