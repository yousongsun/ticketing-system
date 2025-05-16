import type React from 'react';
import { useState } from 'react';
import { Link, Route, Routes } from 'react-router';
import { Button } from './components/Button';
import { Menu } from './components/Menu';

import { useDispatch, useSelector } from 'react-redux';
import { decrement, increment } from './redux/slices/counterSlice';
import type { AppDispatch, RootState } from './redux/store';

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
              <Menu />
              <h1>Home</h1>
            </>
          }
        />
        <Route
          path="show"
          element={
            <>
              <Menu />
              <h1>Show</h1>
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
      </Routes>
    </>
  );
};

export default App;

