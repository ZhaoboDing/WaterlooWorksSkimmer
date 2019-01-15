$(document).ready(function () {
    chrome.storage.local.get('search', function(result) {
        var search = new Set(JSON.parse(result.search));
        $('input').each(function () {
            if (search.has($(this).parent().text() + ":")) {
                $(this).context.checked = true;
            }
        });
    });

    $('button').click(function () {
        var selected = new Set();
        $('input').each(function () {
            if ($(this).context.checked) {
                selected.add($(this).parent().text() + ":");
            }
        });

        chrome.storage.local.set({'search': JSON.stringify([...selected])});
        window.close();
    });
});
