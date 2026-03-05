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
            <img 
              src="/manassanthi_full_white.png" 
              alt="Manassanthi Hospital" 
              style={{
                height: 'auto',
                width: '260px',
                marginBottom: '16px'
              }}
            />
            <div className="footer__iso-wrapper">
              <span className="footer__iso-badge">
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
          <div className="footer__column">
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
          <div className="footer__column">
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
          <div className="footer__column">
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
            <div className="footer__overseas-box">
              <div className="footer__overseas-label">
                Overseas Consultations
              </div>
              <div className="footer__overseas-text">
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
