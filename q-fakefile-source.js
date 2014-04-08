// $.fn.fakeFile -- (c) 2014 Hugsmiðjan ehf.
// Valur Sverrisson
// Ægir Pétursson

(function($){

  var fakeFile = function (fileElm, cfg) {
        var fileInp = fileElm.find('input').data('data-fileNo', fileNo),
            fileWrap = fileInp.wrap('<div class="filewrap" />').parent(),
            fileId, fileNo,
            fakeFile = $('<a class="fakefile" href="#"></a>')
                            .appendTo(fileWrap);

        if (cfg.cloneField)
        {
          fileId = fileInp.attr('id').replace(/\d+$/,'');
          fileNo = fileInp.attr('id').match(/(\d+)$/);
          fileNo = fileNo ? fileNo[0] : 0;

          $('<a class="remove" href="#" title="'+ cfg.removeText +'">X</a>')
              .appendTo(fileWrap)
              .on('click', function (e) {
                  e.preventDefault();
                  $(this).parent()[ $(this).closest('.filewrap').is(fileWrap) ? 'detach' : 'remove' ]();
                });
        }

        fileWrap
            .on('change.file', 'input', function () {
                var filename = $(this).val().replace("C:\\fakepath\\", "");
                if (filename)
                {
                  $(this).next('.fakefile').text( filename.length > 36 ? $.cropText(filename, 33) : filename );
                }
                else
                {
                  $(this).next('.fakefile').text(cfg.nofileText);
                }

                if( cfg.cloneField && $(this).closest('.filewrap').is(':last-child') && $(this).val() )
                {
                  fileNo++;
                  fileWrap
                      .clone(true,true)
                          .appendTo(fileElm)
                          .find('input')
                              .attr('id', fileId + fileNo)
                              .attr('name', fileId + fileNo)
                          .end()
                              .find('.fakefile')
                                  .text(cfg.nofileText);
                }

              })
            .find('input')
                .trigger('change.file');


      };

  $.fn.fakeFile = function(o) {
    var defaultCfg = {
          cloneField: false,
          removeText: $.lang() == 'is' ? 'Fjarlægja skrá' : 'Remove file',
          nofileText: $.lang() == 'is' ? 'Engin skrá valin' : 'No file selected'
        },
        cfg = $.extend(defaultCfg, o);
    return this.each(function() {
      fakeFile( $(this), cfg );
    });
  };
})(jQuery);