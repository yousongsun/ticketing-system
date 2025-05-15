import type React from 'react';
import { useState } from 'react';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

const initialFormState: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

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
      className="max-w-xl mx-auto p-8 bg-transparent rounded-xl space-y-8 text-white"
    >
      <div className="flex gap-6">
        {/* First Name */}
        <div className="flex-1">
          <input
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={handleChange}
            className="w-full p-3 border border-white rounded bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="First name"
          />
          {errors.firstName && (
            <p className="text-yellow-400 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="flex-1">
          <input
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={handleChange}
            className="w-full p-3 border border-white rounded bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Last name"
          />
          {errors.lastName && (
            <p className="text-yellow-400 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          className="w-full p-3 border border-white rounded bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Email"
        />
        {errors.email && (
          <p className="text-yellow-400 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={handleChange}
          className="w-full p-3 border border-white rounded bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Phone"
        />
        {errors.phone && (
          <p className="text-yellow-400 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 rounded bg-yellow-500 text-black font-bold hover:bg-yellow-600 transition"
      >
        Submit
      </button>

      {/* Success Message */}
      {submitted && (
        <p className="text-green-500 mt-4 font-semibold">
          Form submitted successfully!
        </p>
      )}
    </form>
  );
};
