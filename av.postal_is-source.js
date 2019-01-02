/* jQuery.fn.islPostcodeSelect and jQuery.av.postCodes.is  -- (c) 2010 Hugsmiðjan ehf.  @preserve*/
// ----------------------------------------------------------------------------------
// jQuery.fn.islPostcodeSelect and jQuery.av.postCodes.is
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
//  jQuery.av.postCodes.is provides an object map of all icelandic post codes.
//  Example: jQuery.av.postCodes.is['902'] == 'Vestmannaeyjum';
//
//  jQuery.fn.islPostcodeSelect() turns a text input field into a icelandic post code <select> box
//  Example:  jQuery('input.postnumer, div.postnumerfield_parent').islPostcodeSelect();
//
// depends on nothing
(function($,_,p,a,c,k,e,d,pobox){
  pobox=' (pósthólf)';
  a=($.av=$.av||{});
  p=(a.postCodes=a.postCodes||{}).is={};
  d='902;900|Vestmannaeyjum;880|Kirkjubæjarklaustri;870871|Vík;860861|Hvolsvelli;850851|Hellu;845|Flúðum;840|Laugarvatni;825|Stokkseyri;820|Eyrarbakka;816|Ölfus;815|Þorlákshöfn;810|Hveragerði;802;800801|Selfossi;785|Öræfum;780781|Höfn í Hornafirði;765|Djúpavogi;760|Breiðdalsvík;755|Stöðvarfirði;750|Fáskrúðsfirði;740|Neskaupstað;735|Eskifirði;730|Reyðarfirði;720|Borgarfirði (eystri);715|Mjóafirði;710|Seyðisfirði;700701|Egilsstöðum;690|Vopnafirði;685|Bakkafirði;680681|Þórshöfn;675|Raufarhöfn;670671|Kópaskeri;660|Mývatni;650|Laugum;645|Fosshólli;640641|Húsavík;630|Hrísey;625|Ólafsfirði;620621|Dalvík;611|Grímsey;610|Grenivík;603|Akureyri;602;600601|Akureyri;580|Siglufirði;570|Fljótum;565566|Hofsós;560|Varmahlíð;550551|Sauðárkróki;545|Skagaströnd;540541|Blönduósi;530531|Hvammstanga;524|Árneshreppi;520|Drangsnesi;510512|Hólmavík;500|Stað;470471|Þingeyri;465|Bíldudal;460|Tálknafirði;450451|Patreksfirði;430|Suðureyri;425|Flateyri;420|Súðavík;415|Bolungarvík;410|Hnífsdal;400401|Ísafirði;380|Reykhólahreppi;370371|Búðardal;360|Hellissandi;356|Snæfellsbæ;355|Ólafsvík;350|Grundarfirði;345|Flatey á Breiðafirði;340|Stykkishólmi;320|Reykholt í Borgarfirði;310311|Borgarnesi;302;300301|Akranesi;270271276|Mosfellsbæ;260|Reykjanesbæ;250|Garði;245|Sandgerði;240|Grindavík;233235|Reykjanesbæ;232;230|Reykjanesbæ;225|Álftanesi;222;220221|Hafnarfirði;212;210|Garðabæ;203|Kópavogi;202;200201|Kópavogi;190|Vogum;172;170|Seltjarnarnesi;123124125127128129130132150155;101103104105107108109110111112113116121|Reykjavík'
        .split(';');
  k=d.length;
  while(k--){
    e=d[k].split('|');
    c=0;
    while(c<e[0].length){
      p[e[0].substring(c,c+=3)] = e[1]||(_+pobox);
    }
    _=e[1]; // remember last town name
  }

  var protoSel = {},
      postCodeSel;
  $.fn.islPostcodeSelect = function (cfg) {
      cfg = $.extend({
          // noPOBoxes: false,    // true skips display of P.O.Boxes - leaving only acutal places!
          // townField: '.locality,.town,.city'  // default off...
        }, cfg);
      if (this.length)
      {
        var protoName = cfg.noPOBoxes ? 'Short' : 'Long';
        postCodeSel = protoSel[ protoName ];
        if ( !protoSel[ protoName ] )
        {
          postCodeSel = protoSel[ protoName ] = $('<select><option/></select>');
          $.each(
              $.av.postCodes.is,
              function ( code, town ) {
                  if ( !(cfg.noPOBoxes && town.indexOf(pobox)>0) )
                  {
                    $('<option />')
                        .text( code+' - '+town )
                        .val( code )
                        .appendTo( postCodeSel );
                  }
                }
            );
        }
        this.each(function () {
            var cont = $(this),
                input;
            if ( cont.is('input') )
            {
              input = cont;
              cont = input.closest('.fi_txt');
            }
            else
            {
              input = cont.find('input:text:first');
              cont = input.closest('.fi_txt');
            }
            var selectBox = postCodeSel.clone()
                                .val( input.val() )
                                .attr({
                                    name: input.attr('name'),
                                    id:   input.attr('id')
                                  }),
                townField  = cfg.townField;

            // attempt to auto-fill redundant town-name fields - if present...
            if ( townField )
            {
              (townField.charAt ? cont.next(cfg.townField) : townField)
                  .hide()
                  .removeAttr('class')
                  .each(function () {
                      var input = $(this);
                      selectBox
                          .on('change', function (e) {
                              var townName = $.trim(
                                                $(e.target).children(':selected').text().split('-')[1] || ''
                                              );
                              input.add( input.find('input') ).filter('input:text').eq(0).val( townName );
                            });
                    });
            }

            cont
                .removeClass('fi_txt fi_postal_is fi_pnr')
                .addClass('fi_sel postal_is');
            input.replaceWith( selectBox );
          });
      }
      return this;
    };

})(jQuery);

