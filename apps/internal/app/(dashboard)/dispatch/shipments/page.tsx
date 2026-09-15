"use client";

import React, { useState } from "react";
import { Truck, PackageCheck, MapPin, CheckCircle2, Clock, UploadCloud, Plus } from "lucide-react";
import { Button, KpiCard } from "@/components/ui";

interface Shipment {
  id: string;
  shipmentNo: string;
  carrier: string;
  trackingNo?: string | null;
  status: "PREPARING" | "DISPATCHED" | "IN_TRANSIT" | "DELIVERED";
  etd?: string | null;
  eta?: string | null;
  podUrl?: string | null;
  deliveredAt?: string | null;
  isExport: boolean;
  project?: {
    id: string;
    projectCode: string;
    name: string;
  };
}

const mockShipments: Shipment[] = [
  {
    id: "shp-1",
    shipmentNo: "SHP-PRJ-2026-001-01",
    carrier: "Blue Dart Heavy Freight Logistics",
    trackingNo: "BD-8829104812",
    status: "DELIVERED",
    etd: "2026-03-11T10:00:00Z",
    eta: "2026-03-14T16:00:00Z",
    deliveredAt: "2026-03-14T15:20:00Z",
    podUrl: "https://systrol-documents.s3.us-east-1.amazonaws.com/dispatch/pod/SHP-PRJ-2026-001-01-signed.pdf",
    isExport: false,
    project: {
      id: "prj-1",
      projectCode: "PRJ-2026-001",
      name: "ArcelorMittal Hot Strip Mill Automation",
    },
  },
  {
    id: "shp-2",
    shipmentNo: "SHP-PRJ-2026-001-02",
    carrier: "Gati-KWE Industrial Transport",
    trackingNo: "GT-9920194",
    status: "IN_TRANSIT",
    etd: "2026-03-14T06:00:00Z",
    eta: "2026-03-18T18:00:00Z",
    isExport: false,
    project: {
      id: "prj-1",
      projectCode: "PRJ-2026-001",
      name: "ArcelorMittal Hot Strip Mill Automation",
    },
  },
];

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(mockShipments[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-500" />
            Dispatch & Freight Logistics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Control outbound panel logistics, carrier tracking, customs documentation, and signed Proof-of-Delivery (POD).
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />}>
          Create Consignment
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Shipments"
          value={shipments.length}
          highlight="blue"
          icon={<Truck size={18} />}
        />
        <KpiCard
          title="In Transit"
          value={shipments.filter((s) => s.status === "IN_TRANSIT" || s.status === "DISPATCHED").length}
          highlight="amber"
          icon={<Clock size={18} />}
        />
        <KpiCard
          title="Delivered & POD Verified"
          value={shipments.filter((s) => s.status === "DELIVERED").length}
          highlight="green"
          icon={<CheckCircle2 size={18} />}
        />
        <KpiCard
          title="Export Consignments"
          value={shipments.filter((s) => s.isExport).length}
          highlight="neutral"
          icon={<PackageCheck size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-white flex items-center justify-between">
            <span>Shipment Register</span>
            <span className="text-xs text-slate-400">Road & Air Cargo</span>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {shipments.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedShipment(s)}
                className={`p-4 cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  selectedShipment?.id === s.id ? "bg-blue-500/5 dark:bg-blue-500/10" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {s.shipmentNo}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      s.status === "DELIVERED"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    }`}
                  >
                    {s.status === "DELIVERED" ? <CheckCircle2 className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
                    {s.status}
                  </span>
                </div>
                <h3 className="font-medium text-slate-900 dark:text-white text-sm mt-2">{s.carrier}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Waybill / Tracking: <span className="font-mono font-medium">{s.trackingNo || "Pending"}</span>
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                  <span>Project: {s.project?.projectCode}</span>
                  <span>ETD: {s.etd ? new Date(s.etd).toLocaleDateString() : "TBD"}</span>
                  <span>ETA: {s.eta ? new Date(s.eta).toLocaleDateString() : "TBD"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedShipment ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Waybill Details</h3>
                  <span className="font-mono text-xs text-blue-600 dark:text-blue-400">{selectedShipment.shipmentNo}</span>
                </div>
                <PackageCheck className="h-5 w-5 text-slate-400" />
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Freight Carrier</span>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">{selectedShipment.carrier}</p>
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Destination Project</span>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedShipment.project?.projectCode} — {selectedShipment.project?.name}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Proof of Delivery (POD)</span>
                {selectedShipment.podUrl ? (
                  <div className="mt-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                    <p className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      POD Verified & Delivered
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      Received at site: {new Date(selectedShipment.deliveredAt!).toLocaleString()}
                    </p>
                    <a
                      href={selectedShipment.podUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      View Signed Receipt PDF
                    </a>
                  </div>
                ) : (
                  <div className="mt-2 space-y-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                      Consignment is currently en route. Upload signed gate receipt when offloaded at plant.
                    </div>
                    <Button variant="primary" size="sm" icon={<UploadCloud size={16} />} style={{ width: "100%" }}>
                      Upload Signed POD
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-slate-400 border border-dashed rounded-xl">
              Select a consignment to view delivery timeline and POD
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
