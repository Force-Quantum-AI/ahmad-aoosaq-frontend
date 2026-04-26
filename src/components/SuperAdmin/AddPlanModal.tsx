import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus, Trash2, Check } from 'lucide-react';
import {
  useAddPlanMutation,
  useGetPlanByIdQuery,
  useUpdatePlanMutation,
  useGetFeaturesQuery
} from '@/store/features/plan/plan.api';
import { toast } from 'sonner';

interface AddPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsModalOpen: (value: boolean) => void;
  planId?: number | null;
}

const AddPlanModal: React.FC<AddPlanModalProps> = ({ isOpen, onClose, setIsModalOpen, planId }) => {
  const [addPlan, { isLoading: isAdding }] = useAddPlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();

  const { data: planData, isLoading: isFetching } = useGetPlanByIdQuery(planId as number, {
    skip: !planId,
  });

  const { data: availableFeatures } = useGetFeaturesQuery();

  const [formData, setFormData] = useState({
    name: 'starter',
    interval: 'month',
    marketing_features: [''] as string[],
    price: 0,
    currency: 'usd',
    trial_period_days: 7,
    active: true,
    features: [] as number[],
  });

  useEffect(() => {
    if (planData && planId) {
      setFormData({
        name: planData.name || 'starter',
        interval: planData.interval || 'month',
        marketing_features: planData.marketing_features?.length ? [...planData.marketing_features] : [''],
        price: Number(planData.price) || 0,
        currency: planData.currency || 'usd',
        trial_period_days: planData.trial_period_days || 0,
        active: planData.active ?? true,
        features: planData.features || [],
      });
    } else if (!planId) {
      setFormData({
        name: 'starter',
        interval: 'month',
        marketing_features: [''],
        price: 0,
        currency: 'usd',
        trial_period_days: 7,
        active: true,
        features: [],
      });
    }
  }, [planData, planId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanMarketingFeatures = formData.marketing_features.filter(f => f.trim() !== '');

    try {
      const payload = {
        ...formData,
        marketing_features: cleanMarketingFeatures,
        price: formData.price.toString(),
      };

      if (planId) {
        await updatePlan({ id: planId, data: payload }).unwrap();
        setIsModalOpen(false)
        toast.success('Plan updated successfully');
      } else {
        await addPlan(payload).unwrap();
        setIsModalOpen(false)
        toast.success('Plan created successfully');
      }

      onClose();
    } catch (error: any) {
      console.error('Failed to save plan:', error);
      const errorMessage = error?.data?.detail || error?.data?.message || 'Failed to save plan. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleMarketingFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.marketing_features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, marketing_features: newFeatures }));
  };

  const addMarketingFeature = () => {
    setFormData(prev => ({ ...prev, marketing_features: [...prev.marketing_features, ''] }));
  };

  const removeMarketingFeature = (index: number) => {
    const newFeatures = formData.marketing_features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, marketing_features: newFeatures.length ? newFeatures : [''] }));
  };

  const toggleFeatureSelection = (featureId: number) => {
    setFormData(prev => {
      const isSelected = prev.features.includes(featureId);
      if (isSelected) {
        return { ...prev, features: prev.features.filter(id => id !== featureId) };
      } else {
        return { ...prev, features: [...prev.features, featureId] };
      }
    });
  };

  const toggleSwitch = () => {
    setFormData((prev) => ({ ...prev, active: !prev.active }));
  };

  const isLoading = isAdding || isUpdating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-xl font-semibold text-white">
            {planId ? 'Edit Subscription Plan' : 'Create New Plan'}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-3 text-indigo-500" />
              <p className="text-sm">Fetching plan configurations...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Plan Tier</label>
                  <select
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Trial Days</label>
                    <input
                      type="number"
                      name="trial_period_days"
                      value={formData.trial_period_days}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                    <div className="flex items-center gap-3 h-10">
                      <button
                        type="button"
                        onClick={toggleSwitch}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.active ? 'bg-indigo-600' : 'bg-gray-700'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.active ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className="text-sm text-gray-300 font-medium">{formData.active ? 'Active' : 'Draft'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Currency</label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none"
                      >
                        {['usd', 'cad', 'eur', 'bhd', 'sar', 'aed'].map((c) => (
                          <option key={c} value={c}>{c.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Billing Interval</label>
                    <select
                      name="interval"
                      value={formData.interval}
                      onChange={handleChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none"
                    >
                      <option value="week">Weekly</option>
                      <option value="month">Monthly</option>
                      <option value="year">Yearly</option>
                    </select>
                  </div>
                </div>

                {/* Feature Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Included Features</label>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 max-h-48 overflow-y-auto custom-scrollbar space-y-2">
                    {availableFeatures?.map((feature:any) => (
                      <div
                        key={feature.id}
                        onClick={() => toggleFeatureSelection(feature.id)}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${formData.features.includes(feature.id) ? 'bg-indigo-500/20 border border-indigo-500/30' : 'hover:bg-gray-700/50 border border-transparent'}`}
                      >
                        <span className="text-sm text-gray-200">{feature.name}</span>
                        {formData.features.includes(feature.id) && <Check className="w-4 h-4 text-indigo-400" />}
                      </div>
                    ))}
                    {(!availableFeatures || availableFeatures.length === 0) && (
                      <p className="text-xs text-gray-500 text-center py-2">No features available to select</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Marketing Features */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Marketing Features</label>
                  <button
                    type="button"
                    onClick={addMarketingFeature}
                    className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-4 h-4" /> Add Line
                  </button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {formData.marketing_features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleMarketingFeatureChange(index, e.target.value)}
                        placeholder="e.g. 24/7 Priority Support"
                        className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeMarketingFeature(index)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 italic">* These features will appear in the pricing cards on the landing page.</p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-800">
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
              className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Processing...' : planId ? 'Update Subscription' : 'Launch Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlanModal;