/*
  array.sortISL.js -- (c) 2014 Hugsmiðjan ehf. - MIT/GPL
  Written by Már Örlygsson - http://mar.anomy.net

  Original at: https://gist.github.com/maranomynet/9972930

  Sorts arrays in Icelandic alphabetical order.
  Accepts an optional function for extracting the property/text to sort by.

  Example usage:

      var arr = ['1','Á','ö','bá','be','$ff','af','að','ad','ý','y'];
      arr.sortISL();
      alert( arr.join('\n') );

      // use jQuery to select <tr> elements to sort
      // and convert them to an Array
      var tRows = jQuery('tbody tr').toArray();

      // sort the array in Icelandic alphabetical order
      // by the text-value of each row's second <td> cell.
      tRows.sortISL(function(item){
          return $(item).find('td:eq(1)').text()
        });

      // re-inject the sorted rows into table.
      $(tRows[0].parentNode)
          .append( tRows );

*/
(function(){
    var abcIdx = {};
    var abc = '| -0123456789aáàâäåbcdðeéèêëfghiíîïjklmnoóôpqrstuúùüvwxyýÿzþæö'; // prepend list with '|' to guarantee that abc.indexOf(chr) never returns 0 (falsy)
    var getAbcText = function(text){
            var idxStr = '';
            text = (text.trim ? text.trim() : text.replace(/^\s+|\s+$/g,''))
                      .replace(/[\/.,()]/g, '') // remove punctutation
                      .replace(/\s*-\s*/g,'-')  // normalize spacing around dashes
                      .replace(/(_|\s)+/g,' ')  // normalize/collapse space-characters
                      .toLowerCase();           // lowercase
            var len = text.length;
            var i = 0;
            while ( i < len )
            {
              var chr = text.charAt(i);
              var chrCode = abcIdx[chr];
              if ( !chrCode )
              {
                var idx = abc.indexOf(chr);
                idx = idx>-1 ? 32+idx : 99+chr.charCodeAt(0);
                chrCode = abcIdx[chr] = String.fromCharCode( idx );
              }
              idxStr += chrCode;
              i++;
            }
            return idxStr;
          };

   Array.prototype.sortISL = function( getProp ){
      getProp = getProp || function (item) { return ''+item; };
      var arr = this;
      var tempArr = [];
      var len = arr.length;
      var i = 0;
      while ( i<len )
      {
        tempArr[i] = [ getAbcText(getProp( arr[i] )), arr[i] ];
        i++;
      }
      tempArr.sort(function (a,b) {
          return a[0]===b[0] ? 0 : a[0]>b[0] ? 1 : -1;
        });
      i = 0;
      while ( i<len )
      {
        arr[i] = tempArr[i][1];
        i++;
      }
      return arr;
    };

})();
