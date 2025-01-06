export function scrapePageData(args) {
    const element = args.toString();
    console.log(element);
    // Object to store all scraped data
    const data = {
        title: document.title,
        url: window.location.href,
        headings: Array.from(document.querySelectorAll(`${element}`)).map(element => element.textContent)
    };
    return data;
}