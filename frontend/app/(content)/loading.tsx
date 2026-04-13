
import CarouselSkeleton from "@components/Carousel/CarouselSkeleton";


export default function ContentLoading() {
    return (
        <section className="certification-page no-snap">
            <div className="content with-background bg-grad content">
                <article className="content-article">
                    <header className="content-header">
                        <h1 className="content-title suspense"></h1>

                        <p className="date content-date suspense"></p>
                    </header>

                    <CarouselSkeleton />

                    <div className="content-body">
                        <p className="suspense"></p>
                        <p className="suspense"></p>
                        <p className="suspense"></p>
                        <p className="suspense"></p>
                        <p className="suspense"></p>
                    </div>

                    <div className="content-actions">

                        <a href="" target="_blank" rel="noopener noreferrer">
                            <button type="button" className="suspense"> </button>
                        </a>


                        <a href="" target="_blank" rel="noopener noreferrer">
                            <button type="button" className="suspense"> </button>
                        </a>


                    </div>

                    <footer className="content-footer">
                        <div>
                            <span className="content-tags-label suspense"></span>
                            <div className="content-tags">

                                <span className="content-tag suspense"></span>
                                <span className="content-tag suspense"></span>
                                <span className="content-tag suspense"></span>
                                <span className="content-tag suspense"></span>

                            </div>
                        </div>
                    </footer>
                </article>
            </div>
        </section>
    )
}