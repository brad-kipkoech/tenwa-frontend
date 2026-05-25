import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, MapPin, PackageCheck, Search, Timer } from "lucide-react";
import Skeleton from "./Skeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type ShipmentUpdate = {
    id: number;
    status: string;
    currentLocation: string;
    remarks?: string | null;
    createdAt: string;
};

type TrackingResult = {
    trackingCode: string;
    customerName: string;
    serviceType: string;
    origin: string;
    destination: string;
    currentLocation: string;
    status: string;
    estimatedDelivery?: string | null;
    remarks?: string | null;
    updatedAt: string;
    updates: ShipmentUpdate[];
};

function Tracking() {
    const { t } = useTranslation();

    const [trackingCode, setTrackingCode] = useState("");
    const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    async function handleTrack(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setSearched(false);
        setError("");
        setTrackingResult(null);

        try {
            const code = trackingCode.trim().toUpperCase();

            const response = await fetch(`${API_URL}/api/shipments/track/${code}`);

            if (!response.ok) {
                throw new Error("Shipment not found");
            }

            const data: TrackingResult = await response.json();

            setTrackingResult(data);
            setSearched(true);
        } catch (err) {
            console.error(err);
            setError("Shipment not found. Please confirm the tracking code.");
            setSearched(true);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section id="tracking" className="bg-white px-5 py-24 lg:px-8">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-[#E30613]">
                        {t("tracking.eyebrow")}
                    </p>

                    <h2 className="mt-4 text-4xl font-black tracking-tight text-[#061846] sm:text-5xl">
                        {t("tracking.title")}
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        {t("tracking.description")}
                    </p>

                    <form
                        onSubmit={handleTrack}
                        className="mt-8 flex flex-col gap-3 sm:flex-row"
                    >
                        <input
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value)}
                            required
                            placeholder={t("tracking.placeholder")}
                            className="min-h-14 flex-1 rounded-2xl border border-slate-200 px-5 outline-none transition focus:border-[#E30613] focus:ring-4 focus:ring-red-100"
                        />

                        <button
                            type="submit"
                            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#061846] px-7 font-black text-white shadow-xl shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-[#0b2a70]"
                        >
                            <Search size={18} />
                            {t("tracking.button")}
                        </button>
                    </form>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-2xl shadow-slate-200/80">
                    {loading ? (
                        <div className="grid gap-4">
                            <Skeleton className="h-8 w-1/2" />
                            <Skeleton className="h-24" />
                            <Skeleton className="h-20" />
                            <Skeleton className="h-20" />
                        </div>
                    ) : error ? (
                        <div className="grid min-h-[360px] place-items-center rounded-[1.5rem] bg-white p-8 text-center">
                            <div>
                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-[#E30613]">
                                    <AlertCircle size={34} />
                                </div>

                                <h3 className="text-2xl font-black text-[#061846]">
                                    Tracking code not found
                                </h3>

                                <p className="mt-3 max-w-sm leading-7 text-slate-600">
                                    {error}
                                </p>
                            </div>
                        </div>
                    ) : searched && trackingResult ? (
                        <div>
                            <div className="mb-5 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
                                {trackingResult.status}
                            </div>

                            <h3 className="text-2xl font-black text-[#061846]">
                                {trackingResult.trackingCode}
                            </h3>

                            <p className="mt-2 font-bold text-slate-500">
                                {trackingResult.origin} → {trackingResult.destination}
                            </p>

                            <div className="mt-6 grid gap-4">
                                <div className="flex gap-4 rounded-3xl bg-white p-5 shadow-sm">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#E30613]">
                                        <PackageCheck />
                                    </div>

                                    <div>
                                        <p className="font-black text-[#061846]">
                                            {t("common.status")}
                                        </p>
                                        <p className="text-slate-600">
                                            {trackingResult.status}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded-3xl bg-white p-5 shadow-sm">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#061846]">
                                        <MapPin />
                                    </div>

                                    <div>
                                        <p className="font-black text-[#061846]">
                                            Current location
                                        </p>
                                        <p className="text-slate-600">
                                            {trackingResult.currentLocation}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded-3xl bg-white p-5 shadow-sm">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                                        <Timer />
                                    </div>

                                    <div>
                                        <p className="font-black text-[#061846]">
                                            Estimated delivery
                                        </p>
                                        <p className="text-slate-600">
                                            {trackingResult.estimatedDelivery || "Not provided yet"}
                                        </p>
                                    </div>
                                </div>

                                {trackingResult.remarks && (
                                    <div className="rounded-3xl bg-white p-5 shadow-sm">
                                        <p className="font-black text-[#061846]">Remarks</p>
                                        <p className="mt-2 leading-7 text-slate-600">
                                            {trackingResult.remarks}
                                        </p>
                                    </div>
                                )}

                                {trackingResult.updates.length > 0 && (
                                    <div className="rounded-3xl bg-white p-5 shadow-sm">
                                        <p className="font-black text-[#061846]">
                                            Tracking history
                                        </p>

                                        <div className="mt-4 grid gap-3">
                                            {trackingResult.updates.map((update) => (
                                                <div
                                                    key={update.id}
                                                    className="rounded-2xl bg-slate-50 p-4"
                                                >
                                                    <p className="font-black text-[#061846]">
                                                        {update.status}
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-500">
                                                        {update.currentLocation}
                                                    </p>
                                                    {update.remarks && (
                                                        <p className="mt-1 text-sm text-slate-600">
                                                            {update.remarks}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid min-h-[360px] place-items-center rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-8 text-center">
                            <div>
                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-[#E30613]">
                                    <PackageCheck size={34} />
                                </div>

                                <h3 className="text-2xl font-black text-[#061846]">
                                    {t("tracking.enterCodeTitle")}
                                </h3>

                                <p className="mt-3 max-w-sm leading-7 text-slate-600">
                                    {t("tracking.enterCodeText")}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Tracking;