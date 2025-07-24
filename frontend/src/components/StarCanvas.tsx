import React, { useRef, useEffect } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  alphaDirection: number;
  speed: number;
}

const StarCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Création des étoiles
    const numStars = 200;
    stars.current = [];
    for (let i = 0; i < numStars; i++) {
      stars.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        alphaDirection: Math.random() > 0.5 ? 1 : -1,
        speed: 0.005 + Math.random() * 0.015,
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);

      stars.current.forEach((star) => {
        // Mise à jour de l'opacité pour scintiller
        star.alpha += star.alphaDirection * star.speed;
        if (star.alpha <= 0) {
          star.alpha = 0;
          star.alphaDirection = 1;
        } else if (star.alpha >= 1) {
          star.alpha = 1;
          star.alphaDirection = -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha.toFixed(2)})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Repositionner les étoiles aléatoirement au resize
      stars.current.forEach((star) => {
        star.x = Math.random() * width;
        star.y = Math.random() * height;
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10,
        display: 'block',
      }}
    />
  );
};

export default StarCanvas;
