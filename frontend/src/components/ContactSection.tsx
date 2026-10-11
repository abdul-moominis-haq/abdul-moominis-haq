import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const ContactSection = () => (
  <section id="contact" className="print-section contact-section">
    <div className="section-inner">
      <div className="contact-section__intro">
        <h2>Have a project in mind?</h2>
        <p className="print-label">Correspondence</p>
        <p>
          Reach out to discuss software engineering, applied AI and IoT, or a
          new opportunity.
        </p>
      </div>

      <div className="contact-register">
        <a href="mailto:abdulmoominishaq21@gmail.com">
          <span>Email</span>
          <strong>abdulmoominishaq21@gmail.com</strong>
          <ArrowUpRight aria-hidden="true" size={16} />
        </a>
        <a href="tel:+233249819285">
          <span>Phone</span>
          <strong>+233 249 819 285</strong>
          <ArrowUpRight aria-hidden="true" size={16} />
        </a>
        <a
          href="https://github.com/abdul-moominis-haq"
          target="_blank"
          rel="noreferrer"
        >
          <span>GitHub</span>
          <strong>Project code and contributions</strong>
          <ArrowUpRight aria-hidden="true" size={16} />
        </a>
        <a
          href="https://www.linkedin.com/in/ishaqabdulmoomin/"
          target="_blank"
          rel="noreferrer"
        >
          <span>LinkedIn</span>
          <strong>Professional profile</strong>
          <ArrowUpRight aria-hidden="true" size={16} />
        </a>
      </div>

      <div className="contact-section__actions">
        <Link className="action-link action-link--primary" to="/meeting">
          Request a meeting <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
        <a
          className="action-link"
          href="/IS_HAQ_ABDUL_MOOMIN_S_CV.pdf"
          download
        >
          Download CV <ArrowDown aria-hidden="true" size={16} />
        </a>
        <Link className="text-link" to="/newsletter">
          Newsletter <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </div>
  </section>
);

export default ContactSection;
