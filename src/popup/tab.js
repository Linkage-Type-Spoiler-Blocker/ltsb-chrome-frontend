let userOptions;
let userWords = ["dd","ee"];
let moviesToBeBlocked = [];

let wordTable;

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
    // chrome.runtime.sendMessage({"msg_type" : "set","target_obj" : {"userWordsToBeBlocked" : userWords}},
    //     (response)=>{console.log(response);});
  }
}

function fillWordTable(){
  userWords.forEach((curWord)=>{
    const curRow = wordTable.insertRow(1);
    const chkBox = curRow.insertCell(0);
    const text = curRow.insertCell(1);
    chkBox.innerHTML ='<input type="checkbox" class="word-check">';
    text.innerText = curWord;
  })
}

$(document).ready(()=>{
  var wordInput = document.getElementById("word-input");
  wordTable = document.getElementById("word-table");

  fillWordTable();

  // TODO 이게 진짜 깔끔한 설정 불러오기 방식임. 마음이 편안해 아주.
  //
  // const optionPromise = new Promise((resolve,reject)=>{
  //   chrome.runtime.sendMessage({msg_type : "get"}, (options)=>{
  //     userOptions = options;
  //     resolve(true);
  //   });
  // });
  //
  // optionPromise.then((result)=>{
  //   userWords = userOptions.userWordsToBeBlocked;
  //   moviesToBeBlocked = userOptions.moviesToBeBlocked;
  //   // 단어 초기화 해주면 됨
  //   fillWordTable();
  // });

  //나머지 부분은 그냥 핸들러 연결해주면 됨.

  $(document).on('keyup','#word-input',()=>{
    let tr, td, i, txtValue;
    let filter = wordInput.value.toUpperCase();
    console.log(filter);

    tr = wordTable.getElementsByTagName('tr');

    for (i = 1; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];

      if (td) {
        txtValue = td.textContent;
        console.log(txtValue);
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";

        } else {
          tr[i].style.display = "none";
        }
      }
    }
  });

  $(document).on('click', '#add-btn',()=>{
    const curWord = wordInput.value.toUpperCase();
    addWord(curWord);
    const curRow = wordTable.insertRow(1);
    const chkBox = curRow.insertCell(0);
    const text = curRow.insertCell(1);
    chkBox.innerHTML ='<input type="checkbox" class="word-check">';
    text.innerText = curWord;
  });

  $(document).on('click', '#delete-btn',()=>{
    let tr, i;

    tr = wordTable.getElementsByTagName('tr');

    for (i = 1; i < tr.length; i++) {

      const tds = tr[i].getElementsByTagName("td");

      console.log(tds);

      const checkbox = tds[0].children[0];

      const text = tds[1].textContent;
      console.log(text);

      if (checkbox.checked === true) {
        userWords.splice(userWords.indexOf(text), 1);
        $(tds).remove();
      }
    }
    // chrome.runtime.sendMessage({"msg_type" : "set","target_obj" : {"userWordsToBeBlocked" : userWords}},
    //     (response)=>{console.log(response);});
  });

});

