import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-lg">IS-HAQ ABDUL-MOOMIN</Link>
        <div className="flex items-center gap-4">
          <Link to="/about" className="text-sm">About</Link>
          <Link to="/experience" className="text-sm">Experience</Link>
          <Link to="/projects" className="text-sm">Projects</Link>
          <Link to="/skills" className="text-sm">Skills</Link>
          <Link to="/meeting" className="text-sm">Meet</Link>
          <Link to="/contact" className="text-sm">Contact</Link>
          <Link to="/newsletter" className="text-sm">Newsletter</Link>
        </div>
      </div>
    </nav>
  );
}
