import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscriptChange: (text: string) => void;
  langPreference: 'ta' | 'tanglish' | 'en';
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
    if (!supported) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }
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
    recognition.lang = langPreference === 'en' ? 'en-IN' : 'ta-IN';
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

  const getButtonText = () => {
    if (isRecording) {
      return "🔴 கேட்டுக்கொண்டிருக்கிறது... (Listening...)";
    }
    if (langPreference === 'ta') {
      return "🎤 குரலில் சொல்லுங்கள் (Tap to Speak in Tamil)";
    }
    if (langPreference === 'tanglish') {
      return "🎤 குரலில் சொல்லுங்கள் (Tap to Speak in Tanglish)";
    }
    return "🎤 குரலில் சொல்லுங்கள் (Tap to Speak in Tamil / Tanglish)";
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-sky-600" />
          <span>குரல் வழி பதிவு (Adaptive Speech Intake)</span>
        </label>
        <span className="text-xs bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full font-semibold border border-sky-200">
          {langPreference === 'ta' && 'தமிழ் (ta-IN)'}
          {langPreference === 'tanglish' && 'Tanglish (ta/en)'}
          {langPreference === 'en' && 'English (en-IN)'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <button
          type="button"
          onClick={toggleRecording}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-4 ring-rose-200'
              : 'bg-sky-600 hover:bg-sky-700 text-white hover:shadow-md'
          }`}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{getButtonText()}</span>
        </button>

        <div className="flex-1 text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200 min-h-[40px] flex items-center">
          {isRecording ? (
            <span className="text-rose-600 font-semibold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              🔴 கேட்டுக்கொண்டிருக்கிறது... பேசுங்கள் (Listening... Speak naturally in Tamil or Tanglish)
            </span>
          ) : (
            transcript || (
              <span className="text-slate-400">
                {langPreference === 'ta'
                  ? 'மைக் பொத்தானை அழுத்தி தமிழ் அல்லது Tanglish-ல் பேசவும் (எ.கா: "சாக்கடை தண்ணி ரோட்டுல வருது...")'
                  : 'Tap button to speak in Tamil, Tanglish, or English (e.g. "Road full-aa water stagnant...")'}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};
