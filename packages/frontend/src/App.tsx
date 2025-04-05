import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router';
import { Button } from './components/Button';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './redux/store';
import { increment, decrement } from './redux/slices/counterSlice';

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
          }
        />
      </Routes>
    </>
  );
};

export default App;
