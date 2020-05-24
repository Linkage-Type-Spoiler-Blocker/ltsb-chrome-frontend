var userOptionObj;

function makeStorageStructure() {
    chrome.storage.sync.set({
        "excludedSites" : [],
        "doesPredict" : false,
        "doesBlockAllContents" : false,
        "isBlockingEnabled" : false,
        "userWordsToBeBlocked" : [],
        "moviesToBeBlocked" : [],
        "isStorageEnabled" : true
    },loadUserOptions());
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

(function(){
    loadUserOptions()
})();

function loadUserOptions(){
    chrome.storage.sync.get(null,function(items){
        userOptionObj = items;
    })
}

function sendOptionsToMsgSender(sendResponse) {
    sendResponse(userOptionObj);
}

function setOptionsFromMsgSenders(request) {
    chrome.storage.sync.set(request.target_obj, loadUserOptions());
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.msg_type == "get"){
            sendOptionsToMsgSender(sendResponse);
        }
        if(request.msg_type == "set"){
            setOptionsFromMsgSenders(request);
        }
    }
);