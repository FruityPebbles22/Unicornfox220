
import React from 'react';
import { GenerationState } from '../types';

interface LoadingScreenProps {
  state: GenerationState;
  message: string;
}

const GlitchText: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="relative inline-block">
      <span className="absolute top-0 left-0 w-full h-full text-cyan-400 opacity-80 animate-glitch1">{text}</span>
      <span className="absolute top-0 left-0 w-full h-full text-fuchsia-500 opacity-80 animate-glitch2">{text}</span>
      <span className="relative">{text}</span>
      <style>{`
        @keyframes glitch1 { 0%, 100% { clip-path: inset(0 0 98% 0); } 10% { clip-path: inset(10% 0 70% 0); } 30% { clip-path: inset(40% 0 40% 0); } 50% { clip-path: inset(90% 0 1% 0); } 70% { clip-path: inset(20% 0 60% 0); } 90% { clip-path: inset(60% 0 20% 0); } }
        .animate-glitch1 { animation: glitch1 2.5s infinite; }
        @keyframes glitch2 { 0%, 100% { clip-path: inset(2% 0 95% 0); } 20% { clip-path: inset(70% 0 10% 0); } 40% { clip-path: inset(33% 0 53% 0); } 60% { clip-path: inset(5% 0 85% 0); } 80% { clip-path: inset(80% 0 5% 0); } }
        .animate-glitch2 { animation: glitch2 2.5s infinite; }
      `}</style>
    </div>
  );
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ state, message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 h-48">
      <div className="w-16 h-16 border-4 border-dashed border-cyan-500 rounded-full animate-spin"></div>
      <div className="text-center">
        <p className="text-2xl text-fuchsia-500 font-bold mb-2 uppercase tracking-widest"><GlitchText text={state.replace('_', ' ')} /></p>
        <p className="text-lg text-cyan-300">{message}</p>
      </div>
    </div>
  );
};