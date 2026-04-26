import { ChevronDown, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetServicesQuery } from "@/store/features/business/business.api";

export default function ServicesSection({ business_id }: { business_id?: number | string }) {
  const navigate = useNavigate();
  const { data: services = [], isLoading, isError } = useGetServicesQuery({ business_id }, { skip: !business_id });

  return (
    <div>
      <div
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 70% 60% at top right, rgba(80, 80, 80, 0.45) 0%, #000000 70%)`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Services</h2>
            <p className="text-sm text-[#9E9E9E] mt-1">
              Services your business offers
            </p>
          </div>
          <button
            onClick={() => navigate(`/dashboard/businessServices/${business_id || 1}`)}
            className="flex items-center cursor-pointer gap-1 bg-[#33384D] hover:bg-[#434963] text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            See all({services?.length || 0})
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="mb-3 mt-8">
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 size={24} className="text-[#0E7DFA] animate-spin mb-3" />
              <p className="text-sm text-[#9E9E9E]">Loading services...</p>
            </div>
          )}

          {isError && (
             <div className="rounded-2xl border border-red-500/20 p-6 flex flex-col items-center justify-center text-center bg-red-500/5 mb-4">
               <p className="text-sm text-red-400">Failed to load services.</p>
             </div>
          )}

          {!isLoading && !isError && services?.length === 0 && (
             <div className="rounded-2xl border border-dashed border-[#3a3a3a] p-8 flex flex-col items-center justify-center text-center min-h-[150px] bg-[#0d0d0d]/40">
               <p className="text-sm font-medium text-[#9E9E9E]">No services added yet</p>
             </div>
          )}

          {!isLoading && !isError && services?.length > 0 && (
            <div className="space-y-3">
              {services.slice(0, 5).map((s: any) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between bg-[#111] border border-transparent hover:border-[#3a3a3a] transition-all rounded-xl px-4 py-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">{s.name}</p>

                    {(s.price === null || s.price === undefined) && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-amber-500 font-medium">
                          Price not set
                        </span>
                        <button
                          onClick={() => navigate(`/dashboard/businessServices/${business_id || 1}`)}
                          className="text-[10px] uppercase tracking-wide text-[#0E7DFA] px-2 py-0.5 rounded-full border border-blue-500/20 bg-[rgba(34,39,50,0.60)] hover:bg-[rgba(14,125,250,0.15)] transition-colors cursor-pointer"
                        >
                          set price
                        </button>
                      </div>
                    )}
                    {s.price !== null && s.price !== undefined && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-emerald-400 font-medium opacity-80">
                          ${s.price}
                        </span>
                      </div>
                    )}
                  </div>

                  {s.category_name && (
                    <span className="text-xs font-medium bg-[#222] px-3 py-1 rounded-full text-[#AAA]">
                      {s.category_name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 w-full">
          <button
            onClick={() => navigate(`/dashboard/businessServices/${business_id || 1}`)}
            className="flex items-center justify-center gap-2 w-full bg-[#0E7DFA] hover:bg-blue-600 text-white text-sm cursor-pointer font-medium px-4 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
          >
            <Plus size={18} />
            Manage Services
          </button>
        </div>
      </div>
    </div>
  );
}
