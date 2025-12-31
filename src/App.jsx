import React, { useState, useEffect, useRef } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  Download,
  MapPin,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';

// --- Initial Data ---
const INITIAL_PROJECTS = [
  {
    id: "01",
    date: "MARCH 2025",
    title: "IMDB Movie Dataset Cleaning & Standardization",
    category: "Data Engineering",
    tech: ["MySQL", "Data Cleaning", "ETL"],
    github: "imdb-movie-dataset-cleaning-standardization",
    description: "Executed comprehensive data cleaning pipeline on 250+ IMDB records using MySQL 8.0, reducing corrupted values from 30% to 0% through systematic quality improvement processes.",
    points: [
      "Performed advanced text cleaning including UTF-8 encoding corrections",
      "Standardized 10+ inconsistent date formats into ISO YYYY-MM-DD format",
      "Engineered transformation logic to clean numeric fields",
      "Designed production-ready table with 11 analysis-ready columns"
    ],
    stats: [
      { label: "RECORDS", value: "250+" },
      { label: "IMPROVEMENT", value: "30%" },
      { label: "STANDARDIZED", value: "10+ FORMATS" }
    ]
  },
  {
    id: "02",
    date: "APRIL 2024",
    title: "NIFTY 50 Market Analytics Dashboard",
    category: "Financial Analysis",
    tech: ["Power BI", "DAX", "Financial Modeling"],
    github: "nifty-50-market-analytics-dashboard",
    description: "Engineered interactive dashboard analyzing market data with 15+ KPIs including turnover, volatility, price changes, and market capitalization across 50 stocks.",
    points: [
      "Implemented advanced DAX calculations for sector-wise performance",
      "Designed interactive drill-down capabilities with slicers",
      "Identified 12% average monthly volatility patterns",
      "Built comparative analysis supporting data-driven strategies"
    ],
    stats: [
      { label: "KPIS", value: "15+" },
      { label: "SECTORS", value: "11" },
      { label: "VOLATILITY", value: "12%" }
    ]
  },
  {
    id: "03",
    date: "SEPT 2024",
    title: "Hotel Booking Revenue Optimization",
    category: "Predictive Analytics",
    tech: ["Python", "Pandas", "Matplotlib"],
    github: "hotel-booking-revenue-optimization",
    description: "Analyzed 134,000+ hotel booking records using Python and Pandas, performing data cleaning, outlier detection, and missing value imputation achieving 99% data quality.",
    points: [
      "Conducted occupancy analysis across 6 cities and 8 room types",
      "Uncovered 18% revenue differential between weekday/weekend bookings",
      "Generated pricing recommendations projected to increase revenue by 15%",
      "Developed predictive models achieving 82% accuracy"
    ],
    stats: [
      { label: "RECORDS", value: "134K+" },
      { label: "QUALITY", value: "99%" },
      { label: "ACCURACY", value: "82%" }
    ]
  },

];

