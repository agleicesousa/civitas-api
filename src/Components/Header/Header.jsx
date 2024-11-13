// import { BrowserRouter, Routes, Route } from 'react-router-dom';

import logoLivro from '../../assets/logoLivro.png'
import lupa from '../../assets/lupa.png'

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
                        <li><a href="#">Inicio</a></li>
                        <li><a href="#">Livros Doados</a></li>
                        <li><a href="#">Quero doar</a></li>
                    </ul>
                </nav>
                <section>
                    <input type="search" name="" id="" placeholder="O que você procura?" />
                    <button>
                        <img src={lupa} alt="Ícone de lupa" />
                    </button>
                </section>
            </header>
        </>
    );
}