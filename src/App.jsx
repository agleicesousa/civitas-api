// import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './Components/Header/Header.jsx';
import Home from './Pages/Home/Home.jsx';
import LivrosDoados from './Pages/LivrosDoados/LivrosDoados.jsx';
import QueroDoar from './Pages/QueroDoar/QueroDoar.jsx';
import Footer from './Components/Footer/Footer.jsx';

import './Components/GlobalStyle/globalStyle.scss';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/livrosdoados' elemment={<LivrosDoados />} />
        <Route path='/querodoar' elemment={<QueroDoar />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}