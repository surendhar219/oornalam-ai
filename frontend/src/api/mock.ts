/**
 * OorNalam AI (ஊர்நலம்) — API & Mock Client
 * Byte Breakers (Team ID: AARVAM-S-0004) | Paavai Engineering College
 * Aarvam — Cybernaut Hackathon 2026 | Track: ARSW001
 */

export interface IntakeResult {
  complaint_id: string;
  scenario_type: 'garbage' | 'water' | 'esevai' | 'correction';
  detected_category: string;
  category_confidence: number;
  visible_evidence: string[];
  extracted_duration?: string;
  completeness_score: number;
  is_filing_ready: boolean;
  adaptive_confirmation: {
    id: string;
    field: string;
    question_en: string;
    question_ta: string;
    question_tanglish?: string;
    quick_options: string[];
    impact: string;
  };
  has_discrepancy: boolean;
  discrepancy_note?: string;
}

export interface GrievanceDraftResult {
  complaint_id: string;
  scenario_type: 'garbage' | 'water' | 'esevai' | 'correction';
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
  sla_target: string;
}

const USE_MOCK = true;

export async function analyzeIntake(payload: {
  text_content?: string;
  voice_transcript?: string;
  image_base64?: string;
  language_preference: 'ta' | 'tanglish' | 'en';
  forced_scenario?: 'garbage' | 'water' | 'esevai' | 'correction';
}): Promise<IntakeResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500)); // Simulate AI inference

    const raw = `${payload.text_content || ''} ${payload.voice_transcript || ''}`.toLowerCase();
    
    // Scenario 1: Garbage
    const isGarbage = payload.forced_scenario === 'garbage' || 
      raw.includes('குப்பை') || raw.includes('garbage') || raw.includes('waste') || raw.includes('துர்நாற்றம்');
    
    // Scenario 3: e-Sevai Certificate
    const isEsevai = payload.forced_scenario === 'esevai' ||
      raw.includes('கம்யூனிட்டி') || raw.includes('இன்கம்') || raw.includes('certificate') || raw.includes('admission') || raw.includes('thambi');

    // Scenario 4: Name / Record Correction
    const isCorrection = payload.forced_scenario === 'correction' ||
      raw.includes('ரேஷன் கார்டு') || raw.includes('marksheet') || raw.includes('spelling') || raw.includes('திருத்தம்') || raw.includes('மாத்தணும்');

    // Scenario 2: Stagnant Water / Drain Blockage (default or specific)
    if (isGarbage) {
      return {
        complaint_id: "ON-GARBAGE-2026",
        scenario_type: 'garbage',
        detected_category: "குப்பை குவிதல் (Solid Waste Accumulation - MSW 2016)",
        category_confidence: 0.97,
        visible_evidence: [
          "4-day persistence detected violating Solid Waste Management (MSW 2016) 24h clearance mandate",
          "Overflowing unsegregated municipal waste encroaching into vehicular road",
          "Foul leachate leakage and severe fly/mosquito vector breeding detected"
        ],
        extracted_duration: "4 days",
        completeness_score: 85,
        is_filing_ready: true,
        adaptive_confirmation: {
          id: "garbage_duration_sla",
          field: "uncollected_duration",
          question_ta: "இந்த குப்பை எத்தனை நாட்களாக அகற்றப்படாமல் உள்ளது?",
          question_en: "How many days has this garbage remained uncollected?",
          question_tanglish: "Indha garbage ethana days-aa collect pannama irukku?",
          quick_options: [
            "4+ Days (Overflowing onto road)",
            "1-2 Days",
            "Commercial waste dumping near school"
          ],
          impact: "Detects 4-day persistence (breach of Solid Waste Management MSW 2016 24h rules) and dispatches GCC SWM compactor truck."
        },
        has_discrepancy: false
      };
    }

    if (isEsevai) {
      return {
        complaint_id: "ON-ESEVAI-2026",
        scenario_type: 'esevai',
        detected_category: "e-Sevai வருவாய் சான்றிதழ் (TNeGA REV-101 / REV-102)",
        category_confidence: 0.99,
        visible_evidence: [
          "Student Aadhaar Card OCR: Demographic & Biometric ID extracted",
          "Smart Family Ration Card verified: Family unit & Taluk jurisdiction confirmed",
          "Father's Transfer Certificate: Community MBC, Sub-caste: Kongu Vellalar",
          "VAO Annual Income Assessment: ₹72,000 per annum"
        ],
        extracted_duration: "College Admission Priority",
        completeness_score: 85,
        is_filing_ready: true,
        adaptive_confirmation: {
          id: "esevai_community_income_confirm",
          field: "caste_income_verification",
          question_ta: "கண்டறியப்பட்ட சாதி (MBC - Kongu Vellalar) மற்றும் வருமானம் (₹72,000) விவரங்களை உறுதிப்படுத்தலாமா?",
          question_en: "Confirm extracted details: Community MBC (Kongu Vellalar) & Annual Income ₹72,000 for TNeGA Auto-Fill?",
          question_tanglish: "Extracted details MBC (Kongu Vellalar) & Income ₹72,000 confirm pannalama?",
          quick_options: [
            "ஆம், தந்தை TC + ரேஷன் அட்டை சரிபார்க்கப்பட்டது",
            "வருமான விவரம் புதுப்பிக்க வேண்டும்",
            "அவசர கல்லூரி சேர்க்கை முன்னுரிமை (Tatkal)"
          ],
          impact: "1-Click Auto-Fill populates official TNeGA portal in 10 seconds, cutting counter queues from 8 minutes to 45 seconds."
        },
        has_discrepancy: false
      };
    }

    if (isCorrection) {
      return {
        complaint_id: "ON-CORRECTION-2026",
        scenario_type: 'correction',
        detected_category: "ரேஷன் கார்டு பெயர் திருத்தம் (PDS Cross-Doc OCR Correction)",
        category_confidence: 0.98,
        visible_evidence: [
          "Cross-document OCR diff executed: Ration Card vs 10th SSLC Marksheet",
          "Existing Card Record: 'SURIYA KUMAR' ➔ Legal SSLC Record: 'SURIYAKUMARAN A' / 'சூரியகுமாரன் ஆ'",
          "Document verification stamp and seal detected from Tamil Nadu State Board"
        ],
        extracted_duration: "Official Name Harmonization",
        completeness_score: 85,
        is_filing_ready: true,
        adaptive_confirmation: {
          id: "name_correction_confirm",
          field: "ration_sslc_match",
          question_ta: "ரேஷன் கார்டில் உள்ள பெயர் 'SURIYAKUMARAN A' என 10th மதிப்பெண் சான்றிதழ் படி மாற்றப்பட வேண்டுமா?",
          question_en: "Update name on Smart Ration Card from 'SURIYA KUMAR' to legal SSLC name 'SURIYAKUMARAN A'?",
          question_tanglish: "Ration card name 'SURIYAKUMARAN A' nu 10th marksheet maathiri correct pannanuma?",
          quick_options: [
            "ஆம், 10th Marksheet ஆதாரமாக இணைக்கப்பட்டது",
            "ஆதார் அட்டை பெயர் பொருந்துகிறது",
            "இரு மொழிகளிலும் திருத்தவும் (TA / EN)"
          ],
          impact: "Cross-document OCR diff auto-attaches verified proof directly to TNeGA / TNPDS civil supplies portal."
        },
        has_discrepancy: false
      };
    }

    // Default: Scenario 2: Stagnant Water / Drain Blockage
    return {
      complaint_id: "ON-WATER-2026",
      scenario_type: 'water',
      detected_category: "நீர் தேக்கம் & சாக்கடை அடைப்பு (Stagnant Water / Drain Blockage)",
      category_confidence: 0.98,
      visible_evidence: [
        "Heavy rainwater and contaminated drain overflow submerging primary residential road",
        "Storm Water Drain (SWD) blocked with silt and municipal backflow",
        "Severe mosquito larvae breeding risk near school bus stop and residential houses"
      ],
      extracted_duration: "3 days",
      completeness_score: 85,
      is_filing_ready: true,
      adaptive_confirmation: {
        id: "sewage_water_intrusion",
        field: "water_intrusion",
        question_ta: "கழிவுநீர் வீடுகளுக்குள் அல்லது கடைகளுக்குள் நுழைகிறதா?",
        question_en: "Is sewage water entering or threatening to enter houses or shops?",
        question_tanglish: "Kazhivuneer veetukkul alladhu kadaikkul nuzhaigiradha?",
        quick_options: [
          "ஆம், வீட்டிற்குள் வருகிறது",
          "சாலையில் மட்டுமே உள்ளது",
          "பள்ளி / மருத்துவமனை அருகில்"
        ],
        impact: "Escalates dispatch SLA from 24h to 2 Hours Emergency Priority"
      },
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
  scenario_type?: 'garbage' | 'water' | 'esevai' | 'correction';
}): Promise<GrievanceDraftResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    const sc = payload.scenario_type || 'water';

    if (sc === 'garbage') {
      return {
        complaint_id: payload.complaint_id,
        scenario_type: 'garbage',
        english_draft: {
          title: "Urgent Grievance: Breach of SWM Rules 2016 — 4 Days Uncollected Garbage Overflow",
          target_department: "Greater Chennai Corporation (GCC) Solid Waste Management (SWM) Dept, Zone 10",
          evidence_summary: "4-day accumulation of unsegregated solid waste breaching MSW 2016 24h rules, causing severe stench and vector risks.",
          body: `To:\nThe Superintending Engineer / Zonal Officer\nSolid Waste Management Department, Zone 10\nGreater Chennai Corporation (GCC)\n\nRespected Sir/Madam,\n\nSubject: Urgent complaint regarding continuous uncollected garbage for 4 days at ${payload.confirmed_locality} — reg.\n\nWe hereby bring to your immediate notice that domestic and street garbage has remained uncollected for 4 consecutive days at ${payload.confirmed_locality}. The dump has overflowed into the carriageway, emitting a noxious odor and creating a rampant breeding ground for mosquitoes.\n\nUnder the Solid Waste Management Rules (MSW 2016), civic authorities are mandated to ensure daily clearance within 24 hours. Given the severe public health risk to residents and school children, we request an urgent mechanical compactor truck dispatch.\n\nAutomated and verified via OorNalam AI (ஊர்நலம்) — Byte Breakers.`
        },
        tamil_draft: {
          title: "அவசர மனு: 4 நாட்களாக குப்பை அள்ளப்படாதது தொடர்பாக (திடக்கழிவு மேலாண்மை MSW 2016 விதிமீறல்)",
          target_department: "சென்னை மாநகராட்சி மண்டலம் 10 திடக்கழிவு மேலாண்மைத் துறை",
          evidence_summary: "4 நாட்களாக தொடர்ந்து தேங்கியுள்ள குப்பை, துர்நாற்றம் மற்றும் கொசு பெருக்கம்; MSW 2016 விதிகளின்படி உடனடி நடவடிக்கை கோரல்.",
          body: `பெறுநர்:\nமண்டல அலுவலர் / செயற்பொறியாளர்,\nதிடக்கழிவு மேலாண்மைத் துறை (மண்டலம் 10),\nசென்னை பெருநகர மாநகராட்சி.\n\nமதிப்பிற்குரிய அய்யா / அம்மா,\n\nபொருள்: எங்கள் பகுதியில் (${payload.confirmed_locality}) 4 நாட்களாக குப்பை அள்ளப்படாமல் தேங்கியிருப்பது குறித்து அவசர நடவடிக்கை மனு.\n\nஎங்கள் தெருவில் கடந்த 4 நாட்களாக குப்பை அள்ளப்படவில்லை. இதனால் கடுமையான துர்நாற்றம் வீசுவதுடன் சாலையோரமெங்கும் குப்பை பெருக்கெடுத்து கொசு மற்றும் பூச்சிகள் பெருகி வருகின்றன. திடக்கழிவு மேலாண்மை சட்டம் 2016-ன் கீழ் 24 மணி நேரத்திற்குள் குப்பை அகற்றப்பட வேண்டும்.\n\nஎனவே உடனடியாக குப்பை அள்ளும் காம்பாக்டர் வாகனத்தை அனுப்பி பொது சுகாதாரத்தை காக்குமாறு பணிவுடன் கேட்டுக்கொள்கிறோம்.\n\nஊர்நலம் AI (OorNalam AI) மூலம் தானியங்கி சரிபார்ப்புடன் சமர்ப்பிக்கப்பட்டது.`
        },
        submission_portal_url: "https://chennaicorporation.gov.in/gcc/citizen-portal/",
        helpline_number: "1913 (GCC Civic Helpline)",
        status: "PORTAL_READY_SUBMISSION",
        sla_target: "24 Hours Standard SWM Dispatch SLA"
      };
    }

    if (sc === 'esevai') {
      return {
        complaint_id: payload.complaint_id,
        scenario_type: 'esevai',
        english_draft: {
          title: "TNeGA e-Sevai Application: Combined Community (REV-101) & Income (REV-102) Certificates",
          target_department: "Tamil Nadu e-Governance Agency (TNeGA) / Revenue Administration Dept",
          evidence_summary: "Vision OCR verified: Student Aadhaar, Smart Ration Card, Father's TC (MBC - Kongu Vellalar), Annual Income ₹72,000.",
          body: `To:\nThe Tahsildar / Revenue Divisional Officer (RDO)\nTaluk Office, Namakkal District\nGovernment of Tamil Nadu\n\nRespected Authority,\n\nSubject: Application for issuance of Community Certificate (REV-101) and Income Certificate (REV-102) for Higher Education College Admission — reg.\n\nApplicant Details:\n• Name: KAVIN S / கவின் சு (Aadhaar Verified)\n• Community: Most Backward Class (MBC)\n• Sub-Caste: Kongu Vellalar (Verified via Father's Transfer Certificate)\n• Family Annual Income: ₹72,000/- (Rupees Seventy-Two Thousand Only)\n• Residence Address: Ward 14, Mohanur Road, Namakkal Taluk\n\nAll verified supporting proofs (Aadhaar, Smart Family Card, Father's TC) have been extracted via OorNalam AI Vision OCR and pre-validated against TNeGA schema. Kindly approve expedited issue.\n\nVerified via OorNalam AI Copilot for e-Sevai.`
        },
        tamil_draft: {
          title: "TNeGA e-Sevai விண்ணப்பம்: சாதிச் சான்றிதழ் (REV-101) மற்றும் வருமானச் சான்றிதழ் (REV-102) கோருதல்",
          target_department: "தமிழ்நாடு மின்னாளுமை முகமை (TNeGA) / வருவாய்த்துறை",
          evidence_summary: "ஆதார், ஸ்மார்ட் ரேஷன் கார்டு, தந்தை TC (MBC - கொங்கு வேளாளர்), ஆண்டு வருமானம் ₹72,000 கணினி சரிபார்ப்பு செய்யப்பட்டது.",
          body: `பெறுநர்:\nவட்டாட்சியர் அவர்கள்,\nவட்ட அலுவலகம், நாமக்கல் வட்டம் மற்றும் மாவட்டம்.\n\nமதிப்பிற்குரிய அய்யா,\n\nபொருள்: கல்லூரி சேர்க்கைக்காக சாதி சான்றிதழ் (REV-101) மற்றும் வருமான சான்றிதழ் (REV-102) கோரி விண்ணப்பித்தல்.\n\nவிண்ணப்பதாரர் விவரம்:\n• பெயர்: கவின் சு (KAVIN S)\n• வகுப்பு: மிகவும் பிற்படுத்தப்பட்டோர் (MBC)\n• உட்பிரிவு: கொங்கு வேளாளர் (தந்தையின் பள்ளி மாற்றுச் சான்றிதழ் வழி உறுதி செய்யப்பட்டது)\n• குடும்ப ஆண்டு வருமானம்: ₹72,000/-\n• முகவரி: வார்டு 14, மோகனூர் சாலை, நாமக்கல் வட்டம்.\n\nதேவையான அனைத்து அசல் ஆவணங்களும் ஊர்நலம் AI மூலம் துல்லியமாக ஸ்கேன் செய்யப்பட்டு இணைக்கப்பட்டுள்ளன. கல்லூரி சேர்க்கை இறுதி தேதி நெருங்குவதால் விரைந்து சான்றிதழ் வழங்கிட வேண்டுகிறேன்.`
        },
        submission_portal_url: "https://www.tnesevai.tn.gov.in/",
        helpline_number: "1100 (Mudhalvarin Mugavari)",
        status: "TNEGA_AUTOFILL_READY",
        sla_target: "Instant 1-Click Injection (Counter queue cut from 8m to 45s)"
      };
    }

    if (sc === 'correction') {
      return {
        complaint_id: payload.complaint_id,
        scenario_type: 'correction',
        english_draft: {
          title: "Civil Supplies Petition: Smart Ration Card Name Correction via 10th Marksheet OCR Diff",
          target_department: "Civil Supplies & Consumer Protection Dept (TN PDS / e-Sevai)",
          evidence_summary: "Cross-document OCR diff executed: Current Card 'SURIYA KUMAR' ➔ Legal SSLC 'SURIYAKUMARAN A' / 'சூரியகுமாரன் ஆ'.",
          body: `To:\nThe Taluk Supply Officer (TSO)\nCivil Supplies and Consumer Protection Department\nGovernment of Tamil Nadu\n\nRespected Sir/Madam,\n\nSubject: Request for spelling and name correction in Smart Family Card (TNPDS) as per 10th SSLC Marksheet — reg.\n\nDiscrepancy Details:\n• Existing Name in Smart Card: SURIYA KUMAR\n• Correct Legal Name: SURIYAKUMARAN A (சூரியகுமாரன் ஆ)\n• Primary Legal Proof: Tamil Nadu Secondary School Leaving Certificate (SSLC Marksheet No: 2021-SSLC-847291)\n• Secondary Proof: Unique Identification Authority of India (Aadhaar Card)\n\nThe verified OCR diff between the physical documents has been analyzed by OorNalam AI. The official request payload and scanned evidence are attached for instant database updating.\n\nPrepared via OorNalam AI Citizen Copilot.`
        },
        tamil_draft: {
          title: "பொது விநியோகத் திட்ட மனு: 10-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ் படி ரேஷன் கார்டு பெயர் திருத்தம் செய்தல்",
          target_department: "உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத் துறை (TNPDS)",
          evidence_summary: "ரேஷன் கார்டு பெயர் 'SURIYA KUMAR' ஐ 10th SSLC சட்டப்பூர்வ பெயரான 'SURIYAKUMARAN A' / 'சூரியகுமாரன் ஆ' என மாற்ற ஆவண சரிபார்ப்பு செய்யப்பட்டது.",
          body: `பெறுநர்:\nவட்ட வழங்கல் அலுவலர் அவர்கள் (TSO),\nஉணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத் துறை,\nதமிழ்நாடு அரசு.\n\nமதிப்பிற்குரிய அய்யா,\n\nபொருள்: எனது குடும்ப அட்டை (Smart Ration Card)-ல் உள்ள பெயர் எழுத்துப் பிழையை 10-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ் படி திருத்தம் செய்திட கோருதல்.\n\nவிவரம்:\n• தற்போதைய ரேஷன் அட்டை பெயர்: SURIYA KUMAR\n• திருத்தப்பட வேண்டிய சரியான சட்டப்பூர்வ பெயர்: SURIYAKUMARAN A (சூரியகுமாரன் ஆ)\n• இணைக்கப்படும் ஆவணம்: 10-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ் & ஆதார் அட்டை\n\nமேற்கண்ட ஆவணங்களின் உண்மைத்தன்மையை ஊர்நலம் AI சரிபார்த்து இணைத்துள்ளது. எனது குடும்ப அட்டையில் சரியான பெயரை உடனடியாக திருத்தி தருமாறு பணிவுடன் கேட்டுக்கொள்கிறேன்.`
        },
        submission_portal_url: "https://www.tnpds.gov.in/",
        helpline_number: "1967 / 1800-425-5901",
        status: "OCR_DIFF_VERIFIED",
        sla_target: "Direct PDS Database Ingestion in 10s"
      };
    }

    // Default: Stagnant Water / Drain Blockage
    return {
      complaint_id: payload.complaint_id,
      scenario_type: 'water',
      english_draft: {
        title: "Emergency Petition: Severe Rainwater Stagnation & CMWSSB Drainage Backflow Overflow",
        target_department: "CMWSSB Area 8 Desk (Helpline: 1916) / GCC Solid Waste Management",
        evidence_summary: "Contaminated wastewater overflow encroaching into public road and residential entrances; acute mosquito larvae breeding hazard.",
        body: `To:\nThe Area Engineer (Area 8 Grievance Cell)\nChennai Metropolitan Water Supply and Sewerage Board (CMWSSB) &\nGreater Chennai Corporation (GCC) Zone 10\n\nRespected Executive Engineer,\n\nSubject: Immediate emergency dispatch for sewage backflow and rainwater stagnation at ${payload.confirmed_locality} — reg.\n\nI am writing to report an urgent civic emergency. Following recent rainfall, stormwater and sewage drains have blocked, causing heavily contaminated black water to flood the entire thoroughfare for over ${payload.confirmed_duration || "3 days"}.\n\nThe water is stagnating near school bus routes and threatening residential entryways. Vector-borne pathogen breeding (dengue/malaria) is rampant.\n\nKindly dispatch suction jetting machines and municipal de-silting crews immediately.\n\nSubmitted via OorNalam AI (ஊர்நலம்) — Byte Breakers.`
      },
      tamil_draft: {
        title: "அவசர மனு: 3 நாட்களாக தேங்கி நிற்கும் மழைநீர் மற்றும் சாக்கடை அடைப்பு உடனடியாக அகற்ற கோருதல்",
        target_department: "சென்னை பெருநகர குடிநீர் வழங்கல் மற்றும் கழிவுநீரகற்று வாரியம் (CMWSSB) பகுதி 8 / GCC",
        evidence_summary: "சாலையில் தேங்கி நிற்கும் கழிவுநீர், சாக்கடை அடைப்பு, பள்ளி மாணவர்கள் செல்ல இயலாத நிலை மற்றும் கொசுப் பெருக்கம்.",
        body: `பெறுநர்:\nபகுதி பொறியாளர் அவர்கள் (பகுதி 8),\nசென்னை குடிநீர் மற்றும் கழிவுநீரகற்று வாரியம் (CMWSSB) &\nசென்னை மாநகராட்சி மண்டலம் 10.\n\nமதிப்பிற்குரிய அதிகாரி அவர்களுக்கு,\n\nபொருள்: அவசர மனு - எங்கள் பகுதியில் (${payload.confirmed_locality}) 3 நாட்களாக தேங்கி நிற்கும் மழைநீர் மற்றும் சாக்கடை அடைப்பை அகற்ற கோருதல்.\n\nமழை பெய்து 3 நாட்களாக ரோடு முழுக்க மழைநீரும் சாக்கடை நீரும் தேங்கி நிற்கிறது. சாக்கடை அடைப்பினால் துர்நாற்றம் வீசுவதுடன், பள்ளி செல்லும் மாணவ-மாணவிகள் மற்றும் முதியவர்கள் நடந்து செல்ல முடியாத அவல நிலை ஏற்பட்டுள்ளது. கொசு உற்பத்தியாகி டெங்கு உள்ளிட்ட நோய்கள் பரவும் அபாயம் உள்ளது.\n\nஎனவே உடனடியாக சூப்பர் சக்கர் / ஜெட்டிங் வாகனங்களை அனுப்பி அடைப்பை நீக்கி கழிவுநீரை வெளியேற்ற விரைந்து நடவடிக்கை எடுக்குமாறு கேட்டுக்கொள்கிறேன்.`
      },
      submission_portal_url: "https://cmwssb.tn.gov.in/grievance",
      helpline_number: "1916 (CMWSSB Helpline) / 1913 (GCC)",
      status: "EMERGENCY_2H_SLA_ROUTED",
      sla_target: "Escalated to 2 Hours Emergency Priority SLA"
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
