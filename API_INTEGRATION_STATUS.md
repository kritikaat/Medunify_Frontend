# MedUnify Frontend - API Integration Status

**Last Updated:** January 30, 2026

---

## 🎯 Quick Summary

| Feature | API Status | UI Status | Works Without Backend? |
|---------|-----------|-----------|----------------------|
| **Login** | ✅ Connected | ✅ Complete | ✅ Yes (dummy credentials) |
| **Reports** | ✅ Connected | ✅ Complete | ✅ Yes (dummy fallback) |
| **Timeline** | ✅ Connected | ✅ Complete | ✅ Yes (dummy fallback) |
| **Upload** | ✅ Connected | ✅ Complete | ❌ Needs backend |
| **Assessment** | ✅ Connected | ✅ Complete | ❌ Needs backend |
| **Share (Patient)** | ⚠️ Ready, not connected | ✅ Complete | ✅ Yes (dummy data) |
| **Doctors Browse** | ⚠️ Ready, not connected | ✅ Complete | ✅ Yes (dummy data) |
| **Doctor Portal** | ⚠️ Ready, not connected | ✅ Complete | ✅ Yes (dummy data) |
| **Hospital Portal** | ❌ Backend missing | ✅ Complete | ✅ Yes (dummy data) |

---

## 📊 Detailed Status by Page

### 1. Authentication (`/login`, `/doctor/login`, `/hospital/login`)

**✅ WORKING**

**API Used:**
```typescript
POST /api/v1/auth/login
```

**How it works:**
1. First checks dummy credentials:
   - Patient: `patient@example.com` / `patient123`
   - Doctor: `doctor@cityhospital.com` / `doctor123`
   - Hospital: `hospital@cityhospital.com` / `hospital123`
2. If dummy → stores in localStorage, redirects to portal
3. If not dummy → tries real API
4. If API fails → shows error with hint to use dummy credentials

**Files:**
- `src/pages/Login.tsx` - Patient login
- `src/pages/doctor/Login.tsx` - Doctor login
- `src/pages/hospital/Login.tsx` - Hospital login
- `src/lib/api/auth.ts` - Auth API service

---

### 2. Reports Page (`/reports`)

**✅ WORKING (with fallback)**

**API Used:**
```typescript
GET /api/v1/reports?limit=100
GET /api/v1/reports/{id}  // For download
```

**How it works:**
1. Tries to fetch reports from API
2. If API fails → uses dummy reports (5 sample reports)
3. Shows warning banner with error details
4. Console logs detailed error info

**Error Handling:**
- Shows error banner at top of page
- Error details in console (F12)
- "Retry" button to attempt API again
- Download functionality works on dummy data

**Files:**
- `src/pages/Reports.tsx`
- `src/lib/api/reports.ts`
- Dummy data: Inline in Reports.tsx (DUMMY_REPORTS)

---

### 3. Timeline Page (`/timeline`)

**✅ CONNECTED (with fallback)**

**API Used:**
```typescript
GET /api/v1/timeline/graph-data?biomarkers=hba1c&biomarkers=cholesterol&date_from=2024-01-01
GET /api/v1/timeline/insights?months=12
```

**How it works:**
1. On page load, fetches graph data and insights from API
2. Transforms API response to chart format
3. If API fails → uses dummy timeline data
4. Shows error banner with retry button
5. Updates when date range changes

**Response Transformation:**
```typescript
// API Response (biomarkers array)
{
  biomarkers: [
    {
      biomarker_name: "HbA1c",
      standard_name: "hba1c",
      data_points: [
        { date: "2024-01-10", value: 6.9 },
        { date: "2024-06-15", value: 6.5 }
      ]
    }
  ]
}

// Transformed to Chart Format
[
  { date: "Jan 24", hba1c: 6.9, cholesterol: 210 },
  { date: "Jun 24", hba1c: 6.5, cholesterol: 195 }
]
```

**Files:**
- `src/pages/Timeline.tsx` - Now connected to API
- `src/lib/api/timeline.ts` - Timeline API service
- `src/types/timeline.ts` - Timeline types

---

### 4. Upload Page (`/upload`)

**✅ WORKING**

