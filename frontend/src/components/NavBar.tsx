import { Link, NavLink } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/experience", label: "Experience" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
];

export default function NavBar() {
  return (
    <header className="site-header">
      <div className="site-header__row">
        <Link to="/" className="site-brand" aria-label="IS-HAQ ABDUL-MOOMIN, home">
          IS-HAQ <span>ABDUL-MOOMIN</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `site-nav__link${isActive ? " is-active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/contact" className="site-nav__contact">
            Get in touch
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
