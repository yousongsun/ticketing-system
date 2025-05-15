import type React from 'react';
import { useState } from 'react';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

// Initial form fields state
const initialFormState: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

// State hooks
export const TicketForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (data: FormData) => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!data.firstName) newErrors.firstName = 'First name is required';
    if (!data.lastName) newErrors.lastName = 'Last name is required';
    if (!data.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = 'Invalid email format';
    if (!data.phone) newErrors.phone = 'Phone number is required';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
    } else {
      setErrors({});
      setSubmitted(true);
      console.log('Form submitted:', formData);
      setFormData(initialFormState);
    }
  };

  const { firstName, lastName, email, phone } = formData;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold">Contact Details</h2>

      {/* First Name */}
      <div>
        <label htmlFor="firstName" className="block font-medium">
          First Name
        </label>
        <input
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="lastName" className="block font-medium">
          Last Name
        </label>
        <input
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm">{errors.lastName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block font-medium">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>

      {/* Success Message */}
      {submitted && (
        <p className="text-green-600 mt-2">Form submitted successfully!</p>
      )}
    </form>
  );
};
