//@ts-nocheck
"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Search, FileText, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { backendUrl } from '@/store';
const AddAppointmentPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reason: '',
    lawyerEmail: '',
    scheduledAt: ''
  });
  
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLawyerDropdown, setShowLawyerDropdown] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loadingLawyers, setLoadingLawyers] = useState(true);

 

  // Fetch lawyers on component mount
  useEffect(() => {
    fetchLawyers();
  }, []);

  // Filter lawyers based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = lawyers.filter(lawyer => 
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLawyers(filtered);
    } else {
      setFilteredLawyers(lawyers);
    }
  }, [searchTerm, lawyers]);

  const fetchLawyers = async () => {
    try {
      setLoadingLawyers(true);
      const response = await fetch(`${backendUrl}/api/v1/appointment/all-lawyers`);
      const data = await response.json();
      
      if (data.success) {
        setLawyers(data.data);
        setFilteredLawyers(data.data);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch lawyers' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error connecting to server' });
    } finally {
      setLoadingLawyers(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLawyerSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowLawyerDropdown(true);
  };

  const selectLawyer = (lawyer) => {
    setSelectedLawyer(lawyer);
    setFormData(prev => ({
      ...prev,
      lawyerEmail: lawyer.email
    }));
    setSearchTerm(lawyer.name);
    setShowLawyerDropdown(false);
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async () => {
    setLoading(true);
    clearMessage();

    try {
      // Get user email from localStorage
      const userEmail = localStorage.getItem('email');
      if (!userEmail) {
        setMessage({ type: 'error', text: 'User not logged in. Please log in first.' });
        setLoading(false);
        return;
      }

      // Validate form data
      if (!formData.title || !formData.description || !formData.reason || !formData.lawyerEmail || !formData.scheduledAt) {
        setMessage({ type: 'error', text: 'Please fill in all fields' });
        setLoading(false);
        return;
      }

      const appointmentData = {
        ...formData,
        userEmail
      };

      const response = await fetch(`${backendUrl}/api/v1/appointment/add-appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Appointment created successfully!' });
        // Reset form
        setFormData({
          title: '',
          description: '',
          reason: '',
          lawyerEmail: '',
          scheduledAt: ''
        });
        setSelectedLawyer(null);
        setSearchTerm('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create appointment' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error connecting to server. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Get minimum datetime for scheduling (current time + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-32 py-8 bg-[#0b0f19] text-slate-100 min-h-screen">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Schedule Appointment</h1>
            <p className="text-slate-300 text-sm">Book a consultation with a legal professional</p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' 
                : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="font-medium text-sm">{message.text}</span>
            </div>
          )}
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                <FileText className="w-4 h-4 inline mr-2 text-blue-400" />
                Appointment Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Legal Consultation for Contract Review"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide detailed information about your legal matter..."
                rows="4"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none outline-none"
                required
              />
            </div>

            {/* Reason Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Reason for Consultation
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                required
              >
                <option value="" className="bg-slate-900 text-slate-300">Select a reason</option>
                <option value="Contract Review" className="bg-slate-900 text-slate-100">Contract Review</option>
                <option value="Legal Advice" className="bg-slate-900 text-slate-100">Legal Advice</option>
                <option value="Litigation Support" className="bg-slate-900 text-slate-100">Litigation Support</option>
                <option value="Document Preparation" className="bg-slate-900 text-slate-100">Document Preparation</option>
                <option value="Business Law" className="bg-slate-900 text-slate-100">Business Law</option>
                <option value="Family Law" className="bg-slate-900 text-slate-100">Family Law</option>
                <option value="Criminal Law" className="bg-slate-900 text-slate-100">Criminal Law</option>
                <option value="Property Law" className="bg-slate-900 text-slate-100">Property Law</option>
                <option value="Other" className="bg-slate-900 text-slate-100">Other</option>
              </select>
            </div>

            {/* Lawyer Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                <User className="w-4 h-4 inline mr-2 text-blue-400" />
                Select Lawyer
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleLawyerSearch}
                    onFocus={() => setShowLawyerDropdown(true)}
                    placeholder={loadingLawyers ? "Loading lawyers..." : "Search lawyers by name, specialization, or email"}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    disabled={loadingLawyers}
                  />
                </div>

                {showLawyerDropdown && !loadingLawyers && (
                  <div className="absolute z-10 w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                    {filteredLawyers.length > 0 ? (
                      filteredLawyers.map((lawyer) => (
                        <div
                          key={lawyer.id}
                          onClick={() => selectLawyer(lawyer)}
                          className="p-4 hover:bg-slate-800 cursor-pointer border-b border-slate-800/60 last:border-b-0 transition-colors"
                        >
                          <div className="font-semibold text-white">{lawyer.name}</div>
                          <div className="text-sm text-blue-400 font-medium">{lawyer.specialization}</div>
                          <div className="text-xs text-slate-400">{lawyer.email}</div>
                          {lawyer.stateRollNumber && (
                            <div className="text-xs text-slate-500 mt-0.5">Roll No: {lawyer.stateRollNumber}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-slate-400 text-center text-sm">
                        No lawyers found matching your search
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedLawyer && (
                <div className="mt-3 p-3 bg-blue-950/60 rounded-xl border border-blue-800/60">
                  <div className="font-semibold text-blue-300">{selectedLawyer.name}</div>
                  <div className="text-sm text-blue-400">{selectedLawyer.specialization}</div>
                  <div className="text-xs text-slate-300">{selectedLawyer.email}</div>
                </div>
              )}
            </div>

            {/* Scheduled Date and Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                <Clock className="w-4 h-4 inline mr-2 text-blue-400" />
                Scheduled Date & Time
              </label>
              <input
                type="datetime-local"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleInputChange}
                min={getMinDateTime()}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                required
              />
              <p className="text-xs text-slate-400 mt-1">
                Please select a date and time at least 1 hour from now
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || loadingLawyers || !selectedLawyer}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-6 rounded-xl font-bold hover:from-blue-500 hover:to-indigo-500 focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Appointment...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Schedule Appointment
                </>
              )}
            </button>
         
          <div className="mt-8 p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
            <h3 className="font-semibold text-slate-100 mb-2">📋 Appointment Guidelines</h3>
            <ul className="text-sm text-slate-300 space-y-1.5">
              <li>• Appointments must be scheduled at least 1 hour in advance</li>
              <li>• Please provide detailed information to help the lawyer prepare</li>
              <li>• You will receive a confirmation once the appointment is created</li>
              <li>• Make sure to arrive on time for your scheduled consultation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showLawyerDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowLawyerDropdown(false)}
        />
      )}
    </div>
    </div>
  );
};

export default AddAppointmentPage;