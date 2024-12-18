import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadOptions } from './services/OptionsService';
import Home from './pages/Home';
import './styles/darkMode.css';

//localStorage.clear(); 

const App: React.FC = () => {
    
    useEffect(() => {
        const options = loadOptions();
        const darkModeOption = options.find(option => option.name === 'Dunkelmodus');
        const themeMetaTag = document.querySelector('meta[name="theme-color"]');
        if (darkModeOption && darkModeOption.isOn) {
            document.body.classList.add('dark-mode');
            if (themeMetaTag) {
                themeMetaTag.setAttribute('content', '#1a202c');
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (themeMetaTag) {
                themeMetaTag.setAttribute('content', '#ffffff');
            }
        }
    }, []);
    
    return (
        <Router basename="/4mal4-spiel">
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
