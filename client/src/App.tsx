import { Routes, Route } from 'react-router-dom';
import LogIn from './pages/LogIn';
import HomePage from './pages/HomePage';

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<LogIn/>} />
            <Route path="/" element={<HomePage/>} />
        </Routes>
    );
};

export default App;
