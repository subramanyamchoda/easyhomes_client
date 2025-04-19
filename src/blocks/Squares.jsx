import { useRef, useEffect } from 'react';
import './square.css';
import React from 'react';

const Squares = ({
  direction = 'diagonal',
  speed = 1,
  borderColor = 'gray',
  
  squareSize = 90,
  hoverFillColor = '#222',
  className = ''
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquare = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1;
  
      const centerX = canvas.width / 4;
      const centerY = canvas.height / 4;
  
      for (let x = -squareSize; x < canvas.width + squareSize; x += squareSize) {
          for (let y = -squareSize; y < canvas.height + squareSize; y += squareSize) {
              const squareX = x - (gridOffset.current.x % squareSize);
              const squareY = y - (gridOffset.current.y % squareSize);
  
              // Calculate distance from center
              const dist = Math.sqrt((squareX - centerX) ** 2 + (squareY - centerY) ** 2);
              const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);
              const opacity = 1 - dist / maxDist; // Fade effect
  
              if (hoveredSquare.current && hoveredSquare.current.x === x && hoveredSquare.current.y === y) {
                  ctx.fillStyle = hoverFillColor;
                  ctx.fillRect(squareX, squareY, squareSize, squareSize);
              }
  
              // Apply fading color effect using RGBA
              ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(opacity, 0.1)})`; // Fades towards transparent
              ctx.strokeRect(squareX, squareY, squareSize, squareSize);
          }
      }
  };
  
    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case 'right':
          gridOffset.current.x -= effectiveSpeed;
          break;
        case 'left':
          gridOffset.current.x += effectiveSpeed;
          break;
        case 'up':
          gridOffset.current.y += effectiveSpeed;
          break;
        case 'down':
          gridOffset.current.y -= effectiveSpeed;
          break;
        case 'diagonal':
          gridOffset.current.x -= effectiveSpeed;
          gridOffset.current.y -= effectiveSpeed;
          break;
        default:
          break;
      }
      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      hoveredSquare.current = { x: Math.floor(mouseX / squareSize) * squareSize, y: Math.floor(mouseY / squareSize) * squareSize };
    };

    const handleMouseLeave = () => {
      hoveredSquare.current = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize]);

  return <canvas ref={canvasRef} className={`squares-canvas ${className}`} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}></canvas>;
};

export default Squares;
