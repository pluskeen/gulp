var clean = require("gulp-clean"),
  postcss = require("gulp-postcss"),
  gulp = require("gulp"),
  cssnext = require("postcss-cssnext"),
  cssnano = require("cssnano"),
  uglify = require("gulp-uglify"),
  changed = require("gulp-changed"),
  cache = require("gulp-cache"), //使用 gulp-cache 只压缩修改的图片，没有修改的图片直接从缓存文件读取
  imagemin = require("gulp-imagemin"),
  htmlmin = require("gulp-htmlmin"),
  concat = require("gulp-concat"), //多个文件合并为一个
  rev = require("gulp-rev"), //对文件名加MD5后缀
  pngquant = require("imagemin-pngquant"),
  replace = require("gulp-replace"), //文件名替换
  seq = require("gulp-sequence"),
  revCollector = require("gulp-rev-collector"), //路径替换
  rename = require("gulp-rename"),
  babel = require("gulp-babel");

// 目录
var distPath = "dist/", // 输出目录
  assetPath = "asset/"; // 静态资源

// css 压缩
gulp.task("minify:css", function() {
  return (
    gulp
      .src("css/**/*") // css 文件地址
      .pipe(changed(distPath + "css/**/*"))
      //.pipe(concat("build.css")) //合成到一个 css，合并顺序按读取到文件的先后排列
      //.pipe(gulp.dest(distPath + "css/"))
      .pipe(
        postcss([
          cssnext({
            browsers: ["> 3%", "last 5 versions", "Firefox ESR"],
            warnForDuplicates: false
          }),
          cssnano()
        ])
      )
      //.pipe(concat("build.min.css")) //压缩后的 css
      .pipe(gulp.dest(distPath + "css/"))
  );
});

// css 压缩并添加 md5
gulp.task("minify:css:md5", function() {
  return (
    gulp
      .src("css/**/*") // css 文件地址
      .pipe(changed(distPath + "css/**/*"))
      //.pipe(concat("build.css")) //合成到一个 css，合并顺序按读取到文件的先后排列
      //.pipe(gulp.dest(distPath + "css/"))
      .pipe(
        postcss([
          cssnext({
            browsers: ["> 1%", "last 6 versions", "Firefox ESR"],
            warnForDuplicates: false
          }),
          cssnano()
        ])
      )
      .pipe(rev()) //文件名加MD5后缀
      //.pipe(concat("build.min.css")) //压缩后的 css
      .pipe(gulp.dest(distPath + "css/"))
      .pipe(rev.manifest("rev-css-manifest.json")) //生成一个rev-manifest.json
      .pipe(gulp.dest("rev")) //将 rev-manifest.json 保存到 rev 目录内
  );
});

// js压缩
gulp.task("minify:js", function() {
  return (
    gulp
      .src("js/**/*") // js文件地址
      .pipe(changed(distPath + "js/**/*"))
      //.pipe(concat("build.js")) //合成到一个 js，合并顺序按读取到文件的先后排列
      //.pipe(gulp.dest(distPath + "js/"))
      .pipe(babel())
      .pipe(uglify())
      //.pipe(concat("build.min.js")) //压缩后的js
      .pipe(gulp.dest(distPath + "js/"))
  );
});

// js 压缩并添加 md5
gulp.task("minify:js:md5", function() {
  return (
    gulp
      .src("js/**/*") // js文件地址
      .pipe(changed(distPath + "js/**/*"))
      //.pipe(concat("build.js")) //合成到一个js，合并顺序按读取到文件的先后排列
      //.pipe(gulp.dest(distPath + "js/"))
      .pipe(babel())
      .pipe(uglify())
      .pipe(rev()) //文件名加MD5后缀
      //.pipe(concat("build.min.js")) //压缩后的js
      .pipe(gulp.dest(distPath + "js/"))
      .pipe(rev.manifest("rev-js-manifest.json")) //生成一个rev-manifest.json
      .pipe(gulp.dest("rev")) //将 rev-manifest.json 保存到 rev 目录内
  );
});

