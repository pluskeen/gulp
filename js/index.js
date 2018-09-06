$(function () {
  var mySwiper_1 = new Swiper('#c_swiper_1', {
    autoplay: 3000, //可选选项，自动滑动
    loop: true, //可选选项，开启循环
    pagination: '#c_swiper_pagination_1',
    paginationClickable: true,
    autoplayDisableOnInteraction: false
  })

  var mySwiper_2 = new Swiper('#c_swiper_2', {
    autoplay: 3000, //可选选项，自动滑动
    loop: true, //可选选项，开启循环
    pagination: '#c_swiper_pagination_2',
    paginationClickable: true,
    autoplayDisableOnInteraction: false
  })

  var mySwiper3 = new Swiper('#c_swiper_3', {
    mode: 'vertical',
    slidesPerView: 3,
    autoplay: 3000, //可选选项，自动滑动
    loop: true, //可选选项，开启循环
    autoplayDisableOnInteraction: false
  })

  var $pro = $('.con_floor_2_e.pro');
  var $info = $('.con_floor_2_e.info');

  // 信息发布点击
  $('.c_floor_2_r').on('click', function () {
    $(this).parents('.con_floor_2').css('margin-bottom', "10px");
    // $(this).children('.c_2_l_item_a').addClass('on');
    if ($info.is(":hidden")) {
      $info.show(200);
      $pro.hide(200);
      // $('.c_2_l_item.pro').children('.c_2_l_item_a').removeClass('on');
    } else {
      $info.hide(200);
    }
  })

  // 流程管理点击
  $('.c_2_l_item.pro').on('click', function () {
    $(this).parents('.con_floor_2').css('margin-bottom', "10px");
    // $(this).children('.c_2_l_item_a').addClass('on');
    if ($pro.is(":hidden")) {
      $pro.show(200);
      $info.hide(200);
      // $('.c_floor_2_r').children('.c_2_l_item_a').removeClass('on');
    } else {
      $pro.hide(200);
    }
  })

  var loadImgTemp = function (data) {
    var html = '';
    if (data.sign) {
      html = '<a href="javascript:void(0)" class="f_news"><div class="news_img_box"><img class="block_image" src="' +
        data.src + '"></div><div class="news_bd"><div class="news_bd_in_hd"><div class="nw_hd_tit">' +
        data.tit + '</div><div class="nw_hd_sign">New</div><div class="nw_hd_time">' +
        data.time + '</div > </div><div class="news_bd_in_bd"><div class="nw_bd_summary">' +
        data.sum + '</div></div></div></a>';
    } else {
      html = '<a href="javascript:void(0)" class="f_news"><div class="news_img_box"><img class="block_image" src="' +
        data.src + '"></div><div class="news_bd"><div class="news_bd_in_hd"><div class="nw_hd_tit">' +
        data.tit + '</div><div class="nw_hd_sign n_sign_out"></div><div class="nw_hd_time">' +
        data.time + '</div > </div><div class="news_bd_in_bd"><div class="nw_bd_summary">' +
        data.sum + '</div></div></div></a>';
    }
    return html
  }

  var loadTemp = function (data) {
    var html = '';
    if (data.sign) {
      html = '<li class="f_news_item"><a href="javascript:void(0)" class="f_news_a"><div class="nw_a_tit">' +
        data.tit + '</div><div class="nw_a_sign">New</div><div class="nw_a_time">' +
        data.time + '</div></a></li>';
    } else {
      html = '<li class="f_news_item"><a href="javascript:void(0)" class="f_news_a"><div class="nw_a_tit">' +
        data.tit + '</div><div class="nw_a_sign nw_a_sign_out"></div><div class="nw_a_time">' +
        data.time + '</div></a></li>';
    }
    return html
  }


  // 面包屑点击
  // $('.breadcrumbs').on('click', '.bread_pri_tit', function () {
  //   console.log($(this), $(this).parents('.breadcrumbs').siblings('.img_news_show').length)
  // })

  $('.breadcrumbs').on('click', '.bread_sub_tit', function () {
    var $img_news_show = $(this).parents('.breadcrumbs').siblings('.img_news_show');
    var rdm, a = '';
    if ($img_news_show.length > 0) {
      rdm = random(0, 7, 4);
      $.each(rdm, function (i, c) {
        a += loadImgTemp(indexMock[c])
      })
      $img_news_show.empty().append($(a));
    } else {
      rdm = random(0, 13, 7);
      $.each(rdm, function (i, c) {
        a += loadTemp(indexMock[c])
      })
      $(this).parents('.breadcrumbs').siblings('.f_news_wrap').empty().append($(a));
    }

    //console.log($(this), $(this).parents('.breadcrumbs').siblings('.img_news_show').length)
    $(this).siblings('.bread_pri_tit').removeClass('bread_pri_tit').addClass('bread_sub_tit');
    $(this).next('.bread_news_n').text('');
    $(this).removeClass('bread_sub_tit').addClass('bread_pri_tit');

  })


})