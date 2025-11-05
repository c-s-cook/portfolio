"use client"

import React, { useEffect, useState } from "react";

type SystemMetrics = {
    cpuUsage?: string | number | null; // percent or descriptive string
    cpuCores?: number | null;
    ramDeviceMemoryGb?: number | null; // approximate device RAM in GB (navigator.deviceMemory)
    jsHeapUsedMb?: number | null; // JS heap used (Chrome-only) in MB
    systemName?: string | null; // navigator.platform or derived name
    platform?: string | null;
    userAgent?: string | null;
    uptimeSec?: number | null; // page uptime (not OS uptime) as fallback
    loadAverage?: number[] | null; // not available in browser
    diskUsage?: string | null; // not available in browser
    networkOnline?: boolean | null;
    lastUpdated?: number | null;
    // server-provided fields (optional)
    server?: {
        cpu?: {
            utilizationPercent?: number | null;
            cores?: number | null;
            model?: string | null;
            speedMHz?: number | null;
        } | null;
        ram?: {
            totalBytes?: number | null;
            freeBytes?: number | null;
            usedBytes?: number | null;
            utilizationPercent?: number | null;
        } | null;
        system?: {
            hostname?: string | null;
            platform?: string | null;
            arch?: string | null;
            release?: string | null;
            type?: string | null;
        } | null;
        timestamp?: number | null;
    } | null;
};

function collectBrowserMetrics(): SystemMetrics {
    const nav = typeof navigator !== "undefined" ? navigator : ({} as Navigator);
    const perf = typeof performance !== "undefined" ? performance : ({} as Performance);

    const deviceMemory =
        "deviceMemory" in nav && typeof (nav as any).deviceMemory === "number"
            ? (nav as any).deviceMemory
            : null;

    // performance.memory is non-standard (Chrome). Provide JS heap used if available.
    let jsHeapUsedMb: number | null = null;
    if ((perf as any).memory && typeof (perf as any).memory.usedJSHeapSize === "number") {
        jsHeapUsedMb = Math.round(((perf as any).memory.usedJSHeapSize as number) / 1024 / 1024);
    }

    const uptimeSec =
        typeof perf.timeOrigin === "number" && typeof perf.now === "function"
            ? Math.round((perf.now() + 0) / 1000)
            : null;

    return {
        cpuUsage: null, // not available from browser
        cpuCores: "hardwareConcurrency" in nav ? (nav as any).hardwareConcurrency : null,
        ramDeviceMemoryGb: deviceMemory,
        jsHeapUsedMb,
        systemName: (nav && (nav as any).platform) || null,
        platform: (nav && (nav as any).platform) || null,
        userAgent: (nav && nav.userAgent) || null,
        uptimeSec,
        loadAverage: null,
        diskUsage: null,
        networkOnline: "onLine" in nav ? nav.onLine : null,
        lastUpdated: Date.now(),
        server: null,
    };
}

