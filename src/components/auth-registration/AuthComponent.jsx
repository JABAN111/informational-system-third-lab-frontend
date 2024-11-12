import React, {useEffect, useState} from 'react';
import './auth.css';
import {CREATE_USER, LOGIN, SERVER_URL} from "../../config";
import {useNavigate} from "react-router-dom";
import Notification from "../notification-component/notification";

function AuthComponent() {
    const navigate = useNavigate();

    const [notification, setNotification] = useState(null);


    const [isLogin, setIsLogin] = useState(true); // Состояние для переключения между авторизацией и регистрацией

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');


    const [userRole, setUserRole] = useState('Обычный пользователь');
    const roles = [ 'Обычный пользователь', 'Администратор',];


    const handleUserRoleSelection = (e) => {
        setUserRole(e.target.value);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        console.log("сабмитим");
        if (validationOfData()) {
            console.log("прошли проверку, вся дата валидна")
            if (isLogin) {
                console.log("Данные отправляются...");
                sendAuthRequest();
            } else {
                registrationRequest()
            }
        }
    };

    const validateConfirmedPassword = (value) => {
        if (password === value) {
            setConfirmedPassword(value);
        } else {
            console.log("Пароли не совпадают");
        }
    };

    const emailValidator = (value) => {
        return value.length > 5 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const pwdValidator = (value) => value.length >= 5;

    const validationOfData = () => {
        if (!isLogin) {
            return emailValidator(email) && pwdValidator(password) && pwdValidator(confirmedPassword) && password === confirmedPassword;
        } else {
            return emailValidator(email) && pwdValidator(password);
        }
    };

    const sendRequestForAdminPrivilege = () => {
        console.log("not implemented");
        // fetch(

        return false;
    }

    const registrationRequest = () => {

        let roleToServ;
        switch (userRole) {
            case "Обычный пользователь":
                roleToServ = "ROLE_USER"
                break;
            case "Администратор":
                roleToServ = "ROLE_ADMIN"
                break;
        }

        let body = {
            username: email,
            password: password,
            role: roleToServ,
        }
        console.log("отправится: ", body)
        fetch(
            `${SERVER_URL}/${CREATE_USER}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            }
        ).then(
            res => res.json()
        ).then(
            data => {
                if (data.body.token) { // Проверяем, что токен получен
                    sessionStorage.setItem('sessionId', data.body.token); // Сохраняем токен в sessionStorage
                    console.log("Токен сохранён в sessionStorage:", data.body.token);
                    navigate("/main-page"); // Переходим на основную страницу после успешного сохранения
                } else {
                    handleNotification(data.message,"error");
                }
            })
            .catch(err => handleNotification(`ошибка при запросе: ${err.message}`, "error"));
    }

    const sendAuthRequest = () => {
        let body = {
            username: email,
            password: password,
        };

        fetch(`${SERVER_URL}/${LOGIN}`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)

        })
            .then(res => res.json())
            .then(data => {
                if (data.body.token) {
                    sessionStorage.setItem('sessionId', data.body.token);
                    console.log("Токен сохранён в sessionStorage:", data.body.token);
                    navigate("/main-page");
                }
            })
            .catch(
                err => handleNotification("пизда пизда пизда","error")
            );
    };

    const handleNotification = (message, type) => {
        console.log(message);
        setNotification({ message, type });
    };


    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className={`auth-title ${isLogin ? 'fade-in' : 'fade-out'}`}>
                    {isLogin ? 'Авторизация' : 'Регистрация'}
                </h2>
                <form onSubmit={submitHandler}>
                    <div className={`form-group ${isLogin ? 'fade-in' : 'fade-out'}`}>
                        <label htmlFor="email">Электронная почта:</label>
                        <input type="email" id="email" required onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className={`form-group ${isLogin ? 'fade-in' : 'fade-out'}`}>
                        <label htmlFor="password">Пароль:</label>
                        <input className="password-input" type="password" id="password" required onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {!isLogin && (
                        <div className={`form-group fade-in`}>
                            <label htmlFor="confirm-password">Подтвердите пароль:</label>
                            <input className="password-input" type="password" id="confirm-password" required
                                   onChange={(e) => validateConfirmedPassword(e.target.value)}/>


                            <label htmlFor="user-select">Выберите желаемую роль:</label>
                            <select id="user-select" value={userRole} onChange={handleUserRoleSelection}>
                                {roles.map((role) => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
                </form>
                <div>
                    <div id="is-login-question">{isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}</div>
                    <button onClick={() => setIsLogin(prevMode => !prevMode)}>
                        {isLogin ? 'Создать' : 'Войти'}
                    </button>
                </div>
            </div>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>

    );
}

export default AuthComponent;