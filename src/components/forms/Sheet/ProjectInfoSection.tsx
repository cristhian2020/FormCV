import type { ProjectInfo } from "./types";

interface Props {
  projectInfo: ProjectInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const inputClass =
  "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";

export default function ProjectInfoSection({ projectInfo, onChange }: Props) {
  return (
    <section className="border-b pb-4">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
        Project Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">INVOICE</label>
          <input
            type="text"
            name="invoice"
            value={projectInfo.invoice}
            onChange={onChange}
            placeholder="Ej: 17"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">PROJECT #</label>
          <input
            type="text"
            name="projectNumber"
            value={projectInfo.projectNumber}
            onChange={onChange}
            placeholder="Ej: IAD 45"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">LOCATION</label>
          <input
            type="text"
            name="location"
            value={projectInfo.location}
            onChange={onChange}
            placeholder="Ej: 43714 Efficiently Drive, Dulles VA 20166"
            className={inputClass}
          />
        </div>
      </div>
    </section>
  );
}
