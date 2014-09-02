(function ($) {
  // TABS CLASS DEFINITION
  //=======================
  
  function Tab(element){
    this.$element = $(element);
    this.$pane = $((this.$element.data("target")));
  }
  
  Tab.prototype.show = function(){
    if(this.$element.hasClass('active')){
      return
    }
    var previous = $(this.$element.parent()).children("li.active")[0];
    if(previous){
      var prevTab = $(previous).data('my.tab');
      if (!(prevTab)){
        $(previous).tab();
      }
      $(previous).data('my.tab').deactivate();
    }
    this.activate();
  };
  
  Tab.prototype.activate = function(){
    this.$element.addClass("active");
    this.$pane.addClass("active");
    this.$element.trigger("show.my.tab");
  };
  
  Tab.prototype.deactivate = function(){
    this.$element.removeClass("active");
    this.$pane.removeClass("active");
    this.$element.trigger("hide.my.tab");
  };
  
  // TABS PLUGIN DEFINITION
  //========================
  
 // The code below adds a 'tab' method to jQuery 
  $.fn.tab = function (option) {
    return this.each(function () {
      // We are using .data to store an instance of the Tab class
      // on the element.
      if(!($(this).data('my.tab'))){
        $(this).data('my.tab', (data = new Tab(this))); 
      }
      // Calling 'show' on the instance of 'Tab' that is stored 
      // in the data under 'my.tab'.
      $(this).data('my.tab').show();
    });
  }
  
  // ADDING FUNCTIONALITY TO THE DOM
  // ================================
  $(document).on('click', '[data-toggle="tab"]', function(e){
    e.preventDefault();
    $(this).tab();
  });
  
})(jQuery);
  
  
