import React from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle, Download, Home, Mail } from 'lucide-react';

const SubscriptionSuccess = () => {
  const location = useLocation();
  const { transactionId, amount, date } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        {/* Success Animation */}
        <div className="flex justify-center mb-6">
          <div className="animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 text-center border-b border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-500">
              Thank you for subscribing to our premium service
            </p>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Success Alert */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-green-800 font-semibold">
                    Your subscription is now active
                  </h3>
                  <p className="text-green-700 text-sm mt-1">
                    You now have full access to all premium features
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Transaction Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-medium text-gray-900 mt-1">{transactionId}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Amount Paid</p>
                  <p className="font-medium text-gray-900 mt-1">KSH {amount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                  <p className="text-sm text-gray-500">Transaction Date</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {new Date(date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-6 bg-gray-50 space-y-4">
            {
                /*
                   <div className="grid grid-cols-2 gap-4">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center transition-colors duration-200">
                <Download className="mr-2 h-4 w-4" /> Download Receipt
              </button>
              <button className="w-full bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-lg font-medium border border-gray-200 flex items-center justify-center transition-colors duration-200">
                <Home className="mr-2 h-4 w-4" /> Go to Dashboard
              </button>
            </div>
                */
            }
         
            
            <div className="text-center text-sm text-gray-500">
              <p className="flex items-center justify-center">
                Need help? <Mail className="mx-1 h-4 w-4" /> Contact our support team at{" "}
                <a href="mailto:support@example.com" className="ml-1 text-blue-600 hover:underline">
                  support@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;