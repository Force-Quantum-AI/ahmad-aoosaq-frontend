import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSetCallForwardingNumberMutation, useUpdateCallForwardingSetupWithNumberWithWhenToAnswerMutation } from "@/store/features/phone/phone.api";
import { PhoneCall, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    id: number;
};

const carriers = ["AT&T", "Verizon", "T-Mobile", "US Cellular", "Other / Not listed"];

const CallForwardingSetupModal = ({ isOpen, setIsOpen, id }: Props) => {
    // const [updateCallForwardingSetupWithNumberWithWhenToAnswer,{isLoading}]=useUpdateCallForwardingSetupWithNumberWithWhenToAnswerMutation()
    const [setCallForwardingNumber,{isLoading}]=useSetCallForwardingNumberMutation()

    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        phoneNumber: "",
        phoneType: "Mobile phone",
        carrier: "",
        forwardType: "dont_answer",
        completed: false,
    });

    const update = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const bizzyNumber = "+9216502500287";
    const cancelCode = "*93";

    const phoneTypes = ["Mobile phone", "Internet phone (VoIP)", "Landline"];

    console.log(id);
    

    // for copying number 
    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Number copied to clipboard");
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    const handleSubmit = async () => {
        if (!formData.phoneNumber) {
            toast.error("Please enter your phone number");
            return;
        }
        try {
            // await updateCallForwardingSetupWithNumberWithWhenToAnswer({ call_forwarding_number: formData.phoneNumber, id })
            await setCallForwardingNumber({ current_number: formData.phoneNumber})
            toast.success("Call forwarding setup successfully.");
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to setup call forwarding.");
            console.log(error);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="w-full max-w-md bg-white rounded-2xl shadow-xl p-0 overflow-hidden">

                <div className="p-8">

                    {/* HEADER */}
                    <div className="text-center mb-6">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 shadow">
                            <PhoneCall size={24} />
                        </div>

                        <h1 className="text-lg font-semibold text-gray-900">
                            Set Up Call Forwarding
                        </h1>
                    </div>

                    {/* STEP 1 */}
                    {step === 1 && (
                        <>
                            <p className="text-sm text-gray-500 mb-3">
                                What's your current business phone number?
                            </p>

                            <input
                                type="text"
                                placeholder="(555) 123-4567"
                                value={formData.phoneNumber}
                                onChange={(e) => update("phoneNumber", e.target.value)}
                                className="w-full border rounded-xl px-4 py-2 mb-6"
                            />

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="w-1/2 rounded-xl"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Back
                                </Button>

                                <Button
                                    className="w-1/2 bg-black text-white rounded-xl"
                                    // onClick={() => setStep(2)}
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Continue"}
                                </Button>
                            </div>
                        </>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <>
                            <p className="text-sm text-gray-600 mb-4">
                                What type of phone is this?
                            </p>

                            <div className="space-y-3 mb-6">
                                {phoneTypes.map((type) => (
                                    <div
                                        key={type}
                                        onClick={() => update("phoneType", type)}
                                        className={`border rounded-xl px-4 py-2 cursor-pointer ${formData.phoneType === type
                                            ? "border-black text-black"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        {type}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="w-1/2 rounded-xl"
                                    onClick={() => setStep(1)}
                                >
                                    Back
                                </Button>

                                <Button
                                    className="w-1/2 bg-black text-white rounded-xl"
                                    onClick={() => setStep(3)}
                                >
                                    Continue
                                </Button>
                            </div>
                        </>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <>
                            <p className="text-sm text-gray-600 mb-4">
                                Select your carrier:
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {carriers.map((carrier) => (
                                    <div
                                        key={carrier}
                                        onClick={() => update("carrier", carrier)}
                                        className={`border rounded-xl px-4 py-2 text-center cursor-pointer ${formData.carrier === carrier
                                            ? "border-black text-black"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        {carrier}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="w-1/2 rounded-xl"
                                    onClick={() => setStep(2)}
                                >
                                    Back
                                </Button>

                                <Button
                                    className="w-1/2 bg-black text-white rounded-xl"
                                    onClick={() => setStep(4)}
                                >
                                    Continue
                                </Button>
                            </div>
                        </>
                    )}

                    {/* STEP 4 */}
                    {step === 4 && (
                        <>
                            <p className="text-sm text-gray-600 mb-4">
                                When should calls forward to CHYR?
                            </p>

                            <div className="space-y-3 mb-6">
                                <div
                                    onClick={() => update("forwardType", "dont_answer")}
                                    className={`border rounded-xl px-4 py-2 cursor-pointer ${formData.forwardType === "dont_answer"
                                        ? "border-black"
                                        : "text-gray-400"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="min-h-4 min-w-4 rounded-full border-3 border-gray-300 flex items-center justify-center">
                                            {formData.forwardType === "dont_answer" && (
                                                <div className="h-3 w-3 rounded-full bg-black"></div>
                                            )}
                                        </div>
                                        <div className="">
                                            When I don't answer
                                            <p className="text-xs text-gray-400">
                                                Recommended — forwards after 4–5 rings
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* <div
                                    onClick={() => update("forwardType", "always")}
                                    className={`border rounded-xl px-4 py-2 cursor-pointer ${formData.forwardType === "always"
                                        ? "border-black"
                                        : "text-gray-400"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="min-h-4 min-w-4 rounded-full border-3 border-gray-300 flex items-center justify-center">
                                            {formData.forwardType === "always" && (
                                                <div className="h-3 w-3 rounded-full bg-black"></div>
                                            )}
                                        </div>
                                        <div className="">
                                            Always forward all calls
                                            <p className="text-xs text-gray-400">
                                                All calls go directly to Bizzy
                                            </p>
                                        </div>
                                    </div>
                                </div> */}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="w-1/2 rounded-xl"
                                    onClick={() => setStep(3)}
                                >
                                    Back
                                </Button>

                                <Button
                                    className="w-1/2 bg-black text-white rounded-xl"
                                    onClick={() => setStep(5)}
                                >
                                    Show Instructions
                                </Button>
                            </div>
                        </>
                    )}

                    {/* STEP 5 */}
                    {step === 5 && (
                        <>
                            <p className="text-sm text-gray-600 mb-2">
                                US Cellular Forwarding Setup
                            </p>

                            <p className="text-xs text-gray-400 mb-2">
                                From your phone, dial:
                            </p>

                            <div className="flex items-center justify-between border rounded-xl px-4 py-2 mb-2">
                                <span>{bizzyNumber}</span>
                                <Copy size={16} onClick={() => handleCopy(bizzyNumber)} />
                            </div>

                            <p className="text-xs text-gray-400 mb-4">
                                Press Call. You'll hear a confirmation tone or message.
                            </p>
                            <p className="text-xs text-gray-400 mb-2">
                                To turn off later, dial:
                            </p>

                            <div className="flex items-center justify-between border rounded-xl px-4 py-2 mb-4">
                                <span>{cancelCode}</span>
                                <Copy size={16} onClick={() => handleCopy(cancelCode)} />
                            </div>

                            <label className="flex items-center gap-2 mb-6 text-sm">
                                <input
                                    type="checkbox"
                                    checked={formData.completed}
                                    onChange={(e) => update("completed", e.target.checked)}
                                />
                                I've set up forwarding
                            </label>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="w-1/2 rounded-xl"
                                    onClick={() => setStep(4)}
                                >
                                    Back
                                </Button>

                                <Button
                                    className="w-1/2 bg-black text-white rounded-xl"
                                    onClick={handleSubmit}
                                >
                                    Done
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CallForwardingSetupModal;