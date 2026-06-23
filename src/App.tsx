import { useState, useEffect, useRef } from 'react';
import {
  Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink,
  Menu, X, ChevronDown, Play, Calendar, GraduationCap,
  Briefcase, Code, Layers, User, FolderOpen
} from 'lucide-react';

interface ParsedData {
  theme: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textMuted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  personal: {
    name: string;
    title: string;
    tagline: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
    avatar: string;
  };
  about: {
    title: string;
    summary: string;
    text: string;
  };
  software: Array<{ name: string; proficiency: number; level: string }>;
  skills: Array<{ category: string; items: string[] }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    description: string;
  }>;
  experience: Array<{
    company: string;
    logo: string;
    role: string;
    location: string;
    duration: string;
    description: string;
    highlights: string[];
  }>;
  portfolio: {
    title: string;
    items: Array<{
      title: string;
      description: string;
      image: string;
      video: string;
      link: string;
      tags: string;
    }>;
  };
  companyLogos: string[];
  footer: {
    text: string;
    copyright: string;
  };
}

const defaultData: ParsedData = {
  theme: 'modern',
  colors: {
    primary: '#0f172a',
    secondary: '#3b82f6',
    accent: '#06b6d4',
    background: '#f8fafc',
    text: '#1e293b',
    textMuted: '#64748b',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  personal: {
    name: 'Your Name',
    title: 'Your Title',
    tagline: 'Your tagline goes here',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    avatar: '',
  },
  about: {
    title: 'About Me',
    summary: '',
    text: '',
  },
  software: [],
  skills: [],
  education: [],
  experience: [],
  portfolio: {
    title: 'Portfolio',
    items: [],
  },
  companyLogos: [],
  footer: {
    text: 'Designed & Built with passion',
    copyright: '2024 All rights reserved',
  },
};

function parseSourceFile(content: string): ParsedData {
  const data: ParsedData = JSON.parse(JSON.stringify(defaultData));
  let currentSection = '';
  let currentSkillCategory = '';
  const skillAccumulator: Array<{ category: string; items: string[] }> = [];

  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line || line.startsWith('#') || line.startsWith('=') || line.startsWith('-')) continue;

    const sectionMatch = line.match(/\[SECTION:\s*(.+?)\]/i);
    if (sectionMatch) {
      currentSection = sectionMatch[1].toLowerCase();
      if (currentSection.includes('skill')) {
        currentSkillCategory = '';
      }
      continue;
    }

    if (line.match(/\[END_SECTION\]/i)) {
      if (currentSkillCategory && skillAccumulator.length > 0) {
        data.skills = [...skillAccumulator];
      }
      currentSection = '';
      continue;
    }

    const tagMatch = line.match(/\[([A-Z_]+):\s*(.*?)\]$/i);
    if (!tagMatch) continue;

    const [, tag, value] = tagMatch;
    const tagLower = tag.toLowerCase();

    switch (tagLower) {
      case 'theme':
        data.theme = value;
        break;
      case 'color_primary':
        data.colors.primary = value;
        break;
      case 'color_secondary':
        data.colors.secondary = value;
        break;
      case 'color_accent':
        data.colors.accent = value;
        break;
      case 'color_background':
        data.colors.background = value;
        break;
      case 'color_text':
        data.colors.text = value;
        break;
      case 'color_text_muted':
        data.colors.textMuted = value;
        break;
      case 'font_heading':
        data.fonts.heading = value;
        break;
      case 'font_body':
        data.fonts.body = value;
        break;
      case 'name':
        data.personal.name = value;
        break;
      case 'title':
        if (currentSection.includes('about')) {
          data.about.title = value;
        } else {
          data.personal.title = value;
        }
        break;
      case 'tagline':
        data.personal.tagline = value;
        break;
      case 'email':
        data.personal.email = value;
        break;
      case 'phone':
        data.personal.phone = value;
        break;
      case 'location':
        if (currentSection.includes('experience')) {
          // Handled in experience block
        } else {
          data.personal.location = value;
        }
        break;
      case 'linkedin':
        data.personal.linkedin = value;
        break;
      case 'github':
        data.personal.github = value;
        break;
      case 'website':
        data.personal.website = value;
        break;
      case 'avatar':
        data.personal.avatar = value;
        break;
      case 'about_summary':
        data.about.summary = value;
        break;
      case 'about_text':
        data.about.text = value;
        break;
      case 'about_title':
        data.about.title = value;
        break;
      case 'software_item': {
        const parts = value.split('|').map(s => s.trim());
        if (parts.length >= 2) {
          data.software.push({
            name: parts[0],
            proficiency: parseInt(parts[1]) || 0,
            level: parts[2] || '',
          });
        }
        break;
      }
      case 'skill_category':
        if (currentSkillCategory && skillAccumulator.length > 0) {
          // Push previous category
        }
        currentSkillCategory = value;
        skillAccumulator.push({ category: value, items: [] });
        break;
      case 'skill':
        if (currentSkillCategory && skillAccumulator.length > 0) {
          skillAccumulator[skillAccumulator.length - 1].items.push(value);
        }
        break;
      case 'degree':
      case 'school':
      case 'year':
      case 'description':
        if (currentSection.includes('education')) {
          if (tagLower === 'degree') {
            data.education.push({ degree: value, school: '', year: '', description: '' });
          } else if (data.education.length > 0) {
            if (tagLower === 'school') data.education[data.education.length - 1].school = value;
            else if (tagLower === 'year') data.education[data.education.length - 1].year = value;
            else if (tagLower === 'description') data.education[data.education.length - 1].description = value;
          }
        }
        break;
      case 'company':
        if (currentSection.includes('experience') && value) {
          data.experience.push({
            company: value,
            logo: '',
            role: '',
            location: '',
            duration: '',
            description: '',
            highlights: [],
          });
        }
        break;
      case 'logo':
        if (currentSection.includes('experience') && data.experience.length > 0) {
          data.experience[data.experience.length - 1].logo = value;
        } else if (currentSection.includes('logo')) {
          data.companyLogos.push(value);
        }
        break;
      case 'role':
        if (data.experience.length > 0) {
          data.experience[data.experience.length - 1].role = value;
        }
        break;
      case 'duration':
        if (data.experience.length > 0) {
          data.experience[data.experience.length - 1].duration = value;
        }
        break;
      case 'highlights':
        // Will be processed in multi-line mode
        break;
      case 'portfolio_title':
        data.portfolio.title = value;
        break;
      case 'portfolio_item': {
        // Parse the portfolio item content
        const item: { title: string; description: string; image: string; video: string; link: string; tags: string } = {
          title: '', description: '', image: '', video: '', link: '', tags: ''
        };
        let k = i;
        let itemClosed = false;
        while (k < lines.length && !itemClosed) {
          const itemLine = lines[k].trim();
          if (itemLine.startsWith(']')) {
            itemClosed = true;
            break;
          }
          const itemMatch = itemLine.match(/\[([A-Z]+):\s*(.*?)\]$/i);
          if (itemMatch) {
            const [, itemTag, itemVal] = itemMatch;
            switch (itemTag.toLowerCase()) {
              case 'title': item.title = itemVal; break;
              case 'description': item.description = itemVal; break;
              case 'image': item.image = itemVal; break;
              case 'video': item.video = itemVal; break;
              case 'link': item.link = itemVal; break;
              case 'tags': item.tags = itemVal; break;
            }
          }
          k++;
        }
        data.portfolio.items.push(item);
        i = k;
        break;
      }
      case 'company_logo':
        if (!currentSection.includes('experience')) {
          data.companyLogos.push(value);
        } else if (data.experience.length > 0) {
          data.experience[data.experience.length - 1].logo = value;
        }
        break;
      case 'footer_text':
        data.footer.text = value;
        break;
      case 'copyright':
        data.footer.copyright = value;
        break;
    }
  }

  // Parse multi-line blocks for experience highlights
  const experienceMatches = content.match(/\[EXPERIENCE_ITEM:[\s\S]*?\n\]/gi) || [];
  let expIndex = 0;
  experienceMatches.forEach((block) => {
    const highlightMatch = block.match(/\[HIGHLIGHTS:\s*([\s\S]*?)\n\]/i);
    if (highlightMatch && data.experience[expIndex]) {
      const highlights = highlightMatch[1]
        .split('\n')
        .map(l => l.replace(/^-\s*/, '').trim())
        .filter(l => l && !l.startsWith('['));
      data.experience[expIndex].highlights = highlights;
    }

    // Extract other fields from block
    const fieldMatchers: { regex: RegExp; field: keyof typeof data.experience[0] }[] = [
      { regex: /\[COMPANY:\s*(.*?)\]/i, field: 'company' },
      { regex: /\[LOGO:\s*(.*?)\]/i, field: 'logo' },
      { regex: /\[ROLE:\s*(.*?)\]/i, field: 'role' },
      { regex: /\[LOCATION:\s*(.*?)\]/i, field: 'location' },
      { regex: /\[DURATION:\s*(.*?)\]/i, field: 'duration' },
      { regex: /\[DESCRIPTION:\s*(.*?)\]/i, field: 'description' },
    ];

    fieldMatchers.forEach(({ regex, field }) => {
      const match = block.match(regex);
      if (match && data.experience[expIndex]) {
        (data.experience[expIndex] as Record<string, unknown>)[field] = match[1];
      }
    });

    expIndex++;
  });

  // Parse education items
  const educationMatches = content.match(/\[EDUCATION_ITEM:[\s\S]*?\n\]/gi) || [];
  data.education = [];
  educationMatches.forEach((block) => {
    const edu: { degree: string; school: string; year: string; description: string } = {
      degree: '', school: '', year: '', description: ''
    };
    const degreeMatch = block.match(/\[DEGREE:\s*(.*?)\]/i);
    const schoolMatch = block.match(/\[SCHOOL:\s*(.*?)\]/i);
    const yearMatch = block.match(/\[YEAR:\s*(.*?)\]/i);
    const descMatch = block.match(/\[DESCRIPTION:\s*(.*?)\]/i);

    if (degreeMatch) edu.degree = degreeMatch[1];
    if (schoolMatch) edu.school = schoolMatch[1];
    if (yearMatch) edu.year = yearMatch[1];
    if (descMatch) edu.description = descMatch[1];

    data.education.push(edu);
  });

  // Parse portfolio items properly
  const portfolioMatches = content.match(/\[PORTFOLIO_ITEM:[\s\S]*?\n\]/gi) || [];
  data.portfolio.items = [];
  portfolioMatches.forEach((block) => {
    const item: { title: string; description: string; image: string; video: string; link: string; tags: string } = {
      title: '', description: '', image: '', video: '', link: '', tags: ''
    };
    const titleMatch = block.match(/\[TITLE:\s*(.*?)\]/i);
    const descMatch = block.match(/\[DESCRIPTION:\s*(.*?)\]/i);
    const imageMatch = block.match(/\[IMAGE:\s*(.*?)\]/i);
    const videoMatch = block.match(/\[VIDEO:\s*(.*?)\]/i);
    const linkMatch = block.match(/\[LINK:\s*(.*?)\]/i);
    const tagsMatch = block.match(/\[TAGS:\s*(.*?)\]/i);

    if (titleMatch) item.title = titleMatch[1];
    if (descMatch) item.description = descMatch[1];
    if (imageMatch) item.image = imageMatch[1];
    if (videoMatch) item.video = videoMatch[1];
    if (linkMatch) item.link = linkMatch[1];
    if (tagsMatch) item.tags = tagsMatch[1];

    data.portfolio.items.push(item);
  });

  return data;
}

