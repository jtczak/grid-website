const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp'); //import API np. src z paczki gulp
const sass = require('gulp-sass')(require('sass'));
sass.compiler = require('node-sass');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const babel = require('gulp-babel'); //przekształca funkcje do starszych, zeby wszystkie przegladarki mogly korzystac
const uglify = require('gulp-uglify'); //minifikacja js
const imagemin = require('gulp-imagemin'); //minifikacja rozmiarów, webp pogarsza jakość zdjęć, chociaż super redukuje wielkość obrazu
const sourcemaps = require('gulp-sourcemaps'); //podaje źródło kodu, konkretną linijkę przed minifikacją (po minifikacji cały kod znajduje się w jednej linijce, więc nie można znaleźć błędu)
const clean = require('gulp-clean');
const kit = require('gulp-kit');
const browserSync = require('browser-sync').create(); //browser sync: super, bo tworzy nam serwer, ktory mozemy odpalic na telefonie czy wszedzie indziej na tym wifi przez wpisanie External - żeby wyjść to wciskamy ctrl+c
const reload = browserSync.reload;

//poprawiamy ścieżki -> wtedy zmiana tylko w jednym miejscu!
const paths = {
    js: './src/js/**/*.js',
    sass: './src/sass/**/*.scss',
    html: './html/**/*.kit',
    img: './src/img/*',
    dist: './dist',
    jsDest: './dist/js',
    imgDest: './dist/img',
    sassDest: './dist/css',
}

function sassCompiler(done) {
    src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano()).pipe(rename({
            suffix: '.min',
        }))
        .pipe(sourcemaps.write())
        .pipe(dest(paths.sassDest));
    done()
}

function javaScript(done) {
    src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(sourcemaps.write())
        .pipe(dest(paths.jsDest));
    done();
}

function imgConvert(done) {
    src(paths.img)
        .pipe(imagemin())
        .pipe(dest(paths.imgDest));
    done();
}
function handleKits(done) {
    src(paths.html)
        .pipe(kit())
        .pipe(dest('./'));
    done();
}

//odpalać niezależnie!!! czyści nam z dista rzeczy, kórych nie ma w src
function cleanStuff(done) {
    src(paths.dist, {read: false})
        .pipe(clean());
    done();
}

function startBrowserSync(done) {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    done();
}

function watchForChanges(done) {
    watch('./*.html').on("change", reload);
    watch([paths.html, paths.sass, paths.js], parallel(handleKits, sassCompiler, javaScript)).on("change", reload);
    watch(paths.img, imgConvert).on("change", reload);
    done();
}


const mainFunctions = parallel(handleKits, sassCompiler, javaScript, imgConvert);
exports.default = series(mainFunctions, startBrowserSync, watchForChanges);
exports.cleanStuff = cleanStuff;