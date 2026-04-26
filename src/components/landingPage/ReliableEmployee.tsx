import CommonWrapper from "@/common/CommonWrapper";
import { Clock, Zap, Calendar, Droplet, Globe, BarChart3 } from "lucide-react";

const ReliableEmployee = () => {
    const features = [
        {
            title: "24/7 Call Answering",
            content: "Never miss a call. Bizzy picks up every time, even nights and weekends. Or just when you're busy. You choose.",
            Icon: Clock,
        },
        {
            title: "Insurance Verification",
            content: "Collects insurance details and verifies coverage before appointments automatically.",
            Icon: Zap,
        },
        {
            title: "Smart Appointment Booking",
            content: "AI schedules appointments, sends reminders, and handles rescheduling instantly.",
            Icon: Calendar,
        },
        {
            title: "Prescription Refills",
            content: "Routes refill requests to pharmacy and confirms with patients seamlessly.",
            Icon: Droplet,
        },
        {
            title: "Multilingual Support",
            content: "English, Arabic, and other languages help patients feel understood instantly.",
            Icon: Globe,
        },
        {
            title: "Analytics Dashboard",
            content: "Track calls answered, appointments booked, peak times, and missed opportunities.",
            Icon: BarChart3,
        },
    ];

    return (
        <section className="py-20 bg-white">
            <CommonWrapper>
                {/* Header */}
                <div className="text-center mb-16 lg:mb-20" data-aos="fade-up">
                    <h2 className="font-dm-sans font-medium text-[32px] md:text-[48px] leading-tight text-center mb-6">
                        <span className="text-black text-center">Your clinic's </span>
                        <span className="text-[#00EEFF]">most <br /> reliable employee.</span>
                    </h2>
                    <p className="text-[#555] font-dm-sans text-xl md:text-2xl font-normal text-center max-w-[900px] mx-auto leading-normal px-4">
                        Always on. Never tired. Perfectly trained. Never calls in sick.
                    </p>
                </div>

                {/* Grid */}
                <div data-aos="fade-up" data-aos-delay="200" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-[#A6F7EF] border-dashed rounded-[16px] overflow-hidden">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className={`p-5 lg:p-6 border-[#A6F7EF] border-dashed transition-all hover:bg-[#FAFBFB]/50
                                /* Mobile borders */
                                border-b last:border-b-0
                                /* Tablet borders (2 cols) */
                                md:[&:nth-child(2n)]:border-l md:[&:nth-child(2n+1)]:border-r-0
                                md:[&:nth-child(-n+4)]:border-b md:[&:nth-child(n+5)]:border-b-0
                                /* Desktop borders (3 cols) */
                                lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n-1)]:border-r lg:[&:nth-child(3n-2)]:border-r
                                lg:[&:nth-child(-n+3)]:border-b lg:[&:nth-child(n+4)]:border-b-0
                            `}
                        >
                            <div className="mb-6">
                                <feature.Icon className="text-[#00EEFF]" size={34} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-dm-sans font-medium text-[28px] text-black mb-4">
                                {feature.title}
                            </h3>
                            <p className="font-geist text-lg text-[#555] leading-relaxed">
                                {feature.content}
                            </p>
                        </div>
                    ))}
                </div>
            </CommonWrapper>
        </section>
    );
};

export default ReliableEmployee;
