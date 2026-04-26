import React, { useState, useEffect } from "react";
import { Pencil, Save, X } from "lucide-react";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/store/features/auth/auth.api";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/store/hook";
import { setUserInfo } from "@/store/features/auth/auth.slice";

const Account: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const { data: userData, isLoading } = useGetUserQuery(undefined);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Initialize form fields when user data loads
  useEffect(() => {
    if (userData?.data) {
      setFirstName(userData.data.first_name || "");
      setLastName(userData.data.last_name || "");
      setPhotoPreview(userData.data.image || null);
    }
  }, [userData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        Loading...
      </div>
    );
  }

  const user = userData?.data;

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setPhotoFile(null);
    setPhotoPreview(user?.image || null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      let payload: FormData | Record<string, string>;

      if (photoFile) {
        // Use FormData for file upload
        payload = new FormData();
        if (firstName !== user?.first_name)
          payload.append("first_name", firstName);
        if (lastName !== user?.last_name) payload.append("last_name", lastName);
        payload.append("image", photoFile); // Ensure field name matches backend (e.g., "avatar", "profile_picture")
      } else {
        // Use plain object for text-only updates
        payload = {};
        if (firstName !== user?.first_name) payload.first_name = firstName;
        if (lastName !== user?.last_name) payload.last_name = lastName;

        if (Object.keys(payload).length === 0) {
          setIsEditing(false);
          return;
        }
      }

      // Perform the update
      const result = await updateUser(payload).unwrap();

      if (result.success) {
        toast.success(result.message);
        dispatch(setUserInfo(result.data));
      }

      // Optionally update local preview if backend returns new image URL
      if (result?.data?.image) {
        setPhotoPreview(result.data.image);
      }

      setIsEditing(false);
      setPhotoFile(null);
    } catch (error: any) {
      console.error("Update failed:", error);
      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        "Failed to update profile. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <>
      <div
        className="w-full space-y-8  font-sans pb-4"

      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-medium text-white">
            Account
          </h2>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 transition-colors text-white text-sm font-medium py-2 px-4 rounded-xl"
              >
                <X size={14} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2 bg-[#262831] hover:bg-[#32343e] transition-colors text-white text-sm font-medium py-2 px-4 rounded-xl disabled:opacity-50"
              >
                <Save size={14} />
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center gap-2 bg-[#262831] hover:bg-[#32343e] transition-colors text-white text-sm font-medium py-2 px-4 rounded-xl"
            >
              <Pencil size={14} className="text-gray-300" />
              Edit
            </button>
          )}
        </div>

        {/* Profile Photo Section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#1f2127] border-2 border-white/20 flex items-center justify-center text-gray-400">
                No Photo
              </div>
            )}
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-[#262831] hover:bg-[#32343e] p-1.5 rounded-full cursor-pointer transition-colors">
                <Pencil size={12} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <p className="text-white text-sm font-medium">Profile Photo</p>
            {isEditing && (
              <p className="text-gray-400 text-xs mt-1">
                Click the pencil icon to upload a new photo
              </p>
            )}
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* First Name */}
          <div className="space-y-3">
            <label className="text-gray-200 text-sm font-medium">
              First Name
            </label>
            {isEditing ? (
              <input
                type="text"
                className="w-full bg-[#1f2127] rounded-xl px-4 py-3.5 border border-white/10 transition-colors focus:outline-none text-white placeholder:text-white/50"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            ) : (
              <div className="bg-[#1f2127] rounded-xl px-4 py-3.5 border border-transparent hover:border-white/10 transition-colors">
                <span className="text-gray-400 text-sm">
                  {user?.first_name || "N/A"}
                </span>
              </div>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-3">
            <label className="text-gray-200 text-sm font-medium">
              Last Name
            </label>
            {isEditing ? (
              <input
                type="text"
                className="w-full bg-[#1f2127] rounded-xl px-4 py-3.5 border border-white/10 transition-colors focus:outline-none text-white placeholder:text-white/50"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            ) : (
              <div className="bg-[#1f2127] rounded-xl px-4 py-3.5 border border-transparent hover:border-white/10 transition-colors">
                <span className="text-gray-400 text-sm">
                  {user?.last_name || "N/A"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>


    </>
  );
};

export default Account;
