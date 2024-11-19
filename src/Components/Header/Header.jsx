import { Link } from 'react-router-dom';
import logoLivro from '../../assets/logoLivro.png';
import s from '../Header/header.module.scss';

export default function Header() {
  return (
    <>
      <header className={s.header}>
        <section className={s.logoHeader}>
          <img src={logoLivro} alt="Imagem de um livro branco com fundo azul" />
          <h1>Livro Vai Na Web</h1>
        </section>
        <nav className={s.navHeader}>
          <ul>
            <li><Link className={s.link} to="/">Home</Link></li>
            <li><Link className={s.link} to="/livrosdoados">Livros Doados</Link></li>
            <li><Link className={s.link} to="/querodoar">Quero Doar</Link></li>
          </ul>
        </nav>
      </header>
    </>
  );
}