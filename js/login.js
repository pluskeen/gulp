$(function () {
  var E = function (el) {
    this.$el = $(el);
  }

  // 一周免登陆点击事件
  E.prototype.lgRoSel = function () {
    this.$el.on('click', function () {
      $(this).hasClass('login_ck_t') ?
        $(this).removeClass('login_ck_t').children('.l_ck_i').removeClass('l_ck_i_t').next('input[type="radio"]').removeProp('checked') :
        $(this).addClass('login_ck_t').children('.l_ck_i').addClass('l_ck_i_t').next('input[type="radio"]').prop('checked', "checked")
    })
  }

  // 提交表单
  E.prototype.lgSubmit = function () {
    this.$el.on('submit', function (e) {
      e.preventDefault();
      console.log($(this).serializeArray(),$(this).find('input[type="radio"]').prop('checked'))
    })
  }

  new E('.login_ck').lgRoSel();
  new E('.login_form').lgSubmit();

  // placehoder插件调用,ie9不支持placehoder
  $('input, textarea').placeholder();
})