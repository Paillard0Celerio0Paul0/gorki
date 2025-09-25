'use client';

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-10-01T20:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white relative overflow-hidden">
      {/* Effet de particules sombres en arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.8),transparent_70%)]"></div>
      
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white opacity-0 animate-fade-in text-shadow-glow">
          Gorki SoloQ Challenge
        </h1>
      </div>

      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 md:p-8 text-center border border-gray-800/50 opacity-0 animate-fade-in-delay-2 shadow-2xl hover:border-gray-700/70 transition-all duration-300">
          <div className="text-4xl md:text-6xl font-bold text-white mb-2 font-mono text-shadow-glow">
            {timeLeft.days.toString().padStart(2, '0')}
          </div>
          <div className="text-sm md:text-lg text-gray-500 font-medium">
            Jours
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 md:p-8 text-center border border-gray-800/50 opacity-0 animate-fade-in-delay-3 shadow-2xl hover:border-gray-700/70 transition-all duration-300">
          <div className="text-4xl md:text-6xl font-bold text-white mb-2 font-mono text-shadow-glow">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-sm md:text-lg text-gray-500 font-medium">
            Heures
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 md:p-8 text-center border border-gray-800/50 opacity-0 animate-fade-in-delay-4 shadow-2xl hover:border-gray-700/70 transition-all duration-300">
          <div className="text-4xl md:text-6xl font-bold text-white mb-2 font-mono text-shadow-glow">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-sm md:text-lg text-gray-500 font-medium">
            Minutes
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 md:p-8 text-center border border-gray-800/50 opacity-0 animate-fade-in-delay-5 shadow-2xl hover:border-gray-700/70 transition-all duration-300">
          <div className="text-4xl md:text-6xl font-bold text-white mb-2 font-mono text-shadow-glow">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-sm md:text-lg text-gray-500 font-medium">
            Secondes
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
        
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.1);
        }
        
        .animate-fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1.2s ease-out 0.3s forwards;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 1.2s ease-out 0.6s forwards;
        }
        
        .animate-fade-in-delay-3 {
          animation: fade-in 1.2s ease-out 0.9s forwards;
        }
        
        .animate-fade-in-delay-4 {
          animation: fade-in 1.2s ease-out 1.2s forwards;
        }
        
        .animate-fade-in-delay-5 {
          animation: fade-in 1.2s ease-out 1.5s forwards;
        }
        
        .animate-fade-in-delay-6 {
          animation: fade-in 1.2s ease-out 1.8s forwards;
        }
      `}</style>
    </div>
  );
}
