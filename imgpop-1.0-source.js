// Requires:
//  - jQuery 1.2.6 (Runs OK in jQuery 1.3)
//  - eutils  (uses: $.inject() )
// 

(function($){

  $.fn.imgPopper = function () {

    var _fadeSpeed = 250, // set 1 for almost no animation;)
        _navSelectors = 'li.next, li.prev',
        _closeSelectors = 'div.ipopup-container li.close a, div.ipopup-curtain, div.ipopup-container',
        _isOpen = false,
        _ypos = 0,
        _hrefElms = this,
        _curtainTemp = '<div class="ipopup-curtain"></div>',
        _popupTemp = '<div class="ipopup-container">' +
            '<div class="ipopup-container-wrapper">' +
              '<div class="image">' +
                '<span class="img"><img src="%{img}" alt="%{alt}" /></span>' +
                '<strong class="title">%{title}</strong>' +
                '<div class="desc">%{alt}</div>' +
              '</div>' +
              '<div class="paging">' +
                '<div class="status">' +
                  '<strong>Image</strong> ' +
                  '<span><b>%{num}</b> of %{total}</span>' +
                '</div>' +
                '<ul class="stepper">' +
                  '<li class="next"><a href="#">Next</a></li>' +
                  '<li class="prev"><a href="#">Prev</a></li>' +
                  '<li class="close"><a href="#">Close</a></small></li>' +
                '</ul>' +
              '</div>' +
            '</div>' +
          '</div>';

    _hrefElms.bind('click', function (e) {
        var i = _hrefElms.index(this),
            _img = $('img', this)[0],

            _makeHTML = $.inject(_popupTemp, /* html to inject into */ {
                img    : $(this).attr('href'),
                title  : _img.title,
                alt    : _img.alt,
                num    : i+1,
                total  : _hrefElms.length
              }),

            _popup = $(_makeHTML),
            _curtain = $(_curtainTemp);

        $('body')
          .append(_curtain)
          .append(_popup);

        if(!_isOpen) {
          _curtain
              .css('opacity', _curtain.css('opacity'))
              .hide();

          _ypos = $(document).scrollTop() + $(_popup).offset().top;

        }

        _popup.css('top', _ypos).hide();

        if(!_isOpen) {
          _curtain.fadeIn(_fadeSpeed, function(){ _popup.fadeIn(_fadeSpeed); }); // animate in
          _isOpen = true;
        } else {
          _curtain.show();
          _popup.show();
        }

        // next/prev buttons
        $(_navSelectors, _popup)
            .each(function(j){
                var idx = i + (j?-1:1);

                if(idx < 0 || idx >= _hrefElms.length)
                {
                  $(this).addClass('nav-end').bind('click', function (e) { return false; }); // both ends of the popup nav
                }
                else
                {
                  $(this)
                      .bind('click', function (e) {
                          _curtain.remove();
                          _popup.remove();
                          _hrefElms.eq(idx).trigger('click');
                          return false;
                        });
                }
              });
        
        // close popup
        $(_closeSelectors)
            .bind('click', function (e) {
                _popup.fadeOut(_fadeSpeed, function(){
                    _curtain.fadeOut(_fadeSpeed, function(){
                        _popup.remove();
                        _curtain.remove();
                    });
                  }); // animate out
                _isOpen = false;
                return false;
              });
          
        return false;

      });
    return this;
  };
  
})(jQuery);