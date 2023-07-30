import React, { useEffect, useRef, useState, RefObject } from "react";
import './Animation.css';


interface AnimatedWrapperProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  style?: React.CSSProperties;
  className?: string;
}

const AnimatedWrapper : React.FC<AnimatedWrapperProps> = ({ children, direction = "left", style, className }) => {
  const ref : RefObject<HTMLDivElement> = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isAnimated) {
          setIsVisible(true);
          setIsAnimated(true);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isAnimated]);

  return (
    <div
      style={style}
      ref={ref} 
      className={`${isVisible ? `animate-${direction}` : ""} ${className}`}>
      {children}
    </div>
  );
};

export default AnimatedWrapper;
