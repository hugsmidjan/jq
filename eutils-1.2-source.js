(function( init ){
  if ( window.Req )
  {
    window.Req(
        'jquery',
        'eutils',
        init
      );
  }
  else
  {
    init();
  }

})(function(){'use strict';
  var win = window;
  var $ = win.jQuery;

  var imageCroppingPreviews = function ( image, previewContainer ) {
          var $image    = $(image);
          var $previewContainer = $( previewContainer );
          var originalElm = $('<div class="img"/>')
                  .append(  $('<img/>').attr('src',image.src)  );

          var origWidth  = $image.attr('data-naturalWidth') || 0; // 1000
          var origHeight = $image.attr('data-naturalHeight') || 0; // 757;
          var origRatio = origWidth/origHeight;

          var previewItemsArr = [];

          var fauxReply = [
              {
                doCrop: true,
                croppedWidth: 667,
                croppedHeight: 333,
                xPos: 233,
                yPos: 167,
                versionName: 'Myndasafn (lítil - 114px)',
                tooSmall: false
              },
              {
                doCrop: true,
                croppedWidth: 1000,
                croppedHeight: 500,
                xPos: 0,
                yPos: 129,
                versionName: 'Gigabanner (2K px)',
                tooSmall: true,
                targetWidth: 2000,
                targetHeight: 500
              },
              {
                doCrop: false,
                versionName: 'Silly size (square)',
                tooSmall: true,
                targetWidth: 1500,
                targetHeight: 1500
              },
              {
                doCrop: true,
                croppedWidth: 1000,
                croppedHeight: 250,
                xPos: 0,
                yPos: 230,
                versionName: 'Banner 4:1 (600px)',
                tooSmall: false
              },
              {
                doCrop: true,
                croppedWidth: 1000,
                croppedHeight: 200,
                xPos: 0,
                yPos: 250,
                versionName: 'Banner 5:1 (600)',
                tooSmall: false
              },
              {
                doCrop: false
              },
              {
                doCrop: false
              }
          ];

          // helper function
          var _addOverlay = function( elm, className ) {
                  return  $('<div style="position:absolute;" />')
                              .addClass( 'media__croppreviews__' + className )
                              .appendTo( elm );
              };




          // =========================================================================================================================
          //   Actions
          // =========================================================================================================================

          var _processServerReply = $.debounceFn(function (cropHints) {
              // ********
              // converts server-reply to data for preview rendering
              // then calls next function
              // ********

              var previewDataArr = [];
              var pxToPercHeight = 100/origHeight; // height (in px) to percentage
              var pxToPercWidth  = 100/origWidth;
              var _perc = function(num) { return (num + '%'); };

              for (var i=0,l=cropHints.length; i<l; i++)
              {
                  var hint = cropHints[i];
                  var pD = {}; // data for a single preview
                  if (hint.doCrop === true) {

                      pD.title = hint.versionName;
                      pD.isCropped = true;

                      // calculate intersections as percentages
                      // 0  |-  w1  -|-  w2 (cropWidth)  -|-  w3  -|  100%
                      pD.w1 = ( hint.xPos )         *pxToPercWidth; // nn (%)
                      pD.w2 = ( hint.croppedWidth ) *pxToPercWidth;
                      pD.w3 = 100 - (pD.w1+pD.w2);
                      // same for height
                      pD.h1 = ( hint.yPos )          *pxToPercHeight;
                      pD.h2 = ( hint.croppedHeight ) *pxToPercHeight;
                      pD.h3 = 100 - (pD.h1+pD.h2);

                      // create CSS strings
                      pD.W1 = _perc(pD.w1); // 'nn%'
                      pD.W2 = _perc(pD.w2);
                      pD.W3 = _perc(pD.w3);
                      pD.H1 = _perc(pD.h1);
                      pD.H2 = _perc(pD.h2);
                      pD.H3 = _perc(pD.h3);
                  }
                  if (hint.tooSmall === true) {

                      pD.title = hint.versionName;
                      pD.isSmall = true;

                      // fit the target-frame into size of the original
                      // same naming scheme as for preview
                      // 0  |-  tw1  -|-  tw2 (targetWidth)  -|-  (ignored)  -|  100%
                      var tw = hint.targetWidth;
                      var th = hint.targetHeight;
                      var tw1, tw2, th1, th2, pxToPx, scale, prLeft, prTop;
                      var targetRatio = tw/th;
                      if ( targetRatio >= origRatio ) {
                          // targetWidth determines size
                          tw2 = 100; // width of target-frame
                          pxToPx = (origWidth/tw);
                          th2 = th * pxToPx * pxToPercHeight; // height of target-frame
                      }
                      else
                      {
                          // targetHeight determines size
                          th2 = 100; // height of target-frame
                          pxToPx = (origHeight/th);
                          tw2 = tw * pxToPx * pxToPercWidth; // width of target-frame
                      }
                      tw1 = (100 - tw2) /2; // left pos
                      th1 = (100 - th2) /2; // top pos

                      // create CSS strings
                      pD.tW1 = _perc(tw1); // left pos as 'nn%'
                      pD.tW2 = _perc(tw2); // width as 'nn%'
                      pD.tH1 = _perc(th1); // top pos
                      pD.tH2 = _perc(th2); // height

                      scale = (origWidth/tw)*100; // scale of preview
                      pD.Scale = _perc(scale);

                      // calculate position of preview
                      if (pD.isCropped) {
                          // subtract scaled w1|h1 from the position of the target-frame
                          prLeft = tw1 - (scale/100 * pD.w1);
                          prTop  = th1 - (scale/100 * pD.h1);
                          pD.prTop  = _perc(prTop);
                          pD.prLeft = _perc(prTop);
                      }
                      else { // just position centrally
                          pD.prTop  = _perc( (100 - scale) /2);
                          pD.prLeft = pD.prTop;
                      }
                  }
                  if ( !$.isEmptyObject(pD) ) {
                      // push to collection
                      previewDataArr.push(pD);
                  }

              }
              _drawAllPreviews(previewDataArr);
          }, !!'immediate', 250); // END: _processServerReply()



          var _drawAllPreviews = function (previewDataArr) {
                  $previewContainer
                      .empty()
                      .removeClass('is-loading');
                  for (var j=0,le=previewDataArr.length; j<le; j++)
                  {
                      var pD = previewDataArr[j];

                      if ( pD.isCropped || pD.isSmall ) {
                          // create and attach item
                          var item = $('<li class="media__croppreivew__item"><h4>'+ pD.title +'</h4></li>')
                                        .appendTo( previewContainer );
                          var previewImg = originalElm.clone()
                                              .appendTo( item );
                          if ( pD.isCropped )
                          {
                            _showCropping( pD, item, previewImg );
                          }
                          if (pD.isSmall) {
                            _showImageRattle(pD, item, previewImg );
                          }
                          previewItemsArr.push ( item );
                      }
                  }
                };


          var _showCropping = function ( previewData, item, previewImg ) {
              // local shorthand
              var pD = previewData;

              if (pD.h1 > 0) { // above 'hole'
                  _addOverlay( previewImg, 'shader' ).css({ left:0, top:0, width:'100%', height:pD.H1 });
              }
              if (pD.w1 > 0) { // left of 'hole'
                  _addOverlay( previewImg, 'shader' ).css({ left:0, top:pD.H1, width:pD.W1, height:pD.H2 });
              }
              if (pD.w3 > 0) { // right of 'hole'
                  _addOverlay( previewImg, 'shader' ).css({ right:0, top:pD.H1, width:pD.W3, height:pD.H2 });
              }
              if (pD.h3 > 0) { // below 'hole'
                  _addOverlay( previewImg, 'shader' ).css({ left:0, bottom:0, width:'100%', height:pD.H3 });
              }
              // bordering on top
              _addOverlay( previewImg, 'imgoutliner' ).css({ left:pD.W1, top:pD.H1, width:pD.W2, height:pD.H2 })
          };


          var _showImageRattle = function (previewData, item, previewImg ) {
              // local shorthand
              var pD = previewData;

              // use an invisible img to maintain size
              var ghost = $('<div class="ghost"/>')
                      .insertBefore( previewImg );
              previewImg.find('img')
                  .clone()
                  .css('visibility', 'hidden')
                  .appendTo( ghost );

              _addOverlay( ghost, 'targetsize' ).css({ left:pD.tW1, top:pD.tH1, width:pD.tW2, height:pD.tH2 });

              // move the preview into the .ghost wrapper
              previewImg
                  .addClass('small')
                  .css({
                      top: pD.prTop,
                      left: pD.prLeft,
                      width: pD.Scale
                    })
                  .appendTo(ghost);
              // scale down the preview div and center
              // (after scaling sizes are no longer pixel-perfect)
          };



          // =========================================================================================================================
          //   Run Init Actions
          // =========================================================================================================================

          $image.on('focusvaluesupdated', function (e) {
              $previewContainer
                  .empty()
                  .addClass('is-loading');
              setTimeout(function() {
                  _processServerReply(fauxReply);
                }, 500);
            });

        };

  win.imageCroppingPreviews = imageCroppingPreviews;

});
