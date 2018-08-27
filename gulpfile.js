// 1. 全局安装 gulp：
// npm install --global gulp
// 2. 作为项目的开发依赖（devDependencies）安装：
// npm install --save-dev gulp

var del = require("del"); // 第三方删除模块
var postcss = require("gulp-postcss");
var gulp = require("gulp");
var cssnext = require("postcss-cssnext");
var cssnano = require("cssnano");
var uglify = require("gulp-uglify");
var changed = require("gulp-changed");
var tinypng = require("gulp-tinypng-compress");
var imagemin = require("gulp-imagemin");
var cache = require("gulp-cache"); //使用 gulp-cache 只压缩修改的图片，没有修改的图片直接从缓存文件读取
var pngquant = require("imagemin-pngquant");

var minifyCss = "./minifycss/";
var minifyJs = "./minifyjs/";
var minifyImg = "./minifyimg/";

//css压缩
gulp.task("minifycss", function() {
  var plugins = [
    cssnext({
      browsers: ["> 1%", "last 5 versions", "Firefox ESR"],
      warnForDuplicates: false
    }),
    cssnano()
  ];
  return gulp
    .src("./css/*.css")
    .pipe(changed(minifyCss))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(minifyCss));
});

//js压缩
gulp.task("minifyjs", function() {
  return gulp
    .src("./js/**/*")
    .pipe(changed(minifyJs))
    .pipe(uglify())
    .pipe(gulp.dest(minifyJs));
});

//image压缩
gulp.task("minifyimg", function() {
  return gulp
    .src("./image/*")
    .pipe(
      cache(
        imagemin(
          [
            imagemin.gifsicle({ interlaced: true }), //类型：Boolean 默认：false 隔行扫描gif进行渲染
            imagemin.jpegtran({ progressive: true }), //类型：Boolean 默认：false 无损压缩jpg图片
            imagemin.optipng({ optimizationLevel: 5 }), //类型：Number  默认：3  取值范围：0-7（优化等级）
            imagemin.svgo({
              plugins: [
                { removeViewBox: true }, // removeViewBox 移除svg的viewbox属性
                { cleanupIDs: false }, // 删除未使用的和缩小使用的ID
                { multipass: true } //类型：Boolean 默认：false 多次优化svg直到完全优化
              ]
            })
          ],
          { use: [pngquant()] }
        )
      )
    )
    .pipe(gulp.dest(minifyImg));
});
//gulp.task('tinypng', function () {
//    gulp.src('./image/**/*.{png,jpg,jpeg}')
//        .pipe(tinypng({
//            key: '3cVo5YcavdSKzH4M_-JzyNbboFRXaMZV',
//            sigFile: 'images/.tinypng-sigs',
//            log: true
//        }))
//        .pipe(gulp.dest(minifyImg));
//});
//删除指定文件
gulp.task("del", function(cb) {
  del(["./minifycss/**/*", "./minifyjs/**/*", "./minifyimg/**/*"], cb);
});

//gulp.task('default',function(){
//    gulp.start('del','minifycss','minifyjs','minifyimg');
//});

gulp.task("default", function() {
  gulp.start("del", "minifyimg");
});
