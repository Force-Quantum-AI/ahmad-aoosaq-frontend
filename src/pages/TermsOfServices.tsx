import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

const sections = [
    {
        title: "1. Acceptance of Terms",
        content: [
            `By accessing or using CHYR's AI voice services ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. These Terms apply to all users, including businesses and individuals who access the Service.`,
        ],
    },
    {
        title: "2. Description of Service",
        content: [
            `CHYR provides AI-powered voice services designed to handle inbound calls, manage appointments, process reservations, and respond to customer inquiries on behalf of businesses. The Service is provided "as is" and may be updated, modified, or discontinued at any time.`,
        ],
    },
    {
        title: "3. Account Registration",
        content: [
            `To access certain features, you must create an account and provide accurate, complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your account.`,
        ],
    },
    {
        title: "4. Acceptable Use",
        content: [
            `You agree not to use the Service to violate any applicable laws or regulations; transmit spam, unsolicited messages, or harmful content; impersonate any person or entity; interfere with the security or integrity of our systems; collect or harvest data without authorization; or engage in any activity that disrupts or damages the Service.`,
            `CHYR reserves the right to suspend or terminate accounts that violate these terms without notice.`,
        ],
    },
    {
        title: "5. Subscription & Billing",
        content: [
            `Access to certain features requires a paid subscription. Fees are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law or as expressly stated in our refund policy. We reserve the right to change pricing with 30 days' written notice.`,
        ],
    },
    {
        title: "6. Intellectual Property",
        content: [
            `All content, technology, and intellectual property related to the Service — including but not limited to AI models, software, logos, and documentation — remain the exclusive property of CHYR AI Inc. You are granted a limited, non-exclusive, non-transferable license to use the Service solely for your internal business purposes.`,
        ],
    },
    {
        title: "7. Confidentiality & Data",
        content: [
            `You retain ownership of any data you provide to the Service ("Customer Data"). By using the Service, you grant CHYR a limited license to process Customer Data solely to deliver the Service. We handle all data in accordance with our Privacy Policy. Call recordings and transcripts may be stored as part of the Service and are subject to your subscription terms.`,
        ],
    },
    {
        title: "8. Disclaimer of Warranties",
        content: [
            `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. CHYR DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES. USE OF THE SERVICE IS AT YOUR SOLE RISK.`,
        ],
    },
    {
        title: "9. Limitation of Liability",
        content: [
            `TO THE MAXIMUM EXTENT PERMITTED BY LAW, CHYR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE. IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE FEES PAID BY YOU IN THE THREE MONTHS PRECEDING THE CLAIM.`,
        ],
    },
    {
        title: "10. Termination",
        content: [
            `Either party may terminate these Terms at any time with written notice. Upon termination, your access to the Service will cease and we may delete your account data after a reasonable retention period. Sections relating to intellectual property, disclaimers, and limitation of liability survive termination.`,
        ],
    },
    {
        title: "11. Governing Law",
        content: [
            `These Terms are governed by and construed in accordance with the laws of the jurisdiction where CHYR AI Inc. is registered, without regard to its conflict of law principles. Any disputes shall be resolved through binding arbitration or competent courts in that jurisdiction.`,
        ],
    },
    {
        title: "12. Changes to Terms",
        content: [
            `We may update these Terms from time to time. We will notify you of material changes by posting a notice on our website or emailing you. Continued use of the Service after changes become effective constitutes your acceptance of the updated Terms.`,
        ],
    },
    {
        title: "13. Contact",
        content: [
            `For questions about these Terms, please contact us at:\n\nEmail: legal@chyr.ai\nAddress: CHYR AI Inc., [Business Address]`,
        ],
    },
];

const TermsOfServices = () => {
    const navigate = useNavigate();
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#080808",
                fontFamily: "Geist, sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Subtle radial glow */}
            <div
                style={{
                    position: "fixed",
                    top: "-20%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "900px",
                    height: "600px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(ellipse, rgba(255,205,114,0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />

            <div
                style={{
                    maxWidth: "780px",
                    margin: "0 auto",
                    padding: "60px 24px 100px",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "rgba(255,255,255,0.45)",
                        textDecoration: "none",
                        fontSize: "14px",
                        marginBottom: "48px",
                        transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.85)")
                    }
                    onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)")
                    }
                >
                    <ArrowLeft size={15} />
                    Back to Home
                </button>

                {/* Header */}
                <div style={{ marginBottom: "52px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "20px",
                        }}
                    >
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "10px",
                                background: "rgba(255,205,114,0.1)",
                                border: "1px solid rgba(255,205,114,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <FileText size={18} color="#FFCD72" />
                        </div>
                        <span
                            style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "#FFCD72",
                            }}
                        >
                            Legal
                        </span>
                    </div>

                    <h1
                        style={{
                            fontSize: "clamp(32px, 5vw, 48px)",
                            fontWeight: 700,
                            color: "#fff",
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                            marginBottom: "16px",
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Terms of Service
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px", lineHeight: 1.6 }}>
                        Last updated: March 25, 2026
                    </p>
                    <p
                        style={{
                            color: "rgba(255,255,255,0.55)",
                            fontSize: "16px",
                            lineHeight: 1.75,
                            marginTop: "16px",
                        }}
                    >
                        Please read these Terms of Service carefully before using CHYR's AI voice platform.
                        By accessing or using our services, you agree to be bound by these terms.
                    </p>
                </div>

                {/* Divider */}
                <div
                    style={{
                        height: "1px",
                        background:
                            "linear-gradient(90deg, rgba(255,205,114,0.25) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)",
                        marginBottom: "52px",
                    }}
                />

                {/* Sections */}
                <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
                    {sections.map((section, idx) => (
                        <div key={idx}>
                            <h2
                                style={{
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    color: "#fff",
                                    marginBottom: "14px",
                                    fontFamily: "'DM Sans', sans-serif",
                                }}
                            >
                                {section.title}
                            </h2>
                            {section.content.map((para, pIdx) => (
                                <p
                                    key={pIdx}
                                    style={{
                                        color: "rgba(255,255,255,0.55)",
                                        fontSize: "15px",
                                        lineHeight: 1.8,
                                        marginBottom: pIdx < section.content.length - 1 ? "12px" : 0,
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    {para}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div
                    style={{
                        marginTop: "72px",
                        padding: "32px",
                        borderRadius: "16px",
                        border: "1px solid rgba(255,255,255,0.07)",
                        background: "rgba(255,255,255,0.02)",
                        textAlign: "center",
                    }}
                >
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: 1.7 }}>
                        Have questions about our Terms?{" "}
                        <Link
                            to="/contact"
                            style={{ color: "#FFCD72", textDecoration: "none", fontWeight: 500 }}
                        >
                            Get in touch →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServices;
