# MedUnify Frontend - API Integration Status

**Last Updated:** January 31, 2026  
**Status:** In Progress

---

## ✅ Fully Integrated APIs

### 1. Authentication APIs
- [x] `POST /auth/login` - Unified login (all roles)
- [x] Token storage and management
- [ ] `GET /auth/me` - Get current user (NOT INTEGRATED)
- [ ] `POST /auth/register` - Patient registration (NOT INTEGRATED)
- [ ] `POST /auth/logout` - Logout (NOT INTEGRATED)

**Files:** `src/lib/api/auth.ts`, `src/context/AuthContext.tsx`

---

### 2. Hospital Portal APIs
- [x] `GET /hospital/stats` - Dashboard stats
- [x] `GET /hospital/doctors` - List doctors
- [x] `POST /hospital/doctors` - Create doctor
- [ ] `GET /hospital/doctors/{id}` - Doctor details (NOT FULLY INTEGRATED)
- [ ] `PUT /hospital/doctors/{id}` - Update doctor (NOT FULLY INTEGRATED)
- [x] `PATCH /hospital/doctors/{id}/status` - Toggle status

**Files:** `src/lib/api/hospital.ts`

**Pages Using API:**
- `src/pages/hospital/Dashboard.tsx` - ✅ Integrated, ❌ Has dummy fallback
- `src/pages/hospital/Doctors.tsx` - ✅ Integrated, ❌ Has dummy fallback
- `src/pages/hospital/DoctorCreate.tsx` - ✅ Integrated
- `src/pages/hospital/DoctorDetail.tsx` - ❌ NOT INTEGRATED (uses dummy data)

---

### 3. Doctor Portal APIs
- [x] `GET /doctor/stats` - Dashboard stats
- [x] `GET /doctor/patients` - List shared patients
- [ ] `PUT /doctor/profile` - Update own profile (NOT INTEGRATED)
- [ ] `GET /doctor/activity` - Activity log (NOT INTEGRATED)

**Files:** `src/lib/api/doctor-patient-view.ts`

**Pages Using API:**
- `src/pages/doctor/Dashboard.tsx` - ✅ Integrated, ❌ Has dummy fallback
- `src/pages/doctor/Patients.tsx` - ✅ Integrated, ❌ Has dummy fallback
- `src/pages/doctor/Settings.tsx` - ❌ NOT INTEGRATED

---

### 4. Patient Portal - Doctor Discovery APIs
- [x] `GET /doctors/public` - Browse doctors
- [x] `GET /doctors/public/{id}` - Doctor profile
- [ ] `GET /doctors/public/hospitals` - List hospitals (NOT INTEGRATED)
- [ ] `GET /doctors/public/specializations` - Specializations list (NOT INTEGRATED)
- [ ] `GET /doctors/public/cities` - Cities list (NOT INTEGRATED)

**Files:** `src/lib/api/doctor-discovery.ts`

**Pages Using API:**
- `src/pages/Doctors.tsx` - ✅ Integrated, ❌ Has dummy fallback
- `src/pages/Share.tsx` - ✅ Integrated (for doctor list), ❌ Has dummy fallback

---

### 5. Doctor-Patient Sharing APIs
- [x] `POST /patient/doctor-shares` - Create share with doctor(s)
- [x] `GET /patient/doctor-shares` - List my shares
- [ ] `GET /patient/doctor-shares/{id}` - Share details (NOT INTEGRATED)
- [ ] `PUT /patient/doctor-shares/{id}` - Update share (NOT INTEGRATED)
- [ ] `DELETE /patient/doctor-shares/{id}` - Revoke share (NOT INTEGRATED)
- [ ] `POST /patient/doctor-shares/{id}/toggle` - Toggle share (NOT INTEGRATED)

**Files:** `src/lib/api/patient-doctor-share.ts`

**Pages Using API:**
- `src/pages/Share.tsx` - ✅ Partially integrated, ❌ Has dummy fallback
- `src/pages/Doctors.tsx` - ✅ Share action integrated

---

### 6. Doctor Patient Access APIs
- [ ] `GET /doctors/patients/{id}/profile` - Patient profile (NOT INTEGRATED)
- [ ] `GET /doctors/patients/{id}/timeline` - Patient timeline (NOT INTEGRATED)
- [ ] `GET /doctors/patients/{id}/reports` - Patient reports (NOT INTEGRATED)
- [ ] `GET /doctors/patients/{id}/assessments` - Patient assessments (NOT INTEGRATED)

**Files:** `src/lib/api/doctor-patient-view.ts`

**Pages Using API:**
- `src/pages/doctor/PatientDetail.tsx` - ❌ NOT INTEGRATED
- `src/pages/doctor/PatientReports.tsx` - ❌ Uses dummy data

---

### 7. Reports APIs
- [x] `POST /reports/upload` - Upload report
- [x] `GET /reports` - List reports
- [x] `GET /reports/{id}` - Get single report
- [x] `GET /reports/{id}/download` - Download report

**Files:** `src/lib/api/reports.ts`

**Pages Using API:**
- `src/pages/Reports.tsx` - ✅ Integrated, ❌ Has dummy fallback
- `src/pages/Upload.tsx` - ✅ Integrated
- `src/pages/ReportDetail.tsx` - ✅ Integrated

