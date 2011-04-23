/// encoding: utf-8
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
(function($,p,a,c,k,e,d){
  a=($.av=$.av||{});
  p=(a.postCodes=a.postCodes||{}).is={};
  d='900902|Vestmannaeyjum;880|Kirkjubæjarklaustri;870871|Vík;860861|Hvolsvelli;850851|Hellu;845|Flúðum;840|Laugarvatni;825|Stokkseyri;820|Eyrarbakka;815816|Þorlákshöfn;810|Hveragerði;800801802|Selfossi;785|Öræfum;780781|Höfn í Hornafirði;765|Djúpavogi;760|Breiðdalsvík;755|Stöðvarfirði;750|Fáskrúðsfirði;740|Neskaupstað;735|Eskifirði;730|Reyðarfirði;720|Borgarfirði (eystri);715|Mjóafirði;710|Seyðisfirði;700701|Egilsstöðum;690|Vopnafirði;685|Bakkafirði;680681|Þórshöfn;675|Raufarhöfn;670671|Kópaskeri;660|Mývatni;650|Laugum;645|Fosshólli;640641|Húsavík;630|Hrísey;625|Ólafsfirði;620621|Dalvík;611|Grímsey;610|Grenivík;600601602603|Akureyri;580|Siglufirði;570|Fljótum;565566|Hofsós;560|Varmahlíð;550551|Sauðárkróki;545|Skagaströnd;540541|Blönduósi;530531|Hvammstanga;524|Árneshreppi;520|Drangsnesi;510512|Hólmavík;500|Stað;470471|Þingeyri;465|Bíldudal;460|Tálknafirði;450451|Patreksfirði;430|Suðureyri;425|Flateyri;420|Súðavík;415|Bolungarvík;410|Hnífsdal;400401|Ísafirði;380|Reykhólahreppi;370371|Búðardal;360|Hellissandi;356|Snæfellsbæ;355|Ólafsvík;350|Grundarfirði;345|Flatey á Breiðafirði;340|Stykkishólmi;320|Reykholt í Borgarfirði;310311|Borgarnesi;300301302|Akranesi;270271276|Mosfellsbæ;260|Reykjanesbæ;250|Garði;245|Sandgerði;240|Grindavík;230232233235|Reykjanesbæ;225|Álftanesi;220221222|Hafnarfirði;210212|Garðabæ;200201202203|Kópavogi;190|Vogum;170172|Seltjarnarnesi;102|(Millilanda Póstur);101103104105107108109110111112113116121123124125127128129130132150155|Reykjavík'.split(';');
  k=d.length;
  while(k--){
    e=d[k].split('|');
    c=0;
    while(c<e[0].length){
      p[e[0].substring(c,c+=3)]=e[1]
    }
  }

  var postCodeSel;
  $.fn.islPostcodeSelect = function () {
      if (this.length)
      {
        if ( !postCodeSel )
        {
          postCodeSel = $('<select />');
          $.each(
              $.av.postCodes.is,
              function ( code, town ) {
                  $('<option />')
                      .text( code+' - '+town )
                      .val( code )
                      .appendTo( postCodeSel );
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
              cont = cont.filter('.fi_txt');
            }
            var selectBox = postCodeSel.clone()
                                .attr({
                                    name: input.attr('name'),
                                    id:   input.attr('id')
                                  });
            cont
                .removeClass('fi_txt')
                .addClass('fi_sel');
            input.replaceWith( selectBox );
          });
      }
      return this;
    };
  
})(jQuery);
