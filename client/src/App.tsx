import { Routes, Route } from 'react-router-dom';
import LogInPage from './pages/LogInPage';
import HomePage from './pages/HomePage';

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<LogInPage/>} />
            <Route path="/" element={<HomePage/>} />
        </Routes>
    );
};

export default App;
