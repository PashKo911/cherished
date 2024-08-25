// Підключення функціоналу "Чортоги Фрілансера"
import { isMobile, FLS } from "../files/functions.js";
import { flsModules } from "../files/modules.js";

function gridKeywords() {
	/*
		  Інструкція:
		  Структура:.
		  <div data-grid-keywords-wrapper> - При передачі значення watcher (підключити окремий модуль watcher) зупиняти анімацію коли елемент за межами вьюпорта
			  ...prev text (content)
			  <div data-grid-keywords>
				  <span data-grid-keywords-sizer>First Text</span>
				  <span>Second Text</span>
				  <span>Third Text</span>
			  </div>
			  ...next text (content)
		  </div>
		  Додаткові налаштування (Можна не вказувати):
		  data-grid-keywords-speed='1000' - Швидкість анімації. Вказувати в ms 1s = 1000 (За замовчанням 2000)
		  data-grid-keywords-delay='500' - Затримка між зманою елементів. Вказувати в ms 1s = 1000 (За замовчанням 500)
		  data-grid-keywords-direction='top' - Зміна направлення анімації вгору. (За замовчанням bottom)
		  data-grid-keywords-ease="easeOut" - Тип анімації "easeOut", "easeIn", 'easeInOut. (За замовчанням easeOut)
	  */

	const $wrappers = document.querySelectorAll("[data-grid-keywords-wrapper]");

	if (!$wrappers.length) return;

	const BASE_STYLES = {
		inner: `
			 overflow: hidden;
			 position: relative;
		 `,
		sizer: `
			 opacity: 0;
			 visibility: hidden;
		 `,
		words: `
			 display: block;
			 position: absolute;
			 left: 0;
			 top: 0;
			 white-sapce: nowrap;
			 width: inherit;
			 will-change: transform;
			 height: 100%;
		 `,
	};

	// Функції плавності анімації
	const BASE_EASING = {
		easeOut: (time) => {
			// Корегування сповільнення анімації в кінці
			const decelerationFactor = 2.4;
			return 1 - Math.pow(1 - time, decelerationFactor);
		},
		easeIn: (time) => {
			// Корегування сповільнення анімації на старті
			const accelerationFactor = 2.4;
			return Math.pow(time, accelerationFactor);
		},
		easeInOut: (time) => {
			// Корегування сповільнення анімації на старті та в кінці
			const accelerationFactor = 2.4;
			const decelerationFactor = 2.4;

			const acceleration = Math.pow(time, accelerationFactor);
			const deceleration = 1 - Math.pow(1 - time, decelerationFactor);

			return acceleration * (1 - time) + deceleration * time;
		},
	};

	$wrappers.forEach(($wrapper) => {
		if (!$wrapper) return;

		const $inner = $wrapper.querySelector("[data-grid-keywords]");
		const isWatcher = $wrapper.dataset.gridKeywordsWrapper == "watcher";
		const duration = parseFloat($wrapper.getAttribute("data-grid-keywords-speed")) || 2000;
		const delay = parseFloat($wrapper.getAttribute("data-grid-keywords-delay")) || 500;
		const direction = $wrapper.getAttribute("data-grid-keywords-direction") || "bottom";
		const ease = $wrapper.getAttribute("data-grid-keywords-ease") || "easeOut";
		const DISTANCE = direction === "top" ? -120 : 120;
		const translateYStart = -1 * DISTANCE;

		let index = 0;
		let pause = false;
		let animInit = false;
		let timeOut = null;

		const updateTextContent = () => {
			const $words = Array.from($inner.children);

			if (!$words.length) return;

			const $sizer = $inner.querySelector("[data-grid-keywords-sizer]");

			if ($sizer) {
				// Шукаємо самий широкий елемент.
				const largestWord = $words.reduce(
					(largest, current) => {
						const width = current.offsetWidth;

						return width > largest.width ? { element: current, width } : largest;
					},
					{ element: null, width: 0 }
				);

				// Створюємо клон елемента який задає розмір блоку і поміщаємо в кінець блоку.
				const clone = $sizer.cloneNode(true);
				clone.removeAttribute("data-grid-keywords-sizer");
				$inner.appendChild(clone);
				$words.push(clone);

				// Поміщаємо самий велики текст в елемент який задає розмір блоку.
				$sizer.textContent = largestWord.element.textContent;

				// Додаємо базові стилі для функціонування скрипту.
				$inner.style = BASE_STYLES.inner;
				$sizer.style = BASE_STYLES.sizer;
				$words.forEach(($word) => {
					if (!$word.hasAttribute("data-grid-keywords-sizer")) $word.style = BASE_STYLES.words;
				});

				// Функція зміни позиції елементів.
				const onChangeElements = ($el, transformValue, opacityValue) => {
					$el.style.transform = `translate3D(0,${transformValue}%,0)`;
					$el.style.opacity = opacityValue;
				};

				// Ініціалізація анімації.
				const initAnimElement = () => {
					// Перше слово при першій ініціалізації розміщаємо в початкове положення не анімуючи.
					if (!index) {
						setTimeout(() => {
							index = $words.length - 1;
							onChangeElements($words[index], 0, 1);
							setTimeout(() => {
								index = 1;
								// Запускаємо перший раз анімацію.
								requestAnimationFrame(step);
							}, delay);
						}, 0);
					} else {
						requestAnimationFrame(step);
					}

					let startTime;

					// Анімація.
					function step(timestamp) {
						if (!startTime) startTime = timestamp;
						const progress = (timestamp - startTime) / duration;
						const prevIndex = index - 1 || $words.length - 1;

						if (progress <= 1) {
							const easedProgress = BASE_EASING[ease](progress, 1);
							const newYPercentStart = DISTANCE * easedProgress - DISTANCE;
							const newYPercentEnd = DISTANCE * easedProgress;

							onChangeElements($words[index], newYPercentStart, 1 * progress);
							onChangeElements($words[prevIndex], newYPercentEnd, 1 - progress * 2);

							requestAnimationFrame(step);
						} else {
							onChangeElements($words[index], 0, 1);
							onChangeElements($words[prevIndex], DISTANCE, 0);

							// Перезапуск анімації після кожної ітерації.
							timeOut = setTimeout(() => {
								index += 1;
								if (index >= $words.length) index = 1;

								if (pause) clearInterval(timeOut);
								else initAnimElement();
							}, delay);
						}
					}

					animInit = true;
				};

				// Зупиняємо анімацію по наявності класу від watcher.
				const togglePause = () => {
					const isWatch = $inner.closest("._watcher-view");
					if (!isWatch) {
						pause = true;
						animInit = false;
					} else if (!animInit) {
						pause = false;
						initAnimElement();
					}
				};

				const init = () => {
					// Розміщаємо всі елементи в початкове положення і запускаємо анімацію.
					$words.forEach(($item, index) => {
						if (index) onChangeElements($item, translateYStart, 0);
					});
					initAnimElement();

					if (isWatcher) window.addEventListener("scroll", togglePause);
				};
				init();
			}
		};
		updateTextContent();
	});
}
document.addEventListener("DOMContentLoaded", gridKeywords);
