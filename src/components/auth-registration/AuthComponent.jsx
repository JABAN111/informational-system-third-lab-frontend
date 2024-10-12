import React, { useState } from 'react';
import './auth.css'; // Импорт стилей

function AuthComponent() {
    const [isLogin, setIsLogin] = useState(true); // Состояние для переключения между авторизацией и регистрацией

    const toggleAuthMode = () => {
        setIsLogin(prevMode => !prevMode);
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className={`auth-title ${isLogin ? 'fade-in' : 'fade-out'}`}>
                    {isLogin ? 'Авторизация' : 'Регистрация'}
                </h2>
                <form>
                    <div className={`form-group ${isLogin ? 'fade-in' : 'fade-out'}`}>
                        <label htmlFor="email">Электронная почта:</label>
                        <input type="email" id="email" required />
                    </div>
                    <div className={`form-group ${isLogin ? 'fade-in' : 'fade-out'}`}>
                        <label htmlFor="password">Пароль:</label>
                        <input className="password-input" type="password" id="password" required />
                    </div>
                    {!isLogin && (
                        <div className={`form-group fade-in`}>
                            <label htmlFor="confirm-password">Подтвердите пароль:</label>
                            <input className="password-input" type="password" id="confirm-password" required />
                        </div>
                    )}
                    <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
                </form>
                <p>
                    <div id = "is-login-question">{isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}</div>
                    <button onClick={toggleAuthMode}>
                        {isLogin ? 'Создать' : 'Войти'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default AuthComponent;