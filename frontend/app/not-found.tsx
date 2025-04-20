"use client"

import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { Terminal, AlertTriangle, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

// Cyberpunk Error Code Stream Animation Component
function ErrorCodeStream() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const errorCodeStreams: any[] = [];
    const streamCount = 30;
    const fontSize = 16;
    const speed = 1.5;
    const errorCodes = ['404', 'ERR', 'NULL', 'VOID', 'LOST', '0xdead', 'SEGFAULT', 'ABORT'];

    const resizeCanvas = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      dimensionsRef.current = { width, height };
      createStreams();
    };

    const createStreams = () => {
      errorCodeStreams.length = 0;
      for (let i = 0; i < streamCount; i++) {
        errorCodeStreams.push({
          x: Math.random() * dimensionsRef.current.width,
          y: -Math.random() * dimensionsRef.current.height * 0.5, // Start streams higher up
          speed: speed + Math.random() * 2,
          length: Math.floor(Math.random() * 15) + 10,
          opacity: Math.random() * 0.4 + 0.1,
          characters: Array.from({ length: 20 }, () => errorCodes[Math.floor(Math.random() * errorCodes.length)]).join(' ')
        });
      }
    };

    const updateStreams = () => {
      errorCodeStreams.forEach(stream => {
        stream.y += stream.speed;
        if (stream.y > dimensionsRef.current.height) {
          stream.y = -stream.length * fontSize * 1.5; // Reset higher
          stream.x = Math.random() * dimensionsRef.current.width;
          stream.characters = Array.from({ length: 20 }, () => errorCodes[Math.floor(Math.random() * errorCodes.length)]).join(' ');
        }
      });
    };

    const drawStreams = () => {
      // Semi-transparent background clear for trails effect
      ctx.fillStyle = 'rgba(1, 4, 19, 0.1)'; // Use bg color with low alpha
      ctx.fillRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);

      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = 'center';

      errorCodeStreams.forEach(stream => {
        const characters = stream.characters.split(' ');
        characters.forEach((char: string, i: number) => {
          const y = stream.y + i * fontSize * 1.5; // Increase spacing
          if (y >= 0 && y <= dimensionsRef.current.height) {
            // Alternate colors for a glitchy effect
            const color = Math.random() > 0.8 ? '#FF3333' : '#00C3FF'; // Red or Cyan
            ctx.fillStyle = `${color}${Math.floor(stream.opacity * (1 - i / characters.length) * 255).toString(16).padStart(2, '0')}`;
            ctx.fillText(char, stream.x, y);
          }
        });
      });
    };

    const animate = () => {
      updateStreams();
      drawStreams();
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
    />
  );
}

export default function NotFound() {
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Set timestamp only on the client side after hydration
    setTimestamp(new Date().toISOString());
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div suppressHydrationWarning className="min-h-screen w-full bg-[#010413] text-[#E0E0E0] relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Error Code Stream Animation */}
        <ErrorCodeStream />

        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#FF3333 1px, transparent 1px), linear-gradient(to right, #FF3333 1px, transparent 1px)`,
          backgroundSize: `50px 50px`,
          animation: 'gridPan 30s linear infinite reverse', // Different speed/direction
        }}></div>

        {/* Static Noise */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center text-center p-8 bg-[#010413]/60 border border-[#FF3333]/30 rounded-lg shadow-xl backdrop-blur-md max-w-2xl">
        <AlertTriangle className="w-20 h-20 text-[#FF3333] mb-6 animate-pulse" />

        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-600 mb-4 font-mono">
          404
        </h1>
        <p className="text-2xl md:text-3xl text-[#FF9999] mb-4 font-mono">
          // ERROR: Resource Not Found
        </p>

        <div className="w-full max-w-md bg-[#0A102A]/50 border border-[#FF3333]/20 rounded p-4 mb-8 font-mono text-sm text-left">
          <p className="text-[#FF6666]">{'>'} system.log --level=error --id=404</p>
          <p className="text-[#FF6666]">{'>'} Attempting recovery...</p>
          <p className="text-[#FFAAAA]">Recovery failed. Signal lost.<span className="animate-pulse">_</span></p>
        </div>

        <p className="text-lg text-[#A0DFFF] mb-8 max-w-lg">
          The requested page seems to have been lost in the digital void. Perhaps a typo in the URL or the resource has been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
         
          <Button
            onClick={handleGoBack}
            className="bg-[#00C3FF]/80 text-[#010413] hover:bg-[#00C3FF] font-bold px-8 py-3 rounded transition-colors group text-base shadow-lg hover:shadow-[#00C3FF]/30 border border-[#00C3FF]/50"
          >
              <Home className="mr-2 h-5 w-5" />
              Return To Safety <span className="ml-1.5 font-mono opacity-70 group-hover:opacity-100 transition-opacity">[↵]</span>
            
          </Button>
        </div>
      </div>
    </div>
  )
} 