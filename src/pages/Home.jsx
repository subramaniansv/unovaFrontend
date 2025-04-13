import React, { useState, useEffect } from 'react';
import { FaCode, FaLaptopCode, FaPaintBrush, FaSearch, FaMobileAlt, FaRocket, FaLightbulb, FaCogs } from 'react-icons/fa';
import { SiTailwindcss, SiReact, SiFigma, SiMongodb } from 'react-icons/si';
import aboutImg from '../assets/aboutimg.png';
import { Helmet } from 'react-helmet';
import { Link } from "react-router-dom";  
import './home.css'
import AOS from 'aos';
import 'aos/dist/aos.css';

const phrases = ["Web Design", "Web Development", "UI/UX", "SEO Optimization", "Responsive Design"];

const Home = () => {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    AOS.init({ duration: 2000, once: true });
  }, []);
  
  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      setText((prev) =>
        isDeleting ? currentPhrase.substring(0, prev.length - 1) : currentPhrase.substring(0, prev.length + 1)
      );

      if (!isDeleting && text === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  return (
    <>
     <Helmet>
        <title>Home | Unova</title>
        <meta name="description" content="Welcome to our homepage. Discover our services and portfolio." />
        <meta name="keywords" content="web development, SEO, React, Unova" />
        <meta property="og:title" content="Your Brand Name" />
        <meta property="og:description" content="High-performance websites tailored for your business." />
        <meta property="og:type" content="website" />
      </Helmet>
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center py-24 px-4" data-aos="fade-up">
      <h1 className="text-5xl sm:text-7xl font-extrabold text-center text-gradient bg-gradient-to-r from-purple-600 to-cyan-400">
          Welcome to UNOVA
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-400 text-center max-w-xl">
          Building innovative websites with cutting-edge technology.
        </p>
        <div className="mt-6 h-10">
          <p className="text-xl sm:text-2xl font-semibold text-purple-400">
            {text}
            <span className="border-r-2 border-purple-400 animate-pulse ml-1" />
          </p>
        </div>
        <div className="mt-8">

        <div className="button">
  <Link to="/contact">Contact us</Link> 
</div>


        </div>
      </section>

      {/* Services Preview */}
      <section className="py-10 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white text-center px-6" data-aos="fade-up">
      <h2 className="text-3xl sm:text-4xl font-bold mb-12">Our Services</h2>
  <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
    {[
      {
        icon: <FaPaintBrush />,
        title: "Web Design",
        description: "Modern and aesthetic designs tailored to reflect your brand identity."
      },
      {
        icon: <FaLaptopCode />,
        title: "Web Development",
        description: "Fully responsive and scalable websites built using the latest tech."
      },
      {
        icon: <FaMobileAlt />,
        title: "Responsive Design",
        description: "Flawless experience across all devices – desktop, tablet, or mobile."
      },
      {
        icon: <FaSearch />,
        title: "SEO Optimization",
        description: "Improve visibility and boost your rankings on search engines."
      },
      {
        icon: <FaRocket />,
        title: "Performance Optimization",
        description: "Ensure fast load times and optimized performance for better UX."
      },
      {
        icon: <FaLightbulb />,
        title: "UI/UX Strategy",
        description: "Create intuitive interfaces with seamless user experiences."
      },
    ].map(({ icon, title, description }, idx) => (
      <div
        key={idx}
        className="bg-black border border-gray-700 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center hover:scale-105 transition-all duration-300"
      >
        <div className="text-purple-400 text-5xl mb-4">{icon}</div>
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    ))}
  </div>
</section>


      {/* Why Choose Us */}
      <section className="py-10 px-6 bg-black text-center text-white" data-aos="fade-up">

  <h2 className="text-3xl sm:text-4xl font-bold mb-10">Why Choose Us?</h2>
  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
    {[
      {
        icon: <FaCogs />,
        title: "Custom-Built Solutions",
        description: "We tailor every project to meet your unique business needs."
      },
      {
        icon: <FaRocket />,
        title: "Fast & Scalable",
        description: "High-performance websites that scale with your growth."
      },
      {
        icon: <FaPaintBrush />,
        title: "Modern Aesthetics",
        description: "Designs that impress, built with creativity and precision."
      },
      {
        icon: <FaSearch />,
        title: "SEO & Performance Ready",
        description: "Optimized for speed and discoverability on all platforms."
      }
    ].map(({ icon, title, description }, idx) => (
      <div
        key={idx}
        className="p-6 border border-gray-700 rounded-lg hover:bg-indigo-950 transition flex flex-col items-center text-center"
      >
        <div className="text-purple-500 text-4xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    ))}
  </div>
</section>

      {/* About Us */}
      <section className="py-10 px-6 text-white bg-gradient-to-r from-indigo-800 to-indigo-900" data-aos="fade-right">

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">About UNOVA</h2>
            <p className="text-gray-300 text-lg">
              We are a creative tech team passionate about delivering modern, high-performance websites and digital experiences. At UNOVA, we blend innovation, aesthetics, and functionality to help businesses thrive online.
            </p>
          </div>
          <div className="md:w-1/2">
            <img src={aboutImg} alt="About" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-10 text-center bg-black text-white" data-aos="zoom-in">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Elevate Your Brand?</h2>
        <p className="text-lg text-gray-400 mb-6">Let’s collaborate to bring your vision to life.</p>
        <button className="button">
         <Link to='/contact'>Contact Us</Link> 
        </button>
      </section>

      {/* Tech Stack */}
      <section className="py-10 bg-gradient-to-r from-indigo-950 to-black text-center text-white px-6" data-aos="fade-up">
      <h2 className="text-3xl sm:text-4xl font-bold mb-10">Our Tech Stack</h2>
        <div className="flex flex-wrap justify-center gap-10 text-4xl text-cyan-400">
          <SiReact title="React.js" />
          <SiTailwindcss title="Tailwind CSS" />
          <SiFigma title="Figma" />
          
          <SiMongodb title="MongoDB" />
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;
