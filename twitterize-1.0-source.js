/// encoding: utf-8
// ----------------------------------------------------------------------------------
// jquery.twitterize.js  v. 1.0
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//  * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Uses code from http://twitter.com/javascripts/blogger.js

//create global variables
window.twitterCallback2 = '';
window.relative_time = '';

(function($) {

  $.twitterize = {
    defaults: {
      userName: null,
      numTweets: 5,
      linkToProfile: false,
      displayRetweets : true
    },
    i18n: {
      is: {
        loaderText: 'Hleður tístum...',
        about: 'Fyrir um ',
        ltmin: 'Fyrir minna en mínútu síðan',
        minago: 'um mínútu síðan',
        minsago: ' mínútum síðan',
        hrago: 'klukkutíma síðan',
        hrsago: ' klukkutímum síðan',
        dayago: ' degi síðan',
        daysago: ' dögum síðan'
      },
      en: {
        loaderText: 'Loading tweets...',
        about: 'About ',
        ltmin: 'less than a minute ago',
        minago: 'a minute ago',
        minsago: ' minutes ago',
        hrago: 'an hour ago',
        hrsago: ' hours ago',
        dayago: ' day ago',
        daysago: ' days ago'
      }
    }
  };

  // BEGIN: http://twitter.com/javascripts/blogger.js
  twitterCallback2 = function(twitters) {
    var statusHTML = [],
        i=0;
    for (i; i<twitters.length; i++){
      var username = twitters[i].user.screen_name,
          status = twitters[i].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
        return '<a href="'+url+'">'+url+'</a>';
      }).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
        return  reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'">'+reply.substring(1)+'</a>';
      });
      statusHTML.push('<li><span>'+status+'</span> <a target="_blank" class="timestamp" href="http://twitter.com/'+username+'/status/'+twitters[i].id_str+'">'+relative_time(twitters[i].created_at)+'</a></li>');
    }
    document.getElementById('twitter_update_list').innerHTML = statusHTML.join('');
  };

  relative_time = function(time_value) {
    var values = time_value.split(' '),
        i18n = $.twitterize.i18n[$.lang()] || $.twitterize.en;
    time_value = values[1] + ' ' + values[2] + ', ' + values[5] + " " + values[3];
    var parsed_date = Date.parse(time_value),
        relative_to = (arguments.length > 1) ? arguments[1] : new Date(),
        delta = parseInt((relative_to.getTime() - parsed_date) / 1000, 10);
    delta = delta + (relative_to.getTimezoneOffset() * 60);

    if (delta < 60) {
      return i18n.ltmin;
    } else if(delta < 120) {
      return i18n.about + i18n.minago;
    } else if(delta < (60*60)) {
      return i18n.about + (parseInt(delta / 60, 10)).toString() + i18n.minsago;
    } else if(delta < (120*60)) {
      return i18n.about + i18n.hrago;
    } else if(delta < (24*60*60)) {
      return i18n.about + (parseInt(delta / 3600, 10)).toString() + i18n.hrsago;
    } else if(delta < (48*60*60)) {
      return i18n.about + '1' + i18n.dayago;
    } else {
      var daysago = (parseInt(delta / 86400, 10)).toString();
      if ( daysago.charAt(daysago.length - 1) === '1' ) {
        return i18n.about + daysago + i18n.dayago;
      } else {
        return i18n.about + daysago + i18n.daysago;
      }
    }
  };
  // END: http://twitter.com/javascripts/blogger.js


  $.fn.twitterize = function(o) {

    var i18n = $.twitterize.i18n[$.lang()] || $.twitterize.en,
        dc = $.twitterize.defaults;
    o = $.extend({}, dc, i18n, o);

    return this.each(function() {
        var c = $(this),
            preload = $('<p class="preLoader">'+o.loaderText+'</p>');

        c.addClass('twitter-active').append('<ul id="twitter_update_list" />').append(preload);

        // add Twitter profile link to container element
        if (o.linkToProfile) {
          var profileLinkHTML = '<p class="profile"><a href="http://twitter.com/'+ o.userName +'">http://twitter.com/'+ o.userName +'</a></p>';
          c.append(profileLinkHTML);
        }

        $.getScript('https://api.twitter.com/1/statuses/user_timeline.json?screen_name='+ o.userName +'&count='+ o.numTweets + '&include_rts='+ o.displayRetweets +'&callback=twitterCallback2', function() { preload.remove(); });


      });
  };



})(jQuery);