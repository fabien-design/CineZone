import { Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies/:id" element={<DetailPage />} />
    </Routes>
  );
}

export default App;
