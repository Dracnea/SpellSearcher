// ==UserScript==
// @name TF2 Premium Search Spell Exporter
// @description A script used to make premium searching for halloween spells on backpack.tf easier
// @version 9.0
// @include *backpack.tf/premium/search*
// @grant    none
// @namespace https://greasyfork.org/users/170895
// ==/UserScript==

'use strict';
//used to start the script
(function () {
    if(sessionStorage.startCheck == 1){
        searcher();
    } else {
        gui();
    }
})();

//Adds the GUI button to start search, mimics website format
function gui(){
    var btn = document.createElement("button");
    btn.className = 'btn btn-premium btn-block btn-lg';
    btn.innerHTML = "Spell Searcher";
    btn.onclick = function() {
        searcher();
    };
    document.getElementsByClassName('premium-search-form')[0].appendChild(btn);
}

function searcher(){
    //constants for item attributes
    const id = "data-original_id",
          name = "data-name",
          q1 = "data-q_name",
          q2 = "data-qe_name",
          effect = "data-effect_name",
          s1 = "data-spell_1",
          s2 = "data-spell_2"
    ;
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
        toJSON(){
            return {
                name: this.name,
                q1: this.q1,
                q2: this.q2,
                effect: this.effect,
                spell1: this.spell1,
                spell2: this.spell2,
                history: this.history

            }
        }
    }
    sessionStorage.startCheck = 1;
    //set the path for which screen element is considered the rows
    var rows = document.querySelectorAll("li.item");
    //may need new query for all history links
    var links = document.querySelectorAll("a.btn.btn-default.btn-xs");

    rows.forEach(addItem);
    function addItem(item, i){
        if (rows[i].hasAttribute(s1)) {
            var history = links[i*2 + 1].href;
            const myItem = new Item(
                rows[i].getAttribute(name),
                rows[i].getAttribute(q1),
                rows[i].getAttribute(q2),
                rows[i].getAttribute(effect),
                rows[i].getAttribute(s1),
                rows[i].getAttribute(s2),
                history
            )
            // JSON stringify the object and pass it as a session storage item based on id
            sessionStorage.setItem(rows[i].getAttribute(id), JSON.stringify(myItem));
        }
    }
    skip();
}

//Print out all data onto a new tab
function printOut(){
    //create new window document
    var myWindow = window.open('','','');
    //loop through session storage
    for (var i = 0; i < sessionStorage.length; i++){
        //get session obj
        var obj = sessionStorage.getItem(sessionStorage.key(i))
        //ensure the obj is not the startCheck
        if(obj != sessionStorage.getItem("startCheck")){
           //json parse object back into an item class
           var item = JSON.parse(obj)
           //format the item into text
           var text = `${item.name}, ${item.q1}, ${item.q2}, ${item.effect}, ${item.spell1}, ${item.spell2}, <a href=${item.history}>History</a><br>`;
           //clean output
           text = text.replace(new RegExp('null', 'g'), "NULL");
           //write next item as text to document
           myWindow.document.write(text);
        }
    }
    //close and focus the document
    myWindow.document.close();
    myWindow.focus();
}

function skip(){
    var pageLink = document.evaluate(
        "/html/body/main/div/div/nav/ul/li/a",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    //if no spell is on this page then redirect to next page, extra check to ensure not first page
    if(window.location.href != pageLink.snapshotItem(2).href && window.location.href.indexOf("page=") > -1){
        window.location.replace(pageLink.snapshotItem(1).href);
    }
    //if we have completed the search then print and sanitize
    if(window.location.href == pageLink.snapshotItem(2).href){
        printOut();
    }
}
