import React from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Sanjay Kumar",
    feedback:
      "Unova delivered exactly what we needed. Fast, modern, and well-optimized website. Their resume builder tool is top-notch!",
    rating: 5,
  },
  {
    name: "Priya Desai",
    feedback:
      "Their team was very responsive and professional. The resume analyzer helped our HR streamline hiring easily.",
    rating: 4,
  },
  {
    name: "Anil Sharma",
    feedback:
      "Excellent UI/UX design. They understood our vision perfectly and brought it to life with AI-powered tools!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section
      className="py-16 px-6 bg-gray-950 text-white "
      data-aos="fade-up"
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">What People Say</h2>
        <p className="text-gray-400 mb-10">
          Here’s what our clients have to say about working with Unova.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-black border border-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              data-aos="zoom-in-up"
              data-aos-delay={index * 100}
            >
              <FaQuoteLeft className="text-purple-500 text-2xl mb-4" />
              <p className="text-gray-300 mb-4">"{t.feedback}"</p>
              <div className="text-yellow-400 flex justify-center mb-2">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <h4 className="text-lg font-semibold text-white">{t.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
