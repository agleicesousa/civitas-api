// import React from 'react';
// import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './Pages/Home';

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
  );
}