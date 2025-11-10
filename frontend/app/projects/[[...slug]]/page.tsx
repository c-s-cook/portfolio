"use client"

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import getPortfolio from "../../../lib/getPortfolio";
import type { Project, ImageURL } from "../../../lib/types";

import './ProjectPages.css';
import Carousel from "../../components/Carousel/Carousel";

export default function ProjectPage() {
	// read catch-all slug (array) and join into single slug string
	const params = useParams();
	const slugArray = (params as any)?.slug as string[] | undefined;
	const slug = Array.isArray(slugArray) ? slugArray.join("/") : (slugArray as unknown as string | undefined);

	const [project, setProject] = useState<Project | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		if (!slug) {
			setError("No project specified");
			setLoading(false);
			return;
		}

		(async () => {
			setLoading(true);
			setError(null);
			try {
				const portfolio: any = await getPortfolio();
				const projects: Project[] = Array.isArray(portfolio?.projects) ? portfolio.projects : [];
				const found = projects.find((p) => p.slug === slug);
				if (!mounted) return;
				if (found) {
					setProject(found);
				} else {
					setError("Project not found");
				}
			} catch (err: any) {
				if (!mounted) return;
				setError(String(err?.message ?? err ?? "Unknown error"));
			} finally {
				if (mounted) setLoading(false);
			}
		})();

		return () => {
			mounted = false;
		};
	}, [slug]);

	return (
		<section className="project-page">
			<div className="content with-background project-content">
				{loading && <p className="loading-text">Loading project…</p>}
				{error && !loading && <p className="error-text">{error}</p>}

				{!loading && !error && project && (
					<article className="project-article">
						<header className="project-header">
							<h1 className="project-title">{project.title}</h1>
							{project.snippet && <p className="subcap project-subcap">{project.snippet}</p>}
						</header>

						{/* Replace thumbnails grid with Carousel */}
						{Array.isArray(project.thumbnails) && project.thumbnails.length > 0 && (() => {
							// normalize thumbnails to ImageURL[]
							const images: ImageURL[] = project.thumbnails
								.map((t: any) => {
									if (!t) return null;
									if (typeof t === "string") {
										return { name: "", url: t, caption: "" } as ImageURL;
									}
									const url = t.url ?? t.src ?? t.path ?? null;
									if (!url) return null;
									return {
										name: t.name ?? t.ogName ?? "",
										url,
										caption: t.caption ?? t.alt ?? t.ogName ?? "",
										starred: !!t.starred,
									} as ImageURL;
								})
								.filter(Boolean) as ImageURL[];

							return <Carousel images={images} interval={4000} autoPlay={true} />;
						})()}

						<div
							className="body project-body"
							// project.body contains pre-formatted, validated HTML — inserting intentionally via innerHTML
							dangerouslySetInnerHTML={{ __html: project.body as string }}
						/>

						<div className="project-actions">
							{project.liveUrl && (
								<a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
									<button type="button">View Live</button>
								</a>
							)}
							{project.repoUrl && (
								<a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
									<button type="button">View Repository</button>
								</a>
							)}
						</div>

						<footer className="project-footer">
							{Array.isArray(project.tags) && project.tags.length > 0 && (
								<div>
									<strong className="project-tags-label">Tags</strong>
									<div className="project-tags">
										{project.tags.map((t, i) => (
											<span key={i} className="project-tag">{t}</span>
										))}
									</div>
								</div>
							)}
						</footer>
					</article>
				)}
			</div>
		</section>
	);
}