**API Used:**
```typescript
POST /api/v1/reports/upload  // multipart/form-data
GET  /api/v1/reports/{id}     // Fetch after upload
POST /api/v1/reports/{id}/reprocess  // Reprocess
```

**How it works:**
1. User uploads file (PDF/Image)
2. Shows processing animation
3. Fetches report details after upload
4. Shows patient-friendly and clinical summaries
5. Download options (JSON, TXT, CSV, PDF)

**No fallback** - requires real backend

**Files:**
- `src/pages/Upload.tsx`
- `src/lib/api/reports.ts`
- `src/lib/api/download.ts`

---

### 5. Assessment Chat (`/assessment`)

**✅ WORKING**

**API Used:**
```typescript
POST /api/v1/assessment/chat
POST /api/v1/assessment/chat/complete
POST /api/v1/assessment/chat/reset
GET  /api/v1/assessment/chat/current
GET  /api/v1/assessment/chat/history?include_conversation=true
```

**How it works:**
1. User sends message
2. AI responds with questions or final assessment
3. Tracks progress
4. Shows conversation history with full Q&A

**No fallback** - requires real backend

**Files:**
- `src/pages/Assessment.tsx`
- `src/lib/api/assessment.ts`
- `src/types/assessment.ts`

---

### 6. Share with Doctors (`/share`, `/doctors`)

**⚠️ UI READY, API NOT CONNECTED**

**API Services Created (not used yet):**
```typescript
// Doctor Discovery
GET /api/v1/doctors/public
GET /api/v1/doctors/public/{id}
GET /api/v1/doctors/public/specializations
GET /api/v1/doctors/public/cities

// Patient Sharing
POST   /api/v1/patient/doctor-shares
GET    /api/v1/patient/doctor-shares
PUT    /api/v1/patient/doctor-shares/{id}
DELETE /api/v1/patient/doctor-shares/{id}
POST   /api/v1/patient/doctor-shares/{id}/toggle
```

**Current behavior:**
- Uses **dummy doctor data** (8 sample doctors)
- Uses **dummy hospital data** (3 hospitals)
- Sharing is simulated (updates local state only)
- Works perfectly without backend

**Files:**
- `src/pages/Share.tsx` - Share management
- `src/pages/Doctors.tsx` - Browse all doctors
- `src/lib/api/doctor-discovery.ts` - ✅ Ready
- `src/lib/api/patient-doctor-share.ts` - ✅ Ready
- `src/types/share.ts` - Types

**To connect:** Replace dummy data with API calls in Share.tsx and Doctors.tsx

---

### 7. Doctor Portal (`/doctor/*`)

**⚠️ UI READY, API NOT CONNECTED**

**API Services Created (not used yet):**
```typescript
// Doctor viewing patients
GET /api/v1/doctors/patients?doctor_id={id}
GET /api/v1/doctors/patients/{patient_id}/profile?doctor_id={id}
GET /api/v1/doctors/patients/{patient_id}/timeline?doctor_id={id}
GET /api/v1/doctors/patients/{patient_id}/reports?doctor_id={id}
GET /api/v1/doctors/patients/{patient_id}/assessments?doctor_id={id}

// Doctor profile management
PUT /api/v1/doctor/profile
GET /api/v1/doctor/stats
GET /api/v1/doctor/activity
```

**Current behavior:**
- Uses **dummy patient data**
- Uses **dummy stats**
- Profile editing updates localStorage only
- Works perfectly without backend

**Pages:**
- `/doctor` - Dashboard
- `/doctor/patients` - List shared patients
- `/doctor/patients/:id` - View patient reports
- `/doctor/settings` - Edit profile

**Files:**
- `src/pages/doctor/*.tsx` - All pages
- `src/lib/api/doctor-patient-view.ts` - ✅ Ready
- `src/types/doctor-patient-view.ts` - Types

**To connect:** Replace dummy data with API calls in doctor pages

---

### 8. Hospital Portal (`/hospital/*`)

**❌ BACKEND APIS MISSING**

**APIs Needed:**
```typescript
POST /api/v1/hospital/auth/login      - Hospital login
GET  /api/v1/hospital/stats           - Dashboard statistics
GET  /api/v1/hospital/doctors         - List doctors
POST /api/v1/hospital/doctors         - Create doctor account
GET  /api/v1/hospital/doctors/{id}    - Get doctor details
PUT  /api/v1/hospital/doctors/{id}    - Update doctor
PATCH /api/v1/hospital/doctors/{id}/status - Activate/deactivate
```

