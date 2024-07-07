import React, { useState } from 'react';
import './App.css';
import EventCalendar from './components/EventCalendar';
import Forum from './components/Forum';
import LocalBusinesses from './components/LocalBusinesses';
import Authentication from './components/Authentication';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('calendar'); // Added state for active tab

  const handleAuthStateChange = (user) => {
    setUser(user);
  };

  const renderContent = () => {
    if (!user) return <p>Bitte melde dich an, um die Funktionen zu nutzen.</p>;
    switch (activeTab) {
      case 'calendar':
        return <EventCalendar />;
      case 'forum':
        return <Forum />;
      case 'businesses':
        return <LocalBusinesses />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Neighborhood Connect</h1>
      </header>
      <main className="App-main">
        <Authentication onAuthStateChange={handleAuthStateChange} />
        {user && (
          <>
            <nav className="App-nav">
              <button onClick={() => setActiveTab('calendar')} className={activeTab === 'calendar' ? 'active' : ''}>Event Calendar</button>
              <button onClick={() => setActiveTab('forum')} className={activeTab === 'forum' ? 'active' : ''}>Forum</button>
              <button onClick={() => setActiveTab('businesses')} className={activeTab === 'businesses' ? 'active' : ''}>Local Businesses</button>
            </nav>
            <div className="App-content">
              {renderContent()}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