export default function SystemMetrics({ pollIntervalMs = 10000 }: { pollIntervalMs?: number }) {
    const [metrics, setMetrics] = useState<SystemMetrics>(() => collectBrowserMetrics());
    const [loadingServer, setLoadingServer] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);

    // fetch server metrics from /api/metrics
    async function fetchServerMetrics(signal?: AbortSignal) {
        try {
            setLoadingServer(true);
            setServerError(null);
            const res = await fetch("/api/metrics", { signal });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const payload = await res.json();
            // normalize/attach to metrics.server
            const server = {
                cpu: {
                    utilizationPercent: typeof payload.cpu?.utilizationPercent === "number" ? payload.cpu.utilizationPercent : null,
                    cores: typeof payload.cpu?.cores === "number" ? payload.cpu.cores : null,
                    model: payload.cpu?.model ?? null,
                    speedMHz: typeof payload.cpu?.speedMHz === "number" ? payload.cpu.speedMHz : null,
                },
                ram: {
                    totalBytes: typeof payload.ram?.totalBytes === "number" ? payload.ram.totalBytes : null,
                    freeBytes: typeof payload.ram?.freeBytes === "number" ? payload.ram.freeBytes : null,
                    usedBytes: typeof payload.ram?.usedBytes === "number" ? payload.ram.usedBytes : null,
                    utilizationPercent: typeof payload.ram?.utilizationPercent === "number" ? payload.ram.utilizationPercent : null,
                },
                system: {
                    hostname: payload.system?.hostname ?? null,
                    platform: payload.system?.platform ?? null,
                    arch: payload.system?.arch ?? null,
                    release: payload.system?.release ?? null,
                    type: payload.system?.type ?? null,
                },
                timestamp: typeof payload.timestamp === "number" ? payload.timestamp : Date.now(),
            };

            // merge server info into metrics state while preserving browser metrics
            setMetrics((prev) => ({ ...prev, server, lastUpdated: Date.now() }));
        } catch (err: any) {
            if (err.name !== "AbortError") {
                setServerError(String(err.message ?? err));
            }
        } finally {
            setLoadingServer(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        // initial fetch
        fetchServerMetrics(controller.signal);

        // periodic browser metrics + server metrics
        const id = setInterval(() => {
            setMetrics(collectBrowserMetrics());
            // fetch server metrics in background; ignore abort errors
            fetchServerMetrics();
        }, pollIntervalMs);

        return () => {
            clearInterval(id);
            controller.abort();
        };
    }, [pollIntervalMs]);

    const fmt = {
        maybeNumber: (v: number | null | undefined, suffix = "") =>
            typeof v === "number" ? `${v}${suffix}` : "Unavailable",
        maybeArray: (a: number[] | null | undefined) => (Array.isArray(a) ? a.join(", ") : "Unavailable"),
        maybeString: (s: string | null | undefined) => (s ? s : "Unavailable"),
        maybeTime: (sec: number | null | undefined) =>
            typeof sec === "number" ? `${sec}s` : "Unavailable",
        maybeBool: (b: boolean | null | undefined) => (typeof b === "boolean" ? String(b) : "Unavailable"),
        maybeBytes: (n: number | null | undefined) =>
            typeof n === "number" ? `${(n / (1024 * 1024)).toFixed(2)} MB` : "Unavailable",
    };

    const server = metrics.server;

    return (
        <section aria-labelledby="system-metrics-heading">
            <h3 id="system-metrics-heading">System metrics</h3>

            <h4>Local / Browser Metrics</h4>
            <ul>
                <li><span className="metric-item">System name / platform (browser)</span>: {fmt.maybeString(metrics.systemName || metrics.platform)}</li>
                <li><span className="metric-item">User agent</span>: {fmt.maybeString(metrics.userAgent)}</li>
                <li><span className="metric-item">CPU cores (browser)</span>: {fmt.maybeNumber(metrics.cpuCores)}</li>
                <li><span className="metric-item">CPU usage (browser)</span>: {metrics.cpuUsage ?? "Unavailable in browser (requires OS-level access)"}</li>
                <li><span className="metric-item">Device RAM (approx, browser)</span>: {fmt.maybeNumber(metrics.ramDeviceMemoryGb, " GB")}</li>
                <li><span className="metric-item">JS heap used</span>: {fmt.maybeNumber(metrics.jsHeapUsedMb, " MB")}</li>
                <li><span className="metric-item">Page uptime</span>: {fmt.maybeTime(metrics.uptimeSec)}</li>
                <li><span className="metric-item">Load average (browser)</span>: {fmt.maybeArray(metrics.loadAverage)}</li>
                <li><span className="metric-item">Disk usage (browser)</span>: {fmt.maybeString(metrics.diskUsage)}</li>
                <li><span className="metric-item">Network online (browser)</span>: {fmt.maybeBool(metrics.networkOnline)}</li>
            </ul>

            <h4>Server / OS Metrics</h4>
            <ul>
                <li><span className="metric-item">Server metrics</span>: {loadingServer ? "Loading..." : server ? "Available" : (serverError ? `Error: ${serverError}` : "Unavailable")}</li>
                <li><span className="metric-item">Server CPU utilization</span>: {server?.cpu?.utilizationPercent != null ? `${server.cpu.utilizationPercent}%` : "Unavailable"}</li>
                <li><span className="metric-item">Server CPU cores</span>: {fmt.maybeNumber(server?.cpu?.cores)}</li>
                <li><span className="metric-item">Server CPU model</span>: {fmt.maybeString(server?.cpu?.model)}</li>
                <li><span className="metric-item">Server CPU speed</span>: {server?.cpu?.speedMHz != null ? `${server.cpu.speedMHz} MHz` : "Unavailable"}</li>
                <li><span className="metric-item">Server RAM total</span>: {fmt.maybeBytes(server?.ram?.totalBytes)}</li>
                <li><span className="metric-item">Server RAM used</span>: {fmt.maybeBytes(server?.ram?.usedBytes)}</li>
                <li><span className="metric-item">Server RAM utilization</span>: {server?.ram?.utilizationPercent != null ? `${server.ram.utilizationPercent}%` : "Unavailable"}</li>
                <li><span className="metric-item">Server hostname</span>: {fmt.maybeString(server?.system?.hostname)}</li>
                <li><span className="metric-item">Server platform/arch</span>: {server?.system ? `${fmt.maybeString(server.system.platform)} / ${fmt.maybeString(server.system.arch)}` : "Unavailable"}</li>
                <li><span className="metric-item">Server release/type</span>: {server?.system ? `${fmt.maybeString(server.system.release)} / ${fmt.maybeString(server.system.type)}` : "Unavailable"}</li>
                <li><span className="metric-item">Server timestamp</span>: {server?.timestamp ? new Date(server.timestamp).toLocaleString() : "Unavailable"}</li>

                <li><span className="metric-item">Last updated (client)</span>: {metrics.lastUpdated ? new Date(metrics.lastUpdated).toLocaleTimeString() : "—"}</li>
            </ul>


        </section>
    );
}