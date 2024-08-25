// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile, FLS } from './functions.js'
// Підключення списку активних модулів
import { flsModules } from './modules.js'

// Підключення з node_modules
import tippy from 'tippy.js'
import 'tippy.js/animations/scale.css'

// Підключення стилів з src/scss/libs
// import '../../scss/libs/tippy.scss'
// Підключення стилів з node_modules
import 'tippy.js/dist/tippy.css'

// Запускаємо та додаємо в об'єкт модулів
flsModules.tippy = tippy('[data-tippy-content]', {
	animation: 'scale',
	trigger: 'click',
})
