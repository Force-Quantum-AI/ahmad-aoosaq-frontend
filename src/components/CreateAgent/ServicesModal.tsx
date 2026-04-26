"use client";

import { useState, useEffect } from "react";
import { FiEdit2, FiX, FiSave } from "react-icons/fi";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useGetServicesQuery, useAddServicesMutation, useUpdateServicesMutation } from "@/store/features/business/business.api";
import { useSelector } from "react-redux";

export interface Service {
    id: string;
    name: string;
    price: string;
    description: string;
    duration: number;
    allow_booking: boolean;
}

interface ServicesModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}

const emptyService = (): Service => ({
    id: Date.now().toString(),
    name: "",
    price: "",
    description: "",
    duration: 0,
    allow_booking: true,
});

export function ServicesModal({ open, onOpenChange }: ServicesModalProps) {
    const businessDataRedux = useSelector((state: any) => state.business);
    const { data: servicesData, isLoading } = useGetServicesQuery({ business_id: businessDataRedux?.id }, {
        skip: !businessDataRedux?.id
    });
    const [addServices] = useAddServicesMutation();
    const [updateServices] = useUpdateServicesMutation();

    const [local, setLocal] = useState<Service[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        if (open && servicesData) {
            setLocal(servicesData.map((s: any) => ({
                id: s.id.toString(),
                name: s.name,
                price: s.price || "",
                description: s.description || "",
                duration: s.duration || 30,
                allow_booking: s.allow_booking !== undefined ? s.allow_booking : true
            })));
        } else if (open && !servicesData && !isLoading) {
            setLocal([]);
        }
    }, [servicesData, open, isLoading]);

    const update = (id: string, field: keyof Service, value: any) => {
        setLocal((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    };

    const addService = () => {
        const ns = emptyService();
        setLocal((prev) => [...prev, ns]);
        setEditingId(ns.id);
    };

    const removeService = (id: string) => {
        setLocal((prev) => prev.filter((s) => s.id !== id));
        if (editingId === id) setEditingId(null);
    };

    const handleSave = async () => {
        if (!businessDataRedux?.id) return;
        
        const valid = local.filter((s) => s.name.trim());
        try {
            for (const s of valid) {
                const isNew = s.id.length > 10;
                const payload = {
                    category: "Serving",
                    name: s.name,
                    description: s.description,
                    price: s.price || "0.00",
                    duration: s.duration || 30,
                    allow_booking: s.allow_booking !== undefined ? s.allow_booking : true
                };
                
                if (isNew) {
                    await addServices({ business_id: businessDataRedux.id, data: payload }).unwrap();
                } else {
                    await updateServices({ business_id: businessDataRedux.id, data: { id: s.id, ...payload } }).unwrap();
                }
            }
            toast.success("Services saved!");
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save services");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl! w-full bg-[#121214] border border-white/10" style={{ height: "90vh", display: "flex", flexDirection: "column", padding: 0 }}>
                <DialogHeader className="px-8 pt-7 pb-4 border-b border-white/10 shrink-0">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold text-white font-geist">Manage Services</DialogTitle>
                        <p className="text-[#9E9E9E] text-xs">{local.length} service{local.length !== 1 ? "s" : ""}</p>
                    </div>
                </DialogHeader>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {local.map((service) => (
                            <div
                                key={service.id}
                                className={`relative bg-[#5D5FEF]/5 border-2 rounded-[16px] p-4 transition-all ${editingId === service.id ? "border-[#5D5FEF]/50 shadow-md" : "border-transparent hover:border-[#5D5FEF]/20"
                                    }`}
                            >
                                {/* Actions */}
                                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                    <button
                                        onClick={() => setEditingId(editingId === service.id ? null : service.id)}
                                        className="w-7 h-7 bg-[#1C1C1E] rounded-full shadow-sm flex items-center justify-center text-[#5D5FEF] hover:bg-[#5D5FEF] hover:text-white transition-all"
                                    >
                                        <FiEdit2 size={12} />
                                    </button>
                                    <button
                                        onClick={() => removeService(service.id)}
                                        className="w-7 h-7 bg-[#1C1C1E] rounded-full shadow-sm flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <FiX size={12} />
                                    </button>
                                </div>

                                {editingId === service.id ? (
                                    /* Edit mode */
                                    <div className="flex flex-col gap-3 pt-6">
                                        <div>
                                            <label className="text-[10px] font-medium text-[#A7A8F4] uppercase tracking-wider">Service Name</label>
                                            <input
                                                autoFocus
                                                value={service.name}
                                                onChange={(e) => update(service.id, "name", e.target.value)}
                                                placeholder="e.g. Commercial Design"
                                                className="w-full mt-1 text-sm text-white bg-transparent border border-[#5D5FEF]/30 rounded-lg px-3 py-2 outline-none focus:border-[#5D5FEF] transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-medium text-[#A7A8F4] uppercase tracking-wider">Price</label>
                                            <input
                                                value={service.price}
                                                onChange={(e) => update(service.id, "price", e.target.value)}
                                                placeholder="e.g. $150/hr or Free"
                                                className="w-full mt-1 text-sm text-white bg-transparent border border-[#5D5FEF]/30 rounded-lg px-3 py-2 outline-none focus:border-[#5D5FEF] transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-medium text-[#A7A8F4] uppercase tracking-wider">Description</label>
                                            <textarea
                                                value={service.description}
                                                onChange={(e) => update(service.id, "description", e.target.value)}
                                                placeholder="Brief description…"
                                                rows={3}
                                                className="w-full mt-1 text-sm text-white bg-transparent border border-[#5D5FEF]/30 rounded-lg px-3 py-2 outline-none focus:border-[#5D5FEF] transition-colors resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-medium text-[#A7A8F4] uppercase tracking-wider">Duration (mins)</label>
                                            <input
                                                type="number"
                                                value={service.duration}
                                                onChange={(e) => update(service.id, "duration", parseInt(e.target.value) || 0)}
                                                placeholder="e.g. 30"
                                                className="w-full mt-1 text-sm text-white bg-transparent border border-[#5D5FEF]/30 rounded-lg px-3 py-2 outline-none focus:border-[#5D5FEF] transition-colors"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={service.allow_booking}
                                                onChange={(e) => update(service.id, "allow_booking", e.target.checked)}
                                                className="w-4 h-4 accent-[#5D5FEF] bg-[#121214] border-[#5D5FEF]/30 rounded"
                                            />
                                            <label className="text-sm font-medium text-white">Allow Booking</label>
                                        </div>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="self-end text-xs bg-[#5D5FEF] text-white px-4 py-1.5 rounded-full hover:bg-[#4a4ce0] transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                ) : (
                                    /* View mode */
                                    <div className="pt-5 space-y-1">
                                        <h3 className="text-sm font-medium text-white pr-14">
                                            {service.name || <span className="text-gray-400 italic">Unnamed service</span>}
                                        </h3>
                                        <p className={`text-[11px] font-medium uppercase tracking-wider ${service.price ? "text-[#5D5FEF]" : "text-[#00C2A0]"}`}>
                                            {service.price || "Price not set"}
                                        </p>
                                        {service.description && (
                                            <p className="text-[11px] text-[#9E9E9E] leading-relaxed line-clamp-2">{service.description}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Add new card */}
                        <button
                            onClick={addService}
                            className="flex flex-col items-center justify-center gap-2 h-[140px] bg-[#5D5FEF]/5 border-2 border-dashed border-[#5D5FEF]/25 rounded-[16px] hover:border-[#5D5FEF]/50 hover:bg-[#5D5FEF]/10 transition-all group"
                        >
                            <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-all">
                                <Plus size={18} className="text-[#5D5FEF]" />
                            </div>
                            <span className="text-sm font-medium text-[#5D5FEF]">Add Service</span>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 px-8 py-5 border-t border-white/10 flex items-center justify-between bg-[#121214]">
                    <p className="text-xs text-[#9E9E9E]">Changes are saved when you click Save</p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => onOpenChange(false)}
                            className="px-5 py-2 rounded-full text-sm text-gray-300 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 rounded-full text-sm font-semibold text-white bg-[#5D5FEF] hover:bg-[#4a4ce0] transition-colors flex items-center gap-2 shadow-md"
                        >
                            <FiSave size={14} /> Save Changes
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}