---

### 8. Timeline APIs
- [x] `GET /timeline/graph-data` - Graph-ready timeline data
- [x] `GET /timeline/biomarkers` - Available biomarkers
- [x] `GET /timeline/insights` - AI insights
- [ ] `GET /timeline/trends` - Trends analysis (NOT INTEGRATED)
- [ ] `POST /timeline/annotations` - Create annotation (NOT INTEGRATED)
- [ ] `PUT /timeline/annotations/{id}` - Update annotation (NOT INTEGRATED)
- [ ] `DELETE /timeline/annotations/{id}` - Delete annotation (NOT INTEGRATED)

**Files:** `src/lib/api/timeline.ts`

**Pages Using API:**
- `src/pages/Timeline.tsx` - ✅ Integrated, ❌ Has dummy fallback

---

### 9. Health Assessment APIs
- [x] `POST /assessment/chat` - Send chat message
- [x] `GET /assessment/chat/current` - Current session
- [x] `POST /assessment/chat/complete` - Force complete
- [x] `POST /assessment/chat/reset` - Reset session
- [x] `GET /assessment/chat/history` - Assessment history

**Files:** `src/lib/api/assessment.ts`

**Pages Using API:**
- `src/pages/Assessment.tsx` - ✅ Fully integrated, ❌ NO dummy fallback

---

### 10. Profile Sharing APIs (Link-based)
- [ ] `POST /share/create` - Create share link (NOT INTEGRATED)
- [ ] `GET /share` - List my shares (NOT INTEGRATED)
- [ ] `PUT /share/{id}` - Update share (NOT INTEGRATED)
- [ ] `DELETE /share/{id}` - Revoke share (NOT INTEGRATED)
- [ ] `GET /share/{id}/view` - View shared profile (NOT INTEGRATED)
- [ ] `GET /share/emergency/{user_id}` - Emergency profile (NOT INTEGRATED)

**Files:** `src/lib/api/share.ts` (exists but not used)

**Pages Using API:**
- ❌ No pages currently use link-based sharing

---

### 11. Caregiver APIs
- [ ] `POST /caregivers/invite` - Invite caregiver (NOT IMPLEMENTED)
- [ ] `GET /caregivers/relationships` - List relationships (NOT IMPLEMENTED)

**Status:** ❌ Not implemented in frontend

---

### 12. Notification APIs
- [ ] `GET /notifications` - List notifications (NOT IMPLEMENTED)
- [ ] `PUT /notifications/{id}/read` - Mark as read (NOT IMPLEMENTED)
- [ ] `PUT /notifications/read-all` - Mark all as read (NOT IMPLEMENTED)

**Status:** ❌ Not implemented in frontend

---

## 🔴 Pages with Dummy Data Fallback

| Page | API Endpoint | Status | Action Needed |
|------|--------------|--------|---------------|
| `hospital/Dashboard.tsx` | `/hospital/stats` | Integrated | Remove fallback |
| `hospital/Doctors.tsx` | `/hospital/doctors` | Integrated | Remove fallback |
| `hospital/DoctorDetail.tsx` | `/hospital/doctors/{id}` | Not integrated | Integrate API |
| `doctor/Dashboard.tsx` | `/doctor/stats`, `/doctor/patients` | Integrated | Remove fallback |
| `doctor/Patients.tsx` | `/doctor/patients` | Integrated | Remove fallback |
| `doctor/PatientReports.tsx` | `/doctors/patients/{id}/reports` | Not integrated | Integrate API |
| `Doctors.tsx` | `/doctors/public` | Integrated | Remove fallback |
| `Share.tsx` | `/patient/doctor-shares` | Integrated | Remove fallback |
| `Timeline.tsx` | `/timeline/graph-data` | Integrated | Remove fallback |
| `Reports.tsx` | `/reports` | Integrated | Remove fallback |
| `Login.tsx` (all 3) | `/auth/login` | Integrated | Remove dummy login |

---

## 📝 Implementation Priority

### High Priority (Remove Dummy Fallbacks)
1. Remove dummy data fallbacks from all integrated pages
2. Add comprehensive error logging
3. Display API errors to users clearly

### Medium Priority (Complete Integration)
1. Integrate `/auth/me` for token validation
2. Integrate `/auth/register` for patient registration
3. Integrate doctor profile update (`/doctor/profile`)
4. Integrate hospital doctor detail page
5. Integrate patient detail pages for doctors

### Low Priority (New Features)
1. Link-based sharing system
2. Caregiver management
3. Notification system
4. Activity logs

---

## 🚨 Critical Issues

1. **Dummy Login Credentials**: Login pages have hardcoded dummy credentials as fallback
2. **Error Handling**: API errors fall back to dummy data instead of showing errors
3. **Token Validation**: No `/auth/me` call to validate tokens on app start
4. **Missing Endpoints**: Some API service functions exist but aren't used in pages

---

## 📊 Integration Coverage

- **Integrated & Used**: 60%
- **Integrated but Dummy Fallback**: 30%
- **Not Integrated**: 10%

**Next Steps:**
1. Remove all dummy data fallbacks
2. Add comprehensive error logging
3. Implement remaining high-priority endpoints
