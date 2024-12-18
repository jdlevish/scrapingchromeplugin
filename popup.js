// Wait for button click event
import { scrapePageData } from './content.js'; document.getElementById('scrapeButton').addEventListener('click', async () => {
    // Get the current active tab in the current window
    const [tab] = await chrome.tabs.query({ 
      active: true,         // Must be the active tab
      currentWindow: true   // Must be in current window
    });
    
    // Execute the scraping function in the context of the web page
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },    // Specify which tab to scrape
      function: scrapePageData,      // Function to execute
    });
  
    // Display the scraped results in the popup
    // result[0].result contains the data returned from scrapePageData
    document.getElementById('result').textContent = JSON.stringify(result);
  });