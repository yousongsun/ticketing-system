import React from 'react';
import { Routes, Route, Link } from 'react-router';
import Button from './components/common/Button';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Link to="/">
              <Button>Hello Auckland Med Revue!</Button>
            </Link>
          }
        />
      </Routes>
    </>
  );
};

export default App;
