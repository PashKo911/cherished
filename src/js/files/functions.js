// Підключення списку активних модулів
import { flsModules } from './modules.js'

/* Перевірка підтримки webp, додавання класу webp або no-webp для HTML */
export function isWebp() {
	// Проверка поддержки webp
	function testWebP(callback) {
		let webP = new Image()
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2)
		}
		webP.src =
			'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
	}
	// Додавання класу _webp або _no-webp для HTML
	testWebP(function (support) {
		let className = support === true ? 'webp' : 'no-webp'
		document.documentElement.classList.add(className)
	})
}
/* Перевірка мобільного браузера */
export let isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i)
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i)
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i)
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i)
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i)
	},
	any: function () {
		return (
			isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()
		)
	},
}
/* Додавання класу touch для HTML, якщо браузер мобільний */
export function addTouchClass() {
	// Додавання класу _touch для HTML, якщо браузер мобільний
	if (isMobile.any()) document.documentElement.classList.add('touch')
}
// Додавання loaded для HTML після повного завантаження сторінки
export function addLoadedClass() {
	if (!document.documentElement.classList.contains('loading')) {
		window.addEventListener('load', function () {
			setTimeout(function () {
				document.documentElement.classList.add('loaded')
			}, 0)
		})
	}
}
// Отримання хешу на адресі сайту
export function getHash() {
	if (location.hash) {
		return location.hash.replace('#', '')
	}
}
// Вказівка хеша на адресу сайту
export function setHash(hash) {
	hash = hash ? `#${hash}` : window.location.href.split('#')[0]
	history.pushState('', '', hash)
}
// Допоміжні модулі плавного розкриття та закриття об'єкта ======================================================================================================================================================================
export let _slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide')
		target.style.transitionProperty = 'height, margin, padding'
		target.style.transitionDuration = duration + 'ms'
		target.style.height = `${target.offsetHeight}px`
		target.offsetHeight
		target.style.overflow = 'hidden'
		target.style.height = showmore ? `${showmore}px` : `0px`
		target.style.paddingTop = 0
		target.style.paddingBottom = 0
		target.style.marginTop = 0
		target.style.marginBottom = 0
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false
			!showmore ? target.style.removeProperty('height') : null
			target.style.removeProperty('padding-top')
			target.style.removeProperty('padding-bottom')
			target.style.removeProperty('margin-top')
			target.style.removeProperty('margin-bottom')
			!showmore ? target.style.removeProperty('overflow') : null
			target.style.removeProperty('transition-duration')
			target.style.removeProperty('transition-property')
			target.classList.remove('_slide')
			// Створюємо подію
			document.dispatchEvent(
				new CustomEvent('slideUpDone', {
					detail: {
						target: target,
					},
				})
			)
		}, duration)
	}
}
export let _slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide')
		target.hidden = target.hidden ? false : null
		showmore ? target.style.removeProperty('height') : null
		let height = target.offsetHeight
		target.style.overflow = 'hidden'
		target.style.height = showmore ? `${showmore}px` : `0px`
		target.style.paddingTop = 0
		target.style.paddingBottom = 0
		target.style.marginTop = 0
		target.style.marginBottom = 0
		target.offsetHeight
		target.style.transitionProperty = 'height, margin, padding'
		target.style.transitionDuration = duration + 'ms'
		target.style.height = height + 'px'
		target.style.removeProperty('padding-top')
		target.style.removeProperty('padding-bottom')
		target.style.removeProperty('margin-top')
		target.style.removeProperty('margin-bottom')
		window.setTimeout(() => {
			target.style.removeProperty('height')
			target.style.removeProperty('overflow')
			target.style.removeProperty('transition-duration')
			target.style.removeProperty('transition-property')
			target.classList.remove('_slide')
			// Створюємо подію
			document.dispatchEvent(
				new CustomEvent('slideDownDone', {
					detail: {
						target: target,
					},
				})
			)
		}, duration)
	}
}
export let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration)
	} else {
		return _slideUp(target, duration)
	}
}
// Допоміжні модулі блокування прокручування та стрибка ====================================================================================================================================================================================================================================================================================
export let bodyLockStatus = true
export let bodyLockToggle = (delay = 500) => {
	if (document.documentElement.classList.contains('lock')) {
		bodyUnlock(delay)
	} else {
		bodyLock(delay)
	}
}
export let bodyUnlock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll('[data-lp]')
		setTimeout(() => {
			lockPaddingElements.forEach((lockPaddingElement) => {
				lockPaddingElement.style.paddingRight = ''
			})
			document.body.style.paddingRight = ''
			document.documentElement.classList.remove('lock')
		}, delay)
		bodyLockStatus = false
		setTimeout(function () {
			bodyLockStatus = true
		}, delay)
	}
}
export let bodyLock = (delay = 500) => {
	if (bodyLockStatus) {
		const lockPaddingElements = document.querySelectorAll('[data-lp]')
		const lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px'
		lockPaddingElements.forEach((lockPaddingElement) => {
			lockPaddingElement.style.paddingRight = lockPaddingValue
		})

		document.body.style.paddingRight = lockPaddingValue
		document.documentElement.classList.add('lock')

		bodyLockStatus = false
		setTimeout(function () {
			bodyLockStatus = true
		}, delay)
	}
}
// Модуль роботи зі спойлерами =======================================================================================================================================================================================================================
export function spollers() {
	const spollersArray = document.querySelectorAll('[data-spollers]')
	if (spollersArray.length > 0) {
		// Подія кліку
		document.addEventListener('click', setSpollerAction)
		// Отримання звичайних слойлерів
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
			return !item.dataset.spollers.split(',')[0]
		})
		// Ініціалізація звичайних слойлерів
		if (spollersRegular.length) {
			initSpollers(spollersRegular)
		}
		// Отримання слойлерів з медіа-запитами
		let mdQueriesArray = dataMediaQueries(spollersArray, 'spollers')
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach((mdQueriesItem) => {
				// Подія
				mdQueriesItem.matchMedia.addEventListener('change', function () {
					initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
				})
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
			})
		}
		// Ініціалізація
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach((spollersBlock) => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_spoller-init')
					initSpollerBody(spollersBlock)
				} else {
					spollersBlock.classList.remove('_spoller-init')
					initSpollerBody(spollersBlock, false)
				}
			})
		}
		// Робота з контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerItems = spollersBlock.querySelectorAll('details')
			if (spollerItems.length) {
				//spollerItems = Array.from(spollerItems).filter(item => item.closest('[data-spollers]') === spollersBlock);
				spollerItems.forEach((spollerItem) => {
					let spollerTitle = spollerItem.querySelector('summary')
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex')
						if (!spollerItem.hasAttribute('data-open')) {
							spollerItem.open = false
							spollerTitle.nextElementSibling.hidden = true
						} else {
							spollerTitle.classList.add('_spoller-active')
							spollerItem.open = true
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1')
						spollerTitle.classList.remove('_spoller-active')
						spollerItem.open = true
						spollerTitle.nextElementSibling.hidden = false
					}
				})
			}
		}
		function setSpollerAction(e) {
			const el = e.target
			if (el.closest('summary') && el.closest('[data-spollers]')) {
				e.preventDefault()
				if (el.closest('[data-spollers]').classList.contains('_spoller-init')) {
					const spollerTitle = el.closest('summary')
					const spollerBlock = spollerTitle.closest('details')
					const spollersBlock = spollerTitle.closest('[data-spollers]')
					const oneSpoller = spollersBlock.hasAttribute('data-one-spoller')
					const scrollSpoller = spollerBlock.hasAttribute('data-spoller-scroll')
					const spollerSpeed = spollersBlock.dataset.spollersSpeed
						? parseInt(spollersBlock.dataset.spollersSpeed)
						: 500
					if (!spollersBlock.querySelectorAll('._slide').length) {
						if (oneSpoller && !spollerBlock.open) {
							hideSpollersBody(spollersBlock)
						}

						!spollerBlock.open
							? (spollerBlock.open = true)
							: setTimeout(() => {
									spollerBlock.open = false
								}, spollerSpeed)

						spollerTitle.classList.toggle('_spoller-active')
						_slideToggle(spollerTitle.nextElementSibling, spollerSpeed)

						if (scrollSpoller && spollerTitle.classList.contains('_spoller-active')) {
							const scrollSpollerValue = spollerBlock.dataset.spollerScroll
							const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0
							const scrollSpollerNoHeader = spollerBlock.hasAttribute('data-spoller-scroll-noheader')
								? document.querySelector('.header').offsetHeight
								: 0

							//setTimeout(() => {
							window.scrollTo({
								top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
								behavior: 'smooth',
							})
							//}, spollerSpeed);
						}
					}
				}
			}
			// Закриття при кліку поза спойлером
			if (!el.closest('[data-spollers]')) {
				const spollersClose = document.querySelectorAll('[data-spoller-close]')
				if (spollersClose.length) {
					spollersClose.forEach((spollerClose) => {
						const spollersBlock = spollerClose.closest('[data-spollers]')
						const spollerCloseBlock = spollerClose.parentNode
						if (spollersBlock.classList.contains('_spoller-init')) {
							const spollerSpeed = spollersBlock.dataset.spollersSpeed
								? parseInt(spollersBlock.dataset.spollersSpeed)
								: 500
							spollerClose.classList.remove('_spoller-active')
							_slideUp(spollerClose.nextElementSibling, spollerSpeed)
							setTimeout(() => {
								spollerCloseBlock.open = false
							}, spollerSpeed)
						}
					})
				}
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveBlock = spollersBlock.querySelector('details[open]')
			if (spollerActiveBlock && !spollersBlock.querySelectorAll('._slide').length) {
				const spollerActiveTitle = spollerActiveBlock.querySelector('summary')
				const spollerSpeed = spollersBlock.dataset.spollersSpeed
					? parseInt(spollersBlock.dataset.spollersSpeed)
					: 500
				spollerActiveTitle.classList.remove('_spoller-active')
				_slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed)
				setTimeout(() => {
					spollerActiveBlock.open = false
				}, spollerSpeed)
			}
		}
	}
}
// Модуль роботи з табами =======================================================================================================================================================================================================================
export function tabs() {
	const tabs = document.querySelectorAll('[data-tabs]')
	let tabsActiveHash = []

	if (tabs.length > 0) {
		const hash = getHash()
		if (hash && hash.startsWith('tab-')) {
			tabsActiveHash = hash.replace('tab-', '').split('-')
		}
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add('_tab-init')
			tabsBlock.setAttribute('data-tabs-index', index)
			tabsBlock.addEventListener('click', setTabsAction)
			initTabs(tabsBlock)
		})

		// Отримання слойлерів з медіа-запитами
		let mdQueriesArray = dataMediaQueries(tabs, 'tabs')
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach((mdQueriesItem) => {
				// Подія
				mdQueriesItem.matchMedia.addEventListener('change', function () {
					setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
				})
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
			})
		}
	}
	// Встановлення позицій заголовків
	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach((tabsMediaItem) => {
			tabsMediaItem = tabsMediaItem.item
			let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]')
			let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]')
			let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]')
			let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]')
			tabsTitleItems = Array.from(tabsTitleItems).filter(
				(item) => item.closest('[data-tabs]') === tabsMediaItem
			)
			tabsContentItems = Array.from(tabsContentItems).filter(
				(item) => item.closest('[data-tabs]') === tabsMediaItem
			)
			tabsContentItems.forEach((tabsContentItem, index) => {
				if (matchMedia.matches) {
					tabsContent.append(tabsTitleItems[index])
					tabsContent.append(tabsContentItem)
					tabsMediaItem.classList.add('_tab-spoller')
				} else {
					tabsTitles.append(tabsTitleItems[index])
					tabsMediaItem.classList.remove('_tab-spoller')
				}
			})
		})
	}
	// Робота з контентом
	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*')
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*')
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex

		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active')
			tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null
		}
		if (tabsContent.length) {
			tabsContent.forEach((tabsContentItem, index) => {
				tabsTitles[index].setAttribute('data-tabs-title', '')
				tabsContentItem.setAttribute('data-tabs-item', '')

				if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
					tabsTitles[index].classList.add('_tab-active')
				}
				tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active')
			})
		}
	}
	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]')
		let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]')
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute('data-tabs-animate')) {
				return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500
			}
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock)
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute('data-tabs-hash')
			tabsContent = Array.from(tabsContent).filter((item) => item.closest('[data-tabs]') === tabsBlock)
			tabsTitles = Array.from(tabsTitles).filter((item) => item.closest('[data-tabs]') === tabsBlock)
			tabsContent.forEach((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains('_tab-active')) {
					if (tabsBlockAnimate) {
						_slideDown(tabsContentItem, tabsBlockAnimate)
					} else {
						tabsContentItem.hidden = false
					}
					if (isHash && !tabsContentItem.closest('.popup')) {
						setHash(`tab-${tabsBlockIndex}-${index}`)
					}
				} else {
					if (tabsBlockAnimate) {
						_slideUp(tabsContentItem, tabsBlockAnimate)
					} else {
						tabsContentItem.hidden = true
					}
				}
			})
		}
	}
	function setTabsAction(e) {
		const el = e.target
		if (el.closest('[data-tabs-title]')) {
			const tabTitle = el.closest('[data-tabs-title]')
			const tabsBlock = tabTitle.closest('[data-tabs]')
			if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
				let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active')
				tabActiveTitle.length
					? (tabActiveTitle = Array.from(tabActiveTitle).filter(
							(item) => item.closest('[data-tabs]') === tabsBlock
						))
					: null
				tabActiveTitle.length ? tabActiveTitle[0].classList.remove('_tab-active') : null
				tabTitle.classList.add('_tab-active')
				setTabsStatus(tabsBlock)
			}
			e.preventDefault()
		}
	}
}
// Модуль роботи з меню (бургер) =======================================================================================================================================================================================================================
export function menuInit() {
	if (document.querySelector('.icon-menu')) {
		document.addEventListener('click', function (e) {
			if (bodyLockStatus && e.target.closest('.icon-menu')) {
				bodyLockToggle()
				document.documentElement.classList.toggle('menu-open')
			}
		})
	}
}
export function menuOpen() {
	bodyLock()
	document.documentElement.classList.add('menu-open')
}
export function menuClose() {
	bodyUnlock()
	document.documentElement.classList.remove('menu-open')
}

