import { BrowserRouter, Routes, Route } from 'react-router-dom';
import logoLivro from '../../assets/logoLivro.png';
import lupa from '../../assets/lupa.png';

import Home from '../../Pages/Home'
import QueroDoar from '../../Pages/QueroDoar/QueroDoar'
import LivrosDoados from '../../Pages/LivrosDoados/LivrosDoados'
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <>
            <header>
                <section>
                    <img src={logoLivro} alt="Imagem de um livro branco com fundo azul" />
                    <h1>Livro Vai Na Web</h1>
                </section>
                <nav>
                    <ul>
                        <li><Link to='/'>Inicio</Link></li>
                        <li><Link to='/LivrosDoados'>Livros Doados</Link></li>
                        <li><Link to='/QueroDoar'>Quero doar</Link></li>
                    </ul>
                </nav>
                <section>
                    <input type="search" name="" id="" placeholder="O que você procura?" />
                    <button>
                        <img src={lupa} alt="Ícone de lupa" />
                    </button>
                </section>
            </header>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={ <Home/> } />
                    <Route path='/novosLivros' element={ <LivrosDoados/> } />
                    <Route path='/queroDoar' element={ <QueroDoar/> } />
                </Routes>
            </BrowserRouter>
        </>
    );
}