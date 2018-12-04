export const script = `<script async src="https://www.googletagmanager.com/gtag/js?id=UA-129845377-1"></script>`

export const trackingCode = `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-129845377-1');`

export const experimentCode = `<!-- Google Analytics Content Experiment code -->
<script>function utmx_section(){}function utmx(){}(function(){var
k='185405472-3',d=document,l=d.location,c=d.cookie;
if(l.search.indexOf('utm_expid='+k)>0)return;
function f(n){if(c){var i=c.indexOf(n+'=');if(i>-1){var j=c.
indexOf(';',i);return escape(c.substring(i+n.length+1,j<0?c.
length:j))}}}var x=f('__utmx'),xx=f('__utmxx'),h=l.hash;d.write(
'<sc'+'ript src="'+'http'+(l.protocol=='https:'?'s://ssl':
'://www')+'.google-analytics.com/ga_exp.js?'+'utmxkey='+k+
'&utmx='+(x?x:'')+'&utmxx='+(xx?xx:'')+'&utmxtime='+new Date().
valueOf()+(h?'&utmxhash='+escape(h.substr(1)):'')+
'" type="text/javascript" charset="utf-8"><\/sc'+'ript>')})();
</script><script>utmx('url','A/B');</script>
<!-- End of Google Analytics Content Experiment code -->`

export const conversionTracking =
`
// conversion tracking >> conversions will show up under "Behavior > Events" in your GA dashboard
document.addEventListener("DOMContentLoaded", function(event) {
  // Gets a reference to the form element, assuming
  // it contains the id attribute "signup-form".
  var form = document.getElementById('signup-form');
  console.log("Submits on this signup-form are tracked in Google Analytics under 'Events'", form);

  // Adds a listener for the "submit" event.
  form.addEventListener('submit', function(event) {
    let email = document.getElementById("Email").value;
    var x = location.pathname;

    // Prevents the browser from submitting the form
    // and thus unloading the current page.
    event.preventDefault();

    console.log("form submitted")

    // Creates a timeout to call 'submitForm' after one second.
    setTimeout(submitForm, 1000);

    // Keeps track of whether or not the form has been submitted.
    // This prevents the form from being submitted twice in cases
    // where 'hitCallback' fires normally.
    var formSubmitted = false;

    function submitForm() {
      if (!formSubmitted) {
        formSubmitted = true;
        form.submit();
      }
    }

    // Sends the event to Google Analytics and
    // resubmits the form once the hit is done.
    gtag('event', 'Sign Up form submission', {
      'event_category': 'Sign Ups',
      'event_label': email + ' signed up on: ' + x
    });
  });
});
`