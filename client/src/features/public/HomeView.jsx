import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  Camera,
  Clock3,
  Mail,
  MapPin,
  Mic2,
  Navigation,
  Users,
} from 'lucide-react';
import './icosstLanding.css';

const topics = [
  ['01', 'Computational Intelligence', 'Algorithms and methodologies in computational intelligence, machine learning and deep learning applications.'],
  ['02', 'Artificial Intelligence', 'Artificial intelligence for smart cities and urban management, neural language processing and computer vision.'],
  ['03', 'Cybersecurity', 'Threat detection, prevention, and response mechanisms, secure architecture for the Internet of Things and blockchain technology.'],
  ['04', 'Smart Cities', 'Smart infrastructure systems and mobility, sustainable energy management, green economy and community development.'],
  ['05', 'Cultural Heritage', 'Traditional values, archaeology, digital preservation, language and culture in the age of AI and technology.'],
  ['06', 'Business Intelligence', 'AI and Machine Learning for business, space-based communication systems, and strategies for emerging technologies.'],
];

const committee = [
  ['Prof. Dr. Shahid A. Raza', 'Patron in Chief', 'https://i.pravatar.cc/160?img=12'],
  ['Prof. Dr. Shahzad Asif', 'General Chair', 'https://i.pravatar.cc/160?img=11'],
  ['Dr. Yasir Saleem', 'General Co-Chair', 'https://i.pravatar.cc/160?img=13'],
  ['Kashif Bashir', 'Executive Chair', 'https://i.pravatar.cc/160?img=14'],
  ['Prof. Dr. Waqas Mahmood', 'Technical Program Committee', 'https://i.pravatar.cc/160?img=15'],
  ['Prof. Dr. Usman Ghani', 'Technical Program Committee', 'https://i.pravatar.cc/160?img=16'],
  ['Shahid Zulfiqar', 'Chair Publications Committee', 'https://i.pravatar.cc/160?img=17'],
  ['Farran Riaz', 'Chair Exhibition & Sponsorship', 'https://i.pravatar.cc/160?img=18'],
  ['Aqeel Baber', 'Chair Administration Committee', 'https://i.pravatar.cc/160?img=19'],
  ['Muhammad Hassan', 'Chair Website Committee', 'https://i.pravatar.cc/160?img=20'],
  ['Muhammad Ismael', 'Chair Finance Committee', 'https://i.pravatar.cc/160?img=21'],
];

function SectionTitle({ children }) {
  return <h2 className="section-title">[ {children} ]</h2>;
}

