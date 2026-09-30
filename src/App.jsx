import { useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Engine from './components/Engine';
import Flow from './components/Flow';
import Demo from './components/Demo';
import Bento from './components/Bento';
import Features from './components/Features';
import See from './components/See';
import Why from './components/Why';
import Builders from './components/Builders';
import Faq from './components/Faq';
import Roadmap from './components/Roadmap';
import Access from './components/Access';
import Footer from './components/Footer';

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  useReveal();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <div className="spacer" />
        <Engine />
        <div className="spacer" />
        <Flow />
        <div className="spacer" />
        <Demo />
        <Bento />
        <div className="spacer" />
        <Features />
        <div className="spacer" />
        <See />
        <div className="spacer" />
        <Why />
        <Builders />
        <div className="spacer" />
        <Faq />
        <div className="spacer" />
        <Roadmap />
        <div className="spacer" />
        <Access />
        <div className="spacer" />
      </main>
      <Footer />
    </>
  );
}
