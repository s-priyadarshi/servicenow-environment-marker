// ==UserScript==
// @name         ServiceNow Environment Marker
// @namespace    https://github.com/s-priyadarshi/sn-environment-marker
// @version      1.9
// @description  Set custom favicon with colored dot and diagonal banner.
// @author       Sanket Priyadarshi
// @match        *://*.service-now.com/*
// @match        *://*.servicenow.com/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/s-priyadarshi/sn-environment-marker/refs/heads/main/main.js
// @updateURL    https://raw.githubusercontent.com/s-priyadarshi/sn-environment-marker/refs/heads/main/main.js
// ==/UserScript==

(function () {
    'use strict';

    const url = location.host.toLowerCase();

    if (!top.NOW && !url.includes('service-now')) {
        return;
    }

    if (top.NOW && top.NOW.user_id == 'guest' && url.includes('servicenow')) {
        return;
    }

    // Ensure the script only runs in the topmost frame
    if (window.top !== window.self) {
        return;
    }

    // Prevent multiple banners by checking if one already exists
    if (document.querySelector('#sn-environment-banner')) {
        return;
    }

    // Define colors and labels for each environment
    const environments = {
        dev: { color: 'green', label: 'Dev Environment' },
        qa: { color: 'purple', label: 'QA Environment' },
        test: { color: 'orange', label: 'Test Environment' },
        uat: { color: 'saddlebrown', label: 'UAT Environment' },
        stage: { color: 'royalblue', label: 'Stage Environment' },
        sandbox: { color: 'gold', label: 'Sandbox Environment' },
        demo: { color: 'pink', label: 'Demo Environment' },
        temp: { color: 'lightblue', label: 'Temp Environment' },
        perf: { color: 'black', label: 'Perf Environment' },
        poc: { color: 'teal', label: 'POC Environment' },
        prod: { color: 'red', label: 'Prod Environment' }
    };

    // Determine the environment based on keywords in the URL
    let environment = 'prod'; // Default to production

    if (url.includes('dev')) {
        environment = 'dev';
    } else if (url.includes('qa')) {
        environment = 'qa';
    } else if (url.includes('test')) {
        environment = 'test';
    } else if (url.includes('uat')) {
        environment = 'uat';
    } else if (url.includes('stage')) {
        environment = 'stage';
    } else if (url.includes('sandbox')) {
        environment = 'sandbox';
    } else if (url.includes('demo')) {
        environment = 'demo';
    } else if (url.includes('temp')) {
        environment = 'temp';
    } else if (url.includes('perf')) {
        environment = 'perf';
    } else if (url.includes('poc')) {
        environment = 'poc';
    }

    // Create a new favicon element
    const createFavicon = (color) => {
        var svg;
        if (top.NOW && top.NOW.sp) {
            svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                 <circle cx="8" cy="8" r="5" stroke="${color}" stroke-width="4" fill="white"/>
            </svg>`;
        } else {
            svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="7" fill="${color}" />
            </svg>`;
        }

        const svgUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
        return svgUrl;
    };

    // Apply the selected favicon
    if (environment && environments[environment]) {
        let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/svg+xml';
        link.rel = 'shortcut icon';
        link.href = createFavicon(environments[environment].color);
        link.className = 'custom-favicon-' + environments[environment].color;

        // Remove any existing favicons
        const existingIcons = document.querySelectorAll("link[rel*='icon']");
        existingIcons.forEach(icon => icon.remove());

        // Append the new favicon link to the document head
        document.getElementsByTagName('head')[0].appendChild(link);
        // Fallback
        setTimeout(function () { document.getElementsByTagName('head')[0].appendChild(link); }, 2000);
    }

    // Create the environment banner
    const banner = document.createElement('div');
    banner.id = 'sn-environment-banner';
    banner.textContent = `--- ${environments[environment].label} ---`;
    banner.style.position = 'fixed';
    banner.style.bottom = '50px';
    banner.style.right = '-75px';
    banner.style.padding = '15px';
    banner.style.backgroundColor = environments[environment].color;
    banner.style.color = 'white';
    banner.style.fontSize = '18px';
    banner.style.fontWeight = 'bold';
    banner.style.zIndex = '100000';
    banner.style.transformOrigin = 'center';
    banner.style.pointerEvents = 'none';
    banner.style.rotate = '-45deg';
    banner.style.width = '300px';
    banner.style.textAlign = 'center';
    banner.style.opacity = '0.85';
    banner.style.boxShadow = '0 0 6px 0px #333';

    // Append the banner to the body
    document.body.appendChild(banner);

})();
