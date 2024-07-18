import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);
    const [clientId, setClientId] = useState(null);

    useEffect(() => {
        // Generate and store clientId if not already stored
        let storedClientId = localStorage.getItem('clientId');
        if (!storedClientId) {
            storedClientId = generateUUID();
            localStorage.setItem('clientId', storedClientId);
        }
        setClientId(storedClientId);
    }, []);

    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    const sendMessage = async () => {
        if (!message.trim() || !clientId) return;

        try {
            const res = await axios.post('https://chatbot-backend-mr8u.onrender.com/api/chat', { message, clientId });
            handleResponse(res.data);
            setMessage(''); // Clear input field after sending message
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleResponse = (data) => {
        // Filter out duplicate messages before updating state
        const newResponses = data.messages.filter((msg) => !responses.some((r) => r.content === msg.content));
        setResponses([...responses, ...newResponses]);

        // Check if there's fetched data and add it to the responses
        if (data.fetchedData) {
            const fetchedDataMessage = {
                role: 'assistant',
                content: data.fetchedData.map(item => `Estate: ${item.title} - <a href="${item.link}" target="_blank">${item.link}</a>`).join('<br />')
            };
            setResponses(prevResponses => [...prevResponses, fetchedDataMessage]);
        }
    };

    return (
        <div className="App">
            <h1 className="app-title">ChatBot Program</h1>
            <div className="chat-box">
                {responses.map((res, index) => (
                    <div key={index} className={`message ${res.role}`} dangerouslySetInnerHTML={{ __html: `<strong>${res.role}:</strong> ${res.content}` }} />
                ))}
            </div>
            <div className="input-box">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default App;
