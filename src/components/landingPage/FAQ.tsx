import { useState } from "react";
import CommonWrapper from "@/common/CommonWrapper";
import { Plus, Minus } from "lucide-react";

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How will appointments be added to our calendar?",
            answer: "The AI agent seamlessly integrates with your existing calendar system (like Google Calendar, Outlook, or Mindbody) to book appointments directly in real-time, preventing double bookings.",
        },
        {
            question: "Can the AI collect insurance information?",
            answer: "Yes, our AI agent can be configured to ask for and collect basic insurance details during the intake process, which are then passed on to your staff or integrated into your EMR.",
        },
        {
            question: "How will the AI handle customers who struggle to speak English?",
            answer: "HYLN's AI is multilingual and can detect the caller's language to respond accordingly, or it can gracefully transfer the call to a human staff member if needed.",
        },
        {
            question: "How would you provide us with support, and do we need to pay for it?",
            answer: "We offer comprehensive 24/7 technical support included in our standard subscription plans. You'll have a dedicated account manager to ensure your AI agent is performing optimally.",
        },
        {
            question: "Will I be able to see a report of how the AI is performing?",
            answer: "Absolutely. You'll have access to a real-time dashboard showing call volumes, appointment conversion rates, common questions asked, and full call transcripts.",
        },
        {
            question: "Is patient data secure and compliant with regulations?",
            answer: "Security is our top priority. Our platform is fully HIPAA and PDPL compliant, ensuring all patient data is encrypted and handled according to the highest industry standards.",
        },
        {
            question: "What happens if a patient has an emergency?",
            answer: "If the AI detects keywords related to a medical emergency, it is programmed to immediately instruct the patient to dial emergency services or transfer them to your on-call urgent line.",
        },
    ];

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-10 bg-white overflow-hidden">
            <CommonWrapper>
                <div className="text-center mb-16 lg:mb-20" data-aos="fade-up">
                    <h2 className="font-dm-sans font-medium text-[32px] md:text-[48px] leading-tight text-center mb-6">
                        <span className="text-black">Frequently </span>
                        <span className="text-[#0BEFFF]">Asked Questions</span>
                    </h2>
                    <p className="text-[#555] font-dm-sans text-xl md:text-2xl font-normal text-center max-w-[900px] mx-auto leading-normal px-4">
                        Still have questions? We've answered some of the most common queries below to help you make an informed decision.
                    </p>
                </div>

                <div className="w-fullmx-auto" data-aos="fade-up">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border-b border-[#F0F0F0] last:border-none"
                        >
                            <button
                                onClick={() => toggleAccordion(idx)}
                                className="w-full py-7 md:py-9 flex items-center justify-between text-left group transition-all cursor-pointer"
                            >
                                <span className={`text-[18px] md:text-[24px] font-dm-sans leading-tight transition-colors ${openIndex === idx ? "text-[#0BEFFF]" : "text-black"}`}>
                                    {faq.question}
                                </span>
                                <div className="flex-shrink-0 ml-4">
                                    {openIndex === idx ? (
                                        <Minus className="text-[#0BEFFF]" size={24} />
                                    ) : (
                                        <Plus className="text-black group-hover:text-[#0BEFFF] transition-colors" size={24} />
                                    )}
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? "max-h-[500px] opacity-100 pb-8 md:pb-10" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <p className="text-[#555] font-dm-sans text-lg md:text-xl leading-relaxed max-w-[1000px]">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CommonWrapper>
        </section>
    );
};

export default FAQ;
