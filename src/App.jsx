import { BrowserRouter, Routes, Route } from 'react-router';
import { ToastContainer } from 'react-toastify';

import Home from './pages/Home/Home.jsx';
import AuthPage from './pages/Auth/AuthPage.jsx';
import EmailConfirmation from './pages/Auth/EmailConfirmation.jsx';


function App() {

  return (
    <>
      <BrowserRouter basename="/frontend-centinela-pos/">
        <Routes>
          <Route index element={<Home />} />
          <Route path="auth/:type" element={<AuthPage />} />
          <Route path="confirm/:rol/:token" element={<EmailConfirmation />} />
        </Routes>
      </BrowserRouter>

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
  )
}

export default App;
