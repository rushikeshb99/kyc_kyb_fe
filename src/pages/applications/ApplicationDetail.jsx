import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import applicationService from "../../services/applicationService";
import documentService from "../../services/documentService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import IndividualForm from "../../components/forms/IndividualForm";
import BusinessForm from "../../components/forms/BusinessForm";
import FileUpload from "../../components/common/FileUpload";
import Select from "../../components/common/Select";
import { FiUser, FiFileText, FiLayers } from "react-icons/fi";
import {
  STATUS_COLORS,
  APPLICATION_STATUS,
  APPLICATION_TYPES,
} from "../../utils/constants";

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleDocumentUpload = async () => {
    if (!selectedFile || !documentType) {
      setError("Please select a document type and file");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("document_type", documentType);

      await documentService.uploadDocument(id, formData);

      setSelectedFile(null);
      setDocumentType("");
      await fetchApplicationData();

      setError(null);
    } catch (err) {
      setError(err.error || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const documentTypes = [
    { value: "passport", label: "Passport" },
    { value: "national_id", label: "National ID" },
    { value: "driver_license", label: "Driver's License" },
    { value: "birth_certificate", label: "Birth Certificate" },
    { value: "proof_of_address", label: "Proof of Address" },
    { value: "bank_statement", label: "Bank Statement" },
    { value: "tax_document", label: "Tax Document" },
    { value: "incorporation_certificate", label: "Incorporation Certificate" },
    { value: "business_license", label: "Business License" },
  ];

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      await documentService.deleteDocument(documentId);
      await fetchApplicationData();
      setError(null);
    } catch (err) {
      setError(err.error || "Failed to delete document");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cerulean-500"></div>
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
        <Card title="Application Information" icon={<FiLayers />}>
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

        <Card title="Progress" icon={<FiLayers />}>
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
                  className="bg-cerulean-500 h-2 rounded-full transition-all"
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

      {/* Tabs */}
      {canSubmit && (
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-cerulean-500 text-cerulean-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="inline-flex items-center gap-2"><FiUser /> Profile Information</span>
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "documents"
                  ? "border-cerulean-500 text-cerulean-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="inline-flex items-center gap-2"><FiFileText /> Documents</span>
            </button>
          </nav>
        </div>
      )}

      {/* Profile Form */}
      {activeTab === "profile" && canSubmit && (
        <div className="mb-6">
          {application.application_type === APPLICATION_TYPES.INDIVIDUAL ? (
            <IndividualForm
              applicationId={id}
              onSaveComplete={() => {
                fetchApplicationData();
              }}
              onContinueToDocuments={() => setActiveTab("documents")}
            />
          ) : (
            <BusinessForm
              applicationId={id}
              onSaveComplete={() => {
                fetchApplicationData();
              }}
              onContinueToDocuments={() => setActiveTab("documents")}
            />
          )}
        </div>
      )}

      {/* Documents */}
      {(activeTab === "documents" || !canSubmit) && (
        <Card title="Documents" icon={<FiFileText />} className="mb-6">
          {canSubmit && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Upload Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Document Type"
                  name="documentType"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  options={documentTypes}
                  placeholder="Select document type"
                  required
                />
                <FileUpload
                  label="Select Document"
                  onFileSelect={handleFileSelect}
                  maxSize={16}
                  required
                />
              </div>
              <Button
                type="button"
                onClick={handleDocumentUpload}
                variant="primary"
                loading={uploading}
                disabled={uploading || !selectedFile || !documentType}
                className="mt-4"
              >
                Upload Document
              </Button>
            </div>
          )}

          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Uploaded Documents
          </h3>
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
                  <div className="flex items-center space-x-3">
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
                    {canSubmit && (
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                        title="Delete document"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

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
