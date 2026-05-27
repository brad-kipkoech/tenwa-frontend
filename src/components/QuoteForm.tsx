import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    CheckCircle2,
    Loader2,
    Minus,
    Plus,
    Send,
} from "lucide-react";
import Skeleton from "./Skeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type RequestType = "general" | "import";

type QuoteFormData = {
    fullName: string;
    email: string;
    phone: string;
    customerType: string;
    requestType: RequestType;
    serviceType: string;
    commodityType: string;
    pieces: number;
    weight: number;
    weightUnit: string;
    origin: string;
    destination: string;
    length: string;
    width: string;
    height: string;
    hasHsCode: string;
    hasCertificateOfConformity: string;
    commercialValueUsd: string;
    urgency: string;
    contactMethod: string;
    notes: string;
};

const initialFormData: QuoteFormData = {
    fullName: "",
    email: "",
    phone: "",
    customerType: "",
    requestType: "general",
    serviceType: "",
    commodityType: "",
    pieces: 1,
    weight: 1,
    weightUnit: "kg",
    origin: "",
    destination: "",
    length: "",
    width: "",
    height: "",
    hasHsCode: "",
    hasCertificateOfConformity: "",
    commercialValueUsd: "",
    urgency: "Normal",
    contactMethod: "Phone",
    notes: "",
};

