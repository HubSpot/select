(function() {
  var DOWN, ENTER, ESCAPE, SPACE, Select, UP, addClass, clickEvent, extend, getBounds, getFocusedSelect, hasClass, lastCharacter, removeClass, searchText, searchTextTimeout, strIsRepeatedCharacter, touchDevice, _ref;

  _ref = Tether.Utils, extend = _ref.extend, addClass = _ref.addClass, removeClass = _ref.removeClass, hasClass = _ref.hasClass, getBounds = _ref.getBounds;

  ENTER = 13;

  ESCAPE = 27;

  SPACE = 32;

  UP = 38;

  DOWN = 40;

  touchDevice = 'ontouchstart' in document.documentElement;

  clickEvent = touchDevice ? 'touchstart' : 'click';

  strIsRepeatedCharacter = function(str) {
    var char, letter, _i, _len;
    if (!(str.length > 1)) {
      return false;
    }
    letter = str.charAt(0);
    for (_i = 0, _len = str.length; _i < _len; _i++) {
      char = str[_i];
      if (char !== letter) {
        return false;
      }
    }
    return true;
  };

  getFocusedSelect = function() {
    var _ref1;
    return (_ref1 = document.querySelector('.select-target-focused')) != null ? _ref1.selectInstance : void 0;
  };

  searchText = '';

  searchTextTimeout = void 0;

  lastCharacter = void 0;

  document.addEventListener('keypress', function(e) {
    var newCharacter, select;
    if (!(select = getFocusedSelect())) {
      return;
    }
    if (e.charCode === 0) {
      return;
    }
    console.log('press', e.charCode);
    newCharacter = String.fromCharCode(e.charCode);
    if (strIsRepeatedCharacter(searchText) && !strIsRepeatedCharacter(searchText + newCharacter)) {
      searchText = newCharacter;
    } else {
      searchText += newCharacter;
      if (lastCharacter === newCharacter) {
        searchText += newCharacter;
      }
    }
    lastCharacter = newCharacter;
    if (e.keyCode === SPACE) {
      e.preventDefault();
    }
    if (select.isOpen()) {
      select.highlightOptionByText(searchText);
    } else {
      select.selectOptionByText(searchText);
    }
    clearTimeout(searchTextTimeout);
    return searchTextTimeout = setTimeout(function() {
      return searchText = '';
    }, 500);
  });

  document.addEventListener('keydown', function(e) {
    var select, _ref1, _ref2;
    if (!(select = getFocusedSelect())) {
      return;
    }
    console.log('down', e.keyCode);
    if ((_ref1 = e.keyCode) === UP || _ref1 === DOWN || _ref1 === ESCAPE) {
      e.preventDefault();
    }
    if (select.isOpen()) {
      switch (e.keyCode) {
        case UP:
        case DOWN:
          return select.moveHighlight(e.keyCode);
        case ENTER:
          return select.selectHighlightedOption();
        case ESCAPE:
          select.close();
          return select.target.focus();
      }
    } else {
      if ((_ref2 = e.keyCode) === UP || _ref2 === DOWN || _ref2 === SPACE) {
        return select.open();
      }
    }
  });

  Select = (function() {
    Select.defaults = {
      alignToHighlighed: 'auto',
      className: 'select-theme-default'
    };

    function Select(options) {
      this.options = options;
      this.options = extend({}, Select.defaults, this.options);
      this.select = this.options.el;
      this.setupTarget();
      this.renderTarget();
      this.setupDrop();
      this.renderDrop();
      this.setupSelect();
      this.setupTether();
      this.bindClick();
    }

    Select.prototype.setupTarget = function() {
      var _this = this;
      this.target = document.createElement('a');
      this.target.href = 'javascript:;';
      addClass(this.target, 'select-target');
      if (this.options.className) {
        addClass(this.target, this.options.className);
      }
      this.target.selectInstance = this;
      this.target.addEventListener('click', function() {
        if (!_this.isOpen()) {
          return _this.target.focus();
        } else {
          return _this.target.blur();
        }
      });
      this.target.addEventListener('focus', function() {
        return addClass(_this.target, 'select-target-focused');
      });
      this.target.addEventListener('blur', function(e) {
        if (_this.isOpen()) {
          if (e.relatedTarget && !_this.drop.contains(e.relatedTarget)) {
            return _this.close();
          }
        } else {
          return removeClass(_this.target, 'select-target-focused');
        }
      });
      this.select.parentNode.insertBefore(this.target, this.select.nextSibling);
      return this.select.style.display = 'none';
    };

    Select.prototype.setupDrop = function() {
      var _this = this;
      this.drop = document.createElement('div');
      addClass(this.drop, 'select');
      if (this.options.className) {
        addClass(this.drop, this.options.className);
      }
      document.body.appendChild(this.drop);
      this.drop.addEventListener('click', function(e) {
        if (hasClass(e.target, 'select-option')) {
          return _this.pickOption(e.target);
        }
      });
      this.drop.addEventListener('mousemove', function(e) {
        if (hasClass(e.target, 'select-option')) {
          return _this.highlightOption(e.target);
        }
      });
      this.content = document.createElement('div');
      addClass(this.content, 'select-content');
      return this.drop.appendChild(this.content);
    };

    Select.prototype.open = function() {
      var positionSelectStyle, selectedOption,
        _this = this;
      addClass(this.drop, 'select-open');
      addClass(this.target, 'select-open');
      setTimeout(function() {
        return _this.tether.enable();
      });
      selectedOption = this.drop.querySelector('.select-option-selected');
      if (!selectedOption) {
        return;
      }
      this.highlightOption(selectedOption);
      this.scrollDropContentToOption(selectedOption);
      positionSelectStyle = function() {
        var dropBounds, offset, optionBounds;
        if (hasClass(_this.drop, 'tether-abutted-left') || hasClass(_this.drop, 'tether-abutted-bottom')) {
          dropBounds = getBounds(_this.drop);
          optionBounds = getBounds(selectedOption);
          offset = dropBounds.top - (optionBounds.top + optionBounds.height);
          return _this.drop.style.top = (parseFloat(_this.drop.style.top) || 0) + offset + 'px';
        }
      };
      if (this.options.alignToHighlighted === 'always' || (this.options.alignToHighlighted === 'auto' && this.content.scrollHeight <= this.content.clientHeight)) {
        return setTimeout(positionSelectStyle);
      }
    };

    Select.prototype.close = function() {
      this.tether.disable();
      removeClass(this.drop, 'select-open');
      removeClass(this.target, 'select-open');
      return removeClass(this.target, 'select-target-focused');
    };

    Select.prototype.toggle = function() {
      if (this.isOpen()) {
        return this.close();
      } else {
        return this.open();
      }
    };

    Select.prototype.isOpen = function() {
      return hasClass(this.drop, 'select-open');
    };

    Select.prototype.bindClick = function() {
      var _this = this;
      this.target.addEventListener(clickEvent, function() {
        return _this.toggle();
      });
      return document.addEventListener(clickEvent, function(event) {
        if (!_this.isOpen()) {
          return;
        }
        if (event.target === _this.drop || _this.drop.contains(event.target)) {
          return;
        }
        if (event.target === _this.target || _this.target.contains(event.target)) {
          return;
        }
        return _this.close();
      });
    };

    Select.prototype.setupTether = function() {
      return this.tether = new Tether({
        element: this.drop,
        target: this.target,
        attachment: 'top left',
        targetAttachment: 'bottom left',
        classPrefix: 'select',
        constraints: [
          {
            to: 'window',
            pin: true,
            attachment: 'together'
          }
        ]
      });
    };

    Select.prototype.renderTarget = function() {
      var option, _i, _len, _ref1;
      this.target.innerHTML = '';
      _ref1 = this.select.querySelectorAll('option');
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        if (option.selected) {
          this.target.innerHTML = option.innerHTML;
          break;
        }
      }
      return this.target.appendChild(document.createElement('b'));
    };

    Select.prototype.renderDrop = function() {
      var el, option, optionList, _i, _len, _ref1;
      optionList = document.createElement('ul');
      addClass(optionList, 'select-options');
      _ref1 = this.select.querySelectorAll('option');
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        el = _ref1[_i];
        option = document.createElement('li');
        addClass(option, 'select-option');
        option.setAttribute('data-value', el.value);
        option.innerHTML = el.innerHTML;
        if (el.selected) {
          addClass(option, 'select-option-selected');
        }
        optionList.appendChild(option);
      }
      this.content.innerHTML = '';
      return this.content.appendChild(optionList);
    };

    Select.prototype.setupSelect = function() {
      var _this = this;
      this.select.selectInstance = this;
      return this.select.addEventListener('change', function() {
        _this.renderDrop();
        return _this.renderTarget();
      });
    };

    Select.prototype.findOptionByText = function(text) {
      var highlightedIndex, highlightedOption, i, isRepeatedCharacter, option, optionText, options, optionsChecked;
      options = this.drop.querySelectorAll('.select-option');
      if (this.isOpen) {
        highlightedOption = this.drop.querySelector('.select-option-highlight');
      } else {
        highlightedOption = this.drop.querySelector('.select-option-selected');
      }
      highlightedIndex = Array.prototype.indexOf.call(options, highlightedOption);
      if (highlightedIndex === -1) {
        highlightedIndex = 0;
      }
      text = text.toLowerCase();
      isRepeatedCharacter = strIsRepeatedCharacter(text);
      i = highlightedIndex;
      if (isRepeatedCharacter) {
        i += 1;
      }
      optionsChecked = 0;
      while (optionsChecked < options.length) {
        if (i >= options.length) {
          i = 0;
        }
        option = options[i];
        optionText = option.innerHTML.toLowerCase();
        if ((isRepeatedCharacter && optionText[0] === text[0]) || optionText.substr(0, text.length) === text) {
          return option;
        }
        optionsChecked += 1;
        i += 1;
      }
    };

    Select.prototype.highlightOptionByText = function(text) {
      var option;
      if (!this.isOpen()) {
        return;
      }
      if (!(option = this.findOptionByText(text))) {
        return;
      }
      this.highlightOption(option);
      return this.scrollDropContentToOption(option);
    };

    Select.prototype.selectOptionByText = function(text) {
      var option;
      if (!(option = this.findOptionByText(text))) {
        return;
      }
      this.select.value = option.getAttribute('data-value');
      return this.triggerChange();
    };

    Select.prototype.highlightOption = function(option) {
      var highlighted;
      highlighted = this.drop.querySelector('.select-option-highlight');
      if (highlighted != null) {
        removeClass(highlighted, 'select-option-highlight');
      }
      return addClass(option, 'select-option-highlight');
    };

    Select.prototype.moveHighlight = function(directionKeyCode) {
      var highlighted, highlightedIndex, newHighlight, options;
      highlighted = this.drop.querySelector('.select-option-highlight');
      if (!highlighted) {
        return this.highlightOption(this.drop.querySelector('.select-option'));
      }
      options = this.drop.querySelectorAll('.select-option');
      highlightedIndex = Array.prototype.indexOf.call(options, highlighted);
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
      newHighlight = options[highlightedIndex];
      this.highlightOption(newHighlight);
      return this.scrollDropContentToOption(newHighlight);
    };

    Select.prototype.scrollDropContentToOption = function(option) {
      var contentBounds, optionBounds;
      if (this.content.scrollHeight > this.content.clientHeight) {
        contentBounds = getBounds(this.content);
        optionBounds = getBounds(option);
        return this.content.scrollTop = optionBounds.top - (contentBounds.top - this.content.scrollTop);
      }
    };

    Select.prototype.selectHighlightedOption = function() {
      return this.pickOption(this.drop.querySelector('.select-option-highlight'));
    };

    Select.prototype.pickOption = function(option) {
      var _this = this;
      this.select.value = option.getAttribute('data-value');
      this.triggerChange();
      return setTimeout(function() {
        _this.close();
        return _this.target.focus();
      });
    };

    Select.prototype.triggerChange = function() {
      var event;
      event = document.createEvent("HTMLEvents");
      event.initEvent("change", true, false);
      return this.select.dispatchEvent(event);
    };

    return Select;

  })();

  window.Select = Select;

}).call(this);
