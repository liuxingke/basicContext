import objectAssign from 'object-assign'

const ITEM      = 'ITEM'
const SEPARATOR = 'SEPARATOR'

export default function(item = {}, opts = {}) {

	let elem = null

	const parseItem = function() {

		item = objectAssign({}, item)

		// Set default values
		if (item.type==null)    item.type    = (Object.keys(item).length===0 ? SEPARATOR : ITEM)
		if (item.content==null) item.content = 'Undefined'
		if (item.class==null)   item.class   = ''

		// Set default function when fn is missing
		if (typeof item.fn !== 'function') item.fn = () => {}

		// Add disabled class when item disabled
		if (item.disabled!==true) item.disabled = false
		if (item.disabled===true) item.class += ' basicContext__item--disabled'

		// Add invisible class when invisible
		if (item.visible!==false) item.visible = true
		if (item.visible===false) item.class += ' basicContext__item--invisible'

		return true

	}

	const parseOpts = function() {

		opts = objectAssign({}, opts)

		return true

	}

	const setElem = function(newElem) {

		elem = newElem

	}

	const getElem = function() {

		return elem

	}

	const getItems = function() {

		return item.items

	}

	const isActive = function() {

		if (elem==null) return false

		let parentElem = elem.parentElement

		if (parentElem==null) return false
		if (parentElem.querySelector(`.basicContext__item[data-num='${ opts.num }']:hover`)==null) return false

		return true

	}

	const setEvents = function() {

		if (elem==null)           return false
		if (item.disabled===true) return false

		elem.onclick       = item.fn
		elem.oncontextmenu = item.fn

		if (item.items!=null) {

			let timeout = null

			elem.onmouseenter = () => {
				clearTimeout(timeout)
				timeout = setTimeout(() => opts.parent.showSub(exports()), 150)
			}

			elem.onmouseleave = () => {
				clearTimeout(timeout)
				opts.parent.hideSub()
			}

		}

		return true

	}

	const render = function() {

		if (item.type===ITEM)      return renderItem()
		if (item.type===SEPARATOR) return renderSeparator()

	}

	const renderItem = function() {

		return `
		       <tr class="basicContext__item ${ item.class }" data-num="${ opts.num }">
		           <td class='basicContext__data'>${ item.content }</td>
		       </tr>
		       `

	}

	const renderSeparator = function() {

		return `
		       <tr class="basicContext__item basicContext__item--separator"></tr>
		       `

	}

	const exports = function() {

		return {
			setElem,
			getElem,
			getItems,
			isActive,
			setEvents,
			render
		}

	}

	parseItem()
	parseOpts()

	return exports()

}