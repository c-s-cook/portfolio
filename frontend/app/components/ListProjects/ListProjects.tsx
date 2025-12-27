"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Portfolio, Project } from "../../../lib/types";
import getPortfolio from "../../../lib/getPortfolio";

type Props = {
    onSelect?: (projectId: number) => void;
};


const ViewIcon = () => {
    return (
        <>
            <div className="view-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M320 96C239.2 96 174.5 132.8 127.4 176.6C80.6 220.1 49.3 272 34.4 307.7C31.1 315.6 31.1 324.4 34.4 332.3C49.3 368 80.6 420 127.4 463.4C174.5 507.1 239.2 544 320 544C400.8 544 465.5 507.2 512.6 463.4C559.4 419.9 590.7 368 605.6 332.3C608.9 324.4 608.9 315.6 605.6 307.7C590.7 272 559.4 220 512.6 176.6C465.5 132.9 400.8 96 320 96zM176 320C176 240.5 240.5 176 320 176C399.5 176 464 240.5 464 320C464 399.5 399.5 464 320 464C240.5 464 176 399.5 176 320zM320 256C320 291.3 291.3 320 256 320C244.5 320 233.7 317 224.3 311.6C223.3 322.5 224.2 333.7 227.2 344.8C240.9 396 293.6 426.4 344.8 412.7C396 399 426.4 346.3 412.7 295.1C400.5 249.4 357.2 220.3 311.6 224.3C316.9 233.6 320 244.4 320 256z" /></svg>
            </div>
        </>
    )
}

const EditIcon = () => {
    return (
        <>
            <div className="edit-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L368 46.1 465.9 144 490.3 119.6c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L432 177.9 334.1 80 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" /></svg>
            </div>
        </>
    )
}


const ListProjects: React.FC<Props> = ({ onSelect }) => {
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const p = await getPortfolio();
                if (!mounted) return;
                // basic validation
                if (p && Array.isArray(p.projects)) {
                    setPortfolio(p as Portfolio);
                } else {
                    setError("Invalid portfolio data");
                }
            } catch (err) {
                setError(String(err));
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return <div>Loading projects...</div>;
    }

    if (error) {
        return <div>Error loading projects: {error}</div>;
    }

    const projects: Project[] = portfolio?.projects ?? [];

    if (!projects.length) {
        return <div>No projects available.</div>;
    }

    return (
        <ul className="portfolio-items">
            {projects.map((p) => (
                <li key={p.id}>
                    <Link href={`./dashboard/add-project/${p.id}/edit`}>
                        <button type="button" className="portfolio-item">
                            <div className="title">
                                {p.title}
                            </div>
                            <EditIcon />

                        </button>
                    </Link>

                    <Link href={`./projects/${p.slug}`}>
                        <ViewIcon />
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default ListProjects;
