/**
 * Builds JavaScript files found in /src/assets/scripts
 * Uses watchify for fast incremental builds
 *
 * @usage gulp scripts
 */

import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import notify from './notify';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import vueify from 'vueify';
import watchify from 'watchify';

const plugins = [];

function buildScripts() {
    const options = {
        cache: {},
        packageCache: {},
        plugin: plugins,
        debug: process.env.SOURCE_MAPS === 'true',
        entries: [`${process.env.SRC_DIR}/scripts/main.js`],
        paths: [`${process.env.SRC_DIR}/scripts`],
    };

    const bundler = browserify(options)
        .transform('envify', {
            NODE_ENV: process.env.NODE_ENV,
        })
        .transform('babelify', { extensions: ['.js'] })
        .transform(vueify);

    bundler.on('update', () => {
        notify.log('SCRIPTS: file update detected, rebuilding...');
        onUpdate(bundler);
    });

    bundler.on('log', message => {
        notify.log('SCRIPTS: rebuild complete', message);
    });

    return onUpdate(bundler);
}

function onUpdate(bundler) {
    return bundler
        .bundle()
        .on('error', function(error) {
            notify.error('SCRIPTS: error', error);
            this.emit('end');
        })
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulpIf(process.env.SOURCE_MAPS  === 'true', sourcemaps.init({ loadMaps: true })))
        .pipe(gulpIf(process.env.MINIFY === 'true', uglify()))
        .pipe(gulpIf(process.env.SOURCE_MAPS === 'true', sourcemaps.write('./')))
        .pipe(gulp.dest(`${process.env.DEST_DIR}/scripts`));
}

export default function scripts() {
    if (process.env.WATCH === 'true') {
        plugins.push(watchify);
    }

    return buildScripts();
}
