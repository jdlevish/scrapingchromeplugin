// Wait for button click event
import { scrapePageData } from './scrape.js';

document.getElementById('scrapeButton').addEventListener('click', async () => {
    // Get the current active tab in the current window
    const [tab] = await chrome.tabs.query({ 
      active: true,         // Must be the active tab
      currentWindow: true   // Must be in current window
    });
    const element = document.getElementById("tag").value;
    console.log(element);

    // Execute the scraping function in the context of the web page
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },    // Specify which tab to scrape
      func: scrapePageData,
      args: [element]
    });
  
    // Display the scraped results in the popup
    // result[0].result contains the data returned from scrapePageData
    console.log(result)
    document.getElementById('result').textContent = JSON.stringify(result[0].result.headings).replace(/\\n/g, '');
  });