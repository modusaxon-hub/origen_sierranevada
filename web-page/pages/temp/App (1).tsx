import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SubscriptionPage from './pages/SubscriptionPage';
import BrewingGuidePage from './pages/BrewingGuidePage';
import AiLabPage from './pages/AiLabPage';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import { LanguageProvider } from './contexts/LanguageContext';

// Scroll to top wrapper
const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <HashRouter>
                <ScrollToTop />
                <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark font-body transition-colors duration-300">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/subscription" element={<SubscriptionPage />} />
                        <Route path="/guide" element={<BrewingGuidePage />} />
                        <Route path="/ai-lab" element={<AiLabPage />} />
                    </Routes>
                    <ChatWidget />
                </div>
            </HashRouter>
        </LanguageProvider>
    );
};

export default App;