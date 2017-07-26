/* jQuery.fn.slideNav v 1.0  -- (c) 2016 Hugsmiðjan ehf.  @preserve */
// ----------------------------------------------------------------------------------
// (c) 2016 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery
//  - eutils  ( uses: zap(), throttleFn() )

(function($) {

  var slideNav = function ( slideCont, destroy ) {
    var $win = $(window);
    var $slNav = slideCont;
    var cfg = $slNav.data('cfg');
    if ( !cfg ) { return false; }
    var $slNavBB = $slNav.find('.boxbody').wrap('<div class="bbclip" />');
    var $goBack = '<button type="button" class="goback">'+ cfg.backText +'</a>';
    var slNavCurrent = $slNav.find('.current').length ? $slNav.find('.current') : $slNav.find('.parent:last');
    var currentLevel = 0;
    var slNavWidth = 0;
    var maxLevel = 1;

    if ( destroy )
    {
      $win.off('resize.slNav');
      $slNavBB.find(cfg.branch).off('click.slNav', cfg.toggler);

      $slNavBB.find(cfg.branch).find(cfg.toggler).each(function () {
          $(this).after( $(this).data('branch') );
        });

      $slNav.find('.bbclip').zap();
      $slNav.find('.col').zap();
      $slNav.find('.title').remove();
      $slNav.find('.goback').remove();
      $slNav.find('.toggler').remove();
      $slNav.find('[style]').removeAttr('style');
      $slNav.find('ul.active').removeClass('active');

      // handle resize throttle
      setTimeout(function(){
          $slNav.find('[style]').removeAttr('style');
        }, cfg.resizeThrottle);

      return false;
    }

    $slNav.find('ul.level1').addClass('active').wrap('<div class="col lvl1" />');

    if (slNavCurrent.length)
    {
      currentLevel = slNavCurrent.is('.homecurrent') ?
                        0 :
                        parseInt(
                            slNavCurrent
                              .closest( $slNavBB.find(cfg.branch).find('> ul').add($slNavBB.find('.level1'))  )
                                  .attr('class')
                                  .match(/level(\d+)/)[1],
                          10) - 1;
      slNavCurrent.parents('ul').addClass('active');
    }

    $slNavBB.find(cfg.branch).each(function () {
        var branch = $(this).find('> ul');
        var branchLevel = parseInt( branch.attr('class').match(/level(\d+)/)[1], 0);
        var extraClasses = this.className;

        branch.prepend(
            $('<li class="title" />')
                .addClass( $(this).is('.current') ? 'current' : '' )
                .addClass( $(this).is('.parent') ? 'parent' : '' )
                .append( $goBack )
                .append(
                    cfg.linkTitle ?
                        $(this).find('> a').clone() :
                        '<span>'+ ($(this).find('> a').text()) +'</span>'
                  )
          );

        if ( !$slNavBB.find('.lvl'+branchLevel).length )
        {
          $slNavBB.append('<div class="col lvl'+branchLevel+'" />');
          maxLevel++;
        }

        branch.appendTo( $slNavBB.find('.lvl'+branchLevel) );

        if ( cfg.cloneBranchClass )
        {
          extraClasses = $.trim(extraClasses.replace(/(branch|parent|current|first|last)/g,''));
          branch.find('>li').addClass(extraClasses);
        }

        if ( cfg.doTogglers )
        {
          $(this).prepend('<a href="#" class="toggler">></a>');
        }
        $(this).find(cfg.toggler).data('branch', branch);

      });

    $win
        .on('resize.slNav', $.throttleFn(function (e) {
            slNavWidth = $slNav.width();
            $slNavBB.find('.col').width( slNavWidth );
            $slNavBB.addClass('no-animation');
            $slNavBB.css({
                left: -(currentLevel*slNavWidth),
                width: maxLevel*slNavWidth
              });
            setTimeout(function(){
                $slNavBB.removeClass('no-animation');
              }, 10);
          }, cfg.resizeThrottle))
        .trigger('resize.slNav');

    $slNavBB
        .find(cfg.branch)
        .on('click.slNav', cfg.toggler, function (e) {
            e.preventDefault();
            var branch = $(this).data('branch');
            currentLevel++;

            branch.siblings().removeClass('active');
            branch.addClass('active');
            $slNavBB.css({ left: -(currentLevel*slNavWidth) });
          });

    slNavCurrent.find(cfg.toggler).trigger('click');


    $slNavBB
        .on('click.slNav', '.goback', function (e) {
            e.preventDefault();
            currentLevel--;
            $slNavBB.css({ left: -(currentLevel*slNavWidth) });
            setTimeout(function(){
                $slNavBB.find('.col.lvl'+(currentLevel+2)+' .active').removeClass('active');
              }, cfg.slideTime);

          });
  };

  $.fn.slideNav = function(o) {
      var slideElm = this;

      if ( o === 'destroy' )
      {
       slideNav(slideElm, true);
      }
      else
      {
        var defaultCfg = {
              backText: $.lang() === 'is' ? 'Til baka' : 'Go back',
              branch: 'li.branch',
              doTogglers: true,
              toggler: '> a.toggler',
              cloneCatClass: false,
              linkTitle: true,
              resizeThrottle: 150,
              slideTime: 300 // css animate in ms
            };
        var cfg = $.extend(defaultCfg, o);

        $(slideElm).data('cfg', cfg).each(function() {
            slideNav( $(this) );
          });
      }

    return slideElm;
  };

})(jQuery);