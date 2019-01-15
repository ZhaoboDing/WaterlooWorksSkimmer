const total = new Map();
total.set("Job Title:", "Title");
total.set("Job - Country:", "Country");
total.set("Region:", "Region");
total.set("Required Skills:", "Skills");
total.set("Job Responsibilities:", "Responsibility");
total.set("Work Term Duration:", "Duration");
total.set("Number of Job Openings:", "#Openings");

var search = new Set(Array.from(total.keys()));

chrome.storage.local.set({'search': JSON.stringify([...search])});

chrome.storage.onChanged.addListener(function(changes) {
   for (key in changes) {
       var variable = changes[key];
       if (key === "search") {
           search = new Set(JSON.parse(variable.newValue));
       }
   }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (search.has(request.key)) {
            sendResponse(total.get(request.key));
        }
        else {
            sendResponse(null);
        }
    }
);