// image压缩
gulp.task("minify:img", function() {
  return gulp
    .src([
      "image/**/*.jpg",
      "image/**/*.png",
      "image/**/*.gif",
      "image/**/*.svg"
    ])
    .pipe(
      cache(
        imagemin(
          [
            imagemin.gifsicle({ interlaced: true }), //类型：Boolean 默认：false 隔行扫描gif进行渲染
            imagemin.jpegtran({ progressive: true }), //类型：Boolean 默认：false 无损压缩jpg图片
            imagemin.optipng({ optimizationLevel: 3 }), //类型：Number  默认：3  取值范围：0-7（优化等级）
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
    .pipe(gulp.dest(distPath + "image/"));
});

// image压缩并添加 md5
gulp.task("minify:img:md5", function() {
  return gulp
    .src([
      "image/**/*.jpg",
      "image/**/*.png",
      "image/**/*.gif",
      "image/**/*.svg"
    ])
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
    .pipe(rev()) //文件名加MD5后缀
    .pipe(gulp.dest(distPath + "image/"))
    .pipe(rev.manifest("rev-img-manifest.json")) //生成一个rev-manifest.json
    .pipe(gulp.dest("rev")); //将 rev-manifest.json 保存到 rev 目录内
});

// 执行html压缩
gulp.task("minify:html", function() {
  return gulp
    .src("*.html")
    .pipe(
      htmlmin({
        removeComments: true, //清除HTML注释
        collapseWhitespace: false, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input check/>
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
      })
    )
    .pipe(gulp.dest(distPath));
});

// 替换文件名，将common.js替换为build.min.js
// gulp.task("replace:js", function() {
//   return gulp
//     .src([distPath + "*.html"])
//     .pipe(replace("common.js", "build.min.js"))
//     .pipe(gulp.dest(distPath));
// });

//替换文件名，将common.css替换为build.min.css
// gulp.task("replace:css", function() {
//   return gulp
//     .src([distPath + "*.html"])
//     .pipe(replace("common.css", "build.min.css"))
//     .pipe(gulp.dest(distPath));
// });

//使用rev替换 md5文件名，包括 html 和 css 的资源文件
gulp.task("rev:html", function() {
  //html，针对js,css,img
  return gulp
    .src(["rev/**/*.json", distPath + "**/*.html"])
    .pipe(revCollector({ replaceReved: true }))
    .pipe(gulp.dest(distPath));
});

gulp.task("rev:css", function() {
  //css，主要是针对img替换
  return gulp
    .src(["rev/**/rev-img-manifest.json", distPath + "css/*.css"])
    .pipe(revCollector({ replaceReved: true }))
    .pipe(gulp.dest(distPath + "css"));
});

// 删除 dist 文件
gulp.task("clean:dist", function(cb) {
  return gulp.src(distPath, { read: false }).pipe(clean());
});

//复制静态文件
gulp.task("copy:asset", function() {
  return gulp.src(assetPath + "**/*").pipe(gulp.dest(distPath + "asset/"));
});

//复制字体文件
gulp.task("copy:fonts", function() {
  return gulp.src(assetPath + "**/*").pipe(gulp.dest(distPath + "fonts"));
});

//复制图片文件
gulp.task("copy:img", function() {
  //如果需要压缩图片，那么这步可以省略
  return gulp.src("image/**/*").pipe(gulp.dest(distPath + "image"));
});

// gulp.task("default", ["clean:dist"], function() {
//   gulp.start("minify:html");
// });

//监视文件的变化，有修改时，自动调用default缺省默认任务
gulp.task("watch", function() {
  gulp.watch("**/*.html", ["default"]);
});

//缺省默认任务，输出的js和css文件都带参数
/**执行顺序：
 * 1、清除编译输出目录 dist 的全部文件
 * 2、复制静态资源到 dist 文件夹
 * 3、使用带 md5对 js文件进行压缩打包一个文件，命名根据gulp-rev插件md5之后的命名进行命名，如build-asdf123.min.js，并输出到 dist/js 文件夹
 * 4、使用带 md5对 cs文件进行压缩打包一个文件，命名根据gulp-rev插件md5之后的命名进行命名，如build-asd323.min.css，并输出到 dist/css 文件夹
 * 5、（可选）使用带md5对img文件夹的全部文件进行重命名，命名根据gulp-rev插件md5之后的命名进行命名，如common-asdf123.jpg，并输出到 dist/img 文件夹；如果这部不操作，下面第10步将不执行。
 * 6、将 dist 目录下的全部 html 页面进行压缩处理，采用gulp-minhtml插件
 * 7、（可选）由于项目上使用了模块开发，然后每个页面上都会引入common.js文件，而合并后的js文件为build.min.js，所以使用gulp-replace插件对 html页面进行替换，并将 html文件输出到 dist 目录上
 * 8、（可选）再次在 dist 目录上，将html进行common.css文件替换成build.min.css
 * 9、使用gulp-rev-collectorc插件对刚才生成带参数的js和css文件在html页面上进行替换，如build.min.js替换成build-asdf123.min.js。输出到 dist 目录。
 * 10、（可选）使用gulp-rev-collectorc插件对刚才生成带参数的img文件在css文件上进行替换，如common.jpg替换成common-asdf12.jpg。输出到目录
 * */
gulp.task("default", function(cb) {
  seq(
    "clean:dist",
    "copy:asset",
    "copy:fonts",
    "minify:js:md5",
    "minify:css:md5",
    "minify:img:md5",
    "minify:html",
    "rev:html",
    "rev:css"
  )(cb);
});