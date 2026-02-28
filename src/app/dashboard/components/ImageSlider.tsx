"use client";

import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

interface CardData {
  company: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

const cards: CardData[] = [
  {
    company: "Bedquest",
    image: "/crm-sliderImage.jfif",
    title: "We Made A Community Mural With AI",
    description:
      "Using tools like geofencing and keyword retargeting, we target customers based on location and behavior, ensuring every impression counts.",
    tags: ["CEO", "SEO", "Branding"],
    link: "#",
  },
  {
    company: "Apple",
    image: "\\crm-siderImage7.png",
    title: "Reimagining Retail Experience",
    description:
      "Apple redefined in-store customer interactions using AR and personalized AI assistants.",
    tags: ["AR", "UX", "Retail"],
    link: "#",
  },
  {
    company: "Google",
    image: "/crm-sliderImage22.webp",
    title: "AI-Powered Workspace Tools",
    description:
      "Google Workspace now leverages AI to automate workflow and increase team productivity.",
    tags: ["AI", "Cloud", "Productivity"],
    link: "#",
  },
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
        setIsTransitioning(false);
        AOS.refresh();
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentCard = cards[currentIndex];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Main slide image */}
      <div
        className={`relative w-full h-[26vh] transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
      >
        <img
          src={currentCard.image}
          alt={currentCard.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Multi-layer gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-4">

          {/* Company chip */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-bold tracking-widest uppercase text-white/80">
              <span className="w-1 h-1 rounded-full bg-white/60" />
              {currentCard.company}
            </span>
            {/* Tags */}
            {currentCard.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-white/8 backdrop-blur-md border border-white/10 text-[9px] font-semibold tracking-wider uppercase text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2
            key={`title-${currentIndex}`}
            data-aos="fade-up"
            className="text-white text-lg font-bold leading-snug tracking-tight drop-shadow-lg max-w-[85%]"
          >
            {currentCard.title}
          </h2>

          {/* Progress bar + dots row */}
          <div className="flex items-center gap-2 mt-3">
            {/* Animated progress bar for current slide */}
            <div className="flex-1 h-[2px] rounded-full bg-white/15 overflow-hidden">
              <div
                key={`bar-${currentIndex}`}
                className="h-full bg-white/70 rounded-full"
                style={{
                  animation: "slideProgress 3s linear forwards",
                }}
              />
            </div>

            {/* Dot indicators */}
            <div className="flex items-center gap-1 shrink-0">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentIndex(i);
                      setIsTransitioning(false);
                    }, 300);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-4 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/30"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Counter */}
            <span className="text-[10px] font-bold tabular-nums text-white/40 shrink-0">
              {String(currentIndex + 1).padStart(2, "0")}/{String(cards.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar keyframe */}
      <style jsx>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}