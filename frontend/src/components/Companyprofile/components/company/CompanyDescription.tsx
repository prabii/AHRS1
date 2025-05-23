import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText } from "lucide-react";

interface CompanyDescriptionProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
  isEditing: boolean;
}

const CompanyDescription: React.FC<CompanyDescriptionProps> = ({
  formData,
  handleInputChange,
  isEditing,
}) => {
  const [companyDescription, setCompanyDescription] = useState(formData.companyProfile.description || "");
  const maxLength = 1500;
  const currentLength = companyDescription.length;
  const progress = (currentLength / maxLength) * 100;

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const username = JSON.parse(sessionStorage.getItem("user") || "{}")
          .username;
        if (!username) {
          console.error("No username found in session storage");
          return;
        }

        const response = await axios.post(
          "https://iu2p4xgbt4.execute-api.us-east-1.amazonaws.com/default/get_company_profile_details",
          { companyId: username }
        );

        if (response.data && response.data.companyProfile) {
          setCompanyDescription(response.data.companyProfile.description || "");
        }
      } catch (error) {
        console.error("Error fetching company profile details:", error);
      }
    };

    fetchCompanyDetails();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCompanyDescription(newValue);
    handleInputChange("companyProfile", "description", newValue);
  };

  const cardStyles =
    "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 hover:border-indigo-500/30";
  const textareaStyles =
    "w-full bg-black/30 border border-indigo-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder-gray-500 transition-all duration-300 hover:border-indigo-500/50";
  const previewTextStyles = "text-lg font-medium text-gray-100 whitespace-pre-wrap";

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        <FileText className="mr-2 h-5 w-5 md:h-6 md:w-6 text-indigo-500" />
        Company Description
      </h2>

      <div className={`${cardStyles} p-4`}>
        <label className="block text-sm font-medium mb-2 text-gray-200">
          Company Description (200-300 words) *
        </label>
        {isEditing ? (
          <>
            <textarea
              className={`${textareaStyles} h-48 resize-none`}
              value={companyDescription}
              onChange={handleChange}
              required
            ></textarea>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-32 h-1 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span>{currentLength}/{maxLength} characters</span>
              </div>
              {currentLength > maxLength && (
                <span className="text-red-500">Character limit exceeded</span>
              )}
            </div>
          </>
        ) : (
          <div className={previewTextStyles}>
            {companyDescription || "No description provided"}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDescription;
