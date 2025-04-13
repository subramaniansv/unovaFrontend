import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import headImg from '../assets/headimg.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = (
    <>
      {['Home', 'About', 'Service', 'Portfolio', 'Contact'].map((label, index) => {
        const path = label.toLowerCase() === 'home' ? '/' : `/${label.toLowerCase()}`;
        return (
          <li key={index} className="relative group" onClick={closeMenu}>
            <Link
              to={path}
              className="font-semibold text-white group-hover:text-purple-400 transition-all duration-300"
            >
              {label}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </li>
        );
      })}
    </>
  );

  return (
    <nav className="bg-black text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-3xl font-bold tracking-widest text-white">
          <Link to='/'><img src={headImg} alt="Logo" className='cursor-pointer' height="50px" width="100px" /></Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-10 items-center">{navLinks}</ul>

        {/* Mobile Toggle */}
        <div className="md:hidden text-white text-2xl" onClick={toggleMenu}>
          {menuOpen ? <FaTimes className='cursor-pointer'/> : <FaBars className='cursor-pointer' />}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <ul
          ref={menuRef}
          className="md:hidden flex flex-col items-center border border-b-indigo-400 bg-black py-4 space-y-6"
        >
          {navLinks}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
