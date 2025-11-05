import os from "os";
import { NextResponse } from "next/server";

function getCpuTimes() {
    const cpus = os.cpus();
    let idle = 0;
    let total = 0;

    for (const cpu of cpus) {
        const times = cpu.times;
        const coreTotal = times.user + times.nice + times.sys + times.idle + times.irq;
        idle += times.idle;
        total += coreTotal;
    }

    return { idle, total };
}

async function calculateCpuUtilization(sampleMs = 100) {
    const start = getCpuTimes();
    await new Promise((r) => setTimeout(r, sampleMs));
    const end = getCpuTimes();

    const idleDiff = end.idle - start.idle;
    const totalDiff = end.total - start.total;

    if (totalDiff <= 0) return 0;
    const usage = (1 - idleDiff / totalDiff) * 100;
    return Math.max(0, Math.min(100, Number(usage.toFixed(2))));
}

export async function GET() {
    const cpuUtil = await calculateCpuUtilization(120); // ~120ms sample
    const cpus = os.cpus() || [];
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const ramUtil = totalMem > 0 ? Number(((usedMem / totalMem) * 100).toFixed(2)) : 0;

    const payload = {
        cpu: {
            utilizationPercent: cpuUtil,
            cores: cpus.length,
            model: cpus[0]?.model ?? null,
            speedMHz: cpus[0]?.speed ?? null
        },
        ram: {
            totalBytes: totalMem,
            freeBytes: freeMem,
            usedBytes: usedMem,
            utilizationPercent: ramUtil
        },
        system: {
            hostname: os.hostname(),
            platform: os.platform(),
            arch: os.arch(),
            release: os.release(),
            type: os.type()
        },
        timestamp: Date.now()
    };

    return NextResponse.json(payload);
}