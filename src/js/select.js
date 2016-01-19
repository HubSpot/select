/* global Tether */

const {
  extend,
  addClass,
  removeClass,
  hasClass,
  getBounds,
  Evented
} = Tether.Utils;

const ENTER = 13;
const ESCAPE = 27;
const SPACE = 32;
const UP = 38;
const DOWN = 40;

const touchDevice = 'ontouchstart' in document.documentElement;
const clickEvent = touchDevice ? 'touchstart' : 'click';

function useNative() {
  const {innerWidth, innerHeight} = window;
  return touchDevice && (innerWidth <= 640 || innerHeight <= 640);
}

function isRepeatedChar (str) {
  return Array.prototype.reduce.call(str, (a, b) => {
    return a === b ? b : false;
  });
}

function getFocusedSelect () {
  const focusedTarget = document.querySelector('.select-target-focused');
  return focusedTarget ? focusedTarget.selectInstance : null;
}

let searchText = '';
let searchTextTimeout;

document.addEventListener('keypress', (e) => {
  const select = getFocusedSelect();
  if (!select || e.charCode === 0) {
    return;
  }

  if (e.keyCode === SPACE) {
    e.preventDefault();
  }

  clearTimeout(searchTextTimeout);
  searchTextTimeout = setTimeout(() => {
    searchText = '';
  }, 500);

  searchText += String.fromCharCode(e.charCode);

  const options = select.findOptionsByPrefix(searchText);

  if (options.length === 1) {
    // We have an exact match, choose it
    select.selectOption(options[0]);
  }

  if (searchText.length > 1 && isRepeatedChar(searchText)) {
    // They hit the same char over and over, maybe they want to cycle through
    // the options that start with that char
    const repeatedOptions = select.findOptionsByPrefix(searchText[0]);

    if (repeatedOptions.length) {
      let selected = repeatedOptions.indexOf(select.getChosen());

      // Pick the next thing (if something with this prefix wasen't selected
      // we'll end up with the first option)
      selected += 1;
      selected = selected % repeatedOptions.length;

      select.selectOption(repeatedOptions[selected]);
      return;
    }
  }

  if (options.length) {
    // We have multiple things that start with this prefix.  Based on the
    // behavior of native select, this is considered after the repeated case.
    select.selectOption(options[0]);
    return;
  }

  // No match at all, do nothing
})

document.addEventListener('keydown', (e) => {
  // We consider this independently of the keypress handler so we can intercept
  // keys that have built-in functions.
  const select = getFocusedSelect();
  if (!select) {
    return;
  }

  if ([UP, DOWN, ESCAPE].indexOf(e.keyCode) >= 0) {
    e.preventDefault();
  }

  if (select.isOpen()) {
    switch(e.keyCode) {
      case UP:
      case DOWN:
        select.moveHighlight(e.keyCode);
        break;
      case ENTER:
        select.selectHighlightedOption();
        break;
      case ESCAPE:
        select.close();
        select.target.focus();
    }
  } else {
    if ([UP, DOWN, SPACE].indexOf(e.keyCode) >= 0) {
      select.open();
    }
  }
});

class Select extends Evented {
  constructor(options) {

    super(options);
    this.options = extend({}, Select.defaults, options);
    this.select = this.options.el;

    this.createEventBounds();

    if (typeof this.select.selectInstance !== 'undefined') {
      throw new Error('This element has already been turned into a Select');
    }

    this.update = this.update.bind(this);

    this.setupTarget();
    this.renderTarget();

    this.setupDrop();
    this.renderDrop();

    this.setupSelect();

    this.setupTether();
    this.bindClick();

    this.bindMutationEvents();

    this.value = this.select.value;
  }

  createEventBounds() {

    const self = this;

    this.evnts = {
      target: {
        
        click() {

          if (!self.isOpen()) {
            self.target.focus();
          } else {
            self.target.blur();
          }
        },

        focus() {

          addClass(self.target, 'select-target-focused');
        },

        blur({relatedTarget}) {

          if (self.isOpen()) {
            if (relatedTarget && !self.drop.contains(relatedTarget)) {
              self.close();
            }
          }

          removeClass(self.target, 'select-target-focused');
        },

        deviceClick(e) {

          e.preventDefault();
          self.toggle();
        }
      },

      drop: {
        click(e) {

          if (hasClass(e.target, 'select-option')) {
            self.pickOption(e.target);
          }

          // Built-in selects don't propagate click events in their drop directly
          // to the body, so we don't want to either.
          e.stopPropagation();
        },

        mousemove(e) {

          if (hasClass(e.target, 'select-option')) {
            self.highlightOption(e.target);
          }
        }
      },

      document: {
        click() {

          if (!self.isOpen()) {
            return;
          }

          // Clicking inside dropdown
          if (event.target === self.drop ||
              self.drop.contains(event.target)) {
            return;
          }

          // Clicking target
          if (event.target === self.target ||
              self.target.contains(event.target)) {
            return;
          }

          self.close();
        }
      }
    };
  }

