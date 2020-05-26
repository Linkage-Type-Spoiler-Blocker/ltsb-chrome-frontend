
(async () => {
    const src = chrome.extension.getURL('core/content_scripts/content_main.js');
    const contentScript = await import(src);
    contentScript.main();
})();

