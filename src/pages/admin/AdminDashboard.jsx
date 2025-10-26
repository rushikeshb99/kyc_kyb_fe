import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/adminService";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import Modal from "../../components/common/Modal";
import { STATUS_COLORS } from "../../utils/constants";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: "",
    review_notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, pendingData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getPendingApplications(),
      ]);
      setStats(statsData);
      setPendingApplications(pendingData.applications || []);
    } catch (err) {
      setError("Failed to load admin dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (app) => {
    setSelectedApp(app);
    setReviewModal(true);
    setReviewData({ status: "", review_notes: "" });
  };

  const handleReviewSubmit = async () => {
    if (!reviewData.status) {
      alert("Please select a review status");
      return;
    }

    try {
      setSubmitting(true);
      await adminService.reviewApplication(selectedApp.id, reviewData);
      setReviewModal(false);
      await fetchData();
      alert("Application reviewed successfully!");
    } catch (err) {
      setError(err.error || "Failed to review application");
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Review and manage applications</p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.total_applications || 0}
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending_review || 0}
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.approved || 0}
              </p>
            </div>
          </Card>
          <Card>
            <div>
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">
                {stats.rejected || 0}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Pending Applications */}
      <Card title="Pending Applications">
        {pendingApplications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No pending applications</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {app.application_type}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <Button
                        onClick={() => navigate(`/applications/${app.id}`)}
                        variant="outline"
                        size="sm"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => handleReviewClick(app)}
                        variant="primary"
                        size="sm"
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModal}
        onClose={() => setReviewModal(false)}
        title="Review Application"
        footer={
          <>
            <Button onClick={() => setReviewModal(false)} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleReviewSubmit}
              variant="primary"
              loading={submitting}
              disabled={submitting}
            >
              Submit Review
            </Button>
          </>
        }
      >
        {selectedApp && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Application ID
              </p>
              <p className="text-sm text-gray-600">{selectedApp.id}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decision <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="approved"
                    checked={reviewData.status === "approved"}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, status: e.target.value })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Approve</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="rejected"
                    checked={reviewData.status === "rejected"}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, status: e.target.value })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Reject</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Notes
              </label>
              <textarea
                rows={4}
                value={reviewData.review_notes}
                onChange={(e) =>
                  setReviewData({ ...reviewData, review_notes: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Add your review comments..."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
