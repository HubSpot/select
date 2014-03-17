{extend, addClass, removeClass, hasClass, getBounds, Evented} = Tether.Utils

ENTER = 13
ESCAPE = 27
SPACE = 32
UP = 38
DOWN = 40

touchDevice = 'ontouchstart' of document.documentElement
clickEvent = if touchDevice then 'touchstart' else 'click'

useNative = ->
  touchDevice and (innerWidth <= 640 or innerHeight <= 640)

isRepeatedChar = (str) ->
  Array::reduce.call str, (a, b) ->
    if a is b then b else false

getFocusedSelect = ->
  document.querySelector('.select-target-focused')?.selectInstance

searchText = ''
searchTextTimeout = undefined

lastCharacter = undefined

document.addEventListener 'keypress', (e) ->
  return unless select = getFocusedSelect()
  return if e.charCode is 0

  if e.keyCode is SPACE
    e.preventDefault()

  clearTimeout searchTextTimeout
  searchTextTimeout = setTimeout ->
    searchText = ''
  , 500

  searchText += String.fromCharCode e.charCode

  options = select.findOptionsByPrefix(searchText)

  if options.length is 1
    # We have an exact match, choose it
    select.selectOption options[0]
    return

  if searchText.length > 1 and isRepeatedChar(searchText)
    # They hit the same char over and over, maybe they want to cycle through
    # the options that start with that char
    repeatedOptions = select.findOptionsByPrefix(searchText[0])
    
    if repeatedOptions.length
      selected = repeatedOptions.indexOf select.getChosen()

      # Pick the next thing (if something with this prefix wasen't selected we'll end up with the first option)
      selected += 1
      selected = selected % repeatedOptions.length

      select.selectOption repeatedOptions[selected]
      return

  if options.length
    # We have multiple things that start with this prefix.  Based on the behavior of native select,
    # this is considered after the repeated case.
    select.selectOption options[0]
    return

  # No match at all, do nothing
  
document.addEventListener 'keydown', (e) ->
  # We consider this independently of the keypress handler so we can intercept keys that have
  # built-in functions.
  return unless select = getFocusedSelect()

  if e.keyCode in [UP, DOWN, ESCAPE]
    e.preventDefault()

  if select.isOpen()
    switch e.keyCode
      when UP, DOWN
        select.moveHighlight e.keyCode
      when ENTER
        select.selectHighlightedOption()
      when ESCAPE
        select.close()
        select.target.focus()
  else
    if e.keyCode in [UP, DOWN, SPACE]
      select.open()

