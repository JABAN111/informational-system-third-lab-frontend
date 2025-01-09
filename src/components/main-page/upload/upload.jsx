import React, { useState } from 'react';
import axios from 'axios';

const Upload = (
    {callback}
) => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            setUploadStatus('Выберите файл перед отправкой.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userTimestamp', '2023-12-11 00:00:01');  // Значение для userTimestamp

        try {
            const token = sessionStorage.getItem('sessionId');
            setUploadStatus('Загрузка...');
            const response = await axios.post('http://127.0.0.1:8080/api/v1/import/csv', formData, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setUploadStatus('Файл успешно отправлен!');
                await callback()
            } else {
                setUploadStatus(`Ошибка загрузки: ${response.statusText}`);
            }
        } catch (error) {
            setUploadStatus(`Ошибка загрузки: ${error.message}`);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Загрузка CSV файла</h2>
            <form onSubmit={handleUpload}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Загрузить
                </button>
            </form>
            {uploadStatus && (
                <div style={{ marginTop: '10px', color: uploadStatus.startsWith('Ошибка') ? 'red' : 'green' }}>
                    {uploadStatus}
                </div>
            )}
        </div>
    );
};

export default Upload;