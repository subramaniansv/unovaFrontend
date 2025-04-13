import React from "react";
import { FaExternalLinkAlt, FaTools, FaCode } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Testimonials from "./Testimonials";
import { Helmet } from 'react-helmet';
AOS.init();

const Portfolio = () => {
  const projects = [
    {
      title: "Resume Builder & Analysis Platform",
      description:
        "JobPI is an intelligent web app that helps users build ATS-friendly resumes and analyze them using AI. It allows resume creation, real-time editing, previewing, and download in PDF/DOCX. It also analyzes resumes against job descriptions to improve hiring chances.",
      tech: ["React.js", "Node.js", "MongoDB", "Firebase", "AI/NLP"],
      link: "https://jobpi.vercel.app",
    },
    // Add more projects here in the future
  ];

  return (
    <>
     <Helmet>
        <title>Portfolio | Unova</title>
        <meta name="description" content="Browse our portfolio and see the impactful projects we’ve delivered to clients." />
        <meta name="keywords" content="Unova portfolio, web projects, client work, case studies" />
        <meta property="og:title" content="Our Work - Unova" />
        <meta property="og:description" content="Check out the stunning websites and applications we've built for our clients." />
        <meta property="og:type" content="website" />
      </Helmet>
    <section className="py-16 px-6 bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12" data-aos="fade-up">
          Portfolio
        </h2>

        <div className="grid gap-8 lg:grid-cols-2" data-aos="fade-up">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
              data-aos="zoom-in-up"
              data-aos-delay={idx * 100}
            >
              <h3 className="text-2xl font-semibold text-purple-400 mb-2">
                {project.title}
              </h3>

              <p className="text-gray-300 mb-4">{project.description}</p>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
                {project.tech.map((tech, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <FaCode className="text-cyan-400" /> {tech}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full transition"
              >
                View Project <FaExternalLinkAlt />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
    <Testimonials/>
    </>
  );
};

export default Portfolio;
