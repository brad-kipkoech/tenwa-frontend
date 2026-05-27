import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dispatch, ElementType, FormEvent, SetStateAction } from "react";
import {
    BarChart3,
    Boxes,
    CalendarDays,
    Loader2,
    MapPin,
    PackageCheck,
    Plane,
    RefreshCw,
    Save,
    Send,
    TrendingUp,
    Truck,
    Users,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import logo from "../assets/logo.png";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const COLORS = ["#E30613", "#061846", "#2563eb", "#f59e0b"];

type AdminTab = "analytics" | "quotes" | "shipments" | "customers";

type QuoteRequest = {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    customerType: string;
    requestType: "general" | "import";
    serviceType: string;
    commodityType: string;
    pieces?: number;
    weight?: number;
    weightUnit?: string;
    origin: string;
    destination: string;
    length?: string | null;
    width?: string | null;
    height?: string | null;
    hasHsCode?: string | null;
    hasCertificateOfConformity?: string | null;
    commercialValueUsd?: string | number | null;
    urgency: string;
    contactMethod?: string;
    notes?: string | null;
    status: string;
    createdAt: string;
};

type Shipment = {
    id: number;
    trackingCode: string;
    customerName: string;
    customerPhone: string;
    serviceType: string;
    origin: string;
    destination: string;
    currentLocation: string;
    status: string;
    estimatedDelivery: string;
    remarks: string;
    createdAt: string;
    updatedAt: string;
};

type MonthlyQuote = {
    month: string;
    quotes: number;
};

type ServiceDemand = {
    name: string;
    value: number;
};

type CustomerTypeMetric = {
    name: string;
    value: number;
};

type TopDestination = {
    destination: string;
    requests: number;
};

type AnalyticsSummary = {
    totalQuotes: number;
    quotesThisMonth: number;
    topService: string;
    topDestination: string;
    monthlyQuotes: MonthlyQuote[];
    serviceDemand: ServiceDemand[];
    customerTypes: CustomerTypeMetric[];
    topDestinations: TopDestination[];
};

type ShipmentFormData = {
    customerName: string;
    customerPhone: string;
    serviceType: string;
    origin: string;
    destination: string;
    currentLocation: string;
    status: string;
    estimatedDelivery: string;
    remarks: string;
};

const emptyAnalytics: AnalyticsSummary = {
    totalQuotes: 0,
    quotesThisMonth: 0,
    topService: "N/A",
    topDestination: "N/A",
    monthlyQuotes: [],
    serviceDemand: [],
    customerTypes: [],
    topDestinations: [],
};

const emptyShipmentForm: ShipmentFormData = {
    customerName: "",
    customerPhone: "",
    serviceType: "Air Freight",
    origin: "",
    destination: "",
    currentLocation: "",
    status: "Shipment confirmed",
    estimatedDelivery: "",
    remarks: "",
};

const shipmentStatuses = [
    "Quote received",
    "Shipment confirmed",
    "Cargo picked up",
    "At origin warehouse",
    "Customs clearance in progress",
    "Departed origin",
    "In transit",
    "Arrived at destination",
    "Out for delivery",
    "Delivered",
    "Delayed",
];

const quoteStatuses = ["New", "Contacted", "In Negotiation", "Converted", "Lost"];

const serviceTypes = [
    "Air Freight",
    "Sea Freight",
    "Road Freight",
    "Clearing & Forwarding",
    "Import Clearing & Logistics",
    "General Supplies",
    "Door-to-Door Delivery",
];

const adminTabs = [
    { key: "analytics" as AdminTab, label: "Analytics", icon: BarChart3 },
    { key: "quotes" as AdminTab, label: "Quote Requests", icon: Boxes },
    { key: "shipments" as AdminTab, label: "Shipments", icon: PackageCheck },
    { key: "customers" as AdminTab, label: "Customers", icon: Users },
];

function escapeCsvValue(value: string | number | null | undefined) {
    if (value === null || value === undefined) return "";

    const stringValue = String(value).replace(/"/g, '""');

    if (
        stringValue.includes(",") ||
        stringValue.includes("\n") ||
        stringValue.includes('"')
    ) {
        return `"${stringValue}"`;
    }

    return stringValue;
}

function downloadCsv(
    filename: string,
    headers: string[],
    rows: Array<Array<string | number | null | undefined>>
) {
    const csvContent = [
        headers.map(escapeCsvValue).join(","),
        ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function getTodayFileDate() {
    return new Date().toISOString().slice(0, 10);
}

function formatRequestType(requestType?: string) {
    return requestType === "import" ? "Import Request" : "General Quote";
}

function formatUsdValue(value?: string | number | null) {
    if (value === null || value === undefined || value === "") return "-";
    return `USD ${value}`;
}

function buildQuoteRemarks(quote: QuoteRequest) {
    const requestLabel = formatRequestType(quote.requestType);

    const lines = [
        `Created from ${requestLabel} #${quote.id}`,
        `Customer email: ${quote.email}`,
        `Commodity: ${quote.commodityType}`,
    ];

    if (quote.requestType === "import") {
        lines.push(`HS Code Available: ${quote.hasHsCode || "Not provided"}`);
        lines.push(
            `Certificate of Conformity: ${quote.hasCertificateOfConformity || "Not provided"
            }`
        );
        lines.push(`Commercial Value: ${formatUsdValue(quote.commercialValueUsd)}`);
    }

    if (quote.notes) {
        lines.push(`Notes: ${quote.notes}`);
    }

    return lines.join("\n");
}

function exportQuotesCsv(quotes: QuoteRequest[]) {
    downloadCsv(
        `tenwa-quote-requests-${getTodayFileDate()}.csv`,
        [
            "ID",
            "Request Type",
            "Client Name",
            "Email",
            "Phone",
            "Customer Type",
            "Service",
            "Commodity",
            "Origin",
            "Destination",
            "HS Code",
            "Certificate of Conformity",
            "Commercial Value USD",
            "Urgency",
            "Status",
            "Created At",
        ],
        quotes.map((quote) => [
            quote.id,
            formatRequestType(quote.requestType),
            quote.fullName,
            quote.email,
            quote.phone,
            quote.customerType,
            quote.serviceType,
            quote.commodityType,
            quote.origin,
            quote.destination,
            quote.hasHsCode,
            quote.hasCertificateOfConformity,
            quote.commercialValueUsd,
            quote.urgency,
            quote.status,
            quote.createdAt,
        ])
    );
}

function exportShipmentsCsv(shipments: Shipment[]) {
    downloadCsv(
        `tenwa-shipments-${getTodayFileDate()}.csv`,
        [
            "ID",
            "Tracking Code",
            "Customer Name",
            "Customer Phone",
            "Service",
            "Origin",
            "Destination",
            "Current Location",
            "Status",
            "Estimated Delivery",
            "Remarks",
            "Created At",
            "Updated At",
        ],
        shipments.map((shipment) => [
            shipment.id,
            shipment.trackingCode,
            shipment.customerName,
            shipment.customerPhone,
            shipment.serviceType,
            shipment.origin,
            shipment.destination,
            shipment.currentLocation,
            shipment.status,
            shipment.estimatedDelivery,
            shipment.remarks,
            shipment.createdAt,
            shipment.updatedAt,
        ])
    );
}

function exportCustomersCsv(quotes: QuoteRequest[]) {
    const uniqueCustomers = Array.from(
        new Map(quotes.map((quote) => [quote.email, quote])).values()
    );

    downloadCsv(
        `tenwa-customers-${getTodayFileDate()}.csv`,
        [
            "Client Name",
            "Email",
            "Phone",
            "Customer Type",
            "Request Type",
            "Last Requested Service",
            "Last Commodity",
            "Last Origin",
            "Last Destination",
            "Last Quote Status",
            "Last Request Date",
        ],
        uniqueCustomers.map((quote) => [
            quote.fullName,
            quote.email,
            quote.phone,
            quote.customerType,
            formatRequestType(quote.requestType),
            quote.serviceType,
            quote.commodityType,
            quote.origin,
            quote.destination,
            quote.status,
            quote.createdAt,
        ])
    );
}

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>("analytics");

    const [analytics, setAnalytics] = useState<AnalyticsSummary>(emptyAnalytics);
    const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
    const [shipments, setShipments] = useState<Shipment[]>([]);

    const [shipmentForm, setShipmentForm] =
        useState<ShipmentFormData>(emptyShipmentForm);

    const [loading, setLoading] = useState(true);
    const [savingShipment, setSavingShipment] = useState(false);
    const [message, setMessage] = useState("");
    const [createdTrackingCode, setCreatedTrackingCode] = useState("");

    const authHeaders = useMemo(() => {
        const token = localStorage.getItem("tenwaAdminToken");

        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    }, []);

    const apiRequest = useCallback(
        async function apiRequest<T>(
            endpoint: string,
            options?: RequestInit
        ): Promise<T> {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...authHeaders,
                    ...(options?.headers || {}),
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Request failed");
            }

            return response.json();
        },
        [authHeaders]
    );

    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        setMessage("");

        try {
            const [analyticsData, quotesData, shipmentsData] = await Promise.all([
                apiRequest<AnalyticsSummary>("/api/admin/analytics/summary"),
                apiRequest<QuoteRequest[]>("/api/admin/quotes"),
                apiRequest<Shipment[]>("/api/admin/shipments"),
            ]);

            setAnalytics(analyticsData);
            setQuotes(quotesData);
            setShipments(shipmentsData);
        } catch (error) {
            console.error(error);
            setMessage(
                "Could not load admin data. Make sure the FastAPI backend is running."
            );
        } finally {
            setLoading(false);
        }
    }, [apiRequest]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    async function updateQuoteStatus(quoteId: number, status: string) {
        setMessage("");

        try {
            const updatedQuote = await apiRequest<QuoteRequest>(
                `/api/admin/quotes/${quoteId}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status }),
                }
            );

            setQuotes((prev) =>
                prev.map((quote) => (quote.id === quoteId ? updatedQuote : quote))
            );

            setMessage("Quote status updated successfully.");
        } catch (error) {
            console.error(error);
            setMessage("Could not update quote status.");
        }
    }

    function prepareShipmentFromQuote(quote: QuoteRequest) {
        setShipmentForm({
            customerName: quote.fullName,
            customerPhone: quote.phone,
            serviceType:
                quote.requestType === "import"
                    ? "Import Clearing & Logistics"
                    : quote.serviceType,
            origin: quote.origin,
            destination: quote.destination || "Kenya",
            currentLocation: quote.origin,
            status: "Quote received",
            estimatedDelivery: "",
            remarks: buildQuoteRemarks(quote),
        });

        setActiveTab("shipments");
        setMessage(
            `Shipment form prepared from ${formatRequestType(
                quote.requestType
            )} #${quote.id}. Review it, then click Create Shipment.`
        );
    }

    async function createShipment(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSavingShipment(true);
        setMessage("");
        setCreatedTrackingCode("");

        try {
            const newShipment = await apiRequest<Shipment>("/api/admin/shipments", {
                method: "POST",
                body: JSON.stringify(shipmentForm),
            });

            setShipments((prev) => [newShipment, ...prev]);
            setShipmentForm(emptyShipmentForm);
            setCreatedTrackingCode(newShipment.trackingCode);
            setMessage(
                `Shipment created successfully. Tracking code: ${newShipment.trackingCode}`
            );
        } catch (error) {
            console.error(error);
            setMessage("Could not create shipment.");
        } finally {
            setSavingShipment(false);
        }
    }

    async function updateShipment(
        shipmentId: number,
        updates: Partial<Shipment>
    ) {
        setMessage("");

        try {
            const updatedShipment = await apiRequest<Shipment>(
                `/api/admin/shipments/${shipmentId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify(updates),
                }
            );

            setShipments((prev) =>
                prev.map((shipment) =>
                    shipment.id === shipmentId ? updatedShipment : shipment
                )
            );

            setMessage("Shipment tracking updated successfully.");
        } catch (error) {
            console.error(error);
            setMessage("Could not update shipment tracking.");
        }
    }

    const customersCount = useMemo(() => {
        const uniqueCustomers = new Set(quotes.map((quote) => quote.email));
        return uniqueCustomers.size;
    }, [quotes]);

    return (
        <main className="min-h-screen bg-slate-50 text-slate-950">
            <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-200 bg-white p-6 lg:block">
                <div className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="Tenwa logo"
                        className="h-12 w-12 object-contain"
                    />

                    <div>
                        <h1 className="text-xl font-black text-[#E30613]">TENWA</h1>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                            Admin
                        </p>
                    </div>
                </div>

                <nav className="mt-10 grid gap-2">
                    {adminTabs.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.key;

                        return (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => setActiveTab(item.key)}
                                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold transition ${isActive
                                        ? "bg-[#061846] text-white"
                                        : "text-slate-600 hover:bg-slate-100"
                                    }`}
                            >
                                <Icon size={20} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            <section className="lg:pl-72">
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 px-5 py-4 backdrop-blur lg:px-8">
                    <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#E30613]">
                                Tenwa Admin
                            </p>
                            <h2 className="text-2xl font-black text-[#061846] sm:text-3xl">
                                {activeTab === "analytics" && "Business insights dashboard"}
                                {activeTab === "quotes" && "Customer quote requests"}
                                {activeTab === "shipments" && "Shipment tracking management"}
                                {activeTab === "customers" && "Customer overview"}
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={loadDashboardData}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#061846] transition hover:bg-slate-50"
                            >
                                <RefreshCw size={17} />
                                Refresh
                            </button>

                            <a
                                href="/"
                                className="rounded-full bg-[#E30613] px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/20"
                            >
                                View Website
                            </a>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
                    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:hidden">
                        {adminTabs.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.key;

                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => setActiveTab(item.key)}
                                    className={`flex items-center justify-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${isActive
                                            ? "bg-[#061846] text-white"
                                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                        }`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>

                    {message && (
                        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 font-bold text-[#061846] shadow-sm">
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <div className="grid min-h-[500px] place-items-center rounded-[2rem] bg-white">
                            <div className="flex items-center gap-3 font-black text-[#061846]">
                                <Loader2 className="animate-spin text-[#E30613]" />
                                Loading admin data...
                            </div>
                        </div>
                    ) : (
                        <>
                            {activeTab === "analytics" && (
                                <AnalyticsSection analytics={analytics} />
                            )}

                            {activeTab === "quotes" && (
                                <QuotesSection
                                    quotes={quotes}
                                    onStatusChange={updateQuoteStatus}
                                    onCreateTracking={prepareShipmentFromQuote}
                                />
                            )}

                            {activeTab === "shipments" && (
                                <ShipmentsSection
                                    shipments={shipments}
                                    shipmentForm={shipmentForm}
                                    setShipmentForm={setShipmentForm}
                                    savingShipment={savingShipment}
                                    createdTrackingCode={createdTrackingCode}
                                    onCreateShipment={createShipment}
                                    onUpdateShipment={updateShipment}
                                />
                            )}

                            {activeTab === "customers" && (
                                <CustomersSection
                                    quotes={quotes}
                                    shipments={shipments}
                                    customersCount={customersCount}
                                />
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}

type AnalyticsSectionProps = {
    analytics: AnalyticsSummary;
};

function AnalyticsSection({ analytics }: AnalyticsSectionProps) {
    return (
        <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Quotes"
                    value={String(analytics.totalQuotes)}
                    note="All quote requests"
                    icon={BarChart3}
                />

                <StatCard
                    title="Quotes This Month"
                    value={String(analytics.quotesThisMonth)}
                    note="Current month demand"
                    icon={CalendarDays}
                />

                <StatCard
                    title="Top Service"
                    value={analytics.topService || "N/A"}
                    note="Most requested service"
                    icon={Plane}
                />

                <StatCard
                    title="Top Destination"
                    value={analytics.topDestination || "N/A"}
                    note="Most requested route"
                    icon={MapPin}
                />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-[#061846]">
                                Monthly quote growth
                            </h3>
                            <p className="text-sm text-slate-500">
                                Tracks quote requests received per month from the database.
                            </p>
                        </div>

                        <TrendingUp className="text-[#E30613]" />
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.monthlyQuotes}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="quotes"
                                    fill="#E30613"
                                    radius={[12, 12, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-black text-[#061846]">
                        Service demand
                    </h3>
                    <p className="text-sm text-slate-500">
                        Shows which services clients request most.
                    </p>

                    <div className="mt-6 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics.serviceDemand}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={4}
                                >
                                    {analytics.serviceDemand.map((_, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 grid gap-3">
                        {analytics.serviceDemand.map((item, index) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="h-3 w-3 rounded-full"
                                        style={{
                                            backgroundColor: COLORS[index % COLORS.length],
                                        }}
                                    />
                                    <span className="font-bold text-slate-700">
                                        {item.name}
                                    </span>
                                </div>

                                <span className="font-black text-[#061846]">
                                    {item.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-black text-[#061846]">
                        Customer type breakdown
                    </h3>
                    <p className="text-sm text-slate-500">
                        Understand demand from individuals, SMEs, traders and corporates.
                    </p>

                    <div className="mt-6 grid gap-4">
                        {analytics.customerTypes.map((item) => (
                            <div key={item.name}>
                                <div className="mb-2 flex justify-between text-sm font-bold">
                                    <span>{item.name}</span>
                                    <span>{item.value}%</span>
                                </div>

                                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-[#061846]"
                                        style={{ width: `${item.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-black text-[#061846]">
                        Top destinations
                    </h3>
                    <p className="text-sm text-slate-500">
                        Shows where most shipment requests are going.
                    </p>

                    <div className="mt-6 grid gap-3">
                        {analytics.topDestinations.map((item, index) => (
                            <div
                                key={item.destination}
                                className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 font-black text-[#E30613]">
                                        {index + 1}
                                    </div>

                                    <div>
                                        <p className="font-black text-[#061846]">
                                            {item.destination}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {item.requests} quote requests
                                        </p>
                                    </div>
                                </div>

                                <MapPin className="text-[#E30613]" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

type QuotesSectionProps = {
    quotes: QuoteRequest[];
    onStatusChange: (quoteId: number, status: string) => void;
    onCreateTracking: (quote: QuoteRequest) => void;
};

function QuotesSection({
    quotes,
    onStatusChange,
    onCreateTracking,
}: QuotesSectionProps) {
    return (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-xl font-black text-[#061846]">
                        Recent quote requests
                    </h3>
                    <p className="text-sm text-slate-500">
                        General quote and import requests submitted from the website.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => exportQuotesCsv(quotes)}
                    disabled={quotes.length === 0}
                    className="rounded-full bg-[#061846] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0b2a70] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Export CSV
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1350px] border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-left text-sm text-slate-500">
                            <th className="px-4">Client</th>
                            <th className="px-4">Contact</th>
                            <th className="px-4">Request Type</th>
                            <th className="px-4">Customer Type</th>
                            <th className="px-4">Service</th>
                            <th className="px-4">Commodity</th>
                            <th className="px-4">Route</th>
                            <th className="px-4">Import Details</th>
                            <th className="px-4">Urgency</th>
                            <th className="px-4">Status</th>
                            <th className="px-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {quotes.map((quote) => (
                            <tr key={quote.id} className="bg-slate-50 align-top">
                                <td className="rounded-l-2xl px-4 py-4 font-black text-[#061846]">
                                    <p>{quote.fullName}</p>
                                    <p className="mt-1 text-xs font-bold text-slate-400">
                                        #{quote.id}
                                    </p>
                                </td>

                                <td className="px-4 py-4 text-sm font-bold text-slate-600">
                                    <p>{quote.phone}</p>
                                    <p className="text-slate-400">{quote.email}</p>
                                </td>

                                <td className="px-4 py-4">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-black ${quote.requestType === "import"
                                                ? "bg-red-100 text-[#E30613]"
                                                : "bg-blue-100 text-blue-700"
                                            }`}
                                    >
                                        {formatRequestType(quote.requestType)}
                                    </span>
                                </td>

                                <td className="px-4 py-4 font-bold text-slate-600">
                                    {quote.customerType}
                                </td>

                                <td className="px-4 py-4 font-bold text-slate-600">
                                    {quote.serviceType}
                                </td>

                                <td className="px-4 py-4 font-bold text-slate-600">
                                    {quote.commodityType}
                                </td>

                                <td className="px-4 py-4 font-bold text-slate-600">
                                    {quote.origin} → {quote.destination}
                                </td>

                                <td className="px-4 py-4 text-sm font-bold text-slate-600">
                                    {quote.requestType === "import" ? (
                                        <div className="grid gap-1">
                                            <p>HS Code: {quote.hasHsCode || "-"}</p>
                                            <p>
                                                CoC:{" "}
                                                {quote.hasCertificateOfConformity || "-"}
                                            </p>
                                            <p>
                                                Value:{" "}
                                                {formatUsdValue(
                                                    quote.commercialValueUsd
                                                )}
                                            </p>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </td>

                                <td className="px-4 py-4">
                                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
                                        {quote.urgency}
                                    </span>
                                </td>

                                <td className="px-4 py-4">
                                    <select
                                        value={quote.status}
                                        onChange={(e) =>
                                            onStatusChange(quote.id, e.target.value)
                                        }
                                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#061846] outline-none"
                                    >
                                        {quoteStatuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td className="rounded-r-2xl px-4 py-4">
                                    <button
                                        type="button"
                                        onClick={() => onCreateTracking(quote)}
                                        className="rounded-full bg-[#061846] px-4 py-2 text-xs font-black text-white transition hover:bg-[#0b2a70]"
                                    >
                                        Create Tracking
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {quotes.length === 0 && (
                <EmptyState text="No quote requests found yet. Once customers submit the quote form, they will appear here." />
            )}
        </div>
    );
}

type ShipmentsSectionProps = {
    shipments: Shipment[];
    shipmentForm: ShipmentFormData;
    setShipmentForm: Dispatch<SetStateAction<ShipmentFormData>>;
    savingShipment: boolean;
    createdTrackingCode: string;
    onCreateShipment: (e: FormEvent<HTMLFormElement>) => void;
    onUpdateShipment: (shipmentId: number, updates: Partial<Shipment>) => void;
};

function ShipmentsSection({
    shipments,
    shipmentForm,
    setShipmentForm,
    savingShipment,
    createdTrackingCode,
    onCreateShipment,
    onUpdateShipment,
}: ShipmentsSectionProps) {
    const clientMessage = createdTrackingCode
        ? `Hello, your shipment tracking code is ${createdTrackingCode}. You can use this code on the Tenwa Logistics website to track your shipment progress.`
        : "";

    async function copyToClipboard(text: string) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.error("Clipboard copy failed:", error);
        }
    }

    return (
        <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black text-[#061846]">
                    Create shipment tracking
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                    Admin creates a shipment or import tracking record. The backend
                    will generate a tracking code like TENWA-0001.
                </p>

                {createdTrackingCode && (
                    <div className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-5">
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-green-700">
                            Tracking Code Created
                        </p>

                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-3xl font-black text-[#061846]">
                                {createdTrackingCode}
                            </p>

                            <button
                                type="button"
                                onClick={() => copyToClipboard(createdTrackingCode)}
                                className="rounded-full bg-[#061846] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0b2a70]"
                            >
                                Copy Code
                            </button>
                        </div>

                        <div className="mt-4 rounded-2xl bg-white p-4 text-sm leading-7 text-slate-700">
                            <p className="font-black text-[#061846]">
                                Message to send to client:
                            </p>

                            <p className="mt-2">{clientMessage}</p>

                            <button
                                type="button"
                                onClick={() => copyToClipboard(clientMessage)}
                                className="mt-4 rounded-full border border-slate-200 px-5 py-3 text-sm font-black text-[#061846] transition hover:bg-slate-50"
                            >
                                Copy Client Message
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={onCreateShipment} className="mt-6 grid gap-4">
                    <InputField
                        label="Customer Name"
                        value={shipmentForm.customerName}
                        onChange={(value) =>
                            setShipmentForm((prev) => ({
                                ...prev,
                                customerName: value,
                            }))
                        }
                        required
                    />

                    <InputField
                        label="Customer Phone"
                        value={shipmentForm.customerPhone}
                        onChange={(value) =>
                            setShipmentForm((prev) => ({
                                ...prev,
                                customerPhone: value,
                            }))
                        }
                        required
                    />

                    <div>
                        <label className="mb-2 block text-sm font-black text-[#061846]">
                            Service Type
                        </label>
                        <select
                            value={shipmentForm.serviceType}
                            onChange={(e) =>
                                setShipmentForm((prev) => ({
                                    ...prev,
                                    serviceType: e.target.value,
                                }))
                            }
                            className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-bold outline-none focus:border-[#E30613] focus:ring-4 focus:ring-red-100"
                        >
                            {serviceTypes.map((service) => (
                                <option key={service} value={service}>
                                    {service}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <InputField
                            label="Origin"
                            value={shipmentForm.origin}
                            onChange={(value) =>
                                setShipmentForm((prev) => ({
                                    ...prev,
                                    origin: value,
                                }))
                            }
                            required
                        />

                        <InputField
                            label="Destination"
                            value={shipmentForm.destination}
                            onChange={(value) =>
                                setShipmentForm((prev) => ({
                                    ...prev,
                                    destination: value,
                                }))
                            }
                            required
                        />
                    </div>

                    <InputField
                        label="Current Location"
                        value={shipmentForm.currentLocation}
                        onChange={(value) =>
                            setShipmentForm((prev) => ({
                                ...prev,
                                currentLocation: value,
                            }))
                        }
                        required
                    />

                    <div>
                        <label className="mb-2 block text-sm font-black text-[#061846]">
                            Initial Status
                        </label>
                        <select
                            value={shipmentForm.status}
                            onChange={(e) =>
                                setShipmentForm((prev) => ({
                                    ...prev,
                                    status: e.target.value,
                                }))
                            }
                            className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-bold outline-none focus:border-[#E30613] focus:ring-4 focus:ring-red-100"
                        >
                            {shipmentStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <InputField
                        label="Estimated Delivery"
                        type="date"
                        value={shipmentForm.estimatedDelivery}
                        onChange={(value) =>
                            setShipmentForm((prev) => ({
                                ...prev,
                                estimatedDelivery: value,
                            }))
                        }
                    />

                    <div>
                        <label className="mb-2 block text-sm font-black text-[#061846]">
                            Remarks
                        </label>
                        <textarea
                            value={shipmentForm.remarks}
                            onChange={(e) =>
                                setShipmentForm((prev) => ({
                                    ...prev,
                                    remarks: e.target.value,
                                }))
                            }
                            rows={5}
                            className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-4 font-bold outline-none focus:border-[#E30613] focus:ring-4 focus:ring-red-100"
                            placeholder="Add shipment notes..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={savingShipment}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E30613] px-6 py-4 font-black text-white shadow-xl shadow-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {savingShipment ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Create Shipment
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-xl font-black text-[#061846]">
                            Update shipment tracking
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            When admin updates status, location or remarks, the customer
                            will see the latest result using the public tracking code.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => exportShipmentsCsv(shipments)}
                        disabled={shipments.length === 0}
                        className="shrink-0 rounded-full bg-[#061846] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0b2a70] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Export CSV
                    </button>
                </div>

                <div className="mt-6 grid gap-4">
                    {shipments.map((shipment) => (
                        <ShipmentCard
                            key={shipment.id}
                            shipment={shipment}
                            onUpdateShipment={onUpdateShipment}
                        />
                    ))}

                    {shipments.length === 0 && (
                        <EmptyState text="No shipments created yet. Create the first tracking record from the form." />
                    )}
                </div>
            </div>
        </div>
    );
}

type ShipmentCardProps = {
    shipment: Shipment;
    onUpdateShipment: (shipmentId: number, updates: Partial<Shipment>) => void;
};

function ShipmentCard({ shipment, onUpdateShipment }: ShipmentCardProps) {
    const [localStatus, setLocalStatus] = useState(shipment.status);
    const [localLocation, setLocalLocation] = useState(shipment.currentLocation);
    const [localRemarks, setLocalRemarks] = useState(shipment.remarks || "");
    const [localEstimatedDelivery, setLocalEstimatedDelivery] = useState(
        shipment.estimatedDelivery || ""
    );

    return (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E30613]">
                        {shipment.trackingCode}
                    </p>

                    <h4 className="mt-1 text-xl font-black text-[#061846]">
                        {shipment.customerName}
                    </h4>

                    <p className="mt-1 text-sm font-bold text-slate-500">
                        {shipment.origin} → {shipment.destination}
                    </p>
                </div>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-black text-blue-700">
                    {shipment.serviceType}
                </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-black text-[#061846]">
                        Status
                    </label>
                    <select
                        value={localStatus}
                        onChange={(e) => setLocalStatus(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none"
                    >
                        {shipmentStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                <InputField
                    label="Current Location"
                    value={localLocation}
                    onChange={setLocalLocation}
                />

                <InputField
                    label="Estimated Delivery"
                    type="date"
                    value={localEstimatedDelivery}
                    onChange={setLocalEstimatedDelivery}
                />

                <div>
                    <label className="mb-2 block text-sm font-black text-[#061846]">
                        Customer Phone
                    </label>
                    <p className="rounded-2xl bg-white px-4 py-3 font-bold text-slate-600">
                        {shipment.customerPhone}
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <label className="mb-2 block text-sm font-black text-[#061846]">
                    Remarks
                </label>
                <textarea
                    value={localRemarks}
                    onChange={(e) => setLocalRemarks(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none"
                />
            </div>

            <button
                type="button"
                onClick={() =>
                    onUpdateShipment(shipment.id, {
                        status: localStatus,
                        currentLocation: localLocation,
                        estimatedDelivery: localEstimatedDelivery,
                        remarks: localRemarks,
                    })
                }
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#061846] px-5 py-3 text-sm font-black text-white"
            >
                <Save size={16} />
                Save Tracking Update
            </button>
        </div>
    );
}

type CustomersSectionProps = {
    quotes: QuoteRequest[];
    shipments: Shipment[];
    customersCount: number;
};

function CustomersSection({
    quotes,
    shipments,
    customersCount,
}: CustomersSectionProps) {
    return (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h3 className="text-xl font-black text-[#061846]">
                        Customer overview
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        This section will help Tenwa understand client types and repeated
                        customers.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => exportCustomersCsv(quotes)}
                    disabled={quotes.length === 0}
                    className="shrink-0 rounded-full bg-[#061846] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0b2a70] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Export Customers CSV
                </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard
                    title="Unique Customers"
                    value={String(customersCount)}
                    note="Based on customer emails"
                    icon={Users}
                />

                <StatCard
                    title="Total Quote Requests"
                    value={String(quotes.length)}
                    note="Submitted from website"
                    icon={Boxes}
                />

                <StatCard
                    title="Total Shipments"
                    value={String(shipments.length)}
                    note="Created by admin"
                    icon={Truck}
                />
            </div>
        </div>
    );
}

type StatCardProps = {
    title: string;
    value: string;
    note: string;
    icon: ElementType;
};

function StatCard({ title, value, note, icon: Icon }: StatCardProps) {
    return (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#E30613]">
                <Icon />
            </div>

            <p className="text-sm font-bold text-slate-500">{title}</p>
            <h3 className="mt-2 text-3xl font-black text-[#061846]">{value}</h3>
            <p className="mt-2 text-sm font-semibold text-green-600">{note}</p>
        </div>
    );
}

type InputFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
};

function InputField({
    label,
    value,
    onChange,
    type = "text",
    required = false,
}: InputFieldProps) {
    return (
        <div>
            <label className="mb-2 block text-sm font-black text-[#061846]">
                {label}
            </label>

            <input
                type={type}
                value={value}
                required={required}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 font-bold outline-none focus:border-[#E30613] focus:ring-4 focus:ring-red-100"
            />
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center font-bold text-slate-500">
            {text}
        </div>
    );
}

export default AdminDashboard;