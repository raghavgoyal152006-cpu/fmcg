import React, { useState, useEffect } from 'react';
import { X, MapPin, Building, Home, Briefcase } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import type { DeliveryAddress } from '../../types';

export const AddressModal: React.FC = () => {
  const { isAddressModalOpen, setIsAddressModalOpen, addAddress } = useStore();

  const [name] = useState('');
  const [type, setType] = useState<DeliveryAddress['type']>('HOME');
  const [flatNo, setFlatNo] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('560038');
  const [phone, setPhone] = useState('+91 98451 22340');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddressModalOpen) {
        setIsAddressModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddressModalOpen, setIsAddressModalOpen]);

  if (!isAddressModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatNo || !street || !area) return;

    addAddress({
      name: name || `${type} Address`,
      type,
      flatNo,
      street,
      landmark,
      area,
      pincode,
      phone,
      isDefault: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-black text-slate-900 font-['Outfit']">
              Add Delivery Address
            </h2>
          </div>
          <button
            onClick={() => setIsAddressModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Address Type */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Address Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'HOME', icon: Home, label: 'Home' },
                { key: 'WORK', icon: Briefcase, label: 'Work' },
                { key: 'OTHER', icon: Building, label: 'Other' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setType(item.key as any)}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center space-x-1.5 transition-all ${
                      type === item.key
                        ? 'border-brand-500 bg-emerald-50 text-brand-800 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">House / Flat / Block No.</label>
            <input
              type="text"
              required
              placeholder="e.g. Flat 304, Palm Grove Apts"
              value={flatNo}
              onChange={(e) => setFlatNo(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Street & Society</label>
            <input
              type="text"
              required
              placeholder="e.g. 12th Main Road, HAL 2nd Stage"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Area / Locality</label>
              <input
                type="text"
                required
                placeholder="e.g. Indiranagar"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Pincode</label>
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Landmark (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Near Metro Station Pillar 104"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAddressModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-sm"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
