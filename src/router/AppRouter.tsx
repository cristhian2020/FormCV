import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import ApplicationForm from "../components/forms/AplicationForm";
import ApplicationsList from "../components/views/ApplicationsList";
import Navbar from "../components/layout/Navbar";
import LoginPage from "../components/views/LoginPage";
// import FormSheet from "../components/forms/Sheet/FormSheet";

const AppRouterContent = () => {
  const { user, isAdmin, loading, signOutUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full flex flex-col">
      {user && <Navbar user={user} isAdmin={isAdmin} onSignOut={signOutUser} />}

      <main className="flex-1 w-full bg-white">
        <Routes>
          <Route path="/" element={<ApplicationForm />} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route
            path="/list"
            element={
              !user ? <Navigate to="/login" replace /> : isAdmin ? <ApplicationsList /> : <Navigate to="/" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
          {/* <Route path="/form-sheet" element={<FormSheet />} /> */}
        </Routes>
      </main>
    </div>
  );
};

export const AppRouter = () => {
  return (
    <AuthProvider>
      <AppRouterContent />
    </AuthProvider>
  );
};
