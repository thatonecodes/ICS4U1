import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [predictedCount, setPredictedCount] = useState(0);
  const [throttled, setThrottled] = useState(false);

  // Predictive throttle logic
  useEffect(() => {
    if (throttled) {
      const timer = setTimeout(() => {
        setThrottled(false);
      }, 1000); // 1-second throttle delay
      return () => clearTimeout(timer);
    }
  }, [throttled]);

  const handleClick = () => {
    if (!throttled) {
      setCount((prev) => prev + 1);
      setPredictedCount((prev) => prev + 1); // Predict the next count
      setThrottled(true);
    }
  };

  return (
    <>
      <section id="center">
        <div>
          <h1>Predictive Throttle Algorithm</h1>
          <p>
            This app demonstrates a predictive throttle algorithm. The button
            click is throttled to prevent rapid updates, and the next count is
            predicted.
          </p>
        </div>
        <button className="counter" onClick={handleClick}>
          Count is {count}
        </button>
        <div className="prediction">
          <p>Predicted next count: {predictedCount + 1}</p>
        </div>
      </section>

      <section id="next-steps">
        <div id="docs">
          <h2>How it works</h2>
          <p>
            The algorithm throttles button clicks to one per second. It also
            predicts the next count value based on the current state.
          </p>
        </div>
      </section>
    </>
  );
}

export default App;