/*
  HOWTO rebuild the postcode list (stored in the `d` variable):

  Go here http://www.postur.is/gogn/Gotuskra/postnumer.txt
  In the console run the following command,
  and copy-paste the resulting string into the `d` variable above:

  // ===========================================================

var compact = [];
document.body.innerHTML
    .replace(/<.+?>/g,'') // strip out HTML <pre> gunk
    .split('\n')          // turn into array
    .slice(1)             // chop off the first row (colum headers)
    // process each line
    .forEach(function(val){
        var isPOBox = /pósthólf|fyrirtækjaþjónusta/.test(val.toLowerCase()),
            v = val.split(';').slice(0,2),
            last = compact[compact.length-1];
        v.push(isPOBox);
        if ( v[0] && v[0] != '102' ) { // skip over empty lines and "102 - millilanda póstur"
          if ( last  &&  last[1]==v[1]  &&  last[2]==v[2] ) {
            last[0] += v[0];
          }
          else {
            compact.push( v );
          }
        }
      });
var output = compact
                .map(function(val){
                    return val[2] ? // if isPOBox
                               val[0]:  // only include the postcodes (town-name then assumed to be the same as last)
                               val[0]+'|'+val[1]; // (join postcodes and townname)
                  })
                .reverse()
                .join(';');
document.body.innerHTML = '<pre>\'' + output.replace(/</g, '&lt;') + '\'</pre>';

  // ===========================================================

Alternative names:

    101;Reykjavík - Miðbær
    103;Reykjavík - Kringlan/Hvassaleiti
    104;Reykjavík - Vogar
    105;Reykjavík - Austubær
    107;Reykjavík - Vesturbær
    108;Reykjavík - Austurbær
    109;Reykjavík - Austurbær
    110;Reykjavík - Bakkar/Seljahverfi
    111;Reykjavík - Ábær/Selás
    112;Reykjavík - Berg/Hólar/Fell
    113;Reykjavík - Grafarvogur
    116;Reykjavík - Grafarholt
    121;Reykjavík - Kjalarnes


*/
