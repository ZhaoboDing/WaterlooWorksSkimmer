'use strict';

$(document).ready(function () {
    $("#postingsTable tbody tr td:nth-child(3)").each(function () {
        var id = $(this).text();
        tippy(this, {
            content: "Loading...",
            animation: "scale",
            theme: "light",
            placement: "right",
            interactive: "true",
            onShow(tip) {
                fetchInfoHtml(id).then(function (data) {
                    if (data != null) {
                        tip.setContent(data);
                    }
                    else {
                        tip.setContent("No data!");
                    }
                });
            }
        })
    })
});

function getWorkHtml(id) {
    var body = {
        postingId: id,
        action: fetchAction,
    };

    var res = null;
    $.ajaxSettings.async = false;
    $.post(postingsUrl, body, function(data, status) {
        if (status === "success") {
            res = data;
        }
    });

    return res;
}

function fetchInfoHtml(id) {
    var htmlStr = getWorkHtml(id);
    if (htmlStr === null) {
        return new Promise(function (resolve, reject) {
            resolve(null);
        });
    }

    var def = $.Deferred();

    var html = new DOMParser().parseFromString(htmlStr, "text/html");
    var tableHtml = "<div class='wrapper'><table class='brief'>";
    var count = $('table[class = "table table-bordered"] tbody tr', html).length;
    $('table[class = "table table-bordered"] tbody tr', html).each(function(i) {
        var key = $(this).children(":first").text().replace(/^\s+|\s+$/g,"");
        var val = $(this).children(":last").prop('innerHTML');
        inRequest(key).then(function (response) {
            // console.log(key, response);
            if (response != null) {
                tableHtml += "<tr><td>" + response + "</td><td>" + val + "</td></tr>";
            }
            if (!--count) {
                tableHtml += "</table></div>";
                def.resolve(tableHtml);
            }
        });

    });

    return def.promise();
}

function inRequest(key) {
    var def = $.Deferred();
    chrome.runtime.sendMessage({key: key}, function (response) {
        def.resolve(response);
    });

    return def.promise();
}