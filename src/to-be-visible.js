import {checkHtmlElement} from './utils'

function isStyleVisible(element) {
  const {getComputedStyle} = element.ownerDocument.defaultView

  const {display, visibility, opacity} = getComputedStyle(element)
  return (
    display !== 'none' &&
    visibility !== 'hidden' &&
    visibility !== 'collapse' &&
    opacity !== '0' &&
    opacity !== 0
  )
}

function isAttributeVisible(element, previousElement) {
  return (
    !element.hasAttribute('hidden') &&
    (element.nodeName === 'DETAILS' && previousElement.nodeName !== 'SUMMARY'
      ? element.hasAttribute('open')
      : true)
  )
}

function isElementVisible(element, previousElement) {
  return (
    isStyleVisible(element) &&
    isAttributeVisible(element, previousElement) &&
    (!element.parentElement || isElementVisible(element.parentElement, element))
  )
}

export function toBeVisible(element) {
  checkHtmlElement(element, toBeVisible, this)
  const isVisible = isElementVisible(element)
  return {
    pass: isVisible,
    message: () => {
      const is = isVisible ? 'is' : 'is not'
      return [
        this.utils.matcherHint(
          `${this.isNot ? '.not' : ''}.toBeVisible`,
          'element',
          '',
        ),
        '',
        `Received element ${is} visible:`,
        `  ${this.utils.printReceived(element.cloneNode(false))}`,
      ].join('\n')
    },
  }
}
