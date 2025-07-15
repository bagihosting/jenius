'use client';
import React, { useEffect, useState } from 'react';

const confettiColors = ['#FFEB3B', '#87CEEB', '#FF69B4', '#32CD32', '#FF8C00'];

export const Confetti: React.FC = () => {
    const [pieces, setPieces] = useState<React.ReactElement[]>([]);

    useEffect(() => {
        const newPieces = Array.from({ length: 100 }).map((_, index) => {
            const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            const style: React.CSSProperties = {
                left: `${Math.random() * 100}%`,
                backgroundColor: color,
                animationDelay: `${Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
                width: `${Math.floor(Math.random() * 5) + 5}px`,
                height: `${Math.floor(Math.random() * 10) + 5}px`,
            };
            return <div key={index} className="confetti" style={style} />;
        });
        setPieces(newPieces);
    }, []);

    return <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">{pieces}</div>;
};
