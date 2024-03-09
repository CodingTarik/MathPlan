import './App.css';
import { HashRouter, Route, Routes} from 'react-router-dom';
import Overview from './components/examPlanOverview';
import ExamPlanFormStartPage from './components/examPlanFormStartPage';

/**
 * JSX structure representing the entire student application.
 *
 * @function App
 * @returns {JSX.Element} The rendered React element.
 */
function App() {
  return (
      <HashRouter>
      <div><Routes>
        <Route path="/" element={<Overview />}/>
        <Route path="/applicationform" element={<ExamPlanFormStartPage />}/>
        </Routes>
      </div>
      </HashRouter>
  );
}

// Export the App component as the default export
export default App;
