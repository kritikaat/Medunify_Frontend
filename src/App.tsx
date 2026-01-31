import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Route Guards
import { PatientGuard, DoctorGuard, HospitalGuard } from "./components/guards";

// Public Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Patient Portal Pages
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Timeline from "./pages/Timeline";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import Assessment from "./pages/Assessment";
import Share from "./pages/Share";
import Doctors from "./pages/Doctors";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";

// Hospital Portal Pages
import {
  HospitalLogin,
  HospitalDashboard,
  HospitalDoctors,
  HospitalDoctorCreate,
  HospitalDoctorDetail,
  HospitalSettings,
} from "./pages/hospital";

// Doctor Portal Pages
import {
  DoctorLogin,
  DoctorDashboard,
  DoctorPatients,
  DoctorPatientReports,
  DoctorSettings,
} from "./pages/doctor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* ============ PUBLIC ROUTES ============ */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ============ PATIENT PORTAL ============ */}
            <Route element={<PatientGuard />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/:id" element={<ReportDetail />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/share" element={<Share />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>

            {/* ============ HOSPITAL PORTAL ============ */}
            <Route path="/hospital/login" element={<HospitalLogin />} />
            <Route element={<HospitalGuard />}>
              <Route path="/hospital" element={<HospitalDashboard />} />
              <Route path="/hospital/doctors" element={<HospitalDoctors />} />
              <Route path="/hospital/doctors/new" element={<HospitalDoctorCreate />} />
              <Route path="/hospital/doctors/:id" element={<HospitalDoctorDetail />} />
              <Route path="/hospital/settings" element={<HospitalSettings />} />
            </Route>

            {/* ============ DOCTOR PORTAL ============ */}
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route element={<DoctorGuard />}>
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route path="/doctor/patients/:id" element={<DoctorPatientReports />} />
              <Route path="/doctor/settings" element={<DoctorSettings />} />
            </Route>

            {/* ============ 404 CATCH-ALL ============ */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
