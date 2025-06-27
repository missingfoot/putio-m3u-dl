// ==UserScript==
// @name         Put.io M3U Download
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds M3U download button next to XSPF on put.io
// @author       You
// @match        https://app.put.io/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Add put.io button styles
    GM_addStyle(`
        .m3u-download-btn {
            text-decoration: none !important;
            width: 100% !important;
        }
        .m3u-download-btn .css-1kdavh6 {
            display: flex;
            align-items: center;
            padding: 10px;
            cursor: var(--config-cursor);
            background: #232323;
            gap: 8px;
        }
        .m3u-download-btn:hover .css-1kdavh6 {
            background: #282828;
        }
        .m3u-download-btn .css-d9wuvb {
            font-size: 15px;
            line-height: 19px;
            margin: 0;
            font-weight: 500;
        }
        .m3u-download-btn .css-1afsoyp {
            font-size: 13px;
            font-weight: 500;
        }
    `);

    // Function to convert XSPF content to M3U
    function xspfToM3U(xspfContent) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xspfContent, "text/xml");
        const locations = xmlDoc.getElementsByTagName("location");
        
        let m3uContent = "#EXTM3U\n";
        for (let loc of locations) {
            // Replace XML entities and add to M3U
            m3uContent += loc.textContent.replace(/&amp;/g, '&') + "\n";
        }
        return m3uContent;
    }

    // Function to get media filename from page title
    function getMediaFilename() {
        const title = document.title;
        const match = title.match(/^(.+?)\s*-\s*put\.io$/);
        if (!match) return null;
        
        // Remove file extension from the name
        const fullName = match[1].trim();
        return fullName.replace(/\.[^/.]+$/, '');
    }

    // Function to download M3U file
    function downloadM3U(filename, content) {
        const blob = new Blob([content], { type: 'audio/x-mpegurl' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.m3u`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // Function to add M3U button
    function addM3UButton(xspfButton) {
        // Check if button already exists
        if (xspfButton.nextSibling?.classList?.contains('m3u-download-btn')) {
            return;
        }

        // Create new button with put.io styling
        const m3uButton = document.createElement('a');
        m3uButton.href = '#';
        m3uButton.className = 'm3u-download-btn';
        m3uButton.innerHTML = `
            <div class="css-1kdavh6">
                <i class="flaticon solid menu-list-3 css-d9wuvb"></i>
                <span class="css-1afsoyp">MPC-HC playlist</span>
            </div>
        `;
        
        // Extract file ID and oauth token from original URL
        const url = xspfButton.href;
        const matches = url.match(/files\/(\d+)\/xspf\?oauth_token=([^&]+)/);
        
        if (matches) {
            const [_, fileId, oauthToken] = matches;
            
            // Add click handler
            m3uButton.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();

                try {
                    // Fetch XSPF content using the original URL
                    const response = await fetch(url);
                    if (!response.ok) throw new Error('Failed to fetch XSPF');
                    
                    const xspfContent = await response.text();
                    const m3uContent = xspfToM3U(xspfContent);
                    
                    // Get filename from page title or use fallback
                    const mediaName = getMediaFilename();
                    const filename = mediaName || `put_${fileId}`;
                    downloadM3U(filename, m3uContent);
                } catch (error) {
                    console.error('Error generating M3U:', error);
                    alert('Failed to generate M3U file. Please try again.');
                }
            };

            // Insert the new button after the XSPF button
            xspfButton.parentNode.insertBefore(m3uButton, xspfButton.nextSibling);
        }
    }

    // Monitor DOM for XSPF buttons
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Find XSPF buttons in added content
                    const xspfButtons = node.querySelectorAll('a[href*="/files/"][href*="/xspf"][href*="oauth_token"]');
                    xspfButtons.forEach(addM3UButton);
                }
            }
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Check for existing XSPF buttons
    document.querySelectorAll('a[href*="/files/"][href*="/xspf"][href*="oauth_token"]').forEach(addM3UButton);
})();