//========================================================================================================================================================
// Анімований виліт меню, моя робота

export function menuInitForAnimate() {
	if (document.querySelector('.icon-menu')) {
		document.addEventListener('click', function (e) {
			if (bodyLockStatus && e.target.closest('.icon-menu')) {
				bodyLockToggle()
				if (document.documentElement.classList.contains('menu-open')) {
					document.documentElement.classList.remove('menu-open')
					document.documentElement.classList.add('menu-close')
				} else {
					document.documentElement.classList.remove('menu-close')
					document.documentElement.classList.add('menu-open')
				}
			}
		})
	}
}

// Модуль "показати ще" =======================================================================================================================================================================================================================
export function showMore() {
	window.addEventListener('load', function (e) {
		const showMoreBlocks = document.querySelectorAll('[data-showmore]')
		let showMoreBlocksRegular
		let mdQueriesArray
		if (showMoreBlocks.length) {
			// Отримання звичайних об'єктів
			showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (item, index, self) {
				return !item.dataset.showmoreMedia
			})
			// Ініціалізація звичайних об'єктів
			showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null

			document.addEventListener('click', showMoreActions)
			window.addEventListener('resize', showMoreActions)

			// Отримання об'єктів з медіа-запитами
			mdQueriesArray = dataMediaQueries(showMoreBlocks, 'showmoreMedia')
			if (mdQueriesArray && mdQueriesArray.length) {
				mdQueriesArray.forEach((mdQueriesItem) => {
					// Подія
					mdQueriesItem.matchMedia.addEventListener('change', function () {
						initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
					})
				})
				initItemsMedia(mdQueriesArray)
			}
		}
		function initItemsMedia(mdQueriesArray) {
			mdQueriesArray.forEach((mdQueriesItem) => {
				initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
			})
		}
		function initItems(showMoreBlocks, matchMedia) {
			showMoreBlocks.forEach((showMoreBlock) => {
				initItem(showMoreBlock, matchMedia)
			})
		}
		function initItem(showMoreBlock, matchMedia = false) {
			showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock
			let showMoreContent = showMoreBlock.querySelectorAll('[data-showmore-content]')
			let showMoreButton = showMoreBlock.querySelectorAll('[data-showmore-button]')
			showMoreContent = Array.from(showMoreContent).filter(
				(item) => item.closest('[data-showmore]') === showMoreBlock
			)[0]
			showMoreButton = Array.from(showMoreButton).filter(
				(item) => item.closest('[data-showmore]') === showMoreBlock
			)[0]
			const hiddenHeight = getHeight(showMoreBlock, showMoreContent)
			if (matchMedia.matches || !matchMedia) {
				if (hiddenHeight < getOriginalHeight(showMoreContent)) {
					_slideUp(
						showMoreContent,
						0,
						showMoreBlock.classList.contains('_showmore-active')
							? getOriginalHeight(showMoreContent)
							: hiddenHeight
					)
					showMoreButton.hidden = false
				} else {
					_slideDown(showMoreContent, 0, hiddenHeight)
					showMoreButton.hidden = true
				}
			} else {
				_slideDown(showMoreContent, 0, hiddenHeight)
				showMoreButton.hidden = true
			}
		}
		function getHeight(showMoreBlock, showMoreContent) {
			let hiddenHeight = 0
			const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : 'size'
			const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap)
				? parseFloat(getComputedStyle(showMoreContent).rowGap)
				: 0
			if (showMoreType === 'items') {
				const showMoreTypeValue = showMoreContent.dataset.showmoreContent
					? showMoreContent.dataset.showmoreContent
					: 3
				const showMoreItems = showMoreContent.children
				for (let index = 1; index < showMoreItems.length; index++) {
					const showMoreItem = showMoreItems[index - 1]
					const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop)
						? parseFloat(getComputedStyle(showMoreItem).marginTop)
						: 0
					const marginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom)
						? parseFloat(getComputedStyle(showMoreItem).marginBottom)
						: 0
					hiddenHeight += showMoreItem.offsetHeight + marginTop
					if (index == showMoreTypeValue) break
					hiddenHeight += marginBottom
				}
				rowGap ? (hiddenHeight += (showMoreTypeValue - 1) * rowGap) : null
			} else {
				const showMoreTypeValue = showMoreContent.dataset.showmoreContent
					? showMoreContent.dataset.showmoreContent
					: 150
				hiddenHeight = showMoreTypeValue
			}
			return hiddenHeight
		}

		function getOriginalHeight(showMoreContent) {
			let parentHidden
			let hiddenHeight = showMoreContent.offsetHeight
			showMoreContent.style.removeProperty('height')
			if (showMoreContent.closest(`[hidden]`)) {
				parentHidden = showMoreContent.closest(`[hidden]`)
				parentHidden.hidden = false
			}
			let originalHeight = showMoreContent.offsetHeight
			parentHidden ? (parentHidden.hidden = true) : null
			showMoreContent.style.height = `${hiddenHeight}px`
			return originalHeight
		}
		function showMoreActions(e) {
			const targetEvent = e.target
			const targetType = e.type
			if (targetType === 'click') {
				if (targetEvent.closest('[data-showmore-button]')) {
					const showMoreButton = targetEvent.closest('[data-showmore-button]')
					const showMoreBlock = showMoreButton.closest('[data-showmore]')
					const showMoreContent = showMoreBlock.querySelector('[data-showmore-content]')
					const showMoreSpeed = showMoreBlock.dataset.showmoreButton
						? showMoreBlock.dataset.showmoreButton
						: '500'
					const hiddenHeight = getHeight(showMoreBlock, showMoreContent)
					if (!showMoreContent.classList.contains('_slide')) {
						showMoreBlock.classList.contains('_showmore-active')
							? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight)
							: _slideDown(showMoreContent, showMoreSpeed, hiddenHeight)
						showMoreBlock.classList.toggle('_showmore-active')
					}
				}
			} else if (targetType === 'resize') {
				showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null
				mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null
			}
		}
	})
}
// Модуль "Ripple effect" =======================================================================================================================================================================================================================
export function rippleEffect() {
	// Подія кліку на кнопці
	document.addEventListener('click', function (e) {
		const targetItem = e.target
		if (targetItem.closest('[data-ripple]')) {
			// Константи
			const button = targetItem.closest('[data-ripple]')
			const ripple = document.createElement('span')
			const diameter = Math.max(button.clientWidth, button.clientHeight)
			const radius = diameter / 2

			// Формування елементу
			ripple.style.width = ripple.style.height = `${diameter}px`
			ripple.style.left = `${e.pageX - (button.getBoundingClientRect().left + scrollX) - radius}px`
			ripple.style.top = `${e.pageY - (button.getBoundingClientRect().top + scrollY) - radius}px`
			ripple.classList.add('ripple')

			// Видалення існуючого елементу (опціонально)
			button.dataset.ripple === 'once' && button.querySelector('.ripple')
				? button.querySelector('.ripple').remove()
				: null

			// Додавання елементу
			button.appendChild(ripple)

			// Отримання часу дії анімації
			const timeOut = getAnimationDuration(ripple)

			// Видалення елементу
			setTimeout(() => {
				ripple ? ripple.remove() : null
			}, timeOut)

			// Функтія отримання часу дії анімації
			function getAnimationDuration() {
				const aDuration = window.getComputedStyle(ripple).animationDuration
				return aDuration.includes('ms') ? aDuration.replace('ms', '') : aDuration.replace('s', '') * 1000
			}
		}
	})
}
// Модуль "Сustom сursor" =======================================================================================================================================================================================================================
export function customCursor(isShadowTrue) {
	const wrapper = document.querySelector('[data-custom-cursor]')
		? document.querySelector('[data-custom-cursor]')
		: document.documentElement
	if (wrapper && !isMobile.any()) {
		// Створюємо та додаємо об'єкт курсору
		const cursor = document.createElement('div')
		cursor.classList.add('fls-cursor')
		cursor.style.opacity = 0
		cursor.insertAdjacentHTML('beforeend', `<span class="fls-cursor__pointer"></span>`)
		isShadowTrue ? cursor.insertAdjacentHTML('beforeend', `<span class="fls-cursor__shadow"></span>`) : null
		wrapper.append(cursor)

		const cursorPointer = document.querySelector('.fls-cursor__pointer')
		const cursorPointerStyle = {
			width: cursorPointer.offsetWidth,
			height: cursorPointer.offsetHeight,
		}
		let cursorShadow, cursorShadowStyle
		if (isShadowTrue) {
			cursorShadow = document.querySelector('.fls-cursor__shadow')
			cursorShadowStyle = {
				width: cursorShadow.offsetWidth,
				height: cursorShadow.offsetHeight,
			}
		}
		function mouseActions(e) {
			if (e.type === 'mouseout') {
				cursor.style.opacity = 0
			} else if (e.type === 'mousemove') {
				cursor.style.removeProperty('opacity')
				if (
					e.target.closest('button') ||
					e.target.closest('a') ||
					e.target.closest('input') ||
					(window.getComputedStyle(e.target).cursor !== 'none' &&
						window.getComputedStyle(e.target).cursor !== 'default')
				) {
					cursor.classList.add('_hover')
				} else {
					cursor.classList.remove('_hover')
				}
			} else if (e.type === 'mousedown') {
				cursor.classList.add('_active')
			} else if (e.type === 'mouseup') {
				cursor.classList.remove('_active')
			}
			cursorPointer
				? (cursorPointer.style.transform = `translate3d(${e.clientX - cursorPointerStyle.width / 2}px, ${
						e.clientY - cursorPointerStyle.height / 2
					}px, 0)`)
				: null
			cursorShadow
				? (cursorShadow.style.transform = `translate3d(${e.clientX - cursorShadowStyle.width / 2}px, ${
						e.clientY - cursorShadowStyle.height / 2
					}px, 0)`)
				: null
		}

		window.addEventListener('mouseup', mouseActions)
		window.addEventListener('mousedown', mouseActions)
		window.addEventListener('mousemove', mouseActions)
		window.addEventListener('mouseout', mouseActions)
	}
}
//================================================================================================================================================================================================================================================================================================================
// Інші корисні функції ================================================================================================================================================================================================================================================================================================================
//================================================================================================================================================================================================================================================================================================================
// FLS (Full Logging System)
export function FLS(message) {
	setTimeout(() => {
		if (window.FLS) {
			console.log(message)
		}
	}, 0)
}
// Отримати цифри з рядка
export function getDigFromString(item) {
	return parseInt(item.replace(/[^\d]/g, ''))
}
// Форматування цифр типу 100 000 000
export function getDigFormat(item, sepp = ' ') {
	return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${sepp}`)
}
// Прибрати клас з усіх елементів масиву
export function removeClasses(array, className) {
	for (var i = 0; i < array.length; i++) {
		array[i].classList.remove(className)
	}
}
// Унікалізація масиву
export function uniqArray(array) {
	return array.filter(function (item, index, self) {
		return self.indexOf(item) === index
	})
}
// Функція отримання індексу всередині батьківського елемента
export function indexInParent(parent, element) {
	const array = Array.prototype.slice.call(parent.children)
	return Array.prototype.indexOf.call(array, element)
}
// Функція перевіряє чи об'єкт видимий
export function isHidden(el) {
	return el.offsetParent === null
}
// Обробка медіа запитів з атрибутів
export function dataMediaQueries(array, dataSetValue) {
	// Отримання об'єктів з медіа-запитами
	const media = Array.from(array).filter(function (item, index, self) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(',')[0]
		}
	})
	// Ініціалізація об'єктів з медіа-запитами
	if (media.length) {
		const breakpointsArray = []
		media.forEach((item) => {
			const params = item.dataset[dataSetValue]
			const breakpoint = {}
			const paramsArray = params.split(',')
			breakpoint.value = paramsArray[0]
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max'
			breakpoint.item = item
			breakpointsArray.push(breakpoint)
		})
		// Отримуємо унікальні брейкпоінти
		let mdQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + '-width: ' + item.value + 'px),' + item.value + ',' + item.type
		})
		mdQueries = uniqArray(mdQueries)
		const mdQueriesArray = []

		if (mdQueries.length) {
			// Працюємо з кожним брейкпоінтом
			mdQueries.forEach((breakpoint) => {
				const paramsArray = breakpoint.split(',')
				const mediaBreakpoint = paramsArray[1]
				const mediaType = paramsArray[2]
				const matchMedia = window.matchMedia(paramsArray[0])
				// Об'єкти з потрібними умовами
				const itemsArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true
					}
				})
				mdQueriesArray.push({
					itemsArray,
					matchMedia,
				})
			})
			return mdQueriesArray
		}
	}
}

// Код додає клас _active-page для menu__link щоб можна було стилізувати активний пункт меню відносно відкритої сторінки

export function getActivePage() {
	const [currentPage] = location.pathname.split('/').slice(-1)
	const menuLinks = document.querySelectorAll('.menu__link')

	if (menuLinks.length) {
		menuLinks.forEach((menuLink) => {
			if (menuLink.getAttribute('href') === currentPage) {
				menuLink.classList.add('_active-page')
			}
		})
	}
}
//================================================================================================================================================================================================================================================================================================================

//================================================================================================================================================================================================================================================================================================================
// Копіювання тексту в буфер

// Форма
/*
<div data-clipboard class="cn">
	<span data-clipboardEl class="cn__address">
		5z3Eqrt344gYQwerg5z3Eqrt344gYQwerg5z3Eqrt344gYQwerg
	</span>
	<button type="button" data-clipboardBtn aria-label="copy text"
		class="cn__button">
		<svg viewBox="0 0 87 87" fill="none" xmlns="http://www.w3.org/2000/svg">
			!туту свг
		</svg>
	</button>
	<div data-cnHint class="cn__hint">Copied to clipboard </div>
</div>
*/

export function copyTextToClipboard() {
	const copyButtons = document.querySelectorAll('[data-clipboardBtn]')

	if (copyButtons.length) {
		copyButtons.forEach((copyButton) => {
			copyButton.addEventListener('click', () => {
				const copyElement = copyButton.closest('[data-clipboard]')

				if (copyElement) {
					const textToCopy = copyElement.querySelector('[data-clipboardEl]').textContent.trim()
					const hintEl = copyElement.querySelector('[data-cnHint]')
					copyElement.classList.add('active')

					async function copyText(textToCopy) {
						try {
							await navigator.clipboard.writeText(textToCopy)
						} catch (error) {
							hintEl.textContent = "Doesn't copied"
						} finally {
							setTimeout(() => {
								copyElement.classList.remove('active')
							}, 1000)
						}
					}
					copyText(textToCopy)
				}
			})
		})
	}
}

//========================================================================================================================================================
// Функція задання animationDelay для масиву(колекції) елементів

export function applyAnimationDelay(elements, delayBetween = 0.2, generalDelay = 0) {
	if (elements.length) {
		elements.forEach((element, index) => {
			element.style.animationDelay = `${generalDelay + index * delayBetween}s`
		})
	}
}

//========================================================================================================================================================
// Функція розбиття тексту на span і подальше привласнення затримки анімації для кожного спану

export function splitElementIntoSpans(selector, delayBetween, generalDelay) {
	const elementsArr = document.querySelectorAll(selector)
	if (elementsArr.length) {
		elementsArr.forEach((element) => {
			const charsArr = element.textContent.trim().split('')
			element.textContent = ''

			const spannedText = charsArr.map((char) => {
				const span = document.createElement('span')

				if (char === ' ') {
					span.textContent = '\u00A0'
				} else {
					span.textContent = char
				}

				element.appendChild(span)

				return span
			})

			applyAnimationDelay(spannedText, delayBetween, generalDelay)
		})
	}
}

//========================================================================================================================================================
// Функція створення @keyframes правила
export function createKeyframesAnimation({ name, keyframeBody }) {
	let styleSheet = null

	// Пошук ічнуючого стиля
	for (let i = 0; i < document.styleSheets.length; i++) {
		if (document.styleSheets[i].href === null) {
			styleSheet = document.styleSheets[i]
			break
		}
	}

	// створення нового якщо не знайдено
	if (styleSheet === null) {
		let style = document.createElement('style')
		document.head.appendChild(style)
		styleSheet = style.sheet
	}

	// Перевірка на наявність правила з таким самим імʼям
	for (let i = 0; i < styleSheet.cssRules.length; i++) {
		if (styleSheet.cssRules[i].type === CSSRule.KEYFRAMES_RULE && styleSheet.cssRules[i].name === name) {
			console.log(`@keyframes rule with  ${name} is already avaliable`)
			return
		}
	}

	//Створення @keyframes правила
	let keyframes = `@keyframes ${name} {${keyframeBody}}`
	styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
}

//========================================================================================================================================================
// Анімація заголовку confety

export function confeti(selector, characterSpacing = 2000, speed = 10) {
	const element = document.querySelector(selector)
	const text = element.innerHTML
	const elWidth = element.offsetWidth
	const elHeight = element.offsetHeight
	const halfWidth = elWidth / 2
	const halfHeight = elHeight / 2

	element.style.width = elWidth + 'px'
	element.style.height = elHeight + 'px'

	const totalWidthFrames = elWidth / 10
	const totalHeightFrames = elHeight / 10

	element.innerHTML = ''

	for (let i = 0; i < totalHeightFrames; i++) {
		for (let j = 0; j < totalWidthFrames; j++) {
			const smallBox = document.createElement('span')
			smallBox.innerHTML = text
			smallBox.style.clip =
				'rect(' + i * 10 + 'px, ' + (j + 1) * 10 + 'px, ' + (i + 1) * 10 + 'px, ' + j * 10 + 'px)'
			smallBox.style.transitionDelay = Math.floor(Math.random() * characterSpacing) + 'ms'

			if (j % 2 == 0) {
				const randomNum = Math.floor(Math.random() * halfWidth)
				smallBox.style.top = i * 10 < halfHeight ? -elHeight + 'px' : elHeight + 'px'
				smallBox.style.left = j * 10 < halfWidth ? -randomNum + 'px' : randomNum + 'px'
			} else {
				const randomNum = Math.floor(Math.random() * elHeight)
				smallBox.style.top = i * 10 < halfHeight ? -randomNum + 'px' : randomNum + 'px'
				smallBox.style.left = j * 10 < halfWidth ? -elWidth + 'px' : elWidth + 'px'
			}
			element.appendChild(smallBox)
		}
	}

	setTimeout(function () {
		element.style.visibility = 'visible'
		const totalBoxes = totalWidthFrames * totalHeightFrames
		const coleccionBoxes = element.querySelectorAll('span')

		for (let d = 0; d < totalBoxes; d++) {
			coleccionBoxes[d].style.top = 0
			coleccionBoxes[d].style.left = 0
		}

		// element.style.color = 'lime'
	}, speed)
}

// Прозоре відео для сафарі========================================================================================================================================================
function supportsHEVCAlpha() {
	const navigator = window.navigator
	const ua = navigator.userAgent.toLowerCase()
	const hasMediaCapabilities = !!(navigator.mediaCapabilities && navigator.mediaCapabilities.decodingInfo)
	const isSafari = ua.indexOf('safari') != -1 && !(ua.indexOf('chrome') != -1) && ua.indexOf('version/') != -1

	return isSafari && hasMediaCapabilities
}

function isIE11() {
	return !!window.navigator.userAgent.match(/Trident\/7\./, [])
}

if (!isIE11()) {
	const videos = document.querySelectorAll('video')
	if (supportsHEVCAlpha()) {
		videos.forEach((video) => {
			let srcValue = video.getAttribute('src')
			srcValue = srcValue + 'mov'
			video.setAttribute('src', srcValue)
			video.setAttribute('type', 'video/quicktime')
		})
	} else {
		videos.forEach((video) => {
			let srcValue = video.getAttribute('src')
			srcValue = srcValue + 'webm'
			video.setAttribute('src', srcValue)
		})
	}
}

//Кастомна кнопка запуску та паузи відео з логікою ========================================================================================================================================================

export function playVideo() {
	const playButton = document.getElementById('play-btn')
	const video = document.getElementById('video')

	function togglePlay() {
		if (video.classList.contains('play')) {
			video.pause()
			video.classList.remove('play')
			playButton.classList.remove('hidden')
		} else {
			video.play()
			video.classList.add('play')
			playButton.classList.add('hidden')
		}
	}

	video.addEventListener('click', togglePlay)
	playButton.addEventListener('click', togglePlay)
}

//Клон іконки при натиску на кнопку========================================================================================================================================================

// function iconForPayMethod() {
// 	const targetSvg = document.querySelector('.card-about__method.active')
// 	let cloneSvg = targetSvg.cloneNode(true)
// 	const cloneSvgBox = document.getElementById('iconOfMethod')
// 	cloneSvgBox.innerHTML = ''
// 	cloneSvgBox.appendChild(cloneSvg)
// }

// iconForPayMethod()

// const methodPayBtns = document.querySelectorAll('.card-about__method')
// if (methodPayBtns.length) {
// 	methodPayBtns.forEach((methodPayBtn) => {
// 		methodPayBtn.onclick = () => {
// 			methodPayBtns.forEach((methodPayBtn) => {
// 				methodPayBtn.classList.remove('active')
// 			})
// 			methodPayBtn.classList.add('active')
// 			iconForPayMethod()
// 		}
// 	})
// }
