// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile, FLS } from "../files/functions.js";
// Підключення списку активних модулів
import { flsModules } from "../files/modules.js";
// Підключення стілів необхідних для роботи модуля
import "../../scss/base/beforeafter.scss";

class BeforeAfter {
	constructor(props) {
		let defaultConfig = {
			init: true,
			logging: true
		}
		this.config = Object.assign(defaultConfig, props);
		if (this.config.init) {
			const beforeAfterItems = document.querySelectorAll('[data-ba]');
			if (beforeAfterItems.length > 0) {
				this.setLogging(`Прокинувся, бачу елементів: ${beforeAfterItems.length}`);
				this.beforeAfterInit(beforeAfterItems);
			} else {
				this.setLogging(`Прокинувся, не бачу елементів`);
			}
		}
	}
	beforeAfterInit(beforeAfterItems) {
		beforeAfterItems.forEach(beforeAfter => {
			if (beforeAfter) {
				this.beforeAfterClasses(beforeAfter);
				this.beforeAfterItemInit(beforeAfter);
			}
		});
	}
	beforeAfterClasses(beforeAfter) {
		const beforeAfterArrow = beforeAfter.querySelector('[data-ba-arrow]');
		beforeAfter.addEventListener('mouseover', function (e) {
			const targetElement = e.target;
			if (!targetElement.hasAttribute('data-ba-arrow')) {
				if (targetElement.closest('[data-ba-before]')) {
					beforeAfter.classList.remove('_right');
					beforeAfter.classList.add('_left');
				} else {
					beforeAfter.classList.add('_right');
					beforeAfter.classList.remove('_left');
				}
			}
		});
		beforeAfter.addEventListener('mouseleave', function () {
			beforeAfter.classList.remove('_left');
			beforeAfter.classList.remove('_right');
		});
	}
	beforeAfterItemInit(beforeAfter) {
		const beforeAfterArrow = beforeAfter.querySelector('[data-ba-arrow]');
		const afterItem = beforeAfter.querySelector('[data-ba-after]');
		const beforeAfterArrowWidth = parseFloat(window.getComputedStyle(beforeAfterArrow).getPropertyValue('width'));
		let beforeAfterSizes = {};
		if (beforeAfterArrow) {
			isMobile.any() ?
				beforeAfterArrow.addEventListener('touchstart', beforeAfterDrag) :
				beforeAfterArrow.addEventListener('mousedown', beforeAfterDrag);
		}
		function beforeAfterDrag(e) {
			beforeAfterSizes = {
				width: beforeAfter.offsetWidth,
				left: beforeAfter.getBoundingClientRect().left - scrollX
			}
			if (isMobile.any()) {
				document.addEventListener('touchmove', beforeAfterArrowMove);
				document.addEventListener('touchend', function (e) {
					document.removeEventListener('touchmove', beforeAfterArrowMove);
				}, { "once": true });
			} else {
				document.addEventListener('mousemove', beforeAfterArrowMove);
				document.addEventListener('mouseup', function (e) {
					document.removeEventListener('mousemove', beforeAfterArrowMove);
				}, { "once": true });
			}
			document.addEventListener('dragstart', function (e) {
				e.preventDefault();
			}, { "once": true });
		}
		function beforeAfterArrowMove(e) {
			const posLeft = e.type === "touchmove" ?
				e.touches[0].clientX - beforeAfterSizes.left :
				e.clientX - beforeAfterSizes.left;
			if (posLeft <= beforeAfterSizes.width && posLeft > 0) {
				const way = posLeft / beforeAfterSizes.width * 100;
				beforeAfterArrow.style.cssText = `left:calc(${way}% - ${beforeAfterArrowWidth}px)`;
				afterItem.style.cssText = `width: ${100 - way}%`;
			} else if (posLeft >= beforeAfterSizes.width) {
				beforeAfterArrow.style.cssText = `left: calc(100% - ${beforeAfterArrowWidth}px)`;
				afterItem.style.cssText = `width: 0%`;
			} else if (posLeft <= 0) {
				beforeAfterArrow.style.cssText = `left: 0%`;
				afterItem.style.cssText = `width: 100%`;
			}
		}
	}
	// Логінг у консоль
	setLogging(message) {
		this.config.logging ? FLS(`[BeforeAfter]: ${message} `) : null;
	}
}





// Запускаємо та додаємо в об'єкт модулів
flsModules.ba = new BeforeAfter({});

