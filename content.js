// Global variables
const globals = {
    highlightedElement: null,
    infoPanel: null
};

function clickListener() {
    console.log('Click listener initialized');
    document.addEventListener('click', (event) => {
        try {
            const clickData = {
                tagName: event.target.tagName,
                className: event.target.className,
                id: event.target.id,
                innerText: event.target.innerText,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                xpath: getXPath(event.target),
            };
            
            console.log('Click recorded:', clickData);
            displayElementInfo(clickData);
            highlightElement(clickData.xpath);

            // Check if extension context is still valid
            if (chrome.runtime && chrome.runtime.id) {
                chrome.runtime.sendMessage({
                    action: "clickEvent",
                    data: clickData
                }).catch(error => {
                    console.log('Error sending message:', error);
                    // If extension context is invalid, remove the listener
                    if (error.message.includes('Extension context invalidated')) {
                        document.removeEventListener('click', clickListener);
                        clearHighlight(); // Clear any existing highlights
                        removeInfoPanel(); // Remove the info panel
                    }
                });
            }
        } catch (error) {
            console.log('Error in click listener:', error);
        }
    });
}

// Initialize immediately when script is injected
console.log('Content script loaded');
clickListener();

// Also listen for explicit start messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        console.log('Content script received message:', request);
        if (request.action === "startClickListener") {
            clickListener();
            sendResponse({ status: "listener started" });
            return true;
        }
    } catch (error) {
        console.log('Error in message listener:', error);
    }
});

function getXPath(element) {
    try {
        if (element.id !== '')
            return `//*[@id="${element.id}"]`;
            
        if (element === document.body)
            return '/html/body';

        let ix = 0;
        let siblings = element.parentNode.childNodes;

        for (let i = 0; i < siblings.length; i++) {
            let sibling = siblings[i];
            if (sibling === element)
                return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
                ix++;
        }
    } catch (error) {
        console.log('Error getting XPath:', error);
        return '';
    }
}

function clearHighlight() {
    try {
        if (globals.highlightedElement) {
            globals.highlightedElement.style.border = '';
            globals.highlightedElement = null;
        }
    } catch (error) {
        console.log('Error clearing highlight:', error);
    }
}

function removeInfoPanel() {
    try {
        if (globals.infoPanel) {
            globals.infoPanel.remove();
            globals.infoPanel = null;
        }
    } catch (error) {
        console.log('Error removing info panel:', error);
    }
}

function displayElementInfo(elementData) {
    try {
        // Remove existing panel if it exists
        removeInfoPanel();

        // Create new info panel
        globals.infoPanel = document.createElement('div');
        globals.infoPanel.id = 'extension-info-panel';
        globals.infoPanel.style.position = 'fixed';
        globals.infoPanel.style.bottom = '20px';
        globals.infoPanel.style.right = '20px';
        globals.infoPanel.style.padding = '10px';
        globals.infoPanel.style.background = 'white';
        globals.infoPanel.style.border = '1px solid #ccc';
        globals.infoPanel.style.borderRadius = '5px';
        globals.infoPanel.style.zIndex = '10000';
        globals.infoPanel.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // Update panel content
        globals.infoPanel.innerHTML = `
            <strong>Element Info:</strong><br>
            Tag: ${elementData.tagName}<br>
            Class: ${elementData.className || 'none'}<br>
            ID: ${elementData.id || 'none'}<br>
            Text: ${elementData.innerText ? elementData.innerText.substring(0, 50) + '...' : 'none'}
        `;

        document.body.appendChild(globals.infoPanel);
    } catch (error) {
        console.log('Error displaying element info:', error);
    }
}

function highlightElement(xpath) {
    try {
        // Clear any existing highlight
        clearHighlight();
        
        if (!xpath) {
            console.log('No xpath provided');
            return;
        }

        // Find and highlight new element
        const element = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (element) {
            globals.highlightedElement = element;
            element.style.border = '2px solid #ff4444';
            element.style.boxShadow = '0 0 5px rgba(255,68,68,0.5)';
        } else {
            console.log('No element found for xpath:', xpath);
        }
    } catch (error) {
        console.log('Error highlighting element:', error);
    }
}