const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-[#E30613] focus:ring-4 focus:ring-red-100";

const labelClass = "mb-2 block text-sm font-black text-[#061846]";

function QuoteForm() {
    const { t } = useTranslation();

    const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const isImportRequest = formData.requestType === "import";

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value } = e.target;

        if (name === "requestType") {
            const nextRequestType = value as RequestType;

            setFormData((prev) => ({
                ...prev,
                requestType: nextRequestType,
                serviceType:
                    nextRequestType === "import"
                        ? "Import Clearing & Logistics"
                        : "",
                destination:
                    nextRequestType === "import"
                        ? prev.destination || "Kenya"
                        : prev.destination,
                hasHsCode: nextRequestType === "import" ? prev.hasHsCode : "",
                hasCertificateOfConformity:
                    nextRequestType === "import"
                        ? prev.hasCertificateOfConformity
                        : "",
                commercialValueUsd:
                    nextRequestType === "import" ? prev.commercialValueUsd : "",
            }));

            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function increase(field: "pieces" | "weight") {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field] + 1,
        }));
    }

    function decrease(field: "pieces" | "weight") {
        setFormData((prev) => ({
            ...prev,
            [field]: Math.max(1, prev[field] - 1),
        }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setSent(false);
        setError("");

        const payload = {
            ...formData,
            serviceType: isImportRequest
                ? "Import Clearing & Logistics"
                : formData.serviceType,
            destination: isImportRequest
                ? formData.destination || "Kenya"
                : formData.destination,
            hasHsCode: isImportRequest ? formData.hasHsCode : null,
            hasCertificateOfConformity: isImportRequest
                ? formData.hasCertificateOfConformity
                : null,
            commercialValueUsd:
                isImportRequest && formData.commercialValueUsd
                    ? formData.commercialValueUsd
                    : null,
        };

        try {
            const response = await fetch(`${API_URL}/api/quotes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to submit quote request");
            }

            await response.json();

            setSent(true);
            setFormData(initialFormData);
        } catch (err) {
            console.error(err);
            setError(
                "Could not submit quote request. Please make sure the backend is running."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section
            id="quote"
            className="relative overflow-hidden bg-slate-50 px-5 py-24 lg:px-8"
        >
            <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-red-100 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.25em] text-[#E30613]">
                        {t("quoteForm.eyebrow")}
                    </p>

                    <h2 className="mt-4 text-4xl font-black tracking-tight text-[#061846] sm:text-5xl">
                        {t("quoteForm.title")}
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        {t("quoteForm.description")}
                    </p>

                    <div className="mt-8 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                        <p className="font-black text-[#061846]">
                            Choose Import Request when the customer needs import clearing,
                            HS code support, Certificate of Conformity handling or import
                            logistics.
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            For road freight, local deliveries, air freight, sea freight,
                            clearing, forwarding and general logistics, use General Quote
                            Request.
                        </p>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/80 sm:p-6">
                    {loading ? (
                        <div className="grid gap-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Skeleton className="h-14" />
                                <Skeleton className="h-14" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Skeleton className="h-14" />
                                <Skeleton className="h-14" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Skeleton className="h-14" />
                                <Skeleton className="h-14" />
                                <Skeleton className="h-14" />
                            </div>
                            <Skeleton className="h-14" />
                            <Skeleton className="h-28" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid gap-5">
                            <div>
                                <label className={labelClass}>
                                    What type of request is this?
                                </label>

                                <select
                                    name="requestType"
                                    value={formData.requestType}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                >
                                    <option value="general">
                                        General Quote Request
                                    </option>
                                    <option value="import">
                                        Import Request
                                    </option>
                                </select>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>
                                        {t("quoteForm.labels.fullName")}
                                    </label>
                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("quoteForm.placeholders.fullName")}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        {t("quoteForm.labels.email")}
                                    </label>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        type="email"
                                        placeholder={t("quoteForm.placeholders.email")}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>
                                        {t("quoteForm.labels.phone")}
                                    </label>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder={t("quoteForm.placeholders.phone")}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        {t("quoteForm.labels.customerType")}
                                    </label>
                                    <select
                                        name="customerType"
                                        value={formData.customerType}
                                        onChange={handleChange}
                                        required
                                        className={inputClass}
                                    >
                                        <option value="">
                                            {t("quoteForm.options.selectCustomerType")}
                                        </option>
                                        <option value="Individual">
                                            {t("quoteForm.options.individual")}
                                        </option>
                                        <option value="SME">
                                            {t("quoteForm.options.sme")}
                                        </option>
                                        <option value="Corporate">
                                            {t("quoteForm.options.corporate")}
                                        </option>
                                        <option value="Trader">
                                            {t("quoteForm.options.trader")}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {!isImportRequest && (
                                <div>
                                    <label className={labelClass}>
                                        {t("quoteForm.labels.serviceNeeded")}
                                    </label>
                                    <select
                                        name="serviceType"
                                        value={formData.serviceType}
                                        onChange={handleChange}
                                        required={!isImportRequest}
                                        className={inputClass}
                                    >
                                        <option value="">
                                            {t("quoteForm.options.selectService")}
                                        </option>
                                        <option value="Air Freight">
                                            {t("quoteForm.options.airFreight")}
                                        </option>
                                        <option value="Sea Freight">
                                            {t("quoteForm.options.seaFreight")}
                                        </option>
                                        <option value="Road Freight">
                                            {t("quoteForm.options.roadFreight")}
                                        </option>
                                        <option value="Clearing & Forwarding">
                                            {t("quoteForm.options.clearing")}
                                        </option>
                                        <option value="General Supplies">
                                            {t("quoteForm.options.supplies")}
                                        </option>
                                        <option value="Door-to-Door Delivery">
                                            {t("quoteForm.options.doorDelivery")}
                                        </option>
                                    </select>
                                </div>
                            )}

                            {isImportRequest && (
                                <div className="rounded-[1.5rem] border border-red-100 bg-red-50/40 p-5">
                                    <div className="mb-5">
                                        <h3 className="text-xl font-black text-[#061846]">
                                            Import Details
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            Please provide the import details below so Tenwa
                                            can prepare the correct clearing and logistics quote.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className={labelClass}>
                                                Origin
                                            </label>
                                            <input
                                                name="origin"
                                                value={formData.origin}
                                                onChange={handleChange}
                                                required
                                                placeholder="Example: China, Dubai, India"
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Type of Commodity
                                            </label>
                                            <input
                                                name="commodityType"
                                                value={formData.commodityType}
                                                onChange={handleChange}
                                                required
                                                placeholder="Example: Electronics, machinery, clothing"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className={labelClass}>
                                                Do you have the HS Code?
                                            </label>
                                            <select
                                                name="hasHsCode"
                                                value={formData.hasHsCode}
                                                onChange={handleChange}
                                                required={isImportRequest}
                                                className={inputClass}
                                            >
                                                <option value="">Select option</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Do you have a Certificate of Conformity?
                                            </label>
                                            <select
                                                name="hasCertificateOfConformity"
                                                value={formData.hasCertificateOfConformity}
                                                onChange={handleChange}
                                                required={isImportRequest}
                                                className={inputClass}
                                            >
                                                <option value="">Select option</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className={labelClass}>
                                                Commercial Value in USD
                                            </label>
                                            <input
                                                name="commercialValueUsd"
                                                value={formData.commercialValueUsd}
                                                onChange={handleChange}
                                                required={isImportRequest}
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="Example: 5000"
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                Destination / Delivery Point
                                                <span className="ml-2 font-medium text-slate-400">
                                                    Optional
                                                </span>
                                            </label>
                                            <input
                                                name="destination"
                                                value={formData.destination}
                                                onChange={handleChange}
                                                placeholder="Example: Nairobi, Mombasa, Kenya"
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!isImportRequest && (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className={labelClass}>
                                                {t("quoteForm.labels.commodityType")}
                                            </label>
                                            <select
                                                name="commodityType"
                                                value={formData.commodityType}
                                                onChange={handleChange}
                                                required
                                                className={inputClass}
                                            >
                                                <option value="">
                                                    {t("quoteForm.options.selectCommodity")}
                                                </option>
                                                <option value="Auto Parts">
                                                    {t("quoteForm.options.autoParts")}
                                                </option>
                                                <option value="Electronics">
                                                    {t("quoteForm.options.electronics")}
                                                </option>
                                                <option value="Clothing">
                                                    {t("quoteForm.options.clothing")}
                                                </option>
                                                <option value="Machinery">
                                                    {t("quoteForm.options.machinery")}
                                                </option>
                                                <option value="Pharmaceuticals">
                                                    {t("quoteForm.options.pharmaceuticals")}
                                                </option>
                                                <option value="Perishables">
                                                    {t("quoteForm.options.perishables")}
                                                </option>
                                                <option value="Documents">
                                                    {t("quoteForm.options.documents")}
                                                </option>
                                                <option value="Other">
                                                    {t("quoteForm.options.other")}
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                {t("quoteForm.labels.urgency") || "Urgency"}
                                            </label>
                                            <select
                                                name="urgency"
                                                value={formData.urgency}
                                                onChange={handleChange}
                                                className={inputClass}
                                            >
                                                <option value="Normal">Normal</option>
                                                <option value="Urgent">Urgent</option>
                                                <option value="Express">Express</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className={labelClass}>
                                                {t("quoteForm.labels.origin")}
                                            </label>
                                            <input
                                                name="origin"
                                                value={formData.origin}
                                                onChange={handleChange}
                                                required
                                                placeholder={t("quoteForm.placeholders.origin")}
                                                className={inputClass}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                {t("quoteForm.labels.destination")}
                                            </label>
                                            <input
                                                name="destination"
                                                value={formData.destination}
                                                onChange={handleChange}
                                                required={!isImportRequest}
                                                placeholder={t("quoteForm.placeholders.destination")}
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className={labelClass}>
                                                {t("quoteForm.labels.pieces")}
                                            </label>
                                            <div className="flex overflow-hidden rounded-2xl border border-slate-200">
                                                <button
                                                    type="button"
                                                    aria-label="Decrease pieces"
                                                    onClick={() => decrease("pieces")}
                                                    className="flex w-14 items-center justify-center bg-slate-50 text-[#061846] transition hover:bg-red-50 hover:text-[#E30613]"
                                                >
                                                    <Minus size={18} />
                                                </button>

                                                <input
                                                    name="pieces"
                                                    value={formData.pieces}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            pieces: Math.max(
                                                                1,
                                                                Number(e.target.value)
                                                            ),
                                                        }))
                                                    }
                                                    type="number"
                                                    min="1"
                                                    required
                                                    className="w-full border-x border-slate-200 px-4 py-4 text-center font-black outline-none"
                                                />

                                                <button
                                                    type="button"
                                                    aria-label="Increase pieces"
                                                    onClick={() => increase("pieces")}
                                                    className="flex w-14 items-center justify-center bg-slate-50 text-[#061846] transition hover:bg-red-50 hover:text-[#E30613]"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelClass}>
                                                {t("quoteForm.labels.weight")}
                                            </label>
                                            <div className="grid grid-cols-[1fr_auto] gap-3">
                                                <div className="flex overflow-hidden rounded-2xl border border-slate-200">
                                                    <button
                                                        type="button"
                                                        aria-label="Decrease weight"
                                                        onClick={() => decrease("weight")}
                                                        className="flex w-14 items-center justify-center bg-slate-50 text-[#061846] transition hover:bg-red-50 hover:text-[#E30613]"
                                                    >
                                                        <Minus size={18} />
                                                    </button>

                                                    <input
                                                        name="weight"
                                                        value={formData.weight}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                weight: Math.max(
                                                                    1,
                                                                    Number(e.target.value)
                                                                ),
                                                            }))
                                                        }
                                                        type="number"
                                                        min="1"
                                                        required
                                                        className="w-full border-x border-slate-200 px-4 py-4 text-center font-black outline-none"
                                                    />

                                                    <button
                                                        type="button"
                                                        aria-label="Increase weight"
                                                        onClick={() => increase("weight")}
                                                        className="flex w-14 items-center justify-center bg-slate-50 text-[#061846] transition hover:bg-red-50 hover:text-[#E30613]"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>

                                                <select
                                                    name="weightUnit"
                                                    value={formData.weightUnit}
                                                    onChange={handleChange}
                                                    className="rounded-2xl border border-slate-200 px-4 font-black outline-none"
                                                >
                                                    <option value="kg">kg</option>
                                                    <option value="g">g</option>
                                                    <option value="tons">tons</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            {t("quoteForm.labels.dimensions")}
                                            <span className="ml-2 font-medium text-slate-400">
                                                {t("quoteForm.labels.dimensionsHint")}
                                            </span>
                                        </label>

                                        <div className="grid gap-3 sm:grid-cols-3">
                                            <input
                                                name="length"
                                                value={formData.length}
                                                onChange={handleChange}
                                                placeholder={t("quoteForm.placeholders.length")}
                                                className={inputClass}
                                            />
                                            <input
                                                name="width"
                                                value={formData.width}
                                                onChange={handleChange}
                                                placeholder={t("quoteForm.placeholders.width")}
                                                className={inputClass}
                                            />
                                            <input
                                                name="height"
                                                value={formData.height}
                                                onChange={handleChange}
                                                placeholder={t("quoteForm.placeholders.height")}
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div>
                                <label className={labelClass}>
                                    {t("quoteForm.labels.contactMethod")}
                                </label>
                                <select
                                    name="contactMethod"
                                    value={formData.contactMethod}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="Phone">
                                        {t("quoteForm.options.phone")}
                                    </option>
                                    <option value="WhatsApp">
                                        {t("quoteForm.options.whatsapp")}
                                    </option>
                                    <option value="Email">
                                        {t("quoteForm.options.email")}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    {t("quoteForm.labels.notes")}
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder={
                                        isImportRequest
                                            ? "Add any import details, port information, supplier details or special instructions..."
                                            : t("quoteForm.placeholders.notes")
                                    }
                                    rows={4}
                                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-[#E30613] focus:ring-4 focus:ring-red-100"
                                />
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E30613] px-6 py-4 font-black text-white shadow-xl shadow-red-500/20 transition hover:-translate-y-0.5 hover:bg-red-700"
                            >
                                {isImportRequest
                                    ? "Submit Import Request"
                                    : t("quoteForm.submit")}
                                <Send size={18} />
                            </button>

                            {sent && (
                                <div className="flex items-center gap-3 rounded-2xl bg-green-50 p-4 font-bold text-green-700">
                                    <CheckCircle2 />
                                    {isImportRequest
                                        ? "Import request submitted successfully."
                                        : "Quote request submitted successfully."}
                                </div>
                            )}

                            {error && (
                                <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-700">
                                    {error}
                                </div>
                            )}
                        </form>
                    )}

                    {loading && (
                        <div className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-500">
                            <Loader2 className="animate-spin" size={17} />
                            {t("quoteForm.preparing")}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default QuoteForm;