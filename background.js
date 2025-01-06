// Listener for when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Listen for startup
chrome.runtime.onStartup.addListener(() => {
    console.log('Extension listening for clicks');
});

// Listen for tab updates to inject the content script
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // Skip chrome:// URLs and other restricted URLs
        if (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || 
            tab.url.startsWith('about:') || tab.url.startsWith('chrome-extension://')) {
            console.log('Skipping restricted URL:', tab.url);
            return;
        }
        
        console.log('Injecting content script into tab:', tabId);
        
        // Inject the content script
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).then(() => {
            console.log('Content script injected successfully into tab:', tabId);
        }).catch(err => {
            console.error('Script injection error:', err);
        });
    }
});

// Listen for click events from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Background script received message:', message);
    
    if (message.action === "clickEvent") {
        const clickData = message.data;
        console.log('Click recorded:', {
            url: clickData.url,
            element: clickData.tagName,
            id: clickData.id,
            class: clickData.className,
            text: clickData.innerText,
            time: clickData.timestamp
        });
        //send clck data to content script
       
        
        // Store click data in chrome.storage
        chrome.storage.local.get(['clicks'], function(result) {
            const clicks = result.clicks || [];
            clicks.push(clickData);
            chrome.storage.local.set({ clicks: clicks }, function() {
                console.log('Click data stored');
            });
        });
        
        sendResponse({ status: "click recorded" });
        return true; // Keep the message channel open for async response
    }
});
