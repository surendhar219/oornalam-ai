# OorNalam AI (ஊர்நலம்)
> **Multimodal AI-Powered Community Grievance Assistant**  
> *“A Better Town Begins with Your Voice.”*

**Hackathon:** Aarvam — Cybernaut Hackathon 2026  
**Problem Statement:** ARSW001 — *Our Town, Reimagined: Smart Community Hack*  
**Team Name:** Byte Breakers  
**Team ID:** AARVAM-S-0004  

---

## 1. Team Responsibilities & Ownership Matrix

| Member | Role | Assigned Engineering Ownership | Primary Workspace Directory |
| :--- | :--- | :--- | :--- |
| **SURIYAKUMARAN A** *(Leader)* | **Role E** | **Routing Engine, Portal Verification, QA & Project Lead** | `routing_data/` & Root Integration |
| **SELVAGANAPATHI A** | **Role A** | **Frontend & Citizen Experience Developer** | `frontend/` (React, TypeScript, Tailwind) |
| **Harivignesh K** | **Role B** | **Backend & Database Architecture Developer** | `backend/` (FastAPI, SQLite, Pydantic) |
| **TWIN KUMAR S** | **Role C** | **Text AI & NLP Developer** | `ai_services/` (LLM, Classifier, Grievance Drafter) |
| **SURENDHAR R** | **Role D** | **Vision AI & Multimodal Developer** | `vision_ai/` (VLM, Visual Evidence, Fusion) |

---

## 2. Monorepo Architecture

```
oornalam-ai/
├── frontend/             <-- SELVAGANAPATHI A (React, TypeScript, Tailwind)
│   ├── src/
│   │   ├── components/   (VoiceInput.tsx, ImageUpload.tsx, ComplaintForm.tsx)
│   │   ├── api/mock.ts   (Mock client for decoupled UI development)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/              <-- Harivignesh K (FastAPI, SQLite, Pydantic)
│   ├── app/
│   │   ├── models/       (schemas.py, db_models.py)
│   │   ├── routers/      (complaints.py, routing.py)
│   │   └── main.py
│   └── requirements.txt
├── ai_services/          <-- TWIN KUMAR S (Text LLM & Bilingual Drafting)
│   ├── nlp_classifier.py
│   ├── clarification.py
│   └── grievance_drafter.py
├── vision_ai/            <-- SURENDHAR R (Vision AI & Multimodal Fusion)
│   ├── vlm_client.py
│   └── evidence_extractor.py
├── routing_data/         <-- SURIYAKUMARAN A (Jurisdiction Data & Tests)
│   ├── gcc_pilot_wards.json
│   ├── portal_registry.py
│   └── test_e2e_scenarios.py
└── shared/
    └── contracts.json    <-- Canonical API contract agreed at Hour 1
```

---

## 3. How We Work Separately & Combine Using Git

### A. The Contract-First Principle
- All 5 members develop against the schema defined in [`shared/contracts.json`](./shared/contracts.json).
- **SELVAGANAPATHI A** uses `frontend/src/api/mock.ts` with mock data, so the frontend UI can be built and tested immediately without waiting for backend or AI servers.
- **Harivignesh K** builds the FastAPI endpoints to match the exact same JSON response shapes.
- **TWIN KUMAR S** and **SURENDHAR R** build standalone python modules (`ai_services/` and `vision_ai/`) that FastAPI routers import directly.
- **SURIYAKUMARAN A** builds and tests the locality database (`routing_data/`) independently using `pytest`.

### B. Git Branching Strategy
Everyone works on their own dedicated branch:

```bash
# SURIYAKUMARAN A:
git checkout -b feat/routing-lead

# SELVAGANAPATHI A:
git checkout -b feat/frontend-ui

# Harivignesh K:
git checkout -b feat/backend-api

# TWIN KUMAR S:
git checkout -b feat/text-nlp

# SURENDHAR R:
git checkout -b feat/vision-vlm
```

### C. Daily Git Commands Cheatsheet

1. **Pull latest changes from team before starting work:**
   ```bash
   git fetch origin
   git checkout main
   git pull origin main
   git checkout <your-branch>
   git rebase main
   ```

2. **Commit your isolated work:**
   ```bash
   git add <your-folder>/
   git commit -m "feat(frontend): add voice transcription component"
   git push origin <your-branch>
   ```

3. **Smooth Integration Sequence (Hours 19–21):**
   - **Step 1:** Merge `feat/backend-api` into `main`.
   - **Step 2:** Merge `feat/text-nlp` and `feat/vision-vlm` into `main`.
   - **Step 3:** Merge `feat/routing-lead` into `main` and run `pytest routing_data/test_e2e_scenarios.py`.
   - **Step 4:** In `frontend/src/api/mock.ts`, toggle `USE_MOCK = false` and merge `feat/frontend-ui` into `main`.

---

## 4. How to Run Each Component

### Running Backend (Harivignesh K & Team):
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`

### Running Frontend (Selvaganapathi A & Team):
```bash
cd frontend
npm install
npm run dev
```
- Web UI: `http://localhost:5173`

### Running E2E Routing Tests (Suriyakumaran A & Team):
```bash
pytest routing_data/test_e2e_scenarios.py -v
```
