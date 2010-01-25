// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.linkify v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmi�jan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * M�r �rlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

(function($){

  var url1 = /(^|"|&lt;|\s)(www\..+?\..+?)(\s|&gt;|"|$)/g,
      url2 = /(^|"|&lt;|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|"|$)/g;

  $.fn.linkify = function () {
    return this.each(function () {
      var childNodes = this.childNodes,
          i = childNodes.length;
      while(i--)
      {
        var n = childNodes[i];
        if (n.nodeType == 3) {
          var html = n.nodeValue;
          if (/\S/.test(html))
          {
            html = html.replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;')
                       .replace(url1, "$1<a href='http://$2'>$2</a>$3")
                       .replace(url2, "$1<a href='$2'>$2</a>$5");
            $(n).after(html).remove();
          }
        }
        else if (n.nodeType == 1  &&  !/^(a|button|textarea)$/i.test(n.tagName)) {
          arguments.callee.call(n);
        }
      };
    });
  };

})(jQuery);


/* Usage:

  jQuery('.articlebody').linkify();

*/