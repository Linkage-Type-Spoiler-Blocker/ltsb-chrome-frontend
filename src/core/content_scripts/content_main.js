
import {extractFullText} from "./statement_extractor.js";

var userOptions;
var cur_url;

function loadOptions(callback){
    chrome.runtime.sendMessage({msg_type : "get"}, callback);
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

function isMatchedToRegex(regex, targetURL){
    let re = new RegExp(regex);
    let result = re.test(targetURL);
    console.log(result)
    return result;
}

function isExcludedSites(firstRegexes, secondRegexes, targetURL){
    if(firstRegexes.some(curRegex=>isMatchedToRegex(curRegex, targetURL))||
        secondRegexes.some(curRegex=>isMatchedToRegex(curRegex, targetURL))){
        return true;
    }
    else{
        return false;
    }
}

export function main(){
    // TODO 비동기랑 동기가 섞여있음에 유의할것. 적어도 load options 후에 다른것들이 수행되어야 할거같은데?
    //기본적으로 자바스크립트 함수가 동기인가? 비동기인가? 함수앞에 명시해야할때가 언제?
    loadOptions((resUserOption)=>{
        userOptions = resUserOption;
        loadURL();
        if(isExcludedSites(userOptions.excludedSites, userOptions.tempExcludedSites, cur_url)){
            console.log("제외사이트");
            return;
        }
        else{
            let fullText = extractFullText();
            console.log(fullText);
        }
    });
}


