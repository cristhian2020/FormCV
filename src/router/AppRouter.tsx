import { Routes, Route } from "react-router-dom";
import ApplicationForm from "../components/forms/AplicationForm";
import ApplicationsList from "../components/views/ApplicationsList";
import Navbar from "../components/layout/Navbar";
import FormSheet from "../components/forms/Sheet/FormSheet";

export const AppRouter = () => {
  return (
    <div className="min-h-screen bg-gray-50 w-full flex flex-col">
      <Navbar />

      <main className="flex-1 w-full bg-white">
        <Routes>
          <Route path="/" element={<ApplicationForm />} />
          <Route path="/list" element={<ApplicationsList />} />
          <Route path="/form-sheet" element={<FormSheet />} />
        </Routes>
      </main>
    </div>
  );
};