function Navbar({ data, activeSection }: { data: ParsedData; activeSection: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'about', label: 'About', icon: User },
    { id: 'software', label: 'Tech Stack', icon: Code },
    { id: 'skills', label: 'Skills', icon: Layers },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'portfolio', label: 'Portfolio', icon: FolderOpen },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg backdrop-blur-lg' : ''
      }`}
      style={{
        backgroundColor: scrolled ? `rgba(${hexToRgb(data.colors.background)}, 0.95)` : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="#hero"
            className="font-bold text-xl transition-colors duration-300"
            style={{ color: data.colors.primary }}
          >
            {data.personal.name.split(' ')[0]}
          </a>

          <div className="hidden md:flex items-center space-x-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeSection === section.id ? 'bg-opacity-20' : 'hover:bg-opacity-10'
                }`}
                style={{
                  color: activeSection === section.id ? data.colors.secondary : data.colors.text,
                  backgroundColor: activeSection === section.id ? data.colors.secondary : 'transparent',
                }}
              >
                <section.icon size={16} />
                {section.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: data.colors.primary }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t" style={{ borderColor: data.colors.textMuted + '20' }}>
          <div className="px-4 py-3 space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3"
                style={{
                  color: activeSection === section.id ? data.colors.secondary : data.colors.text,
                  backgroundColor: activeSection === section.id ? data.colors.secondary + '10' : 'transparent',
                }}
              >
                <section.icon size={18} />
                {section.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero({ data }: { data: ParsedData }) {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
      style={{ background: `linear-gradient(135deg, ${data.colors.background} 0%, ${data.colors.primary + '05'} 100%)` }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: data.colors.secondary }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: data.colors.accent }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center animate-fade-in-up">
          {data.personal.avatar && (
            <div className="mb-8 relative inline-block">
              <div
                className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 shadow-2xl pulse-glow"
                style={{ borderColor: data.colors.secondary }}
              >
                <img
                  src={data.personal.avatar}
                  alt={data.personal.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            </div>
          )}

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
            style={{ color: data.colors.primary }}
          >
            {data.personal.name}
          </h1>

          <p
            className="text-xl md:text-2xl font-medium mb-6"
            style={{ color: data.colors.secondary }}
          >
            {data.personal.title}
          </p>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: data.colors.textMuted }}
          >
            {data.personal.tagline}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {data.personal.email && (
              <a
                href={`mailto:${data.personal.email}`}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: data.colors.secondary,
                  color: '#fff',
                }}
              >
                <Mail size={18} />
                Contact Me
              </a>
            )}
            {data.personal.github && (
              <a
                href={`https://${data.personal.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full font-medium border-2 transition-all duration-300 hover:scale-105"
                style={{
                  borderColor: data.colors.primary,
                  color: data.colors.primary,
                }}
              >
                <Github size={18} />
                GitHub
              </a>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: data.colors.textMuted }}>
            {data.personal.location && (
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                {data.personal.location}
              </span>
            )}
            {data.personal.email && (
              <span className="flex items-center gap-2">
                <Mail size={16} />
                {data.personal.email}
              </span>
            )}
            {data.personal.phone && (
              <span className="flex items-center gap-2">
                <Phone size={16} />
                {data.personal.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        style={{ color: data.colors.textMuted }}
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
}

function LogoCarousel({ logos, theme }: { logos: string[]; theme: string }) {
  if (!logos.length) return null;
  const duplicated = [...logos, ...logos];

  return (
    <div
      className="py-12 overflow-hidden border-y"
      style={{
        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
      }}
    >
      <div className="logo-slide flex items-center gap-12 whitespace-nowrap" style={{ width: `${duplicated.length * 180}px` }}>
        {duplicated.map((logo, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-24 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300"
          >
            <img
              src={logo}
              alt="Company logo"
              className="max-h-12 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
              onError={(e) => { (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-24 h-12 bg-gray-200 rounded"></div>'; }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function About({ data }: { data: ParsedData }) {
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: data.colors.primary }}
          >
            {data.about.title}
          </h2>
          <div
            className="w-20 h-1 mx-auto rounded-full"
            style={{ backgroundColor: data.colors.secondary }}
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <p
            className="text-lg md:text-xl leading-relaxed mb-8 text-center"
            style={{ color: data.colors.text }}
          >
            {data.about.summary}
          </p>

          <div
            className="prose prose-lg max-w-none p-8 rounded-2xl"
            style={{
              backgroundColor: data.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              color: data.colors.textMuted,
            }}
          >
            {data.about.text.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-4 leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SoftwareKnown({ data }: { data: ParsedData }) {
  if (!data.software.length) return null;

  return (
    <section id="software" className="py-20 md:py-32" style={{ backgroundColor: data.theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3"
            style={{ color: data.colors.primary }}
          >
            <Code size={36} />
            Tech Stack & Tools
          </h2>
          <div
            className="w-20 h-1 mx-auto rounded-full"
            style={{ backgroundColor: data.colors.secondary }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {data.software.map((sw, i) => (
            <div
              key={i}
              className="p-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: data.theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
                boxShadow: data.theme === 'dark' ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold" style={{ color: data.colors.text }}>
                  {sw.name}
                </span>
                <span
                  className="text-sm font-medium px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: data.colors.secondary + '20',
                    color: data.colors.secondary,
                  }}
                >
                  {sw.level}
                </span>
              </div>
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: data.theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
              >
                <div
                  className="h-full rounded-full skill-bar transition-all duration-1000"
                  style={{
                    width: `${sw.proficiency}%`,
                    background: `linear-gradient(90deg, ${data.colors.secondary}, ${data.colors.accent})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills({ data }: { data: ParsedData }) {
  if (!data.skills.length) return null;

  return (
    <section id="skills" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3"
            style={{ color: data.colors.primary }}
          >
            <Layers size={36} />
            Skills & Expertise
          </h2>
          <div
            className="w-20 h-1 mx-auto rounded-full"
            style={{ backgroundColor: data.colors.secondary }}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {data.skills.map((category, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg"
              style={{
                borderColor: data.colors.secondary + '30',
                backgroundColor: data.theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#fff',
              }}
            >
              <h3
                className="text-lg font-semibold mb-4 pb-2 border-b"
                style={{ color: data.colors.secondary, borderColor: data.colors.secondary + '20' }}
              >
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill, j) => (
                  <span
                    key={j}
                    className="px-3 py-1.5 text-sm rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: data.colors.primary + '10',
                      color: data.colors.text,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience({ data }: { data: ParsedData }) {
  if (!data.experience.length) return null;

  return (
    <section id="experience" className="py-20 md:py-32" style={{ backgroundColor: data.theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3"
            style={{ color: data.colors.primary }}
          >
            <Briefcase size={36} />
            Work Experience
          </h2>
          <div
            className="w-20 h-1 mx-auto rounded-full"
            style={{ backgroundColor: data.colors.secondary }}
          />
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {data.experience.map((exp, i) => (
            <div
              key={i}
              className="relative pl-8 md:pl-0"
            >
              {i < data.experience.length - 1 && (
                <div
                  className="absolute left-3 top-20 bottom-0 w-0.5 hidden md:block"
                  style={{ backgroundColor: data.colors.secondary + '30', left: '-1.5rem' }}
                />
              )}

              <div
                className="p-6 md:p-8 rounded-2xl transition-all duration-300 hover:scale-[1.01]"
                style={{
                  backgroundColor: data.theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
                  boxShadow: data.theme === 'dark' ? 'none' : '0 10px 40px -10px rgba(0,0,0,0.15)',
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                  {exp.logo && (
                    <div className="flex-shrink-0">
                      <img
                        src={exp.logo}
                        alt={exp.company}
                        className="w-16 h-16 rounded-xl object-cover shadow-md"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-1" style={{ color: data.colors.primary }}>
                      {exp.role}
                    </h3>
                    <p className="font-medium" style={{ color: data.colors.secondary }}>
                      {exp.company}
                    </p>
                  </div>
                  <div className="flex flex-col md:items-end text-sm" style={{ color: data.colors.textMuted }}>
                    <span className="flex items-center gap-2">
                      <Calendar size={14} />
                      {exp.duration}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-2 mt-1">
                        <MapPin size={14} />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                <p className="mb-4" style={{ color: data.colors.textMuted }}>
                  {exp.description}
                </p>

                {exp.highlights.length > 0 && (
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-sm"
                        style={{ color: data.colors.text }}
                      >
                        <span
                          className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                          style={{ backgroundColor: data.colors.secondary }}
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Education({ data }: { data: ParsedData }) {
  if (!data.education.length) return null;

  return (
    <section id="education" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3"
            style={{ color: data.colors.primary }}
          >
            <GraduationCap size={36} />
            Education
          </h2>
          <div
            className="w-20 h-1 mx-auto rounded-full"
            style={{ backgroundColor: data.colors.secondary }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {data.education.map((edu, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border-l-4 transition-all duration-300 hover:shadow-lg"
              style={{
                borderLeftColor: data.colors.secondary,
                backgroundColor: data.theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
                boxShadow: data.theme === 'dark' ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold" style={{ color: data.colors.primary }}>
                  {edu.degree}
                </h3>
                <span
                  className="text-sm px-3 py-1 rounded-full"
                  style={{ backgroundColor: data.colors.primary + '10', color: data.colors.textMuted }}
                >
                  {edu.year}
                </span>
              </div>
              <p className="font-medium mb-2" style={{ color: data.colors.secondary }}>
                {edu.school}
              </p>
              <p className="text-sm" style={{ color: data.colors.textMuted }}>
                {edu.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Portfolio({ data }: { data: ParsedData }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (!data.portfolio.items.length) return null;

  return (
    <section id="portfolio" className="py-20 md:py-32" style={{ backgroundColor: data.theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3"
            style={{ color: data.colors.primary }}
          >
            <FolderOpen size={36} />
            {data.portfolio.title}
          </h2>
          <div
            className="w-20 h-1 mx-auto rounded-full"
            style={{ backgroundColor: data.colors.secondary }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {data.portfolio.items.map((item, i) => (
            <div
              key={i}
              className="group rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
              style={{
                backgroundColor: data.theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
                boxShadow: data.theme === 'dark' ? 'none' : '0 10px 40px -10px rgba(0,0,0,0.15)',
              }}
            >
              {(item.image || item.video) && (
                <div className="relative h-56 overflow-hidden">
                  {item.video && activeVideo === item.title ? (
                    <video
                      src={item.video}
                      className="w-full h-full object-cover"
                      autoPlay
                      controls
                      onError={() => setActiveVideo(null)}
                    />
                  ) : item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : null}
                  {item.video && activeVideo !== item.title && (
                    <button
                      onClick={() => setActiveVideo(item.title)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play size={24} fill={data.colors.primary} color={data.colors.primary} />
                      </div>
                    </button>
                  )}
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: data.colors.primary }}>
                  {item.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed" style={{ color: data.colors.textMuted }}>
                  {item.description}
                </p>

                {item.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.split('|').map((tag, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: data.colors.secondary + '15',
                          color: data.colors.secondary,
                        }}
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: data.colors.secondary }}
                  >
                    View Project <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ data }: { data: ParsedData }) {
  return (
    <footer
      className="py-16 border-t"
      style={{
        borderColor: data.colors.textMuted + '20',
        backgroundColor: data.theme === 'dark' ? 'rgba(0,0,0,0.3)' : data.colors.background,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2" style={{ color: data.colors.primary }}>
              {data.personal.name}
            </h3>
            <p style={{ color: data.colors.textMuted }}>{data.personal.title}</p>
          </div>

          <div className="flex gap-4">
            {data.personal.email && (
              <a
                href={`mailto:${data.personal.email}`}
                className="p-3 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: data.colors.primary + '10', color: data.colors.primary }}
              >
                <Mail size={20} />
              </a>
            )}
            {data.personal.linkedin && (
              <a
                href={`https://${data.personal.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: data.colors.primary + '10', color: data.colors.primary }}
              >
                <Linkedin size={20} />
              </a>
            )}
            {data.personal.github && (
              <a
                href={`https://${data.personal.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: data.colors.primary + '10', color: data.colors.primary }}
              >
                <Github size={20} />
              </a>
            )}
            {data.personal.website && (
              <a
                href={`https://${data.personal.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: data.colors.primary + '10', color: data.colors.primary }}
              >
                <Globe size={20} />
              </a>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center" style={{ borderColor: data.colors.textMuted + '20' }}>
          <p className="text-sm" style={{ color: data.colors.textMuted }}>
            {data.footer.text}
          </p>
          <p className="text-sm mt-2" style={{ color: data.colors.textMuted }}>
            {data.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

function LoadingScreen({ error }: { error: string | null }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
      <div className="text-center p-8">
        {error ? (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <X size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to load portfolio</h2>
            <p className="text-gray-500 max-w-md">{error}</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Loading portfolio...</p>
          </>
        )}
      </div>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}

function App() {
  const [data, setData] = useState<ParsedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}source.txt`)
      .then(res => {
        if (!res.ok) throw new Error('Could not load source.txt file');
        return res.text();
      })
      .then(content => {
        const parsed = parseSourceFile(content);
        setData(parsed);
      })
      .catch(err => setError(err.message));
  }, []);

  useEffect(() => {
    if (!data) return;

    document.documentElement.style.setProperty('--color-primary', data.colors.primary);
    document.documentElement.style.setProperty('--color-secondary', data.colors.secondary);
    document.documentElement.style.setProperty('--color-accent', data.colors.accent);
    document.documentElement.style.setProperty('--color-background', data.colors.background);
    document.documentElement.style.setProperty('--color-text', data.colors.text);
    document.documentElement.style.setProperty('--color-text-muted', data.colors.textMuted);
    document.documentElement.style.setProperty('--font-heading', `'${data.fonts.heading}', sans-serif`);
    document.documentElement.style.setProperty('--font-body', `'${data.fonts.body}', sans-serif`);

    if (data.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'software', 'skills', 'experience', 'education', 'portfolio'];
      const scrollPos = window.scrollY + 100;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data && !error) return <LoadingScreen error={null} />;
  if (error) return <LoadingScreen error={error} />;
  if (!data) return <LoadingScreen error={null} />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: data.colors.background }}>
      <Navbar data={data} activeSection={activeSection} />
      <Hero data={data} />
      <LogoCarousel logos={data.companyLogos} theme={data.theme} />
      <About data={data} />
      <SoftwareKnown data={data} />
      <Skills data={data} />
      <Experience data={data} />
      <Education data={data} />
      <Portfolio data={data} />
      <Footer data={data} />
    </div>
  );
}

export default App;
