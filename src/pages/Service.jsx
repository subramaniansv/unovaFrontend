import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCode, FaPaintBrush, FaRobot, FaSearch,
  FaMobileAlt, FaShoppingCart, FaTools
} from 'react-icons/fa';
import { FaMoneyBillWave, FaUserGraduate,  FaClock, FaGlobeAsia } from 'react-icons/fa'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Helmet } from 'react-helmet';
const Service = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
    <Helmet>
        <title>Services | Unova</title>
        <meta name="description" content="Explore the range of web development, design, and SEO services offered by Unova." />
        <meta name="keywords" content="Unova services, web development, design, SEO, digital solutions" />
        <meta property="og:title" content="Our Services - Unova" />
        <meta property="og:description" content="Custom-built websites, scalable solutions, and creative designs for your brand." />
        <meta property="og:type" content="website" />
      </Helmet>
    <div className="bg-black text-white px-6">
      {/* Page Title */}
      <section className="py-20 text-center" data-aos="fade-up">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Services</h1>
        <p className="text-lg sm:text-xl text-gray-400">
          Crafting Digital Experiences That Drive Results
        </p>
      </section>

      {/* What We Offer */}
      <section className="max-w-4xl mx-auto py-12" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-4">✨ What We Offer</h2>
        <p className="text-gray-300 text-lg">
          At <span className="text-purple-400 font-semibold">Unova</span>, we specialize in building fast, modern, and responsive websites and web applications tailored to your needs. Whether you're a startup, a growing business, or an established brand, our solutions are designed to scale and deliver results. We combine cutting-edge technology, AI capabilities, and top-tier design to help you stand out online — all at affordable pricing.
        </p>
      </section>

      {/* Core Services */}
      <section className="py-16" data-aos="fade-up">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <FaCode />,
              title: 'Custom Web Development',
              desc: 'Robust and scalable websites using the latest technologies. From landing pages to dashboards, we’ve got you covered.',
            },
            {
              icon: <FaPaintBrush />,
              title: 'UI/UX Design',
              desc: 'Modern, user-focused designs with an emphasis on usability and experience across all devices.',
            },
            {
              icon: <FaRobot />,
              title: 'AI Integration',
              desc: 'Smarter websites with personalized, AI-powered features to streamline operations and boost engagement.',
            },
            {
              icon: <FaSearch />,
              title: 'SEO Optimization',
              desc: 'Increase visibility and rank higher with keyword strategy, metadata optimization, and performance tuning.',
            },
            {
              icon: <FaMobileAlt />,
              title: 'Responsive Design',
              desc: 'Designed to look stunning and function smoothly on desktops, tablets, and mobile devices.',
            },
            {
              icon: <FaShoppingCart />,
              title: 'E-Commerce Solutions',
              desc: 'Secure, fast online stores with integrated payments, inventory, and customer management tools.',
            },
            {
              icon: <FaTools />,
              title: 'Maintenance & Support',
              desc: 'We keep your site up-to-date, secure, and running at peak performance with continuous support.',
            },
          ].map(({ icon, title, desc }, idx) => (
            <div
              key={idx}
              className="p-6 border border-gray-700 rounded-lg text-center hover:bg-indigo-950 transition"
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <div className="text-purple-400 text-4xl mb-4 flex justify-center">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
<section className="py-20 bg-black text-white" data-aos="fade-up">
  <div className="max-w-4xl mx-auto px-4 text-center">
    <h2 className="text-4xl font-extrabold mb-10 text-purple-400">Why Choose Unova?</h2>

    <div className="grid sm:grid-cols-2 gap-6 text-left">
      {[
        {
          icon: <FaMoneyBillWave className="text-purple-400 text-3xl" />,
          text: "Affordable & Transparent Pricing",
        },
        {
          icon: <FaUserGraduate className="text-purple-400 text-3xl" />,
          text: "Student-led Innovation with Professional Standards",
        },
        {
          icon: <FaRobot className="text-purple-400 text-3xl" />,
          text: "AI-powered Workflow",
        },
        {
          icon: <FaClock className="text-purple-400 text-3xl" />,
          text: "Timely Delivery",
        },
        {
          icon: <FaGlobeAsia className="text-purple-400 text-3xl" />,
          text: "Tirunelveli-based – Serving Clients Globally",
        },
      ].map(({ icon, text }, idx) => (
        <div
          key={idx}
          className="flex items-start space-x-4 p-4 border border-gray-700 rounded-lg hover:bg-indigo-950 transition-all"
        >
          <div>{icon}</div>
          <p className="text-lg text-gray-300">{text}</p>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Call to Action */}
      <section className="py-16 text-center bg-gradient-to-r from-indigo-900 to-indigo-950" data-aos="zoom-in">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Let’s Build Something Incredible</h2>
        <p className="text-lg text-gray-300 mb-6">
          From idea to execution, we’ll help you create a digital presence that makes a difference.
        </p>
        <Link to="/contact">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-all shadow-lg">
            Contact Us
          </button>
        </Link>
      </section>
    </div>
    </>
  );
};

export default Service;
