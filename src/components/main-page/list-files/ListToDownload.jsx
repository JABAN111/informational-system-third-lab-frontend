import { useEffect, useState } from "react";
import authFetch from "../../../utils/netUitls";
import { GET_OPERATIONS } from "../../../config";

const ListToDownload = () => {
    const [files, setFiles] = useState([]);

    const fetchFiles = () => {
        try {
            authFetch(GET_OPERATIONS)
                .then((data) => data.json())
                .then((data) => {
                    setFiles(data);
                    console.log(data);
                });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleFileDownload = (file) => {
        let fileName = file.replaceAll("/", "___");
        console.log("Скачиваем файл:", fileName);
        const downloadUrl = `http://localhost:8080/api/v1/manage/study-groups/get-file/${fileName}`;
        console.log(downloadUrl);
        authFetch(downloadUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
            })
            .catch((error) => {
                console.error("Ошибка при скачивании файла:", error);
            });
    };

    return (
        <div>
            <h2>Мои файлы</h2>
            {files.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>#</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Имя файла</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Пользователь</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Режим</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Количество объектов</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Дата и время</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {files.map((file, index) => (
                        <tr key={file.id} style={{borderBottom: "1px solid #ddd"}}>
                            <td style={{textAlign: "center", padding: "8px"}}>{index + 1}</td>
                            <td style={{padding: "8px"}}>{file.filename}</td>
                            <td style={{padding: "8px"}}>{file.user.username}</td>
                            <td style={{padding: "8px"}}>{file.mode}</td>
                            <td style={{padding: "8px"}}>{file.amountOfObjectSaved}</td>
                            <td style={{padding: "8px"}}>{new Date(file.timestamp).toLocaleString()}</td>
                            <td style={{padding: "8px", textAlign: "center"}}>
                                <button onClick={() => handleFileDownload(`${file.user.username}/${file.filename}`)}>
                                    Скачать
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Файлы не найдены.</p>
            )}
        </div>
    );
};

export default ListToDownload;