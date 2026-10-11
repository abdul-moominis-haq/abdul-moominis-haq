import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <main id="main" className="not-found page-main">
      <p className="print-label">404 · No record at this address</p>
      <h1>Page not found.</h1>
      <Link className="text-link" to="/">
        Return to the portfolio
      </Link>
    </main>
  );
};

export default NotFound;
