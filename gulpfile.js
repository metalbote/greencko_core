let autoprefixer = require('autoprefixer'),
  babel = require('gulp-babel'),
  clean = require('gulp-clean'),
  cleanCss = require('gulp-clean-css'),
  Color = require('color'),
  csscomb = require('gulp-csscomb'),
  eslint = require('gulp-eslint'),
  flatten = require('gulp-flatten'),
  gulp = require('gulp'),
  // gulpStylelint = require('gulp-stylelint'),
  imagemin = require('gulp-imagemin'),
  postcss = require('gulp-postcss'),
  RecolorSvg = require('gulp-recolor-svg'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  tildeImporter = require('node-sass-tilde-importer'),
  uglify = require('gulp-uglify'),
  browserSync = require('browser-sync')
    .create();

/** ====================================================================================================================
 *  Constants
 *  ==================================================================================================================*/

const browserlist = [
  'Chrome >= 35',
  'Firefox >= 38',
  'Edge >= 12',
  'Explorer >= 10',
  'iOS >= 8',
  'Safari >= 8',
  'Android 2.3',
  'Android >= 4',
  'Opera >= 12'];


/** ====================================================================================================================
 *  Fonts
 *  ==================================================================================================================*/

function fonts_build() {
  return gulp.src(['./res/fonts/**/*.*'])
    .pipe(flatten())
    .pipe(gulp.dest('fonts'));
}

function fonts_clean() {
  return gulp.src(['fonts'], {read: false})
    .pipe(clean({force: true}));
}

function fonts_watch() {
  gulp.watch(['./res/fonts/**/*.*'], fonts);
}

const fonts = gulp.series(
  fonts_build
);

/** ====================================================================================================================
 *  Images
 *  ==================================================================================================================*/

function images_build() {
  return gulp.src(['./res/img/**/*.{jpg,jpeg,gif,png,svg,ico}'])
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{
        cleanupIDs: false,
        removeViewBox: false,
        removeUselessStrokeAndFill: false,
        removeXMLProcInst: false
      }]
    }))
    .pipe(flatten())
    .pipe(gulp.dest('img'));
}

function images_clean() {
  return gulp.src(['img'], {read: false})
    .pipe(clean({force: true}));
}

function images_watch() {
  gulp.watch(['./res/img/**/*.{jpg,jpeg,gif,png,svg,ico}'], images);
}

const images = gulp.series(
  images_build
);

/** ====================================================================================================================
 *  Icons
 *  ==================================================================================================================*/

function icons_colorize() {
  return gulp.src(['./res/icons/monochrome/**/*.svg'])
    .pipe(
      RecolorSvg.GenerateVariants(
        [RecolorSvg.ColorMatcher(Color('#000'))],
        [
          {
            suffix: '--white',
            colors: [Color('#fff')]
          },
          {
            suffix: '--black',
            colors: [Color('#000')]
          },
          {
            suffix: '--primary',
            colors: [Color('#4192c8')]
          },
          {
            suffix: '--text',
            colors: [Color('#333')]
          },
        ]
      )
    )
    .pipe(gulp.dest('.tmp'));
}

function icons_build_monochrome() {
  return gulp.src(['.tmp/**/*.svg'])
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{
        cleanupIDs: false,
        removeViewBox: false,
        removeUselessStrokeAndFill: false,
        removeXMLProcInst: false
      }]
    }))
    .pipe(gulp.dest('icons'));
}

function icons_build_multicolor() {
  return gulp.src(['./res/icons/multicolor/**/*.svg'])
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{
        cleanupIDs: false,
        removeViewBox: false,
        removeUselessStrokeAndFill: false,
        removeXMLProcInst: false
      }]
    }))
    .pipe(gulp.dest('icons'));
}

function icons_build_png() {
  return gulp.src(['./res/icons/png/**/*.png'])
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{
        cleanupIDs: false,
        removeViewBox: false,
        removeUselessStrokeAndFill: false,
        removeXMLProcInst: false
      }]
    }))
    .pipe(gulp.dest('icons/png'));
}

function icons_clean_tmp() {
  return gulp.src(['./.tmp'], {
    allowEmpty: true,
    read: false
  })
    .pipe(clean({force: true}));
}

function icons_clean() {
  return gulp.src([
    './.tmp',
    './icons'
  ], {read: false})
    .pipe(clean({force: true}));
}

function icons_watch() {
  gulp.watch(['./res/icons/**/*.*'], icons);
}

const icons = gulp.series(
  icons_colorize,
  gulp.parallel(
    icons_build_monochrome,
    icons_build_multicolor,
    icons_build_png
  ),
  icons_clean_tmp
);

/** ====================================================================================================================
 *  Styles
 *  ==================================================================================================================*/

