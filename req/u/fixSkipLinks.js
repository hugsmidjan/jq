/*
  fixes this issue: http://terrillthompson.com/blog/161
  Limitations:
    * Must always run last.
    * May cause unwanted scroll+focus in situations
      where multiple jQuery instances are running.
    * Nicely tolerant of multiple invocations
      (always unbinds the event from last run)
  Usage:
    $.fixSkiplinks();
    $.fixSkiplinks({ offset:40 }); // scroll offset/correction in px
    $.fixSkiplinks({ offset:function(target){ return 40; }  });
*/
var $ = window.jQuery;

$.fixSkiplinks = function (opts) {
  var clickEv = 'click.fixSkipLinks';
  var doc = document;
  var docLoc = doc.location;
  var offsetFn =  !opts || opts.offset == null ?
                      $.scrollOffset:
                  opts.offset.apply ?
                      opts.offset:
                      function () { return opts.offset; };
  $(doc)
      .off(clickEv)
      .on(clickEv, function (e) {
        if ( e.target.href ) {
          var hrefBits = e.target.href.split('#');
          var id = hrefBits[1];
          if ( id  &&  !e.isDefaultPrevented() ) {
            var elm = $(doc.getElementById( id ));
            if ( elm[0]  &&  hrefBits[0] === docLoc.href.split('#')[0] ) {
              e.preventDefault();
              var hadNoTabindex = elm.attr('tabindex') == null;
              if ( hadNoTabindex ) {
                elm.attr('tabindex', -1);
              }
              docLoc.href = '#'+id;
              var offset = offsetFn(elm);
              if ( offset ) {
                setTimeout(function () {
                  doc.body.scrollTop -= offset;
                  doc.documentElement.scrollTop -= offset;
                  elm[0].focus();
                  elm[0].blur();
                  if ( hadNoTabindex ) {
                    setTimeout(function () { elm.removeAttr('tabindex'); }, 0);
                  }
                }, 0);
              }
            }
          }
        }
      });
  // // NOTE: this will fuck up page loads where tabswitcher scripts are present, etc.
  var currentHash = docLoc.hash.replace(/^#/,'');
  var elm = currentHash && document.getElementById(currentHash);
  var elmTop = elm && elm.getBoundingClientRect().top;
  if ( elmTop != null ) {
    var overShot = offsetFn() - elmTop;
    if ( overShot > 0 ) {
      doc.body.scrollTop -= overShot;
      doc.documentElement.scrollTop -= overShot;
    }
  }
};

// $.focusOffset provides a default scroll-offset value for navigation-related scroll-position calculations
// esp. useful when pages have a fixed-position header
$.scrollOffset = function (/*elm*/) { return 0; };
