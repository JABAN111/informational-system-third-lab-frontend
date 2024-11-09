import React, {useEffect, useState} from "react";

const PersonForm = ({selectedPerson, onSubmit, onClose, showNotification}) => {
    const [personName, setPersonName] = useState('');
    const [eyeColor, setEyeColor] = useState('GREEN');

    const colors = {
        GREEN: "зеленые",
        BLACK: "черные",
        WHITE: "белые",
        BROWN: "коричневые"
    }

    const possibleNation = {
        RUSSIA: "Русский",
        USA: "США",
        VATICAN: "Ватиканец",
        THAILAND: "Таец",
        JAPAN: "Ядамекудасай"
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
    const [nationality, setNationality] = useState('RUSSIA');


    useEffect(() => {
        console.log(selectedPerson)
        if (selectedPerson) {
            setPersonName(selectedPerson.name || '');
            setEyeColor(selectedPerson.eyeColor || 'GREEN');
            setHairColor(selectedPerson.hairColor || 'GREEN');
            setLocation(selectedPerson.location || {x: 0, y: 0, z: 0, name: ""});
            setHeight(selectedPerson.height || 0);
            setWeight(selectedPerson.weight || 0);
            setPassportID(selectedPerson.passportID || '');
            setNationality(selectedPerson.nationality || 'RUSSIA');
        }
    }, [selectedPerson]);

    async function handleSubmit(e) {
        e.preventDefault();

        let person = {
            ...(selectedPerson?.id && { id: selectedPerson.id }),
            name: personName,
            eyeColor: eyeColor,
            hairColor: hairColor,
            location: location,
            height: height,
            weight: weight,
            nationality: nationality,
            passportID: passportID,
        }

        const submitValue = onSubmit(person);
        if(!submitValue) {
            console.log("непраивльное значение submit value")
            return;
        }

        submitValue.then(res => {

                if (res.status === 200 || res.status === 201) {
                    showNotification("ура, победа","success")
                    onClose();
                } else {
                    console.error("problems with submit: ", res);
                }
            }
        )
        ;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={`form-group fade-in`}>
                <label htmlFor="personName">Имя:</label>
                <input
                    id="personName"
                    type="text"
                    value={personName}
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
                    onChange={(e) => setLocation({...location, x: +e.target.value})}
                />

                <label htmlFor="location-y">Местоположение (Y):</label>
                <input
                    type="number"
                    id="location-y"
                    value={location.y}
                    onChange={(e) => setLocation({...location, y: +e.target.value})}
                />

                <label htmlFor="location-z">Местоположение (Z):</label>
                <input
                    type="number"
                    id="location-z"
                    value={location.z}
                    onChange={(e) => setLocation({...location, z: +e.target.value})}
                />

                <label htmlFor="location-name">Название местоположения:</label>
                <input
                    type="text"
                    id="location-name"
                    value={location.name}
                    onChange={(e) => setLocation({...location, name: e.target.value})}
                    placeholder="Введите название местоположения"
                />

                <label htmlFor="nation">Национальность: </label>
                <select
                    id="nation"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                >
                    {Object.keys(possibleNation).map((nation) => (
                        <option key={nation} value={nation}>
                            {possibleNation[nation]}
                        </option>
                    ))}
                </select>

                <label htmlFor="height">Рост</label>
                <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(+e.target.value)}
                    min="1"
                    placeholder={"Введите ваш рост"}
                />

                <label htmlFor="weight">Вес</label>
                <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(+e.target.value)}
                    min="1"
                    placeholder={"Введите ваш вес"}
                />

                <label htmlFor="passportId">Паспорт ID:
                    <input
                        type="text"
                        id="passportId"
                        value={passportID}
                        onChange={(e) => setPassportID(e.target.value)}
                        required
                        placeholder={"Введите паспорт id"}
                        min={10}
                    />
                </label>
                <button type="submit">Сохранить</button>

            </div>

        </form>
    )
}
export default PersonForm;