// mobile fixes  -- (c) 2013 Hugsmiðjan ehf.
!function(e,t,n,i){if(/iPhone|iPad/.test(n)&&!/Opera Mini/.test(n)){var a=t.querySelectorAll("meta[name=viewport]");if(a[0]){var o="gesturestart",m=[1,1],c=function(){a[a.length-1].content="width=device-width,minimum-scale="+m[0]+",maximum-scale="+m[1],t.removeEventListener(o,c,!0)};c(),m=[.25,1.6],t[i](o,c,!0)}/iPhone/.test(n)&&e[i]("orientationchange",function(){setTimeout(function(e){(e=document.documentElement).className=e.className},0)},!0)}}(window,document,navigator.userAgent,"addEventListener");
