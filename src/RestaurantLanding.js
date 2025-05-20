import { useState, useEffect, useRef } from 'react';
import { Menu, X, MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, ChevronDown, Star, Award, Users, Gift } from 'lucide-react';

// Simplified Components
const LazyImage = ({ src, alt, className }) => (
  <div className={`overflow-hidden ${className}`}>
    <img src={src} alt={alt} className="w-full h-full object-cover" />
  </div>
);

// Counter Animation Component - Optimized
const AnimatedCounter = ({ value, label }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const end = parseInt(value.replace(/[^0-9]/g, ''));
          const duration = 2000;
          const increment = Math.ceil(end / (duration / 16));
          
          const timer = setInterval(() => {
            start += increment;
            if (start > end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
          
          observer.unobserve(entries[0].target);
        }
      }, 
      { threshold: 0.5 }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => counterRef.current && observer.unobserve(counterRef.current);
  }, [value]);
  
  return (
    <div ref={counterRef} className="text-center hover:scale-110 duration-300">
      <div className="bg-amber-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-2 shadow-md">
        <p className="text-3xl font-bold text-amber-600">
          {value.includes('+') ? `${count}+` : count}
        </p>
      </div>
      <p className="text-gray-700 font-medium">{label}</p>
    </div>
  );
};

// Sample Data - Moved outside component to reduce re-creation
const MENU_ITEMS = [
  {
    image: "/trufflepasta.jpg",
    name: "Truffle Pasta",
    description: "House-made tagliatelle with black truffle, porcini mushrooms, and a light cream sauce.",
    price: "24.95",
    isSpecial: true
  },
  {
    image: "/seabass.jpg",
    name: "Grilled Sea Bass",
    description: "Fresh Mediterranean sea bass with lemon, herbs, and roasted seasonal vegetables.",
    price: "32.50"
  },
  {
    image: "/ribeyesteak.jpg",
    name: "Ribeye Steak",
    description: "Prime cut 12oz ribeye with garlic butter, served with truffle fries and grilled asparagus.",
    price: "38.95"
  }
];

const TESTIMONIALS = [
  {
    text: "The best dining experience I've had in years. The chef's tasting menu was exceptional.",
    author: "Emma Richardson",
    role: "Food Critic"
  },
  {
    text: "The ambiance, service, and food quality are unmatched. Their signature truffle pasta is worth every penny.",
    author: "James Wilson",
    role: "Regular Customer"
  }
];

const FEATURES = [
  {
    Icon: Award,
    title: "Award-Winning Cuisine",
    description: "Recognized for excellence by international culinary associations."
  },
  {
    Icon: Users,
    title: "Private Dining",
    description: "Host special events in our exclusive private dining spaces."
  },
  {
    Icon: Gift,
    title: "Gift Cards",
    description: "The perfect present for food lovers and special occasions."
  }
];

const EVENTS = [
  {
    date: "June 15",
    title: "Wine Pairing Dinner",
    description: "A five-course meal paired with exclusive wines from Napa Valley."
  },
  {
    date: "July 3",
    title: "Chef's Table Experience",
    description: "An intimate dining experience with our head chef."
  }
];

// Reusable Components
const MenuItem = ({ image, name, description, price, isSpecial = false }) => (
  <div className="relative flex gap-4 bg-white rounded-lg shadow-md hover:shadow-lg p-4 hover:-translate-y-1 duration-300">
    {isSpecial && (
      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full font-semibold text-sm shadow-lg rotate-12 z-10">
        Chef's Special
      </div>
    )}
    <LazyImage src={image} alt={name} className="w-32 h-32 rounded-lg" />
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-amber-900">{name}</h3>
        <span className="font-bold text-amber-700">${price}</span>
      </div>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  </div>
);

