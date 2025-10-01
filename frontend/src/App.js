import React, { useState } from 'react';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Signup from './components/signup';
import MainContent from './components/MainContent';
import Banner  from './components/Banner';
import Slider from './components/Slider';
import './css/main.css';
import './css/util.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css';
import Search from './components/Search';

function App() {
  const [currentView, setCurrentView] = useState('main');
  const [showSearch, setShowSearch] = useState(false);
  const switchToSignup = () => setCurrentView('signup');
  const switchToLogin = () => setCurrentView('login');
  const switchToMain = () => setCurrentView('main');

  return (
    <div className="App">
      <NavBar
        onSignIn={switchToLogin}
        onSignUp={switchToSignup}
        onLogoClick={switchToMain}
        onSearchClick ={() => setShowSearch(true)} //truyen props
      />
      <Search show={showSearch} onClose={() => setShowSearch(false)}/>
      <main>
        {currentView === 'main' && <MainContent />}
        {currentView === 'login' && <Login onSwitchToSignup={switchToSignup} />}
        {currentView === 'signup' && <Signup onSwitchToLogin={switchToLogin} />}
      </main>
      <Slider/>
      <Banner/>

    </div>
  );
}

export default App;