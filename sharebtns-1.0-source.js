<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- encoding: utf-8 -->

<html xmlns="http://www.w3.org/1999/xhtml" lang="is">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

  <title>jQuery.sharebtns demo/test</title>
  <style type="text/css">
    body {
      /*
        background-color: #000;
        color: #fff;
      */
        margin: 0;
        padding: 1em 10%;
    }
    hr {
        margin: 2em 0;
    }
    #one,
    #two,
    #three,
    #four {
        padding: 10px;
        border: 1px solid #eee;
        margin: .5em 0;
    }
    b {
        background-color: #f6f6f6;
        padding: 1px 4px;
    }
  </style>

  <script src="../../jquery/1.7/jquery-1.7.js"></script>
  <script src="jquery.sharebtns-1.0.js"></script>
  <script>
    jQuery(function($){

/**/
      $('div#one')
          .sharebtns({
              fbshare:   true,
              pinterest: true,
              linkedin:  true,
              gplus:     true,
              url: 'http://www.fffoobar.com/'
            });

      setTimeout(function(){

          $('div#two')
              .sharebtns({
                  url: 'http://www.fffoobar.com/',
                  insertion: 'prepend',
                  countNone: true,
                  gplus:     true,
                  fbshare  : true,
                  linkedin:  true,
                  pinterest: true
                });
/**/
          $('#three')
              .sharebtns({
                  url: 'http://www.fffoobar.com/',
                  insertion: 'before',
                  large: true,
                  fbshare: true,
                  fbshare2: { txt: 'FB Deila og drottna' },
                  gplus: true,
                  pinterest: true,
                  linkedin:  true, // repeat insertion doesn't work because LinkedIn button is crap
                  process:  function ( btnHTML, buttonName, btnCfg ) { // this example does the same as the `wrap:'li',` option.
                      return '<li class=' + buttonName + ' title="'+ buttonName +'">' + btnHTML + '</li>';
                    }
                })
                  .wrapAll('<ul/>');
/**/
          $('#four')
              .sharebtns({
                  url: 'http://www.fffoobar.com/',
                  gplus: 1,
                  pinterest: 1,
                  linkedin:  1,
                  insertion: 'after',
                  countV: true,
                  process: function (btnHTML, btnName, btnCfg) {
                      return $('<div/>').css({ display:'inline-block', 'margin-right':20 }).append( btnName, btnHTML );
                    }
                });

          $('#five')
              .sharebtns({
                  url: '//www.fffoobar.com/',
                  wrap: 'li'
                })
                .wrapAll('<ol/>');


        }, 3000);

      // Add extra timeout for the custom buttons
      // because the Pinterest script captures all links that point to http://pinterest.com/pin/create/button/*
      setTimeout(function(){
          $('#six')
              .sharebtns({
                  url: '//www.fffoobar.com/',
                  custom:    true,
                  wrap:      'li',
                  twitter:   1,
                  fbshare:   1,
                  pinterest: 1,
                  gplus:     1,
                  linkedin:  1,
                  facebook:  1
                });
        }, 4000);

/**/
    });
  </script>

</head>
<body>

  <h1>jQuery.sharebtns demo/test</h1>

  <p><img src="http://www.eplica.is/skin/basic/design/i/sitelogo.png" alt="mynd" align="middle" /> &lt;-- for Pinterest</p>

  <div id="one"><b>One</b></div><hr />
  <div id="two"><b>Two</b></div><hr />
  <div id="three"><b>Three</b></div><hr />
  <div id="four"><b>Four</b></div><hr />
  <div id="five"><b>Five</b></div><hr />
  <div id="six"><b>Six</b></div><hr />


</body>
</html>