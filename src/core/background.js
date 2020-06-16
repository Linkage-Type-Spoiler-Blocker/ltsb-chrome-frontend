var userOptionObj;
// var temp_excluded_sites;
var wordsPerMovie;

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
    chrome.storage.local.set({
        "wordsPerMovie" : []
    }, loadWordsPerMovie((items)=>{
        wordsPerMovie = items.wordsPerMovie;
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
    });
    loadWordsPerMovie((items)=>{
        wordsPerMovie = items.wordsPerMovie;
    });
})();

function loadUserOptions(callback){
    chrome.storage.sync.get(null,callback);
}

function loadWordsPerMovie(callback){
    chrome.storage.local.get("wordsPerMovie",callback);
}

// function sendOptionsToMsgSender(sendResponse) {
//     let site_added_options = Object.assign({},userOptionObj);
//     site_added_options.temp_excluded_sites = temp_excluded_sites;
//     console.log(Object.keys(site_added_options));
//     sendResponse(site_added_options);
// }

function setOptionsFromMsgSenders(options, sendResponse) {
    chrome.storage.sync.set(options, loadUserOptions((items)=>{
        userOptionObj = items;
    }));
    sendResponse({result : true});
}


function requestWordsToServer(reqAddress,isExistInSync,sendResponse){

    fetch(reqAddress,{
        method : "GET",
        header : {
            'Accept': 'application/json',
            'Content-Type' : 'application/json'
        }
    })
    .then((response)=>{
        console.log("receive request");
        return response.json();
    }).
    then(resultJson=>{
        console.log(resultJson);
        addMovieWords(resultJson,isExistInSync)
        sendResponse("receive request");
    })
    .catch(error => {
        console.log(error)
        sendResponse("error");
    });
}

function addMovieWords(resultObj,isExistInSync){
    const {movie_id,title,words} = resultObj;
    if(!isExistInSync){
        userOptionObj.moviesToBeBlocked.push(movie_id);
        chrome.storage.sync.set({"moviesToBeBlocked" : userOptionObj.moviesToBeBlocked},
            (error)=>{console.log(error);});
    }

    const curMovie ={
        "movie_id" : movie_id,
        "title" : title,
        "words" : words
    }
    wordsPerMovie.push(curMovie);
    chrome.storage.local.set({"wordsPerMovie" : wordsPerMovie},
        (error)=>{console.log(error);});
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("get message");
        if(request.msg_type == "get"){
            // sendOptionsToMsgSender(sendResponse);
            // console.log("get");
            sendResponse(userOptionObj);
        }
        if(request.msg_type == "set"){
            let options_to_be_saved = request.target_obj;

            setOptionsFromMsgSenders(options_to_be_saved, sendResponse);

        }
        if(request.msg_type  == "get_words"){
            sendResponse(wordsPerMovie);
        }
        if(request.msg_type == "set_words"){
            console.log("set_words");
            const {movie_id,title} = request.target_obj;
            wordsPerMovie.forEach((curMovie)=>{
                if(curMovie.movie_id === movie_id){
                    sendResponse("already exist");
                    return true;
                }
            });

            const reqAddress = `http://18.233.34.24:3000/movie/words?movie_id=${movie_id}&title=${title}`;
            requestWordsToServer(reqAddress,false,sendResponse);
        }
        return true;
    }
);

