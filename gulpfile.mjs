import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import sass from 'gulp-dart-sass';
import connect from 'gulp-connect';
import rimraf from 'gulp-rimraf';
import htmlmin from 'gulp-htmlmin';

const paths = {
    styles: {
        src: 'src/style/**/*.scss',
        dest: 'dist/style/'
    },
    images: {
        src: 'src/public/images/**/*.{png,svg,jpg}',
        dest: 'dist/public/images/'
    },
    html: {
        src: './src/**/*.html',
        dest: './dist'
    }
};

gulp.task('clean', () => {
    return gulp.src('dist', { read: false, allowEmpty: true })
        .pipe(rimraf());
});

gulp.task('html', () => {
    return gulp.src(paths.html.src)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.html.dest))
});

gulp.task('sass', () => {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.styles.dest));
});

gulp.task('images', () => {
    return gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest));
});

gulp.task('server', () => {
    connect.server({
        root: 'dist',
        livereload: true,
        port: 3000
    });
});

gulp.task('default', gulp.series('html', 'sass', 'images', 'server'));

gulp.task('watch', () => {
    gulp.watch(paths.html.src, gulp.series('html'));
    gulp.watch(paths.styles.src, gulp.series('sass'));
    gulp.watch(paths.images.src, gulp.series('images'));
    gulp.watch('src/**/*', gulp.series('reload'));

});

gulp.task('reload', (done) => {
    connect.reload();
    done();
});
