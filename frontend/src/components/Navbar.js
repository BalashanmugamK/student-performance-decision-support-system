import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/analytics">Analytics</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/upload">Upload</Link>
    </div>
  );
}

export default Navbar;