const Testimonial = ({ text, author, role }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl duration-300 hover:-translate-y-1">
    <div className="text-amber-500 text-4xl font-serif mb-4">"</div>
    <div className="flex mb-3">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={18} className="fill-amber-500 text-amber-500" />
      ))}
    </div>
    <p className="text-gray-700 italic mb-4">{text}</p>
    <div>
      <p className="font-semibold text-amber-900">{author}</p>
      <p className="text-gray-500 text-sm">{role}</p>
    </div>
  </div>
);

const FeatureCard = ({ Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl duration-300 border-b-4 border-amber-500">
    <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
      <Icon size={32} className="text-amber-700" />
    </div>
    <h3 className="text-xl font-semibold text-amber-900 mb-2 text-center">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

export default function RestaurantLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', guests: '2', date: '', time: '', message: ''
  });
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Track scroll position for nav styling
  useEffect(() => {
    const handleScrollPosition = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScrollPosition);
    return () => window.removeEventListener('scroll', handleScrollPosition);
  }, []);

  // Track active section during scroll - optimized
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  // Handle reservations
  const handleReservation = () => {
    alert(`Thank you for your reservation, ${formData.name}! We look forward to welcoming you on ${formData.date} at ${formData.time}.`);
    setShowReservationModal(false);
    setFormData({ name: '', email: '', phone: '', guests: '2', date: '', time: '', message: '' });
  };

  // Navigation link component - Fixed to properly handle text colors
  const NavLink = ({ id, label }) => (
    <button 
      onClick={() => scrollToSection(id)}
      className={`pb-1 transition-colors duration-200 ${
        activeSection === id 
          ? 'text-amber-600 border-b-2 border-amber-600' 
          : isScrolled 
            ? 'text-gray-800 hover:text-amber-600' 
            : 'text-white hover:text-amber-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="font-sans bg-amber-50 text-gray-800">
      {/* Navigation - Fixed CSS syntax issues */}
      <nav className={`fixed w-full ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'} transition-all duration-300 z-50`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <span className={`text-2xl font-bold ${isScrolled ? 'text-amber-800' : 'text-white'}`}>Savoria</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'about', 'menu', 'events', 'contact'].map(id => (
                <NavLink key={id} id={id} label={id.charAt(0).toUpperCase() + id.slice(1)} />
              ))}
              <button 
                onClick={() => setShowReservationModal(true)}
                className="bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 duration-300"
              >
                Reserve
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`${isScrolled ? 'text-amber-800' : 'text-white'} hover:text-amber-600`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white pt-2 pb-4 px-4">
            <div className="flex flex-col space-y-3">
              {['home', 'about', 'menu', 'events', 'contact'].map(id => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`pb-1 transition-colors duration-200 ${
                    activeSection === id 
                      ? 'text-amber-600 border-b-2 border-amber-600' 
                      : 'text-gray-800 hover:text-amber-600'
                  }`}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
              <button 
                onClick={() => {
                  setShowReservationModal(true);
                  setIsMenuOpen(false);
                }}
                className="bg-amber-600 text-white py-2 rounded-full hover:bg-amber-700 duration-300"
              >
                Reserve
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Reservation Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-amber-900">Reserve Your Table</h3>
              <button onClick={() => setShowReservationModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    id="date" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-gray-700 mb-1">Time</label>
                  <input 
                    type="time" 
                    id="time" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <button 
                onClick={handleReservation}
                className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 duration-300 font-semibold mt-2"
              >
                Confirm Reservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="relative">
        <div className="h-screen max-h-screen relative">
          <LazyImage
            src="/hero.jpg"
            alt="Restaurant hero image"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="block">Welcome to</span> 
                <span className="text-5xl md:text-7xl text-amber-400">Savoria</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8">Culinary excellence in every bite</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setShowReservationModal(true)}
                  className="bg-amber-600 text-white px-8 py-3 rounded-full hover:bg-amber-700 duration-300 text-lg hover:scale-105"
                >
                  Reserve a Table
                </button>
                <button 
                  onClick={() => scrollToSection('menu')}
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-amber-800 duration-300 text-lg hover:scale-105"
                >
                  View Menu
                </button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button onClick={() => scrollToSection('about')} className="text-white">
              <ChevronDown size={40} />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">Our Story</h2>
                <div className="h-1 w-24 bg-amber-500"></div>
              </div>
              <p className="text-gray-700 mb-4">
                Founded in 2010, Savoria began as a small family-owned bistro with a passion for creating extraordinary dining experiences. Chef Maria Rodriguez, inspired by her grandmother's recipes and her travels across Europe and Asia, crafted a menu that blends traditional techniques with modern innovation.
              </p>
              <div className="flex justify-between gap-6 mt-10">
                <AnimatedCounter value="15" label="Years Experience" />
                <AnimatedCounter value="4" label="Master Chefs" />
                <AnimatedCounter value="1000+" label="Happy Customers" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                "/interior.jpg",
                "/chef.jpg",
                "/dish.jpg",
                "/table.jpg"
              ].map((imgSrc, index) => (
                <LazyImage 
                  key={index}
                  src={imgSrc}
                  alt={`Restaurant image ${index + 1}`}
                  className="rounded-lg h-48 shadow-lg hover:scale-105 duration-300"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Menu Section */}
      <section id="menu" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">Our Menu</h2>
            <div className="h-1 w-24 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-gray-700">Discover our chef's carefully crafted selections</p>
          </div>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            {MENU_ITEMS.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
            <div className="text-center mt-8">
              <button className="bg-amber-600 text-white px-6 py-3 rounded-full hover:bg-amber-700 duration-300">
                View Full Menu
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-amber-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">Why Choose Us</h2>
            <div className="h-1 w-24 bg-amber-500 mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Events Section */}
      <section id="events" className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">Upcoming Events</h2>
            <div className="h-1 w-24 bg-amber-500 mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {EVENTS.map((event, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl duration-300">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <p className="font-bold text-amber-800">{event.date}</p>
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">{event.title}</h3>
                <p className="text-gray-700">{event.description}</p>
                <button className="mt-4 text-amber-600 font-medium hover:text-amber-800">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">What Our Guests Say</h2>
            <div className="h-1 w-24 bg-amber-500 mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {TESTIMONIALS.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-amber-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">Contact Us</h2>
            <div className="h-1 w-24 bg-amber-500 mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="text-amber-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-amber-900">Location</h3>
                    <p className="text-gray-700">123 Gourmet Street, Culinary District</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-amber-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-amber-900">Phone</h3>
                    <p className="text-gray-700">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-amber-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-amber-900">Email</h3>
                    <p className="text-gray-700">info@savoria.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-amber-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-amber-900">Hours</h3>
                    <p className="text-gray-700">
                      Mon-Fri: 11:00 AM - 10:00 PM<br />
                      Sat-Sun: 10:00 AM - 11:00 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <a href="#" className="bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700 duration-300">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700 duration-300">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700 duration-300">
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-amber-900 mb-4">Send us a Message</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows="4" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                ></textarea>
                <button className="w-full bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 duration-300">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-amber-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Savoria</h3>
            <p className="text-amber-200 mb-4">Culinary excellence in every bite. Join us for an unforgettable dining experience.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Menu', 'Events', 'Contact'].map((link) => (
                <li key={link}>
                  <button 
                    onClick={() => scrollToSection(link.toLowerCase())}
                    className="text-amber-200 hover:text-white duration-200"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Subscribe</h4>
            <p className="text-amber-200 mb-4">Subscribe to our newsletter for updates and special offers.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="px-4 py-2 rounded-l-lg w-full text-gray-800 focus:outline-none"
              />
              <button className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-r-lg duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 pt-8 mt-8 border-t border-amber-800 text-center text-amber-200">
          <p>© {new Date().getFullYear()} Savoria Restaurant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}