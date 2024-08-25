// Інструкція з використання модулю

// Просто добавляємо необхідний атрибут до вашого коду html і працює як звичайний лічильник
// Приклад запису
//						1)    2)
/* <span data-counter=" 1s , 2em, 1s">30</span> */

// Де:

// 1) Час виконання анімації в секундах за змовченням = 1s
// 2) Відступ безпеки якщо поруч є текст і його трясе за змовченням = 0
// 3) Затримка перед початком анімації
// Приклад запису якщо якийсь із параметрів вказувати не треба

/* <span data-counter="  ,1em">30</span> */

// ну або якщо підходять всі значення за змовченням вказуємо просто атрибут

/* <span data-counter >30</span> */

//========================================================================================================================================================

// Додаткові опції

// 1)Лічильник з розділовим знаком

// Добавляємо атрибут data-separator

/* <span data-separator data-counter>16537</span> */

// За змовченням цей метод визначає регіон в якому знаходиться користувач, та підставляє той розділовий знак який використовується в цьому регіоні

// Є можливість підставити власний розділовий знак
//												    †
/* <span data-separator data-counter>165,37</span> */

// Просто в значення лічильника підставляємо розділовий знак в будь яке місце 165,37 або 16.537 будь який знак

//========================================================================================================================================================

// 2) Повторення анімації при повторній появі елементу у вʼюпорті

// За змовченням анімація відбудеться тільки один раз при появі елементу
// Добавляємо атрибут data-repeat

/* <span data-counter data-repeat>30</span> */
//========================================================================================================================================================
// 3) Лічильник із свг

// Для батьківського елементу куди хочемо вставити свг задати атрибут data-circle-wrap

//						     1)        2)    3)    4)
/* <div data-circle-wrap="#40DDB6, #6B77E5, 3px, full"> */

// Де:

// 1) Колір stroke для свг
// 2) Колір fill для свг
// 3) Товщина stroke для свг
// 4) Якщо треба заповнення свг на 100%, пишемо full або будь що, що поверне true, за змовченням буде заповнюватись на вказане значення у відсотках

export class Counter {
	constructor(counterAtr) {
		this.counterAtr = counterAtr || 'data-counter'
	}

	// Функція callback для observer
	callBack(entries) {
		entries.forEach((entry) => {
			const counterEl = entry.target
			const counter = this.counters.find((counter) => counter.counterEl === counterEl)

			if (entry.isIntersecting) {
				if (!counter.isAnimated) {
					counter.startCounter()

					if (!counter.repeat) {
						counter.isAnimated = true
						this.observer.unobserve(counterEl)
					}
				}
			}
		})
	}

	// Стврення observer
	observe(element) {
		const options = {
			root: null,
			rootMargin: '0px 0px 0px 0px',
			threshold: 0.5,
		}

		this.observer = new IntersectionObserver(this.callBack.bind(this), options)

		this.observer.observe(element)
	}

	// ініціалізація лічильника
	counterInit() {
		const counterElements = document.querySelectorAll(`[${this.counterAtr}]`)
		this.counters = []

		if (counterElements.length) {
			counterElements.forEach((counter) => {
				const newCounter = new CounterInstance(counter, this.counterAtr)
				this.counters.push(newCounter)
				newCounter.initCounter()

				this.observe(counter)
			})
		}
	}
}

//========================================================================================================================================================

export class CounterInstance {
	constructor(counterEl, counterAtr, parentAtrName, repeatAtrName, separatorAtrName) {
		this.counterAtr = counterAtr
		this.parentAtrName = parentAtrName || 'data-circle-wrap'
		this.repeatAtrName = repeatAtrName || 'data-repeat'
		this.separatorAtrName = separatorAtrName || 'data-separator'
		this.counterEl = counterEl

		this.parentEl = this.counterEl.closest(`[${this.parentAtrName}]`)

		// Змінна для роботи логіки з повторною анімацією
		this.isAnimated = false
	}

	// Метод для обчислення та присвоєння ширини лічильника, та якщо потрібно, задання відстані безпеки з переводом у rem
	setWidth() {
		const width = this.counterEl.offsetWidth
		const fontSize = parseFloat(getComputedStyle(this.counterEl).fontSize)
		this.counterEl.style.minWidth = (width + this.range) / fontSize + 'em'
	}

	// Метод отримання неохідних для роботи лічильника значень
	getCounterValues() {
		const counterValues = this.counterEl.getAttribute(this.counterAtr)

		// Приймаємо значення самого лічильника
		let custValue = this.counterEl.textContent.trim() || 0

		// Приймаємо дані з атрибуту, перевіряємо, та привласнюємо значення за змовченням, якщо дані не визначені
		const [customTime, customRange] = counterValues.split(',').map((value) => parseFloat(value.trim(), 10))

		this.time = customTime * 1000 || 1000
		this.range = customRange || 0

		// Отримання розділового знаку та числа без нього
		this.value = parseInt(this.initSeparator(custValue))

		// Якщо є розділовий знак, запишемо число в правильному форматі для визначення його розміру перед анімуванням
		if (this.counterEl.hasAttribute(this.separatorAtrName)) {
			this.counterEl.textContent = this.formatNumberWithSeparator(this.value)
		}

		// Змінна для роботи повторення анімації
		this.repeat = this.counterEl.hasAttribute(this.repeatAtrName)
	}

