import Hero from '../components/sections/Hero.jsx';
import About from '../components/sections/About.jsx';
import Skills from '../components/sections/Skills.jsx';
import Experience from '../components/sections/Experience.jsx';
import Projects from '../components/sections/Projects.jsx';
import AchievementsCertifications from '../components/sections/AchievementsCertifications.jsx';
import TechStack from '../components/sections/TechStack.jsx';
import Contact from '../components/sections/Contact.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <AchievementsCertifications />
      <TechStack />
      <Contact />
    </>
  );
}
