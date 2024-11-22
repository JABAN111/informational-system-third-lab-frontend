import React, {useEffect, useState} from "react";
import authFetch from "../../../utils/netUitls";
import {DELETE_GROUP_BY_ADMIN, GET_PERSONS} from "../../../config";

const DeleteFeature = ({onClose}) => {
    const [adminToDelGroup, setAdminToDelGroup] = useState('затычка');
    const [people, setPeople]=useState([]);

    const fetchPeople = async () => {
        try {
            const response = await authFetch(GET_PERSONS);
            const data = await response.json();
            setPeople(data.body.content);
            setAdminToDelGroup(data.body.content[0]); // Задаем adminToDelGroup после загрузки
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
            setPeople([]); // Устанавливаем пустой массив в случае ошибки
        }
    };


    useEffect(() => {
        fetchPeople()
    }, []);



    // Обработчик для удаления группы
    const handleDeleteRequest = async (adminToDelGroup) => {
        if (!adminToDelGroup) {
            console.error('Admin group is undefined');
            return;
        }

        const nameGroupToDelete = adminToDelGroup.name;

        try {
            const response = await authFetch(`${DELETE_GROUP_BY_ADMIN}/${nameGroupToDelete}`, { method: "DELETE" });
            const data = await response.json();
            console.log("Результат удаления:", data);
            onClose()
        } catch (error) {
            console.error("Ошибка при удалении:", error);
        }
    };


    return (
        <div>
            <h1>Удаляем группу по админу</h1>
            <select
                id="person-admin"
                onChange={(e) => {
                    const selectedId = e.target.value;
                    let chosenAdmin = people.find(person => person.id === Number(selectedId));
                    if (!chosenAdmin) {
                        chosenAdmin = people[0];
                    }
                    setAdminToDelGroup(chosenAdmin);
                }}
            >
                {people.map((person) => (
                    <option key={person.id} value={person.id}>
                        {person.name}
                    </option>
                ))}
            </select>

            <button onClick={() => handleDeleteRequest(adminToDelGroup)}>Удалить</button>
        </div>
    );
}

export default DeleteFeature;