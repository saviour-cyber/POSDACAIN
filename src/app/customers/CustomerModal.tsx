'use client';

import { useState } from 'react';
import { X, UserPlus, Save, Loader2 } from 'lucide-react';
import { createCustomer, updateCustomer } from './actions';

interface CustomerModalProps {
  businessType: string;
  onClose: () => void;
  customer?: any; // Added for edit mode
}

export default function CustomerModal({ businessType, onClose, customer }: CustomerModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = customer 
      ? await updateCustomer(customer.id, formData)
      : await createCustomer(formData);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Something went wrong');
      setLoading(false);
    }
  };

  const isEdit = !!customer;

  const modalTitle = isEdit ? `Edit ${customer.name}`
    : businessType === 'Clinic' ? 'Add New Patient'
    : businessType === 'School' ? 'Enroll New Student'
    : 'Add New Customer';

  const submitLabel = loading ? (isEdit ? 'Saving...' : 'Registering...')
    : isEdit ? 'Save Changes'
    : businessType === 'Clinic' ? 'Register Patient'
    : businessType === 'School' ? 'Enroll Student'
    : 'Register Customer';

  // Helper for metadata pre-filling
  const metadata = customer?.metadata || {};

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              {isEdit ? <Save size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{modalTitle}</h2>
              {isEdit && <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">ID: {customer.code}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl text-gray-400 border border-transparent hover:border-gray-100 transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input
                name="name"
                required
                defaultValue={customer?.name}
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50/50 focus:bg-white shadow-sm"
                placeholder={businessType === 'School' ? 'e.g. Jane Wambua' : 'e.g. John Doe'}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Company Name (Optional)</label>
              <input
                name="company"
                defaultValue={customer?.company}
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50/50 focus:bg-white shadow-sm"
                placeholder="e.g. Acme Corp"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input
                name="phone"
                defaultValue={customer?.phone}
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50/50 focus:bg-white shadow-sm"
                placeholder="+254 7..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                name="email"
                type="email"
                defaultValue={customer?.email}
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50/50 focus:bg-white shadow-sm"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">KRA PIN</label>
              <input
                name="kraPin"
                defaultValue={customer?.kraPin}
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50/50 focus:bg-white shadow-sm"
                placeholder="e.g. A00..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Credit Limit (KES)</label>
              <input
                name="creditLimit"
                type="number"
                defaultValue={customer?.creditLimit || "0"}
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50/50 focus:bg-white shadow-sm font-bold"
                placeholder="50000"
              />
            </div>
          </div>

          {/* Clinic: Patient Medical Info */}
          {businessType === 'Clinic' && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest">Patient Medical Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Blood Type</label>
                  <select
                    name="bloodType"
                    defaultValue={metadata.bloodType}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50/50 focus:bg-white shadow-sm appearance-none"
                  >
                    <option value="">Unknown</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Known Allergies</label>
                  <input
                    name="allergies"
                    type="text"
                    defaultValue={metadata.allergies}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50/50 focus:bg-white shadow-sm"
                    placeholder="e.g. Penicillin, Peanuts"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Medical History Notes</label>
                <textarea
                  name="medicalHistory"
                  rows={2}
                  defaultValue={metadata.medicalHistory}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50/50 focus:bg-white shadow-sm resize-none"
                  placeholder="Brief medical history, chronic conditions..."
                />
              </div>
            </div>
          )}

          {/* School: Student Enrollment Info */}
          {businessType === 'School' && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest">Student Enrollment Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Admission Number</label>
                  <input
                    name="admissionNo"
                    type="text"
                    defaultValue={metadata.admissionNo}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-gray-50/50 focus:bg-white shadow-sm font-bold"
                    placeholder="e.g. ADM-2025-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Grade / Class</label>
                  <input
                    name="grade"
                    type="text"
                    defaultValue={metadata.grade}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-gray-50/50 focus:bg-white shadow-sm"
                    placeholder="e.g. Form 3, Grade 7"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Parent / Guardian Contact</label>
                <input
                  name="parentContact"
                  type="text"
                  defaultValue={metadata.parentContact}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-gray-50/50 focus:bg-white shadow-sm"
                  placeholder="e.g. +254 712 345678 (Father)"
                />
              </div>
            </div>
          )}

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-4 rounded-2xl border border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-all text-sm uppercase tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all disabled:opacity-50 text-sm uppercase tracking-wide flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
