/**
 * OoruNalam AI — API & Mock Client
 * Maintained by: SELVAGANAPATHI A (Role A: Frontend Developer)
 * 
 * Allows frontend to run completely decoupled from backend using mock mode,
 * or toggle to live backend (`VITE_USE_MOCK=false`).
 */

export interface IntakeResult {
  complaint_id: string;
  detected_category: string;
  category_confidence: number;
  visible_evidence: string[];
  extracted_duration?: string;
  follow_up_questions: Array<{
    id: string;
    field: string;
    question_en: string;
    question_ta: string;
    placeholder_en?: string;
    placeholder_ta?: string;
  }>;
  has_discrepancy: boolean;
  discrepancy_note?: string;
}

export interface GrievanceDraftResult {
  complaint_id: string;
  english_draft: {
    title: string;
    body: string;
    target_department: string;
    evidence_summary: string;
  };
  tamil_draft: {
    title: string;
    body: string;
    target_department: string;
    evidence_summary: string;
  };
  submission_portal_url: string;
  helpline_number: string;
  status: string;
}

const USE_MOCK = true; // Set to false when connecting to live FastAPI backend

export async function analyzeIntake(payload: {
  text_content?: string;
  voice_transcript?: string;
  image_base64?: string;
  language_preference: string;
}): Promise<IntakeResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800)); // Simulate AI inference latency
    return {
      complaint_id: "ON-DEMO-2026",
      detected_category: "waste_accumulation",
      category_confidence: 0.94,
      visible_evidence: [
        "Accumulation of unsegregated domestic & commercial solid waste",
        "Overflowing plastic debris encroaching on public pavement curbside",
        "Roadside litter pile creating visible hygiene obstruction"
      ],
      extracted_duration: "3 days",
      follow_up_questions: [
        {
          id: "q_locality",
          field: "locality",
          question_en: "Please confirm your locality landmark or Corporation Ward number.",
          question_ta: "தயவுசெய்து உங்கள் பகுதி அல்லது வார்டு எண்ணை உறுதிப்படுத்தவும்.",
          placeholder_en: "e.g., Near Usman Road bus stop, Ward 114",
          placeholder_ta: "எ.கா: உஸ்மான் ரோடு பேருந்து நிறுத்தம் அருகில், வார்டு 114"
        },
        {
          id: "q_duration",
          field: "duration",
          question_en: "How many days has this issue been persisting?",
          question_ta: "இந்த பிரச்சனை எத்தனை நாட்களாக நீடிக்கிறது?",
          placeholder_en: "e.g., 3 days, 1 week",
          placeholder_ta: "எ.கா: 3 நாட்களாக, 1 வாரமாக"
        }
      ],
      has_discrepancy: false
    };
  }

  const res = await fetch("/api/complaints/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to analyze grievance");
  return res.json();
}

export async function generateGrievanceDraft(payload: {
  complaint_id: string;
  confirmed_category: string;
  confirmed_locality: string;
  confirmed_duration?: string;
}): Promise<GrievanceDraftResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return {
      complaint_id: payload.complaint_id,
      english_draft: {
        title: "Urgent Petition: Clearance of Uncollected Solid Waste Accumulation",
        target_department: "Greater Chennai Corporation (GCC) Solid Waste Management (SWM) Dept, Zone 10 (Kodambakkam)",
        evidence_summary: "Visible unsegregated domestic waste pile encroaching on road pavement",
        body: `To:\nGreater Chennai Corporation (GCC) Zone 10 SWM Department\n\nRespected Officer,\n\nI am writing to report a serious civic issue at: ${payload.confirmed_locality}.\n\nObserved Evidence: Accumulation of unsegregated domestic & commercial solid waste.\nDuration: ${payload.confirmed_duration || "3 days"}.\n\nThis condition causes severe foul odor and pedestrian blockage. I kindly request immediate clearance.\n\nPrepared via OoruNalam Civic Intelligence Assistant.`
      },
      tamil_draft: {
        title: "அவசர மனு: தேங்கியுள்ள குப்பைகளை உடனடியாக அகற்றுதல் தொடர்பாக",
        target_department: "சென்னை மாநகராட்சி மண்டலம் 10 திடக்கழிவு மேலாண்மைத் துறை",
        evidence_summary: "சாலையோரம் தேங்கியுள்ள குப்பைக் குவியல் மற்றும் கழிவுகள்",
        body: `பெறுநர்:\nசென்னை மாநகராட்சி மண்டலம் 10 திடக்கழிவு மேலாண்மைத் துறை\n\nமதிப்பிற்குரிய அதிகாரி அவர்களுக்கு,\n\nபொருள்: அவசர மனு - தேங்கியுள்ள குப்பைகளை அகற்றக் கோருதல்.\n\nஎங்கள் பகுதியில் (${payload.confirmed_locality}) குப்பை கடந்த ${payload.confirmed_duration || "3 நாட்களாக"} அள்ளப்படாமல் உள்ளது.\n\nஇதனால் துர்நாற்றம் வீசுவதுடன் பொதுமக்கள் பெரும் சிரமத்திற்கு ஆளாகின்றனர். தயவுசெய்து விரைந்து நடவடிக்கை எடுக்குமாறு கேட்டுக்கொள்கிறேன்.`
      },
      submission_portal_url: "https://chennaicorporation.gov.in/gcc/citizen-portal/",
      helpline_number: "1913",
      status: "READY_FOR_OFFICIAL_HANDOFF"
    };
  }

  const res = await fetch("/api/complaints/generate-draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to generate draft");
  return res.json();
}
