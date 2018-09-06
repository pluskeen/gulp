$(function () {
  var $con_r_list = $('.con_r_list');
  var $new_load_tip = $('.new_load_tip');
  var $news_i_box = $('.news_i_box');
  var rows = 5;
  var page = 1;

  // 左侧点击
  $('.con_l_list').on('click', '.l_item', function () {
    $(this).addClass('on').siblings('.l_item').removeClass('on')
    $(this).children('.l_item_a').addClass('on')
    $(this).siblings('.l_item').children('.l_item_a').removeClass('on')
    $con_r_list.empty();
    loadData(random(1, 2, 1));
    $news_i_box.css('background-image', 'url(' + mock.headImg[random(0, 4, 1)] + ')');
  })

  // 模板字符串
  var Li = function (data) {
    this.data = data;
    var html = '';
    if (data.src) {
      // 有图片情况
      html = '<li class="r_item_li"><a href="javascript:void(0)" class="r_item"><div class="r_im_l"><div class="r_day">' +
        data.day + '</div><div class="r_data">' + data.yyyymm + '</div>' + '</div><div class="r_im_m"><div class="r_img_m_box lazy">' +
        '<img src="./image/defaultnew.png" data-src="' + data.src + '" class="block_image"></div></div><div class="r_im_r"><div class="r_r_tit">' + data.title + '</div>' +
        '<div class="r_r_bd">' + data.con + '</div></div></a></li>';
    } else {
      // 没有图片清空
      html = '<li class="r_item_li"><a href="javascript:void(0)" class="r_item"><div class="r_im_l"><div class="r_day">' +
        data.day + '</div><div class="r_data">' + data.yyyymm + '</div>' + '</div><div class="r_im_r no_r_i_m"><div class="r_r_tit">' + data.title + '</div>' +
        '<div class="r_r_bd">' + data.con + '</div></div></a></li>';
    }
    // 返回JQUERY对象
    return $(html);
  }

  // 加载数据
  var loadData = function (p) {
    // mock数据只有10条，模拟加载完成
    if (p > 2) {
      $new_load_tip.text('数据加载完毕');
      return
    }
    var limit = (p - 1) * rows;
    var large = p * rows;
    // 获取对应区间的数据
    $.each(mock.body, function (i, c) {
      if (i >= limit && i < large) {
        // 创建字符串模板jquery对象实例
        var li = new Li(c);
        // 获取图片地址
        var src = li.find('img').data('src');
        if (src) {
          var img = new Image();
          // 图片加载完成后替换默认图片，更换样式
          img.onload = function () {
            li.find('img').attr('src', src).parents('.r_img_m_box').removeClass('lazy');
          }
          img.src = src;
        }
        // 向html插入模板
        $con_r_list.append(li);
        $new_load_tip.text('数据加载中');
      }
    })
    //console.log(p)
    // page自增
    page++;
  }
  // 初始加载
  loadData(page);

  var lazyLoad = function () {
    if ($(window).height() + $(document).scrollTop() > $(document).height() - 300) {
      loadData(page)
    }
  }
  // 绑定滚动事件，模拟请求获取数据
  $(window).on('scroll', throttle(lazyLoad, 500, 1000))
  //节流函数比去抖函数多了一定时间内比执行的操作
  function throttle(fun, delay, time) {
    var timeout,
      startTime = new Date();
    return function () {
      var context = this,
        args = arguments,
        curTime = new Date();
      clearTimeout(timeout);
      // 如果达到了规定的触发时间间隔，触发 handler  
      if (curTime - startTime >= time) {
        fun.call(context, args);
        startTime = curTime;
        // 没达到触发间隔，重新设定定时器  
      } else {
        timeout = setTimeout(function () {
          fun.call(context, args);
        }, delay);
      }
    };
  };
})