import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X, FileText } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string | null) => void;
  langPreference: 'ta' | 'tanglish' | 'en';
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, langPreference }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please upload a valid image file (PNG, JPG, WebP).");
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
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Camera className="w-4 h-4 text-sky-600" />
          <span>📸 புகைப்படத்தை பதிவேற்றவும் / ஆவணங்களை ஸ்கேன் செய்யவும்</span>
        </label>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          Multimodal Evidence & Vision OCR
        </span>
      </div>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-900/5 max-h-52 flex justify-center items-center p-2">
          <img src={preview} alt="Evidence preview" className="max-h-48 w-auto object-contain rounded-lg shadow-sm" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white p-1.5 rounded-full text-xs shadow transition-all"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-50/70 hover:bg-sky-50/30"
        >
          <div className="flex justify-center items-center gap-2 mb-2">
            <ImageIcon className="w-6 h-6 text-sky-600" />
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-sm font-semibold text-slate-700">
            {langPreference === 'ta'
              ? 'பிரச்சனை புகைப்படம் அல்லது ஆவணத்தை பதிவேற்ற கிளிக் செய்யவும்'
              : langPreference === 'tanglish'
              ? 'Issue photo alladhu government document upload panna click pannunga'
              : 'Click to upload civic issue photo or scan e-Sevai document'}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
            {langPreference === 'ta'
              ? 'குப்பை, கழிவுநீர் புகைப்படங்கள் அல்லது ஆதார், ஸ்மார்ட் ரேஷன் கார்டு, 10th மதிப்பெண் சான்றிதழ் ஸ்கேன்'
              : 'Supports civic hazard photos or paper proofs (Aadhaar, Smart Ration Card, EB Bill, 10th Marksheet)'}
          </p>
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
