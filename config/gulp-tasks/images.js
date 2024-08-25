import webp from "gulp-webp";
import imagemin from "gulp-imagemin";

export const WebP = () => {
	return app.gulp.src(app.path.src.images, { encoding: false })
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "IMAGES",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(app.plugins.newer(app.path.build.images))
		.pipe(
			app.plugins.if(
				app.isWebP,
				webp()
			)
		)
		.pipe(
			app.plugins.if(
				app.isWebP,
				app.gulp.dest(app.path.build.images)
			)
		)
}
export const imagesOptimize = () => {
	return app.gulp.src(app.path.src.images, { encoding: false })
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "IMAGES",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(app.plugins.newer(app.path.build.images))
		.pipe(
			app.plugins.if(
				app.isImgOpt,
				imagemin({
					progressive: true,
					svgoPlugins: [{ removeViewBox: false }],
					interlaced: true,
					optimizationLevel: 3 // 0 to 7
				})
			)
		)
		.pipe(app.gulp.dest(app.path.build.images))
}
export const copySvg = () => {
	return app.gulp.src(app.path.src.svg)
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "IMAGES",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(app.plugins.newer(app.path.build.images))
		.pipe(app.gulp.dest(app.path.build.images));
}