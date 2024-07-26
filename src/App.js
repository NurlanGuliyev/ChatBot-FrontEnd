import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import { routes, storageKeys, strings } from './constants';

const App = () => {
    const [message, setMessage] = useState('');

    const [responses, setResponses] = useState([]);

    const [clientId, setClientId] = useState(null);

    const generateUUID = () => Math.ceil(Math.random() * 999999999).toString();

    const sendMessage = async () => {
        if (!message || !clientId) return;

        try {
            const { data } = await axios.post(routes.sendMessage, { message, clientId });

            setResponses(data.messages);

            setMessage('');
        } catch (error) {
            console.error(strings.errorSendMessage, error);
        }
    };

    const handleSession = useCallback(() => {
        const storedClientId = localStorage.getItem(storageKeys.clientId) ||  generateUUID();

        localStorage.setItem(storageKeys.clientId, storedClientId);

        setClientId(storedClientId);
    }, []);

    useEffect(() => {
        handleSession();
    }, [handleSession]);


    return (
        <div className="app">
            <h1 className="app-title">ChatBot Program</h1>
            <div className="chat-box">
                {responses.map((res, index) => (
                    <div key={index} className={`message ${res.role}`}  >
                        <strong>{res.role}:</strong> {res.content}
                    </div>
                ))}
            </div>
            <div className="input-box">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={strings.inputPlaceholder}
                />
                <button onClick={sendMessage}>{strings.send}</button>
            </div>
        </div>
    );
}

export default App;
