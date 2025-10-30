import React, { useState, useEffect } from "react";
import profileService from "../../services/profileService";
import Card from "../common/Card";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import Alert from "../common/Alert";
import {
  validateRequired,
  validateEmail,
  validatePhoneNumber,
  validateDateOfBirth,
  validatePostalCode,
} from "../../utils/validators";

const IndividualForm = ({
  applicationId,
  onSaveComplete,
  onContinueToDocuments,
}) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    nationality: "",
    email: "",
    phone_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state_province: "",
    postal_code: "",
    country: "",
    occupation: "",
    employer: "",
    annual_income_range: "",
    passport_number: "",
    national_id_number: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [applicationId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile(applicationId);
      if (data.profile) {
        setFormData(data.profile);
      }
    } catch (err) {
      // Profile doesn't exist yet, that's okay
      console.log("No existing profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "date_of_birth",
      "nationality",
      "email",
      "phone_number",
      "address_line1",
      "city",
      "state_province",
      "postal_code",
      "country",
      "occupation",
    ];

    requiredFields.forEach((field) => {
      const error = validateRequired(formData[field], field.replace(/_/g, " "));
      if (error) newErrors[field] = error;
    });

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone validation
    const phoneError = validatePhoneNumber(formData.phone_number);
    if (phoneError) newErrors.phone_number = phoneError;

    // Date of birth validation
    const dobError = validateDateOfBirth(formData.date_of_birth);
    if (dobError) newErrors.date_of_birth = dobError;

    // Postal code validation
    const postalError = validatePostalCode(formData.postal_code);
    if (postalError) newErrors.postal_code = postalError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setAlert({
        type: "error",
        message: "Please fix the errors before saving",
      });
      return;
    }

    try {
      setSaving(true);
      setAlert(null);

      await profileService.saveProfile(applicationId, formData);

      setAlert({ type: "success", message: "Profile saved successfully!" });

      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (err) {
      setAlert({
        type: "error",
        message: err.error || "Failed to save profile",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cerulean-500"></div>
      </div>
    );
  }

  const incomeRanges = [
    { value: "under_25k", label: "Under $25,000" },
    { value: "25k_50k", label: "$25,000 - $50,000" },
    { value: "50k_100k", label: "$50,000 - $100,000" },
    { value: "100k_250k", label: "$100,000 - $250,000" },
    { value: "over_250k", label: "Over $250,000" },
  ];

  const countries = [
    { value: "US", label: "United States" },
    { value: "UK", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "IN", label: "India" },
    // Add more countries as needed
  ];

  return (
    <form onSubmit={handleSubmit}>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-6"
        />
      )}

      {/* Personal Information */}
      <Card title="Personal Information" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
            required
          />
          <Input
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            error={errors.last_name}
            required
          />
          <Input
            label="Date of Birth"
            name="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleChange}
            error={errors.date_of_birth}
            required
          />
          <Input
            label="Nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            error={errors.nationality}
            required
          />
        </div>
      </Card>

      {/* Contact Information */}
      <Card title="Contact Information" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Input
            label="Phone Number"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
            error={errors.phone_number}
            required
          />
        </div>
      </Card>

      {/* Address Information */}
      <Card title="Address Information" className="mb-6">
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Address Line 1"
            name="address_line1"
            value={formData.address_line1}
            onChange={handleChange}
            error={errors.address_line1}
            required
          />
          <Input
            label="Address Line 2"
            name="address_line2"
            value={formData.address_line2}
            onChange={handleChange}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              required
            />
            <Input
              label="State/Province"
              name="state_province"
              value={formData.state_province}
              onChange={handleChange}
              error={errors.state_province}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Postal Code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              error={errors.postal_code}
              required
            />
            <Select
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              options={countries}
              error={errors.country}
              required
            />
          </div>
        </div>
      </Card>

      {/* Employment Information */}
      <Card title="Employment Information" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            error={errors.occupation}
            required
          />
          <Input
            label="Employer"
            name="employer"
            value={formData.employer}
            onChange={handleChange}
          />
          <Select
            label="Annual Income Range"
            name="annual_income_range"
            value={formData.annual_income_range}
            onChange={handleChange}
            options={incomeRanges}
          />
        </div>
      </Card>

      {/* Identification */}
      <Card title="Identification" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Passport Number"
            name="passport_number"
            value={formData.passport_number}
            onChange={handleChange}
          />
          <Input
            label="National ID Number"
            name="national_id_number"
            value={formData.national_id_number}
            onChange={handleChange}
          />
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        {onContinueToDocuments && (
          <Button
            type="button"
            variant="outline"
            onClick={onContinueToDocuments}
          >
            Continue to Documents
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={saving}
          disabled={saving}
        >
          Save Profile
        </Button>
      </div>
    </form>
  );
};

export default IndividualForm;
