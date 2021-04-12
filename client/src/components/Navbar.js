import { Link } from "react-router-dom";

function app() {
  return (
    <nav className="nav">
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    </nav>
  );
}

export default app;
