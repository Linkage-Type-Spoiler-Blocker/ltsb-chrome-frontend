var userOptionObj;
var temp_excluded_sites;

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
    let site_added_options = Object.assign({},userOptionObj);
    site_added_options.temp_excluded_sites = temp_excluded_sites;
    sendResponse(site_added_options);
}

function setOptionsFromMsgSenders(options, sendResponse) {
    chrome.storage.sync.set(request.target_obj, loadUserOptions());
    sendResponse({result : true});
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // console.log("get message");
        if(request.msg_type == "get"){
            sendOptionsToMsgSender(sendResponse);
            // console.log("get");
        }
        if(request.msg_type == "set"){
            let options_to_be_saved = request.target_obj;
            if('temp_excluded_sites' in options_to_be_saved){
                temp_excluded_sites = options_to_be_saved.temp_excluded_sites;
                let {temp_excluded_sites, ...omitted_options_to_be_saved} = options_to_be_saved;
                setOptionsFromMsgSenders(omitted_options_to_be_saved, sendResponse);
            }
            else{
                setOptionsFromMsgSenders(options_to_be_saved, sendResponse);
            }
            // console.log("set");
        }
    }
);

