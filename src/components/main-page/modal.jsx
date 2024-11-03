// Modal.js
import React from 'react';
import './modal.css'; // Импортируем стили для модального окна

const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/*<button className="modal-close" onClick={onClose}>×</button>*/}
                {children}
            </div>
        </div>
    );
};

export default Modal;