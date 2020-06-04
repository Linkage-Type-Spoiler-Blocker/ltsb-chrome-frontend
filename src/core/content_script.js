

// *** div 등 변경사랑 있을 때마다 함수실행
// Declare observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log(mutation); // test

        for(var i=0; i<mutations.length; i++){// 여기서 스포일러 판단
            if(){ // 지정단어 등이랑 비교해야됨
                pageAlert();
            }
        }
    });
});
// target node
var target = document.getElementById('my-id');
// configuration
var config = {
    childList: true,
    attributes: true,
    characterData: true
}
// start observer
observer.observe(target, config);


// 스포 판단

// 전체차단 -> 페이지 들어가면 경고창 띄움
function pageAlert(){
    alert('This article contains spoiler.');
}