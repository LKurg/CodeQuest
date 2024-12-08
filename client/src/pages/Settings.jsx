import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faBell, 
  faPalette, 
  faLanguage,
  faSave,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import MainLayout from '../Layout/MainLayout';
import DashboardSidebar from '../Layout/DashboardSideBar';

function Settings() {
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    profilePicture: null
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailNotifications: true,
    activityAlerts: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'en'
  });

  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        setUserProfile({
          name: data.name,
          email: data.email,
          profilePicture: data.profilePicture
        });

        setSecuritySettings({
          twoFactorAuth: data.twoFactorAuth || false,
          emailNotifications: data.emailNotifications !== false,
          activityAlerts: data.activityAlerts !== false
        });

        setAppearanceSettings({
          theme: data.theme || 'light',
          language: data.language || 'en'
        });
      } catch (error) {
        console.error('Failed to fetch user settings:', error);
      }
    };

    fetchUserSettings();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', userProfile.name);
      formData.append('email', userProfile.email);
      
      if (profilePicturePreview) {
        formData.append('profilePicture', profilePicturePreview);
      }

      const response = await fetch('http://localhost:5000/api/users/update-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('An error occurred while updating profile');
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicturePreview(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSecuritySettingsUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/security-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(securitySettings)
      });

      if (response.ok) {
        alert('Security settings updated successfully!');
      } else {
        alert('Failed to update security settings');
      }
    } catch (error) {
      console.error('Security settings update error:', error);
    }
  };

  const handleAppearanceSettingsUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/appearance-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(appearanceSettings)
      });

      if (response.ok) {
        alert('Appearance settings updated successfully!');
      } else {
        alert('Failed to update appearance settings');
      }
    } catch (error) {
      console.error('Appearance settings update error:', error);
    }
  };

  return (
    <MainLayout>
      <DashboardSidebar>
        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-6">
              <FontAwesomeIcon icon={faUser} className="text-teal-500 text-2xl mr-4" />
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            </div>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img 
                    src={userProfile.profilePicture || '/default-avatar.png'} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <input 
                    type="text" 
                    value={userProfile.name}
                    onChange={(e) => setUserProfile(prev => ({...prev, name: e.target.value}))}
                    placeholder="Full Name" 
                    className="w-full p-2 border rounded-md"
                  />
                  <input 
                    type="email" 
                    value={userProfile.email}
                    onChange={(e) => setUserProfile(prev => ({...prev, email: e.target.value}))}
                    placeholder="Email Address" 
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition flex items-center"
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" /> Save Profile
              </button>
            </form>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center mb-6">
              <FontAwesomeIcon icon={faLock} className="text-red-500 text-2xl mr-4" />
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-500 mr-3" />
                  <span>Two-Factor Authentication</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={securitySettings.twoFactorAuth}
                    onChange={() => setSecuritySettings(prev => ({
                      ...prev, 
                      twoFactorAuth: !prev.twoFactorAuth
                    }))}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faBell} className="text-blue-500 mr-3" />
                  <span>Email Notifications</span>
                </div>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={securitySettings.emailNotifications}
                    onChange={() => setSecuritySettings(prev => ({
                      ...prev, 
                      emailNotifications: !prev.emailNotifications
                    }))}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <button 
                onClick={handleSecuritySettingsUpdate}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition flex items-center"
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" /> Update Security Settings
              </button>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <FontAwesomeIcon icon={faPalette} className="text-purple-500 text-2xl mr-4" />
              <h2 className="text-xl font-semibold text-gray-800">Appearance</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faPalette} className="text-indigo-500 mr-3" />
                  <span>Theme</span>
                </div>
                <select 
                  value={appearanceSettings.theme}
                  onChange={(e) => setAppearanceSettings(prev => ({
                    ...prev, 
                    theme: e.target.value
                  }))}
                  className="p-2 border rounded-md"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faLanguage} className="text-green-500 mr-3" />
                  <span>Language</span>
                </div>
                <select 
                  value={appearanceSettings.language}
                  onChange={(e) => setAppearanceSettings(prev => ({
                    ...prev, 
                    language: e.target.value
                  }))}
                  className="p-2 border rounded-md"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <button 
                onClick={handleAppearanceSettingsUpdate}
                className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition flex items-center"
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" /> Save Appearance
              </button>
            </div>
          </div>
        </div>
      </DashboardSidebar>
    </MainLayout>
  );
}

export default Settings;