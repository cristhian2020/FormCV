import { Routes, Route } from "react-router-dom";
import ApplicationForm from "../components/forms/AplicationForm";
import ApplicationsList from "../components/views/ApplicationsList";
import Navbar from "../components/layout/Navbar";

export const AppRouter = () => {
  return (
    <div className="min-h-screen bg-gray-50 w-full flex flex-col">
      <Navbar />

      <main className="flex-1 w-full bg-white">
        <Routes>
          <Route path="/" element={<ApplicationForm />} />
          <Route path="/list" element={<ApplicationsList />} />
        </Routes>
      </main>
    </div>
  );
};
