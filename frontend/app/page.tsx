"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Shield,
  Database,
  Lock,
  Zap,
  BarChart3,
  Clock,
  CheckCircle,
  Building2,
  Download,
  Github,
  Twitter,
  Linkedin,
  Terminal,
  Network,
  Cpu,
  Eye,
  Share2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Import fonts in global CSS

// Team member data
const teamMembers = [
  {
    name: "Vanitha Baskaran",
    role: "Mentor, EMBA IIT Madras",
    image: "/team/Maam.png",
  },
  {
    name: "Nidhi Gummaraju",
    role: "Blockchain & Compliance Developer",
    image: "/team/nidhi.jpg",
  },
  {
    name: "Shruthi Mohan",
    role: "AI/ML & Strategy Engineer",
    image: "/team/shruthi.jpg",
  },
  {
    name: "Venkataraman TSK",
    role: "Backend Engineer",
    image: "/team/venkat.jpg",
  },
  {
    name: "Nitin Karthick RP",
    role: "Frontend Developer",
    image: "/team/nitin.jpg",
  },
]

// Security Protocol Data
const protocolElements = [
  {
    id: 0,
    title: "ShadowFi Protocol",
    tagline: "Trap. Trace. Terminate.",
    icon: Eye,
    description: "Core deception tech using AI-generated decoys and shadow transactions.",
    features: [
      { label: "Phantom Transactions", details: "AI-generated decoy transactions." },
      { label: "Shadow Layer", details: "Parallel decoy versions of sensitive transactions." },
      { label: "Graph-Based Fraud Mapping", details: "Maps malicious connections via metadata." },
      { label: "Zero-Knowledge Identity Vault", details: "Privacy-preserving blockchain identity." }
    ]
  },
  {
    id: 1,
    title: "SynapseSync",
    tagline: "Interbank Neural Fraud Propagation",
    icon: Share2,
    description: "Collaborative network defense sharing abstracted fraud patterns.",
    features: [
      { label: "Fraud Pattern Sharing", details: "Real-time abstracted pattern sharing." },
      { label: "Proactive Protection", details: "Keeps the ecosystem ahead of threats." }
    ]
  },
  {
    id: 2,
    title: "Time-Lock Verification",
    tagline: "Behavioral Decay Analysis",
    icon: Clock,
    description: "Adaptive security freezing high-risk transactions for behavioral checks.",
    features: [
      { label: "Transaction Freezing", details: "Temporary freeze for high-risk transactions." },
      { label: "Behavioral Analysis", details: "Uses device motion, geo-location, etc." }
    ]
  },
  {
    id: 3,
    title: "SplitMesh Tokenization",
    tagline: "Fragmented Data Security",
    icon: Database,
    description: "Enhances security by fragmenting data across encrypted silos.",
    features: [
      { label: "Data Fragmentation", details: "Data broken into encrypted shards." },
      { label: "Smart Contract Authorization", details: "Secure data recombination." }
    ]
  }
];

// Simple Animated Background Grid Component
function AnimatedGridBackground() {
  return (
    <div suppressHydrationWarning
      className="absolute inset-0 z-0 opacity-[0.04]"
      style={{
        backgroundImage: `linear-gradient(#00C3FF 1px, transparent 1px), linear-gradient(to right, #00C3FF 1px, transparent 1px)`,
        backgroundSize: `40px 40px`,
        animation: 'gridPan 20s linear infinite',
      }}
    ></div>
  )
}

// Cyber Background Component
function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const particles: any[] = [];
    const particleCount = 50;
    const maxDistance = 150;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createParticles();
    };

    const createParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: `rgba(0, 195, 255, ${Math.random() * 0.3 + 0.1})`
        });
      }
    };

    const drawParticles = () => {
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
    };

    const updateParticles = () => {
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
    };

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 195, 255, ${1 - distance / maxDistance * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(0, 195, 255, 0.05)';
      ctx.lineWidth = 0.5;
      const gridSize = 40;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      updateParticles();
      drawParticles();
      connectParticles();
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
      className="absolute inset-0 w-full h-full opacity-30"
    />
  );
}

