init = ->
    setupHeroSelect()
    setupThemeSelect()

setupHeroSelect = ->
    new Select el: $('.hero-select')[0]

currentThemeClassName = undefined
setupThemeSelect = ->
    $showcase = $ '#themeShowcase'
    $select = $ '.themes-select'
    currentThemeClassName = $select.val()
    select = new Select
        el: $select[0]
        className: currentThemeClassName

    $select.on 'change', ->
        newClassName = $select.val()
        $([select.drop, select.target, $showcase[0]]).removeClass(currentThemeClassName).addClass(newClassName)
        currentThemeClassName = newClassName

$ init
