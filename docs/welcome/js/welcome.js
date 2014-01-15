(function() {
  var currentThemeClassName, init, setupHeroSelect, setupThemeSelect;

  init = function() {
    setupHeroSelect();
    return setupThemeSelect();
  };

  setupHeroSelect = function() {
    return new Select({
      el: $('.hero-select')[0]
    });
  };

  currentThemeClassName = void 0;

  setupThemeSelect = function() {
    var $select, $showcase, select;
    $showcase = $('#themeShowcase');
    $select = $('.themes-select');
    currentThemeClassName = $select.val();
    select = new Select({
      el: $select[0],
      className: currentThemeClassName
    });
    return $select.on('change', function() {
      var newClassName;
      newClassName = $select.val();
      $([select.drop, select.target, $showcase[0]]).removeClass(currentThemeClassName).addClass(newClassName);
      return currentThemeClassName = newClassName;
    });
  };

  $(init);

}).call(this);
