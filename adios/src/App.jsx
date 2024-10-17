import { useState } from "react";
import { Button } from "react-bootstrap";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Hello, world!</h1>
      <p>You clicked {count} times</p>
      <Button onClick={() => setCount(count + 1)}>Click me</Button>
    </>
  );
}

export default App;