const INITIAL_SKILLS = [
  {
    category: "Data Analysis",
    id: "01",
    items: ["Power BI", "Tableau", "Excel (Advanced)", "Statistical Analysis", "Business Intelligence", "Predictive Analytics"]
  },
  {
    category: "Programming",
    id: "02",
    items: ["Python (Pandas, NumPy)", "Matplotlib & Seaborn", "SQL (MySQL, MS SQL Server)", "Java", "C++", "JavaScript"]
  },
  {
    category: "Data Engineering",
    id: "03",
    items: ["ETL Processes", "Data Cleaning", "Data Transformation", "Data Modeling", "Database Design"]
  },
  {
    category: "Tools",
    id: "04",
    items: ["MySQL Workbench", "Jupyter Notebook", "Git", "VS Code", "Adobe Creative Suite", "HTML5 & CSS3"]
  }
];

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  
  // Data State
  const [projects] = useState(INITIAL_PROJECTS);
  const [skills] = useState(INITIAL_SKILLS);

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Theme Effect ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- Scroll Logic ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = ['home', 'about', 'skills', 'projects', 'education', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 400) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Animations & Helpers ---
  const heroRef = useRef(null);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Simple CountUp component that handles values like "250+", "12%", "134K+"
  const CountUp = ({ value, className }) => {
    const elRef = useRef(null);
    const startedRef = useRef(false);

    useEffect(() => {
      if (!elRef.current) return;
      if (prefersReducedMotion) {
        elRef.current.textContent = value;
        return;
      }

      const match = /^([0-9]+(?:\.[0-9]+)?)(.*)$/.exec(String(value));
      if (!match) {
        elRef.current.textContent = value;
        return;
      }

      const target = parseFloat(match[1]);
      const suffix = match[2] || '';

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            let start = null;
            const duration = 900;
            const step = (timestamp) => {
              if (!start) start = timestamp;
              const progress = Math.min((timestamp - start) / duration, 1);
              const current = Math.floor(progress * target);
              elRef.current.textContent = `${current}${suffix}`;
              if (progress < 1) requestAnimationFrame(step);
              else elRef.current.textContent = `${target}${suffix}`;
            };
            requestAnimationFrame(step);
          }
        });
      }, { threshold: 0.3 });

      observer.observe(elRef.current);
      return () => observer.disconnect();
    }, [value]);

    return <p ref={elRef} className={className}>{prefersReducedMotion ? value : '0'}</p>;
  };

  // IntersectionObserver for reveal-on-scroll
  useEffect(() => {
    if (prefersReducedMotion) return;
    const els = Array.from(document.querySelectorAll('.reveal-on-scroll'));
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Parallax for hero name
  useEffect(() => {
    if (prefersReducedMotion) return;
    const onScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const offset = Math.max(-rect.top / 20, -30);
      const spans = heroRef.current.querySelectorAll('h1 span');
      spans.forEach((s, i) => {
        s.style.transform = `translateY(${offset * (i + 1)}px)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-neutral-950 text-black dark:text-white font-sans selection:bg-green-400 selection:text-black pb-20 transition-colors duration-300">


      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-[90rem] mx-auto px-6 md:px-12 flex items-center justify-between">
          <button onClick={() => scrollToSection('home')} aria-label="Scroll to top" className="font-bold text-lg tracking-[0.2em] uppercase dark:text-white cursor-pointer">
            Rahil Gala
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-5 text-[13px] font-bold tracking-[0.15em] uppercase">
            {['About', 'Skills', 'Projects', 'Education'].map((item) => (
              <button 
                key={item}
                onClick={(e) => { scrollToSection(item.toLowerCase()); e.currentTarget.blur(); }}
                className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''} hover:text-green-600 dark:hover:text-green-400 transition-colors ${activeSection === item.toLowerCase() ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}
              >
                {item}
              </button>
            ))}
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 bg-green-400 hover:bg-green-500 text-black font-bold transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800">
            <div className="max-w-[90rem] mx-auto px-6 py-4 space-y-4">
              {['About', 'Skills', 'Projects', 'Education', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={(e) => {
                    scrollToSection(item.toLowerCase());
                    setMobileMenuOpen(false);
                    e.currentTarget.blur();
                  }}
                  className={`nav-link ${activeSection === item.toLowerCase() ? 'active' : ''} block w-full text-left py-2 text-sm font-bold tracking-[0.15em] uppercase transition-colors ${
                    activeSection === item.toLowerCase() 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex flex-col items-center relative pt-20 px-6 reveal-on-scroll" ref={heroRef}>
        <div className="text-center w-full max-w-[90rem] flex-grow flex flex-col justify-center items-center">
          <p className="text-xs md:text-sm font-bold tracking-[0.3em] mb-4 md:mb-4 text-gray-500 dark:text-gray-400 uppercase animate-fade-in">
            Data Analyst
          </p>
          
          <h1 className="text-[14vw] md:text-[11rem] leading-[0.8] font-black tracking-tighter mb-10 md:mb-16 flex flex-col items-center select-none dark:text-white">
            <span className="block animate-slide-up">RAHIL</span>
            <span className="block animate-slide-up animation-delay-100">GALA</span>
          </h1>

          <p className="text-xl md:text-3xl text-gray-600 dark:text-gray-400 font-medium max-w-3xl mx-auto mb-6 md:mb-10 leading-relaxed">
            Transforming Raw Data Into
            <br className="hidden md:block" />
            <span className="text-black dark:text-white"> Actionable Insights</span>
          </p>

          <div className="flex flex-col md:flex-row gap-5 justify-center items-center w-full md:w-auto">
            <button 
              onClick={() => scrollToSection('projects')} 
              className="w-full md:w-auto px-10 py-5 bg-green-400 hover:bg-green-500 text-black text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2"
            >
              View Projects
            </button>
            <a 
              href="RAHIL_GALA_RESUME_DATA_ANALYTICS.pdf" 
              download="RAHIL_GALA_RESUME_DATA_ANALYTICS.pdf"
              className="w-full md:w-auto px-10 py-5 bg-white dark:bg-neutral-900 border border-black dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-black dark:text-white text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Resume
            </a>
          </div>
        </div>

        <div className="py-12 flex gap-8 text-gray-400 dark:text-gray-500">
          <a href="https://www.linkedin.com/in/rahil-gala/" className="hover:text-black dark:hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          <a href="https://github.com/RahilGala" className="hover:text-black dark:hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
          <a href="mailto:rahilgala30@gmail.com" className="hover:text-black dark:hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-40 bg-white dark:bg-neutral-950 reveal-on-scroll">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12">
          <div className="mb-24">
            <p className="text-xs font-bold tracking-[0.25em] text-gray-500 dark:text-gray-400 uppercase mb-6">Who I Am</p>
            <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-black dark:text-white leading-none">
              About Me
            </h2>
          </div>

          <div className="max-w-5xl">
            <p className="text-2xl md:text-5xl leading-[1.2] font-medium text-gray-900 dark:text-gray-200">
              Aspiring Data Analyst with hands-on expertise in <span className="text-green-400 dark:text-green-600">SQL, Python, Power BI, and Tableau.</span> Proven ability to transform raw, messy datasets into actionable insights through advanced data cleaning, statistical analysis, and visualization.
            </p>
            <div className="mt-16 flex items-center gap-6">
               <div className="h-px bg-black dark:bg-white w-32"></div>
               <p className="text-xs font-bold uppercase tracking-[0.2em] dark:text-white">Deloitte & BCG Certified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 md:py-40 bg-[#FAFAFA] dark:bg-neutral-900 reveal-on-scroll">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12">
          <div className="mb-24">
            <p className="text-xs font-bold tracking-[0.25em] text-gray-500 dark:text-gray-400 uppercase mb-6">What I Do</p>
            <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-black dark:text-white leading-none">
              Technical<br/>Skills
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {skills.map((data) => (
              <div key={data.category} className="card-lift group reveal-on-scroll relative bg-white dark:bg-neutral-950 p-12 shadow-sm border border-gray-100 dark:border-neutral-800 hover:shadow-xl hover:border-gray-200 dark:hover:border-neutral-700 transition-all duration-300">
                <div className="flex justify-between items-start mb-12">
                  <h3 className="text-3xl font-bold tracking-tight dark:text-white">{data.category}</h3>
                  <span className="text-sm font-bold text-gray-300 dark:text-gray-600 tracking-widest">
                    {data.id}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {data.items.map((skill, i) => (
                    <span key={i} className="px-5 py-3 bg-gray-50 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-100 dark:border-neutral-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 md:py-40 bg-white dark:bg-neutral-950 reveal-on-scroll">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12">
          <div className="mb-24">
            <p className="text-xs font-bold tracking-[0.25em] text-gray-500 dark:text-gray-400 uppercase mb-6">Selected Work</p>
            <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-black dark:text-white leading-none">
              Projects
            </h2>
          </div>

          <div className="space-y-32">
            {projects.map((project) => (
              <div key={project.id} className="card-lift relative group reveal-on-scroll border-t border-gray-200 dark:border-neutral-800 pt-12">
                {/* Header Row: ID and Date */}
                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm font-bold text-black dark:text-white">{project.id}</span>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                     <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                     {project.date}
                  </div>
                </div>

                {/* Title */}
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-3xl md:text-5xl font-bold max-w-4xl leading-[1.1] dark:text-white">
                    {project.title}
                  </h3>
                  <a
                    href={`https://github.com/RahilGala/${project.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <Github className="w-6 h-6" />
                  </a>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-10">
                  {project.tech.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-[10px] font-bold uppercase tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-12 gap-12">
                  <div className="md:col-span-7">
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                      {project.description}
                    </p>
                    <ul className="space-y-4">
                      {project.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0"></span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-5 md:pl-12 border-l border-gray-100 dark:border-neutral-800">
                     <div className="grid grid-cols-1 gap-8">
                      {project.stats && project.stats.map((stat, i) => (
                        <div key={i}>
                          <CountUp value={stat.value} className="text-4xl font-bold text-black dark:text-white mb-1" />
                          <p className="text-[10px] font-bold tracking-[0.2em] text-green-600 dark:text-green-400 uppercase">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-24 md:py-40 bg-[#FAFAFA] dark:bg-neutral-900">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 md:gap-32">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-gray-500 dark:text-gray-400 uppercase mb-6">Academic Background</p>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black dark:text-white mb-8 leading-none">
                Education
              </h2>
            </div>
            <div className="space-y-12 pt-4">
              <div className="border-l-2 border-green-400 pl-10">
                <h3 className="text-3xl font-bold mb-4 dark:text-white">B.Sc. Information Technology</h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">Narsee Monjee College of Commerce and Economics</p>
                <div className="flex gap-6 text-sm font-bold text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider">
                  <span>2023 - 2026</span>
                  <span>•</span>
                  <span className="text-green-600 dark:text-green-400">CGPA: 9.16/10.0</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  Coursework: Data Analysis, Software Engineering, Algorithms, Artificial Intelligence, Operating Systems
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-40 bg-white dark:bg-neutral-950">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-start">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-gray-500 dark:text-gray-400 uppercase mb-6">Get in Touch</p>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black dark:text-white mb-6 leading-none">Contact<br/>Me</h2>

              <p className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-gray-200 mb-6 leading-tight">Let's collaborate on your next <span className="text-green-500">data project.</span></p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">I'm available for contract and full-time opportunities. Share a brief about the project and I'll respond within a few business days.</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-lg p-6">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase mb-2">Email</p>
                  <a href="mailto:rahilgala30@gmail.com" className="block text-lg font-bold hover:text-green-500 dark:text-white dark:hover:text-green-400 transition-colors" aria-label="Email Rahil">rahilgala30@gmail.com</a>
                  <a href="mailto:rahilgala30@gmail.com" className="mt-4 inline-block px-4 py-2 bg-green-400 hover:bg-green-500 text-black font-bold rounded">Email Me</a>
                </div>
                <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-lg p-6">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase mb-2">Location</p>
                  <div className="flex items-center gap-2 text-lg md:text-xl font-bold text-black dark:text-white">
                    <MapPin className="w-5 h-5 text-green-500" /> Mumbai, India
                  </div>
                </div>
              </div>

              <a
                href="RAHIL_GALA_RESUME_DATA_ANALYTICS.pdf"
                download="RAHIL_GALA_RESUME_DATA_ANALYTICS.pdf"
                className="mt-4 inline-block px-4 py-3 bg-white dark:bg-neutral-900 border border-black dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-black dark:text-white text-sm font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 rounded"
              >
                <Download className="w-4 h-4" /> Download Resume
              </a>

              <div className="pt-6 border-t border-gray-200 dark:border-neutral-800">
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 dark:text-gray-500 uppercase mb-4">Connect With Me</p>
                <div className="flex gap-6">
                  <a href="https://www.linkedin.com/in/rahil-gala/" className="flex items-center gap-2 text-lg font-bold hover:text-green-500 dark:text-white dark:hover:text-green-400 transition-colors" aria-label="LinkedIn">
                    <Linkedin className="w-5 h-5" /> LinkedIn
                  </a>
                  <a href="https://github.com/RahilGala" className="flex items-center gap-2 text-lg font-bold hover:text-green-500 dark:text-white dark:hover:text-green-400 transition-colors" aria-label="GitHub">
                    <Github className="w-5 h-5" /> GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-32 pt-8 border-t border-gray-100 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
             <div className="flex items-center gap-2">
               <p>© {new Date().getFullYear()} Rahil Gala.</p>
             </div>
             <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-center md:text-right">
                <p>Mumbai, India</p>
                <p>rahilgala30@gmail.com</p>
             </div>
          </footer>
        </div>
      </section>

      <style>{`
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;