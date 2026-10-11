import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import NavBar from "@/components/NavBar";

export default function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      document.querySelector(location.hash)?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <NavBar />
      <Outlet />
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div>
            <Link className="site-footer__name" to="/">
              IS-HAQ ABDUL-MOOMIN
            </Link>
            <p>Software engineer · Ghana</p>
          </div>
          <nav aria-label="Footer navigation" className="site-footer__links">
            <Link to="/projects">Projects</Link>
            <Link to="/experience">Experience</Link>
            <Link to="/newsletter">Newsletter</Link>
            <a href="mailto:abdulmoominishaq21@gmail.com">Email</a>
          </nav>
          <span className="site-footer__copyright">
            © {new Date().getFullYear()} IS-HAQ ABDUL-MOOMIN
          </span>
        </div>
      </footer>
    </div>
  );
}
