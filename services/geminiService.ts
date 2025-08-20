
import { GoogleGenAI } from "@google/genai";
import { SCRIPT_MODEL, VIDEO_MODEL } from '../constants';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateYTSScript = async (videoTopic: string): Promise<string> => {
  const prompt = `
    You are an expert YouTube Poop (YTP) creator. Your task is to write a short, chaotic, and hilarious script for a YTP video based on the following topic: ${videoTopic}.
    The script should be a series of vivid visual and audio descriptions for an AI video generator.
    Use techniques like sentence mixing, stuttering, visual gags, unexpected sound effects, and rapid-fire editing.
    The final video should be under 15 seconds. Describe the scenes vividly as a prompt for an AI video model.
    Do not use characters or copyrighted material. Focus on generic, abstract, or surreal concepts based on the topic.

    Example of a good prompt for the video generator:
    "A close up on a banana that suddenly grows googly eyes. A loud cartoon 'boing' sound. The banana is now spinning in a psychedelic, rainbow-colored vortex. Cut to a goldfish wearing a tiny cowboy hat, swimming in orange soda. A distorted voice says 'The future is now'. The video glitches and reverses for 2 seconds. A final shot of a plastic flamingo melting in fast motion on a chessboard."
  `;

  try {
    const response = await ai.models.generateContent({
      model: SCRIPT_MODEL,
      contents: prompt,
      config: {
        temperature: 1,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating YTP script:", error);
    throw new Error("Failed to generate script from Gemini.");
  }
};


export const generateVideoFromScript = async (script: string): Promise<Blob> => {
  try {
    let operation = await ai.models.generateVideos({
      model: VIDEO_MODEL,
      prompt: script,
      config: {
        numberOfVideos: 1
      }
    });

    console.log("Video generation started. Operation:", operation.name);

    // Poll for the result
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds before polling again
      operation = await ai.operations.getVideosOperation({ operation: operation });
      console.log("Polling video operation status:", operation.name, operation.done);
    }

    if (!operation.response?.generatedVideos?.[0]?.video?.uri) {
        throw new Error("Video generation finished but no video URI was found.");
    }
    
    const downloadLink = operation.response.generatedVideos[0].video.uri;
    
    console.log("Fetching video from:", downloadLink);
    
    // Fetch the video blob
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    
    if (!videoResponse.ok) {
        throw new Error(`Failed to download the generated video. Status: ${videoResponse.status}`);
    }

    const videoBlob = await videoResponse.blob();
    return videoBlob;

  } catch (error) {
    console.error("Error generating video:", error);
    throw new Error("Failed to generate video from Gemini.");
  }
};