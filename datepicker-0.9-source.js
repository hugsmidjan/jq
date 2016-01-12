/* datepicker 0.9 -- (c) 2011 Hugsmiðjan ehf.  @preserve */
!window.datePicker && (function($){

  var _capitalize = function(s) { return s  &&  (s.charAt(0).toUpperCase() + s.substr(1)); },
      _zeroClock = function(d)
      {
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d;
      };


  datePicker = {

    VERSION : 0.9,

    defaultCssFile : null,  // URL to a custom CSS file  null == auto-find default CSS file -- "" == use no CSS file.
    cssTriggers : ['fi_date', 'fi_dmy'],
    openOnFieldClick : true,
    wDLength : 1,

    is : {
      months     : 'janúar,febrúar,mars,apríl,maí,júní,júlí,ágúst,september,október,nóvember,desember'.split(','),
      wdays      : 'sunnudagur,mánudagur,þriðjudagur,miðvikudagur,fimmtudagur,föstudagur,laugardagur'.split(','),
      popBtn     : 'Veldu dag',
      popBtnLong : 'Veldu dagsetningu',
      close      : 'Fela',
      closeLong  : 'Fela dagatalið',
      prevM      : 'Fyrri',
      prevMLong  : 'Fyrri mánuður',
      nextM      : 'Næsti',
      nextMLong  : 'Næsti mánuður',
      prevY      : 'Fyrra ár',
      prevYLong  : 'Fyrra ár',
      nextY      : 'Næsta ár',
      nextYLong  : 'Næsta ár'
    },
    en : {
      months     : 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
      wdays      : 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
      popBtn     : 'Pick date',
      popBtnLong : 'Pick date',
      close      : 'Close',
      closeLong  : 'Close Calendar',
      prevM      : 'Prev',
      prevMLong  : 'Previous month',
      nextM      : 'Next',
      nextMLong  : 'Next month',
      prevY      : 'Prev year',
      prevYLong  : 'Previous year',
      nextY      : 'Next year',
      nextYLong  : 'Next year'
    },



    defaults : {
      dateActiveSrc : new Date(),
      dateMinSrc    : null,
      dateMaxSrc    : null,
      dateFormat    : '%d.%m.%yyyy',
      flipYears     : false,
      caseSensitive : false,
      lang          : 'en'
    },

    idDefaults : {},
    fields : {},

    _initDone : false,



    init : function(_containerElm)
    {
      if (!this._initDone &&          // only do this bit during the initial run.
          this.defaultCssFile !== ""  // if this.defaultCssFile === "" then assume the user doesn't want any remote CSS file
         )
      {
        this.defaultCssFile = this.defaultCssFile || 'https://eplica-cdn.is/jquery/datepicker/0.9/dp.css';
        $('head').append('<link href="'+ this.defaultCssFile +'" media="screen" rel="stylesheet" type="text/css" />');
      }


      this._today = _zeroClock(new Date());

      _containerElm = _containerElm || $('body'); // _containerElm ?
      var _allInputs = $(_containerElm).find("input");  // if _containerElm is null or undefined, then DOM.get() defaults to document
      var _classNameTriggers = new RegExp(" "+ this.cssTriggers.join(" | ") +" ");

      for (var i = 0, _inpt; _inpt = _allInputs[i]; i++)
      {
        if (_inpt.id  &&  this.fields[_inpt.id]  &&  (this.fields[_inpt.id]._input == _inpt))  // the last check is to ensure the dom hasn't been rewritten since last init...
        {
          // skip initing this field if its ID is already in this.fields hash. (useful when datePicker.init() is run for a second time)
          continue;
        }
        if (!_inpt.type || (_inpt.type == "text"))
        {
          var id = $.aquireId(_inpt),
              _classStr = "",
              _elm = _inpt;
          while (!/^(form|body)$/.test(_elm.tagName.toLowerCase()))
          {
            _classStr += " " + _elm.className;
            _elm = _elm.parentNode;
          }
          if (_classNameTriggers.test(_classStr+" "))
          {
            this.fields[id] = new DateUI(id);
            this.fields[id].init();
          }
        }
      }
      this._initDone = true;
    },



    getMY : function(dt, _lang)
    {
      return _capitalize(this[_lang].months[dt.getMonth()]) +" "+  dt.getFullYear();
    },


    _normalizeDateFormat : function(df)
    {
      if (df.indexOf('%') == -1)
      {
        df = df.replace(/(d+)/i,'%$1').replace(/(m+)/i,'%$1').replace(/(y+)/i,'%$1');
      }
      return df.toLowerCase();
    },


    // Usage Example:
    // -----------------------------------------------------
    // var dpObj = datePicker.fields[myInput.id];
    // var date = new Date(dpObj.dateActive);
    // date.setDate(date.getDate()+N);
    // datePicker.printDateValue( date, dpObj.dateFormat, dpObj.lang );
    //
    printDateValue : function(dt, _dateFormStr, _lang)
    {
      if (!dt) { return ""; }
      var txt = this[_lang || this.defaults.lang] || this.en;
      _dateFormStr = this._normalizeDateFormat(_dateFormStr || this.defaults.dateFormat);

      var yr = dt.getFullYear()+"";
      var m = (dt.getMonth()+1)+"";
      var d = dt.getDate()+"";

      var _fLen = (_dateFormStr.match(/\%d+/)) ? _dateFormStr.match(/\%(d+)/)[1].length : 0;
      if ((_fLen >= 2) && (d < 10)) { d = "0"+ d; }

      _fLen = (_dateFormStr.match(/\%m+/)) ? _dateFormStr.match(/\%(m+)/)[1].length : 0;
      if ((_fLen == 2) && (m < 10)) { m = "0"+ m; }
      else if (_fLen > 2) { m = txt.months[dt.getMonth()]; }
      if (_fLen == 3) { m = m.substr(0,3); }

      _fLen = (_dateFormStr.match(/\%y+/)) ? _dateFormStr.match(/\%(y+)/)[1].length : 0;
      if (_fLen == 2) { yr = yr.substr(2,2); }

      return _dateFormStr.replace(/\%y+/, yr).replace(/\%m+/, m).replace(/\%d+/, d);
    },




    parseDate : function(myId)
    {
      var _dateStr = this.fields[myId]._input.value;
      if (!_dateStr) { return null; }


      var _dateFormat = this._normalizeDateFormat(this.fields[myId].dateFormat),
          d  = 1,
          m  = 0,
          yr = null,
          _tmpStr, _fLen, _fStart, re;

      // Start by finding the month because their length varies
      if (_dateFormat.indexOf("%m") > -1)
      {
        _fStart = _dateFormat.substr(0, _dateFormat.indexOf("%m") ).replace(/\%(d|m|y)/g, "$1").length;
        _fLen = _dateFormat.match(/\%(m+)/)[1].length;
        if (_fLen > 2)
        {
          var _mNames = this[this.fields[myId].lang].months;
          _tmpStr = _dateStr.substr(_fStart).toLowerCase();

          for (var i = 0; i < _mNames.length; i++)
          {
            var _mName = _mNames[i].toLowerCase();
            if (_fLen == 3) { _mName = _mName.substr(0,3); }
            if (_tmpStr.indexOf(_mName) > -1)
            {
              m = i;
              _dateStr = _dateStr.substr(0,_fStart+1) + _dateStr.substr(_fStart+_mName.length+1); // Strip out the Month value
              break;
            }
          }
        }
        else
        {
          _tmpStr = _dateStr.substr(_fStart,3).replace(/^\D/,"").substr(0,2);
          m = parseInt(_tmpStr, 10);
          if (isNaN(m) || (m < 1)) { m = 1; }
          m = m-1;
          re = new RegExp("(.{"+_fStart+"})\\d\\d?(.*)$");
          _dateStr = _dateStr.replace(re, "$1$2"); // Strip out the Month value
        }

        _dateFormat = _dateFormat.replace(/\%m+/, ""); // Strip out the month format
      }


      // Then find the day of month
      if (_dateFormat.indexOf("%d") > -1)
      {
        _fStart = _dateFormat.substr(0,_dateFormat.indexOf("%d")).replace(/\%(d|m|y)/g, "$1").length;
        _tmpStr = _dateStr.substr(_fStart,3).replace(/^\D/,"").substr(0,2);
        d = parseInt(_tmpStr, 10);
        if (isNaN(d) || (d < 1)) { d = 1; }

        re = new RegExp("(.{"+_fStart+"})\\d\\d?(.*)$");
        _dateStr = _dateStr.replace(re, "$1$2"); // Strip out the day value
        _dateFormat = _dateFormat.replace(/\%d+/, ""); // Strip out the day format
      }

      // Then find year
      if (_dateFormat.indexOf("%y") > -1)
      {
        _fStart = _dateFormat.substr(0,_dateFormat.indexOf("%y")).replace(/\%(d|m|y)/g, "$1").length;
        _fLen = _dateFormat.match(/y+/)[0].length;
        _tmpStr = _dateStr.substr(_fStart,_fLen+2).replace(/^.?\D/,"").substr(0, _fLen);
        yr = parseInt(_tmpStr, 10);
        if (isNaN(yr) || (yr <= 0))
        {
          return null;
        }
        if (_fLen != 4)
        {
          yr += (yr < 70) ? 2000 : 1900;
        }

        re = new RegExp("(.{"+_fStart+"})\\d{"+_fLen+"}(.*)$");
        _dateStr = _dateStr.replace(re, "$1$2"); // Strip out the year value
        _dateFormat = _dateFormat.replace(/\%y+/, ""); // Strip out the year format (unnecessary really since this is the final parsing)
      }

      return new Date(yr, m, d);
    },





    buildCalendar : function(myId)
    {
      var _dateUI = this.fields[myId],
          dt = _dateUI.dateActive,
          _lang = _dateUI.lang,
          _txt = this[_lang];

      var _cont = $('<div id="'+myId+'-cal" class="pickdate'+(_dateUI.flipYears?' pickdate-yearnav':'')+'">'+
                      '<div class="pickdatewrap">'+
                        '<h4>'+this.getMY(dt,_lang)+'</h4>'+
                      '</div>'+
                    '</div>');
      _cont[0].fieldId = myId;

      _cont.on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });

      var _cal = $(_cont).find('div');

      var _monthNav = $('<ul class="month">'+
                          '<li class="prev"><a href="#" title="'+(_txt.prevMLong||_txt.prevM)+'">'+_txt.prevM+'</a></li>'+
                          '<li class="next"><a href="#" title="'+(_txt.nextMLong||_txt.nextM)+'">'+_txt.nextM+'</a></li>'+
                        '</ul>');
      _monthNav.find('.prev a').on('click', function (e) {
          datePicker.flipCal(myId,-1,"m");
          e.preventDefault();
        });
      _monthNav.find('.next a').on('click', function (e) {
          datePicker.flipCal(myId,1,"m");
          e.preventDefault();
        });
      _cal.append(_monthNav);


      if (_dateUI.flipYears)
      {
        var _yearNav = $(''+
          '<ul class="year">'+
            '<li class="prev"><a href="#" title="'+(_txt.prevYLong||_txt.prevY)+'">'+_txt.prevY+'</a></li>'+
            '<li class="next"><a href="#" title="'+(_txt.nextYLong||_txt.nextY)+'">'+_txt.nextY+'</a></li>'+
          '</ul>');
        _yearNav.find('.prev a').on('click', function (e) {
            datePicker.flipCal(myId,-1,"y");
            e.preventDefault();
          });
        _yearNav.find('.next a').on('click', function (e) {
            datePicker.flipCal(myId,1,"y");
            e.preventDefault();
          });
        _cal.append(_yearNav);
      }


      var _tableHTML = '<table cellspacing="0" summary=""><thead><tr>';
      for (var i = 0; i < 7; i++)
      {
        var _wDay = _capitalize(_txt.wdays[i]);
        _tableHTML += '<th><acronym title="'+_wDay+'">'+_wDay.substr(0,this.wDLength)+'</acronym></th>';
      }
      _tableHTML += '</tr></thead><tbody><tr><td colspan="7"></td></tr></tbody></table>';

      _cal.append( _tableHTML );

      var _clslink = $('<a href="#" class="close" title="'+(_txt.closeLong||_txt.close)+'">'+_txt.close+'</a>');
      _cal.append(_clslink);
      _clslink.on('click', function (e) {
          datePicker.closeCalendar(myId);
          e.preventDefault();
        });

      return _cont;
    },




    buildCalendarDays : function(myId)
    {
      var _myField = this.fields[myId];
      var dt = _myField.dateActive;
      var _myMonth = dt.getMonth();


      var _selday = _myField._selectedDate;
      var _lDate = new Date(dt.getFullYear(), _myMonth, 1);

      var _tblb = $("<tbody />");

      var _tdaOnClickFunc = function(elm) { return datePicker.doPickDate(myId, elm.newDay); };

      while(_lDate.getMonth() == _myMonth)
      {
        var tr = $("<tr />");
        _tblb.append(tr);

        for (var i = 1; i < 8; i++)  // 1-based looping. Ack! :(
        {
          var td = $("<td />");
          if (_lDate.getMonth() == _myMonth  &&  /* skip over the last days of the previous month */ !(_lDate.getDate() == 1  &&  i <= _lDate.getDay()) )
          {
            if (_lDate.getTime() == this._today.getTime())
            {
              td.addClass('today');
            }
            if (_selday  &&  _lDate.getTime() == _selday.getTime())
            {
              td.addClass('active');
            }

            var tda;
            if (this.isValidChoice(_lDate,myId))
            {
              tda = $("<a />");
              tda[0].href = "#";
              tda[0].fieldId = myId;
              tda[0].newDay = _lDate.getDate();
              tda.on('click', function (e) {
                  _tdaOnClickFunc(this);
                  e.preventDefault();
                });
            }
            else
            {
              tda = $("<i />");
            }
            tda.append( _lDate.getDate()+''  );
            td.append(tda);

            _lDate.setDate(_lDate.getDate()+1);
          }
          else
          {
            td.addClass('o');
            td.append( String.fromCharCode(160));
          }

          if (i == 1) { td.addClass('su'); }
          else if (i == 7) { td.addClass('sa'); }

          tr.append(td);
        }
      }


      return _tblb;
    },



    isValidChoice : function(qDate,myId)
    {
      var _myField = this.fields[myId];
      var dateMin = _myField.dateMin;
      var dateMax = _myField.dateMax;

      var _withinLowerBoundry = !dateMin  ||  qDate.getTime() >= dateMin.getTime();
      var _withinUpperBoundry = !dateMax  ||  qDate.getTime() <= dateMax.getTime();

      return (_withinLowerBoundry  &&  _withinUpperBoundry);
    },



    openCalendar : function(myId)
    {
      var _myField = this.fields[myId];

      if (_myField._input.disabled){ return false; }

      _myField.dateMin = _myField.getDateBoundry("min");
      _myField.dateMax = _myField.getDateBoundry("max");
      this.updateCalendar(myId);

      if (_myField.isOpen) { return false; }

      _myField.isOpen = true;
      $(_myField._button).after(_myField._calendar);
      $('body').on('click', this.delayedCloseAll);
    },


    closeCalendar : function(myId)
    {
      var _myField = this.fields[myId];
      if (!_myField.isOpen) { return false; }
      _myField.isOpen = false;
      $(_myField._calendar).detach();
      $('body').off('click', this.delayedCloseAll);
      return false;
    },


    toggleCalendar : function(myId)
    {
      this[ (this.fields[myId].isOpen ? 'close':'open') + 'Calendar' ](myId);
    },


    flipCal : function(myId, _deltaValue, _step)
    {
      var _myField = this.fields[myId];
      var dateMin = _myField.dateMin;
      var dateMax = _myField.dateMax;

      var d = _myField.dateActive;

      var _newd = new Date(d);
      _newd.setDate(1);

      if (_step == "y")
      {
        _newd.setFullYear(_newd.getFullYear()+_deltaValue);
      }
      else // (_step == "m")
      {
        _newd.setMonth(_newd.getMonth()+_deltaValue);
      }

      if (_deltaValue < 0) // when flipping back, make the current date last of the current month instead of the first.
      {
        _newd.setMonth(_newd.getMonth()+1);
        _newd.setDate(0);
      }

      var _doFlip = false,
          _newdTime = _newd.getTime();

      if ( (!dateMin  ||  _newdTime >= dateMin.getTime())  &&  (!dateMax  ||  _newdTime <= dateMax.getTime()) )
      {
        _doFlip = true;
      }
      else if (dateMin  &&  _newdTime < dateMin.getTime()  &&  _deltaValue > 0 )
      {
        _newd = dateMin;
        _doFlip = true;
      }
      else if (dateMax  &&  _newdTime > dateMax.getTime()  &&  _deltaValue < 0)
      {
        _newd = dateMax;
        _doFlip = true;
      }

      if (_doFlip)
      {
        _myField.dateActive = new Date(_newd);
        this.updateCalendar(myId);
        _myField._button.focus();
        return true;
      }

      return false;
    },



    updateCalendar : function(myId)
    {
      var _myField = this.fields[myId];
      var _theCal = _myField._calendar;

      $(_theCal).find("h4").text( this.getMY(_myField.dateActive, _myField.lang) );
      $(_theCal).find("tbody").replaceWith( this.buildCalendarDays(myId) );
    },



    doPickDate : function(myId, _myDay)
    {
      var _myField = $('#'+myId)[0];
      var _dateUI = this.fields[myId];

      var _aDate = _dateUI.dateActive;
      _aDate.setDate(_myDay);

      var _sDate = _dateUI._selectedDate;
      _sDate.setTime(_aDate.getTime());

      _myField.value = this.printDateValue(_sDate, _dateUI.dateFormat, _dateUI.lang);
      this.closeCalendar(myId);
      this.updateCalendar(myId);
      _myField.focus();
      return false;
    },


    closeAll : function()
    {
      for (var myId in this.fields)
      {
        if (!this.fields[myId].isHovered)
        {
          this.closeCalendar(myId);
        }
      }
      return false;
    },


    delayedCloseAll : function(e){ setTimeout(datePicker.closeAll, 10); }


  };







  var DateUI = function(myId)
  {
    var dp = datePicker;
    this._input = $('#'+ myId)[0];
    if (dp.openOnFieldClick)
    {
      $(this._input).on('mouseup', function (e) {
          if (!dp.fields[this.id].isOpen)
          {
            setTimeout("datePicker.openCalendar('"+this.id+"')", 20);
            e.stopPropagation();
          }
        });
      $(this._input).on('blur', function (e) {
          var funcStr = "if (!datePicker.fields['"+this.id+"'].isHovered) { datePicker.closeCalendar('"+this.id+"'); }";
          setTimeout(funcStr, 20);
        });
    }


    this.getDateBoundry = function(varId) {
      var _objField = varId == 'min' ?
                          this.dateMinSrc:
                      varId ==  'max'?
                          this.dateMaxSrc:
                          this.dateActiveSrc;
      if (!_objField) { return null; }

      var dd = {}, _boundry, _bDate, _deltaValue, _deltaType;
      if (!_objField.join) // _objField is not an Array
      {
        _boundry = _objField;
      }
      else // _objField is an Array
      {
        _boundry = _objField[0];
        if (_objField[1] && (typeof(_objField[1]) == "string") && _objField[1].match(/^[-+]?\d+[dmy]$/))
        {
          _deltaValue = parseInt(_objField[1], 10);
          _deltaType  = _objField[1].match(/[dmy]$/)[0];
        }
      }

      if (typeof(_boundry) == "string")
      {
        if (!dp.fields[_boundry]) { return null; }
        _bDate = dp.parseDate(_boundry);
      }
      else
      {
        _bDate = _boundry;
      }

      if (!_bDate) { return null; }

      dd.y = _bDate.getFullYear();
      dd.m = _bDate.getMonth();
      dd.d = _bDate.getDate();
      dd[_deltaType] += _deltaValue || 0;

      return new Date(dd.y, dd.m, dd.d);
    };


    this.isOpen = false;

    $.extend(this, dp.defaults, dp.idDefaults[myId] || {});

    var _elmLang = $(this._input).lang();
    if (dp[_elmLang]) { this.lang = _elmLang; }


    this.dateActive = this.getDateBoundry("active");  // One-time-only initialization


    this.init = function()
    {
      var sd = dp.parseDate(myId) || this.dateActive || _zeroClock(new Date());
      this._selectedDate = sd;
      this.dateActive = new Date(sd);


      this.dateMin = this.getDateBoundry("min");
      this.dateMax = this.getDateBoundry("max");

      var btn = $('<a href="#" class="pickdatelink">'+ dp[this.lang].popBtn +'</a>');
      btn[0].title = (dp[this.lang].popBtnLong) || dp[this.lang].popBtn;
      btn[0].fieldId = myId;
      btn.on('click', function (e) {
          dp.toggleCalendar(this.fieldId);
          e.stopPropagation();
          return false;
        });

      $(this._input).after(btn);
      this._button = btn;


      this._calendar = dp.buildCalendar(myId);
      this.isHovered = false;

      btn.on('focus', function (e) {
          datePicker.fields[this.fieldId].isHovered = true;
        });
      btn.on('mouseout', function (e) {
          datePicker.fields[this.fieldId].isHovered = false;
        });
      $(this._calendar).on('mouseover', function (e) {
          datePicker.fields[this.fieldId].isHovered = true;
        });
      $(this._calendar).on('mouseout', function (e) {
          datePicker.fields[this.fieldId].isHovered = false;
        });
    };

  };


})(jQuery);