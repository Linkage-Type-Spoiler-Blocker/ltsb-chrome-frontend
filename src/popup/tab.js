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