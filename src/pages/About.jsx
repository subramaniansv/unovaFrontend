import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import { FaCogs, FaRocket, FaPalette, FaSearch } from "react-icons/fa";
import { Helmet } from 'react-helmet';
const About = () => {
  useEffect(() => {
    AOS.init({ duration: 2000, once: true });
  }, []);

  return (
    <>
     <Helmet>
        <title>About | Unova</title>
        <meta name="description" content="Learn more about Unova — who we are, our mission, and what drives our innovation." />
        <meta name="keywords" content="About Unova, web experts, company mission, software company" />
        <meta property="og:title" content="About Us - Unova" />
        <meta property="og:description" content="We are passionate developers and designers helping businesses grow digitally." />
        <meta property="og:type" content="website" />
      </Helmet>
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="py-20 text-left px-6" data-aos="fade-up">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Unova: Building the Future of Web Development
        </h2>
        <p className="text-lg sm:text-xl text-gray-400 mb-6 max-w-3xl">
          Founded in January 2025 by passionate students, Unova's mission is to
          provide fast, modern websites and web applications at affordable
          prices, while maintaining world-class quality. We use AI-driven
          technologies and ensure top-notch SEO optimization for every project
          we work on.
        </p>
      </section>
      {/* Our Services */}
      <section className="py-10 px-6 text-left" data-aos="fade-up">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          What We Do
        </h2>
        <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl">
          We offer comprehensive web design and development solutions tailored to
          your business needs.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Web Design", desc: "Creating responsive, beautiful, and user-friendly websites." },
            { title: "Web Development", desc: "Building fast, scalable, and secure web applications." },
            { title: "AI Integration", desc: "Leveraging AI technologies to make your web solutions smarter." },
            { title: "SEO Optimization", desc: "Ensuring your website ranks higher and attracts more traffic." },
          ].map(({ title, desc }, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-gray-700 p-6 rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
            >
              <h3 className="text-xl font-semibold text-purple-400 mb-2">{title}</h3>
              <p className="text-lg text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
<section className="py-10 px-6 text-left" data-aos="fade-up">
  <h2 className="text-3xl sm:text-4xl font-bold mb-8">Why Choose Us?</h2>
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {[
      {
        icon: <FaCogs className="text-purple-400 text-3xl mr-3" />,
        title: "Custom-Built Solutions",
        desc: "Tailored software designed specifically for your brand and needs.",
      },
      {
        icon: <FaRocket className="text-purple-400 text-3xl mr-3" />,
        title: "Fast & Scalable",
        desc: "High-performance architecture that grows with your business.",
      },
      {
        icon: <FaPalette className="text-purple-400 text-3xl mr-3" />,
        title: "Modern Aesthetics",
        desc: "Beautiful, intuitive UI/UX that engages users and builds trust.",
      },
      {
        icon: <FaSearch className="text-purple-400 text-3xl mr-3" />,
        title: "SEO & Performance Ready",
        desc: "Optimized for speed and visibility to boost online presence.",
      },
    ].map(({ icon, title, desc }, idx) => (
      <div
        key={idx}
        className="p-6 border border-gray-700 rounded-lg hover:bg-indigo-950 transition"
        data-aos="fade-up"
        data-aos-delay={idx * 150}
      >
        <div className="flex items-center mb-2">
          {icon}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>
    ))}
  </div>
</section>


      {/* Contact Us CTA */}
      <section
        className="pt-10 px-6 text-center bg-gradient-to-r from-indigo-900 to-indigo-950"
        data-aos="fade-up"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Elevate Your Brand?
        </h2>
        <p className="text-lg text-gray-400 mb-6">
          Let’s collaborate to bring your vision to life.
        </p>
        <Link to="/contact">
          <button className="bg-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300">
            Contact Us
          </button>
        </Link>
      </section>
    </div>
    </>
  );
};

export default About;
