import { useUpdateBusinessMutation } from "@/store/features/business/business.api";
import { SquarePen } from "lucide-react";
import { useState } from "react";

export default function BusinessDetailsSection({
  business_id,
  name,
  description,
  address,
  business_website,
  business_email,
}:any) {
  const [updateBusiness,{isLoading}] = useUpdateBusinessMutation();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: name,
    description:
      description,
    address: address,
    business_website: business_website,
    business_email: business_email,
    business_type: "salon & spa"
  });

  const [initialData, setInitialData] = useState(formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setInitialData(formData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    await updateBusiness({business_id, data:formData})
    setIsEditing(false);
  };

  return (
    <div>
      <div
        className="rounded-3xl p-6"
        style={{
          background: `radial-gradient(ellipse 70% 60% at top right, rgba(80, 80, 80, 0.45) 0%, #000000 70%)`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-normal text-white">
              Business Details
            </h2>
            <p className="text-lg text-gray-400 mt-0.5">
              Basic information about your business
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 cursor-pointer bg-[#33384D] text-white text-sm font-medium px-4 py-3 rounded-2xl"
            >
              <SquarePen size={16} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-white text-black px-4 py-2 rounded-xl"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-white mb-1.5">
              Business name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-[#111] text-[#9E9E9E] rounded-2xl px-3 py-4 text-base focus:outline-none disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-white mb-1.5">
              Business Website URL
            </label>
            <input
              name="business_website"
              value={formData.business_website}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-[#111] text-[#9E9E9E] rounded-2xl px-3 py-4 text-base focus:outline-none disabled:opacity-60"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-white mb-1.5">
              Business Email
            </label>
            <input
              name="business_email"
              value={formData.business_email}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-[#111] text-[#9E9E9E] rounded-2xl px-3 py-4 text-base focus:outline-none disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-white mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-[#111] text-[#9E9E9E] rounded-2xl px-3 py-4 text-base focus:outline-none resize-none disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-white mb-1.5">
              Business Address
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full bg-[#111] text-[#9E9E9E] rounded-2xl px-3 py-4 text-base focus:outline-none disabled:opacity-60"
            />
          </div>
        </form>
      </div>
    </div>
  );
}