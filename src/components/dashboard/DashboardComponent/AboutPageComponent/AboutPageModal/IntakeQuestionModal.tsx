"use client";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface IntakeQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IntakeQuestionModal({
  isOpen,
  onClose,
}: IntakeQuestionModalProps) {
  const [questionText, setQuestionText] = useState("");
  const [answerType, setAnswerType] = useState("Yes/No");
  const [isRequired, setIsRequired] = useState(true);
  const [whenToAsk, setWhenToAsk] = useState("on-all-calls");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [disqualificationMessage, setDisqualificationMessage] = useState("");

  const serviceOptions = [
    "Commercial Design",
    "Small Repairs & Fixes",
    "Home Upgrades",
    "Window Treatment Installations",
    "Pre-Sale & Move-In Ready Touch-Ups",
    "Punch List Completion",
    "Free Estimate Consultation",
  ];

  const handleAddQuestion = () => {
    console.log({
      questionText,
      answerType,
      isRequired,
      whenToAsk,
      selectedAnswer,
      disqualificationMessage,
    });
    // Reset modal fields
    setQuestionText("");
    setAnswerType("Yes/No");
    setIsRequired(true);
    setWhenToAsk("on-all-calls");
    setSelectedAnswer("");
    setDisqualificationMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-lg bg-white bg-opacity-80 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-2 ">
          <h2 className="text-lg font-semibold text-gray-900">
            Add Intake Question
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Question Text */}
          <div>
            <label className="text-gray-900 font-medium text-sm block mb-2">
              Question Text
            </label>
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g., Do you have any allergies we should know about?"
              className="w-full px-3 py-4 bg-[#F2F4F5] rounded-2xl text-gray-900 placeholder-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
            />
          </div>

          {/* Answer Type */}
          <div>
            <label className="text-gray-900 font-medium text-sm block mb-3">
              Answer Type
            </label>
            <div className="flex flex-wrap gap-2">
              {["Yes/No", "Text", "Multiple Choice", "Number"].map((type) => (
                <button
                  key={type}
                  onClick={() => setAnswerType(type)}
                  className={`px-3 py-1.5 rounded-full cursor-pointer text-sm font-medium transition ${
                    answerType === type
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Required Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-gray-900 font-medium text-sm">
              Required question
            </label>
            <button
              onClick={() => setIsRequired(!isRequired)}
              className={`relative w-11 h-6 rounded-full transition cursor-pointer ${isRequired ? "toggle-on" : "bg-gray-300"}`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition transform ${isRequired ? "translate-x-5" : ""}`}
              />
            </button>
          </div>

          {/* When to Ask */}
          <div>
            <label className="text-gray-900 font-medium text-sm block mb-3">
              When to Ask
            </label>
            <div className="space-y-3">
              {/* On all booking calls */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="when-to-ask"
                  value="on-all-calls"
                  checked={whenToAsk === "on-all-calls"}
                  onChange={(e) => setWhenToAsk(e.target.value)}
                  className="w-4 h-4 text-gray-900 cursor-pointer"
                />
                <span className="text-gray-900 text-sm font-medium ml-2">
                  On all booking calls
                </span>
              </label>

              {/* Specific services */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="when-to-ask"
                  value="specific-services"
                  checked={whenToAsk === "specific-services"}
                  onChange={(e) => setWhenToAsk(e.target.value)}
                  className="w-4 h-4 text-gray-900 cursor-pointer"
                />
                <span className="text-gray-900 text-sm font-medium ml-2">
                  Only for specific services
                </span>
              </label>
              {whenToAsk === "specific-services" && (
                <div className="mt-2 ml-6 flex flex-wrap gap-2 bg-[#F2F4F5] p-4 rounded-2xl">
                  {serviceOptions.map((service) => (
                    <div
                      key={service}
                      className="px-3 py-2 bg-white text-gray-700 text-sm rounded-xl"
                    >
                      {service}
                    </div>
                  ))}
                  {/* Answer dropdown */}
                  <div className="relative w-full mt-4">
                    <select
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="w-full px-3 py-4 border border-gray-200 rounded-2xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
                    >
                      <option value="">Select an answer...</option>
                      <option value="answer1">Answer 1</option>
                      <option value="answer2">Answer 2</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Disqualification */}
          <div>
            <div className="pt-2 border-t border-gray-200">
              <label className="text-gray-900 font-medium text-sm block mb-2">
                Disqualification (Optional)
              </label>
              <p className="text-gray-600 text-sm mb-3">
                If the caller gives this answer, the agent will take a message
                instead of booking.
              </p>
            </div>
            <div className="pt-2 flex gap-4 border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  value={disqualificationMessage}
                  onChange={(e) => setDisqualificationMessage(e.target.value)}
                  placeholder="Select answer"
                  className=" px-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                />
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              <input
                type="text"
                value={disqualificationMessage}
                onChange={(e) => setDisqualificationMessage(e.target.value)}
                placeholder="e.g I'll take a message for the team..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 cursor-pointer border border-gray-300 text-gray-900 rounded-3xl text-sm font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAddQuestion}
            className="px-6 py-2 cursor-pointer bg-gray-900 hover:bg-gray-800 text-white rounded-3xl text-sm font-medium transition"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}
