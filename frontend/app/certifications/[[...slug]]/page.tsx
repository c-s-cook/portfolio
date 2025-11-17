"use client"

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import getPortfolio from "../../../lib/getPortfolio";
import type { Certification, ImageURL } from "../../../lib/types";

import '../../ContentPages.css';
import Carousel from "../../components/Carousel/Carousel";
import Link from "next/link";

const LinkIcon = () => {
	return (
		<div className="link-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M384 64C366.3 64 352 78.3 352 96C352 113.7 366.3 128 384 128L466.7 128L265.3 329.4C252.8 341.9 252.8 362.2 265.3 374.7C277.8 387.2 298.1 387.2 310.6 374.7L512 173.3L512 256C512 273.7 526.3 288 544 288C561.7 288 576 273.7 576 256L576 96C576 78.3 561.7 64 544 64L384 64zM144 160C99.8 160 64 195.8 64 240L64 496C64 540.2 99.8 576 144 576L400 576C444.2 576 480 540.2 480 496L480 416C480 398.3 465.7 384 448 384C430.3 384 416 398.3 416 416L416 496C416 504.8 408.8 512 400 512L144 512C135.2 512 128 504.8 128 496L128 240C128 231.2 135.2 224 144 224L224 224C241.7 224 256 209.7 256 192C256 174.3 241.7 160 224 160L144 160z"/></svg>
		</div>
	)
}

const RepoIcon = () => {
	return (
		<div className="repo-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M173.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM252.8 8c-138.7 0-244.8 105.3-244.8 244 0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1 100-33.2 167.8-128.1 167.8-239 0-138.7-112.5-244-251.2-244zM105.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>
		</div>
	)
}

const AwardIcon = () => {
	return (
		<div className="award-icon">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M341.9 38.1C328.5 29.9 311.6 29.9 298.2 38.1C273.8 53 258.7 57 230.1 56.4C214.4 56 199.8 64.5 192.2 78.3C178.5 103.4 167.4 114.5 142.3 128.2C128.5 135.7 120.1 150.4 120.4 166.1C121.1 194.7 117 209.8 102.1 234.2C93.9 247.6 93.9 264.5 102.1 277.9C117 302.3 121 317.4 120.4 346C120 361.7 128.5 376.3 142.3 383.9C164.4 396 175.6 406 187.4 425.4L138.7 522.5C132.8 534.4 137.6 548.8 149.4 554.7L235.4 597.7C246.9 603.4 260.9 599.1 267.1 587.9L319.9 492.8L372.7 587.9C378.9 599.1 392.9 603.5 404.4 597.7L490.4 554.7C502.3 548.8 507.1 534.4 501.1 522.5L452.5 425.3C464.2 405.9 475.5 395.9 497.6 383.8C511.4 376.3 519.8 361.6 519.5 345.9C518.8 317.3 522.9 302.2 537.8 277.8C546 264.4 546 247.5 537.8 234.1C522.9 209.7 518.9 194.6 519.5 166C519.9 150.3 511.4 135.7 497.6 128.1C472.5 114.4 461.4 103.3 447.7 78.2C440.2 64.4 425.5 56 409.8 56.3C381.2 57 366.1 52.9 341.7 38zM320 160C373 160 416 203 416 256C416 309 373 352 320 352C267 352 224 309 224 256C224 203 267 160 320 160z"/></svg>
		</div>
	)
}


export default function CertificationPage() {
	// read catch-all slug (array) and join into single slug string
	const params = useParams();
	const slugArray = (params as any)?.slug as string[] | undefined;
	const slug = Array.isArray(slugArray) ? slugArray.join("/") : (slugArray as unknown as string | undefined);

	const [certification, setCertification] = useState<Certification | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		if (!slug) {
			setError("No certification specified");
			setLoading(false);
			return;
		}

		(async () => {
			setLoading(true);
			setError(null);
			try {
				const portfolio: any = await getPortfolio();
				const certifications: Certification[] = Array.isArray(portfolio?.certifications) ? portfolio.certifications : [];
				const found = certifications.find((p) => p.slug === slug);
				if (!mounted) return;
				if (found) {
					setCertification(found);
				} else {
					setError("Certification not found");
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
		<section className="certification-page">
			<div className="content with-background bg-grad content">
				{loading && <p className="loading-text">Loading certification…</p>}
				{error && !loading && <p className="error-text">{error}</p>}

				{!loading && !error && certification && (
					<article className="content-article">
						<header className="content-header">
							<h1 className="content-title">{certification.title}</h1>
							{certification.snippet && <p className="subcap content-subcap">{certification.snippet}</p>}
							
							{certification.date && <p className="date content-date"><AwardIcon/>{ new Date(certification.date).toLocaleDateString() }</p>}
						</header>

						<Carousel images={certification.thumbnails} interval={4000} autoPlay={true} />

						<div
							className="content-body"
							// certification.body contains pre-formatted, validated HTML — inserting intentionally via innerHTML
							dangerouslySetInnerHTML={{ __html: certification.body as string }}
						/>

						<div className="content-actions">
							{certification.certUrl && (
								<a href={certification.certUrl} target="_blank" rel="noopener noreferrer">
									<button type="button"> <AwardIcon/> View Certification</button>
								</a>
							)}
							{certification.liveUrl && (
								<a href={certification.liveUrl} target="_blank" rel="noopener noreferrer">
									<button type="button"> <LinkIcon/> View Live Site</button>
								</a>
							)}
							{certification.repoUrl && (
								<a href={certification.repoUrl} target="_blank" rel="noopener noreferrer">
									<button type="button"> <RepoIcon/> View Repo</button>
								</a>
							)}
						</div>

						<footer className="content-footer">
							{Array.isArray(certification.tags) && certification.tags.length > 0 && (
								<div>
									<strong className="content-tags-label">Tech / Tags:</strong>
									<div className="content-tags">
										{certification.tags.map((t, i) => (
											<span key={i} className="content-tag">{t}</span>
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
