import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

interface UploadResult {
  url: string;
  path: string;
  fileName: string;
}

class ApplicationService {
  private collectionName: string;

  constructor() {
    this.collectionName = "applications";
  }

  validateStep(data: Record<string, any>, step: number): ValidationResult {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!data.fullName?.trim()) errors.fullName = "Full name is required";
        if (!data.email?.trim()) errors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          errors.email = "Invalid email format";
        }
        if (!data.phoneNumber?.trim())
          errors.phoneNumber = "Phone number is required";
        break;

      case 2:
        if (!data.yearsOfExperience)
          errors.yearsOfExperience = "Years of experience is required";
        break;

      case 4:
        if (!data.desiredPosition?.trim())
          errors.desiredPosition = "Desired position is required";
        if (!data.workArrangement)
          errors.workArrangement = "Work arrangement is required";
        if (!data.availability)
          errors.availability = "Availability is required";
        break;

      case 5:
        if (!data.consentToDataProcessing) {
          errors.consentToDataProcessing = "You must agree to data processing";
        }
        break;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  async uploadFile(file: File, folder: string): Promise<UploadResult> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const fullPath = `applications/${folder}/${fileName}`;
      const storageRef = ref(storage, fullPath);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return {
        url: downloadURL,
        path: fullPath,
        fileName: file.name,
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file");
    }
  }

  async saveApplication(
    formData: Record<string, any>,
    files: Record<string, File> = {},
  ) {
    try {
      let resumeData: UploadResult | null = null;

      if (files.resume) {
        resumeData = await this.uploadFile(files.resume, "resumes");
      }

      const applicationData: Record<string, any> = {
        ...formData,
        resume: resumeData?.url || null,
        resumeFileName: resumeData?.fileName || null,
        submittedAt: serverTimestamp(),
        status: "pending",
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      };
      const docRef = await addDoc(
        collection(db, this.collectionName),
        applicationData,
      );

      return {
        id: docRef.id,
        ...applicationData,
      };
    } catch (error) {
      console.error("Error saving application:", error);
      throw new Error("Failed to submit application");
    }
  }

  async getApplications() {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy("submittedAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const applications: Record<string, any>[] = [];

      querySnapshot.forEach((doc) => {
        applications.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return applications;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw new Error("Failed to fetch applications");
    }
  }

  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }
  validateFileSize(file: File, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }
}

export default new ApplicationService();
