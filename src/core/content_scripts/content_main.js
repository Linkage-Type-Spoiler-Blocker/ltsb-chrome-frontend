
var userOptions;
var cur_url;

function loadOptions(){
    chrome.runtime.sendMessage({msg_type : "get"}, function(response) {
        userOptions = response;
        // console.log(response);
    });
}

function loadURL(){
    // background에 재정의하고, background에 요청하는 기능으로 바꾸기
    // chrome.tabs.query({active: true, currentWindow : true}, tabs => {
    //     cur_url = tabs[0].url;
    // });
    cur_url = location.href;
    console.log(cur_url);
}

//실제로는 main.html과 options.html에 정의되어야 할 message전송 기능.
function temp_set_options(){
    chrome.runtime.sendMessage({msg_type : "set", target_obj : {isBlockingEnabled : true}},
        function(response) {console.log(response);});
}

function isBlockingEnabled(){
    if(userOptions.isBlockingEnabled == true) {
        return true;
    }
    else{
        return false;
    }
}

function isExcludedSites(){
    if(userOptions.temp_excluded_sites.includes(cur_url)){
        return true;
    }
    else{
        return false;
    }
}

export function main(){
    loadOptions();
    loadURL();

}


