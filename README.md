# Gulp Tutorials

- final Result
[https://dosimpact.github.io/lecture_gulp01/index.html](https://dosimpact.github.io/lecture_gulp01/index.html)

### 목적

- Node.js 상의 개발에서의 자동화
- 꼭 웹개발을 위해서만 gulp를 사용하는것은 아니다.
- 파일을 옮기거나,삭제하거나 할때도 사용이 가능하다.
- webpack도 비슷한 역활을 하는데, CRA 을 할때 내부적으로 구동이 된다. 그래서 열어볼일은 없을것이다.


```js
{
  "name": "lecture_gulp",
  "version": "1.0.0",
  "main": "index.js",
  "author": "DosImpact <ypd03008@gmail.com>",
  "license": "MIT",
  "scripts": {
    "dev": "gulp dev",
    "build": "gulp build",
    "deploy": "gulp deploy"
  },
  "devDependencies": {
    "@babel/core": "^7.12.3",
    "@babel/preset-env": "^7.12.1",
    "@babel/register": "^7.12.1",
    "babelify": "^10.0.0",
    "del": "^6.0.0",
    "gulp": "^4.0.2",
    "gulp-autoprefixer": "^7.0.1",
    "gulp-bro": "^2.0.0",
    "gulp-csso": "^4.0.1",
    "gulp-gh-pages": "^0.5.4",
    "gulp-image": "^6.2.1",
    "gulp-pug": "^4.0.1",
    "gulp-sass": "^4.1.0",
    "gulp-webserver": "^0.9.1",
    "node-sass": "^4.14.1",
    "uglifyify": "^5.0.2"
  },
  "browserslist": [
    "last 1 version",
    "> 1%",
    "IE 10"
  ]
}

```
```js

import gulp from "gulp"
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";
import ghPages from "gulp-gh-pages";


sass.compiler = require("node-sass");

// 리소스들의 path 모음
const routes = {
    pug: {
        watch: "src/**/*.pug",
        src: "src/*.pug",
        dest: "build"
    },
    img: {
        src: "src/img/*",
        dest: "build/img"
    },
    scss: {
        watch: "src/scss/**/*.scss",
        src: "src/scss/style.scss",
        dest: "build/css"
    },
    js: {
        watch: "src/js/**/*.js",
        src: "src/js/main.js",
        dest: "build/js"
    }
};
// prepare  /* pipe  */ 
const cleanPublishCache = () => del([".publish"]);
const clean = () => del(["build/"]);

const img = () =>
    gulp
        .src(routes.img.src)
        .pipe(image())
        .pipe(gulp.dest(routes.img.dest));

// assets  /* pipe  */ 

// pug 라는 함수는 src > pipe > dest 순서로 입력후 결과물이 나온다. pipe라인을 따라 코드가 이동 /* pipe  */ 
const pug = () =>
    gulp
        .src(routes.pug.src)
        .pipe(gpug())
        .pipe(gulp.dest(routes.pug.dest));

const styles = () =>
    gulp
        .src(routes.scss.src)
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(routes.scss.dest))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 2 versions"],
            })
        )
        .pipe(miniCSS());

// bro (browserify) > babelify + presetenv 로 변환 >
const js = () =>
    gulp
        .src(routes.js.src)
        .pipe(
            bro({
                transform: [
                    babelify.configure({ presets: ["@babel/preset-env"] }),
                    ["uglifyify", { global: true }]
                ]
            })
        )
        .pipe(gulp.dest(routes.js.dest));
// live  /* pipe  */ 

const webserver = () =>
    gulp.src("build").pipe(ws({ livereload: true, open: true }));

// src하위의 어떤 pug의 파일이 변화가 일어나면, pug를 다시 실행해서 컴파일을 진행 
const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.img.src, img);
    gulp.watch(routes.scss.watch, styles);
    gulp.watch(routes.js.watch, js);
};
// live  /* pipe  */ 
const gh = () => gulp.src("build/**/*").pipe(ghPages());


// serise는 함수와 함수를 직렬로 묶어준다. /* Series  */ 
const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);
const live = gulp.parallel([webserver, watch]); // 동시 실행

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, gh, cleanPublishCache]);

```