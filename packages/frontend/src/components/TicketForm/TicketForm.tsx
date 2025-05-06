import type React from 'react';
import { useState } from 'react';

// Define structure for form data
type FormData = {
  name: string;
  email: string;
  tickets: string;
  priority: string;
  addons: {
    addon1: boolean;
    addon2: boolean;
  };
  acceptedTerms: boolean;
};

// Initial form fields state
const initialFormState: FormData = {
  name: '',
  email: '',
  tickets: '1',
  priority: 'standard',
  addons: { addon1: false, addon2: false },
  acceptedTerms: false,
};

// State hooks
const TicketForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [submitted, setSubmitted] = useState(false);

  // Validate form data
  const validateForm = (data: FormData) => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!data.name) newErrors.name = 'Name is required';
    if (!data.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = 'Invalid email format';
    const ticketNumber = Number(data.tickets);
    if (ticketNumber < 1 || Number.isNaN(ticketNumber)) {
      newErrors.tickets = 'At least 1 ticket required';
    }
    if (!data.acceptedTerms)
      newErrors.acceptedTerms = 'You must accept the terms';
    return newErrors;
  };

  // Handle input changes of all fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, checked } = e.target as HTMLInputElement;
    if (name === 'addon1' || name === 'addon2') {
      setFormData((prev) => ({
        ...prev,
        addons: { ...prev.addons, [name]: checked },
      }));
    } else if (name === 'acceptedTerms') {
      setFormData((prev) => ({ ...prev, acceptedTerms: checked }));
    } else if (name === 'tickets') {
      setFormData((prev) => ({ ...prev, tickets: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    // Show validation error if exist
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
    } else {
      // Clear errors and mark as submitted
      setErrors({});
      setSubmitted(true);
      console.log('Form submitted:', formData);
      setFormData(initialFormState); // reset form
    }
  };

  const { name, email, tickets, priority, addons, acceptedTerms } = formData;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold">Purchase Ticket</h2>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* Number of Tickets Field */}
      <div>
        <label htmlFor="tickets" className="block font-medium">
          Number of Tickets
        </label>
        <input
          id="tickets"
          type="number"
          name="tickets"
          min={1}
          value={tickets}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.tickets && (
          <p className="text-red-500 text-sm">{errors.tickets}</p>
        )}
      </div>

      {/* Priority Field */}
      <div>
        <label htmlFor="priority" className="block font-medium">
          Ticket Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={priority}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="standard">Standard</option>{' '}
          {/* Student, Adult, Child, VIP */}
          <option value="vip">VIP</option>
        </select>
      </div>

      {/* Add-ons */}
      <div>
        <label htmlFor="addon1" className="block font-medium">
          Add-ons
        </label>{' '}
        {/* Associated label */}
        <div className="flex gap-4 mt-1">
          <label htmlFor="addon1" className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="addon1"
              name="addon1"
              checked={addons.addon1}
              onChange={handleChange}
            />
            <span>Addon1</span>
          </label>
          <label htmlFor="addon2" className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="addon2"
              name="addon2"
              checked={addons.addon2}
              onChange={handleChange}
            />
            <span>Addon2</span>
          </label>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div>
        <label htmlFor="acceptedTerms" className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="acceptedTerms"
            name="acceptedTerms"
            checked={acceptedTerms}
            onChange={handleChange}
          />
          <span>I accept the terms and conditions</span>
        </label>
        {errors.acceptedTerms && (
          <p className="text-red-500 text-sm">{errors.acceptedTerms}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Purchase
      </button>

      {/* Success Message */}
      {submitted && (
        <p className="text-green-600 mt-2">Ticket purchase successful!</p>
      )}
    </form>
  );
};

export default TicketForm;
