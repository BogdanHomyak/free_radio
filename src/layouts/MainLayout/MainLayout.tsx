import React from 'react';
import { Outlet, useLocation } from "react-router-dom";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import style from './MainLayout.module.css';

const MainLayout = () => {
    const location = useLocation();

    // Перевіряємо, чи шлях не відповідає сторінці листа (де хедер потрібно приховати)
    const shouldHideHeader = location.pathname.includes('/letters/');

    return (
        <div className={style.main}>
            {/* Відображаємо хедер лише якщо не на сторінці перегляду листа */}
            {!shouldHideHeader && <HeaderComponent />}
             <Outlet />

        </div>
    );
};

export default MainLayout;
