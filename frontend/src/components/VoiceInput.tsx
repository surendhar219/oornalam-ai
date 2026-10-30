import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscriptChange: (text: string) => void;
  langPreference: 'ta' | 'en';
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscriptChange, langPreference }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const toggleRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langPreference === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);
      onTranscriptChange(text);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-sky-600" />
          {langPreference === 'ta' ? 'குரல் மூலம் பேசுங்கள் (Voice Input)' : 'Speak Your Grievance (Voice Input)'}
        </label>
        <span className="text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-medium">
          {langPreference === 'ta' ? 'தமிழ் (ta-IN)' : 'English (en-IN)'}
        </span>
      </div>

      <div className="flex gap-3 items-center">
        <button
          type="button"
          onClick={toggleRecording}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
              : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>{langPreference === 'ta' ? 'நிறுத்துக...' : 'Stop Recording...'}</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>{langPreference === 'ta' ? 'பேச தொடங்குங்கள்' : 'Start Speaking'}</span>
            </>
          )}
        </button>

        <div className="flex-1 text-xs text-slate-500 italic truncate">
          {isRecording
            ? (langPreference === 'ta' ? 'கேட்கிறது... பேசவும்...' : 'Listening... Speak now...')
            : transcript || (langPreference === 'ta' ? 'மைக் பொத்தானை அழுத்தி பேசவும்' : 'Click mic to record Tamil/English speech')}
        </div>
      </div>
    </div>
  );
};
