import {LOGIN, SERVER_URL} from "../config";

/**
 * Небольшая костыльная функция, которая будет вкладывать авторизационный токен(если таковой есть) в header
 *
 * @param url ссылка к запрашевамуему ресурсу
 * @param options если есть, обычно тело запроса
 * @returns {Promise<Response>} в случае если токен существует и запрос удалось произвести(неважно удачный или нет)
 * @returns null, если токена нет
 */
const authFetch = (url, options = {}) => {
    const token = sessionStorage.getItem('sessionId');

    if (!token) {
        return null;
    }

    // Добавляем заголовок Authorization, если токен существует
    const authOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': token ? `Bearer ${token}` : '',
        }
    };
    return fetch(url, authOptions);
};
export const refreshToken = () => {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    let body = {
        username: username,
        password: password,
    };

    sessionStorage.clear();
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
            }
        })
        .catch(
        );
}

export default authFetch;