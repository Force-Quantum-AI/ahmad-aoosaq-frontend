import { useState } from "react";
import { useParams } from "react-router-dom";
import { Search, ChevronDown, RefreshCw, Plus, Pencil, Trash2, Loader2, DollarSign, Clock } from "lucide-react";
import EditServiceModal from "@/components/dashboard/DashboardComponent/DashboardBusinessInfoPageComponent/modal/EditServiceModal";
import {
  useGetServicesQuery,
  useDeleteServicesMutation,
} from "@/store/features/business/business.api";

interface Service {
  id: number;
  business: number;
  name: string;
  category_name: string;
  description: string;
  price: string | number | null;
  duration: string | number | null;
  allow_booking: boolean;
}

export default function DashboardBusinessServicesPage() {
  const { serviceId: rawBusinessId } = useParams();
  const business_id = Number(rawBusinessId) || 1; // Fallback in case it's broken

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: services = [], isLoading, isError, refetch, isFetching } = useGetServicesQuery({ business_id }, { skip: !business_id });
  const [deleteService] = useDeleteServicesMutation();

  const handleAddService = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = async (serviceId: number) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    setDeletingId(serviceId);
    try {
      await deleteService({ business_id, service_id: serviceId }).unwrap();
    } catch (e) {
      console.error(e);
      alert("Failed to delete service.");
    } finally {
      setDeletingId(null);
    }
  };

  // Group services by category
  const categorizedServices = services.reduce((acc: any, service: Service) => {
    const category = service.category_name?.trim() || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {});

  const groups = Object.keys(categorizedServices).map((category) => ({
    category,
    count: categorizedServices[category].length,
    services: categorizedServices[category],
  }));

  return (
    <div className="">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Services
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => refetch()}
              className="text-[#9e9e9e] bg-[#222] p-3 rounded-full cursor-pointer hover:bg-[#333] hover:text-white transition-colors flex items-center justify-center disabled:opacity-50"
              disabled={isFetching}
            >
              <RefreshCw size={15} strokeWidth={1.8} className={isFetching ? "animate-spin" : ""} />
            </button>
            <button 
              onClick={handleAddService}
              className="flex items-center gap-1.5 cursor-pointer bg-[#0E7DFA] hover:bg-blue-600 text-white text-sm font-medium px-4 py-3 rounded-2xl transition-colors"
            >
              <Plus size={16} strokeWidth={2.2} />
              Add Service
            </button>
          </div>
        </div>

        {/* Search / Filter Bar */}
        <div className="flex items-center gap-3 px-5 pt-2 pb-6">
          <div className="flex items-center gap-3 w-full max-w-2xl">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-3 text-sm font-medium bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#0E7DFA] focus:ring-1 focus:ring-[#0E7DFA] transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button className="flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-sm font-medium text-gray-400 hover:border-gray-500 transition-all cursor-pointer">
                All Categories
                <ChevronDown size={16} className="text-gray-400 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Service Groups */}
        <div
          className="rounded-3xl p-6 min-h-[500px]"
          style={{
            background: `radial-gradient(ellipse 70% 60% at top right, rgba(80, 80, 80, 0.45) 0%, #000000 70%)`,
          }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[300px]">
              <Loader2 className="animate-spin text-[#0E7DFA] mb-4" size={32} />
              <p className="text-[#9e9e9e]">Loading services...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-[300px] border border-red-500/20 bg-red-500/5 rounded-2xl">
              <p className="text-red-400 mb-2">Failed to load services</p>
              <button 
                onClick={() => refetch()}
                className="px-4 py-2 bg-[#222] hover:bg-[#333] rounded-lg text-sm text-white transition-colors"
               >
                 Try Again
              </button>
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] border border-dashed border-[#3a3a3a] bg-[#0d0d0d]/40 rounded-2xl">
              <p className="text-[#9e9e9e] mb-4">No services found</p>
              <button 
                onClick={handleAddService}
                className="flex items-center gap-2 px-4 py-2 bg-[#0E7DFA] hover:bg-blue-600 rounded-lg text-sm font-medium text-white transition-colors"
               >
                 <Plus size={16} /> Add your first service
              </button>
            </div>
          ) : (
            groups.map((g, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <div className="flex items-center gap-3 px-5 py-3 mb-2 border-b border-[#333]/50">
                  <span className="text-lg font-medium text-white capitalize">{g.category}</span>
                  <span className="text-xs font-semibold text-[#0E7DFA] bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                    {g.count}
                  </span>
                </div>

                <div className="space-y-3 mt-4">
                  {g.services.map((s: Service) => (
                    <div
                      key={s.id}
                      className="bg-[#151515] hover:bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all py-4 px-3 rounded-2xl mx-5 group"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_100px] gap-4 items-center px-4">
                        <div>
                          <p className="text-base font-medium text-white group-hover:text-[#0E7DFA] transition-colors">{s.name}</p>
                          {s.description && (
                            <p className="text-xs text-[#666] mt-1 line-clamp-1">{s.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign size={14} className="text-[#666]" />
                          <span className={s.price ? "text-sm text-emerald-400 opacity-90" : "text-sm text-amber-500"}>
                            {s.price ? `${Number(s.price).toFixed(2)}` : "Not set"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-[#666]" />
                          <span className="text-sm text-white opacity-80">
                            {s.duration ? `${s.duration} min` : "—"}
                          </span>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditService(s)}
                            className="text-[#9e9e9e] cursor-pointer bg-[#222] p-2 rounded-lg hover:bg-[#333] hover:text-white transition-colors"
                            title="Edit Service"
                          >
                            <Pencil size={15} />
                          </button>

                          <button 
                            onClick={() => handleDeleteService(s.id)}
                            disabled={deletingId === s.id}
                            className="text-[#9e9e9e] cursor-pointer bg-[#222] p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors disabled:opacity-50"
                            title="Delete Service"
                          >
                            {deletingId === s.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <EditServiceModal 
        isOpen={isModalOpen} 
        setIsOpen={setIsModalOpen} 
        business_id={business_id}
        editingService={editingService}
      />
    </div>
  );
}
