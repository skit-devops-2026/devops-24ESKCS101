import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </main>
      <footer className="footer">ReleafBook - a college project. Fictional sample data only.</footer>
    </>
  );
}
