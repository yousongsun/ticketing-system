import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TicketForm } from '../components/TicketForm';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type FormDataWithId = FormData & { id: string };

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

const initialFormState: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

const initialFormStateWithId = (id: string): FormDataWithId => ({
  ...initialFormState,
  id,
});

const UserDetail: React.FC = () => {
  const navigate = useNavigate();
  const [numberOfSeats] = useState(2); // number of seats
  const [formStates, setFormStates] = useState<FormDataWithId[]>(
    Array.from({ length: numberOfSeats }, (_, i) =>
      initialFormStateWithId(`ticket-${Date.now()}-${i}`),
    ),
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData, string>>[]
  >([]);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { name, value } = e.target;
    setFormStates((prev) =>
      prev.map((form, i) => (i === index ? { ...form, [name]: value } : form)),
    );
  };

  const handleSubmitAll = (e: React.FormEvent) => {
    e.preventDefault();
    const validationResults = formStates.map(validateForm);
    setErrors(validationResults);

    const hasErrors = validationResults.some(
      (res) => Object.keys(res).length > 0,
    );
    if (!hasErrors) {
      console.log('All forms submitted:', formStates);
      setSubmitted(true);
      const payload = {
        lineItems: [
          {
            name: 'Row A Seat 18',
            price: 60.0,
            quantity: 1,
          },
          {
            name: 'Row C Seat 6',
            price: 60.0,
            quantity: 1,
          },
          {
            name: 'VIP Row A Seat 12',
            price: 120.0,
            quantity: 1,
          },
        ],
        successUrl: 'http://localhost:5173/success',
        cancelUrl: 'http://localhost:5173/cancel',
      };

      axios
        .post(`${API_BASE_URL}/api/v1/stripe/checkout-session`, payload)
        .then(async (response) => {
          const { sessionId } = response.data;

          const stripe = await loadStripe(
            import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
          );

          if (stripe) {
            const { error } = await stripe.redirectToCheckout({ sessionId });
            if (error) {
              console.error('Stripe checkout error:', error);
              setSubmitted(false);
            }
          } else {
            console.error('Stripe.js failed to load');
            setSubmitted(false);
          }
        })
        .catch((error) => {
          console.error('Error submitting form:', error);
          setSubmitted(false);
        });
    } else {
      setSubmitted(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmitAll}
      className="min-h-screen bg-[#070507] flex flex-col items-center justify-center p-8 relative overflow-hidden"
    >
      <div className="max-w-6xl w-full p-2 relative z-10">
        <div className="flex justify-between items-end px-10 mb-40">
          <h1 className="text-[#FFFBE8] font-bold leading-none">
            Enter your contact details
          </h1>

          <div className="w-[40%] bg-[#070507] rounded-xl p-4 flex flex-col gap-y-2 justify-end">
            <div className="flex flex-col items-end justify-end">
              <h2 className="text-[#FFF0A2] text-lg tracking-wide text-right mb-1">
                14 Aug, 7:30pm - 16 Aug, 10:30 pm
              </h2>
              <h1 className="text-[#E5CE63] font-black text-2xl tracking-widest text-right leading-none">
                BACK TO THE SUTURE
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10">
          {formStates.map((data, i) => (
            <div key={data.id}>
              <h2 className="text-[#FFFBE8] font-semibold text-2xl mb-4">
                Ticket {i + 1}
              </h2>
              <TicketForm
                data={data}
                errors={errors[i] || {}}
                onChange={handleInputChange}
                index={i}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 px-10">
          <button
            type="submit"
            className="w-full py-3 rounded font-bold transition bg-[#E5CE63] text-black hover:bg-[#FFF0A2]"
          >
            Submit
          </button>
          {submitted && (
            <p className="text-green-500 mt-4 font-semibold">
              All forms submitted successfully!
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default UserDetail;
