import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "@/layouts/RootLayout";
import { Spinner } from "@/components/Loading";
import Home from "@/pages/Home";

// Every page used to be imported eagerly, so visiting any single route
// (even just "/") downloaded and parsed the code + data for every other
// page too — biographies, reading lessons, lesson content, the SahiUrdu
// feature — all in one ~670KB JS bundle before the app could even render.
// Lazy-loading everything except Home (the actual landing page) means the
// first paint only ships what that page needs; the rest is fetched on
// demand as the person navigates to it.
const Learn = lazy(() => import("@/pages/Learn"));
const Reading = lazy(() => import("@/pages/Reading"));
const LessonDetail = lazy(() => import("@/pages/LessonDetail"));
const Practice = lazy(() => import("@/pages/Practice"));
const Test = lazy(() => import("@/pages/Test"));
const Results = lazy(() => import("@/pages/Results"));
const Progress = lazy(() => import("@/pages/Progress"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const Saved = lazy(() => import("@/pages/Saved"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const SahiUrdu = lazy(() => import("@/features/sahiUrdu/components/SahiUrdu"));
const Biography = lazy(() => import("@/features/biography/components/Biography"));

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size={28} label="Loading page" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/phonetic-keyboard" element={<Reading />} />
          <Route path="/learn/reading" element={<Navigate to="/learn/phonetic-keyboard" replace />} />
          <Route path="/sahi-urdu/*" element={<SahiUrdu />} />
          <Route path="/biography/*" element={<Biography />} />
          <Route path="/lesson/:id" element={<LessonDetail />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/test" element={<Test />} />
          <Route path="/results" element={<Results />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
