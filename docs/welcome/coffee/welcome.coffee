init = ->
    setupHeroSelect()
    setupThemeSelect()

setupHeroSelect = ->
    new Select el: $('.hero-select')[0]

setupThemeSelect = ->
    $select = $('.themes-select')
    selectDrop = new Select el: $select[0]

    $select.change = ->
        newClassName = $select.val()
        # ....
        # selectDrop.$drop

$ init