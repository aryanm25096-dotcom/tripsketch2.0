import { useEffect, useRef, useState } from 'react';
import './index.css';
import Dashboard from './components/Dashboard';

const FRAME_COUNT = 64;

// Helper to get image path from public folder
const currentFrame = index => `/frames/ezgif-frame-${index.toString().padStart(3, '0')}.png`;

function App() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isExploring, setIsExploring] = useState(false);

  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          // Keep it visible once revealed for a smoother experience
          // entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.15 });

    // Small timeout to ensure DOM is ready and loader is gone
    setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, [loaded]);

  // Image preloading
  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      const loadedImages = new Array(FRAME_COUNT);
      
      const promises = Array.from({ length: FRAME_COUNT }).map((_, i) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = currentFrame(i + 1);
          img.onload = () => {
            loadedImages[i] = img;
            resolve();
          };
          img.onerror = () => resolve();
        });
      });
      
      await Promise.all(promises);
      
      if (isMounted) {
        setImages(loadedImages.filter(Boolean));
        setLoaded(true);
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  // Canvas animation logic
  useEffect(() => {
    if (!loaded || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    
    let animationFrameId;
    let targetFrame = 0;
    let currentRenderedFrame = 0;

    const drawImage = (img) => {
       if (!img) return;
       const canvasRatio = canvas.width / canvas.height;
       const imgRatio = img.width / img.height;
       let renderWidth, renderHeight, x, y;

       if (canvasRatio > imgRatio) {
          renderWidth = canvas.width;
          renderHeight = canvas.width / imgRatio;
          x = 0;
          y = (canvas.height - renderHeight) / 2;
       } else {
          renderWidth = canvas.height * imgRatio;
          renderHeight = canvas.height;
          x = (canvas.width - renderWidth) / 2;
          y = 0;
       }
       
       context.clearRect(0, 0, canvas.width, canvas.height);
       context.drawImage(img, x, y, renderWidth, renderHeight);
    };

    const handleResize = () => {
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;
       const frameIndex = Math.min(images.length - 1, Math.round(currentRenderedFrame));
       if (images[frameIndex]) {
         drawImage(images[frameIndex]);
       }
    };

    // Initial sizing and draw
    handleResize();

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.scrollHeight - window.innerHeight;
      
      let scrollY = window.scrollY - containerTop;
      scrollY = Math.max(0, Math.min(scrollY, containerHeight));
      
      const scrollFraction = scrollY / containerHeight;
      targetFrame = Math.min(
        images.length - 1,
        Math.floor(scrollFraction * images.length)
      );
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    const updateCanvas = () => {
      // Smooth interpolation for cinematic pacing
      currentRenderedFrame += (targetFrame - currentRenderedFrame) * 0.08;
      
      const frameIndex = Math.min(images.length - 1, Math.round(currentRenderedFrame));
      if (images[frameIndex]) {
        drawImage(images[frameIndex]);
      }
      
      animationFrameId = requestAnimationFrame(updateCanvas);
    };

    updateCanvas();
    handleScroll(); // Trigger once to set initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [loaded, images, isExploring]);

  if (isExploring) {
    return <Dashboard />;
  }

  return (
    <div className="app-container">
      {/* Loading state */}
      <div className={`loader-wrapper ${loaded ? 'hidden' : ''}`}>
        <div className="spinner"></div>
        <p>Preparing your journey...</p>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">TripSketch</div>
        <div className="nav-links">
          <a href="#destinations">Destinations</a>
          <a href="#experiences">Experiences</a>
          <a href="#journal">Journal</a>
        </div>
        <button className="nav-cta">Book Now</button>
      </nav>

      {/* Scroll Sequence Section */}
      <div className="scroll-sequence" ref={containerRef}>
        <div className={`canvas-container ${loaded ? 'loaded' : ''}`}>
          <canvas ref={canvasRef} />
          <div className="vignette-overlay"></div>
          <div className="bottom-gradient"></div>
        </div>

        {/* Story Text Sections */}
        <section className="story-section scene-1">
          <div className="text-content reveal">
            <h1>Not every trip starts with a destination.</h1>
          </div>
        </section>

        <section className="story-section scene-2">
          <div className="text-content right reveal">
            <h1>Some start with curiosity.</h1>
          </div>
        </section>

        <section className="story-section scene-3">
          <div className="text-content reveal">
            <h1>Discover places that actually match your vibe.</h1>
          </div>
        </section>

        <section className="story-section scene-4">
          <div className="final-cta reveal">
            <h1 className="brand-title">TripSketch</h1>
            <p className="subheadline">Find hidden gems, offbeat stays, and journeys worth remembering.</p>
            <button className="primary-cta" onClick={() => {
              window.scrollTo(0, 0);
              setIsExploring(true);
            }}>Start Exploring</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
