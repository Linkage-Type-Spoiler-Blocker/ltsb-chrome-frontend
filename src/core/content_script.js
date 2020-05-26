var userOptions;

(function(){
    chrome.runtime.sendMessage({msg_type : "get"}, function(response) {
        userOptions = response
        // console.log(response);
    });
})();

//실제로는 main.html과 options.html에 정의되어야 할 message전송 기능.
(function(){
    chrome.runtime.sendMessage({msg_type : "set", target_obj : {isBlockingEnabled : true}},
        function(response) {console.log(response);});
})();

