import React, {useEffect} from "react";
import './page-not-found.css'
const PageNotFound = () => {
    useEffect(() => {
        const canvas = document.getElementById("c");
        const ctx = canvas.getContext("2d");

        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%".split("");
        const fontSize = 10;

        const columns = Math.max(1, Math.floor(canvas.width / fontSize));
        const drops = Array(columns).fill(1);

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#0F0";
            ctx.font = `${fontSize}px arial`;

            for (let i = 0; i < drops.length; i++) {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        const interval = setInterval(draw, 35);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <canvas width="3000px" id="c"></canvas>
            <span id="website" className={"notFound"}>Лабораторная по ису: </span>
        </>
    );
};  

export default PageNotFound;