  useNative() {
    const native = this.options.useNative;
    return native === true || (useNative() && native !== false);
  }

  setupTarget() {
    this.target = document.createElement('a');
    this.target.href = 'javascript:;';

    addClass(this.target, 'select-target');

    const tabIndex = this.select.getAttribute('tabindex') || 0;
    this.target.setAttribute('tabindex', tabIndex);

    if (this.options.className) {
      addClass(this.target, this.options.className);
    }

    this.target.selectInstance = this;

    this.target.addEventListener('click', this.evnts.target.click);
    this.target.addEventListener('focus', this.evnts.target.focus);
    this.target.addEventListener('blur', this.evnts.target.blur);

    this.select.parentNode.insertBefore(this.target, this.select.nextSibling);
  }

  setupDrop() {
    this.drop = document.createElement('div');
    addClass(this.drop, 'select');

    if (this.options.className) {
      addClass(this.drop, this.options.className);
    }

    document.body.appendChild(this.drop);

    this.drop.addEventListener('click', this.evnts.drop.click);
    this.drop.addEventListener('mousemove', this.evnts.drop.mousemove);

    this.content = document.createElement('div');
    addClass(this.content, 'select-content');
    this.drop.appendChild(this.content);
  }

  open() {
    addClass(this.target, 'select-open');

    if (this.useNative()) {
      let event = document.createEvent("MouseEvents");
      event.initEvent("mousedown", true, true);
      this.select.dispatchEvent(event);

      return;
    }

    addClass(this.drop, 'select-open');

    setTimeout(() => {
      this.tether.enable();
    });

    const selectedOption = this.drop.querySelector('.select-option-selected');

    if (!selectedOption) {
      return;
    }

    this.highlightOption(selectedOption);
    this.scrollDropContentToOption(selectedOption);

    const positionSelectStyle = () => {
      if (hasClass(this.drop, 'tether-abutted-left') ||
          hasClass(this.drop, 'tether-abutted-bottom')) {
        const dropBounds = getBounds(this.drop);
        const optionBounds = getBounds(selectedOption);

        const offset = dropBounds.top - (optionBounds.top + optionBounds.height);

        this.drop.style.top = `${(parseFloat(this.drop.style.top) || 0) + offset}px`;
      }
    };

    const alignToHighlighted = this.options.alignToHighlighted;
    const {scrollHeight, clientHeight} = this.content;
    if (alignToHighlighted === 'always' || (alignToHighlighted === 'auto' && scrollHeight <= clientHeight)) {
      setTimeout(() => {
        positionSelectStyle();
      });
    }

    this.trigger('open');
  }

  close() {
    removeClass(this.target, 'select-open');

    if (this.useNative()) {
      this.select.blur();
    }

    this.tether.disable();

    removeClass(this.drop, 'select-open');

    this.trigger('close');
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  isOpen() {
    return hasClass(this.drop, 'select-open');
  }

  bindClick() {

    this.target.addEventListener(clickEvent, this.evnts.target.deviceClick);
    document.addEventListener(clickEvent, this.evnts.document.click);
  }

  setupTether() {
    this.tether = new Tether(extend({
      element: this.drop,
      target: this.target,
      attachment: 'top left',
      targetAttachment: 'bottom left',
      classPrefix: 'select',
      constraints: [{
        to: 'window',
        attachment: 'together'
      }]
    }, this.options.tetherOptions));
  }

  renderTarget() {
    this.target.innerHTML = '';

    const options = this.select.querySelectorAll('option');
    for (let i = 0; i < options.length; ++i) {
      const option = options[i];
      if (option.selected) {
        this.target.innerHTML = option.innerHTML;
        break;
      }
    }

    this.target.appendChild(document.createElement('b'));
  }

  renderDrop() {
    let optionList = document.createElement('ul');
    addClass(optionList, 'select-options');

    const options = this.select.querySelectorAll('option');
    for (let i = 0; i < options.length; ++i) {
      let el = options[i];
      let option = document.createElement('li');
      addClass(option, 'select-option');

      option.setAttribute('data-value', el.value);
      option.innerHTML = el.innerHTML;

      if (el.selected) {
        addClass(option, 'select-option-selected');
      }

      optionList.appendChild(option);
    }

    this.content.innerHTML = '';
    this.content.appendChild(optionList);
  }

  update() {
    this.renderDrop();
    this.renderTarget();
  }

  setupSelect() {
    this.select.selectInstance = this;

    addClass(this.select, 'select-select');

    this.select.addEventListener('change', this.update);
  }

  bindMutationEvents() {
    if (typeof window.MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(this.update);
      this.observer.observe(this.select, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true
      });
    } else {
      this.select.addEventListener('DOMSubtreeModified', this.update);
    }
  }

