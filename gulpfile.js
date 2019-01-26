require('babel-register')({ ignore: [/node_modules|tools\/cache/] });
require('env-merger')();

const fs = require('fs');
const gulp = require('gulp');
const tasksDir = './client/buildTasks';

// Lazy-load all gulp tasks found under /tasks
fs.readdirSync(tasksDir).forEach(filename => {
    const taskname = filename.replace('.js', '');

    function runTask(done) {
        return require(`${tasksDir}/${filename}`)
            .default(done);
    }

    gulp.task(taskname, runTask);
});

gulp.task('default', gulp.series('build'));

console.log(`BUILDING USING ENVIRONMENT: ${process.env.NODE_ENV || 'default'}`);