	// Метод отримання значень для лічильника з розділовим знаком
	initSeparator(custValue) {
		// Логіка знаходження розділового знаку відповідно до регіону користувача, або задання знаку який вказав користувач

		if (this.counterEl.hasAttribute(this.separatorAtrName)) {
			const matchResult = custValue.match(/[^\d]/)

			if (matchResult) {
				this.separator = matchResult[0]

				return (this.value = custValue.split(this.separator).join(''))
			} else {
				const formatter = new Intl.NumberFormat()
				const parts = formatter.formatToParts(1000)
				const localSeparator = parts.find((part) => part.type === 'group')
				this.separator = localSeparator.value
			}
		} else this.separator = ''

		return (this.value = custValue)
	}

	animateCounter() {
		// деталі у відео Жені https://www.youtube.com/watch?v=MSP-MP_TVf4
		let current = 0
		let start = null

		const step = (timestamp) => {
			if (!start) start = timestamp
			const progress = Math.min((timestamp - start) / this.time, 1)

			this.counterEl.textContent = this.formatNumberWithSeparator(progress * (current + parseInt(this.value)))

			if (progress < 1) {
				requestAnimationFrame(step)
			}
		}

		requestAnimationFrame(step)
	}

	// Отримуємо число з лічильника і перед його записом в html вставляємо розділовий знак в число
	formatNumberWithSeparator(number) {
		const integerPart = number.toFixed(0)

		return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, this.separator)
	}

	// Перевірка лічильник з свг чи ні
	startCounter() {
		if (this.parentEl) {
			this.setAnimationProperties()
		}

		this.animateCounter()
	}
	// метод привласнення властивостей анімації

	setAnimationProperties() {
		this.offsetValue = this.totalLength - (this.totalLength * this.value) / this.maxValue

		// перезапис offsetValue svg при адаптиві
		if (this.styleElement) {
			this.styleElement.innerText = `@keyframes ${this.animName} {
					100% {
					  stroke-dashoffset: ${this.offsetValue}; 
					}
				  }`
			this.circleElement.style.animation = ''

			setTimeout(() => {
				this.circleElement.style.animation = `${this.animName} ${this.time}ms linear forwards`
			}, 20)
			return
		}

		// Створення унікального імені для анімації та елементу стилів
		this.animName = `anim-${Math.floor(Math.random() * 1e6)}`

		const keyframesRule = `@keyframes ${this.animName} {
				100% {
				  stroke-dashoffset: ${this.offsetValue}; 
				}
			  }`

		this.styleElement = document.createElement('style')
		this.styleElement.append(keyframesRule)
		this.styleElement.classList.add(this.animName)
		document.head.appendChild(this.styleElement)

		this.circleElement.style.animation = `${this.animName} ${this.time}ms linear forwards`
	}

	// Ну тут просто запис стилів з переводом в rem
	setStyles() {
		this.totalLength = this.circleElement.getTotalLength()
		this.svgElement.style.position = 'absolute'
		this.svgElement.style.top = '0'
		this.svgElement.style.left = '0'
		this.svgElement.style.width = '100%'
		this.svgElement.style.height = '100%'
		this.svgElement.style.fill = this.fill
		this.svgElement.style.stroke = this.stroke
		this.svgElement.style.strokeWidth = this.strokeWidth / 16 + 'rem'
		this.circleElement.style.strokeDasharray = this.totalLength
		this.circleElement.style.strokeDashoffset = this.totalLength
	}

	// Метод задання розмірів для свг зображення відносно батьківського елементу з переводом в rem
	setSvgSize() {
		const attributes = ['cx', 'cy', 'r']
		this.parentElWidth = this.parentEl.offsetWidth

		attributes.forEach((attr) => {
			if (attr === 'r') {
				this.circleElement.setAttribute(attr, (this.parentElWidth - this.strokeWidth) / 2)
			} else {
				this.circleElement.setAttribute(attr, this.parentElWidth / 2)
			}
		})
	}

	// Метод отримання параметрів з атрибуту для свг, з усіма перевірками та привласненні значень за змовченням
	getSvgParams() {
		const svgValues = this.parentEl.getAttribute(this.parentAtrName)

		const [custFill, custStroke, custStrokeWidth, fullFilling] = svgValues
			.split(',')
			.map((value) => value.trim())

		// Отримуємо параметри з атрибуту, якщо не задані, присвоюємо значення за змовченням
		this.fill = custFill || '#000'
		this.stroke = custStroke || '#ff0000'
		this.strokeWidth = parseFloat(custStrokeWidth, 10) || 3

		// визначаємо тип заповнення свг, повний чи на певний відсоток
		this.maxValue = fullFilling ? this.value : 100
	}

	// Метод безпосередньо створення свг зображення
	svgCreator() {
		this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

		this.circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
		this.svgElement.appendChild(this.circleElement)

		this.circleElement.setAttribute('stroke-linecap', 'round')

		this.parentEl.prepend(this.svgElement)
	}

	// Ну і власне ініціалізація створення свг
	svgInit() {
		this.parentEl.style.position = 'relative'
		this.getSvgParams()
		this.svgCreator()

		// Иніціалізація Resize Observer
		const resizeObserver = new ResizeObserver(() => {
			this.setSvgSize()
			this.setStyles()
			this.setAnimationProperties()
		})

		resizeObserver.observe(this.parentEl)
	}

	// Ініціалізація лічильників та свг при створенні екземпляру класу
	initCounter() {
		this.getCounterValues()
		this.setWidth()

		if (this.parentEl) {
			this.svgInit()
		}
	}
}

const counter = new Counter()
counter.counterInit()

// const counter = new Counter()
