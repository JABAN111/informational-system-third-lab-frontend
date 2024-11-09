// Notification.js
import React, { useEffect } from 'react';
import './notifications.css';

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // Уведомление исчезает через 3 секунды
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>
            {message}
        </div>
    );
};

export default Notification;