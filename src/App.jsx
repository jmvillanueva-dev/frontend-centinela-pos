import { BrowserRouter, Routes, Route } from 'react-router';

import Home from './pages/Home.jsx';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />;
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
