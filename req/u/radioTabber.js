/* radioTabber 1.0  -- (c) 2015 Hugsmiðjan ehf. - MIT/GPL   @preserve */

// (c) 2015 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//
// Dual licensed under a MIT licence (http://en.wikipedia.org/wiki/MIT_License)
// and GPL 2.0 or above (http://www.gnu.org/licenses/old-licenses/gpl-2.0.html).
// ----------------------------------------------------------------------------------

export default function radioTabber(inputGroup, opts) {
  opts = opts || {};
  inputGroup = [].slice.call(inputGroup); // inputGroup might be NodeList, or jQuery collection or whatevs...

  const toggleFieldsetFor = ( input, visible ) => {
    if ( input ) {
      const fieldset = document.getElementById( input.getAttribute('aria-controls') );
      if ( fieldset ) {
        [].slice.call(fieldset.querySelectorAll('input,select,button,textarea'))
            .forEach((field) => { field.disabled = !visible; });
        fieldset.setAttribute('aria-hidden', !visible);
        fieldset.hidden = !visible;
        setTimeout(() => {
          // Slightly delayed removal of aria-disabled allows for fancy CSS transitions, etc.
          fieldset.setAttribute('aria-disabled', !visible);
        }, 50);
      }
    }
  };
  let selectedInput;
  const click = (e) => {
    const clickedInput = e.currentTarget;
    if ( clickedInput !== selectedInput ) {
      toggleFieldsetFor( selectedInput, false );
      selectedInput = clickedInput;
      toggleFieldsetFor( clickedInput, true );
    }
  };

  let initialInput;
  inputGroup.forEach((input) => {
    if ( input.checked ) {
      initialInput = input;
    }
    else {
      toggleFieldsetFor( input, false );
    }
    input.addEventListener('click', click);
  });

  if ( !initialInput  &&  opts.defaultFirst ) {
    initialInput = inputGroup[0];
    initialInput.checked = true;
  }
  if ( initialInput ) {
    click.call(initialInput);
  }

}
