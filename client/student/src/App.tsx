// Importing necessary dependencies and styles
import './App.css';
import { HashRouter, Route, Routes, Link} from 'react-router-dom';

/**
 * JSX structure representing the entire intern application.
 *
 * @function App
 * @returns {JSX.Element} The rendered React element.
 */
function App() {
  const Layout = () => {
    return (
      <nav>
          <Link to="/about">Home</Link>
    </nav>
    )
  }
  const Home = () => {
    return (
      <h1>Hallo</h1>
    )
  }
  // JSX structure representing the entire application
  return (
      <HashRouter>
      <div><Routes>
        <Route path="/" element={<Layout />}/>
        <Route path="/about" element={<Home />}/>
        </Routes>
      </div>
      </HashRouter>
  );
}

// Export the App component as the default export
export default App;
