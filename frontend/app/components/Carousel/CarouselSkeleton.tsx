import "./Carousel.css";

export default function CarouselSkeleton() {
    return (
        <div>
            <div className="carousel-viewport" role="region" aria-roledescription="carousel" aria-label="Image carousel">
                <div className="carousel-slides suspense">
                </div>


            </div>

            {/* caption area: stacked caption items fade in/out with slides */}
            <div className="carousel-caption-wrap" aria-hidden={false}>
                <div className="carousel-caption suspense">
                    

                </div>
            </div>

        </div>
    )
}