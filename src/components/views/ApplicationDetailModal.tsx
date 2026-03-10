import React, { type FC } from "react";
import {
  X,
  Download,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Building,
  DollarSign,
  Calendar,
  FileText,
  Link as LinkIcon,
  Globe,
} from "lucide-react";

interface ApplicationDetailModalProps {
  application: any;
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationDetailModal: FC<ApplicationDetailModalProps> = ({
  application,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !application) return null;

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown";
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "Recently";
  };

  const SectionTitle = ({
    children,
    icon: Icon,
  }: {
    children: React.ReactNode;
    icon?: any;
  }) => (
    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 mt-6 flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-blue-600" />}
      {children}
    </h3>
  );

  const DataField = ({ label, value }: { label: string; value: any }) => (
    <div className="mb-4">
      <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
      <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-100 whitespace-pre-wrap">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </dd>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Application Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Submitted on {formatDate(application.submittedAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                <Briefcase className="w-4 h-4 mr-1.5" />
                {application.desiredPosition}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                <Globe className="w-4 h-4 mr-1.5" />
                {application.workArrangement}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                <MapPin className="w-4 h-4 mr-1.5" />
                {application.city}, {application.state},{" "}
                {application.countryOfResidence}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <SectionTitle icon={FileText}>
                  Personal Information
                </SectionTitle>
                <div className="grid grid-cols-2 gap-4">
                  <DataField label="Full Name" value={application.fullName} />
                  <DataField label="Email" value={application.email} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <DataField
                    label="Phone Number"
                    value={application.phoneNumber}
                  />
                  <DataField
                    label="Willing to Relocate?"
                    value={application.willingnessToRelocate ? "Yes" : "No"}
                  /> 
                  <DataField
                    label="Consent to Data Processing"
                    value={application.consentToDataProcessing ? "Yes" : "No"}
                  />
                </div>

                <SectionTitle icon={GraduationCap}>
                  Education & Certifications
                </SectionTitle>
                <DataField
                  label="Highest Education"
                  value={application.highestEducation}
                />
                <DataField
                  label="Relevant Certifications"
                  value={application.relevantCertifications}
                />

                <SectionTitle icon={Award}>Skills</SectionTitle>
                <DataField
                  label="Technical Competencies"
                  value={application.keySkills?.technicalCompetencies}
                />

                <div className="mb-4">
                  <dt className="text-sm font-medium text-gray-500 mb-1">
                    Languages
                  </dt>
                  <dd className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-100">
                    {application.keySkills?.languages &&
                    application.keySkills.languages.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {application.keySkills.languages.map(
                          (lang: any, index: number) => (
                            <li key={index}>
                              <span className="font-semibold">
                                {lang.language}
                              </span>{" "}
                              - {lang.proficiency}
                            </li>
                          ),
                        )}
                      </ul>
                    ) : (
                      <span className="text-gray-400 italic">
                        No languages provided
                      </span>
                    )}
                  </dd>
                </div>
              </div>

              <div>
                <SectionTitle icon={Building}>
                  Professional Experience
                </SectionTitle>
                <div className="grid grid-cols-2 gap-4">
                  <DataField
                    label="Current Job Title"
                    value={application.currentJobTitle}
                  />
                  <DataField
                    label="Years of Experience"
                    value={application.yearsOfExperience}
                  />
                </div>
                <DataField
                  label="Main Industry"
                  value={application.mainIndustry}
                />
                <DataField
                  label="Professional Summary"
                  value={application.professionalSummary}
                />

                <SectionTitle icon={DollarSign}>Preferences</SectionTitle>
                <div className="grid grid-cols-2 gap-4">
                  <DataField
                    label="Availability"
                    value={application.availability}
                  />
                  <DataField
                    label="Salary Expectations"
                    value={application.salaryExpectations}
                  />
                </div>

                <SectionTitle icon={LinkIcon}>Attachments & Links</SectionTitle>

                <div className="mb-4">
                  <dt className="text-sm font-medium text-gray-500 mb-2">
                    Resume / CV
                  </dt>
                  {application.resume ? (
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-blue-500 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download {application.resumeFileName || "Resume"}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic text-sm">
                      No resume uploaded
                    </span>
                  )}
                </div>

                {application.linkedinProfile && (
                  <div className="mb-4">
                    <dt className="text-sm font-medium text-gray-500 mb-1">
                      LinkedIn Profile
                    </dt>
                    <a
                      href={application.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline break-all flex items-center gap-1"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {application.linkedinProfile}
                    </a>
                  </div>
                )}

                <DataField
                  label="Cover Letter"
                  value={application.coverLetterText}
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;
