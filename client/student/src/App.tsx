// Importing necessary dependencies and styles
import './App.css';
import { HashRouter, Route, Routes} from 'react-router-dom';
import Overview from './components/examPlanOverview';
import ApplicationForm from './components/examPlanForm';

/**
 * JSX structure representing the entire intern application.
 *
 * @function App
 * @returns {JSX.Element} The rendered React element.
 */
function App() {
  // JSX structure representing the entire application
  return (
      <HashRouter>
      <div><Routes>
        <Route path="/" element={<Overview />}/>
        <Route path="/applicationform" element={<ApplicationForm />}/>
        </Routes>
      </div>
      </HashRouter>
  );
}

// Export the App component as the default export
export default App;
