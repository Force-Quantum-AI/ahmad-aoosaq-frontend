import CommonWrapper from "@/common/CommonWrapper";
// import healthLogos from "@/assets/images/health.png";
import Marquee from "react-fast-marquee";

const images: string[] = [
    "https://cdn.prod.website-files.com/694d1ac7dc0a1e269d102252/69567904d94b315853c6836d_9yAkNdlJs00OuBIBLdcEoOjY3wk.avif",
    "https://cdn.prod.website-files.com/694d1ac7dc0a1e269d102252/6956786885464d08f8514735_j8LlUKTJVsvmFQxYNEKVm6wcqA0.avif",
    "https://cdn.prod.website-files.com/694d1ac7dc0a1e269d102252/69803bfb0b2dbf2dc7e218fe_image%20(13)%201-p-1600.png",
]

const BusinessMiss = () => {
    return (
        <section className="py-10 md:py-20 bg-white">
            <CommonWrapper>
                <div className="flex flex-col items-center text-center space-y-10 md:space-y-[60px]">
                    {/* Top Text Segment */}
                    <div className="max-w-2xl" data-aos="fade-right">
                        <p className="font-geist text-base md:text-[18px] font-normal leading-relaxed md:leading-normal text-[#555555]">
                            Businesses miss an average of 34% of calls per day. HYLN makes that 0%.
                        </p>
                    </div>

                    {/* Bottom Text Segment */}
                    <div data-aos="fade-left">
                        <h2 className="text-xl md:text-[24px] font-normal leading-tight md:leading-normal text-black font-geist">
                            Healthcares that trust Hyln AI Everyday
                        </h2>
                    </div>

                    {/* Logos Image */}
                    <Marquee
                        gradient
                        pauseOnHover
                        autoFill
                    >
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="h-[100px] w-[100px] flex items-center justify-center mx-6"
                            >
                                <img
                                    src={image}
                                    alt=""
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ))}
                    </Marquee>
                </div>
            </CommonWrapper>
        </section>
    );
};

export default BusinessMiss;
