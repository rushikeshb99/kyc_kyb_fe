import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import applicationService from "../../services/applicationService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { APPLICATION_TYPES } from "../../utils/constants";

const CreateApplication = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applicationTypes = [
    {
      type: APPLICATION_TYPES.INDIVIDUAL,
      title: "Individual KYC",
      description: "Personal identity verification for individual customers",
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      features: [
        "Personal information verification",
        "Document upload (Passport, ID, etc.)",
        "Address verification",
        "Financial information",
      ],
    },
    {
      type: APPLICATION_TYPES.BUSINESS,
      title: "Business KYB",
      description: "Business entity verification for corporate customers",
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      features: [
        "Company registration details",
        "Beneficial ownership information",
        "Business documents verification",
        "Authorized representatives",
      ],
    },
  ];

  const handleCreateApplication = async (type) => {
    try {
      setLoading(true);
      setError(null);

      const data = await applicationService.createApplication({
        user_id: user.id,
        application_type: type,
      });

      // Navigate to the application detail page
      navigate(`/applications/${data.application.id}`);
    } catch (err) {
      setError(err.error || "Failed to create application");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create New Application
        </h1>
        <p className="mt-2 text-gray-600">
          Choose the type of verification you need
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {applicationTypes.map((appType) => (
          <Card
            key={appType.type}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedType === appType.type ? "ring-2 ring-cerulean-400" : ""
            }`}
            onClick={() => setSelectedType(appType.type)}
          >
            <div className="text-center">
              <div className="flex justify-center text-cerulean-500 mb-4">
                {appType.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {appType.title}
              </h3>
              <p className="text-gray-600 mb-6">{appType.description}</p>

              <div className="text-left space-y-2 mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Includes:
                </p>
                {appType.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateApplication(appType.type);
                }}
                variant={selectedType === appType.type ? "primary" : "outline"}
                className="w-full"
                loading={loading && selectedType === appType.type}
                disabled={loading}
              >
                {selectedType === appType.type
                  ? "Create Application"
                  : "Select"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Box */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <svg
            className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              What happens next?
            </h4>
            <p className="text-sm text-blue-800">
              After creating your application, you'll be guided through the
              process of filling in your information and uploading required
              documents. You can save your progress at any time and complete it
              later.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CreateApplication;
