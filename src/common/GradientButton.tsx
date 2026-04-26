export default function GradientButton({
    children,
    className = "",
    shadow = true,
    ...props
}: any) {
    return (
        <button
            className={`cursor-pointer text-white py-3 text-xl font-medium px-6 transition-all ${className}`}
            style={{
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.19)",
                background:
                    "radial-gradient(circle at 70% 30%, #00C7D5 0%, #0011ED 100%)",
                boxShadow: shadow ? "0 4px 18px 0 rgba(99, 5, 113, 0.50)" : "none",
            }}
            {...props}
        >
            {children}
        </button>
    );
}
