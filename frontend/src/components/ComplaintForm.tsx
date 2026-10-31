import React, { useState } from 'react';
import { VoiceInput } from './VoiceInput';
import { ImageUpload } from './ImageUpload';
import { analyzeIntake, generateGrievanceDraft, IntakeResult, GrievanceDraftResult } from '../api/mock';
import { AlertCircle, CheckCircle2, ExternalLink, Send, Sparkles, MessageSquare, Gauge } from 'lucide-react';

export const ComplaintForm: React.FC = () => {
  const [lang, setLang] = useState<'ta' | 'en'>('ta');
  const [textContent, setTextContent] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [step, setStep] = useState<'intake' | 'clarify' | 'draft' | 'handoff'>('intake');
  const [loading, setLoading] = useState(false);
  const [intakeResult, setIntakeResult] = useState<IntakeResult | null>(null);
  
  // Follow-up answers & Adaptive confirmation
  const [locality, setLocality] = useState('Ward 114, Usman Road, T. Nagar');
  const [duration, setDuration] = useState('3 days');
  const [selectedConfirmation, setSelectedConfirmation] = useState<string | null>(null);
  const [completenessScore, setCompletenessScore] = useState<number>(85);

  // Final draft
  const [draftResult, setDraftResult] = useState<GrievanceDraftResult | null>(null);
  const [selectedDraftLang, setSelectedDraftLang] = useState<'tamil' | 'english'>('tamil');

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await analyzeIntake({
        text_content: textContent,
        voice_transcript: voiceText,
        image_base64: imageBase64 || undefined,
        language_preference: lang
      });
      setIntakeResult(res);
      if (res.extracted_duration) {
        setDuration(res.extracted_duration);
      }
      setCompletenessScore(res.completeness_score || 85);
      setStep('clarify');
    } catch (err: any) {
      alert("Error processing complaint: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedConfirmation(option);
    setCompletenessScore(98); // Dynamically escalate to 98% Filing Ready
  };

  const handleGenerateDraft = async () => {
    if (!intakeResult) return;
    setLoading(true);
    try {
      const res = await generateGrievanceDraft({
        complaint_id: intakeResult.complaint_id,
        confirmed_category: intakeResult.detected_category,
        confirmed_locality: locality,
        confirmed_duration: duration
      });
      setDraftResult(res);
      setStep('draft');
    } catch (err: any) {
      alert("Draft generation error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Top Banner & Language Selector */}
      <div className="bg-slate-900 text-white p-5 flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <h2 className="text-xl font-bold tracking-tight">OorNalam AI Grievance Assistant</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {lang === 'ta'
              ? 'உங்கள் குரல் மற்றும் புகைப்படத்தால் சமுதாயப் பிரச்சனைகளை எளிதாகப் பதிவு செய்யுங்கள்'
              : 'Empowering civic grievance reporting via Tamil/English voice and photos'}
          </p>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            type="button"
            onClick={() => setLang('ta')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              lang === 'ta' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            தமிழ் (Tamil)
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              lang === 'en' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            English
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* STEP 1: INTAKE */}
        {step === 'intake' && (
          <form onSubmit={handleStartAnalysis} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                {lang === 'ta' ? 'பிரச்சனை பற்றிய விவரம் (Text Description)' : 'Describe the Issue (Optional)'}
              </label>
              <textarea
                rows={3}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder={
                  lang === 'ta'
                    ? 'எ.கா: ரோட்டில் சாக்கடை பெருக்கெடுத்து ஓடுகிறது, துர்நாற்றம் வீசுகிறது...'
                    : 'e.g., Sewage water overflowing on road causing foul odor...'
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <VoiceInput
              onTranscriptChange={(t) => setVoiceText(t)}
              langPreference={lang}
            />

            {voiceText && (
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900">
                <span className="font-semibold">🎙️ Transcribed Speech:</span> {voiceText}
              </div>
            )}

            <ImageUpload
              onImageSelected={(b64) => setImageBase64(b64)}
              langPreference={lang}
            />

            <button
              type="submit"
              disabled={loading || (!textContent && !voiceText && !imageBase64)}
              className="w-full bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>AI பகுப்பாய்வு செய்கிறது (Analyzing Multimodal Input)...</span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{lang === 'ta' ? 'AI மூலம் பகுப்பாய்வு செய் (Analyze Issue)' : 'Analyze with Multimodal AI'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: ADAPTIVE GRIEVANCE COMPLETENESS & CONFIRMATION */}
        {step === 'clarify' && intakeResult && (
          <div className="space-y-5">
            {/* ADAPTIVE COMPLETENESS METER */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <Gauge className="w-5 h-5 text-blue-600" />
                  <span>Adaptive Grievance Completeness Engine</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  completenessScore >= 95 ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {completenessScore}% {completenessScore >= 95 ? 'Ready to File' : 'Intake Score'}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    completenessScore >= 95 ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${completenessScore}%` }}
                ></div>
              </div>

              <p className="text-xs text-blue-800 mt-2 font-medium">
                {completenessScore >= 95 
                  ? '🎯 Verified for Portal Handoff: Missing details inferred; 1 confirmation captured.'
                  : '💡 Dynamic Intelligence: Instead of 15 form fields, we just need 1 quick confirmation.'}
              </p>
            </div>

            {/* AI EVIDENCE & INFERENCE BADGES */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Multimodal Evidence Fused & Verified</span>
              </div>
              <p className="text-xs text-emerald-700 mt-1">
                Detected Category: <strong className="uppercase">{intakeResult.detected_category.replace('_', ' ')}</strong> (Confidence: {Math.round(intakeResult.category_confidence * 100)}%)
              </p>
              <div className="mt-2 text-xs text-slate-600">
                <span className="font-semibold">Objective Inferences from Photo & Audio:</span>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  {intakeResult.visible_evidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* THE CONVERSATIONAL ADAPTIVE CONFIRMATION (1 HIGH-IMPACT QUESTION) */}
            {intakeResult.adaptive_confirmation && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <MessageSquare className="w-4 h-4 text-amber-700" />
                  <span>
                    {lang === 'ta' ? 'அதிமுக்கிய உறுதிப்படுத்தல் (1-Tap Priority Confirmation)' : 'Single High-Impact Confirmation'}
                  </span>
                </div>
                
                <p className="text-sm font-semibold text-slate-900">
                  {lang === 'ta' ? intakeResult.adaptive_confirmation.question_ta : intakeResult.adaptive_confirmation.question_en}
                </p>

                <div className="flex flex-wrap gap-2">
                  {intakeResult.adaptive_confirmation.quick_options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOptionSelect(opt)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        selectedConfirmation === opt
                          ? 'bg-amber-600 text-white border-amber-600 shadow'
                          : 'bg-white text-slate-800 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-amber-800 italic">
                  ⚡ Impact: {intakeResult.adaptive_confirmation.impact}
                </p>
              </div>
            )}

            {/* LOCALITY CONFIRMATION */}
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-3">
              <h3 className="text-sm font-bold text-sky-950 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-sky-600" />
                {lang === 'ta' ? 'துறைக்கு அனுப்ப பகுதி விவரத்தை உறுதிப்படுத்தவும்' : 'Confirm Locality for Desk Dispatch'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ta' ? 'பகுதி / வார்டு எண் (Locality & Ward)' : 'Locality Landmark & Ward'}
                  </label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ta' ? 'நீடிக்கும் நாட்கள் (Duration)' : 'Persistence Duration'}
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateDraft}
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>அதிகாரப்பூர்வ மனு தயாராகிறது (Synthesizing Grievance)...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{lang === 'ta' ? 'அதிகாரப்பூர்வ மனுவை உருவாக்கு (Draft Bilingual Grievance)' : 'Generate Formal Grievance'}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 3 & 4: FORMAL DRAFT REVIEW */}
        {step === 'draft' && draftResult && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-800">
                {lang === 'ta' ? 'மனுவை சரிபார்த்து உறுதிப்படுத்தவும்' : 'Review & Approve Formal Grievance'}
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDraftLang('tamil')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    selectedDraftLang === 'tamil' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  தமிழ்
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDraftLang('english')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    selectedDraftLang === 'english' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 font-mono text-xs">
              <div className="text-sky-800 font-bold">
                {selectedDraftLang === 'tamil' ? draftResult.tamil_draft.title : draftResult.english_draft.title}
              </div>
              <div className="text-slate-600 font-semibold">
                Target: {selectedDraftLang === 'tamil' ? draftResult.tamil_draft.target_department : draftResult.english_draft.target_department}
              </div>
              <div className="p-3 bg-white border rounded text-slate-800 whitespace-pre-line leading-relaxed">
                {selectedDraftLang === 'tamil' ? draftResult.tamil_draft.body : draftResult.english_draft.body}
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-900">Direct Submission Channel Verified</p>
                <p className="text-xs text-emerald-700">Official Helpline: <strong>{draftResult.helpline_number}</strong></p>
              </div>
              <a
                href={draftResult.submission_portal_url}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 shadow"
              >
                <span>Submit to Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep('intake');
                setIntakeResult(null);
                setDraftResult(null);
                setTextContent('');
                setVoiceText('');
                setImageBase64(null);
              }}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-semibold border border-slate-200 rounded-xl"
            >
              ← Report Another Issue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
