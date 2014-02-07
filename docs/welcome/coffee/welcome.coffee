init = ->
    setupHeroSelect()
    setupThemeSelect()

setupHeroSelect = ->
    new Select
        el: $('.hero-select')[0]
        alignToHighlighted: 'always'

currentThemeClassName = undefined
setupThemeSelect = ->
    $showcase = $ '#themeShowcase'
    $select = $ '.themes-select'
    currentThemeClassName = $select.val()
    select = new Select
        el: $select[0]
        className: currentThemeClassName
        alignToHighlighted: 'always'

    $select.on 'change', ->
        newClassName = $select.val()
        $([select.drop, select.target, $showcase[0]]).removeClass(currentThemeClassName).addClass(newClassName)
        currentThemeClassName = newClassName

$ init
