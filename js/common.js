  // 随机数
  var random = function (min, max, n) {
    var r = [];
    for (var i = 0; i < n; i++) {
      r.push(Math.floor(Math.random() * (max - min + 1) + min))
    }
    return r
  }

  $(function () {
    // 导航点击事件
    $('.nav_content').on('click', '.nav_item', function () {
      $(this).children('.n_item_a').addClass('on');
      $(this).siblings().children('.n_item_a').removeClass('on');
    })

    // 导航搜索关闭
    $('.nav_close').on('click', function () {
      // 清空输入
      $(this).next('.nav_input').children().val('');
      $(this).parents('.nav_search').hide(200);
    })

    // 导航搜索出现
    $('.srh_box').on('click', function () {
      $('.nav_search').show(200).find('.nav_input input').focus();
    })

    // 获取搜索值
    $('.nav_click').on('click', function () {
      // 获取输入值
      var val = $(this).prev('.nav_input').children().val();
      console.log(val, '提交搜索结果')
    })

    // 导航系统管理hover
    $('.mgr_down').hover(function () {
      $('.mgr_box .n_item_a').addClass('on')
    }, function () {
      $('.mgr_box .n_item_a').removeClass('on')
    })
  })