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
  validateTaxId,
  validateURL,
  validatePercentage,
} from "../../utils/validators";

const BusinessForm = ({
  applicationId,
  onSaveComplete,
  onContinueToDocuments,
}) => {
  const [formData, setFormData] = useState({
    business_name: "",
    legal_business_name: "",
    business_registration_number: "",
    tax_identification_number: "",
    incorporation_date: "",
    business_type: "",
    industry_sector: "",
    business_email: "",
    business_phone: "",
    business_website: "",
    business_address_line1: "",
    business_address_line2: "",
    business_city: "",
    business_state_province: "",
    business_postal_code: "",
    business_country: "",
    number_of_employees: "",
    annual_revenue_range: "",
    is_publicly_traded: false,
    stock_symbol: "",
    beneficial_owners: [],
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
        setFormData({
          ...data.profile,
          beneficial_owners: data.profile.beneficial_owners || [],
        });
      }
    } catch (err) {
      console.log("No existing profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const addBeneficialOwner = () => {
    setFormData((prev) => ({
      ...prev,
      beneficial_owners: [
        ...prev.beneficial_owners,
        {
          id: Date.now(),
          first_name: "",
          last_name: "",
          date_of_birth: "",
          nationality: "",
          ownership_percentage: "",
          position_title: "",
          email: "",
        },
      ],
    }));
  };

  const removeBeneficialOwner = (id) => {
    setFormData((prev) => ({
      ...prev,
      beneficial_owners: prev.beneficial_owners.filter(
        (owner) => owner.id !== id
      ),
    }));
  };

  const updateBeneficialOwner = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      beneficial_owners: prev.beneficial_owners.map((owner) =>
        owner.id === id ? { ...owner, [field]: value } : owner
      ),
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Required fields
    const requiredFields = [
      "business_name",
      "legal_business_name",
      "business_registration_number",
      "tax_identification_number",
      "incorporation_date",
      "business_type",
      "industry_sector",
      "business_email",
      "business_phone",
      "business_address_line1",
      "business_city",
      "business_state_province",
      "business_postal_code",
      "business_country",
    ];

    requiredFields.forEach((field) => {
      const error = validateRequired(formData[field], field.replace(/_/g, " "));
      if (error) newErrors[field] = error;
    });

    // Email validation
    if (formData.business_email && !validateEmail(formData.business_email)) {
      newErrors.business_email = "Invalid email format";
    }

    // Phone validation
    const phoneError = validatePhoneNumber(formData.business_phone);
    if (phoneError) newErrors.business_phone = phoneError;

    // Tax ID validation
    const taxError = validateTaxId(formData.tax_identification_number);
    if (taxError) newErrors.tax_identification_number = taxError;

    // Website URL validation
    if (formData.business_website) {
      const urlError = validateURL(formData.business_website);
      if (urlError) newErrors.business_website = urlError;
    }

    // Validate beneficial owners
    formData.beneficial_owners.forEach((owner, index) => {
      if (owner.ownership_percentage) {
        const percentError = validatePercentage(owner.ownership_percentage);
        if (percentError) {
          newErrors[`owner_${index}_percentage`] = percentError;
        }
      }
    });

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

  const businessTypes = [
    { value: "sole_proprietorship", label: "Sole Proprietorship" },
    { value: "partnership", label: "Partnership" },
    { value: "llc", label: "Limited Liability Company (LLC)" },
    { value: "corporation", label: "Corporation" },
    { value: "non_profit", label: "Non-Profit" },
  ];

  const revenueRanges = [
    { value: "under_100k", label: "Under $100,000" },
    { value: "100k_500k", label: "$100,000 - $500,000" },
    { value: "500k_1m", label: "$500,000 - $1,000,000" },
    { value: "1m_5m", label: "$1,000,000 - $5,000,000" },
    { value: "over_5m", label: "Over $5,000,000" },
  ];

  const countries = [
    { value: "US", label: "United States" },
    { value: "UK", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "IN", label: "India" },
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

      {/* Business Information */}
      <Card title="Business Information" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Business Name"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            error={errors.business_name}
            required
          />
          <Input
            label="Legal Business Name"
            name="legal_business_name"
            value={formData.legal_business_name}
            onChange={handleChange}
            error={errors.legal_business_name}
            required
          />
          <Input
            label="Business Registration Number"
            name="business_registration_number"
            value={formData.business_registration_number}
            onChange={handleChange}
            error={errors.business_registration_number}
            required
          />
          <Input
            label="Tax Identification Number"
            name="tax_identification_number"
            value={formData.tax_identification_number}
            onChange={handleChange}
            error={errors.tax_identification_number}
            required
          />
          <Input
            label="Incorporation Date"
            name="incorporation_date"
            type="date"
            value={formData.incorporation_date}
            onChange={handleChange}
            error={errors.incorporation_date}
            required
          />
          <Select
            label="Business Type"
            name="business_type"
            value={formData.business_type}
            onChange={handleChange}
            options={businessTypes}
            error={errors.business_type}
            required
          />
          <Input
            label="Industry Sector"
            name="industry_sector"
            value={formData.industry_sector}
            onChange={handleChange}
            error={errors.industry_sector}
            required
          />
        </div>
      </Card>

      {/* Contact Information */}
      <Card title="Business Contact Information" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Business Email"
            name="business_email"
            type="email"
            value={formData.business_email}
            onChange={handleChange}
            error={errors.business_email}
            required
          />
          <Input
            label="Business Phone"
            name="business_phone"
            type="tel"
            value={formData.business_phone}
            onChange={handleChange}
            error={errors.business_phone}
            required
          />
          <Input
            label="Business Website"
            name="business_website"
            type="url"
            value={formData.business_website}
            onChange={handleChange}
            error={errors.business_website}
            placeholder="https://example.com"
          />
        </div>
      </Card>

      {/* Business Address */}
      <Card title="Business Address" className="mb-6">
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Address Line 1"
            name="business_address_line1"
            value={formData.business_address_line1}
            onChange={handleChange}
            error={errors.business_address_line1}
            required
          />
          <Input
            label="Address Line 2"
            name="business_address_line2"
            value={formData.business_address_line2}
            onChange={handleChange}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              name="business_city"
              value={formData.business_city}
              onChange={handleChange}
              error={errors.business_city}
              required
            />
            <Input
              label="State/Province"
              name="business_state_province"
              value={formData.business_state_province}
              onChange={handleChange}
              error={errors.business_state_province}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Postal Code"
              name="business_postal_code"
              value={formData.business_postal_code}
              onChange={handleChange}
              error={errors.business_postal_code}
              required
            />
            <Select
              label="Country"
              name="business_country"
              value={formData.business_country}
              onChange={handleChange}
              options={countries}
              error={errors.business_country}
              required
            />
          </div>
        </div>
      </Card>

      {/* Financial Information */}
      <Card title="Financial Information" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Number of Employees"
            name="number_of_employees"
            type="number"
            value={formData.number_of_employees}
            onChange={handleChange}
          />
          <Select
            label="Annual Revenue Range"
            name="annual_revenue_range"
            value={formData.annual_revenue_range}
            onChange={handleChange}
            options={revenueRanges}
          />
          <div className="col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_publicly_traded"
                checked={formData.is_publicly_traded}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                Publicly Traded Company
              </span>
            </label>
          </div>
          {formData.is_publicly_traded && (
            <Input
              label="Stock Symbol"
              name="stock_symbol"
              value={formData.stock_symbol}
              onChange={handleChange}
            />
          )}
        </div>
      </Card>

      {/* Beneficial Owners */}
      <Card title="Beneficial Owners" className="mb-6">
        <p className="text-sm text-gray-600 mb-4">
          List all individuals who own 25% or more of the business
        </p>

        {formData.beneficial_owners.map((owner, index) => (
          <div
            key={owner.id}
            className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-900">Owner #{index + 1}</h4>
              <button
                type="button"
                onClick={() => removeBeneficialOwner(owner.id)}
                className="text-red-600 hover:text-red-800"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={owner.first_name}
                onChange={(e) =>
                  updateBeneficialOwner(owner.id, "first_name", e.target.value)
                }
                required
              />
              <Input
                label="Last Name"
                value={owner.last_name}
                onChange={(e) =>
                  updateBeneficialOwner(owner.id, "last_name", e.target.value)
                }
                required
              />
              <Input
                label="Date of Birth"
                type="date"
                value={owner.date_of_birth}
                onChange={(e) =>
                  updateBeneficialOwner(
                    owner.id,
                    "date_of_birth",
                    e.target.value
                  )
                }
                required
              />
              <Input
                label="Nationality"
                value={owner.nationality}
                onChange={(e) =>
                  updateBeneficialOwner(owner.id, "nationality", e.target.value)
                }
                required
              />
              <Input
                label="Ownership Percentage"
                type="number"
                value={owner.ownership_percentage}
                onChange={(e) =>
                  updateBeneficialOwner(
                    owner.id,
                    "ownership_percentage",
                    e.target.value
                  )
                }
                error={errors[`owner_${index}_percentage`]}
                placeholder="25"
                required
              />
              <Input
                label="Position/Title"
                value={owner.position_title}
                onChange={(e) =>
                  updateBeneficialOwner(
                    owner.id,
                    "position_title",
                    e.target.value
                  )
                }
              />
              <Input
                label="Email"
                type="email"
                value={owner.email}
                onChange={(e) =>
                  updateBeneficialOwner(owner.id, "email", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <Button type="button" onClick={addBeneficialOwner} variant="outline">
          + Add Beneficial Owner
        </Button>
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

export default BusinessForm;
