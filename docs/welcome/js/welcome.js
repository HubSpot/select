(function() {
  var init, setupHeroSelect, setupThemeSelect;

  init = function() {
    setupHeroSelect();
    return setupThemeSelect();
  };

  setupHeroSelect = function() {
    return new Select({
      el: $('.hero-select')[0]
    });
  };

  setupThemeSelect = function() {
    var $select, selectDrop;
    $select = $('.themes-select');
    selectDrop = new Select({
      el: $select[0]
    });
    return $select.change = function() {
      var newClassName;
      return newClassName = $select.val();
    };
  };

  $(init);

}).call(this);
