import React, { useEffect, useState } from "react";
import applicationService from "../../service/applicationService";
import { Download, FileText, Clock, ChevronRight } from "lucide-react";
import ApplicationDetailModal from "./ApplicationDetailModal";

interface Application {
  id: string;
  fullName: string;
  email: string;
  desiredPosition: string;
  yearsOfExperience: string;
  status: string;
  resume?: string;
  resumeFileName?: string;
  submittedAt?: any;
  [key: string]: any;
}

const ApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (app: Application) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await applicationService.getApplications();
        setApplications(data as Application[]);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to load applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown";
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return "Recently";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Submitted Applications
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all candidates who have applied for open positions.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Total: {applications.length}
          </span>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No applications
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Currently there are no received applications.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {applications.map((app) => (
              <li key={app.id}>
                <div
                  className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => handleOpenModal(app)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 md:truncate w-full">
                      <p className="text-sm font-medium text-blue-600 truncate group-hover:text-blue-800 transition-colors">
                        {app.fullName}
                      </p>
                      <p className="flex-shrink-0 text-sm text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full inline-flex w-fit">
                        {app.desiredPosition}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex items-center gap-3">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                        {app.status || "pending"}
                      </p>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <span className="truncate">{app.email}</span>
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {app.yearsOfExperience} Exp.
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 gap-4">
                      <p className="flex items-center gap-1">
                        Applied: {formatDate(app.submittedAt)}
                      </p>
                      {app.resume && (
                        <button
                          className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(app.resume, "_blank");
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Resume
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ApplicationDetailModal
        application={selectedApp}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ApplicationsList;
