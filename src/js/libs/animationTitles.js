// Готові анімації для заголовків
//========================================================================================================================================================

//Анімація заголовку з сайту mocha
// Запуск з scss
/*
._watcher-view & {
	animation: mochaTitle 0.45s ease forwards;
}
*/
export const mochaTitle = {
	name: 'mochaTitle',
	keyframeBody: `
	0% {
		opacity: 0;
		visibility: hidden;
		scale: 0;
	}
	70% {
		opacity: 0.8;
		visibility: visible;
		scale: 1.2;
	}
	90% {
		opacity: 0.9;
		visibility: visible;
		scale: 0.95;
	}
	100% {
		opacity: 1;
		visibility: visible;
		scale: 1;
	}
`,
}
//========================================================================================================================================================

// Виліт заголовку посимвольно зліва з кубічною функцією
/*
._watcher-view & {
	animation-name: flXTitle;
	animation-duration: 1s;
	animation-timing-function: cubic-bezier(0.47, 1.16, 1, 1.09);
	animation-fill-mode: forwards;
}
*/

export const flXTitle = {
	name: 'flXTitle',
	keyframeBody: `
	0% {
		transform: translate(-50vw, 0);
	}
	50% {
		transform: translate(15vw, 0);
	}
	100% {
		transform: translate(0, 0);
	}
`,
}

//========================================================================================================================================================

// Анімація заголовку confety, посилання codepan
// https://codepen.io/eejcfali-the-styleful/pen/YzbzqOg
// Стилі

/*
.title{
display: inline-block;
		visibility: hidden;
		position: relative;
		font-size: 50px;
		color: navy;
		padding: 0.1em;
		white-space: nowrap;
		overflow: hidden;
		transition: color 0.4s linear 1s;

		span {
			position: absolute;
			margin-top: 0.1em;
			padding: inherit;
			font: inherit;
			white-space: inherit;
			text-shadow: 2px 2px 0 navy;
			transition:
				top 0.5s ease-out,
				left 0.5s ease-out;
	}
}

*/
