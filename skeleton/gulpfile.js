const DS = require("path").sep;
const CONF = require("./node_modules"+DS+"sway"+DS+"build"+DS+"config");

const gulp = require("gulp");
const shell = require("gulp-shell");
const livereload = require("gulp-livereload");

gulp.task("html", shell.task([ CONF.C.html ]));
gulp.task("sass", shell.task([ CONF.C.sass ]));
gulp.task("temp", shell.task([ CONF.C.temp ]));
gulp.task("js", shell.task([ CONF.C.js ]));
gulp.task("all", shell.task( [CONF.C.all] ));

gulp.task("html-w", shell.task([ CONF.C.w.html ]));
gulp.task("sass-w", shell.task([ CONF.C.w.sass ]));
gulp.task("temp-w", () => {
	gulp.watch(`${CONF.I.TEMP}/**`, ["temp"]);
});
gulp.task("js-w", shell.task([ CONF.C.w.js ]));

gulp.task( "default", ["all"] );
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// livereload
gulp.task("live-html", () => {
	gulp.src(CONF.O.HTML)
		.pipe( livereload() );
});
gulp.task("live-css", () => {
	gulp.src(`${CONF.O.CSS}**/*.css`)
		.pipe( livereload() );
});
gulp.task("live-js", () => {
	gulp.src(`${CONF.O.JS}**/*.js`)
		.pipe( livereload() );
});
gulp.task("livereload", () => {
	livereload.listen();
	
	gulp.watch(CONF.O.HTML, ["live-html"]);
	gulp.watch(`${CONF.O.CSS}**/*`, ["live-css"]);
	gulp.watch(`${CONF.O.JS}**/*`, ["live-js"]);
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@