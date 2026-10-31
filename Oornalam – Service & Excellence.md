## The ground reality

In Tamil Nadu, citizens face severe bureaucratic friction in both civic grievances (GCC, CMWSSB, TANGEDCO) and e-Sevai citizen services (TNeGA community and income certificates).

Illiterate and non-English-speaking citizens want to speak naturally in Tamil, Tanglish, or English. Instead, portals force them through 15–25 static dropdowns, department guessing, and paper document interrogation. The result is a 72% drop-off rate, or weeks of delay from manual typing errors.

## The proposed solution

OorNalam AI (ஊர்நலம்) is an autonomous voice-first citizen and e-Sevai copilot, delivered via mobile web and browser extension.

- **Multilingual voice intake**Listens to natural speech in Tamil (தமிழ்), Tanglish, or English.
- **Adaptive Grievance Completeness Engine (AGCE)**Works out what is known, infers 80% through computer vision, and asks only one confirmation question.
- **Document intelligence and 1-click auto-fill**Scans paper documents (Aadhaar, Smart Ration Card, EB bill, parent TC), extracts verified numbers with OCR, and fills every government portal field in 5 seconds with zero typing.

Oornalam – Service & Excellence

Scroll

## Built for people who would rather speak than type

Service that moves at the speed of your day, for citizens and for the staff who serve them.

### End users: citizens

Illiterate citizens, elderly residents, college admission applicants, and daily-wage families across Chennai and Tier-2/3 towns such as Namakkal, Salem, and Karur.

### Intermediary users: operators

12,000+ TNeGA e-Sevai center operators, GCC 1913 helpline staff, and 1100 CM Helpline call desks.

## Two everyday situations, solved by voice

The same copilot handles a government certificate and a civic emergency.

### Use case A: e-Sevai revenue services

“தம்பி, காலேஜ் அட்மிஷனுக்கு கம்யூனிட்டி, இன்கம் சர்டிபிகேட் வேணும்…”

The copilot scans Aadhaar, Ration Card, and the father’s TC, then populates all 25 fields on the TNeGA portal (`mock_tnega_portal.html`).

### Use case B: civic hazard emergency

“சாக்கடை தண்ணி ரோட்டுல வருது, EB பில் வச்சிருக்கேன்…”

The copilot verifies the sewage overflow and auto-routes it to the CMWSSB Area Desk with high urgency.

## From a spoken sentence to a filled form

End-to-end application workflow in five steps.

1. **Spoken intake**Citizen speaks in Tamil, Tanglish, or English.
2. **Schema and intent detection**AI identifies an e-Sevai certificate request (REV-101/102) or a civic hazard.
3. **Document checklist prompt**Shows and announces the exact required documents in Tamil.
4. **Vision OCR extraction**Scans paper documents by camera or scanner; extracts numbers, caste, sub-caste, annual income, and address.
5. **Autonomous DOM injection**Fills the official portal inputs, triggers validation events, and uploads attachments.

## System architecture

Four layers, from the citizen’s voice to the government portal.

**Layer 1: Citizen intake**React 18 mobile web, Web Speech (ta-IN / en-IN), Tanglish tokenizer

**Layer 2: AI perception**Gemini 2.5 Flash, OpenCV OCR preprocessing

**Layer 3: Engine**AGCE, FastAPI (Python 3.11), SQLite schema, GCC ward mapping

**Layer 4: DOM handoff**Chrome Extension Manifest V3, Side Panel API, autonomous injection

## The two screens citizens and operators see

Wireframes for the mobile intake app and the extension side panel.

OorNalam AI (ஊர்நலம்)தமிழ்Tanglish

**Screen 1: mobile-first citizen intake**

Describe issue (optional text)

🎙️ Tap to speak in Tamil, Tanglish, or English\
“தம்பி, காலேஜ் அட்மிஷனுக்கு கம்யூனிட்டி வேணும்…”

📸 Upload hazard photo or scan document

✨ Analyze with multimodal AI

🎙️ OorNalam AI CopilotSide panel mode

Language: தமிழ்TanglishEnglish

**1. Spoken transcript**\
“Thambi, college admission-ku community certificate…”

**2. Required documents**\
✔ Student Aadhaar Card (OCR extracted)\
✔ Smart Ration Card (address proof)\
✔ Father’s Community Cert / TC (caste proof)\
✔ VAO Income Slip (annual income)

**3. Extracted data preview**\
Name: KAVIN S (கவின் சு) · Community: MBC\
Sub-caste: Kongu Vellalar · Income: ₹72,000/yr\
Taluk: Namakkal · District: Namakkal

🪄 1-click auto-fill active government portal

## Technology stack

### Frontend web app

React 18, Vite, Tailwind CSS, Lucide React icons

### Browser extension

Chrome Extension Manifest V3, Side Panel API, content scripts

### Backend

Python 3.11, FastAPI, Uvicorn, Pydantic v2

### Database

SQLite 3 with SQLAlchemy ORM

### Speech and NLP

Web Speech API (ta-IN, en-IN), custom Tamil/Tanglish tokenizer, Gemini API

### Vision and document OCR

Google Gemini 2.5 Flash, OpenCV / document OCR parser

## Byte Breakers (AARVAM-S-0004)

The 24-hour sprint roster and deliverables.

| Team member | Role | 24-hour deliverables |
| --- | --- | --- |
| Suriyakumaran A (Lead) | System architecture, routing engine, QA | gcc_pilot_wards.json, portal_registry.py, end-to-end integration tests, jury pitch lead |
| Selvaganapathi A | UI/UX and frontend development | React web app UI, Chrome extension side panel (sidepanel.html/js), responsive Tailwind screens |
| Harivignesh K | Backend API and database infrastructure | FastAPI router (complaints.py), SQLite schema (db_models.py), /analyze and /completeness-check endpoints |
| Twin Kumar S | Tamil/Tanglish NLP and speech intelligence | Web Speech integration (ta-IN), bilingual prompt templates (grievance_drafter.py), keyword tokenizer |
| Surendhar R | Vision AI and document OCR specialist | Gemini VLM client (vlm_client.py), multimodal evidence fusion (evidence_extractor.py), document OCR parser |

## Try the working extension prototype

The Manifest V3 Chrome extension is built in `d:\Hackathon\oornalam-extension`.

1. Open Google Chrome and go to `chrome://extensions`.
2. Turn on Developer mode (top right).
3. Click Load unpacked and select `d:\Hackathon\oornalam-extension`.
4. Open a mock portal in Chrome: `mock_tnega_portal.html` (TNeGA e-Sevai) or `mock_civic_portal.html` (GCC civic grievance).
5. Click the OorNalam Copilot icon to open the side panel, pick a preset or speak in Tamil, Tanglish, or English, then click Auto-Fill Active Government Portal. All fields fill and highlight automatically.

**Oornalam – Service & Excellence**\
Byte Breakers · AARVAM-S-0004 · Phase 1