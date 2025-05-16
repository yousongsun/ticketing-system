import type React from 'react';
import { useState } from 'react';
import { Link, Route, Routes } from 'react-router';
import { Button } from './components/Button';
import Home from './pages/Home';

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
            /*
            <Link to="/">
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
            </Link>
            */
            <Home />
          }
        />
      </Routes>
    </>
  );
};

export default App;
