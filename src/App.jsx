import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './Components/Header/Header.jsx'
import Home from './Pages/Home/Home.jsx'
import Footer from './Components/Footer/Footer.jsx'

import './Components/GlobalStyle/globalStyle.scss'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Route>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </Route>
      <Footer />
    </BrowserRouter>
  );
}