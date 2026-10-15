import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MyPlants from './pages/MyPlants';
import PlantForm from './pages/PlantForm';
import PlantDetail from './pages/PlantDetail';
import CareSchedule from './pages/CareSchedule';
import CareHistory from './pages/CareHistory';
import PlantGuide from './pages/PlantGuide';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/plants" element={<MyPlants />} />
            <Route path="/plants/new" element={<PlantForm />} />
            <Route path="/plants/:id" element={<PlantDetail />} />
            <Route path="/plants/:id/edit" element={<PlantForm />} />
            <Route path="/schedule" element={<CareSchedule />} />
            <Route path="/history" element={<CareHistory />} />
            <Route path="/guide" element={<PlantGuide />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
