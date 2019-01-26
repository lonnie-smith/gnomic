/**
 * Builds all source code in /src, and outputs to /web
 *
 * @usage gulp
 */

import del from 'del';
import gulp from 'gulp';
import notify from './notify';

function clean() {
    return del([
        process.env.DEST_DIR,
    ], {
        force: process.env.ENABLE_UNSAFE_CLEAN === 'true',
    });
}

export default function build(done) {
    return gulp.series(clean,
        gulp.parallel('media', 'styles', 'scripts'),
        function buildCallback() {
            process.env.watchStarted = 'true';
            notify.log(
                'Build complete!',
                process.env.WATCH === 'true' ? 'Starting watch...' : '',
                true
            );
            done();
            return Promise.resolve();
        }
    )();
}
