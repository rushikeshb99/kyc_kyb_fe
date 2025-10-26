import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import applicationService from "../../services/applicationService";
import documentService from "../../services/documentService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { STATUS_COLORS, APPLICATION_STATUS } from "../../utils/constants";

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApplicationData();
  }, [id]);

  const fetchApplicationData = async () => {
    try {
      setLoading(true);
      const [appData, docsData] = await Promise.all([
        applicationService.getCompleteApplication(id),
        documentService.getApplicationDocuments(id),
      ]);
      setApplication(appData.application);
      setDocuments(docsData.documents || []);
    } catch (err) {
      setError("Failed to load application details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await applicationService.submitApplication(id);
      await fetchApplicationData();
      alert("Application submitted successfully!");
    } catch (err) {
      setError(err.error || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert type="error" message="Application not found" />
        <Button onClick={() => navigate("/applications")} className="mt-4">
          Back to Applications
        </Button>
      </div>
    );
  }

  const canSubmit = application.status === APPLICATION_STATUS.DRAFT;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Application Details
            </h1>
            <p className="mt-2 text-gray-600">
              Application ID: {application.id}
            </p>
          </div>
          <span
            className={`px-4 py-2 text-sm font-semibold rounded-full ${
              STATUS_COLORS[application.status]
            }`}
          >
            {application.status.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* Application Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card title="Application Information">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium capitalize">
                {application.application_type}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium capitalize">
                {application.status.replace("_", " ")}
              </p>
            </div>
            {application.risk_level && (
              <div>
                <p className="text-sm text-gray-600">Risk Level</p>
                <p className="font-medium capitalize">
                  {application.risk_level}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="font-medium">
                {new Date(application.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-medium">
                {new Date(application.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Progress">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Completion</span>
                <span className="font-medium">
                  {application.completion_percentage || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${application.completion_percentage || 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-600 mb-2">Next Steps:</p>
              <ul className="space-y-1 text-sm">
                {application.status === APPLICATION_STATUS.DRAFT && (
                  <>
                    <li className="flex items-center text-gray-700">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <circle cx="10" cy="10" r="3" />
                      </svg>
                      Complete profile information
                    </li>
                    <li className="flex items-center text-gray-700">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <circle cx="10" cy="10" r="3" />
                      </svg>
                      Upload required documents
                    </li>
                    <li className="flex items-center text-gray-700">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <circle cx="10" cy="10" r="3" />
                      </svg>
                      Submit for review
                    </li>
                  </>
                )}
                {application.status === APPLICATION_STATUS.SUBMITTED && (
                  <li className="flex items-center text-blue-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <circle cx="10" cy="10" r="3" />
                    </svg>
                    Waiting for admin review
                  </li>
                )}
                {application.status === APPLICATION_STATUS.UNDER_REVIEW && (
                  <li className="flex items-center text-yellow-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <circle cx="10" cy="10" r="3" />
                    </svg>
                    Under review by admin
                  </li>
                )}
                {application.status === APPLICATION_STATUS.APPROVED && (
                  <li className="flex items-center text-green-600">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Application approved
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Documents */}
      <Card title="Documents" className="mb-6">
        {documents.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No documents uploaded yet
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">
                      {doc.original_filename}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {doc.document_type.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    doc.status === "verified"
                      ? "bg-green-100 text-green-800"
                      : doc.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {doc.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button onClick={() => navigate("/applications")} variant="secondary">
          Back to Applications
        </Button>

        {canSubmit && (
          <Button
            onClick={handleSubmitApplication}
            variant="primary"
            loading={submitting}
            disabled={submitting}
          >
            Submit Application
          </Button>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;
