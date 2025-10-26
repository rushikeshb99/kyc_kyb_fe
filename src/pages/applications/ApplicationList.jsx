import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import applicationService from "../../services/applicationService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { APPLICATION_STATUS, STATUS_COLORS } from "../../utils/constants";

const ApplicationList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await applicationService.getUserApplications(user.id);
      setApplications(data.applications || []);
    } catch (err) {
      setError("Failed to load applications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const filters = [
    { value: "all", label: "All" },
    { value: APPLICATION_STATUS.DRAFT, label: "Draft" },
    { value: APPLICATION_STATUS.SUBMITTED, label: "Submitted" },
    { value: APPLICATION_STATUS.UNDER_REVIEW, label: "Under Review" },
    { value: APPLICATION_STATUS.APPROVED, label: "Approved" },
    { value: APPLICATION_STATUS.REJECTED, label: "Rejected" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cerulean-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="mt-2 text-gray-600">Manage your KYC/KYB applications</p>
        </div>
        <Button onClick={() => navigate("/applications/new")} variant="primary">
          New Application
        </Button>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-cerulean-500 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <Card>
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No applications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new application.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => navigate("/applications/new")}
                variant="primary"
              >
                New Application
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-sm font-medium text-gray-900">
                        {app.application_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          STATUS_COLORS[app.status]
                        }`}
                      >
                        {app.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.risk_level ? (
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            app.risk_level === "low"
                              ? "bg-green-100 text-green-800"
                              : app.risk_level === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {app.risk_level.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Button
                        onClick={() => navigate(`/applications/${app.id}`)}
                        variant="outline"
                        size="sm"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ApplicationList;
