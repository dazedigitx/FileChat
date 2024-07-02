import React, { useState } from 'react';
import Channels from './Channels'; // Import Channels component
import './Sidebar.css'; // Adjust styles as needed
import './Style.css'; // Adjust styles as needed

const Sidebar = ({ isSidebarOpen, toggleSidebar, channels, onChannelSelect }) => {
    const [activeChannel, setActiveChannel] = useState(null);

    const handleChannelSelect = (channel) => {
        setActiveChannel(channel);
        onChannelSelect(channel); // Pass the selected channel to the Dashboard
    };

    return (
        <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                {isSidebarOpen ? 'Collapse' : '='}
            </button>
            <ul className="menu">
                <li>menu</li>
                <Channels onChannelSelect={handleChannelSelect} activeChannel={activeChannel} />
            </ul>
        </div>
    );
};

export default Sidebar;
