export function scrapePageData() {
    // Object to store all scraped data
    const data = {
      // Get the page title from the document
      title: document.title,
      
      // Get the current URL
      url: window.location.href,
      
      // Find all h1 and h2 elements and extract their text content
      headings: Array.from(document.querySelectorAll('a')).map(a => a.textContent),
      
    
    };
    
    // Return the scraped data to be processed by popup.js
    return data;
  }