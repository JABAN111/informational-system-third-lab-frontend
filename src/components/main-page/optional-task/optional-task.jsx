import { useEffect, useState, useRef } from 'react';
import authFetch from "../../../utils/netUitls";
import {GET_ALL_GROUPS, UPDATE_GROUPS} from "../../../config";

const OptionalTask = () => {
    const [groups, setGroups] = useState([]);
    const peopleAndColors = useRef({});
    const canvasRef = useRef(null);
    const longPollingRef = useRef(false);
    const [isEmpty, setIsEmpty] = useState(true);

    const hatchWidth = 20 / 2;
    const hatchGap = 56;
    let currentRadius = 2;

    const fetchGroups = async () => {
        try {
            const response = await authFetch(`${GET_ALL_GROUPS}`);
            const data = await response.json();
            setGroups(data.body.content); // Сохраняем данные в состоянии
        } catch (error) {
            console.error("Ошибка при получении данных:", error);
        }
    };


    const startLongPolling = async () => {
        while (longPollingRef.current) {
            try {
                const response = await authFetch(`${UPDATE_GROUPS}?page=${0}&size=${1000}`);
                const data = await response.json();
                const content = await data.content;

                const username = localStorage.getItem('username') || '';
                const role = localStorage.getItem('role') || '';
                let isAdmin = false;
                if(role !== ''){
                    isAdmin = 'ROLE_ADMIN' === localStorage.getItem('role');
                }

                const updatedGroups = content.map((group) => {
                    const creatorUsernameOfCurrentGroup = group.creator?.username || '';
                    let canEdit;
                    if(!isAdmin) {
                        canEdit = creatorUsernameOfCurrentGroup === username;
                    } else {
                        canEdit = true;
                    }

                    return {
                        ...group,
                        canEdit,
                    };
                });
                await setGroups(updatedGroups);
                const lenGroups = await updatedGroups.length;
                await console.log(groups)
                await setIsEmpty(lenGroups !== 0)
            } catch (error) {
                console.error("Ошибка в long polling:", error);
            }

            await new Promise(resolve => setTimeout(resolve, 10_000));
        }
    };

    const getNewRandomColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor.padStart(6, '0')}`;
    };

    function setRadius(newRadius) {
        currentRadius = newRadius;
        redrawGraph();
    }

    const printDotOnGraph = (xCenter, yCenter, color, ctx, w, h) => {
        ctx.fillStyle = color;
        let x = w / 2 + xCenter * hatchGap * (2 / currentRadius);
        let y = h / 2 - yCenter * hatchGap * (2 / currentRadius);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    };

    const printGroups = (ctx, w, h) => {
        if (groups.length > 0) {
            for (let group of groups) {
                let color = peopleAndColors.current[group.groupAdmin.id];
                if (color === undefined) {
                    color = getNewRandomColor();
                    peopleAndColors.current[group.groupAdmin.id] = color;
                }
                printDotOnGraph(group.coordinates.x, group.coordinates.y, color, ctx, w, h);
            }
        }
    };

    const redrawGraph = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const w = canvas.width;
                const h = canvas.height;
                ctx.clearRect(0, 0, w, h); // теперь этот вызов будет безопасным
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'black';
                drawAxesAndHatch(ctx, w, h);
                numCoord(ctx, w, h);
                printGroups(ctx, w, h);
            }
        }
    };

    const drawAxesAndHatch = (ctx, w, h) => {
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2 - 10, 15);
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2 + 10, 15);
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(w, h / 2);
        ctx.lineTo(w - 15, h / 2 - 10);
        ctx.moveTo(w, h / 2);
        ctx.lineTo(w - 15, h / 2 + 10);
        ctx.moveTo(w, h / 2);
        ctx.lineTo(0, h / 2);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(w / 2 - hatchWidth, h / 2 - hatchGap);
        ctx.lineTo(w / 2 + hatchWidth, h / 2 - hatchGap);
        ctx.moveTo(w / 2 - hatchWidth, h / 2 - hatchGap * 2);
        ctx.lineTo(w / 2 + hatchWidth, h / 2 - hatchGap * 2);
        ctx.moveTo(w / 2 - hatchWidth, h / 2 + hatchGap);
        ctx.lineTo(w / 2 + hatchWidth, h / 2 + hatchGap);
        ctx.moveTo(w / 2 - hatchWidth, h / 2 + hatchGap * 2);
        ctx.lineTo(w / 2 + hatchWidth, h / 2 + hatchGap * 2);
        ctx.moveTo(w / 2 - hatchGap, h / 2 - hatchWidth);
        ctx.lineTo(w / 2 - hatchGap, h / 2 + hatchWidth);
        ctx.moveTo(w / 2 - hatchGap * 2, h / 2 - hatchWidth);
        ctx.lineTo(w / 2 - hatchGap * 2, h / 2 + hatchWidth);
        ctx.moveTo(w / 2 + hatchGap, h / 2 - hatchWidth);
        ctx.lineTo(w / 2 + hatchGap, h / 2 + hatchWidth);
        ctx.moveTo(w / 2 + hatchGap * 2, h / 2 - hatchWidth);
        ctx.lineTo(w / 2 + hatchGap * 2, h / 2 + hatchWidth);
        ctx.stroke();
        ctx.closePath();
    };

    const numCoord = (ctx, w, h) => {
        if (currentRadius === null) return;
        ctx.font = "20px Segue UI";
        ctx.fillStyle = "black";
        const indent = 20;
        ctx.fillText(`${currentRadius / 2}`, w / 2 + hatchGap, h / 2 + indent);
        ctx.fillText(`${currentRadius}`, w / 2 + hatchGap * 2, h / 2 + indent);
        ctx.fillText(`${-currentRadius / 2}`, w / 2 - hatchGap, h / 2 + indent);
        ctx.fillText(`${-currentRadius}`, w / 2 - hatchGap * 2, h / 2 + indent);
        ctx.fillText(`${currentRadius / 2}`, w / 2 + indent, h / 2 - hatchGap);
        ctx.fillText(`${currentRadius}`, w / 2 + indent, h / 2 - hatchGap * 2);
        ctx.fillText(`${currentRadius / 2}`, w / 2 + indent, h / 2 + hatchGap);
        ctx.fillText(`${currentRadius}`, w / 2 + indent, h / 2 + hatchGap * 2);
    };

    useEffect(() => {
        fetchGroups();
        longPollingRef.current = true;
        startLongPolling();
    }, []);

    useEffect(() => {
        if (groups.length > 0 && canvasRef.current) {
            redrawGraph();
        }
    }, [groups]);

    const ifNotEmpty = (
        <>
            <label htmlFor={"selector"}>Выберите цену деления</label>
            <select id={"selector"} onChange={(e) => setRadius(Number(e.target.value))}>
                <option value={2*2}>2</option>
                <option value={4*2}>4</option>
                <option value={8*2}>8</option>
                <option value={16*2}>16</option>
                <option value={24*2}>24</option>
            </select>
            <canvas ref={canvasRef} width="500" height="500" style={{ border: '1px solid black' }}></canvas>
        </>
    );
    const ifIsEmpty = (
        <h1>Нет записей в таблицу с группами</h1>
    )
    return isEmpty ? ifNotEmpty : ifIsEmpty;
};

export default OptionalTask;