// Binary Background Component
function BinaryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const binaryStreams: any[] = [];
    const streamCount = 20;
    const fontSize = 14;
    const speed = 2;

    const resizeCanvas = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      dimensionsRef.current = { width, height };
      createStreams();
    };

    const createStreams = () => {
      binaryStreams.length = 0;
      for (let i = 0; i < streamCount; i++) {
        binaryStreams.push({
          x: Math.random() * dimensionsRef.current.width,
          y: -Math.random() * dimensionsRef.current.height,
          speed: speed + Math.random() * 2,
          length: Math.floor(Math.random() * 20) + 10,
          opacity: Math.random() * 0.3 + 0.1,
          characters: Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0').join('')
        });
      }
    };

    const updateStreams = () => {
      binaryStreams.forEach(stream => {
        stream.y += stream.speed;
        if (stream.y > dimensionsRef.current.height) {
          stream.y = -stream.length * fontSize;
          stream.x = Math.random() * dimensionsRef.current.width;
          stream.characters = Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0').join('');
        }
      });
    };

    const drawStreams = () => {
      ctx.clearRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = 'center';

      binaryStreams.forEach(stream => {
        const characters = stream.characters.split('');
        characters.forEach((char: string, i: number) => {
          const y = stream.y + i * fontSize;
          if (y >= 0 && y <= dimensionsRef.current.height) {
            ctx.fillStyle = `rgba(0, 195, 255, ${stream.opacity * (1 - i / characters.length)})`;
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
      className="absolute inset-0 w-full h-full opacity-30"
    />
  );
}

// Sign-in Choice Popup Component
function SignInChoicePopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="absolute inset-0 bg-[#010413]/70 backdrop-blur-md"
        style={{animation: 'fadeIn 0.3s ease-out'}}
        aria-hidden="true"
      />
      
      <div 
        className="relative z-10 w-full max-w-md p-6 rounded-xl overflow-hidden bg-[#010413]/40 border border-[#00C3FF]/20 backdrop-blur-xl shadow-xl animate-fadeIn cyber-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated grid */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(#00C3FF 1px, transparent 1px), linear-gradient(to right, #00C3FF 1px, transparent 1px)`,
            backgroundSize: `40px 40px`,
            animation: 'gridPan 20s linear infinite',
          }}></div>
          
          {/* Animated circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute border border-[#00C3FF]/20 rounded-full animate-pulse-slow"
                style={{
                  width: `${100 + i * 100}px`,
                  height: `${100 + i * 100}px`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
          

          
          {/* Subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00C3FF]/5 to-transparent opacity-20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
        


          {/* Logo */}
          <div className="flex justify-center mb-6 cyber-logo">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#00C3FF]/10 blur-md animate-pulse-slow"></div>
              <Image src="/logo.png" alt="Fortifi Logo" width={90} height={90} className="relative z-10" />
            </div>
          </div>
          
          {/* Title with terminal effect */}
          <div className="text-center mb-1">
            <div className="inline-flex items-center bg-[#00C3FF]/10 px-3 py-1 rounded-full mb-3 border border-[#00C3FF]/20">
              
              <span className="text-[#00C3FF] text-xs font-mono">system.auth_v1.0</span>
            </div>
            <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A0DFFF]">
              Choose Sign In Method
            </h2>
          </div>
          
          <p className="text-[#00C3FF] text-center mb-8 font-mono">
            <span className="text-white/70">$</span> select access_portal --secure
          </p>
          
          {/* Options */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link 
              href="/login-banker" 
              className="group flex flex-col items-center p-6 rounded-lg border border-[#00C3FF]/30 bg-[#010413]/60 hover:bg-[#00C3FF]/10 hover:border-[#00C3FF]/60"
            >
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-[#00C3FF]/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                <Building2 className="h-12 w-12 text-[#00C3FF] relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-l font-bold text-white mb-1 group-hover:text-[#00C3FF] transition-colors">Banker Sign In</h3>
              <p className="text-sm text-[#A0DFFF] text-center">For bank staff and administrators</p>
              <div className="mt-3 w-0 group-hover:w-full h-px bg-gradient-to-r from-transparent via-[#00C3FF] to-transparent transition-all duration-700"></div>
            </Link>
            
            <Link 
              href="/login-customer" 
              className="group flex flex-col items-center p-6 rounded-lg border border-[#00C3FF]/30 bg-[#010413]/60 hover:bg-[#00C3FF]/10 hover:border-[#00C3FF]/60"
            >
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-[#00C3FF]/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                <User className="h-12 w-12 text-[#00C3FF] relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-l font-bold text-white mb-1 group-hover:text-[#00C3FF] transition-colors">Customer Sign In</h3>
              <p className="text-sm text-[#A0DFFF] text-center">For account holders and clients</p>
              <div className="mt-3 w-0 group-hover:w-full h-px bg-gradient-to-r from-transparent via-[#00C3FF] to-transparent transition-all duration-700"></div>
            </Link>
          </div>
          
          {/* Security indicators */}
          <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-[#A0DFFF]">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Secure Connection</span>
            </div>
            <div className="h-4 w-px bg-[#00C3FF]/20"></div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-[#00C3FF]" />
              <span>End-to-End Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { setTheme } = useTheme()
  const [showSignInPopup, setShowSignInPopup] = useState(false)

  useEffect(() => {
    // Set dark theme when page loads
    setTheme('dark')
  }, [setTheme])

  return (
    <div suppressHydrationWarning className="w-full min-h-screen bg-[#010413] text-[#E0E0E0] font-sans antialiased relative overflow-x-hidden">
      {/* Animated Background Grid */}
      <AnimatedGridBackground />

      {/* Main Content Container - Remove Header */}
      <div className="relative z-10 max-w-[1920px] mx-auto">
        <main>
          <Hero onSignInClick={() => setShowSignInPopup(true)} />
          <Features />
          <SecurityProtocol />
          <Team />
          <CTA onSignInClick={() => setShowSignInPopup(true)} />
        </main>
        <Footer />
      </div>
      
      {/* Sign In Choice Popup */}
      <SignInChoicePopup isOpen={showSignInPopup} onClose={() => setShowSignInPopup(false)} />
    </div>
  )
}

// Hero Section Component - Enhanced with Particles & Blocks
function Hero({ onSignInClick }: { onSignInClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const particleCount = 70;
    const maxDistance = 120;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createParticles();
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3, // Slower speed
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5, // Smaller particles
          color: `rgba(224, 224, 224, ${Math.random() * 0.5 + 0.3})` // E0E0E0 with opacity
        });
      }
    };

    const drawParticles = () => {
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
    };

    const updateParticles = () => {
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
    };

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 195, 255, ${1 - distance / maxDistance * 0.7})`; // #00C3FF with opacity based on distance
            ctx.lineWidth = 0.3;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Add subtle block-like elements (simple example)
    const drawBlocks = () => {
        ctx.strokeStyle = 'rgba(0, 195, 255, 0.05)'; // Faint blue
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
            const y = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;
            const size = Math.random() * 30 + 20;
            ctx.strokeRect(x - size / 2, y - size / 2, size, size);
        }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBlocks();
      updateParticles();
      drawParticles();
      connectParticles();
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
    <section suppressHydrationWarning className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 overflow-hidden">
      {/* Canvas for Particle and Block Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full"></canvas>

      {/* Existing Background Elements (Reduced Opacity maybe) */}
      <div className="absolute inset-0 z-[-1]"> {/* Ensure canvas is behind but grid/noise are further back */} 
        {/* Glowing Lines - Kept */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#00C3FF]/20 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-px h-full bg-gradient-to-t from-transparent via-[#00C3FF]/20 to-transparent animate-pulse delay-500"></div>
        {/* Subtle Grid - Kept */}
        <div
           className="absolute inset-0 opacity-[0.02]"
           style={{
             backgroundImage: `linear-gradient(45deg, #00C3FF 1px, transparent 1px), linear-gradient(-45deg, #00C3FF 1px, transparent 1px)`,
             backgroundSize: `60px 60px`,
           }}
         ></div>
       </div>

      {/* Content Area - Z-index increased */}
      <div className="relative z-10 max-w-4xl mx-auto mt-10 md:mt-0">
        {/* Logo */}
        <div className="mb-8 flex justify-center opacity-80 hover:opacity-100 transition-opacity animate-fadeIn delay-100">
          <Image src="/logo.png" alt="FortiFi Logo" width={150} height={150} />
        </div>

        {/* Terminal Style Tag */}
        <div className="inline-block px-4 py-1 mb-6 border border-[#00C3FF]/30 bg-[#010413]/70 backdrop-blur-sm rounded text-[#00C3FF] text-sm font-mono tracking-wider animate-fadeInUp delay-200">
          &gt; FortiFi v1.0 Initialized...
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A0DFFF] animate-fadeIn delay-300 drop-shadow-lg">
          Secure Finance.<br /> Instantly.
          </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-[#00C3FF] mb-10 max-w-2xl mx-auto font-light animate-fadeInUp delay-500">
          FortiFi uses AI-driven deception and blockchain verification to <span className="text-white font-medium">trap</span>, <span className="text-white font-medium">trace</span>, and <span className="text-white font-medium">terminate</span> fraud before it impacts you.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-700">
          <Button
            size="lg"
            className="bg-[#00C3FF] text-[#010413] hover:bg-white font-bold px-8 py-3 rounded transition-colors group text-base shadow-lg hover:shadow-[#00C3FF]/30"
            onClick={onSignInClick}
          >
            Authenticate <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-[#00C3FF]/30 hover:border-[#00C3FF] hover:bg-[#00C3FF]/10 font-medium px-8 py-3 rounded transition-colors group text-base backdrop-blur-sm"
            asChild
          >
            <Link href="#features">
              Load Modules <span className="ml-1.5 font-mono opacity-50 group-hover:opacity-100 transition-opacity">[↓]</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// Features Section Component - Enhanced
function Features() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const binaryStreams: any[] = [];
    const streamCount = 8; // Reduced number of streams for larger size
    const fontSize = 24; // Increased font size for larger binary digits
    const speed = 2;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createStreams();
    };

    const createStreams = () => {
      binaryStreams.length = 0;
      for (let i = 0; i < streamCount; i++) {
        binaryStreams.push({
          x: Math.random() * canvas.width,
          y: -Math.random() * canvas.height,
          speed: speed + Math.random() * 2,
          length: Math.floor(Math.random() * 15) + 10,
          opacity: Math.random() * 0.3 + 0.1,
          characters: Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0').join(''),
          size: fontSize + Math.random() * 8 // Varying sizes for visual interest
        });
      }
    };

    const updateStreams = () => {
      binaryStreams.forEach(stream => {
        stream.y += stream.speed;
        if (stream.y > canvas.height) {
          stream.y = -stream.length * stream.size;
          stream.x = Math.random() * canvas.width;
          stream.characters = Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0').join('');
        }
      });
    };

    const drawStreams = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle grid lines
      ctx.strokeStyle = 'rgba(0, 195, 255, 0.05)';
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw binary streams
      binaryStreams.forEach(stream => {
        const characters = stream.characters.split('');
        characters.forEach((char: string, i: number) => {
          const y = stream.y + i * stream.size;
          if (y >= 0 && y <= canvas.height) {
            ctx.font = `${stream.size}px monospace`;
            ctx.textAlign = 'center';
            ctx.fillStyle = `rgba(0, 195, 255, ${stream.opacity * (1 - i / characters.length)})`;
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

  const scroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' 
      ? Math.max(0, currentIndex - 1) 
      : Math.min(featuresList.length - 1, currentIndex + 1);
    setCurrentIndex(newIndex);
  };

  // Expanded descriptions for more content
  const featuresList = [
    {
      icon: Terminal,
      title: "AI-Powered Traps",
      desc: "Deploy intelligent decoys mimicking real assets. Lure malicious actors into isolated environments, revealing attack vectors without risking actual user data or disrupting legitimate operations."
    },
    {
      icon: Network,
      title: "Neural Propagation",
      desc: "Leverage a federated learning model. When one institution detects a novel fraud pattern, abstracted insights are securely shared across the network, instantly immunizing all participants."
    },
    {
      icon: Clock,
      title: "Transaction Time-Lock",
      desc: "High-risk transactions are automatically paused. FortiFi analyzes behavioral biometrics (typing speed, navigation patterns) and contextual data against established profiles before execution."
    },
    {
      icon: Lock,
      title: "SplitMesh Tokenization",
      desc: "User data isn't stored whole. It's fragmented into encrypted shards, distributed across secure nodes. Reassembly requires multi-factor authorization via smart contracts, maximizing breach resistance."
    },
    {
      icon: BarChart3,
      title: "Real-Time Anomaly Scoring",
      desc: "Our AI engine scores every transaction in milliseconds based on hundreds of data points. Anomalies exceeding risk thresholds trigger immediate alerts or automated interventions like Time-Lock."
    },
    {
      icon: Fingerprint,
      title: "Zero-Knowledge Vault",
      desc: "Monitor compromised credentials and data breaches across the dark web using zero-knowledge proofs. Track threats associated with user identities without ever exposing sensitive personal information."
    }
  ]

  return (
    <section suppressHydrationWarning id="features" className="py-20 md:py-24 px-6 md:px-10 lg:px-20 bg-[#010413]/80 backdrop-blur-sm border-y border-[#00C3FF]/10 relative overflow-hidden">
      {/* Enhanced Binary Background Animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40"
      />

      {/* Add subtle noise texture */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A0DFFF]">
            // Proactive Defense Layers
        </h2>
          <p className="text-lg text-[#A0DFFF] max-w-3xl mx-auto font-light font-mono">
            <span className="text-[#00C3FF]">$</span> Our multi-layered AI anticipates and neutralizes threats <span className="text-white/70">[ Status: ACTIVE ]</span>
          </p>
        </div>

        {/* Enhanced Navigation Buttons */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => scroll('left')}
            disabled={currentIndex === 0}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00C3FF]/20 hover:border-[#00C3FF] hover:bg-[#00C3FF]/10 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5 text-[#00C3FF] group-hover:scale-110 transition-transform" />
            <span className="text-[#00C3FF] font-mono">Previous</span>
          </button>
          
          <div className="flex gap-2">
            {featuresList.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-[#00C3FF] scale-125' 
                    : 'bg-[#00C3FF]/30 hover:bg-[#00C3FF]/50'
                }`}
              />
          ))}
        </div>

          <button
            onClick={() => scroll('right')}
            disabled={currentIndex === featuresList.length - 1}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-[#00C3FF]/20 hover:border-[#00C3FF] hover:bg-[#00C3FF]/10 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="text-[#00C3FF] font-mono">Next</span>
            <ChevronRight className="h-5 w-5 text-[#00C3FF] group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Single Card Display */}
        <div className="relative min-h-[400px]">
          {featuresList.map((feature, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-500 ${
                currentIndex === index
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-full'
              }`}
            >
              <div className="group w-full bg-[#0A102A]/80 border border-[#00C3FF]/20 rounded-lg hover:border-[#00C3FF]/50 hover:bg-[#0A102A]/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#00C3FF]/10 overflow-hidden">
                {/* Terminal Header Bar */}
                <div className="flex items-center px-6 py-3 bg-[#00C3FF]/10 border-b border-[#00C3FF]/20">
                  <div className="flex space-x-2 mr-4">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                  </div>
                  <div className="text-[#00C3FF] text-base font-mono">./{feature.title.replace(/\s+/g, '_')}.sh</div>
                </div>

                {/* Card Content */}
                <div className="p-8">
                  <div className="flex items-center mb-8">
                    <div className="p-4 bg-[#00C3FF]/10 border border-[#00C3FF]/20 rounded-md mr-6 group-hover:bg-[#00C3FF]/20 group-hover:border-[#00C3FF]/30 transition-colors">
                      <feature.icon className="h-10 w-10 text-[#00C3FF] group-hover:scale-110 transition-transform duration-200" />
                </div>
                    <h3 className="text-2xl font-bold text-white font-mono">{feature.title}</h3>
                      </div>

                  <p className="text-[#A0DFFF]/90 font-light text-lg leading-relaxed mb-8">
                    {feature.desc}
                  </p>

                  {/* Terminal Cursor */}
                  <div className="flex items-center">
                    <span className="text-[#00C3FF] font-mono text-lg mr-2">$</span>
                    <div className="w-3 h-6 bg-[#00C3FF] animate-pulse"></div>
                    </div>
                        </div>
                        </div>
                        </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Security Protocol Section Component - Enhanced
function SecurityProtocol() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section suppressHydrationWarning id="protocol" className="py-20 md:py-24 px-6 md:px-10 lg:px-20 relative overflow-hidden bg-gradient-to-b from-[#0A102A]/30 to-[#010413]/30">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-32 -mr-32 w-96 h-96 border border-[#00C3FF]/5 rounded-full opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 border border-[#00C3FF]/5 rounded-full opacity-30 animate-pulse-slow delay-500"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 mb-4 border border-[#00C3FF]/30 bg-[#00C3FF]/10 rounded text-[#00C3FF] text-sm font-mono tracking-wider">
            &gt; systemctl status fortifi-protocol
            </div>
          <h2 className="text-5xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A0DFFF] animate-fadeIn delay-300 drop-shadow-lg">
            The FortiFi Protocol
          </h2>
          <p className="text-xl text-[#A0DFFF] max-w-3xl mx-auto font-light font-mono">
            Explore the key components of our adaptive, AI-driven security framework.
            </p>
          </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Tabs Navigation - Enhanced */}
          <div className="flex lg:flex-col lg:w-1/4 overflow-x-auto scrollbar-thin scrollbar-thumb-[#00C3FF]/30 scrollbar-track-transparent lg:overflow-x-visible pb-4 lg:pb-0 space-x-4 lg:space-x-0 lg:space-y-2">
            {protocolElements.map((element, index) => (
              <button
                key={element.id}
                onClick={() => setActiveTab(index)}
                className={`relative flex-shrink-0 w-full text-left px-5 py-4 rounded-lg transition-all duration-300 border-l-4 group ${
                  activeTab === index
                    ? 'bg-[#0A102A]/90 border-[#00C3FF] text-white shadow-lg'
                    : 'border-transparent text-[#A0DFFF] hover:bg-[#0A102A]/50 hover:text-white'
                }`}
              >
                {/* Active Indicator */}
                <div className={`absolute -left-px top-1/4 h-1/2 w-1 rounded-r-full bg-[#00C3FF] transition-opacity duration-300 ${activeTab === index ? 'opacity-100' : 'opacity-0'}`}></div>

                <div className="flex items-center mb-1">
                  <element.icon className={`h-6 w-6 mr-3 transition-colors ${activeTab === index ? 'text-[#00C3FF]' : 'text-[#00C3FF]/70 group-hover:text-[#00C3FF]'}`} />
                  <span className="font-semibold text-lg md:text-xl font-teko">{element.title}</span>
            </div>
                <span className="text-sm font-mono text-[#00C3FF]/70 block pl-8 group-hover:text-[#00C3FF]/90 transition-colors">{element.tagline}</span>
              </button>
            ))}
          </div>

          {/* Tab Content - Enhanced */}
          <div className="lg:w-3/4 relative min-h-[500px]">
            {protocolElements.map((element, index) => (
              <div
                key={element.id}
                className={`absolute inset-0 p-8 bg-[#0A102A]/70 border border-[#00C3FF]/10 rounded-lg transition-all duration-500 ${
                  activeTab === index ? 'opacity-100 z-10' : 'opacity-0 z-0 invisible'
                }`}
                aria-hidden={activeTab !== index}
              >
                {/* Content Header */}
                <div className="mb-8 border-b border-[#00C3FF]/10 pb-6">
                  <h3 className="text-4xl font-bold text-white mb-2 font-teko">{element.title}</h3>
                  <p className="text-[#00C3FF] font-mono text-lg tracking-wider">// {element.tagline}</p>
            </div>

                <p className="text-[#A0DFFF] mb-8 text-xl leading-relaxed font-light">{element.description}</p>

                {/* Features List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {element.features.map((feature, i) => (
                    <div key={i} className="flex items-start bg-[#010413]/40 p-5 rounded border border-transparent hover:border-[#00C3FF]/10 transition-colors">
                      <CheckCircle className="h-6 w-6 text-[#00C3FF] mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white text-lg mb-2 font-teko">{feature.label}</p>
                        <p className="text-base text-[#A0DFFF]/90 font-light leading-relaxed">{feature.details}</p>
        </div>
              </div>
                  ))}
                </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Team Section Component - Enhanced
function Team() {
  return (
    <section suppressHydrationWarning id="team" className="py-20 md:py-24 px-6 md:px-10 lg:px-20 bg-[#010413] border-t border-[#00C3FF]/10 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2300C3FF' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
      }}></div>

      {/* Section Accent */}
      <div className="absolute bottom-0 left-0 w-1/3 h-px bg-gradient-to-r from-[#00C3FF]/40 to-transparent"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-5xl lg:text-5xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A0DFFF] animate-fadeIn delay-300 drop-shadow-lg">
            Meet the Team
          </h2>
          <p className="text-xl text-[#A0DFFF] max-w-3xl mx-auto font-light font-mono">
            $ Teamwork is all it matters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center group flex flex-col items-center">
              <div className="relative h-48 w-48 md:h-56 md:w-56 mx-auto mb-5 rounded-full overflow-hidden border-2 border-[#00C3FF]/20 group-hover:border-[#00C3FF]/60 transition-all duration-300 shadow-lg group-hover:shadow-[#00C3FF]/20">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 192px, 224px"
                  style={{ objectFit: "cover" }}
                  className="group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                />
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#010413]/60 to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300"></div>
                {/* Scan line effect on hover */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-white/10 animate-scanline-vertical opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
              <h3 className="text-xl font-semibold text-white mt-2 font-teko">{member.name}</h3>
              <p className="text-[#00C3FF] text-sm font-mono">{member.role}</p>
          </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section Component - Enhanced
function CTA({ onSignInClick }: { onSignInClick: () => void }) {
  return (
    <section suppressHydrationWarning className="py-20 md:py-24 px-6 relative overflow-hidden">
      {/* Background with enhanced texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A102A] via-[#010413] to-[#0A102A]"></div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(#00C3FF 1px, transparent 1px), linear-gradient(to right, #00C3FF 1px, transparent 1px)`,
        backgroundSize: `40px 40px`,
        animation: 'gridPan 20s linear infinite',
      }}></div>

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00C3FF] to-[#A0DFFF] font-teko">
          Ready to Eliminate Fraud?
          </h2>
        <p className="text-xl md:text-2xl text-[#A0DFFF] mb-10 font-light font-mono max-w-2xl mx-auto">
          $ Securing the future of finance through innovation and intelligence
          <br />
          <span className="text-[#00C3FF]">[ Status: Ready for Deployment ]</span>
        </p>
        <Button
          size="lg"
          className="bg-[#00C3FF] text-[#010413] hover:bg-white font-bold px-10 py-3 rounded transition-colors group text-base shadow-lg hover:shadow-[#00C3FF]/40"
          onClick={onSignInClick}
        >
          Demo <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  )
}

// Footer Component - Enhanced
function Footer() {
  return (
    <footer suppressHydrationWarning className="py-12 px-6 md:px-10 border-t border-[#00C3FF]/20 bg-gradient-to-b from-[#010413] to-[#050B24] relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2300C3FF' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
      }}></div>
      
      {/* Animated subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#00C3FF]/5 to-transparent opacity-20 animate-pulse-slow"></div>

      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center relative z-10">
        {/* Logo and Brand */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-4">
            <Image 
              src="/logo.png" 
              alt="FortiFi Logo" 
              width={120} 
              height={120} 
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
                  </Link>
            </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00C3FF] to-[#A0DFFF] font-light text-center max-w-2xl mb-8">
          Trap. Trace. Terminate. Fraud is over before it begins.
        </p>
        
        {/* Hackathon Info */}
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="px-5 py-2 border border-[#00C3FF]/30 bg-[#00C3FF]/10 rounded-lg backdrop-blur-sm">
            <p className="text-[#00C3FF] text-sm font-mono">Innovision Hackathon 2025</p>
              </div>
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-[#00C3FF]/30 to-transparent hidden md:block"></div>
          <div className="px-5 py-2 border border-[#00C3FF]/30 bg-[#00C3FF]/10 rounded-lg backdrop-blur-sm">
            <p className="text-[#00C3FF] text-sm font-mono">
              Indian Institute of Technology (IIT), Madras
            </p>
            </div>
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-[#00C3FF]/30 to-transparent hidden md:block"></div>
          <div className="px-5 py-2 border border-[#00C3FF]/30 bg-[#00C3FF]/10 rounded-lg backdrop-blur-sm">
            <p className="text-[#00C3FF] text-sm font-mono">
              Team Simpsons
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Add these keyframes to your global CSS
/*
@keyframes gridPan {
  0% { background-position: 0 0; }
  100% { background-position: 40px 40px; }
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/