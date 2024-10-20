import React, { useEffect, useState } from 'react';
import './auth.css';
import { CREATE_USER, GET_PERSONS, LOGIN, SERVER_URL } from "../../config";
import {useNavigate} from "react-router-dom";

function AuthComponent() {
    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true); // Состояние для переключения между авторизацией и регистрацией

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    const [personName, setPersonName] = useState('');

    const [eyeColor, setEyeColor] = useState('GREEN');
    const colors = {
        GREEN: "зеленые",
        BLACK: "черные",
        WHITE: "белые",
        BROWN: "коричневые"
    }
    const [hairColor, setHairColor] = useState("GREEN");
    const [location, setLocation] = useState({
        x: 0,
        y: 0,
        z: 0,
        name: ""
    });
    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [passportID, setPassportID] = useState('');



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
            }else{
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
        //todo дописать логику админа
        let isUserAdmin = false;
        if(userRole === "Администратор") {
            isUserAdmin = sendRequestForAdminPrivilege()
            console.log("администраторов временно нет, ", isUserAdmin);
        }

        let roleToServ;
        switch (userRole){
            case "Обычный пользователь":
                roleToServ = "USUAL_USER"
                break;
            case "Администратор":
                roleToServ = "SUPER_USER"
                break;
        }


        let person = {
            name: personName,
            eyeColor: eyeColor,
            hairColor: hairColor,
            location: location,
            height: height,
            weight: weight,
            passportID: passportID,
        }

        let body = {
            username: email,
            password: password,
            person: person,
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
        ).then(res => {
            // res.json()
            if(res.status === 201)
                navigate("/main-page")
        })
            // .then(data => {
            //     }
            // )
            .catch(err => console.log(err));
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
            .then(res =>
                {
                    if(res.ok)
                        navigate("/main-page")
                }
                // res.json()
            )
            // .then(data => {
            //         console.log(data)
            //         if (data.success) {
            //             navigate("/main-page")
            //         }
            //     }
            // )
            .catch(err => console.log(err));
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
                        <input type="email" id="email" required onChange={(e) => setEmail(e.target.value)} />
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
                            <p>Информация о человеке: </p>
                            {/*данные о Person*/}
                            <div className={`form-group fade-in`}>
                                <label htmlFor="personName">Имя:</label>
                                <input
                                    id="personName"
                                    type="text"
                                    onChange={(e) => setPersonName(e.target.value)}
                                    required
                                />

                                <label htmlFor="eye-color">Цвет глаз:</label>
                                <select id="eye-color" value={eyeColor} onChange={(e) => setEyeColor(e.target.value)}>
                                    {Object.keys(colors).map((color) => (
                                        <option key={color} value={color}>{colors[color]}</option>
                                    ))}
                                </select>

                                <label htmlFor="hair-color">Цвет волос:</label>
                                <select
                                    id="hair-color"
                                    value={hairColor}
                                    onChange={(e) => setHairColor(e.target.value)}
                                >
                                    {Object.keys(colors).map((color) => (
                                        <option key={color} value={color}>
                                            {colors[color]}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="location-x">Местоположение (X):</label>
                                <input
                                    type="number"
                                    id="location-x"
                                    value={location.x}
                                    onChange={(e) => setLocation({location, x: e.target.value})}
                                />

                                <label htmlFor="location-y">Местоположение (Y):</label>
                                <input
                                    type="number"
                                    id="location-y"
                                    value={location.y}
                                    onChange={(e) => setLocation({...location, y: e.target.value})}
                                />

                                <label htmlFor="location-z">Местоположение (Z):</label>
                                <input
                                    type="number"
                                    id="location-z"
                                    value={location.z}
                                    onChange={(e) => setLocation({...location, z: e.target.value})}
                                />

                                <label htmlFor="location-name">Название местоположения:</label>
                                <input
                                    type="text"
                                    id="location-name"
                                    value={location.name}
                                    onChange={(e) => setLocation({...location, name: e.target.value})}
                                    placeholder="Введите название местоположения"
                                />

                                <label htmlFor="height">Рост</label>
                                <input
                                    type="number"
                                    id="height"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    min="1"
                                    placeholder={"Введите ваш рост"}
                                />

                                <label htmlFor="weight">Вес</label>
                                <input
                                    type="number"
                                    id="weight"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    min="1"
                                    placeholder={"Введите ваш вес"}
                                />

                                <label htmlFor="passportId"/>
                                <input
                                    type="text"
                                    id="passportId"
                                    value={passportID}
                                    onChange={(e) => setPassportID(e.target.value)}
                                    required
                                    placeholder={"Введите паспорт id"}
                                    min={10}/>
                            </div>

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
        </div>
    );
}

export default AuthComponent;