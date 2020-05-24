function makeStorageStructure() {
    chrome.storage.sync.set({
        "excludedSites" : [],
        "doesPredict" : false,
        "doesBlockAllContents" : false,
        "isBlockingEnabled" : false,
        "userWordsToBeBlocked" : [],
        "moviesToBeBlocked" : [],
        "isStorageEnabled" : true
    });
}

chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.sync.get({"isStorageEnabled" : false},function(item){
        if(item == true){
            return;
        }
        else{
            makeStorageStructure();
        }
    })
});
