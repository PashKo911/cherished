import svgSprite from "gulp-svg-sprite";
import cheerio from 'gulp-cheerio';
export const sprite = () => {
	return app.gulp.src(`${app.path.src.svgicons}`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "SVG",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: '../img/icons/icons.svg',
					//example: true
				}
			},
			shape: {
				id: {
					separator: '',
					generator: ''
				},
				transform: [
					{
						/*svgo: {
							plugins: [
								{ removeXMLNS: true },
								{ convertPathData: false },
								{ removeViewBox: false },
							]
						}*/
					}
				]
			},
			svg: {
				rootAttributes: {
					style: 'display: none;',
					'aria-hidden': true
				},
				xmlDeclaration: false
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				// Для атрибута fill
				$('[fill]').each(function () {
					const fillValue = $(this).attr('fill');
					if (fillValue && fillValue !== "none") {
						$(this).attr('fill', 'currentColor');
					}
				});

				// Для атрибута stroke
				$('[stroke]').each(function () {
					const strokeValue = $(this).attr('stroke');
					if (strokeValue && strokeValue !== "none") {
						$(this).attr('stroke', 'currentColor');
					}
				});
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		.pipe(app.gulp.dest(`${app.path.srcFolder}`));


}