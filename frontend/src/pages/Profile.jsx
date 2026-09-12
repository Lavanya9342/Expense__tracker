import { useState, useContext } from 'react';
import { User, Key, Save, Mail, UserCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import '../index.css';

export default function Profile() {
  const { user } = useContext(AuthContext);
  
  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const { data } = await api.put('/auth/profile', profileData);
      
      // Update local storage with new user data and token
      localStorage.setItem('user', JSON.stringify(data));
      
      toast.success('Profile updated successfully! Refreshing...');
      setTimeout(() => window.location.reload(), 1500); // Reload to update Context globally
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords don't match");
    }
    
    setIsUpdatingPassword(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <UserCircle color="#2563eb" size={36} />
        <h1 className="profile-title">Account Settings</h1>
      </div>

      <div className="profile-grid">
        
        {/* Personal Information Form */}
        <div className="profile-card">
          <div className="profile-card-header">
            <User color="#6b7280" size={24} />
            <h2 className="profile-card-title">Personal Information</h2>
          </div>
          
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                  className="input-icon-field"
                />
                <User size={18} className="input-icon" />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  value={profileData.email} 
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                  className="input-icon-field"
                />
                <Mail size={18} className="input-icon" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isUpdatingProfile}
              className="btn-update"
            >
              <Save size={18} /> {isUpdatingProfile ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="profile-card">
          <div className="profile-card-header">
            <Key color="#6b7280" size={24} />
            <h2 className="profile-card-title">Change Password</h2>
          </div>
          
          <form onSubmit={handlePasswordUpdate}>
            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password" 
                value={passwordData.currentPassword} 
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                className="input-field"
              />
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                value={passwordData.newPassword} 
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength="6"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                value={passwordData.confirmPassword} 
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength="6"
                className="input-field"
              />
            </div>

            <button 
              type="submit" 
              disabled={isUpdatingPassword}
              className="btn-dark"
            >
              <Key size={18} /> {isUpdatingPassword ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}