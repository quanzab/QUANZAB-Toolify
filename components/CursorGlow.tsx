import React, { useState, useEffect } from 'react';

const CursorGlow: React.FC = () => {
    const [position, setPosition] = useState({ x: -200, y: -200 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-50 transition duration-300 lg:absolute"
            style={{
                background: `radial-gradient(600px at ${position.x}px ${position.y}px, rgba(34, 211, 238, 0.15), transparent 80%)`,
            }}
        />
    );
};

export default CursorGlow;
