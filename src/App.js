import React, { useState, useEffect } from 'react';
import AuthComponent from "./components/auth-registration/AuthComponent";

function App() {

    return (
        <div className="App">
            <AuthComponent/>
        </div>
    )
    // const [count, setCount] = useState(0);
    //
    // useEffect(() => {
    //     document.title = `Вы нажали ${count} раз`;
    // }, [count]); // Зависимость от count
    //
    // return (
    //     <div>
    //         <p>Вы нажали {count} раз</p>
    //         <button onClick={() => setCount(count + 1)}>
    //             Нажми на меня
    //         </button>
    //     </div>
    // );
}
export default App;