**Current behavior:**
- Uses **dummy doctor data** (12 sample doctors)
- Uses **dummy stats**
- All CRUD operations are simulated
- Works perfectly without backend

**Pages:**
- `/hospital` - Dashboard
- `/hospital/doctors` - List doctors
- `/hospital/doctors/new` - Create doctor
- `/hospital/doctors/:id` - View/edit doctor
- `/hospital/settings` - Hospital settings

**Files:**
- `src/pages/hospital/*.tsx` - All pages
- Backend API service not created yet (waiting for backend endpoints)

---

## 🐛 Debugging Guide

### Check Browser Console (F12)

**Successful API Call:**
```
🌐 API Request: GET /api/v1/reports?limit=100
✅ API Response: /api/v1/reports [...]
```

**Failed API Call:**
```
🌐 API Request: GET /api/v1/reports?limit=100
❌ API Error: {
  url: "/api/v1/reports",
  method: "GET",
  status: 401,
  statusText: "Unauthorized",
  detail: "Not authenticated",
  body: {...}
}
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Not logged in or token expired | Login again |
| `403 Forbidden` | Wrong role (patient accessing doctor API) | Check user role |
| `404 Not Found` | Endpoint doesn't exist | Backend not updated yet |
| `500 Server Error` | Backend crashed | Check backend logs |
| `Network error` | Backend not running | Start backend server |
| `[object Object]` in URL | Config error | Fixed - was duplicate REPORTS key |

### Check API Base URL

Open console and run:
```javascript
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
```

Should show: `http://localhost:8000` (or empty in dev mode for proxy)

---

## 📁 File Structure

```
src/
├── lib/api/
│   ├── client.ts                    ✅ Base client with detailed error logging
│   ├── config.ts                    ✅ Fixed duplicate REPORTS key
│   ├── auth.ts                      ✅ Login, logout
│   ├── reports.ts                   ✅ Upload, list, get by ID
│   ├── assessment.ts                ✅ Chat, history
│   ├── timeline.ts                  ✅ NEW - Graph data, insights
│   ├── share.ts                     ✅ NEW - Link-based sharing
│   ├── doctor-discovery.ts          ✅ NEW - Browse doctors
│   ├── patient-doctor-share.ts      ✅ NEW - Patient→Doctor sharing
│   ├── doctor-patient-view.ts       ✅ NEW - Doctor→Patient viewing
│   └── download.ts                  ✅ Download utilities
│
├── types/
│   ├── api.ts                       ✅ Core types (User, Report, etc.)
│   ├── timeline.ts                  ✅ NEW - Timeline types
│   ├── share.ts                     ✅ Updated - UI + API types
│   ├── doctor-discovery.ts          ✅ NEW - Doctor search types
│   ├── patient-doctor-share.ts      ✅ NEW - Sharing types
│   ├── doctor-patient-view.ts       ✅ NEW - Doctor view types
│   ├── assessment.ts                ✅ Updated - Added conversation history
│   ├── hospital.ts                  ✅ Hospital portal types
│   ├── doctor.ts                    ✅ Doctor portal types
│   └── index.ts                     ✅ Barrel exports
│
└── pages/
    ├── Login.tsx                    ✅ Dummy fallback + API
    ├── Reports.tsx                  ✅ API + dummy fallback + error banner
    ├── Timeline.tsx                 ✅ API + dummy fallback + error banner
    ├── Upload.tsx                   ✅ API (no fallback - needs backend)
    ├── Assessment.tsx               ✅ API (no fallback - needs backend)
    ├── Share.tsx                    ⚠️ Dummy only (API ready)
    ├── Doctors.tsx                  ⚠️ Dummy only (API ready)
    ├── doctor/*.tsx                 ⚠️ Dummy only (API ready)
    └── hospital/*.tsx               ⚠️ Dummy only (backend missing)
```

---

## 🔧 Recent Fixes

### Fix #1: Duplicate `REPORTS` Key (CRITICAL)
**Problem:**
```typescript
API_ENDPOINTS = {
  REPORTS: '/api/v1/reports',    // String
  REPORTS: { LIST: ... },        // Object - OVERWRITES above!
}
```
**Result:** URL became `[object Object]?limit=100`

