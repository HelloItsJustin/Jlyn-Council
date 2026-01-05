import { useEffect, useRef } from 'react';

interface EncryptionVisualizerProps {
  text: string;
  isEncrypting: boolean;
}

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  char: string;
  progress: number;
}

export default function EncryptionVisualizer({ text, isEncrypting }: EncryptionVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isEncrypting) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    const particles: Particle[] = [];
    const chars = text.split('').slice(0, 50);

    chars.forEach((char, i) => {
      const angle = (i / chars.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.3;
      const centerX = width / 2;
      const centerY = height / 2;

      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        targetX: centerX + Math.cos(angle + Math.PI) * radius,
        targetY: centerY + Math.sin(angle + Math.PI) * radius,
        char,
        progress: 0,
      });
    });

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle, i) => {
        particle.progress = Math.min(particle.progress + 0.02, 1);

        const currentX = particle.x + (particle.targetX - particle.x) * particle.progress;
        const currentY = particle.y + (particle.targetY - particle.y) * particle.progress;

        const hue = 200 + (particle.progress * 80);
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${0.8 - particle.progress * 0.3})`;
        ctx.font = '14px monospace';
        ctx.fillText(particle.char, currentX, currentY);

        if (i > 0) {
          const prevParticle = particles[i - 1];
          const prevX = prevParticle.x + (prevParticle.targetX - prevParticle.x) * prevParticle.progress;
          const prevY = prevParticle.y + (prevParticle.targetY - prevParticle.y) * prevParticle.progress;

          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(currentX, currentY);
          ctx.strokeStyle = `hsla(${hue}, 60%, 50%, ${0.2 - particle.progress * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      if (particles.some(p => p.progress < 1)) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [text, isEncrypting]);

  if (!isEncrypting) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  );
}
