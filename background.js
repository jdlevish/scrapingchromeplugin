// Listener for when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
    // You can add initialization logic here, such as:
    // - Setting up default settings
    // - Creating context menu items
    // - Initializing storage
  });
  
  // Message listener for communication between components
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if the message is requesting scraped data
    if (request.action === "getScrapedData") {
      // Here you can:
      // - Process the scraped data
      // - Store data in chrome.storage
      // - Send data to a server
      // - Filter or transform the data
      
      // Send a response back to the sender
      sendResponse({ status: "success" });
    }
    
    // Example of storing data:
    chrome.storage.local.set({ 
      scrapedData: request.data 
    }, () => {
      sendResponse({ status: "data stored" });
    });
    
  });