
import React, { useState, useEffect, useCallback } from 'react';
import { UrlInputForm } from './components/UrlInputForm';
import { LoadingScreen } from './components/LoadingScreen';
import { VideoPlayer } from './components/VideoPlayer';
import { generateYTSScript, generateVideoFromScript } from './services/geminiService';
import { GenerationState } from './types';
import { LOADING_MESSAGES } from './constants';

const App: React.FC = () => {
  const [generationState, setGenerationState] = useState<GenerationState>(GenerationState.IDLE);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  useEffect(() => {
    if (generationState === GenerationState.RENDERING) {
      setLoadingMessage(LOADING_MESSAGES[0]);
      let messageIndex = 1;
      const intervalId = setInterval(() => {
        setLoadingMessage(LOADING_MESSAGES[messageIndex % LOADING_MESSAGES.length]);
        messageIndex++;
      }, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [generationState]);

  const handleGenerate = useCallback(async (youtubeUrl: string) => {
    setErrorMessage(null);
    setGeneratedVideoUrl(null);
    setGenerationState(GenerationState.ANALYZING);
    setLoadingMessage('Analyzing video essence...');

    try {
      // Simulate getting a topic from the URL
      const videoTopic = `A video about "${youtubeUrl.split('v=')[1]?.split('&')[0] || 'something random'}"`;
      
      setGenerationState(GenerationState.SCRIPTING);
      setLoadingMessage('Writing a nonsensical script...');
      const script = await generateYTSScript(videoTopic);

      setGenerationState(GenerationState.RENDERING);
      setLoadingMessage('Directing AI video generator...');
      const videoBlob = await generateVideoFromScript(script);
      
      const videoUrl = URL.createObjectURL(videoBlob);
      setGeneratedVideoUrl(videoUrl);
      setGenerationState(GenerationState.DONE);

    } catch (error) {
      console.error('Video generation failed:', error);
      const err = error as Error;
      setErrorMessage(err.message || 'An unknown error occurred. Please try again.');
      setGenerationState(GenerationState.ERROR);
    }
  }, []);

  const handleReset = () => {
    if (generatedVideoUrl) {
      URL.revokeObjectURL(generatedVideoUrl);
    }
    setGenerationState(GenerationState.IDLE);
    setGeneratedVideoUrl(null);
    setErrorMessage(null);
  };
  
  const isLoading = generationState !== GenerationState.IDLE && generationState !== GenerationState.DONE && generationState !== GenerationState.ERROR;

  return (
    <div className="bg-gray-900 min-h-screen text-cyan-300 flex flex-col items-center justify-center p-4 selection:bg-fuchsia-500 selection:text-white">
      <div className="w-full max-w-2xl bg-black bg-opacity-50 border-2 border-fuchsia-500 rounded-lg shadow-2xl shadow-fuchsia-500/30 p-8 space-y-6 text-center">
        <header className="space-y-2">
          <h1 className="text-5xl md:text-6xl text-fuchsia-500 drop-shadow-[0_0_5px_#fuchsia500]">YTP AI Generator</h1>
          <p className="text-xl text-cyan-400">Turn any YouTube URL into a chaotic masterpiece.</p>
        </header>

        {generationState === GenerationState.IDLE && <UrlInputForm onSubmit={handleGenerate} isLoading={isLoading} />}

        {isLoading && <LoadingScreen state={generationState} message={loadingMessage} />}
        
        {generationState === GenerationState.DONE && generatedVideoUrl && (
          <VideoPlayer videoUrl={generatedVideoUrl} onReset={handleReset} />
        )}
        
        {generationState === GenerationState.ERROR && (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-red-500 text-lg">Error: {errorMessage}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-cyan-500 text-gray-900 font-bold rounded-md hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all duration-200 shadow-lg shadow-cyan-500/20"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
      <footer className="mt-8 text-sm text-gray-500">
        <p>Powered by Gemini. Generated videos are for entertainment purposes only.</p>
      </footer>
    </div>
  );
};

export default App;