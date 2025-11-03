import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: 'Shop Everything, Everywhere',
    subtitle: 'Your Way',
    description: 'Discover shops near you and browse products from multiple stores in one place',
    cta: 'Discover Shops',
    ctaLink: '/shops',
    gradient: 'from-primary/90 to-primary/70'
  },
  {
    id: 2,
    title: 'Exclusive Deals',
    subtitle: 'Up to 50% Off',
    description: 'Limited time offers from your favorite shops',
    cta: 'Shop Deals',
    ctaLink: '/deals',
    gradient: 'from-accent/90 to-accent/70'
  },
  {
    id: 3,
    title: 'Earn Rewards',
    subtitle: 'Every Purchase',
    description: 'Collect tokens and refer friends for amazing benefits',
    cta: 'Learn More',
    ctaLink: '/rewards',
    gradient: 'from-primary/90 to-accent/70'
  }
];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`h-full w-full bg-gradient-to-r ${slide.gradient} flex items-center justify-center`}>
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-up">
                {slide.title}
              </h1>
              <p className="text-2xl md:text-3xl mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {slide.subtitle}
              </p>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {slide.description}
              </p>
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 animate-slide-up" 
                style={{ animationDelay: '0.3s' }}
                asChild
              >
                <Link to={slide.ctaLink}>{slide.cta}</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {/* <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button> */}

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};
