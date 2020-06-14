$(document).on('click','#options_btn',function(){
    window.open('options.html');
});

const domainRegExp = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im;

function domain_from_url(url) {
    let result
    let match
    if (match = url.match(domainRegExp)) {
        result = match[1]
        if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
            result = match[1]
        }
    }
    return result
}

$(document).ready(function(){

    const modal = $('#exclude-modal');

    const currentBtn = $("#current-btn");
    const domainBtn = $("#domain-btn");

    const alert = $(".alert");

    function handleChooseExcludeRangeBtn(caller, attrName){
        const excludeLifeSpan = modal.attr('data-lifespan');
        console.log(excludeLifeSpan);

        modal.css('display','none');
        const targetAddr = caller.attr(attrName);
        console.log(targetAddr);
        //TODO popup에서도 설정 저장하고 있어야 한다. 현재 통째로 전달해주는 방식 사용.
        // chrome.runtime.sendMessage({msg_type : "set", target_obj : {temp_excluded_sites : ""}},
        //     function(response) {console.log(response);});

        alert.css('display','block');
    }

    function handleExcludeBtn(excludeLifeSpan){
        console.log('exclude btn clicked');

        modal.attr('data-lifespan', excludeLifeSpan);

        const domainAddr = "도메인 : " + domain_from_url(location.href) ;
        $('#domain-addr-paragraph').text(domainAddr);
        domainBtn.attr('data-domain', domainAddr);

        const curAddr = "현재 페이지 : " + location.href;
        $('#cur-addr-paragraph').text(curAddr);
        currentBtn.attr('data-cur', curAddr);

        modal.css('display','block');
    }

    $("#temp-btn").click(function(){
        handleExcludeBtn("temp_excluded_sites");
    });

    $("#permanent-btn").click(function(){
        handleExcludeBtn("excludedSites");
    });

    $("#close-exclude-modal").click(function(){
        modal.css('display','none');
    });

    //TODO excludeLifeSpan은 modal에 data로 넣어두자.

    currentBtn.click(function(){
        handleChooseExcludeRangeBtn($(this),"data-cur");
    });
    domainBtn.click(function(){
        handleChooseExcludeRangeBtn($(this),"data-domain");
    });

    $(".alert-close-btn").click(function(){
        alert.css('display','none');
    });

});


