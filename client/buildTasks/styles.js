/**
 * Builds CSS files found in /src/assets/styles
 *
 * @usage gulp styles
 */

import cleanCSS from 'gulp-clean-css';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import notify from './notify';
import sass from 'gulp-sass';

function watchStyles() {
    gulp.watch(`${process.env.SRC_DIR}/styles/**/*.scss`, done => {
        notify.log('STYLES: file update detected, rebuilding...');
        buildStyles();
        done();
    });
}

export function buildStyles() {
    return gulp
        .src(`${process.env.SRC_DIR}/styles/*.scss`)
        .pipe(notify.onError('STYLES: error'))
        .pipe(gulpIf(process.env.SOURCE_MAPS === 'true', sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpIf(process.env.MINIFY === 'true', cleanCSS()))
        .pipe(gulpIf(process.env.SOURCE_MAPS === 'true', sourcemaps.write('./')))
        .pipe(gulp.dest(`${process.env.DEST_DIR}/styles`))
        .on('end', notify.onLog('STYLES: rebuild complete'));
}

export default function styles() {
    if (process.env.WATCH === 'true') {
        watchStyles();
    }

    return buildStyles();
}
