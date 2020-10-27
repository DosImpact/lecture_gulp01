import gulp from "gulp"
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
import sass from "gulp-sass";

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
    }
};
// prepare  /* pipe  */ 
const clean = () => del(["build"]);

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
        .pipe(gulp.dest(routes.scss.dest));

// live  /* pipe  */ 

const webserver = () =>
    gulp.src("build").pipe(ws({ livereload: true, open: true }));

// src하위의 어떤 pug의 파일이 변화가 일어나면, pug를 다시 실행해서 컴파일을 진행 
const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.img.src, img);
    gulp.watch(routes.scss.watch, styles);
};

// serise는 함수와 함수를 직렬로 묶어준다. /* Series  */ 
const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles]);

const live = gulp.parallel([webserver, watch]); // 동시 실행

export const dev = gulp.series([prepare, assets, live]);