import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem, faCrown, faInfinity, faBolt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

// Dialog Components
const Dialog = ({ open, children, onOpenChange }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-[101] bg-white rounded-lg shadow-xl max-h-[85vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = "" }) => (
  <div className={`w-full min-w-[300px] ${className}`}>
    {children}
  </div>
);

const DialogHeader = ({ children }) => (
  <div className="px-6 py-4 border-b">
    {children}
  </div>
);

const DialogTitle = ({ children, className = "" }) => (
  <h2 className={`text-lg font-semibold ${className}`}>
    {children}
  </h2>
);

// Upgrade Modal Component
const UpgradeModal = ({ open, onClose, onUpgrade }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <FontAwesomeIcon icon={faCrown} className="text-yellow-500 mr-2" />
            Upgrade to Premium
          </span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </DialogTitle>
      </DialogHeader>

      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FontAwesomeIcon icon={faInfinity} className="text-teal-500 mr-3" />
            <div>
              <h4 className="font-semibold">Unlimited Lesson Access</h4>
              <p className="text-sm text-gray-600">Access all lessons without restrictions</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FontAwesomeIcon icon={faBolt} className="text-teal-500 mr-3" />
            <div>
              <h4 className="font-semibold">Unlimited Quiz Attempts</h4>
              <p className="text-sm text-gray-600">Practice quizzes as many times as you want</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FontAwesomeIcon icon={faGem} className="text-teal-500 mr-3" />
            <div>
              <h4 className="font-semibold">Premium Learning Paths</h4>
              <p className="text-sm text-gray-600">Access exclusive advanced content</p>
            </div>
          </div>
        </div>

        <button
          onClick={onUpgrade}
          className="mt-6 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full py-3 font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-colors duration-300"
        >
          Upgrade Now
        </button>
      </div>
    </DialogContent>
  </Dialog>
);

// Premium Banner Component
export const PremiumBanner = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const navigate = useNavigate();
  const { authState } = useAuth();

  
  if (authState?.user?.subscription === 'premium user') return null;

  return (
    <>
      <div 
        onClick={() => setShowUpgradeModal(true)}
        className="absolute -top-1 -right-1 w-24 h-24 overflow-hidden cursor-pointer group z-20"
      >
        <div className="absolute transform rotate-45 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold py-1 right-[-35px] top-[32px] w-[170px] text-center hover:from-yellow-500 hover:to-yellow-700 transition-colors duration-300">
          UPGRADE
        </div>
      </div>

      <UpgradeModal 
        open={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => navigate('/upgrade')}
      />
    </>
  );
};

// Premium Feature Lock Component
export const PremiumFeatureLock = ({ feature, onUnlock }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { AuthState } = useAuth();
 

  if (AuthState?.user?.subscription === 'premium') return null;

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
        <button
          onClick={() => setShowUpgradeModal(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faCrown} className="mr-2" />
          Unlock {feature}
        </button>
      </div>

      <UpgradeModal 
        open={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={onUnlock}
      />
    </div>
  );
};

