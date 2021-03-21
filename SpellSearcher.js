// ==UserScript==
// @name         Backpack.tf Spell Searcher
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  A script to web crawl through backpack.tf and gather data regarding halloween spelled items.
// @author       Dracnea
// @match        https://backpack.tf/premium*
// @grant        none
// ==/UserScript==

// Main Method to always run
(function () {
    if(sessionStorage.start == 1) {
        searcher();
    } else {
        gui();
    }
})();

