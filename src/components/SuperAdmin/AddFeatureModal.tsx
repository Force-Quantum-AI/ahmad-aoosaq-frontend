import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAddFeatureMutation, useGetFeatureByIdQuery, useUpdateFeatureMutation } from '@/store/features/subscription/plan.api';

interface AddFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  featureId?: number | null;
}

const AddFeatureModal: React.FC<AddFeatureModalProps> = ({ isOpen, onClose, onSubmit: _onSubmit, featureId }) => {
  const [addFeature, { isLoading: isAdding }] = useAddFeatureMutation();
  const [updateFeature, { isLoading: isUpdating }] = useUpdateFeatureMutation();
  
  const { data: featureData, isLoading: isFetching } = useGetFeatureByIdQuery(featureId as number, {
    skip: !featureId,
  });

  const [formData, setFormData] = useState({
    name: '',
    feature_identifier: 'call_limit',
    description: '',
    have_limit: false,
    value: 0,
    overage_price: 0,
    price: 0,
    currency: 'usd',
    interval: 'month',
    active: true,
  });

  useEffect(() => {
    if (featureData && featureId) {
      setFormData({
        name: featureData.name || '',
        feature_identifier: featureData.feature_identifier || 'call_limit',
        description: featureData.description || '',
        have_limit: featureData.have_limit || false,
        value: featureData.value || 0,
        overage_price: Number(featureData.overage_price) || 0,
        price: Number(featureData.price) || 0,
        currency: featureData.currency || 'usd',
        interval: featureData.interval || 'month',
        active: featureData.active ?? true,
      });
    } else if (!featureId) {
      // Reset for "Add" mode
      setFormData({
        name: '',
        feature_identifier: 'call_limit',
        description: '',
        have_limit: false,
        value: 0,
        overage_price: 0,
        price: 0,
        currency: 'usd',
        interval: 'month',
        active: true,
      });
    }
  }, [featureData, featureId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        ...formData,
        price: formData.price.toString(),
        overage_price: formData.overage_price.toString(),
      };

      if (featureId) {
        await updateFeature({ id: featureId, data: payload }).unwrap();
        toast.success('Feature updated successfully');
      } else {
        await addFeature(payload).unwrap();
        toast.success('Feature added successfully');
      }
      
      onClose();
    } catch (error: any) {
      console.error('Failed to save feature:', error);
      const errorMessage = error?.data?.detail || error?.data?.message || 'Failed to save feature. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const toggleSwitch = (field: 'have_limit' | 'active') => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const isLoading = isAdding || isUpdating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-xl font-semibold text-white">
            {featureId ? 'Edit Feature' : 'Add New Feature'}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm">Loading feature data...</p>
            </div>
          ) : (
            <>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Feature Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Premium Call Access"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              {/* Identifier */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Identifier</label>
                <select
                  name="feature_identifier"
                  value={formData.feature_identifier}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                >
                  <option value="ai_answering">AI Answering</option>
                  <option value="intake">Intake</option>
                  <option value="google_calendar">Google Calendar</option>
                  <option value="calendly_calendar">Calendly Calendar</option>
                  <option value="call_limit">Call Limit</option>
                  <option value="call_duration">Call Duration</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a brief description of this feature"
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
              </div>

              {/* Toggles Row */}
              <div className="flex gap-8 py-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSwitch('have_limit')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.have_limit ? 'bg-indigo-600' : 'bg-gray-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.have_limit ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm font-medium text-gray-300">Have Limit</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSwitch('active')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.active ? 'bg-green-600' : 'bg-gray-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.active ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm font-medium text-gray-300">Active</span>
                </div>
              </div>

              {/* Value & Overage Price Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Value</label>
                  <input
                    type="number"
                    name="value"
                    disabled={!formData.have_limit}
                    value={formData.value}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Overage Price</label>
                  <input
                    type="number"
                    name="overage_price"
                    step="0.01"
                    value={formData.overage_price}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none"
                  />
                </div>
              </div>

              {/* Price & Currency Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Base Price</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none"
                  >
                    {['usd', 'cad', 'eur', 'bhd', 'sar', 'aed'].map((c) => (
                      <option key={c} value={c}>{c.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Interval */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Billing Interval</label>
                <select
                  name="interval"
                  value={formData.interval}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none"
                >
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isFetching}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Saving...' : featureId ? 'Update Feature' : 'Save Feature'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFeatureModal;