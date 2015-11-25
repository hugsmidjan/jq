// Eplica login hax
if (window.Req && !window.EPLICA)
{
  window.jQuery(window).on('keydown', function (e) {
      // Ctrl + Alt + L
      if (  e.ctrlKey && e.altKey && e.which === 76 )
      {
        var ccurl = window.Req.baseUrl.replace(/jq\/$/,'');
        var s=document.body.appendChild(document.createElement('script'));
        s.src=ccurl+'/bookmarklets/loginpop/loginpop.js';
      }
  });
}
