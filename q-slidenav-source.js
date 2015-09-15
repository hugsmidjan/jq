// ----------------------------------------------------------------------------------
// jQuery.fn.slideNav v 1.0
// ----------------------------------------------------------------------------------
// (c) 2011 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

(function($) {

  $.fn.slideNav = function ( cfg ) {
    var $win = $(window);
    var $slNav = this;
    var $slNavBB = $slNav.find('.boxbody').wrap('<div class="bbclip" />');
    var $goBack = $('<div class="goback hidden"><a href="#">Til baka</a></div>').prependTo($slNav);
    var slNavCurrent = $slNav.find('.current').length ? $slNav.find('.current') : $slNav.find('.parent:last');
    var currentLevel = 0;
    var slNavWidth = 0;
    var maxLevel = 1;

    $slNav.find('ul.level1').wrap('<div class="col lvl1" />');

    if (slNavCurrent.length)
    {
      currentLevel = parseInt( slNavCurrent.closest('ul').attr('class').match(/level(\d+)/)[1], 0) - 1;
      slNavCurrent.parents('ul').addClass('active');
    }


    $slNavBB.find('li.branch').each(function () {
        var branch = $(this).find('> ul');
        var branchLevel = parseInt( branch.attr('class').match(/level(\d+)/)[1], 0);

        branch.prepend(
            $('<li class="title" />')
                .addClass( $(this).is('.current') ? 'current' : '' )
                .append( $(this).find('> a').clone() )
          );
        $(this).append( $('<a href="#" class="expand">></a>').data('branch', branch) );

        if ( !$slNavBB.find('.lvl'+branchLevel).length )
        {
          $slNavBB.append('<div class="col lvl'+branchLevel+'" />');
          maxLevel++;
        }

        branch.appendTo( $slNavBB.find('.lvl'+branchLevel) );
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
          }, 150))
        .trigger('resize.slNav');

    $slNavBB
        .on('click', '.expand', function (e) {
            e.preventDefault();
            var branch = $(this).data('branch');
            currentLevel++;

            branch.siblings().removeClass('active');
            branch.addClass('active');
            $slNavBB.css({ left: -(currentLevel*slNavWidth) });
            $goBack.addClass('visible');
          });

    slNavCurrent.find('> .expand').trigger('click');


    $goBack
        .on('click', function (e) {
            e.preventDefault();
            currentLevel--;
            $slNavBB.css({ left: -(currentLevel*slNavWidth) });

            if ( currentLevel === 0 )
            {
              $goBack.removeClass('visible');
            }
          });

    if ( currentLevel > 0 )
    {
      $goBack.addClass('visible');
    }

    return $slNav;
  };

})(jQuery);