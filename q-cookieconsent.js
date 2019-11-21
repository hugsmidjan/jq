/* $.cookieConsent 1.0  -- (c) 2019 Hugsmiðjan ehf. @preserve */
!function(e){var n={injectSelector:".privacy-policy h1",injectFn:"after",lang:e.lang(),cookieExpiresDays:180,disclaimerTempl:'<div class="disclaimer">%{discIntro}<span class="disclaimer__act"><button type="button" class="disclaimer__accept button">%{disclaimerAccept}</button><button type="button" class="disclaimer__deny button">%{disclaimerDeny}</button></span>%{privacyPolicyLink}<button type="button" class="disclaimer__close">%{disclaimerClose}</button></div>',introTempl:'<p class="disclaimer__intro">%{disclaimerIntro}</p>',privacyPolicyTempl:'<p class="disclaimer__privacy-policy">%{privacyPolicyPreText} <a class="disclaimer__link" href="%{privacyPolicyLink}">%{privacyPolicyLinkText}</a> %{privacyPolicyPostText}</p>',myConsentTempl:'<div class="my-consent"><p class="my-consent__intro">%{myConsentIntro}</p></div>',myConsentBtnTempl:'<div class="my-consent__buttons">%{myConsentPretext}<div class="my-consent__act"><button class="my-consent__accept button">%{myConsentAccept}</button><button class="my-consent__deny button">%{myConsentDeny}</button></div></div>'},t=function(n,t,i){n.preventDefault(),e.cookie("cookie",t,{expires:i.cookieExpiresDays,path:"/"});var o=(new Date).toISOString().split("T")[0];e.cookie("cookieConsentDate",o,{expires:i.cookieExpiresDays,path:"/"}),window.location.reload()};e.cookieConsent=function(i){var o=e.extend(n,i);!function(n){if(!e.cookie("cookie")){var i=e.cookieConsent.lang[n.lang]||e.cookieConsent.lang.en,o=e(e.inject(n.disclaimerTempl,{discIntro:e.inject(n.introTempl,{disclaimerIntro:e.inject(i["disclaimer-Intro"],{trackers:i["disclaimer-trackers"]})}),disclaimerAccept:i["disclaimer-Accept"],disclaimerDeny:i["disclaimer-Deny"],disclaimerClose:i["disclaimer-Close"],privacyPolicyLink:e.inject(n.privacyPolicyTempl,{privacyPolicyPreText:i["disclaimer-PrivacyPolicy-PreText"],privacyPolicyLink:i["disclaimer-PrivacyPolicy-Link"],privacyPolicyLinkText:i["disclaimer-PrivacyPolicy-LinkText"],privacyPolicyPostText:i["disclaimer-PrivacyPolicy-PostText"]})}));o.appendTo("body"),setTimeout(function(){o.addClass("disclaimer--visible")},1e3),o.on("click",".disclaimer__accept--all",function(e){t(e,"2",n)}),o.on("click",".disclaimer__accept",function(e){t(e,"1",n)}),o.on("click",".disclaimer__deny",function(e){t(e,"0",n)}),o.on("click",".disclaimer__close",function(n){e.cookie("cookie","-1",{expires:0,path:"/"}),o.remove()})}}(o),function(n){var i=e(n.injectSelector);if(i.length){var o=e.cookieConsent.lang[n.lang]||e.cookieConsent.lang.en,c=e.cookie("cookieConsentDate"),s=e.cookie("cookie"),a=s&&"-1"!==s?"0"===s?o["myConsent-Denied"]+" "+o["myConsent-Date"]:"1"===s?o["myConsent-Accepted"]+" "+o["myConsent-Date"]:"2"===s?o["myConsent-Accept-all"]+" "+o["myConsent-Date"]:"":o["myConsent-Undecided"],r=e(e.inject(n.myConsentTempl,{myConsentIntro:e.inject(a,{trackers:o["myConsent-trackers"],consentDate:c,cookieExpiresDays:n.cookieExpiresDays})}));s&&"-1"!==s&&r.append(e.inject(n.myConsentBtnTempl,{myConsentPretext:o["myConsent-button-Pretext"],myConsentAccept:o["myConsent-button-Accept"],myConsentDeny:o["myConsent-button-Deny"]})),i[n.injectFn](r),r.on("click",".my-consent__accept--all",function(e){t(e,"2",n)}),r.on("click",".my-consent__accept",function(e){t(e,"1",n)}),r.on("click",".my-consent__deny",function(e){t(e,"0",n)})}}(o)},e.cookieConsent.lang={en:{"disclaimer-trackers":"cookies","disclaimer-Intro":"Do we get your permission to use %{trackers} to gather anonymous data for your visit to our site?","disclaimer-Accept":"Yes, that's OK","disclaimer-Deny":"No","disclaimer-Close":"Close","disclaimer-PrivacyPolicy-PreText":"See more on","disclaimer-PrivacyPolicy-LinkText":"our privacy policy page","disclaimer-PrivacyPolicy-Link":"/privacy-policy","disclaimer-PrivacyPolicy-PreText":"what this means.","myConsent-trackers":"Google Analytics","myConsent-Undecided":"You have not made a decision regarding tracking cookies, therefore %{trackers} have <strong>not been activated</strong>.","myConsent-Accept-all":"You choose <strong>to allow all cookies</strong>.","myConsent-Accepted":"You choose <strong>to allow us to track your visit</strong> with %{trackers}.","myConsent-Denied":"You choose <strong>not to allow %{trackers}</strong>. Your visit will not be tracked.","myConsent-Date":"That decision was made on <code>%{consentDate}</code> and is stored for %{cookieExpiresDays} days.","myConsent-button-Pretext":"You can reconsider your choice here:","myConsent-button-Accept-all":"Allow all cookies","myConsent-button-Accept":"Allow tracking cookies","myConsent-button-Deny":"Deny tracking cookies"},is:{"disclaimer-trackers":"vafrakökur","disclaimer-Intro":"Fáum við leyfi þitt til að nota %{trackers} til að safna nafnlausum upplýsingum um notkun þína á þessum vef?","disclaimer-Accept":"Já, það er í lagi","disclaimer-Deny":"Nei","disclaimer-Close":"Loka","disclaimer-PrivacyPolicy-PreText":"Sjáðu nánar á","disclaimer-PrivacyPolicy-LinkText":"persónuverndarsíðu okkar ","disclaimer-PrivacyPolicy-Link":"/personuverndarstefna","disclaimer-PrivacyPolicy-PostText":"hvaða áhrif svar þitt hefur.","myConsent-trackers":"Google Analytics","myConsent-Undecided":"Þú hefur ekki tekið afstöðu til þess hvort okkur er leyfilegt er að mæla þína notkun og því hefur %{trackers} <strong>ekki verið virkjað</strong>.","myConsent-Accept-all":"Þú valdir að <strong>leyfa allar kökur</strong>.","myConsent-Accepted":"Þú valdir að <strong>leyfa okkur að mæla notkun þína</strong> með %{trackers}.","myConsent-Denied":"Þú valdir að <strong>leyfa ekki notkun %{trackers}</strong>. Notkun þín er því ekki mæld.","myConsent-Date":"Sú ákvörðun þín er dagsett <code>%{consentDate}</code> og gildir í %{cookieExpiresDays} daga. Eftir það spyrjum við þig aftur.","myConsent-button-Pretext":"Þú getur að sjálfsögðu endurskoðað ákvörðun þína hér:","myConsent-button-Accept-all":"Ég leyfi allar kökur","myConsent-button-Accept":"Ég leyfi mælingar","myConsent-button-Deny":"Ég leyfi ekki mælingar"}}}(window.jQuery);