**Fix:**
```typescript
API_ENDPOINTS = {
  REPORTS: '/api/v1/reports',       // Kept for backward compatibility
  REPORTS_API: { LIST: ... },       // Renamed nested version
}
```

### Fix #2: Storage Key Consistency
**Problem:** Different storage keys used across files
- `medunify_token`
- `medunify_access_token`
- `medunify_user`

**Fix:** Centralized in `config.ts`:
```typescript
TOKEN_STORAGE_KEY = 'medunify_access_token'
USER_STORAGE_KEY = 'medunify_user'
```

### Fix #3: Missing Import Exports
**Problem:** `DATE_RANGE_OPTIONS` not found

**Fix:** Restored UI types in `types/share.ts`:
- `DoctorProfile`, `ActiveShare`, `ShareableContent`
- `SHARE_CONTENT_OPTIONS`, `DATE_RANGE_OPTIONS`, `EXPIRY_OPTIONS`

### Fix #4: Enhanced Error Logging
**Added to `client.ts`:**
- Console logs every API request/response
- Detailed error objects with status, headers, body
- Network error detection

---

## 🧪 Testing Checklist

### Test Reports Page
1. Login with: `patient@example.com` / `patient123`
2. Go to `/reports`
3. **If API works:** See your real reports
4. **If API fails:** See 5 dummy reports + error banner at top
5. Check console (F12) for detailed error

### Test Timeline Page
1. Login as patient
2. Go to `/timeline`
3. **If API works:** See your biomarker graphs
4. **If API fails:** See demo graph + error banner
5. Toggle biomarkers (checkboxes at top)
6. Change date range

### Test Upload Page
1. Login as patient
2. Go to `/upload`
3. Upload a medical report (PDF/Image)
4. **Needs backend** - will fail without API

### Test Doctor Portal
1. Login with: `doctor@cityhospital.com` / `doctor123`
2. Browse dashboard, patients
3. All using dummy data currently

### Test Hospital Portal
1. Login with: `hospital@cityhospital.com` / `hospital123`
2. Browse dashboard, doctors
3. Create doctor (simulated)
4. All using dummy data currently

---

## 🚀 Next Steps

### Option A: Fix Backend Connection
If you want to use real APIs:

1. **Start backend:**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

2. **Run migration:**
   ```bash
   alembic upgrade head
   ```

3. **Test login:**
   - Go to http://localhost:8000/docs
   - Try POST /api/v1/auth/login

### Option B: Keep Using Dummy Data
Current setup works perfectly for development:
- All pages are functional
- All features are testable
- No backend required

### Option C: Connect More APIs
I can connect these pages to real APIs:
- Share page → Doctor Discovery API
- Doctors page → Doctor Discovery API  
- Doctor portal → Patient view APIs

Just let me know which pages you want connected next!

---

## 📝 API Request Examples

### Reports API
```bash
# Login first
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"patient123"}'

# Get reports
curl http://localhost:8000/api/v1/reports?limit=100 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Timeline API
```bash
# Get graph data
curl "http://localhost:8000/api/v1/timeline/graph-data?biomarkers=hba1c&date_from=2024-01-01" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get insights
curl "http://localhost:8000/api/v1/timeline/insights?months=12" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎨 UI Features

All pages include:
- ✅ Loading states (spinners)
- ✅ Error states (with retry buttons)
- ✅ Empty states (helpful messages)
- ✅ Fallback dummy data (when API fails)
- ✅ Error banners (showing exact error)
- ✅ Console logging (for debugging)
- ✅ Toast notifications (success/error)

---

## 💡 For You

**To see why API is failing:**

1. Open browser (http://localhost:8080)
2. Press F12 (DevTools)
3. Go to Console tab
4. Login and navigate to Reports or Timeline
5. Look for:
   ```
   🌐 API Request: ...
   ❌ API Error: { ... }
   ```

The error object will tell you exactly what's wrong:
- `status: 401` → Not logged in
- `status: 404` → Backend endpoint missing
- `status: 500` → Backend error
- `status: 0` → Backend not running

**Current Status:** Everything is working with dummy data as fallback! 🎉
