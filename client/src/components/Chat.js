import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import axiosInstance from '../API/axiosInstance';

const Chat = ({ channel }) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  if (!channel) {
    return <div className="chat-container">No channel selected</div>;
  }

  useEffect(() => {
    const fetchMessages = async () => {
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not available.');

        const response = await axiosInstance.get(`/api/messages/channels/${channel._id}/`);
        setMessages(response.data);
      } catch (error) {
        setError(`Error fetching messages: ${error.response?.data?.message || error.message}`);
      }
    };

    if (channel) {
      fetchMessages();
    }
  }, [channel]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not available.');
      if (!newMessage.trim()) throw new Error('Message content is required.');

      const messagePayload = {
        channel_id: channel._id,
        content: newMessage,
        user_id: channel.creator_id,
      };

      const response = await axiosInstance.post(`/api/messages/channels/${channel._id}/send`, messagePayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage('');
    } catch (error) {
      setError(`Error sending message: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not available.');

      await axiosInstance.delete(`/api/messages/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId));
    } catch (error) {
      setError(`Error deleting message: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (error) {
    return <div className="chat-container">Error: {error}</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        {channel.name}
      </div>
      <ul className="message-list">
        {messages.length > 0 ? (
          messages.map((message) => (
            <li key={message._id} className="message-item">
              <div className="message-details">
                <p className="message-content">{message.content}</p>
                <div className="message-metadata">
                  <p>{`Creator ID: ${channel.creator_id}`}</p>
                  <p>{`Created At: ${new Date(message.created_at).toLocaleString()}`}</p>
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteMessage(message._id)}
                >
                  x
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No messages available</p>
        )}
        <div ref={messagesEndRef} />
      </ul>
      <form className="send-message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
