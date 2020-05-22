$(document).on('click','.tab_menu_btn',function(){
  $('.tab_menu_btn').removeClass('on');
  $(this).addClass('on');

  var idx = $('.tab_menu_btn').index(this);
  $('.tab_box').hide();
  $('.tab_box').eq(idx).show();
});