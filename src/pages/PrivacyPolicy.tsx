import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const sections = [
    {
        title: "1. Information We Collect",
        content: [
            `**Personal Information:** When you use our services or contact us, we may collect information you provide directly, including your name, email address, phone number, and business details.`,
            `**Usage Data:** We automatically collect data about how you interact with our platform, including IP addresses, browser type, pages visited, time spent, and referring URLs.`,
            `**Call Data:** As part of our AI voice service, we may process call recordings, transcripts, and metadata to deliver and improve our services. This data is handled with strict confidentiality.`,
            `**Cookies & Tracking:** We use cookies and similar technologies to enhance your experience, analyze traffic, and serve relevant content. You can manage cookie preferences in your browser settings.`,
        ],
    },
    {
        title: "2. How We Use Your Information",
        content: [
            `We use collected information to provide, maintain, and improve our AI voice services; process transactions and send related communications; send operational notices and marketing updates (you can opt out at any time); respond to inquiries and provide customer support; analyze usage patterns to enhance platform performance; and comply with applicable legal obligations.`,
        ],
    },
    {
        title: "3. Information Sharing",
        content: [
            `We do not sell your personal information. We may share data with trusted service providers who assist in operating our platform (under strict confidentiality agreements), business partners with your consent, law enforcement when required by law, and successor entities in the event of a merger or acquisition.`,
        ],
    },
    {
        title: "4. Data Security",
        content: [
            `We implement industry-standard security measures including encryption in transit (TLS) and at rest, access controls and authentication, regular security audits, and employee training on data privacy. While we strive to protect your data, no method of internet transmission is 100% secure.`,
        ],
    },
    {
        title: "5. Data Retention",
        content: [
            `We retain personal data for as long as necessary to provide our services and fulfill legal obligations. Call recordings and transcripts are retained per your subscription terms and deleted upon request. You may request deletion of your account data at any time by contacting us.`,
        ],
    },
    {
        title: "6. Your Rights",
        content: [
            `Depending on your location, you may have the right to access and receive a copy of your personal data, correct inaccurate data, request deletion of your data, opt out of marketing communications, and lodge a complaint with a data protection authority. To exercise these rights, contact us at privacy@chyr.ai.`,
        ],
    },
    {
        title: "7. Third-Party Links",
        content: [
            `Our platform may contain links to third-party websites or services. We are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party sites you visit.`,
        ],
    },
    {
        title: "8. Changes to This Policy",
        content: [
            `We may update this Privacy Policy periodically. We will notify you of significant changes by posting a notice on our website or emailing you. Continued use of our services after changes constitutes acceptance of the updated policy.`,
        ],
    },
    {
        title: "9. Contact Us",
        content: [
            `If you have questions or concerns about this Privacy Policy, please contact us at:\n\nEmail: privacy@chyr.ai\nAddress: CHYR AI Inc., [Business Address]\nPhone: Available through our website contact form`,
        ],
    },
];

const PrivacyPolicy = () => {
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
                            <Shield size={18} color="#FFCD72" />
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
                        Privacy Policy
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
                        At CHYR, we are committed to protecting your privacy. This policy explains how we
                        collect, use, and safeguard your information when you use our AI voice services.
                    </p>
                </div>

                {/* Divider */}
                <div
                    style={{
                        height: "1px",
                        background: "linear-gradient(90deg, rgba(255,205,114,0.25) 0%, rgba(255,255,255,0.05) 60%, transparent 100%)",
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
                                    dangerouslySetInnerHTML={{
                                        __html: para.replace(/\*\*(.*?)\*\*/g, "<strong style='color:rgba(255,255,255,0.8);font-weight:500'>$1</strong>"),
                                    }}
                                />
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
                        Questions about your privacy?{" "}
                        <Link
                            to="/contact"
                            style={{ color: "#FFCD72", textDecoration: "none", fontWeight: 500 }}
                        >
                            Contact our team →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
