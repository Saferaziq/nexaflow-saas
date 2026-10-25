'use client';
import { useEffect, useRef } from 'react';

export default function LogoCanvas({ width = 800, height = 450, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Logic dari file HTML Anda
    const drawJSLogo = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const darkNavy = '#0a192f';
      const deepBlue = '#0d3b66';
      const cyanBlue = '#006699';
      const brightTeal = '#00a8cc';

      const gradMain = ctx.createLinearGradient(150, 100, 650, 350);
      gradMain.addColorStop(0, darkNavy);
      gradMain.addColorStop(0.4, deepBlue);
      gradMain.addColorStop(0.8, cyanBlue);
      gradMain.addColorStop(1, brightTeal);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(0, 168, 204, 0.4)';
      const binaryStrings = ["01001010", "01010011", "10101001", "01101010", "11001101"];
      
      binaryStrings.forEach((str, i) => {
        ctx.fillText(str, 360 + (i * 12), 180 + (i * 22));
        ctx.fillText(str, 480 + (i * 10), 150 + (i * 20));
      });

      ctx.beginPath();
      ctx.lineWidth = 32;
      ctx.strokeStyle = gradMain;
      
      ctx.moveTo(220, 150);
      ctx.lineTo(220, 260);
      ctx.bezierCurveTo(220, 330, 310, 330, 310, 260);
      ctx.lineTo(310, 120);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#ffffff';
      ctx.moveTo(220, 150);
      ctx.lineTo(220, 260);
      ctx.bezierCurveTo(220, 315, 310, 315, 310, 260);
      ctx.lineTo(310, 120);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 32;
      ctx.strokeStyle = gradMain;
      
      ctx.moveTo(310, 120);
      ctx.bezierCurveTo(310, 60, 480, 60, 480, 150);
      ctx.bezierCurveTo(480, 240, 360, 210, 360, 290);
      ctx.bezierCurveTo(360, 370, 520, 370, 560, 300);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#ffffff';
      ctx.moveTo(320, 120);
      ctx.bezierCurveTo(320, 75, 470, 75, 470, 150);
      ctx.bezierCurveTo(470, 230, 370, 220, 370, 290);
      ctx.bezierCurveTo(370, 355, 510, 355, 545, 305);
      ctx.stroke();

      function drawPixelGroup(startX, startY, color, size, pattern) {
        ctx.fillStyle = color;
        pattern.forEach(p => {
          ctx.fillRect(startX + (p.x * size * 1.2), startY + (p.y * size * 1.2), size, size);
        });
      }

      const pixelsLeft = [
        {x: 0, y: 0}, {x: -1, y: 0}, {x: -2, y: 1}, {x: -1, y: -1},
        {x: -3, y: 0}, {x: -2, y: -2}, {x: -4, y: 1}, {x: -3, y: -1}
      ];
      drawPixelGroup(220, 130, darkNavy, 8, pixelsLeft);

      const pixelsRight = [
        {x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 2, y: 1},
        {x: 2, y: -1}, {x: 3, y: 0}, {x: 3, y: -2}, {x: 4, y: -1},
        {x: 4, y: 1}, {x: 5, y: -1}
      ];
      drawPixelGroup(560, 280, brightTeal, 9, pixelsRight);
    };

    drawJSLogo();
  }, []);

  return <canvas ref={canvasRef} width={width} height={height} className={className} />;
}