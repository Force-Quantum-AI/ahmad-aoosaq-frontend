"use client";
import { useState, useEffect } from "react";
import { ChevronDown, X, Plus, Trash2 } from "lucide-react";
import { useCreateIntakeQuestionNewMutation, useGetIntakeFormOptionsNewQuery } from "@/store/features/agent/agentNew.api";

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
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([""]);
  const [disqualificationRules, setDisqualificationRules] = useState<
    { answer: string; message: string }[]
  >([{ answer: "", message: "" }]);
  const [prevOptions, setPrevOptions] = useState<string[]>([]);

  // RTK Query hooks
  const [createIntakeQuestion, { isLoading }] =
    useCreateIntakeQuestionNewMutation();
  const { data: formOptions, isLoading: optionsLoading } =
    useGetIntakeFormOptionsNewQuery();

  // Extract services and tags from fetched data
  const services = formOptions?.services ?? [];
  const tags = formOptions?.tags ?? [];

  // Sync disqualification rules when options or answer type changes
  useEffect(() => {
    let targetLength = 0;
    let availableAnswers: string[] = [];

    if (answerType === "Multiple Choice") {
      targetLength = options.length;
      availableAnswers = options.filter((opt) => opt.trim() !== "");
    } else if (answerType === "Yes/No") {
      targetLength = 2;
      availableAnswers = ["Yes", "No"];
    } else if (answerType === "Text" || answerType === "Number") {
      targetLength = 1;
    }

    setDisqualificationRules((prev) => {
      let nextRules = [...prev];

      // Sync renames for Multiple Choice
      if (answerType === "Multiple Choice") {
        nextRules = nextRules.map((rule) => {
          const oldIndex = prevOptions.indexOf(rule.answer);
          if (
            oldIndex !== -1 &&
            options[oldIndex] !== undefined &&
            options[oldIndex] !== rule.answer
          ) {
            return { ...rule, answer: options[oldIndex] };
          }
          return rule;
        });
      }

      // Adjust length to match options count (or 2 for Yes/No, or 1 for Text/Number)
      if (nextRules.length > targetLength) {
        nextRules = nextRules.slice(0, targetLength);
      }
      while (nextRules.length < targetLength) {
        nextRules.push({ answer: "", message: "" });
      }

      // Final validation: if answer is no longer in available list, reset it (only for dropdown types)
      if (answerType === "Multiple Choice" || answerType === "Yes/No") {
        return nextRules.map((rule) => {
          if (rule.answer !== "" && !availableAnswers.includes(rule.answer)) {
            return { ...rule, answer: "" };
          }
          return rule;
        });
      }

      return nextRules;
    });
    setPrevOptions(options);
  }, [options, answerType]);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions.length > 0 ? newOptions : [""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleDisqualificationChange = (
    index: number,
    field: "answer" | "message",
    value: string,
  ) => {
    const newRules = [...disqualificationRules];
    newRules[index] = { ...newRules[index], [field]: value };
    setDisqualificationRules(newRules);
  };

  const toggleService = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName],
    );
  };

  const toggleTag = (tagTitle: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagTitle)
        ? prev.filter((t) => t !== tagTitle)
        : [...prev, tagTitle],
    );
  };

  const handleAddQuestion = async () => {
    if (!questionText.trim()) {
      alert("Please enter a question");
      return;
    }

    const answerTypeMap: Record<string, string> = {
      "Yes/No": "yes_no",
      Text: "text",
      "Multiple Choice": "multiple_choice",
      Number: "number",
    };

    const whenToAskMap: Record<string, string> = {
      "on-all-calls": "all_calls",
      "specific-services": "specific_services",
      "specific-tags": "tagged_services",
    };

    const multipleChoicePayload =
      answerType === "Multiple Choice"
        ? options.filter((opt) => opt.trim() !== "")
        : [];

    const specificServicesPayload =
      whenToAsk === "specific-services" ? selectedServices : [];
    const specificTaggedPayload =
      whenToAsk === "specific-tags" ? selectedTags : [];

    const disqualificationRulesPayload = disqualificationRules
      .filter((rule) => rule.answer.trim() !== "" && rule.message.trim() !== "")
      .map((rule) => {
        let disqualifyingValue = rule.answer;
        if (answerType === "Yes/No") {
          disqualifyingValue = rule.answer.toLowerCase();
        }
        return {
          disqualifying_value: disqualifyingValue,
          message_to_caller: rule.message,
        };
      });

    const payload = {
      question: questionText.trim(),
      answer_type: answerTypeMap[answerType],
      multiple_choice: multipleChoicePayload,
      when_to_ask: whenToAskMap[whenToAsk],
      specific_services: specificServicesPayload,
      specific_tagged: specificTaggedPayload,
      is_required: isRequired,
      is_active: true,
      disqualification_rules: disqualificationRulesPayload,
    };

    try {
      await createIntakeQuestion(payload).unwrap();

      // Reset form
      setQuestionText("");
      setAnswerType("Yes/No");
      setIsRequired(true);
      setWhenToAsk("on-all-calls");
      setSelectedServices([]);
      setSelectedTags([]);
      setDisqualificationRules([{ answer: "", message: "" }]);
      setOptions([""]);

      onClose();
    } catch (error) {
      console.error("Failed to create intake question:", error);
      alert("Failed to create question. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[200]">
      <div className="rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-lg bg-white bg-opacity-90 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Add Intake Question
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
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
              className="w-full px-4 py-3 bg-[#F2F4F5] rounded-xl text-gray-900 placeholder-[#9E9E9E] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm transition-all"
              disabled={isLoading}
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
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all ${
                    answerType === type
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Multiple Choice Options */}
          {answerType === "Multiple Choice" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-gray-900 font-medium text-sm block">
                Options
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2 group">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        className="w-full px-4 py-2.5 bg-[#F2F4F5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                        disabled={isLoading}
                      />
                    </div>
                    {options.length > 1 && (
                      <button
                        onClick={() => handleRemoveOption(index)}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove option"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddOption}
                disabled={isLoading}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors mt-3 px-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="p-1 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                  <Plus size={14} />
                </div>
                Add Option
              </button>
            </div>
          )}

          {/* Required Toggle */}
          <div className="flex items-center justify-between py-2">
            <label className="text-gray-900 font-medium text-sm">
              Required question
            </label>
            <button
              onClick={() => setIsRequired(!isRequired)}
              disabled={isLoading}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                isRequired ? "bg-gray-900" : "bg-gray-300"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm ${
                  isRequired ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          {/* When to Ask */}
          <div className="space-y-3">
            <label className="text-gray-900 font-medium text-sm block">
              When to Ask
            </label>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="when-to-ask"
                    value="on-all-calls"
                    checked={whenToAsk === "on-all-calls"}
                    onChange={(e) => setWhenToAsk(e.target.value)}
                    disabled={isLoading}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      whenToAsk === "on-all-calls"
                        ? "border-gray-900"
                        : "border-gray-300"
                    }`}
                  >
                    {whenToAsk === "on-all-calls" && (
                      <div className="absolute inset-1 bg-gray-900 rounded-full" />
                    )}
                  </div>
                </div>
                <span className="text-gray-900 text-sm font-medium ml-3">
                  On all booking calls
                </span>
              </label>

              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="when-to-ask"
                    value="specific-services"
                    checked={whenToAsk === "specific-services"}
                    onChange={(e) => setWhenToAsk(e.target.value)}
                    disabled={isLoading}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      whenToAsk === "specific-services"
                        ? "border-gray-900"
                        : "border-gray-300"
                    }`}
                  >
                    {whenToAsk === "specific-services" && (
                      <div className="absolute inset-1 bg-gray-900 rounded-full" />
                    )}
                  </div>
                </div>
                <span className="text-gray-900 text-sm font-medium ml-3">
                  Only for specific services
                </span>
              </label>

              {whenToAsk === "specific-services" && (
                <div className="mt-2 ml-7 space-y-4 bg-[#F2F4F5] p-4 rounded-2xl animate-in fade-in slide-in-from-left-2 duration-200">
                  {optionsLoading ? (
                    <div className="text-sm text-gray-500 py-2">
                      Loading services...
                    </div>
                  ) : services.length === 0 ? (
                    <div className="text-sm text-gray-500 py-2">
                      No services available
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => toggleService(service.name)}
                          disabled={isLoading}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all cursor-pointer ${
                            selectedServices.includes(service.name)
                              ? "bg-gray-900 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {service.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="when-to-ask"
                    value="specific-tags"
                    checked={whenToAsk === "specific-tags"}
                    onChange={(e) => setWhenToAsk(e.target.value)}
                    disabled={isLoading}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      whenToAsk === "specific-tags"
                        ? "border-gray-900"
                        : "border-gray-300"
                    }`}
                  >
                    {whenToAsk === "specific-tags" && (
                      <div className="absolute inset-1 bg-gray-900 rounded-full" />
                    )}
                  </div>
                </div>
                <span className="text-gray-900 text-sm font-medium ml-3">
                  Only for services tagged
                </span>
              </label>

              {whenToAsk === "specific-tags" && (
                <div className="mt-2 ml-7 space-y-4 bg-[#F2F4F5] p-4 rounded-2xl animate-in fade-in slide-in-from-left-2 duration-200">
                  {optionsLoading ? (
                    <div className="text-sm text-gray-500 py-2">
                      Loading tags...
                    </div>
                  ) : tags.length === 0 ? (
                    <div className="text-sm text-gray-500 py-2">
                      No tags available
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.title)}
                          disabled={isLoading}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all cursor-pointer ${
                            selectedTags.includes(tag.title)
                              ? "bg-gray-900 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {tag.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Disqualification Rules */}
          {disqualificationRules.length > 0 && (
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div>
                <label className="text-gray-900 font-medium text-sm block mb-1">
                  Disqualification (Optional)
                </label>
                <p className="text-gray-500 text-xs">
                  If the caller gives this answer, the agent will take a message
                  instead of booking.
                </p>
              </div>

              <div className="space-y-3">
                {disqualificationRules.map((rule, ruleIndex) => (
                  <div
                    key={ruleIndex}
                    className="flex flex-col sm:flex-row gap-3 group animate-in fade-in slide-in-from-top-1 duration-200"
                  >
                    <div className="relative sm:w-1/3">
                      {answerType === "Text" || answerType === "Number" ? (
                        <input
                          type="text"
                          value={rule.answer}
                          onChange={(e) =>
                            handleDisqualificationChange(
                              ruleIndex,
                              "answer",
                              e.target.value,
                            )
                          }
                          placeholder={
                            answerType === "Text"
                              ? "Answer text"
                              : "Answer number"
                          }
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                          disabled={isLoading}
                        />
                      ) : (
                        <>
                          <select
                            value={rule.answer}
                            onChange={(e) =>
                              handleDisqualificationChange(
                                ruleIndex,
                                "answer",
                                e.target.value,
                              )
                            }
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-gray-900 cursor-pointer hover:border-gray-300 transition-colors"
                            disabled={isLoading}
                          >
                            <option value="">Select answer</option>
                            {answerType === "Multiple Choice" ? (
                              options
                                .filter((opt) => opt.trim() !== "")
                                .map((opt, i) => (
                                  <option key={i} value={opt}>
                                    {opt}
                                  </option>
                                ))
                            ) : answerType === "Yes/No" ? (
                              <>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </>
                            ) : null}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </>
                      )}
                    </div>

                    <div className="flex-1">
                      <input
                        type="text"
                        value={rule.message}
                        onChange={(e) =>
                          handleDisqualificationChange(
                            ruleIndex,
                            "message",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. I'll take a message for the team..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 cursor-pointer border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-white hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleAddQuestion}
            disabled={isLoading}
            className="px-8 py-2.5 cursor-pointer bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding...
              </>
            ) : (
              "Add Question"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
