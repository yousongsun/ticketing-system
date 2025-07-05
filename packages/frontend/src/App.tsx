import type React from 'react';
import { Link, Route, Routes } from 'react-router';
import { Cookie } from './components/Cookie';
import { Footer } from './components/Footer';
import { LoadingComponent } from './components/LoadingComponent';
import { Menu } from './components/Menu';
import CancelPage from './pages/CancelPage';
import HomePage from './pages/Home';
import ReturnPolicyPage from './pages/ReturnPolicy';
import { SponsorPage } from './pages/SponsorPage';
import SuccessPage from './pages/SuccessPage';
import UserDetail from './pages/UserDetail';
import SeatSelectionPage from './pages/seat_selection';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Menu />
              <HomePage />
            </>
          }
        />
        <Route
          path="show"
          element={
            <>
              <Menu />
              <LoadingComponent />
            </>
          }
        />
        <Route
          path="gallery"
          element={
            <>
              <Menu />
              <h1>Gallery</h1>
            </>
          }
        />
        <Route
          path="about"
          element={
            <>
              <Menu />
              <h1>About</h1>
            </>
          }
        />
        <Route
          path="buy"
          element={
            <>
              <Menu />
              <SeatSelectionPage />
            </>
          }
        />
        <Route
          path="sponsors"
          element={
            <>
              <Menu />
              <SponsorPage />
            </>
          }
        />
        <Route
          path="/seat-selection"
          element={
            <Link to="/seat-selection">
              <SeatSelectionPage />
            </Link>
          }
        />
        <Route
          path="/user-detail"
          element={
            <>
              <Menu />
              <UserDetail />
            </>
          }
        />
        <Route
          path="/success"
          element={
            <>
              <Menu />
              <SuccessPage />
            </>
          }
        />
        <Route
          path="/cancel"
          element={
            <>
              <Menu />
              <CancelPage />
            </>
          }
        />
        <Route
          path="/return-policy"
          element={
            <>
              <Menu />
              <ReturnPolicyPage />
            </>
          }
        />
      </Routes>
      <Footer />
      <Cookie />
    </>
  );
};

export default App;
