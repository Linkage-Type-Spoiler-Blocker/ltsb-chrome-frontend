
import {extractFullText} from "./statement_extractor.js";

var userOptions;
var cur_url;

function loadOptions(){
    chrome.runtime.sendMessage({msg_type : "get"}, function(response) {
        userOptions = response;
        // console.log(response);
    });
}

function loadURL(){
    cur_url = location.href;
    console.log(cur_url);
}

// TODO 실제로는 main.html과 options.html에 정의되어야 할 message전송 기능.
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
    //TODO 임시제외사이트 뿐만아니라 영구제외사이트도 같이 판단해야함.
    if(userOptions.temp_excluded_sites.includes(cur_url)){
        return true;
    }
    else{
        return false;
    }
}

export function main(){
    // TODO 비동기랑 동기가 섞여있음에 유의할것.
    //기본적으로 자바스크립트 함수가 동기인가? 비동기인가? 함수앞에 명시해야할때가 언제?
    loadOptions();
    loadURL();
    let fullText = extractFullText();
    console.log(fullText);
}


