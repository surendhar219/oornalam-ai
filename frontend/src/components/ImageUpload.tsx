import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string | null) => void;
  langPreference: 'ta' | 'en';
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, langPreference }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      setPreview(base64);
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <label className="block text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
        <Camera className="w-4 h-4 text-sky-600" />
        {langPreference === 'ta' ? 'புகைப்படம் பதிவேற்றவும் (Photo Evidence)' : 'Upload Issue Photograph (Camera/File)'}
      </label>

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 max-h-48 flex justify-center items-center">
          <img src={preview} alt="Civic problem preview" className="max-h-48 w-auto object-contain" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-slate-900/70 hover:bg-slate-900 text-white p-1 rounded-full text-xs"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-lg p-6 text-center cursor-pointer transition-colors bg-slate-50/50"
        >
          <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700">
            {langPreference === 'ta' ? 'புகைப்படத்தை தேர்ந்தெடுக்க கிளிக் செய்யவும்' : 'Click to take a photo or upload from gallery'}
          </p>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP supported</p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />
    </div>
  );
};