class Select extends Evented
  @defaults:
    alignToHighlighed: 'auto'
    className: 'select-theme-default'

  constructor: (@options) ->
    @options = extend {}, Select.defaults, @options
    @select = @options.el

    if @select.selectInstance?
      throw new Error "This element has already been turned into a Select"

    @setupTarget()
    @renderTarget()

    @setupDrop()
    @renderDrop()

    @setupSelect()
    
    @setupTether()
    @bindClick()

    @bindMutationEvents()

    @value = @select.value

  useNative: ->
    @options.useNative is true or (useNative() and @options.useNative isnt false)

  setupTarget: ->
    @target = document.createElement 'a'
    @target.href = 'javascript:;'

    addClass @target, 'select-target'

    tabIndex = @select.getAttribute('tabindex') or 0
    @target.setAttribute 'tabindex', tabIndex

    if @options.className
      addClass @target, @options.className

    @target.selectInstance = @

    @target.addEventListener 'click', =>
      if not @isOpen()
        @target.focus()
      else
        @target.blur()

    @target.addEventListener 'focus', =>
      addClass @target, 'select-target-focused'

    @target.addEventListener 'blur', (e) =>
      if @isOpen()
        if e.relatedTarget and not @drop.contains(e.relatedTarget)
          @close()

      removeClass @target, 'select-target-focused'

    @select.parentNode.insertBefore(@target, @select.nextSibling)

  setupDrop: ->
    @drop = document.createElement 'div'
    addClass @drop, 'select'

    if @options.className
      addClass @drop, @options.className

    document.body.appendChild @drop

    @drop.addEventListener 'click', (e) =>
      if hasClass(e.target, 'select-option')
        @pickOption e.target

      # Built-in selects don't propagate click events in their drop directly to
      # the body, so we don't want to either.
      e.stopPropagation()

    @drop.addEventListener 'mousemove', (e) =>
      if hasClass(e.target, 'select-option')
        @highlightOption e.target

    @content = document.createElement 'div'
    addClass @content, 'select-content'
    @drop.appendChild @content

  open: ->
    addClass @target, 'select-open'

    if @useNative()
      @select.style.display = 'block'

      setTimeout =>
        event = document.createEvent("MouseEvents")
        event.initEvent("mousedown", true, true)
        @select.dispatchEvent event

      return

    addClass @drop, 'select-open'

    setTimeout =>
      @tether.enable()

    selectedOption = @drop.querySelector('.select-option-selected')

    return unless selectedOption

    @highlightOption selectedOption
    @scrollDropContentToOption selectedOption

    positionSelectStyle = =>
      if hasClass(@drop, 'tether-abutted-left') or hasClass(@drop, 'tether-abutted-bottom')
        dropBounds = getBounds @drop
        optionBounds = getBounds selectedOption

        offset = dropBounds.top - (optionBounds.top + optionBounds.height)

        @drop.style.top = (parseFloat(@drop.style.top) or 0) + offset + 'px'

    if @options.alignToHighlighted is 'always' or (@options.alignToHighlighted is 'auto' and @content.scrollHeight <= @content.clientHeight)
      setTimeout positionSelectStyle

    @trigger 'open'

  close: ->
    removeClass @target, 'select-open'

    if @useNative()
      @select.style.display = 'none'
      return

    @tether.disable()

    removeClass @drop, 'select-open'

    @trigger 'close'

  toggle: ->
    if @isOpen()
      @close()
    else
      @open()

  isOpen: ->
    hasClass @drop, 'select-open'

  bindClick: ->
    @target.addEventListener clickEvent, (e) =>
      e.preventDefault()
      @toggle()

    document.addEventListener clickEvent, (event) =>
      return unless @isOpen()

      # Clicking inside dropdown
      if event.target is @drop or @drop.contains(event.target)
        return

      # Clicking target
      if event.target is @target or @target.contains(event.target)
        return

      @close()

  setupTether: ->
    @tether = new Tether
      element: @drop
      target: @target
      attachment: 'top left'
      targetAttachment: 'bottom left'
      classPrefix: 'select'
      constraints: [
        to: 'window'
        attachment: 'together'
      ]

  renderTarget: ->
    @target.innerHTML = ''

    for option in @select.querySelectorAll('option')
      if option.selected
        @target.innerHTML = option.innerHTML
        break

    @target.appendChild document.createElement 'b'

  renderDrop: ->
    optionList = document.createElement 'ul'
    addClass optionList, 'select-options'

    for el in @select.querySelectorAll('option')
      option = document.createElement 'li'
      addClass option, 'select-option'

      option.setAttribute 'data-value', el.value
      option.innerHTML = el.innerHTML

      if el.selected
        addClass option, 'select-option-selected'

      optionList.appendChild option

    @content.innerHTML = ''
    @content.appendChild optionList

  update: =>
    @renderDrop()
    @renderTarget()

  setupSelect: ->
    @select.selectInstance = @

    addClass @select, 'select-select'

    @select.addEventListener 'change', @update

  bindMutationEvents: ->
    if window.MutationObserver?
      @observer = new MutationObserver @update
      @observer.observe @select,
        childList: true
        attributes: true
        characterData: true
        subtree: true
    else
      @select.addEventListener 'DOMSubtreeModified', @update

  findOptionsByPrefix: (text) ->
    options = @drop.querySelectorAll('.select-option')

    text = text.toLowerCase()

    Array::filter.call options, (option) ->
      option.innerHTML.toLowerCase().substr(0, text.length) is text

  findOptionsByValue: (val) ->
    options = @drop.querySelectorAll('.select-option')

    Array::filter.call options, (option) ->
      option.getAttribute('data-value') is val

  getChosen: ->
    if @isOpen()
      @drop.querySelector('.select-option-highlight')
    else
      @drop.querySelector('.select-option-selected')

  selectOption: (option) ->
    if @isOpen()
      @highlightOption option
      @scrollDropContentToOption option
    else
      @pickOption option, false

  resetSelection: ->
    @selectOption @drop.querySelector('.select-option')

  highlightOption: (option) ->
    highlighted = @drop.querySelector('.select-option-highlight')
    if highlighted?
      removeClass highlighted, 'select-option-highlight'

    addClass option, 'select-option-highlight'

    @trigger 'highlight', {option}

  moveHighlight: (directionKeyCode) ->
    unless highlighted = @drop.querySelector('.select-option-highlight')
      @highlightOption @drop.querySelector('.select-option')
      return

    options = @drop.querySelectorAll('.select-option')

    highlightedIndex = Array::indexOf.call options, highlighted
    return unless highlightedIndex >= 0

    if directionKeyCode is UP
      highlightedIndex -= 1
    else
      highlightedIndex += 1

    if highlightedIndex < 0 or highlightedIndex >= options.length
      return

    newHighlight = options[highlightedIndex]

    @highlightOption newHighlight
    @scrollDropContentToOption newHighlight

  scrollDropContentToOption: (option) ->
    if @content.scrollHeight > @content.clientHeight
      contentBounds = getBounds @content
      optionBounds = getBounds option

      @content.scrollTop = optionBounds.top - (contentBounds.top - @content.scrollTop)

  selectHighlightedOption: ->
    @pickOption @drop.querySelector('.select-option-highlight')

  pickOption: (option, close=true) ->
    @value = @select.value = option.getAttribute 'data-value'
    @triggerChange()

    if close
      setTimeout =>
        @close()
        @target.focus()

  triggerChange: ->
    event = document.createEvent("HTMLEvents")
    event.initEvent("change", true, false)
    @select.dispatchEvent event

    @trigger 'change', {value: @select.value}

  change: (val) ->
    options = @findOptionsByValue val

    if not options.length
      throw new Error "Select Error: An option with the value \"#{ val }\" doesn't exist"

    @pickOption options[0], false

Select.init = (options={}) ->
  if document.readyState is 'loading'
    document.addEventListener 'DOMContentLoaded', -> Select.init(options)
    return

  options.selector ?= 'select'

  for el in document.querySelectorAll(options.selector)
    if not el.selectInstance
      new Select extend {el}, options

window.Select = Select
