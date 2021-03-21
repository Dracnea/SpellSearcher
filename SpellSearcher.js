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

class Item {
    constructor(name, q1, q2, effect, spell1, spell2, history) {
        this.name = name;
        this.q1 = q1;
        this.q2 = q2;
        this.effect = effect;
        this.spell1 = spell1;
        this.spell2 = spell2;
        this.history = history;
    }
}

//Add GUI button to start search, mimics website format
function gui() {
    var btn = document.createElement("button");
    btn.className = 'btn btn-premium btn-block btn-lg';
    btn.innerHTML = "Spell Searcher";
    btn.onclick = function() {
        searcher();
    }
    document.getElementsByClassName('premium-search-form')[0].appendChild(btn);
}

function searcher() {
    //constant strings to reference item attributes
    const id = "data-original_id",
        name = "data-name",
        q1 = "data-q_name",
        q2 = "data-qe_name",
        effect = "data-effect_name",
        s1 = "data-spell_1",
        s2 = "data-spell_2";
    //set variables for page skipping
    sessionStorage.start = 1;
    //set the path for which element is the description
    var desc = document.querySelectorAll("h5");
    //set the path for which element is the rows
    var rows = document.querySelectorAll("li.item");
    //set the path for which element is the links
    var links = document.querySelectorAll("a.btn.btn-default.btn-xs");

    rows.forEach(addItem);
    function addItem(item, i){
        if(rows[i].hasAttribute(s1)) {
            var link = links[i * 2 + 1].href;
            sessionStorage.items += JSON.stringify(
                new Item(
                    rows[i].getAttribute(name),
                    rows[i].getAttribute(q1),
                    rows[i].getAttribute(q2),
                    rows[i].getAttribute(effect),
                    rows[i].getAttribute(s1),
                    rows[i].getAttribute(s2),
                    link
                )
            )
        }
    }
    skip();
}

function skip(){
    //get the element with the link to the next page
    var link = document.evaluate(
        "/html/body/main/div/div/nav/ul/li/a",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
    //if no spell is on this page then redirect to next page, extra check to ensure not first page
    if(window.location.href != link.snapshotItem(2).href && window.location.href.indexOf("page=") > -1){
        window.location.replace(link.snapshotItem(1).href);
    }
    //if we have completed the search then print and sanitize
    if(window.location.href == link.snapshotItem(2).href){
        printOut();
        sanitize();
    }

    function printOut() {

    }

    //clean the session storage after running
    function sanitize(){
        sessionStorage.startCheck = 0;
        location.reload();
    }
}