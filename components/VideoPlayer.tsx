
import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  onReset: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onReset }) => {
  return (
    <div className="w-full space-y-6 flex flex-col items-center">
      <h2 className="text-3xl text-cyan-400">Your Masterpiece is Ready!</h2>
      <div className="w-full aspect-video bg-black border-2 border-fuchsia-500 rounded-lg overflow-hidden shadow-lg shadow-fuchsia-500/20">
        <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
      </div>
      <button
        onClick={onReset}
        className="px-8 py-3 bg-cyan-500 text-gray-900 font-bold rounded-md text-xl hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all duration-200 shadow-lg shadow-cyan-500/20"
      >
        Generate Another
      </button>
    </div>
  );
};