  findOptionsByPrefix(text) {
    let options = this.drop.querySelectorAll('.select-option');

    text = text.toLowerCase();

    return Array.prototype.filter.call(options, (option) => {
      return option.innerHTML.toLowerCase().substr(0, text.length) === text;
    });
  }

  findOptionsByValue(val) {
    let options = this.drop.querySelectorAll('.select-option');

    return Array.prototype.filter.call(options, (option) => {
      return option.getAttribute('data-value') === val;
    });
  }

  getChosen() {
    if (this.isOpen()) {
      return this.drop.querySelector('.select-option-highlight');
    }
    return this.drop.querySelector('.select-option-selected');
  }

  selectOption(option) {
    if (this.isOpen()) {
      this.highlightOption(option);
      this.scrollDropContentToOption(option);
    } else {
      this.pickOption(option, false);
    }
  }

  resetSelection() {
    this.selectOption(this.drop.querySelector('.select-option'));
  }

  highlightOption(option) {
    let highlighted = this.drop.querySelector('.select-option-highlight');
    if (highlighted) {
      removeClass(highlighted, 'select-option-highlight');
    }

    addClass(option, 'select-option-highlight');

    this.trigger('highlight', {option});
  }

  moveHighlight(directionKeyCode) {
    const highlighted = this.drop.querySelector('.select-option-highlight');
    if (!highlighted) {
      this.highlightOption(this.drop.querySelector('.select-option'));
      return;
    }

    const options = this.drop.querySelectorAll('.select-option');

    let highlightedIndex = Array.prototype.indexOf.call(options, highlighted);
    if (!(highlightedIndex >= 0)) {
      return;
    }

    if (directionKeyCode === UP) {
      highlightedIndex -= 1;
    } else {
      highlightedIndex += 1;
    }

    if (highlightedIndex < 0 || highlightedIndex >= options.length) {
      return;
    }

    const newHighlight = options[highlightedIndex];

    this.highlightOption(newHighlight);
    this.scrollDropContentToOption(newHighlight);
  }

  scrollDropContentToOption(option) {
    const {scrollHeight, clientHeight, scrollTop} = this.content;
    if (scrollHeight > clientHeight) {
      const contentBounds = getBounds(this.content);
      const optionBounds = getBounds(option);

      this.content.scrollTop = optionBounds.top - (contentBounds.top - scrollTop);
    }
  }

  selectHighlightedOption() {
    this.pickOption(this.drop.querySelector('.select-option-highlight'));
  }

  pickOption(option, close=true) {
    this.value = this.select.value = option.getAttribute('data-value');
    this.triggerChange();

    if (close) {
      setTimeout(() => {
        this.close();
        this.target.focus();
      });
    }
  }

  triggerChange() {
    let event = document.createEvent("HTMLEvents");
    event.initEvent("change", true, false);
    this.select.dispatchEvent(event);

    this.trigger('change', {value: this.select.value});
  }

  change(val) {
    const options = this.findOptionsByValue(val);

    if (!options.length) {
      throw new Error(`Select Error: An option with the value "${ val }" doesn't exist`);
    }

    this.pickOption(options[0], false);
  }

  init(options={}) {

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => Select.init(options));
      return;
    }

    if (typeof options.selector === 'undefined') {
      options.selector = 'select';
    }

    // this.cached = [];
    const selectors = document.querySelectorAll(options.selector);
    for (let i = 0; i < selectors.length; ++i) {
      const el = selectors[i];
      if (!el.selectInstance) {
        const item = new Select(extend({el}, options));
        // this.cached.push(item);
      }
    }
  }

  removeEvents() {

    this.target.removeEventListener('click', this.evnts.target.click);
    this.target.removeEventListener('focus', this.evnts.target.focus);
    this.target.removeEventListener('blur', this.evnts.target.blur);
    
    this.drop.removeEventListener('click', this.evnts.drop.click);
    this.drop.removeEventListener('mousemove', this.evnts.drop.mousemove);

    this.target.removeEventListener(clickEvent, this.evnts.target.deviceClick);
    document.removeEventListener(clickEvent, this.evnts.document.click);

    this.select.removeEventListener('change', this.update);
  }

  destroy() {

    this.removeEvents();

    this.tether.destroy();

    this.target.remove();
    this.select.remove();
    this.drop.remove();

    delete this.tether;
    delete this.observer;
  }
}

Select.defaults = {
  alignToHighlighed: 'auto',
  className: 'select-theme-default'
};

// Why not using the default class for init/destroy methods?

// Select.init = (options={}) => {
//   if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => Select.init(options));
//     return;
//   }

//   if (typeof options.selector === 'undefined') {
//     options.selector = 'select';
//   }

//   const selectors = document.querySelectorAll(options.selector);
//   for (let i = 0; i < selectors.length; ++i) {
//     const el = selectors[i];
//     if (!el.selectInstance) {
//       new Select(extend({el}, options));
//     }
//   }
// };

// Select.destroy = () => {};