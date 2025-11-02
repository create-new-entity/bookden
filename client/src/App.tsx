import { Routes, Route } from 'react-router-dom';
import LogInPage from './pages/LogInPage';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/auth" element={<LogInPage/>} />
                <Route path="/" element={<HomePage/>} />
            </Routes>
            <NavBar/>
        </>
    );
};

export default App;
