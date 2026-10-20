
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

export default function App() {
  return (
    <>
      <Navbar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
       <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <footer className="footer">
        ReleafBook - a college project. Fictional sample data only.
      </footer>
    </>
  );
}
