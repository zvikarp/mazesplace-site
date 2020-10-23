const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass");
const terser = require("gulp-terser");
const bs = require("browser-sync").create();
const file = require("gulp-file");
const config = require("./config");

// fetch command line arguments
const arg = ((argList) => {
  let arg = {}, a, opt, thisOpt, curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, "");
    if (opt === thisOpt) {
      if (curOpt)
        arg[curOpt] = opt;
      curOpt = null;
    } else {
      curOpt = opt;
      arg[curOpt] = true;
    }
  }
  return arg;
})(process.argv);

const env = arg.env || "dev";

// paths
const paths = {
  css : {
    src : "src/sass/**/*.scss",
    dest : "dist/css/",
  },
  html : {
    src : "src/**/*.html",
    dest : "dist/",
  },
  js : {
    src : "src/scripts/**/*.js",
    dest : "dist/scripts/",
  },
  assets : {
    src : "src/assets/**/*",
    dest : "dist/assets/",
  },
  config : {
    file : "config.js",
    dest : "dist/",
  },
};

// Gulp task to get config file
gulp.task("config", function() {
  const constantsOpts = config[env];
  let constantsObjString = "";
  for (key in constantsOpts) {
    let value = constantsOpts[key];
    if (typeof value === "string") {
      value = `'${value}'`;
    }
    constantsObjString += `\n${key}: ${value.toString()},`;
  }
  const codeString = `const config = { ${constantsObjString} \n}`;
  return file(paths.config.file, codeString, {src : true})
      .pipe(gulp.dest(paths.config.dest));
});

// Copies the assets to the distribution.
gulp.task("assets", function buildImages() {
  return gulp.src(paths.assets.src).pipe(gulp.dest(paths.assets.dest));
});

// Gulp task to minify CSS files
gulp.task("styles", function() {
  return gulp.src(paths.css.src)
      .pipe(sass({
        outputStyle : "nested",
        precision : 10,
        includePaths : [ "." ],
        onError : console.error.bind(console, "Sass error:"),
      }))
      .pipe(autoprefixer())
      .pipe(csso())
      .pipe(gulp.dest(paths.css.dest));
});

// Gulp task to minify JavaScript files
gulp.task("scripts", function() {
  return gulp.src(paths.js.src).pipe(terser()).pipe(gulp.dest(paths.js.dest));
});

// Gulp task to minify HTML files
gulp.task("html", function() {
  return gulp.src(paths.html.src)
      .pipe(htmlmin({
        collapseWhitespace : true,
        removeComments : true,
      }))
      .pipe(gulp.dest(paths.html.dest));
});

// Sets up the live browser sync.
gulp.task("browser-sync", function sync(done) {
  bs.init({
    server : {
      baseDir : "dist/",
    },
  });
  done();
});

gulp.task("watch", function watch(done) {
  gulp.watch(paths.assets.src, gulp.series("rebuild"));
  gulp.watch(paths.js.src, gulp.series("rebuild"));
  gulp.watch(paths.html.src, gulp.series("rebuild"));
  gulp.watch(paths.css.src, gulp.series("rebuild"));
  gulp.watch(paths.config.file, gulp.series("rebuild"));
  done();
});

// Clean output directory
gulp.task("clean", () => del([ "dist" ]));

// Gulp task to minify all files
gulp.task("build",
          gulp.series("styles", "scripts", "html", "assets", "config"));

// First rebuilds the output then triggers a reload of the browser.
gulp.task("rebuild", gulp.series("build", function rebuild(done) {
  bs.reload();
  done();
}));

// Gulp task to minify all files
gulp.task("default", gulp.series("clean", "build", "browser-sync", "watch"));
