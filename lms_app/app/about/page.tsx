'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import HamburgerMenu from '../Components/hamburgerMenu';

export default function About() {
  return (
    <div className="container" style={{ backgroundColor: "black", padding: "0", minHeight: "100vh" }}>
      <br />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center text-white">
            <HamburgerMenu />
            <h1 className="display-4 mb-4">About Us</h1>
            <div className="card bg-dark text-white border-secondary mb-4">
              <div className="card-body">
                <h2 className="card-title">Our Story</h2>
                <p className="card-text">
                  Welcome to our Learning Management System (LMS). We are passionate about education 
                  and technology, committed to providing innovative solutions for modern learning needs.
                </p>
              </div>
            </div>
            
            <div className="card bg-dark text-white border-secondary mb-4">
              <div className="card-body">
                <h2 className="card-title">Our Mission</h2>
                <p className="card-text">
                  To empower educators and learners with cutting-edge tools and platforms that 
                  enhance the educational experience and make learning accessible to everyone.
                </p>
              </div>
            </div>
            
            <div className="card bg-dark text-white border-secondary mb-4">
              <div className="card-body">
                <h2 className="card-title">What We Do</h2>
                <p className="card-text">
                  We develop and maintain comprehensive learning management systems that integrate 
                  seamlessly with modern educational workflows, providing both students and teachers 
                  with the tools they need to succeed.
                </p>
              </div>
            </div>
            
            <div className="card bg-dark text-white border-secondary">
              <div className="card-body">
                <h2 className="card-title">Get in Touch</h2>
                <p className="card-text">
                  Ready to transform your learning experience? Contact us to learn more about 
                  how our LMS can benefit your educational institution.
                </p>
                <a href="/contact" className="btn btn-primary">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 