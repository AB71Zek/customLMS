'use client';
import "bootstrap/dist/css/bootstrap.min.css";
import { useRef, useState } from "react";
import Footer from './Components/Footer';
import Header from './Components/header';

const images = [
  {
    src: "https://media.geeksforgeeks.org/wp-content/uploads/20211213172224/1.png",
    alt: "One Image",
    captionTitle: "One Image",
    captionText: "Image 1 from GeeksforGeeks without 403 Error Protection"
  },
  {
    src: "https://media.geeksforgeeks.org/wp-content/uploads/20211213172225/2.png",
    alt: "Two Image",
    captionTitle: "Two Image",
    captionText: "Image 2 from GeeksforGeeks without 403 Error Protection"
  },
  {
    src: "https://media.geeksforgeeks.org/wp-content/uploads/20211213172226/3.png",
    alt: "Image 3",
    captionTitle: "Image 3",
    captionText: "Image 3 from GeeksforGeeks without 403 Error Protection"
  }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  
  // Handle the previous slide using the carousel API from Bootstrap
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // Handle the next slide using the carousel API from Bootstrap
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // Handle dot click to change the slide
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="container" style={{ backgroundColor: "black", padding: "0", marginBottom: "100px" }}>
      {/* Top Bar - Student Number, Title, Toggle Button */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        padding: "15px 20px",
        zIndex: 1001,
        borderBottom: "2px solid #007bff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        {/* Left - Student Number */}
        <div style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "8px 15px",
          borderRadius: "20px",
          border: "2px solid #007bff"
        }}>
          <span style={{
            color: "#007bff",
            fontWeight: "bold",
            fontSize: "16px"
          }}>
            Student No: 21406232
          </span>
        </div>

        {/* Center - MOODLE LMS Title */}
        <div>
          <h1 style={{
            color: "#007bff",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            margin: 0
          }}>
            MOODLE LMS
          </h1>
        </div>

        {/* Right - Light/Dark Mode Toggle Button */}
        <div>
          <button 
            className="btn btn-outline-primary"
            style={{
              borderColor: "#007bff",
              color: "#007bff",
              padding: "10px 20px",
              borderRadius: "25px",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            🌙 Dark Mode
          </button>
        </div>
      </div>

      <Header />
      
      <div style={{ marginTop: "140px" }}>
        <div
          id="myCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          ref={carouselRef}
          style={{ position: "relative" }}
        >
          {/* Indicators (Dots) */}
          <ol className="carousel-indicators">
            {images.map((_, index) => (
              <li
                key={index}
                data-bs-target="#myCarousel"
                data-bs-slide-to={index}
                className={index === currentIndex ? "active" : ""}
                onClick={() => handleDotClick(index)}
                style={{
                  backgroundColor: index === currentIndex ? "#007bff" : "#bbb",
                  borderRadius: "50%",
                  width: "15px",
                  height: "15px",
                  margin: "0 5px",
                  cursor: "pointer"
                }}
              ></li>
            ))}
          </ol>

          {/* Wrapper for slides */}
          <div className="carousel-inner" role="listbox">
            {images.map((image, index) => (
              <div
                key={index}
                className={`carousel-item ${index === currentIndex ? "active" : ""}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width="200"
                  height="300"
                  className="d-block w-70 mx-auto"
                />
                <div className="carousel-caption" style={{ color: "white" }}>
                  <h3>{image.captionTitle}</h3>
                  <p>{image.captionText}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Left (Prev) and Right (Next) Controls */}
          <a
            className="carousel-control-prev"
            href="#myCarousel"
            role="button"
            data-bs-slide="prev"
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            style={{
              position: "absolute",
              top: "50%",
              left: "0",
              transform: "translateY(-50%)",
              zIndex: 10,
              backgroundColor: "black",
              borderRadius: "50%",
              padding: "10px",
              color: "white",
            }}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></span>
            <span className="sr-only">Previous</span>
          </a>

          <a
            className="carousel-control-next"
            href="#myCarousel"
            role="button"
            data-bs-slide="next"
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            style={{
              position: "absolute",
              top: "50%",
              right: "0",
              transform: "translateY(-50%)",
              zIndex: 10,
              backgroundColor: "black",
              borderRadius: "50%",
              padding: "10px",
              color: "white",
            }}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
              style={{
                backgroundColor: "white",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22%23fff%22 viewBox=%220 0 24 24%22 width=%2224%22 height=%2224%22%3E%3Cpath d=%22M9.41 7.41L14.83 12l-5.42 4.59L10.83 18l7-6-7-6z%22/%3E%3C/svg%3E')",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
        <div>
          <h1>Welcome to My Next.js App</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
} 