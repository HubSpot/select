(function() {
  var currentThemeClassName, init, setupHeroSelect, setupThemeSelect, select, selectHero;

  init = function() {
    setupHeroSelect();
    return setupThemeSelect();
  };

  setupHeroSelect = function() {
    return selectHero = new Select({
      el: $('.hero-select')[0],
      alignToHighlighted: 'always'
    });
  };

  currentThemeClassName = void 0;
  
  setupThemeSelect = function() {
    var $select, $showcase;
    $showcase = $('#themeShowcase');
    $select = $('.themes-select');
    currentThemeClassName = $select.val();
    select = new Select({
      el: $select[0],
      className: currentThemeClassName,
      alignToHighlighted: 'always'
    });
    return $select.on('change', function() {
      var newClassName;
      newClassName = $select.val();
      $([select.drop, select.target, $showcase[0]]).removeClass(currentThemeClassName).addClass(newClassName);
      return currentThemeClassName = newClassName;
    });
  };

  $(init);
  
  setTimeout(() => {
    
    // selectHero.destroy();
    // select.destroy();
  }, 6000);

}).call(this);
