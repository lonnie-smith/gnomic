/**
 * Builds static files found in /src/assets/media
 *
 * @usage gulp media
 */

import gulp from 'gulp';
import notify from './notify';

// note: we exclude any icon files that are compiled into sprite sheets;
// see tasks/svgs.js and tasks/customizerSvgs.js
const src = [
    `${process.env.SRC_DIR}/media/**/*`,
];

function watchMedia() {
    gulp.watch(src, done => {
        notify.log('MEDIA: file update detected, rebuilding...');
        buildMedia();
        done();
    });
}

function buildMedia() {
    return gulp
        .src(src)
        .pipe(notify.onError('MEDIA: error'))
        .pipe(gulp.dest(`${process.env.DEST_DIR}/media`))
        .on('end', notify.onLog('MEDIA: rebuild complete'));
}

export default function media() {
    if (process.env.WATCH === 'true') {
        watchMedia();
    }

    return buildMedia();
}
