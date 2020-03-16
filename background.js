const regex_host = /^(http[s]?:\/)?\/?([^:\/\s]+)(:\d*)?/g;
const regex_params = /(\w*=\w*)/g;

const editor_value = "/editor.html";
const wcmmode_value = "wcmmode=disabled";

const crx_value = "/crx/de/index.jsp";
const system_value = "/system/console/bundles";

chrome.commands.onCommand.addListener(function (command) {
    chrome.tabs.getSelected(null, function (tab) {
        let newUrl = "";
        const host = tab.url.match(regex_host) + "";

        if (host !== null)
            switch (command) {
                case "open-crx":
                    newUrl = host + crx_value;
                    break;
                case "open-console":
                    newUrl = host + system_value;
                    break;
                case "toggle-editor-preview":
                    newUrl = toggleEditorPreview(tab.url, host);
                    break;
                case "current-path-crx":
                    newUrl = openCurrentPathCrx(tab.url, host);
                    break;
            }

        newUrl !== "" && chrome.tabs.create({url: newUrl, index: tab.index + 1});
    });
});

toggleEditorPreview = (url, host) => {
    let params = url.match(regex_params);
    url = url.replace(/\?.*/, "");

    if (params === null)
        params = [];
    else if (params.includes(wcmmode_value))
        params.splice(params.indexOf(wcmmode_value), 1);

    if (url.includes(editor_value)) {
        url = url.replace(editor_value, "");
        params.unshift(wcmmode_value);
    } else {
        url = url.slice(0, host.length) + editor_value + url.slice(host.length);
    }

    return params.length <= 0 ? url : url + "?" + params.join("&");
};

openCurrentPathCrx = (url, host) => {
    url = url.replace(editor_value, "")
        .replace(/\?.*/, "")
        .replace(".html", "");
    return url.slice(0, host.length) + crx_value + "#" + url.slice(host.length);
};