
import React, { useEffect, useRef, useCallback } from 'react';

// Custom hook for running a callback on each animation frame
const useAnimationFrame = (callback: () => void) => {
  // FIX: Provide an initial value of `null` to `useRef` and update the type.
  const requestRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    callback();
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};

const CursorGlow: React.FC = () => {
    const mousePosition = useRef({ x: -200, y: -200 });
    const glowPosition = useRef({ x: -200, y: -200 });
    const glowDivRef = useRef<HTMLDivElement>(null);
    const dotDivRef = useRef<HTMLDivElement>(null);
    
    const LERP_FACTOR = 0.08; // Easing factor for the trailing glow

    // Update mouse position from the 'mousemove' event
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePosition.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Animation loop
    const animate = useCallback(() => {
        // Update glow position with linear interpolation for a smooth delay
        const newX = glowPosition.current.x + (mousePosition.current.x - glowPosition.current.x) * LERP_FACTOR;
        const newY = glowPosition.current.y + (mousePosition.current.y - glowPosition.current.y) * LERP_FACTOR;
        glowPosition.current = { x: newX, y: newY };
        
        // Update element styles directly for performance
        if (glowDivRef.current) {
            // Use CSS custom properties to update the background position
            glowDivRef.current.style.setProperty('--x', `${newX}px`);
            glowDivRef.current.style.setProperty('--y', `${newY}px`);
        }
        if (dotDivRef.current) {
            // Use transform to position the dot precisely at the cursor
            dotDivRef.current.style.transform = `translate(${mousePosition.current.x}px, ${mousePosition.current.y}px)`;
        }
    }, []);

    useAnimationFrame(animate);

    return (
        <>
            {/* The large, lagging glow */}
            <div
                ref={glowDivRef}
                className="pointer-events-none fixed inset-0 z-50"
                style={{
                    background: `radial-gradient(600px at var(--x) var(--y), rgba(34, 211, 238, 0.15), transparent 80%)`,
                }}
            />
            {/* The small, precise dot that acts as the main cursor */}
            <div
                ref={dotDivRef}
                className="pointer-events-none fixed top-0 left-0 z-50 -mt-1 -ml-1 h-2 w-2 rounded-full bg-primary"
            />
        </>
    );
};

export default CursorGlow;