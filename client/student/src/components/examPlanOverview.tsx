import { Button } from '@mui/material';
import {Link} from 'react-router-dom';

/**
 * 
 * @returns the button for creating a new exam plan
 */
export default function Overview() {
    return (
      <Link to="/applicationform">
        <Button variant="outlined">Neuer Antrag</Button>
      </Link>
    )
  }