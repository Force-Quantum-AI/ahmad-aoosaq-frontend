import { Check, Play } from 'lucide-react';

const BookingHeroComponent = () => {
    return (
        <div data-aos="fade-right" className="relative flex flex-col items-center justify-center w-full h-full p-8 overflow-hidden text-white  rounded-3xl">

            {/* Background "24/7" Watermark */}
            <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                <span className="text-[20rem] font-bold text-white/5 leading-none">
                    24/7
                </span>
            </div>

            {/* Top Badge */}
            <div className="z-10 flex items-center gap-2 px-4 py-1 mb-8 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-gray-400">Live on Spontaine Network</span>
            </div>

            {/* Main Heading */}
            <div className="z-10 mb-6 text-center">
                <h1 className="text-3xl lg:text-5xl font-semibold tracking-tight xl:text-6xl">
                    Never miss<br />
                    <span className="text-gray-400">another</span> <span className="text-white">booking.</span>
                </h1>
                <p className="max-w-md mx-auto mt-6 text-sm leading-relaxed text-gray-500">
                    Deploy AI voice agents in minutes. Handle calls 24/7 in <br />
                    Arabic and English — even when you're not there.
                </p>
            </div>

            {/* Feature Badges */}
            <div className="z-10 flex flex-wrap justify-center gap-3 mb-12">
                {['No credit card', 'Setup in 5min', '14 days free'].map((text) => (
                    <div key={text} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full bg-white/5">
                        <Check className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-300">{text}</span>
                    </div>
                ))}
            </div>

            {/* AI Agent Card (Khalid) */}
            <div className="z-10 w-full max-w-lg p-6 border border-white/10 rounded-3xl  shadow-2xl">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-xl font-medium text-white">Khalid</h3>
                        <p className="text-sm italic text-gray-500">Warm & Friendly</p>
                    </div>
                    <span className="px-3 py-1 text-[10px] tracking-widest text-gray-400 uppercase border border-white/10 rounded-md">
                        HOSPITALITY
                    </span>
                </div>

                {/* Audio Visualizer Placeholder */}
                <div className="flex items-center gap-1 mb-3 h-12 w-fit">
                    {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.4, 0.6, 0.3, 0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.4, 0.6, 0.3].map((h, i) => (
                        <div key={i} className="flex-1 bg-white/30 rounded-full w-1!" style={{ height: `${h * 100}%` }} />
                    ))}
                </div>

                <div className="flex items-center justify-between mt-8">
                    <span className="text-lg tracking-widest text-gray-300">+973 • • • • 4820</span>
                    <button className="p-3 transition-colors rounded-full bg-white/10 hover:bg-white/20">
                        <Play className="w-4 h-4 fill-white" />
                    </button>
                </div>

                <hr className="my-6 border-white/5" />

                <div className="flex items-center gap-5">
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Network</p>
                        <p className="text-sm font-medium">Spontaine</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter text-center">Languages</p>
                        <div className="flex gap-1">
                            <span className="px-2 py-0.5 text-xs bg-white text-black rounded font-bold">EN</span>
                            <span className="px-2 py-0.5 text-xs bg-white/20 text-white rounded font-bold">AR</span>
                        </div>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Status</p>
                        <div className="w-10 h-5 bg-green-500 rounded-full relative ml-auto">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="z-10 grid grid-cols-3 w-full max-w-sm mt-2 md:mt-4 xl:mt-12 border-t border-white/10 pt-6">
                <div className="text-center">
                    <p className="text-2xl font-bold">2,400+</p>
                    <p className="text-[10px] text-gray-500 uppercase">Call handled</p>
                </div>
                <div className="text-center border-x border-white/10">
                    <p className="text-2xl font-bold">98%</p>
                    <p className="text-[10px] text-gray-500 uppercase">Answer rate</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold">24/7</p>
                    <p className="text-[10px] text-gray-500 uppercase">Always on</p>
                </div>
            </div>
        </div>
    );
};

export default BookingHeroComponent;