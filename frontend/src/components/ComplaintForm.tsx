import React, { useState } from 'react';
import { VoiceInput } from './VoiceInput';
import { ImageUpload } from './ImageUpload';
import { analyzeIntake, generateGrievanceDraft, IntakeResult, GrievanceDraftResult } from '../api/mock';
import { AlertCircle, CheckCircle2, ExternalLink, Send, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const ComplaintForm: React.FC = () => {
  const [lang, setLang] = useState<'ta' | 'en'>('ta');
  const [textContent, setTextContent] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [step, setStep] = useState<'intake' | 'clarify' | 'draft' | 'handoff'>('intake');
  const [loading, setLoading] = useState(false);
  const [intakeResult, setIntakeResult] = useState<IntakeResult | null>(null);
  
  // Follow-up answers
  const [locality, setLocality] = useState('Ward 114, Usman Road, T. Nagar');
  const [duration, setDuration] = useState('3 days');

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
      setStep('clarify');
    } catch (err: any) {
      alert("Error processing complaint: " + err.message);
    } finally {
      setLoading(false);
    }
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
                    ? 'எ.கா: ரோட்டில் குப்பைகள் தேங்கி கிடக்கிறது, உடனடியாக அள்ள வேண்டும்...'
                    : 'e.g., Roadside waste accumulated near bus stop causing foul odor...'
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

        {/* STEP 2: CLARIFICATION & ROUTING CONFIRMATION */}
        {step === 'clarify' && intakeResult && (
          <div className="space-y-6">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>AI Evidence Analysis Complete</span>
              </div>
              <p className="text-xs text-emerald-700 mt-1">
                Detected Category: <strong className="uppercase">{intakeResult.detected_category.replace('_', ' ')}</strong> (Confidence: {Math.round(intakeResult.category_confidence * 100)}%)
              </p>
              <div className="mt-2 text-xs text-slate-600">
                <span className="font-semibold">Visible Evidence:</span>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  {intakeResult.visible_evidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-3">
              <h3 className="text-sm font-bold text-sky-950 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-sky-600" />
                {lang === 'ta' ? 'துல்லியமான துறைக்கு அனுப்ப தகவலை உறுதிப்படுத்தவும்' : 'Confirm Locality for Verified Department Routing'}
              </h3>

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
                  {lang === 'ta' ? 'எத்தனை நாட்களாக நீடிக்கிறது? (Duration)' : 'Persistence Duration'}
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateDraft}
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>மனு தயாராகிறது (Synthesizing Grievance)...</span>
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
                  தமிழ் வடிவம்
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDraftLang('english')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    selectedDraftLang === 'english' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  English Format
                </button>
              </div>
            </div>

            {/* Target Authority Badge */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
              <span className="font-bold">📍 Recommended Public Authority:</span>{' '}
              {draftResult[selectedDraftLang].target_department}
            </div>

            {/* Structured Complaint Body */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono whitespace-pre-wrap text-slate-800 leading-relaxed max-h-72 overflow-y-auto">
              {draftResult[selectedDraftLang].body}
            </div>

            {/* Action Handoff Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setStep('handoff')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{lang === 'ta' ? 'மனுவை அங்கீகரித்து சமர்ப்பிக்க (Approve & Handoff)' : 'Approve & Submit to Official Portal'}</span>
              </button>
              <button
                type="button"
                onClick={() => setStep('clarify')}
                className="px-4 py-3 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl text-xs"
              >
                {lang === 'ta' ? 'திருத்து (Edit Details)' : 'Edit Details'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: OFFICIAL PORTAL HANDOFF */}
        {step === 'handoff' && draftResult && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {lang === 'ta' ? 'மனு வெற்றிகரமாக உருவாக்கப்பட்டது!' : 'Grievance Formatted & Ready for Filing'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {lang === 'ta'
                  ? 'உங்கள் புகார் அதிகாரப்பூர்வ அரசு இணையதளத்திற்கு அனுப்ப தயாராக உள்ளது. அரசு போர்ட்டலில் உள்நுழைந்து சமர்ப்பிக்கவும்.'
                  : 'OorNalam has prepared your formal grievance. Proceed to the official portal to complete filing.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
              <div>
                <span className="font-semibold text-slate-600">Complaint ID:</span>{' '}
                <span className="font-mono font-bold text-slate-900">{draftResult.complaint_id}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-600">Official Portal:</span>{' '}
                <span className="text-sky-700 underline break-all">{draftResult.submission_portal_url}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-600">Official Helpline:</span>{' '}
                <span className="font-bold text-emerald-700">{draftResult.helpline_number}</span>
              </div>
            </div>

            <a
              href={draftResult.submission_portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all"
            >
              <span>{lang === 'ta' ? 'அரசு போர்ட்டலுக்கு செல்க (Open Official Portal)' : 'Open Verified GCC Portal'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="text-xs text-slate-400 italic">
              * OorNalam prepares and routes complaints; it does not bypass official citizen OTP/CAPTCHA verification.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
