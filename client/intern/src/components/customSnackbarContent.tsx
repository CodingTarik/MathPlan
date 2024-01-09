import React from 'react';
import { SnackbarContent, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Props for the CustomSnackbarContent component.
 * @typedef {Object} CustomSnackbarContentProps
 * @property {string} message - The message to display in the snackbar.
 * @property {'success' | 'error'} variant - The variant of the snackbar. Determines the icon and background color.
 * @property {(event: React.SyntheticEvent, reason: string) => void} onClose - Callback function that is called when the close button is clicked.
 */
interface CustomSnackbarContentProps {
  message: string;
  variant: 'success' | 'error';
  onClose: (event: React.SyntheticEvent, reason: string) => void;
}

/**
 * A custom SnackbarContent component.
 * Displays a message with an icon and a close button.
 * The icon and background color are determined by the variant prop.
 * @param {CustomSnackbarContentProps} props - The props for the component.
 * @returns {JSX.Element} The CustomSnackbarContent component.
 */
export function CustomSnackbarContent({ message, variant, onClose }: CustomSnackbarContentProps) {
  // Determine the icon and background color based on the variant.
  const icon = variant === 'success' ? <CheckCircleIcon /> : <ErrorIcon />;
  const backgroundColor = variant === 'success' ? 'green' : 'red';

  return (
    <SnackbarContent
      style={{ backgroundColor: backgroundColor, display: 'flex', alignItems: 'center' }}
      message={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          &nbsp;&nbsp;{message}
        </span>
      }
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={(e) => onClose(e, 'clickaway')}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}