function styles_build() {
  const plugins = [
    autoprefixer({
      overrideBrowserslist: browserlist
    }),
  ];

  return gulp.src(['./scss/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['node_modules'],
      importer: tildeImporter,
      outputStyle: 'expanded',
      precision: 10,
    })
      .on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(cleanCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
}

function styles_sort() {
//  const csscombConfig = './.csscomb.json';

  return gulp.src(['./scss/**/*.scss', '!./scss/**/*variables.scss'], {base: './'})
    .pipe(csscomb())
    .pipe(gulp.dest('./'));
}

function styles_lint() {
  return gulp.src(['./scss/**/*.scss'])
  //   .pipe(gulpStylelint({
  //     configFile: ".stylelintrc.json",
  //     configBasedir: 'node_modules',
  //     reporters: [
  //       { formatter: 'string', console: true }
  //     ],
  //     fix: true,
  //     failAfterError: false,
  //   }))
    .pipe(gulp.dest('scss'));
}

function styles_clean() {
  return gulp.src(['css/**/*.css'], {read: false})
    .pipe(clean({force: true}));
}

function styles_watch() {
  gulp.watch(
    ['./scss/**/*.scss'],
    gulp.series(
      styles_build
    )
  );
}

const styles = gulp.parallel(
  gulp.series(
    styles_sort,
    styles_lint,
    styles_build),
);

/** ====================================================================================================================
 *  Scripts
 *  ==================================================================================================================*/

function js_babel() {

  const bundleName = (file) => {
    file.basename = file.basename.replace('.es6', '');
    file.extname = '.js';
    return file;
  };

  return gulp.src(['./js/**/*.es6.js'])
    .pipe(sourcemaps.init({debug: true}))
    .pipe(babel({
      presets: [['env', {
        modules: false,
        useBuiltIns: true,
        targets: {browsers: browserlist},
      }]],
    }))
    .pipe(rename(file => (bundleName(file))))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('js'));
}

function js_build() {
  return gulp.src(['./js/**/*.js', '!./js/**/*.min.js', '!./js/**/*.es6.js'])
    .pipe(sourcemaps.init({debug: true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('js'))
    .pipe(browserSync.stream());
}

function js_lint() {
  let source = ['./js/**/*.js'];
  source.push('!js/*.min.js');

  return gulp.src(source)
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format());
}

function js_clean() {
  return gulp.src(['js/**/*.min.js', 'js/**/*.map'], {read: false})
    .pipe(clean({force: true}));
}

function js_watch() {
  gulp.watch(
    ['./js/**/*.es6.js'],
    gulp.series(
      js_babel,
      js_build
    )
  );
}

const scripts = gulp.series(
  js_lint,
  js_babel,
  js_build
);

/** ====================================================================================================================
 *  Vendor
 *  ==================================================================================================================*/

const bootstrap = {
  css: [],
  js: [
    './node_modules/bootstrap/dist/js/bootstrap.js', // bootstrap
    './node_modules/bootstrap/dist/js/bootstrap.js.map', // bootstrap
    './node_modules/bootstrap/dist/js/bootstrap.min.js', // bootstrap
    './node_modules/bootstrap/dist/js/bootstrap.min.js.map', // bootstrap
  ]
};

const jquery = {
  css: [],
  js: [
    './node_modules/jquery/dist/jquery.js', // jquery
    './node_modules/jquery/dist/jquery.min.js', // jquery
    './node_modules/jquery/dist/jquery.min.map', // jquery
  ]
};

const popper = {
  css: [],
  js: [
    './node_modules/popper.js/dist/umd/popper.js', // popper
    './node_modules/popper.js/dist/umd/popper.js.map', // popper
    './node_modules/popper.js/dist/umd/popper.min.js', // popper
    './node_modules/popper.js/dist/umd/popper.min.js.map' // popper
  ]
};

const mdb = {
  css: [],
  js: [
    './node_modules/mdbootstrap/js/mdb.js', // mdb
    './node_modules/mdbootstrap/js/mdb.min.js', // mdb
    //'./node_modules/mdbootstrap/js/addons/datatables.js', // mdb
    //'./node_modules/mdbootstrap/js/addons/datatables.min.js', // mdb
    //'./node_modules/mdbootstrap/js/addons/datatables-select.js', // mdb
    //'./node_modules/mdbootstrap/js/addons/datatables-select.min.js', // mdb
    //'./node_modules/mdbootstrap/js/addons/imagesloaded.pkgd.min.js', // mdb
    //'./node_modules/mdbootstrap/js/addons/jquery.zmd.hierarchical-display.js',
    // './node_modules/mdbootstrap/js/addons/jquery.zmd.hierarchical-display.min.js',
    // './node_modules/mdbootstrap/js/addons/masonry.pkgd.min.js',
    // './node_modules/mdbootstrap/js/addons/progressBar.js',
    // './node_modules/mdbootstrap/js/addons/progressBar.min.js',
    // './node_modules/mdbootstrap/js/addons/rating.js',
    // './node_modules/mdbootstrap/js/addons/rating.min.js',
  ]
};

let vendor_js_paths = [];
vendor_js_paths = vendor_js_paths.concat(bootstrap.js, jquery.js, popper.js, mdb.js);

function vendor_js_copy() {
  return gulp.src(vendor_js_paths)
    .pipe(gulp.dest('js'));
}

const vendor = gulp.series(
  vendor_js_copy,
);

/** ====================================================================================================================
 *  Global
 *  ==================================================================================================================*/

const watch = gulp.parallel(
  fonts_watch,
  images_watch,
  icons_watch,
  styles_watch,
  js_watch
);

// Static Server + watching scss/html files
function serve() {
  browserSync.init({
    proxy: 'http://greencko.lndo.site',
  });

  gulp.watch(['./scss/**/*.scss'], styles)
    .on('change', browserSync.reload);
}


const remove = gulp.parallel(fonts_clean, images_clean, icons_clean, styles_clean, js_clean);
const build = gulp.parallel(fonts, icons, images, styles, scripts);
const observe = gulp.series(styles, gulp.parallel(scripts, serve));

exports.fonts = fonts;
exports.images = images;
exports.icons = icons;
exports.styles = styles;
exports.scripts = scripts;
exports.vendor = vendor;
exports.build = build;
exports.serve = serve;
exports.observe = observe;
exports.watch = watch;
exports.clean = remove;
exports.default = watch;


