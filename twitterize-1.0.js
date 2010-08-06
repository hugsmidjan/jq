/// encoding: utf-8
// ----------------------------------------------------------------------------------
// jquery.twitterize.js  v. 1.0
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//  * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Based on http://coda.co.za/content/projects/jquery.twitter/jquery.twitter.js
//   and uses http://twitter.com/javascripts/blogger.js

// BEGIN: http://twitter.com/javascripts/blogger.js
function twitterCallback2(twitters) {
  var statusHTML = [];
  for (var i=0; i<twitters.length; i++){
    var username = twitters[i].user.screen_name,
        status = twitters[i].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
      return '<a href="'+url+'">'+url+'</a>';
    }).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
      return  reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'">'+reply.substring(1)+'</a>';
    });
    statusHTML.push('<li><span>'+status+'</span> <a class="timestamp" href="http://twitter.com/'+username+'/statuses/'+twitters[i].id+'">'+relative_time(twitters[i].created_at)+'</a></li>');
  }
  document.getElementById('twitter_update_list').innerHTML = statusHTML.join('');
}

function relative_time(time_value) {
  var values = time_value.split(" ");
  time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
  var parsed_date = Date.parse(time_value),
      relative_to = (arguments.length > 1) ? arguments[1] : new Date(),
      delta = parseInt((relative_to.getTime() - parsed_date) / 1000, 10);
  delta = delta + (relative_to.getTimezoneOffset() * 60);

  if (delta < 60) {
    return 'Fyrir minna en mínútu síðan';
  } else if(delta < 120) {
    return 'Fyrir um mínútu síðan';
  } else if(delta < (60*60)) {
    return 'Fyrir um' + (parseInt(delta / 60, 10)).toString() + ' mínútum síðan';
  } else if(delta < (120*60)) {
    return 'Fyrir um klukkutíma síðan';
  } else if(delta < (24*60*60)) {
    return 'Fyrir um ' + (parseInt(delta / 3600, 10)).toString() + ' klukkutímum síðan';
  } else if(delta < (48*60*60)) {
    return 'Fyrir 1 degi';
  } else {
    var daysago = (parseInt(delta / 86400, 10)).toString();
    if ( daysago.charAt(daysago.length - 1) === '1' ) {
      return 'Fyrir ' + daysago + ' degi síðan';
    } else {
      return 'Fyrir ' + daysago + ' dögum síðan';
    }
  }
}
// END: http://twitter.com/javascripts/blogger.js


(function($) {
  
  $.fn.twitterize = function(o) {

    var o = $.extend({}, $.fn.twitterize.defaults, o);

    return this.each(function() {
        var c = $(this),
            preload = $('<p class="preLoader">'+o.loaderText+'</p>');

        c.addClass('twitter-active').append('<ul id="twitter_update_list" />').append(preload);

        // add Twitter profile link to container element
        if (o.linkToProfile) {
          var profileLinkHTML = '<p class="profile"><a href="http://twitter.com/'+ o.userName +'">http://twitter.com/'+ o.userName +'</a></p>';
          c.append(profileLinkHTML);
        }

        $.getScript('http://twitter.com/statuses/user_timeline/'+ o.userName +'.json?callback=twitterCallback2&count='+ o.numTweets, function() { preload.remove() });
        
      });
  };

  $.fn.twitterize.defaults = {
      userName: null,
      numTweets: 5,
      loaderText: "Hleður tístum...",
      linkToProfile: false
    };

})(jQuery);