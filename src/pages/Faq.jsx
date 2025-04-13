import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaChevronDown } from "react-icons/fa";

const faqs = [
  {
    question: "What is Unova?",
    answer:
      "Unova is a tech initiative started by students in January 2025 to deliver modern, fast, and AI-powered websites and web applications at affordable rates with world-class quality.",
  },
  {
    question: "Where is Unova located?",
    answer:
      "Unova is proudly based in Tirunelveli, Tamil Nadu, serving clients across India and globally.",
  },
  {
    question: "What services does Unova offer?",
    answer:
      "We provide web development, web design, SEO optimization, and AI-integrated applications such as resume builders and analysis tools.",
  },
  {
    question: "Do you deliver projects on time?",
    answer:
      "Absolutely! Timely delivery without compromising quality is one of our core values.",
  },
  {
    question: "How do I get in touch with Unova?",
    answer:
      "You can contact us via our Contact page or email us directly at hello@unova.in.",
  },
];

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <section className="bg-black text-white px-6 py-16 min-h-screen" data-aos="fade-up">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-700 rounded-lg p-5"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-purple-400"
              >
                {faq.question}
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeIndex === index && (
                <p className="mt-4 text-gray-300 transition-all duration-300">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
