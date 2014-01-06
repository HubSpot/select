{extend, addClass, removeClass, hasClass, getBounds} = Tether.Utils

ENTER = 13
ESCAPE = 27
SPACE = 32
UP = 38
DOWN = 40

touchDevice = 'ontouchstart' of document.documentElement
clickEvent = if touchDevice then 'touchstart' else 'click'

strIsRepeatedCharacter = (str) ->
    return false unless str.length > 1

    letter = str.charAt 0
    for char in str
        return false if char isnt letter
    return true

getFocusedSelect = ->
    document.querySelector('.select-target-focused')?.selectInstance

searchText = ''
searchTextTimeout = undefined

lastCharacter = undefined

document.addEventListener 'keypress', (e) ->
    return unless select = getFocusedSelect()

    return if e.charCode is 0

    newCharacter = String.fromCharCode e.charCode

    if strIsRepeatedCharacter(searchText) and not strIsRepeatedCharacter(searchText + newCharacter)
        searchText = newCharacter
    else
        searchText += newCharacter
        searchText += newCharacter if lastCharacter is newCharacter

    lastCharacter = newCharacter

    if e.keyCode is SPACE
        e.preventDefault()

    if select.isOpen()
        select.highlightOptionByText searchText
    else
        select.selectOptionByText searchText

    clearTimeout searchTextTimeout
    searchTextTimeout = setTimeout ->
        searchText = ''
    , 500

document.addEventListener 'keydown', (e) ->
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

class Select

    @defaults:
        alignToHighlighed: 'auto'
        className: 'select-theme-default'

    constructor: (@options) ->
        @options = extend {}, Select.defaults, @options
        @select = @options.el

        @setupTarget()
        @renderTarget()

        @setupDrop()
        @renderDrop()

        @setupSelect()
        
        @setupTether()
        @bindClick()

    setupTarget: ->
        @target = document.createElement 'a'
        @target.href = 'javascript:;'

        addClass @target, 'select-target'
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
            else
                removeClass @target, 'select-target-focused'

        @select.parentNode.insertBefore(@target, @select.nextSibling)
        
        # TODO: Do with a class?
        @select.style.display = 'none'

    setupDrop: ->
        @drop = document.createElement 'div'
        addClass @drop, 'select'

        if @options.className
            addClass @drop, @options.className

        document.body.appendChild @drop

        @drop.addEventListener 'click', (e) =>
            if hasClass(e.target, 'select-option')
                @pickOption e.target

        @drop.addEventListener 'mousemove', (e) =>
            if hasClass(e.target, 'select-option')
                @highlightOption e.target

        @content = document.createElement 'div'
        addClass @content, 'select-content'
        @drop.appendChild @content

    open: ->
        addClass @drop, 'select-open'
        addClass @target, 'select-open'

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

    close: ->
        @tether.disable()

        removeClass @drop, 'select-open'
        removeClass @target, 'select-open'
        removeClass @target, 'select-target-focused'

    toggle: ->
        if @isOpen()
            @close()
        else
            @open()

    isOpen: ->
        hasClass @drop, 'select-open'

    bindClick: ->
        @target.addEventListener clickEvent, => @toggle()

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
                pin: true
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

    setupSelect: ->
        @select.selectInstance = @

        @select.addEventListener 'change', =>
            @renderDrop()
            @renderTarget()

    findOptionByText: (text) ->
        options = @drop.querySelectorAll('.select-option')
        if @isOpen
            highlightedOption = @drop.querySelector('.select-option-highlight')
        else
            highlightedOption = @drop.querySelector('.select-option-selected')

        highlightedIndex = Array::indexOf.call options, highlightedOption
        if highlightedIndex is -1
            highlightedIndex = 0

        text = text.toLowerCase()

        isRepeatedCharacter = strIsRepeatedCharacter text
        i = highlightedIndex
        i += 1 if isRepeatedCharacter

        optionsChecked = 0

        while optionsChecked < options.length
            i = 0 if i >= options.length
            option = options[i]

            optionText = option.innerHTML.toLowerCase()

            if (isRepeatedCharacter and optionText[0] is text[0]) or optionText.substr(0, text.length) is text
                return option

            optionsChecked += 1
            i += 1

    highlightOptionByText: (text) ->
        return unless @isOpen()
        return unless option = @findOptionByText text

        @highlightOption option
        @scrollDropContentToOption option

    selectOptionByText: (text) ->
        return unless option = @findOptionByText text
            
        @select.value = option.getAttribute('data-value')
        @triggerChange()

    highlightOption: (option) ->
        highlighted = @drop.querySelector('.select-option-highlight')
        if highlighted?
            removeClass highlighted, 'select-option-highlight'

        addClass option, 'select-option-highlight'

    moveHighlight: (directionKeyCode) ->
        highlighted = @drop.querySelector('.select-option-highlight')

        if not highlighted
            return @highlightOption @drop.querySelector('.select-option')

        options = @drop.querySelectorAll('.select-option')

        highlighedIndex = Array::indexOf.call options, highlighted
        return unless highlighedIndex >= 0

        if directionKeyCode is UP
            highlighedIndex -= 1
        else
            highlightedIndex += 1

        if highlighedIndex < 0 or highlightedIndex >= options.length
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

    pickOption: (option) ->
        @select.value = option.getAttribute 'data-value'
        @triggerChange()

        setTimeout =>
            @close()
            @target.focus()

    triggerChange: ->
        event = document.createEvent("HTMLEvents")
        event.initEvent("change", true, false)
        @select.dispatchEvent event

window.Select = Select
