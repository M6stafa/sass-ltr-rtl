const gulp          = require('gulp');
const path          = require('path');
const sequence      = require('gulp-sequence');
const del           = require('del');
const sass          = require('gulp-sass');
const postcss       = require('gulp-postcss');
const autoprefixer  = require('autoprefixer');
const removeComment = require('postcss-discard-comments');
const sourcemaps    = require('gulp-sourcemaps');
const rename        = require('gulp-rename');
const cleancss      = require('gulp-clean-css');
const rtlcss        = require('gulp-rtlcss');
const uglify        = require('gulp-uglify');
const filter        = require('gulp-filter');
const _             = require('lodash');


module.exports = {
  'config': {
    tasksNamePrefix: '',

    sassInput: null,
    cssDist: null,
    sassOptions: {
      outputStyle: 'expanded',
      precision: 6
    },
  },

  'registerTasks': function (gulp, config) {
    // Check Config
    if (_.includes(_.values(config), null)) {
      console.error('Please set configs correctly!');
      return;
    }

    // Main Tasks
    gulp.task(config.tasksNamePrefix + 'build', function (callback) {
      sequence([config.tasksNamePrefix + 'build:ltr', config.tasksNamePrefix + 'build:rtl'])(callback);
    });
    gulp.task(config.tasksNamePrefix + 'clean', _.bind(this['clean'], this, config));

    // CSS Tasks
    gulp.task(config.tasksNamePrefix + 'build:ltr', _.bind(this['build:ltr'], this, config));
    gulp.task(config.tasksNamePrefix + 'build:rtl', _.bind(this['build:rtl'], this, config));
  },

  'build:ltr': function (config) {
    return gulp.src(config.sassInput)
      .pipe(sourcemaps.init())
      .pipe(sass(config.sassOptions).on('error', sass.logError))
      .pipe(postcss([removeComment(), autoprefixer()]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.cssDist))
      .pipe(this.mapFilter())
      .pipe(sourcemaps.init())
      .pipe(cleancss({ level: 1 }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.cssDist));
  },
  'build:rtl': function (config) {
    return gulp.src(config.sassInput)
      .pipe(sourcemaps.init())
      .pipe(sass(config.sassOptions).on('error', sass.logError))
      .pipe(postcss([autoprefixer()]))
      .pipe(rtlcss())
      .pipe(rename({ suffix: '.rtl' }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.cssDist))
      .pipe(this.mapFilter())
      .pipe(sourcemaps.init())
      .pipe(cleancss({ level: 1 }))
      .pipe(rename({ suffix: '.min' }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(config.cssDist));
  },

  'mapFilter': function() {
    return filter(function (file) {
      return !_.endsWith(file.path, '.map');
    });
  },

  'clean': function (config) {
    return del([config.cssDist + '/*']);
  },
};
