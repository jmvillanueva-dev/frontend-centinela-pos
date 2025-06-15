import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home/Home.jsx';
import LoginPage from './pages/Auth/LoginPage.jsx';
import RegisterPage from './pages/Auth/RegisterPage.jsx';
import EmailConfirmation from './pages/Auth/EmailConfirmation.jsx';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const redirectPath = query.get('p');
    
    if (redirectPath) {
      // Decodificar la ruta y manejar caracteres especiales
      const decodedPath = decodeURIComponent(redirectPath.replace(/~and~/g, '&'));
      navigate(decodedPath, { replace: true });
    }
  }, [location.search, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirm/:rol/:token" element={<EmailConfirmation />} />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;