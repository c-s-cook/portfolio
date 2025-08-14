import type { Project, Certification } from "./types";


export default async function getPortfolio() {

    let portfolio = {
        projects: null,
        certifications: null,
        uniqueTags: null
    }

    // fetch the payload from the PORTFOLIO_GET_URL and assign to 'portfolio'
    const fetchPortfolio = async () => {
        try {
            const response = await fetch('/api/portfolio');
            const data = await response.json();

            portfolio = data;

            console.log('successfully fetched the projects: ');
        } catch (error) {
            portfolio['error'] = error;
            console.error('Error fetching portfolio projects from API:', error);
        }
    };

    // check localStorage for existing projects...
    if (typeof (Storage) !== "undefined") {

        portfolio = JSON.parse(localStorage.getItem('portfolio'));

    } else {
        console.log('no localStorage...?');
    }

    if (!portfolio || !portfolio.projects || !portfolio.certifications || !portfolio.uniqueTags) {

        await fetchPortfolio();

        if (Array.isArray(portfolio.projects)
            && Array.isArray(portfolio.certifications)
            && Array.isArray(portfolio.uniqueTags)) {
            localStorage.setItem('portfolio', JSON.stringify(portfolio));
        } else {
            portfolio['error'] = 'Had an error somewhere...';
        }
    }

    return portfolio
}
