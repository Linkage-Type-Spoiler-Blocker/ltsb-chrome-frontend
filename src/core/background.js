var userOptionObj;
var temp_excluded_sites;

function makeStorageStructure() {
    chrome.storage.sync.set({
        "excludedSites" : [],
        "tempExcludedSites" :[],
        "doesPredict" : false,
        "doesBlockAllContents" : false,
        "isBlockingEnabled" : false,
        "userWordsToBeBlocked" : [],
        "moviesToBeBlocked" : [],
        "isStorageEnabled" : true
    },loadUserOptions((items)=>{
        userOptionObj = items;
    }));
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
    loadUserOptions((items)=>{
        userOptionObj = items;
        userOptionObj['tempExcludedSites'] = [];
    })
})();

function loadUserOptions(callback){
    chrome.storage.sync.get(null,callback);
}

function sendOptionsToMsgSender(sendResponse) {
    let site_added_options = Object.assign({},userOptionObj);
    site_added_options.temp_excluded_sites = temp_excluded_sites;
    console.log(Object.keys(site_added_options));
    sendResponse(site_added_options);
}

function setOptionsFromMsgSenders(options, sendResponse) {
    chrome.storage.sync.set(options, loadUserOptions((items)=>{
        userOptionObj = items;
    }));
    sendResponse({result : true});
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // console.log("get message");
        if(request.msg_type == "get"){
            // sendOptionsToMsgSender(sendResponse);
            // console.log("get");
            sendResponse(userOptionObj);
        }
        if(request.msg_type == "set"){
            let options_to_be_saved = request.target_obj;
            // if('temp_excluded_sites' in options_to_be_saved){
            //     temp_excluded_sites = options_to_be_saved.temp_excluded_sites;
            //     let {temp_excluded_sites, ...omitted_options_to_be_saved} = options_to_be_saved;
            //     setOptionsFromMsgSenders(omitted_options_to_be_saved, sendResponse);
            // }
            // else{
            setOptionsFromMsgSenders(options_to_be_saved, sendResponse);
            // }
            // console.log("set");
        }
        return true;
    }
);

