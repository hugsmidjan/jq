/* $.fn.fakeFile  -- (c) 2014 Hugsmiðjan ehf.  @preserve */
// Valur Sverrisson
// Ægir Pétursson

(function($){

  var fakeFile = function (fileElm, cfg) {
        var fileInp = fileElm.find('input'),
            fileWrap = fileInp.wrap('<div class="fakefile__filewrap filewrap" />').parent(),
            fileId, fileNo,
            fakeFile = $(cfg.useButtonElm ? '<button class="fakefile" type="button" />' : '<a class="fakefile" href="#" />')
                            .on('click', function (e) {
                                e.preventDefault();
                              })
                            .appendTo(fileWrap);

        if (cfg.cloneField)
        {
          fileId = fileInp.attr('id').replace(/\d+$/,'');
          fileNo = fileInp.attr('id').match(/(\d+)$/);
          fileNo = fileNo ? fileNo[0] : 0;

          $('<a class="fakefile__remove remove" href="#" title="'+ cfg.removeText +'">X</a>')
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
                  var fileEnding = filename.toLowerCase().match(/[a-z0-9]+$/);
                  fileEnding = fileEnding ? fileEnding[0] : 'default';
                  var filename = filename.length > cfg.textLength ? $.cropText(filename, (cfg.textLength-3) ) : filename;
                  var fileUploadedText = cfg.fileUploadedText ? '<span class="fakefile__title">' + cfg.fileUploadedText + '</span>' : '';
                  $(this)
                      .next('.fakefile')
                          .html( fileUploadedText + '<span class="fakefile__filename">' + filename + '</span>' )
                          [0].className = 'fakefile file_'+ fileEnding;
                }
                else
                {
                  $(this).next('.fakefile').html(cfg.nofileText)[0].className = 'fakefile file_empty';
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
                                  .html(cfg.nofileText)
                                  [0].className = 'fakefile file_empty';
                }

              })
            .find('input')
                .trigger('change.file');


      };

  $.fn.fakeFile = function(o) {
    var defaultCfg = {
          cloneField: false,
          textLength: 40,
          useButtonElm: false,
          removeText: $.lang() == 'is' ? 'Fjarlægja skrá' : 'Remove file',
          nofileText: $.lang() == 'is' ? 'Engin skrá valin' : 'No file selected',
          fileUploadedText: '',
        },
        cfg = $.extend(defaultCfg, o);

    return this.each(function() {
      fakeFile( $(this), cfg );
    });
  };
})(jQuery);