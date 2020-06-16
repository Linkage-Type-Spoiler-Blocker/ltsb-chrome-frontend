let userOptions;
let userWords
let moviesToBeBlocked;

$(document).on('click','.tab_menu_btn',function(){
  $('.tab_menu_btn').removeClass('on');
  $(this).addClass('on');

  var idx = $('.tab_menu_btn').index(this);
  $('.tab_box').hide();
  $('.tab_box').eq(idx).show();
});

$(document).on('click','#signup_btn',function(){
  location.href = "signup.html";
});

$(document).on('click','#login_btn',function(){
  location.href = "login.html";
});

function addWord(word){
  if(userWords.includes(word)){
    return;
  }
  else{
    userWords.push(word);
    chrome.runtime.sendMessage({"msg_type" : "set","target_obj" : {"userWordsToBeBlocked" : userWords}},
        (response)=>{console.log(response);});
  }
}

$(document).ready(()=>{
  // TODO 이게 진짜 깔끔한 설정 불러오기 방식임. 마음이 편안해 아주.
  const optionPromise = new Promise((resolve,reject)=>{
    chrome.runtime.sendMessage({msg_type : "get"}, (options)=>{
      userOptions = options;
      resolve(true);
    });
  });

  optionPromise.then((result)=>{
    userWords = userOptions.userWordsToBeBlocked;
    moviesToBeBlocked = userOptions.moviesToBeBlocked;
    // 단어 초기화 해주면 됨
  })
  //나머지 부분은 그냥 핸들러 연결해주면 됨.
});

