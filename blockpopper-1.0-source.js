// encoding: utf-8

// work in progress...

jQuery.fn.goo_blockPopper = function ()
{
  // insert code here...
  return this;
}

var blockPopper = {

  v : 1,

  linkSelector : "a.popper",
  anchorClass  : "stream",
  closeOnBlur  : true,

  "is" : { closeLnkText : "Loka" },
  "en" : { closeLnkText : "Close" },

  _anchorPattrn : /^.*#(.+)$/,
  _currentLink : null,  // the last link that was clicked to open a popperBlock. (there can only be one popperBlock open at any time)

  _autoCloser : function(e) {
    var _link = this._currentLink;
    if (_link && DOM.$(_link._blockElmId))
    {
      Event.fire(_link, 'click');
    }
    else
    {
      Event.remove(document.body, 'click', this._autoCloser, this);
    }
    return false;
  },



  // "Public-service" method (never used internally) used to close specicfic _blockElms.... ...or all _blockelms.
  close : function(_blockElm){
    if (!_blockElm)
    {
      this._autoCloser();
    }
    if ((_blockElm = DOM.$(_blockElm))  &&  _blockElm._isOpen)  // make sure the blockElm is still present in the DOM and open...
    {
      Event.fire(_blockElm._openerLinks[0], 'click');
    }
    return false;
  },


  _toggle : function(e)
  {
    e && e.stopPropagation();
    var b = blockPopper;

    var _blockElm = DOM.$(this._blockElmId);  // look up the blockElm every time ... as it may have been refreshed by DOM/Ajax methods during the meanwhile...
    if (_blockElm) // just to be safe, ... the _blockElm might have met its doom during the aforementioned meanwhile...
    {
      DOM.toggleClass(_blockElm, "popperblock-open", "popperblock-closed");

      if (_blockElm._isOpen)  // if this is currently open, then...
      {
        // ==========================================================
        // ...CLOSE it!
        // ==========================================================
        DOM.setHash('.');
        DOM.setFocus(this);
        DOM.removeNode(_blockElm._closeLnk);  // remove the _closeLnk to lessen the confusion for non-CSS enabled users
        if (b.closeOnBlur)
        {
          Event.remove(document.body, 'click', b._autoCloser, b);
          b._currentLink = null;
        }
      }
      else
      {
        // ==========================================================
        // ...OPEN it!
        // ==========================================================
        DOM.setHash(this._blockElmId);
        DOM.setFocus(_blockElm._focusElm);
        DOM.appendChild(_blockElm._closeLnk, _blockElm);  // dynamically display a _closeLnk
        if (b.closeOnBlur)
        {
          if (b._currentLink) { b._autoCloser(e); }  // close any previously open popperBlocks
          b._currentLink = this;
          Event.add(document.body, 'click', b._autoCloser, b);
        }
      }

      // toggle all switches and classNames
      _blockElm._isOpen = !_blockElm._isOpen;
      var i = _blockElm._openerLinks.length;
      while (i--)
      {
        DOM.toggleClass(_blockElm._openerLinks[i], "popper-open");
      }

    }
    return false;
  },



  init : function(_links)
  {
    _links = (!_links) ? DOM.get(this.linkSelector) : (_links.join) ? _links : [_links];
    
    for (var i=0,_lnk; (_lnk=_links[i]); i++)
    {
      var _blockId = _lnk.href.replace(this._anchorPattrn, "$1"),
          _blockElm = DOM.$(_blockId);

      if (_blockElm)
      {
        _lnk._blockElmId = _blockId;

        (_blockElm._openerLinks || (_blockElm._openerLinks = [])).push(_lnk);
        Event.add(_lnk, "click", this._toggle);

        if (!_blockElm.done) // We're processing this block for the first time
        {
          // prepare the block
          
          // let's insert an extra link element to make the whole thing accessible even when the CSS is not present
          _blockElm._focusElm = DOM.makeElement('<a href="#'+_blockId+'" class="'+this.anchorClass+' blockPopper_anchorElm">#</a>');
          DOM.prependChild(_blockElm._focusElm, _blockElm);

          // make sure the link has the correct language specified
          var _blockLang = DOM.getLang(_blockElm) || "en";

          // let's create an extra "close" to be inserted at the end of the block when it's focused.
          _blockElm._closeLnk = DOM.makeElement('<a href="#" class="closebutton">'+this[_blockLang].closeLnkText+'</a>');
          Event.add(_blockElm._closeLnk, "click", function(e) { return Event.fire(this.parentNode._openerLinks[0], 'click'); });

          DOM.addClass(_blockElm, "popperblock popperblock-closed");
          _blockElm._isOpen = false;

          if (this.closeOnBlur)
          {
            // Allow the user to click *inside* _blockElm without accidentally closing the block.
            Event.add(_blockElm, "click", function(e) { e.stopPropagation();  return; });
          }

          _blockElm.done = true;  // make sure each block is only processed once
        }

      }
    }
  }

};


