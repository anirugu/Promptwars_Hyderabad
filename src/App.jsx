import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar.jsx';
import Footer from './components/Layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import DestinationDetail from './pages/DestinationDetail.jsx';
import TripPlanner from './pages/TripPlanner.jsx';
import MyTrips from './pages/MyTrips.jsx';
import Recommendations from './pages/Recommendations.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/planner" element={<TripPlanner />} />
          <Route path="/planner/:id" element={<TripPlanner />} />
          <Route path="/trips" element={<MyTrips />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
