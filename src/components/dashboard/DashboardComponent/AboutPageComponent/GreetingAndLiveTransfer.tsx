import {
  MessageSquareMore,
  PhoneCall,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useUpdateTransferNumberMutation,
  useGetGreetingQuery,
  useUpdateGreetingMutation,
} from "@/store/features/agent/agent.api";
import IntakeQuestion from "./IntakeQuestion";
import TestCallPopup from "../../TestCallPopup";

// interface GreetingData {
//   id: number;
//   business: number;
//   agent: number;
//   number: string;
//   maximum_call_duration: number;
//   created_at: string;
// }

export default function GreetingAndLiveTransfer() {
  const [isGreetingModalOpen, setIsGreetingModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [greetingText, setGreetingText] = useState("");
  const [transferNumber, setTransferNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTestCallModalOpen, setIsTestCallModalOpen] = useState(false);

  // RTK Query hooks
  // const { data: transferNumberData, isLoading: transferLoading } =
  //   useGetTransferNumberQuery({});
  const { data: greetingData, isLoading: greetingLoading } =
    useGetGreetingQuery({});
  const [updateTransferNumber, { isLoading: isUpdatingTransfer }] =
    useUpdateTransferNumberMutation();
  const [updateGreeting, { isLoading: isUpdatingGreeting }] =
    useUpdateGreetingMutation();

  // Handle greeting modal open
  const handleOpenGreetingModal = () => {
    setGreetingText(
      greetingData?.greeting_message || ""
    );
    setErrors({});
    setIsGreetingModalOpen(true);
  };

  // Handle greeting modal close
  const handleCloseGreetingModal = () => {
    setIsGreetingModalOpen(false);
    setGreetingText("");
    setErrors({});
  };

  // Handle transfer modal open
  // const handleOpenTransferModal = () => {
  //   setTransferNumber((greetingData as GreetingData)?.number || "");
  //   setErrors({});
  //   setIsTransferModalOpen(true);
  // };

  // Handle transfer modal close
  const handleCloseTransferModal = () => {
    setIsTransferModalOpen(false);
    setTransferNumber("");
    setErrors({});
  };

  // Handle greeting save
  const handleSaveGreeting = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!greetingText.trim()) {
      newErrors.greeting = "Greeting message is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateGreeting({
        data: {
          greeting_message: greetingText,
        },
      }).unwrap();
      handleCloseGreetingModal();
    } catch (error) {
      console.error("Error saving greeting:", error);
      setErrors({ greeting: "Failed to save greeting. Please try again." });
    }
  };

  // Handle transfer number save
  const handleSaveTransferNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!transferNumber.trim()) {
      newErrors.transfer = "Transfer number is required";
    }

    // Basic phone number validation
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (transferNumber.trim() && !phoneRegex.test(transferNumber)) {
      newErrors.transfer = "Please enter a valid phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateTransferNumber({
        data: {
          number: transferNumber,
        },
      }).unwrap();
      handleCloseTransferModal();
    } catch (error) {
      console.error("Error saving transfer number:", error);
      setErrors({ transfer: "Failed to save transfer number. Please try again." });
    }
  };

  return (
    <>
      <main className="mt-14 pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-8">
          {/* Left Column */}
          <div className="flex flex-col gap-10">
            {/* Greeting Section */}
            <div
              className="rounded-3xl p-8 shadow-sm"
              style={{
                background: `radial-gradient(ellipse 70% 60% at top right, rgba(80, 80, 80, 0.45) 0%, #000000 70%)`,
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-normal text-white">Greeting</h2>
                  <p className="text-[#9E9E9E] text-lg mt-1">
                    How your agent greets callers
                  </p>
                </div>
              </div>

              {/* Greeting Message */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-8 pt-4 border-t border-[#333]/50">
                  <label className="text-white text-xl font-normal">
                    Greeting Message
                  </label>
                  <button
                    onClick={handleOpenGreetingModal}
                    disabled={greetingLoading}
                    className="flex items-center cursor-pointer gap-2 px-6 py-3 text-base bg-[#0D7EFD] hover:bg-blue-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageSquareMore size={18} />
                    Edit
                  </button>
                </div>

                {/* Loading state */}
                {greetingLoading ? (
                  <div className="h-56 p-6 rounded-xl border border-[rgba(50,50,50,0.2)] bg-[#0D0D0D] flex items-center justify-center">
                    <Loader2 size={24} className="text-[#0E7DFA] animate-spin" />
                  </div>
                ) : (
                  <div className="h-56 p-6 rounded-xl border border-[rgba(50,50,50,0.2)] bg-[#0D0D0D] overflow-y-auto">
                    <p className="text-gray-400 text-lg mt-1 leading-relaxed">
                      {greetingData?.greeting_message ||
                        "No greeting message set yet"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Intake Questions Section */}
            <IntakeQuestion />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-10">
            {/* Live Transfer Section */}

            {/* <div
              className="rounded-3xl p-8 shadow-sm"
              style={{
                background: `radial-gradient(ellipse 70% 60% at top right, rgba(80, 80, 80, 0.45) 0%, #000000 70%)`,
              }}
            >
              <h2 className="text-2xl font-normal text-white mb-1">
                Live Transfer
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                What happens when your agent can't help
              </p>


              {!transferLoading && !transferNumberData?.number ? (
                <div className="bg-[#0D0D0D] p-4 mb-10 rounded-2xl border border-red-500/20">
                  <h2 className="text-[#B50606] text-lg mb-4 flex items-center gap-2">
                    <TriangleAlert />
                    Phone Number Required
                  </h2>
                  <p className="text-[#9E9E9E] mb-6">
                    You need to provision a phone number before you can set up live
                    call transfers. Live transfers require an active Bizzy phone
                    number to forward calls.
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={handleOpenTransferModal}
                      className="text-[#0E7DFA] text-sm font-medium flex items-center gap-2 hover:text-blue-400 transition-colors"
                    >
                      <PhoneCall size={16} />
                      Set up phone number
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0D0D0D] p-4 mb-10 rounded-2xl border border-green-500/20">
                  <h2 className="text-green-500 text-lg mb-2 flex items-center gap-2 font-medium">
                    <PhoneCall size={18} />
                    Phone Number Configured
                  </h2>
                  <p className="text-[#9E9E9E] text-sm">
                    {transferNumberData?.number}
                  </p>
                </div>
              )}


              <div className="mb-6">
                <label className="text-white text-2xl font-medium block mb-3">
                  Transfer Number
                </label>


                {transferLoading ? (
                  <div className="w-full px-4 py-4 rounded-2xl bg-[#0D0D0D] border border-[rgba(50,50,50,0.2)] flex items-center justify-center min-h-12">
                    <Loader2 size={20} className="text-[#0E7DFA] animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="w-full px-4 py-4 rounded-2xl text-white bg-[#0D0D0D] border border-[rgba(50,50,50,0.2)]">
                      {transferNumberData?.number ||
                        "No transfer number set"}
                    </div>
                    <button
                      onClick={handleOpenTransferModal}
                      className="mt-3 text-[#0E7DFA] text-sm font-medium hover:text-blue-400 transition-colors"
                    >
                      Edit Transfer Number
                    </button>
                  </>
                )}

                <p className="text-gray-400 text-base mt-4 mb-4">
                  When transfer conditions are met, calls will be forwarded to this
                  number.
                </p>
              </div>
            </div> */}

            {/* Agent Personality Section */}
            <div
              className="rounded-3xl p-8 shadow-sm"
              style={{
                background: `radial-gradient(ellipse 70% 60% at top right, rgba(80, 80, 80, 0.45) 0%, #000000 70%)`,
              }}
            >
              <h2 className="text-2xl font-normal text-white mb-1">
                Agent Personality
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                Define your agent's tone and behavior
              </p>

              {/* Personality traits */}
              <div className="bg-black rounded-2xl overflow-hidden">
                {[
                  { label: "Tone", value: "Warm & Friendly" },
                  { label: "Formality", value: "Professional" },
                  { label: "Response Length", value: "Concise" },
                  { label: "Escalation", value: "After 2 failed attempts" },
                ].map((item, index, arr) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between py-5 px-4 ${
                      index !== arr.length - 1
                        ? "border-b border-white/5"
                        : ""
                    }`}
                  >
                    <span className="text-gray-400 text-base">{item.label}</span>
                    <span className="text-white text-base font-medium">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Greeting Modal */}
      <Dialog open={isGreetingModalOpen} onOpenChange={handleCloseGreetingModal}>
        <DialogContent className="sm:max-w-md bg-[#1a1a1a] border border-[#3a3a3a] text-white">
          <DialogHeader>
            <DialogTitle>Edit Greeting Message</DialogTitle>
            <DialogDescription className="text-[#9E9E9E]">
              Update how your agent greets callers
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveGreeting} className="space-y-4">
            {/* Error Message */}
            {errors.greeting && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400">{errors.greeting}</p>
              </div>
            )}

            {/* Greeting Text Input */}
            <div className="space-y-2">
              <label htmlFor="greeting" className="text-sm font-medium text-[#9E9E9E]">
                Greeting Message *
              </label>
              <textarea
                id="greeting"
                value={greetingText}
                onChange={(e) => setGreetingText(e.target.value)}
                placeholder="e.g., Hello! You've reached Luxe Home Services..."
                rows={6}
                className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white placeholder-[#666] focus:outline-none focus:border-[#0E7DFA] focus:ring-1 focus:ring-[#0E7DFA] transition-colors resize-none"
              />
              <p className="text-xs text-[#666]">
                {greetingText.length}/500 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#3a3a3a]">
              <button
                type="button"
                onClick={handleCloseGreetingModal}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white text-sm font-medium hover:bg-[#1e1e1e] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingGreeting}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0E7DFA] hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdatingGreeting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Greeting"
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transfer Number Modal */}
      <Dialog open={isTransferModalOpen} onOpenChange={handleCloseTransferModal}>
        <DialogContent className="sm:max-w-md bg-[#1a1a1a] border border-[#3a3a3a] text-white">
          <DialogHeader>
            <DialogTitle>Set Transfer Number</DialogTitle>
            <DialogDescription className="text-[#9E9E9E]">
              Enter the phone number where calls will be transferred
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveTransferNumber} className="space-y-4">
            {/* Error Message */}
            {errors.transfer && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400">{errors.transfer}</p>
              </div>
            )}

            {/* Transfer Number Input */}
            <div className="space-y-2">
              <label htmlFor="transfer" className="text-sm font-medium text-[#9E9E9E]">
                Phone Number *
              </label>
              <input
                id="transfer"
                type="tel"
                value={transferNumber}
                onChange={(e) => setTransferNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white placeholder-[#666] focus:outline-none focus:border-[#0E7DFA] focus:ring-1 focus:ring-[#0E7DFA] transition-colors"
              />
              <p className="text-xs text-[#666]">
                Enter a valid phone number (e.g., +1-555-123-4567 or (555) 123-4567)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#3a3a3a]">
              <button
                type="button"
                onClick={handleCloseTransferModal}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0d0d0d] border border-[#3a3a3a] text-white text-sm font-medium hover:bg-[#1e1e1e] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingTransfer}
                className="flex-1 px-4 py-2 rounded-lg bg-[#0E7DFA] hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdatingTransfer ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Number"
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sticky "Test Call" bar */}
      <div className="fixed bottom-0 left-0 right-0 -z-0 flex items-center justify-end gap-4 px-8 py-4 bg-gradient-to-t from-black via-black/90 to-transparent border-t border-white/5 backdrop-blur-sm">
        <p className="text-gray-500 text-sm hidden sm:block">
          Ready to test your agent configuration?
        </p>
        <button
          className="relative flex items-center gap-3 px-8 py-3.5 rounded-2xl font-semibold text-base text-white overflow-hidden
            bg-[#0E7DFA] hover:bg-[#1a88ff] transition-colors shadow-lg shadow-blue-500/30
            after:absolute after:inset-0 after:rounded-2xl after:ring-2 after:ring-blue-400/40 after:animate-ping after:pointer-events-none"
          onClick={() => setIsTestCallModalOpen(true)}
        >
          <PhoneCall size={20} />
          Test Call
        </button>
      </div>
      {isTestCallModalOpen && <TestCallPopup onClose={() => setIsTestCallModalOpen(false)} />}
    </>
  );
}