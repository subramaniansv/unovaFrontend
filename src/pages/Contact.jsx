import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaEnvelope, FaGlobe, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Faq from "./Faq";
import { Helmet } from 'react-helmet';
const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.REACT_APP_BACKEND_URL;
    const { name, email, phone, message } = formData;
    const payload = { name, email, phone, message };

    try {
      const res = await axios.post(`${apiUrl}/api/contact`, payload);
      
      // Success toast
      toast.success("Message sent successfully!", {
       
        autoClose: 3000,
      });

      // Clear the form after submission
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      // Error toast
      toast.error("Something went wrong! Please try again later.", {
      
        autoClose: 3000,
      });
    }
  };

  return (
    <>
    <Helmet>
        <title>Contact | Unova</title>
        <meta name="description" content="Get in touch with Unova to start your next digital project today." />
        <meta name="keywords" content="Contact Unova, web development inquiry, start a project" />
        <meta property="og:title" content="Contact Us - Unova" />
        <meta property="og:description" content="Let’s build something great together. Reach out to us for web development and design services." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="bg-black text-white py-16 px-6">
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-4xl font-bold text-purple-500 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-300">Let’s work together to bring your vision to life.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-900 p-8 rounded-xl shadow-lg"
            data-aos="fade-right"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name*"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-md focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email*"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-md focus:outline-none"
            />
            <input
              type="text"
              name="phone"
              placeholder="Your Phone (optional)"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-md focus:outline-none"
            />
            <textarea
              name="message"
              placeholder="Your Message*"
              rows="5"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-md focus:outline-none"
            ></textarea>
            <button
              type="submit" 
              className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="bg-gray-900 p-8 rounded-xl shadow-lg space-y-6" data-aos="fade-left">
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-purple-500 text-2xl" />
              <p>Tirunelveli, Tamil Nadu</p>
            </div>
            <div className="flex items-start gap-4">
              <FaEnvelope className="text-purple-500 text-2xl" />
              <p>hello@unova.in</p>
            </div>
            <div className="flex items-start gap-4">
              <FaGlobe className="text-purple-500 text-2xl" />
              <p>www.unova.in</p>
            </div>
            <div>
              <h3 className="text-purple-400 mb-2 font-semibold">Follow Us</h3>
              <div className="flex gap-4 text-xl">
                <FaFacebook className="hover:text-blue-800 transition cursor-pointer" />
                <FaInstagram className="hover:text-pink-400 transition cursor-pointer" />
                <FaYoutube className="hover:text-red-500 transition cursor-pointer"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Faq />
      <ToastContainer />
    </>
  );
};

export default Contact;
