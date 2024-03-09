import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Footer from './components/Footer';
import Student from './components/Student';
import { io } from 'socket.io-client';
import ProblemViewer from './components/tools/ProblemViewer';
import { useEffect } from 'react';

const socket = io.connect(`ws://52.78.213.172:13333`);
function App() {
    useEffect(() => {
        sessionStorage.clear();
        sessionStorage.setItem('serverIP', 'http://15.165.123.208:8000/');
    }, []);
    return (
        <Router>
            <div className="home-section">
                <Routes>
                    <Route path="/" element={<Login socket={socket} />}></Route>
                    <Route path="/student" element={<Student />}></Route>
                    <Route path="/tools/problem" element={<ProblemViewer />}></Route>
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}

export default App;
