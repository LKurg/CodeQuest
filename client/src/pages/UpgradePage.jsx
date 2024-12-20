import React, { useState } from 'react';
import { Phone, Infinity, Gem, Bolt, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpgradePage = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');

  const getStatusMessage = (statusCode) => {
    const statusMessages = {
      '0': 'Payment successful', // Changed to be more concise
      '1': 'Insufficient balance in your M-Pesa account',
      '1032': 'Transaction cancelled by user ',
      '1037': 'Transaction timed out. Please try again',
      '2001': 'Invalid payment credentials',
      '2006': 'Payment service error. Please try again',
      default: 'An error occurred during payment. Please try again.'
    };
    return statusMessages[statusCode] || statusMessages.default;
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(value);
    setError('');
    setSuccess(false);
    setPaymentStatus('');
  };

  const sanitizePhoneNumber = (number) => {
    if (number.startsWith('07')) {
      return '254' + number.slice(1);
    }
    if (number.startsWith('01')) {
      return '254' + number.slice(1);
    }
    return number;
  };

  const checkPaymentStatus = async (checkoutRequestId) => {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals

    const pollStatus = async () => {
      try {
        if (attempts >= maxAttempts) {
          setIsProcessing(false);
          setError('Payment timeout. Please try again.');
          return;
        }


        const token = localStorage.getItem('token');

        // Include the Authorization header with the Bearer token
        const response = await axios.get(
          `http://localhost:5000/api/paymentStatus/${checkoutRequestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}` // Pass the token in the Authorization header
            }
          }
        );

        const data = response.data;
        //console.log(`Attempt ${attempts + 1}: Status code - ${data.statusCode}`);

        // If status code is undefined, continue polling
        if (data.statusCode === undefined) {
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 5000));
          return pollStatus();
        }

        setIsProcessing(false);

        // Success case - status code 0
        if (data.statusCode === "1032") {
          setSuccess(true);
          setError('');
          setPaymentStatus(getStatusMessage(data.statusCode));
          
          // Navigate to success page after a short delay
          setTimeout(() => {
            navigate('/subscription/success', {
              state: {
                transactionId: data.mpesaReceiptNumber,
                amount: data.amount,
                date: data.transactionDate,
              },
            });
          }, 2000);
          return;
        }

        // Handle all error cases
        setSuccess(false);
        setPaymentStatus('');
        setError(getStatusMessage(data.statusCode));

      } catch (error) {
        console.error('Error checking payment status:', error);
        setIsProcessing(false);
        setSuccess(false);
        setPaymentStatus('');
        setError('Error checking payment status. Please try again.');
      }
    };

    return pollStatus();
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    const sanitizedPhoneNumber = sanitizePhoneNumber(phoneNumber);

    setIsProcessing(true);
    setError('');
    setSuccess(false);
    setPaymentStatus('');

    try {
      const response = await axios.post('http://localhost:5000/api/stkPush', {
        phoneNumber: sanitizedPhoneNumber,
        amount: 200,
      });

      if (response.data && response.data.ResponseCode === '0') {
        setPaymentStatus('Payment request sent. Please check your phone...');
        // Start polling for payment status
        checkPaymentStatus(response.data.CheckoutRequestID);
      } else {
        setIsProcessing(false);
        setError(getStatusMessage(response.data?.ResponseCode) || 'Unable to process payment request. Please try again.');
      }
    } catch (error) {
      setIsProcessing(false);
      if (error.response) {
        setError('Server error. Please try again.');
      } else if (error.request) {
        setError('No response from server. Please check your connection and try again.');
      } else {
        setError('Error processing payment. Please try again.');
      }
      console.error('Payment request failed:', error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upgrade to Premium</h1>
          <p className="text-xl text-gray-600">Get unlimited access to all premium features for just KSH 200</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Premium Features</h2>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Infinity className="text-teal-500 mr-3 h-5 w-5" />
                <div>
                  <h4 className="font-semibold">Unlimited Lesson Access</h4>
                  <p className="text-sm text-gray-600">Access all lessons without restrictions</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Bolt className="text-teal-500 mr-3 h-5 w-5" />
                <div>
                  <h4 className="font-semibold">Unlimited Quiz Attempts</h4>
                  <p className="text-sm text-gray-600">Practice quizzes as many times as you want</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Gem className="text-teal-500 mr-3 h-5 w-5" />
                <div>
                  <h4 className="font-semibold">Premium Learning Paths</h4>
                  <p className="text-sm text-gray-600">Access exclusive advanced content</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">M-Pesa Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    placeholder="Enter M-Pesa number"
                    className={`pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none ${
                      error ? 'border-red-500' : success ? 'border-green-500' : 'border-gray-300'
                    }`}
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    maxLength={10}
                  />
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                {paymentStatus && <p className="text-blue-500 text-sm mt-1">{paymentStatus}</p>}
                {success && <p className="text-green-500 text-sm mt-1">Payment successful! Redirecting...</p>}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Premium Access</span>
                  <span className="font-bold text-lg">KSH 200</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg py-3 font-semibold hover:from-teal-600 hover:to-teal-700 transition-colors duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  'Pay with M-Pesa'
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500 mt-4">
                  You will receive an M-Pesa prompt on your phone to complete the payment
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;