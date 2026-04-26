import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchPhoneNumbersMutation } from "@/store/features/phone/aiPhone.api";
import { useUpdatePhonePageInfoFromProvisionModalMutation } from "@/store/features/phone/phone.api";
import { CircleCheckBig, PhoneCall, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const CallForwordingModal = ({
  isOpen,
  setIsOpen,
  setForwardingModalOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setForwardingModalOpen: (value: boolean) => void;
}) => {
  const [areaCode, setAreaCode] = useState<number>(650);
  const [step, setStep] = useState<1 | 2>(1);
  const [numbers, setNumbers] = useState<any[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [selectedNumberInfo, setSelectedNumberInfo] = useState<any | null>(null);

  const [searchPhoneNumbers, { isLoading }] = useSearchPhoneNumbersMutation();
  const [updatePhonePageInfoFromProvisionModal] =
    useUpdatePhonePageInfoFromProvisionModalMutation();

  // SEARCH
  const handleSearchNumber = async () => {
    toast.success("clicked")
    if (!areaCode) {
      toast.error("Please enter area code");
      return;
    }

    try {
      const res = await searchPhoneNumbers({
        data: { area_code: areaCode },
      }).unwrap();

      if (res) {
        setNumbers(res);
        console.log("numbers are:", res); // correct log
        setStep(2);
      } else {
        toast.error("No numbers found");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to search phone numbers");
    }
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!selectedNumber || !selectedNumberInfo) {
      toast.error("Please select a number.");
      return; //  IMPORTANT FIX
    }

    // FIXED PAYLOAD
    const payload = {
      phone_number: selectedNumberInfo.phone_number,
      friendly_name: selectedNumberInfo.friendly_name || "",
      locality: selectedNumberInfo.locality || "",
      region: selectedNumberInfo.region || "",
      iso_country: selectedNumberInfo.iso_country || "",
      when_to_answer: "always", 
      capabilities: selectedNumberInfo.capabilities || {},
    };

    console.log("FINAL PAYLOAD:", payload);

    try {
      await updatePhonePageInfoFromProvisionModal({
        data: payload,
      }).unwrap();

      toast.success("Phone number updated successfully");
      setForwardingModalOpen(true);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update phone number");
    }
  };

  // ================= UI =================

  switch (step) {
    case 1:
      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="w-full max-w-md bg-white rounded-2xl shadow-xl">
            <div className="pt-2 pb-8 px-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <PhoneCall size={24} />
              </div>

              <h1 className="text-lg text-gray-900">Get Phone Number</h1>
              <p className="text-gray-400 text-sm">
                Luxe Home Services Assistant
              </p>

              <div className="mt-8">
                <input
                  type="number"
                  placeholder="650"
                  onChange={(e) =>
                    setAreaCode(Number(e.target.value.replace(/\D/g, "")))
                  }
                  className="w-full px-4 py-2 border rounded-xl"
                />

                <button
                  onClick={handleSearchNumber}
                  disabled={isLoading}
                  className="mt-4 w-full bg-black text-white py-2 rounded-xl flex items-center justify-center gap-2"
                >
                  <Search size={18} />
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      );

    case 2:
      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                     <DialogContent className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                         <div >
                             {/* Header */}
                             <div className=" pt-8 pb-2 px-8 text-center">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-lg ">
                                   <PhoneCall size={24} />
                                 </div>
                                 <h1 className="text-lg xl:text-xl text-gray-900 mb-1">
                                     Get Phone Number
                                 </h1>
                                 <p className="text-gray-400 text-xs xl:text-base">
                                     Luxe Home Services Assistant
                                 </p>
                             </div>

                             {/* Content */}
                             <div className="px-6 pb-2">
                                 <div className="mt-6 mb-6">
                                     <h2 className="text-xs font-medium text-gray-400 mb-4">
                                         Found {numbers?.length} available numbers with area code {areaCode}:
                                     </h2>
                                     {
                                        numbers?.length === 0 ? (
                                            <div className="text-center text-gray-400 text-sm p-10 bg-gray-50 rounded-2xl">
                                                No numbers found with area code {areaCode}
                                            </div>
                                        ) : (
                                            <div className="space-y-1 2xl:space-y-2 mb-8">
                                                {
                                                    isLoading ? (
                                                        <div className="space-y-1">
                                                            <Skeleton className="h-10 w-full bg-gray-300" />
                                                            <Skeleton className="h-10 w-full bg-gray-300" />
                                                            <Skeleton className="h-10 w-full bg-gray-300" />
                                                        </div>
                                                    ) :
                                                        numbers?.map((num, i) => (
                                                            <div
                                                                key={i}
                                                                className={`
                                                        px-4 py-1 md:py-2 2xl:py-3  rounded-xl
                                                        text-sm md:text-base font-medium 
                                                        hover:bg-blue-50 hover:border-blue-200
                                                        transition-colors cursor-pointer flex justify-between items-center
                                                    ${selectedNumber === num?.phone_number ? "border text-gray-800 bg-blue-50 border-blue-200" : "border-b border-gray-100 text-gray-400"}`}
                                                                onClick={() => { setSelectedNumber(num?.phone_number); setSelectedNumberInfo(num); }}
                                                            >
                                                                {num?.phone_number} ${selectedNumber === num?.phone_number && <CircleCheckBig className="h-5 w-5 text-blue-500" />}
                                                            </div>
                                                        ))}
                                            </div>
                                        )
                                    }

                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            className="rounded-2xl w-1/2"
                                            onClick={() => setStep(1)}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="w-1/2 rounded-2xl bg-black text-white font-medium"
                                            onClick={handleSubmit}
                                        >

                                            <span>Provision Number</span>
                                        </Button>
                                    </div>

                                    <p className="text-center text-xs text-gray-400 mt-6">
                                        This number will be dedicated to your AI agent
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
      );
  }
};

export default CallForwordingModal;