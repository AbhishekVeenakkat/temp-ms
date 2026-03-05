import { Link } from "react-router-dom";
import {
  Phone,
  MapPin,
  Mail,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About Us", id: "about" },
    { label: "Our Doctors", id: "doctors" },
    { label: "Services", id: "services" },
    { label: "Facilities", id: "facilities" },
  ];

  return (
    <footer className="footer" id="contact">
      <div className="footer__inner">
        <div className="footer__top">
          {/* Brand */}
          <div>
            <div className="footer__brand-name">Manassanthi Hospital</div>
            <div className="footer__brand-tag">
              Compassionate Mental Healthcare
            </div>
            <div style={{ marginTop: "12px", marginBottom: "12px" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 700,
                  padding: "6px 12px",
                  background: "rgba(104,220,227,0.15)",
                  border: "1px solid rgba(104,220,227,0.3)",
                  borderRadius: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                An ISO 9001:2015 Certified Hospital
              </span>
            </div>
            <p className="footer__brand-desc">
              Providing safe, ethical, and evidence-based psychiatric care in a
              calm healing environment — licensed in compliance with the Mental
              Healthcare Act (MHCA), 2017.
            </p>
            <div className="footer__socials">
              <a
                href="#"
                className="footer__social-link"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="footer__col-title">Navigation</div>
            <ul className="footer__links">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <span
                    className="footer__link"
                    onClick={() => onNavigate(l.id)}
                  >
                    {l.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* More Section */}
          <div>
            <div className="footer__col-title">More</div>
            <ul className="footer__links">
              <li>
                <Link to="/book-appointment" className="footer__link">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/ask-doctor" className="footer__link">
                  Ask Doctor
                </Link>
              </li>
              <li>
                <Link to="/media" className="footer__link">
                  Media
                </Link>
              </li>
              <li>
                <Link to="/feed" className="footer__link">
                  Feed
                </Link>
              </li>
              <li>
                <Link to="/blog" className="footer__link">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="footer__col-title">Contact</div>
            <div className="footer__contact-item">
              <MapPin size={16} className="footer__contact-icon" />
              <span>
                Kaithakunda, Ramanattukara (Airport Road), Kerala, India
              </span>
            </div>
            <div className="footer__contact-item">
              <Phone size={16} className="footer__contact-icon" />
              <span>0483 279 4451 / 279 4452</span>
            </div>
            <div className="footer__contact-item">
              <Mail size={16} className="footer__contact-icon" />
              <span>dr.aneesmanassanthi@gmail.com</span>
            </div>
            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                background: "rgba(104,220,227,0.1)",
                borderRadius: "10px",
                border: "1px solid rgba(104,220,227,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "4px",
                }}
              >
                Overseas Consultations
              </div>
              <div
                style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}
              >
                Sharjah & Doha — 1st Wed–Sat each month
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            © {new Date().getFullYear()} Manassanthi Hospitals. All rights
            reserved.
          </div>
          <div className="footer__mhca">Licensed under MHCA 2017</div>
        </div>
      </div>
    </footer>
  );
}
