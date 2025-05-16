import type React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route, Routes } from 'react-router';
import { Button } from './components/Button';
import { Menu } from './components/Menu';
import HomePage from './pages/Home';
import { decrement, increment } from './redux/slices/counterSlice';
import type { AppDispatch, RootState } from './redux/store';

import { SponsorPage } from './pages/SponsorPage';

const App: React.FC = () => {
  const [buttonText, setButtonText] = useState('Click Me');

  const dispatch = useDispatch<AppDispatch>();
  const count = useSelector((state: RootState) => state.counter.value);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Menu onBuyPage={false} />
              <HomePage />
            </>
          }
        />
        <Route
          path="show"
          element={
            <>
              <Menu onBuyPage={false} />
              <h1>Show</h1>
            </>
          }
        />
        <Route
          path="gallery"
          element={
            <>
              <Menu onBuyPage={false} />
              <h1>Gallery</h1>
            </>
          }
        />
        <Route
          path="about"
          element={
            <>
              <Menu onBuyPage={false} />
              <h1>About</h1>
            </>
          }
        />
        <Route
          path="buy"
          element={
            <>
              <Menu onBuyPage={true} />
              <h1>Buy Tickets</h1>
              <Button
                onClick={() => setButtonText('Hello Auckland Med Revue!')}
              >
                {buttonText}
              </Button>
              <h1>Counter: {count}</h1>
              <Button type="button" onClick={() => dispatch(increment())}>
                Increment
              </Button>
              <Button type="button" onClick={() => dispatch(decrement())}>
                Decrement
              </Button>
            </>
          }
        />
        <Route
          path="sponsor"
          element={
            <>
              <Menu onBuyPage={false} />
              <SponsorPage />
            </>
          }
        />
      </Routes>
    </>
  );
};

export default App;