export function HomeView() {
  return (
    <main className="icosst-page-root">
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-content">
          <p className="eyebrow">International Conference on Open Source Systems &amp; Technologies</p>
          <h1><small>20<sup>th</sup></small> ICOSST <span>2026</span></h1>
          <strong>22–23 December 2026</strong>
          <p className="hero-subtitle">
            20th International Conference on Open<br className="desktop" /> Source Systems and Technologies
          </p>
          <em>(ICOSST 2026)</em>

          {/* Hero CTAs */}
          <div className="hero-cta-group">
            <Link to="/register" className="hero-cta-btn">
              Register Now <ArrowRight size={18} />
            </Link>
            <a href="#submissions" className="hero-secondary-btn">
              Call for Papers
            </a>
          </div>
        </div>

        <div className="hero-bottom">
          <span>Conference<br />Secretariat</span>
          <p>
            Al-Khawarizmi Institute of Computer Science (KICS),<br />
            University of Engineering and Technology (UET), Lahore, Pakistan
          </p>
          <b>IEEE · ComSoc · COMSATS</b>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="main-content-wrap">
        <div className="container">
          <div className="announcement">
            ICOSST 2026 has Initiated &mdash;{' '}
            <Link
              to="/register"
              style={{
                color: '#fcb900',
                textDecoration: 'underline',
                fontWeight: 'bold',
                marginLeft: '0.25rem',
              }}
            >
              Register Here
            </Link>
          </div>

          <div className="facts">
            <div>
              <MapPin />
              <span>Location<small>UET Lahore</small></span>
            </div>
            <div>
              <CalendarDays />
              <span>Date &amp; Time<small>22–23 December 2026</small></span>
            </div>
            <div>
              <Mic2 />
              <span>Speakers<small>IBA</small></span>
            </div>
            <div>
              <Users />
              <span>Seats<small>150</small></span>
            </div>
          </div>

          {/* Call for Paper Section */}
          <section id="submissions" className="call-paper">
            <SectionTitle>Call for Paper</SectionTitle>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link className="pill register-pill" to="/register">
                Register for Conference <ArrowRight size={14} />
              </Link>
              <a className="pill" href="#topics">Call for Paper</a>
            </div>

            <div className="timeline">
              {[
                ['Paper Submission Deadline', 'October 15, 2026', <Mail key="m" />],
                ['Acceptance/Non-Acceptance Notification', 'September 30, 2026', <ArrowRight key="a" />],
                ['Camera ready Submission', 'November 10, 2026', <Camera key="c" />],
              ].map(([title, date, icon]) => (
                <div className="milestone" key={title}>
                  <div className="milestone-icon">{icon}</div>
                  <h3>{title}</h3>
                  <small><CalendarDays />{date}</small>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link className="pill register-pill" to="/register">
                Attendee &amp; Author Registration
              </Link>
              <a className="pill" href="#contact">CMT Paper Submission</a>
            </div>
          </section>

          {/* Scope of the Conference */}
          <section id="about-us" className="copy-section">
            <SectionTitle>Scope of the Conference</SectionTitle>
            <p><b>19th International Conference on Open Source Systems and Technologies (ICOSST)</b></p>
            <p>
              ICOSST is an international conference on Open Source Systems and Technologies, offering a platform for the open-source community, researchers, and industry experts to exchange ideas, present innovative work and practices. ICOSST 2026 will help advance open-source technologies through cutting-edge research, novel applications, and industrial practices.
            </p>
          </section>

          {/* Topics of Interest */}
          <section id="topics" className="topics">
            <SectionTitle>Topics of Interest</SectionTitle>
            <p>
              Authors are invited to submit papers in the conference by submitting articles that illustrate research results, project outputs, surveys, and industrial experiences that describe significant advancements in Computer Science, AI and Information Technology.
            </p>
            <div className="topic-grid">
              {topics.map(([number, title, text]) => (
                <article className="topic-card" key={number}>
                  <span className="topic-num">{number}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Steering Committee */}
          <section id="committee" className="committee">
            <div className="announcement">Steering Committee</div>
            <div className="committee-grid">
              {committee.map(([name, role, image]) => (
                <article className="person" key={name}>
                  <div className="person-line" />
                  <img src={image} alt={`${name}, ${role}`} />
                  <h3>{name}</h3>
                  <p>{role}</p>
                </article>
              ))}
            </div>
          </section>

          {/* Sponsors */}
          <section className="sponsors">
            <SectionTitle>Our Sponsors</SectionTitle>
            <div className="sponsor-row">
              <span>IEEE<br /><b>COMPUTER SOCIETY</b></span>
              <span className="crest">✺</span>
              <span>⚙<br /><b>COMSATS</b></span>
            </div>
          </section>
        </div>
      </div>

      {/* Notice */}
      <section className="notice">
        <div>
          <b>⚠ Important</b>
          <p>
            The ICOSST 2026 website was used for managing the past event registration. This notice provides general information for attendees and participants.
          </p>
        </div>
      </section>

      {/* Map */}
      <div className="map">
        <div className="map-pin">
          <Navigation /> University of Engineering and Technology
        </div>
      </div>

      {/* Footer */}
      <div className="footer-wrapper">
        <footer id="contact">
          <div>
            <h2>ICOSST 2026</h2>
            <p>
              Conference Secretariat<br />
              KICS, UET Lahore<br />
              icosst@kics.edu.pk
            </p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <a href="#submissions">Call for Paper</a>
            <a href="#topics">Scope</a>
            <Link to="/register">Register Portal</Link>
          </div>
          <div>
            <h3>Useful Links</h3>
            <a href="#committee">Committee</a>
            <a href="#contact">Contact Us</a>
            <Link to="/login">Sign In</Link>
          </div>
          <div>
            <h3>Contact Info</h3>
            <p>
              <Mail size={13} style={{ display: 'inline', marginRight: 4 }} /> info@kics.edu.pk<br />
              <Clock3 size={13} style={{ display: 'inline', marginRight: 4 }} /> 042-99029227
            </p>
          </div>
          <small className="copyright">© Copyright ICOSST 2026. All rights reserved.</small>
        </footer>
      </div>
    </main>
  );
}

export default HomeView;
