'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import CustomerModal from './CustomerModal';
import { useSession } from 'next-auth/react';

export default function CustomerHeader() {
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  
  const businessType = session?.user?.businessType || 'General Merchandise';

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {businessType === 'Clinic' ? 'Patient Records' : businessType === 'School' ? 'Students Directory' : 'Customers & Loyalty'}
          </h1>
          <p className="text-gray-500 font-medium">
            {businessType === 'Clinic' ? 'Manage patient history and visits' : businessType === 'School' ? 'Manage student enrollments and fee tracking' : 'Manage your relationships and reward points'}
          </p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95"
        >
          <UserPlus size={20} />
          <span>{businessType === 'Clinic' ? 'New Patient' : 'New Customer'}</span>
        </button>
      </div>

      {showModal && <CustomerModal businessType={businessType} onClose={() => setShowModal(false)} />}
    </>
  );
}
