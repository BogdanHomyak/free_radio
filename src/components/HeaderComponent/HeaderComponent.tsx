import React, {useState} from 'react';
import {NavLink} from "react-router-dom";
import style from './HeaderComponent.module.css';

const HeaderComponent = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={style.header}>
            <svg className={style.svg} xmlns="http://www.w3.org/2000/svg" width="100" height="44" viewBox="0 0 100 44"
                 fill="none">
                <path
                    d="M41.6579 0L42.5165 22H0V0H41.6579ZM61.6331 0C51.6646 0 43.4799 7.37778 42.6023 22H42.5165V44H44.6151C44.6151 37.9259 46.1986 32.4296 48.7742 28.4296C51.3307 24.4593 54.8698 22 58.7904 22H100V0H61.6427H61.6331Z"
                    fill="#141414"/>
            </svg>

            <div className={style.menu}>
                <NavLink to={'/'}>ПРО ПРОЕКТ</NavLink>
                <NavLink to={'/donates'}>ДОНАТИ</NavLink>
                <NavLink to={'/letters'}>ПРОЧИТАТИ ЛИСТИ</NavLink>
            </div>

            <NavLink className={style.sendLetter} to={'/form'}>НАПИСАТИ ЛИСТА</NavLink>

            <button className={style.menuButton} onClick={toggleMenu}>
            </button>

            <div className={`${style.modal} ${isMenuOpen ? style.open : ''}`}>
                <div className={style.modalContent}>
                    <div className={style.modalTop}>
                        <svg className={style.svg2} xmlns="http://www.w3.org/2000/svg" width="100" height="44"
                             viewBox="0 0 100 44" fill="none">
                            <path
                                d="M41.6579 0L42.5165 22H0V0H41.6579ZM61.6331 0C51.6646 0 43.4799 7.37778 42.6023 22H42.5165V44H44.6151C44.6151 37.9259 46.1986 32.4296 48.7742 28.4296C51.3307 24.4593 54.8698 22 58.7904 22H100V0H61.6427H61.6331Z"
                                fill="#141414"/>
                        </svg>
                        <button className={style.closeButton} onClick={toggleMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"
                                 fill="none">
                                <path d="M1.10254 1L35.3972 35.2947" stroke="black"/>
                                <path d="M1 35.4424L35.2947 1.1477" stroke="black"/>
                            </svg>
                        </button>
                    </div>
                    <div className={style.modalNav}>
                        <NavLink to={'/'} onClick={toggleMenu}>ПРО ПРОЕКТ</NavLink>
                        <NavLink to={'/donates'} onClick={toggleMenu}>ДОНАТИ</NavLink>
                        <NavLink to={'/letters'} onClick={toggleMenu}>ПРОЧИТАТИ ЛИСТИ</NavLink>
                    </div>
                    <NavLink className={style.sendLetterModal} to={'/form'} onClick={toggleMenu}>НАПИСАТИ ЛИСТА</NavLink>
                </div>
                <div className={style.overlay} onClick={toggleMenu}></div>
            </div>
        </header>
    );
};

export default HeaderComponent;