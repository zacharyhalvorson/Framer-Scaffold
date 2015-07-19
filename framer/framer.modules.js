require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ViewNavigationController":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.ViewNavigationController = (function(superClass) {
  var ANIMATION_OPTIONS, BACKBUTTON_VIEW_NAME, BACK_BUTTON_FRAME, DEBUG_MODE, DIR, INITIAL_VIEW_NAME, PUSH;

  extend(ViewNavigationController, superClass);

  INITIAL_VIEW_NAME = "initialView";

  BACKBUTTON_VIEW_NAME = "vnc-backButton";

  ANIMATION_OPTIONS = {
    time: 0.3,
    curve: "ease-in-out"
  };

  BACK_BUTTON_FRAME = {
    x: 0,
    y: 40,
    width: 88,
    height: 88
  };

  PUSH = {
    UP: "pushUp",
    DOWN: "pushDown",
    LEFT: "pushLeft",
    RIGHT: "pushRight",
    CENTER: "pushCenter"
  };

  DIR = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right"
  };

  DEBUG_MODE = false;

  function ViewNavigationController(options) {
    var base, base1, base2, base3;
    this.options = options != null ? options : {};
    this.views = this.history = this.initialView = this.currentView = this.previousView = this.animationOptions = this.initialViewName = null;
    if ((base = this.options).width == null) {
      base.width = Screen.width;
    }
    if ((base1 = this.options).height == null) {
      base1.height = Screen.height;
    }
    if ((base2 = this.options).clip == null) {
      base2.clip = true;
    }
    if ((base3 = this.options).backgroundColor == null) {
      base3.backgroundColor = "#999";
    }
    ViewNavigationController.__super__.constructor.call(this, this.options);
    this.views = [];
    this.history = [];
    this.animationOptions = this.options.animationOptions || ANIMATION_OPTIONS;
    this.initialViewName = this.options.initialViewName || INITIAL_VIEW_NAME;
    this.backButtonFrame = this.options.backButtonFrame || BACK_BUTTON_FRAME;
    this.debugMode = this.options.debugMode || DEBUG_MODE;
    this.on("change:subLayers", function(changeList) {
      var i, len, ref, results, subLayer;
      ref = changeList.added;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        subLayer = ref[i];
        results.push(this.addView(subLayer, true));
      }
      return results;
    });
  }

  ViewNavigationController.prototype.addView = function(view, viaInternalChangeEvent) {
    var obj, vncHeight, vncWidth;
    vncWidth = this.options.width;
    vncHeight = this.options.height;
    view.states.add((
      obj = {},
      obj["" + PUSH.UP] = {
        x: 0,
        y: -vncHeight
      },
      obj["" + PUSH.LEFT] = {
        x: -vncWidth,
        y: 0
      },
      obj["" + PUSH.CENTER] = {
        x: 0,
        y: 0
      },
      obj["" + PUSH.RIGHT] = {
        x: vncWidth,
        y: 0
      },
      obj["" + PUSH.DOWN] = {
        x: 0,
        y: vncHeight
      },
      obj
    ));
    view.states.animationOptions = this.animationOptions;
    if (view.name === this.initialViewName) {
      this.initialView = view;
      this.currentView = view;
      view.states.switchInstant(PUSH.CENTER);
      this.history.push(view);
    } else {
      view.states.switchInstant(PUSH.RIGHT);
    }
    if (!(view.superLayer === this || viaInternalChangeEvent)) {
      view.superLayer = this;
    }
    if (view.name !== this.initialViewName) {
      this._applyBackButton(view);
    }
    return this.views.push(view);
  };

  ViewNavigationController.prototype.transition = function(view, direction, switchInstant, preventHistory) {
    if (direction == null) {
      direction = DIR.RIGHT;
    }
    if (switchInstant == null) {
      switchInstant = false;
    }
    if (preventHistory == null) {
      preventHistory = false;
    }
    if (view === this.currentView) {
      return false;
    }
    if (direction === DIR.RIGHT) {
      view.states.switchInstant(PUSH.RIGHT);
      this.currentView.states["switch"](PUSH.LEFT);
    } else if (direction === DIR.DOWN) {
      view.states.switchInstant(PUSH.DOWN);
      this.currentView.states["switch"](PUSH.UP);
    } else if (direction === DIR.LEFT) {
      view.states.switchInstant(PUSH.LEFT);
      this.currentView.states["switch"](PUSH.RIGHT);
    } else if (direction === DIR.UP) {
      view.states.switchInstant(PUSH.UP);
      this.currentView.states["switch"](PUSH.DOWN);
    } else {
      view.states.switchInstant(PUSH.CENTER);
      this.currentView.states.switchInstant(PUSH.LEFT);
    }
    view.states["switch"](PUSH.CENTER);
    this.previousView = this.currentView;
    this.currentView = view;
    if (preventHistory === false) {
      this.history.push(this.previousView);
    }
    return this.emit(Events.Change);
  };

  ViewNavigationController.prototype.removeBackButton = function(view) {
    return Utils.delay(0, (function(_this) {
      return function() {
        return view.subLayersByName(BACKBUTTON_VIEW_NAME)[0].visible = false;
      };
    })(this));
  };

  ViewNavigationController.prototype.back = function() {
    var direction, preventHistory, switchInstant;
    this.transition(this._getLastHistoryItem(), direction = DIR.LEFT, switchInstant = false, preventHistory = true);
    return this.history.pop();
  };

  ViewNavigationController.prototype._getLastHistoryItem = function() {
    return this.history[this.history.length - 1];
  };

  ViewNavigationController.prototype._applyBackButton = function(view, frame) {
    if (frame == null) {
      frame = this.backButtonFrame;
    }
    return Utils.delay(0, (function(_this) {
      return function() {
        var backButton;
        if (view.backButton !== false) {
          backButton = new Layer({
            name: BACKBUTTON_VIEW_NAME,
            width: 80,
            height: 80,
            superLayer: view
          });
          if (_this.debugMode === false) {
            backButton.backgroundColor = "transparent";
          }
          backButton.frame = frame;
          return backButton.on(Events.Click, function() {
            return _this.back();
          });
        }
      };
    })(this));
  };

  return ViewNavigationController;

})(Layer);



},{}],"framerKit":[function(require,module,exports){

/*
  FramerKit for Framer
  https://github.com/raphdamico/framerKit

  Copyright (c) 2015, Raph D'Amico http://raphdamico.com (@raphdamico)
  MIT License

  Readme:
  https://github.com/raphdamico/framerKit

  License:
  https://github.com/raphdamico/framerKit/blob/master/LICENSE.md
 */

/*
	DEFAULT STYLES
	Note the screenwidth constant: this is probably one of the
	first things you want to change so it matches the device
	you're prototyping on.
 */
var Caret, Check, Cross, Drum, Switch, defaults, quantize;

defaults = {
  screenWidth: 750
};


/*
	MORE STYLES
 */

defaults.tableRowHeight = 88;

defaults.tableRowHorizontalPadding = 20;

defaults.tint = 'grey';

defaults.lineTint = "rgba(200,200,200,1)";

defaults.switchTint = '#1DC24B';

defaults.itemBackground = 'white';

defaults.listItemTextStyle = {
  fontSize: "32px",
  lineHeight: (defaults.tableRowHeight - 4) + "px",
  fontFamily: "Helvetica Neue",
  fontWeight: "200"
};

defaults.dividerItemTextStyle = {
  fontSize: "22px",
  lineHeight: (defaults.tableRowHeight - 4) + "px",
  fontFamily: "Helvetica Neue",
  fontWeight: "200",
  textTransform: 'uppercase'
};

defaults.pickerTextStyle = {
  fontSize: "42px",
  fontFamily: "Helvetica Neue",
  fontWeight: "200"
};

exports.defaults = defaults;


/*
	TABLE VIEW ELEMENTS
	(e.g. "Thumb" for the switch control)
 */

Switch = function(params) {
  var shrunkenBackgroundDiameter, switchButtonRadius;
  params = params || {};
  _.defaults(params, {
    switchTint: defaults.switchTint,
    screenWidth: defaults.screenWidth,
    tableRowHeight: defaults.tableRowHeight,
    switchContainerBorder: 4,
    switchContainerHeight: 54,
    switchContainerWidth: 94,
    borderColor: defaults.lineTint
  });
  this.selected = true;
  switchButtonRadius = params.switchContainerHeight / 2;
  shrunkenBackgroundDiameter = 2;
  this.switchButtonContainer = new Layer({
    x: 0,
    y: 0,
    clip: false,
    width: params.switchContainerWidth,
    height: params.switchContainerHeight,
    backgroundColor: "",
    opacity: 1
  });
  this.switchBackground = new Layer({
    x: switchButtonRadius - shrunkenBackgroundDiameter / 2,
    y: switchButtonRadius - shrunkenBackgroundDiameter / 2 - 4,
    width: params.switchContainerWidth - params.switchContainerHeight + shrunkenBackgroundDiameter,
    height: params.switchContainerHeight - params.switchContainerHeight + shrunkenBackgroundDiameter,
    borderRadius: params.switchContainerHeight,
    shadowSpread: switchButtonRadius - shrunkenBackgroundDiameter / 2 + params.switchContainerBorder,
    shadowColor: params.switchTint,
    backgroundColor: '',
    opacity: 1,
    superLayer: this.switchButtonContainer
  });
  this.switchButton = new Layer({
    x: params.switchContainerWidth - params.switchContainerHeight,
    y: -4,
    width: switchButtonRadius * 2,
    height: switchButtonRadius * 2,
    borderRadius: switchButtonRadius,
    shadowY: 3,
    shadowBlur: 5,
    shadowColor: 'rgba(0,0,0,0.3)',
    backgroundColor: "white",
    opacity: 1,
    superLayer: this.switchButtonContainer
  });
  this.switchBackground.states.add({
    deselected: {
      x: 0,
      y: -4,
      width: params.switchContainerWidth,
      height: params.switchContainerHeight,
      shadowSpread: params.switchContainerBorder,
      saturate: 0,
      brightness: 153,
      backgroundColor: ""
    }
  });
  this.switchBackground.states.animationOptions = {
    curve: "ease-in-out",
    time: 0.3
  };
  this.switchBackground.on(Events.AnimationEnd, (function(_this) {
    return function() {
      return Utils.delay(0, function() {
        if (_this.selected) {
          return _this.switchBackground.backgroundColor = params.switchTint;
        }
      });
    };
  })(this));
  this.switchBackground.on(Events.AnimationStart, (function(_this) {
    return function() {
      return _this.switchBackground.backgroundColor = '';
    };
  })(this));
  this.switchButton.states.add({
    deselected: {
      x: 0
    }
  });
  this.switchButton.states.animationOptions = {
    curve: "spring(400,25,0)"
  };
  this.switchButtonContainer.select = (function(_this) {
    return function() {
      _this.selected = true;
      _this.switchBackground.states["switch"]("default");
      return _this.switchButton.states["switch"]("default");
    };
  })(this);
  this.switchButtonContainer.deselect = (function(_this) {
    return function() {
      _this.selected = false;
      _this.switchBackground.states["switch"]("deselected");
      return _this.switchButton.states["switch"]("deselected");
    };
  })(this);
  if (this.selected === false) {
    this.switchBackground.states.switchInstant("deselected");
    this.switchButton.states.switchInstant("deselected");
  } else {
    this.switchBackground.backgroundColor = params.switchTint;
  }
  return this.switchButtonContainer;
};

Cross = function() {
  var color, cross, crossDownstroke, crossThickness, crossUpstroke;
  color = defaults.tint;
  crossThickness = 4;
  cross = new Layer({
    width: 30,
    height: 30,
    backgroundColor: 'none'
  });
  crossUpstroke = new Layer({
    height: crossThickness,
    width: 20,
    backgroundColor: color,
    originX: 1,
    superLayer: cross
  });
  crossUpstroke.y = 14;
  crossUpstroke.rotationZ = 45;
  crossDownstroke = new Layer({
    height: crossThickness,
    width: 20,
    originX: 1,
    backgroundColor: color,
    superLayer: cross
  });
  crossDownstroke.rotationZ = -45;
  cross.select = function() {
    return cross.animate({
      properties: {
        opacity: 1,
        scale: 1
      },
      curve: 'spring(400,15,0)'
    });
  };
  cross.deselect = function() {
    return cross.animate({
      properties: {
        opacity: 0,
        scale: 0.4
      },
      curve: 'spring(400,15,0)'
    });
  };
  return cross;
};

Caret = function() {
  var caret, caretDownstroke, caretThickness, caretUpstroke, color;
  color = defaults.tint;
  caretThickness = 4;
  caret = new Layer({
    width: 30,
    height: 30,
    backgroundColor: 'none'
  });
  caretUpstroke = new Layer({
    height: caretThickness,
    width: 18,
    backgroundColor: color,
    originX: 1,
    superLayer: caret
  });
  caretUpstroke.y = 14;
  caretUpstroke.rotationZ = 45;
  caretDownstroke = new Layer({
    height: caretThickness,
    width: 18,
    originX: 1,
    backgroundColor: color,
    superLayer: caret
  });
  caretDownstroke.y = 12;
  caretDownstroke.rotationZ = -45;
  caret.select = function() {
    return caret.animate({
      properties: {
        opacity: 1,
        scale: 1
      },
      curve: 'spring(400,15,0)'
    });
  };
  caret.deselect = function() {
    return caret.animate({
      properties: {
        opacity: 0,
        scale: 0.4
      },
      curve: 'spring(400,15,0)'
    });
  };
  return caret;
};

Check = function() {
  var check, checkDownstroke, checkThickness, checkUpstroke, color;
  color = defaults.tint;
  checkThickness = 4;
  check = new Layer({
    width: 30,
    height: 30,
    backgroundColor: 'none'
  });
  checkUpstroke = new Layer({
    height: checkThickness,
    width: 13,
    backgroundColor: color,
    originX: 1,
    superLayer: check
  });
  checkUpstroke.y = 16;
  checkUpstroke.rotationZ = 45;
  checkDownstroke = new Layer({
    height: checkThickness,
    width: 22,
    originX: 1,
    backgroundColor: color,
    superLayer: check
  });
  checkDownstroke.x = 4;
  checkDownstroke.rotationZ = -45;
  check.select = function() {
    return check.animate({
      properties: {
        opacity: 1,
        scale: 1
      },
      curve: 'spring(400,15,0)'
    });
  };
  check.deselect = function() {
    return check.animate({
      properties: {
        opacity: 0,
        scale: 0.4
      },
      curve: 'spring(400,15,0)'
    });
  };
  return check;
};


/*
	TABLE VIEW
	
	--------------------------------------
	TableViewRow		[Elements go here]
	--------------------------------------
 */

exports.TableViewRow = function(params) {
  var shrunkenBackgroundDiameter, switchButtonRadius, thingToSwitch;
  _.defaults(params, {
    name: 'Give me a name!',
    x: 0,
    y: 0,
    enabled: true,
    selected: true,
    icon: 'check',
    textColor: defaults.tint,
    switchTint: defaults.switchTint,
    firstItemInList: true,
    lastItemInList: true,
    screenWidth: defaults.screenWidth,
    tableRowHorizontalPadding: defaults.tableRowHorizontalPadding,
    tableRowHeight: defaults.tableRowHeight,
    borderColor: defaults.lineTint
  });
  switchButtonRadius = params.switchContainerHeight / 2;
  shrunkenBackgroundDiameter = 2;
  this.listItemContainer = new Layer({
    x: params.x,
    y: params.y,
    width: defaults.screenWidth,
    height: defaults.tableRowHeight,
    clip: false,
    backgroundColor: defaults.itemBackground
  });
  this.listItemContainer.style = {
    borderTop: params.firstItemInList ? "1px solid " + params.borderColor : "",
    borderBottom: params.lastItemInList ? "1px solid " + params.borderColor : ""
  };
  this.enabled = params.enabled;
  this.selected = params.selected;
  this.listItem = new Layer({
    x: params.tableRowHorizontalPadding,
    width: defaults.screenWidth,
    height: defaults.tableRowHeight,
    superLayer: this.listItemContainer,
    backgroundColor: 'none'
  });
  this.listItem.style = defaults.listItemTextStyle;
  this.listItem.style = {
    color: params.textColor,
    borderTop: params.firstItemInList ? "" : "1px solid " + params.borderColor
  };
  this.listItem.html = params.name;
  thingToSwitch = (function() {
    switch (false) {
      case params.icon !== 'check':
        return new Check();
      case params.icon !== 'cross':
        return new Cross();
      case params.icon !== 'caret':
        return new Caret();
      case params.icon !== 'switch':
        return new Switch();
    }
  })();
  thingToSwitch.superLayer = this.listItemContainer;
  thingToSwitch.x = defaults.screenWidth - thingToSwitch.width - defaults.tableRowHorizontalPadding;
  thingToSwitch.centerY(2);
  if (params.icon === 'switch') {
    thingToSwitch.on(Events.Click, (function(_this) {
      return function() {
        return _this.listItemContainer["switch"]();
      };
    })(this));
  } else {
    this.listItem.on(Events.Click, (function(_this) {
      return function() {
        return _this.listItemContainer["switch"]();
      };
    })(this));
  }
  this.listItemContainer["switch"] = (function(_this) {
    return function() {
      if (_this.selected) {
        return _this.listItemContainer.deselect();
      } else {
        return _this.listItemContainer.select();
      }
    };
  })(this);
  this.listItemContainer.select = (function(_this) {
    return function(options) {
      options = options || {
        supressEvents: false
      };
      if (_this.enabled) {
        thingToSwitch.select();
        _this.selected = true;
      }
      if (options.supressEvents === false) {
        return _this.listItemContainer.emit("DidChange", {
          selected: _this.selected
        });
      }
    };
  })(this);
  this.listItemContainer.deselect = (function(_this) {
    return function(options) {
      options = options || {
        supressEvents: false
      };
      if (_this.enabled) {
        thingToSwitch.deselect();
        _this.selected = false;
      }
      if (options.supressEvents === false) {
        return _this.listItemContainer.emit("DidChange", {
          selected: _this.selected
        });
      }
    };
  })(this);
  this.listItemContainer.updateLabel = (function(_this) {
    return function(newText) {
      return _this.listItem.html = newText;
    };
  })(this);
  this.listItemContainer.selected = (function(_this) {
    return function() {
      return _this.selected;
    };
  })(this);
  this.listItemContainer.updateLabel(params.name);
  return this.listItemContainer;
};

exports.TableView = function(params) {
  var attachDefaultValidation, attachRadioButtonValidation, buttonName, firstItemInList, i, j, lastItemInList, len, newButton, ref;
  params = params || {};
  _.defaults(params, {
    y: 0,
    width: defaults.screenWidth,
    items: ["It's just me!"],
    icon: 'check',
    validation: 'none'
  });
  this.buttonGroupContainer = new Layer({
    x: 0,
    y: params.y,
    width: params.width,
    height: defaults.tableRowHeight * params.items.length,
    backgroundColor: "none"
  });
  this.buttonArray = [];
  ref = params.items;
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    buttonName = ref[i];
    firstItemInList = i === 0 ? true : false;
    lastItemInList = i === (params.items.length - 1) ? true : false;
    newButton = new exports.TableViewRow({
      x: 0,
      y: i * defaults.tableRowHeight,
      name: buttonName,
      icon: params.icon,
      firstItemInList: firstItemInList,
      lastItemInList: lastItemInList
    });
    this.buttonArray.push(newButton);
    newButton.superLayer = this.buttonGroupContainer;
  }
  attachRadioButtonValidation = (function(_this) {
    return function(buttonArray) {
      var buttonClicked, buttonGroupContainer, indexOfButtonClicked, k, len1, results;
      buttonGroupContainer = _this.buttonGroupContainer;
      results = [];
      for (indexOfButtonClicked = k = 0, len1 = buttonArray.length; k < len1; indexOfButtonClicked = ++k) {
        buttonClicked = buttonArray[indexOfButtonClicked];
        buttonClicked.deselect({
          supressEvents: true
        });
        results.push((function(buttonClicked, indexOfButtonClicked) {
          return buttonClicked.on('DidChange', (function(_this) {
            return function(event) {
              var l, len2, otherButton, otherButtonIndex;
              for (otherButtonIndex = l = 0, len2 = buttonArray.length; l < len2; otherButtonIndex = ++l) {
                otherButton = buttonArray[otherButtonIndex];
                if (otherButtonIndex !== indexOfButtonClicked) {
                  otherButton.deselect({
                    suppressEvents: true
                  });
                }
              }
              return buttonGroupContainer.emit("DidChange", {
                selected: indexOfButtonClicked,
                numSelected: 1,
                buttons: buttonArray
              });
            };
          })(this));
        })(buttonClicked, indexOfButtonClicked));
      }
      return results;
    };
  })(this);
  attachDefaultValidation = (function(_this) {
    return function(buttonArray) {
      var buttonClicked, buttonGroupContainer, indexOfButtonClicked, k, len1, results;
      buttonGroupContainer = _this.buttonGroupContainer;
      results = [];
      for (indexOfButtonClicked = k = 0, len1 = buttonArray.length; k < len1; indexOfButtonClicked = ++k) {
        buttonClicked = buttonArray[indexOfButtonClicked];
        buttonClicked.deselect({
          supressEvents: true
        });
        results.push((function(buttonClicked, indexOfButtonClicked) {
          return buttonClicked.on('DidChange', (function(_this) {
            return function(event) {
              var button, l, len2, numSelected, tableViewStates;
              numSelected = 0;
              tableViewStates = [];
              for (l = 0, len2 = buttonArray.length; l < len2; l++) {
                button = buttonArray[l];
                tableViewStates.push(button.selected());
                if (button.selected()) {
                  numSelected++;
                }
              }
              return buttonGroupContainer.emit("DidChange", {
                selected: tableViewStates,
                numSelected: numSelected,
                buttons: buttonArray
              });
            };
          })(this));
        })(buttonClicked, indexOfButtonClicked));
      }
      return results;
    };
  })(this);
  if (params.validation === 'radio') {
    attachRadioButtonValidation(this.buttonArray);
  } else {
    attachDefaultValidation(this.buttonArray);
  }
  return this.buttonGroupContainer;
};


/*
	TABLE VIEW HEADER
	In iOS, this is typically attached to the table view, 
	but it's independent here so you can put it wherever you want.
 */

exports.TableViewHeader = function(params) {
  var listDivider;
  params = params || {};
  _.defaults(params, {
    text: 'I am a divider',
    x: 0,
    y: 0
  });
  listDivider = new Layer({
    x: params.x + defaults.tableRowHorizontalPadding,
    y: params.y,
    width: defaults.screenWidth,
    backgroundColor: 'none'
  });
  listDivider.html = params.text;
  listDivider.style = defaults.dividerItemTextStyle;
  listDivider.style = {
    color: defaults.tint
  };
  return listDivider;
};


/*
	PICKER
	In iOS, this is typically attached to the table view, 
	but it's independent here so you can put it wherever you want.
 */

quantize = function(input, stepSize) {
  return Math.floor(input / stepSize) * stepSize;
};

Drum = function(parentDrumLayer, drumName, listItems, params) {
  var drumContainerHeight, firstTouchAvailable, i, intervalToupdateDrumAppearance, j, len, li, listHeight, listItemLayer, listLayer, listMaxYPos, listMinYPos, stopDrum, updateDrumAppearance, updateDrumValues;
  this.parentDrumLayer = parentDrumLayer;
  params = params || {};
  _.defaults(params, {
    enabled: true,
    xPct: 0,
    widthPct: 1,
    textAlign: "center",
    textPadding: "0",
    textColor: defaults.tint
  });
  drumContainerHeight = defaults.tableRowHeight * 5;
  listItems = listItems;
  this.name = drumName;
  this.index = 0;
  this.val = listItems[this.index];
  this.velocity = 0;
  firstTouchAvailable = true;
  intervalToupdateDrumAppearance = 0;
  listMinYPos = -defaults.tableRowHeight / 2;
  listMaxYPos = -listItems.length * defaults.tableRowHeight + defaults.tableRowHeight / 2;
  listHeight = listItems.length * defaults.tableRowHeight + drumContainerHeight;
  this.drumContainer = new Layer({
    x: params.xPct * defaults.screenWidth,
    y: 0,
    width: params.widthPct * defaults.screenWidth,
    height: drumContainerHeight,
    backgroundColor: "none",
    superLayer: parentDrumLayer
  });
  listLayer = new Layer({
    x: 0,
    y: -defaults.tableRowHeight / 2,
    width: params.widthPct * defaults.screenWidth,
    height: listHeight,
    superLayer: this.drumContainer,
    backgroundColor: "none"
  });
  listLayer.draggable.enabled = params.enabled;
  listLayer.draggable.speedX = 0;
  for (i = j = 0, len = listItems.length; j < len; i = ++j) {
    li = listItems[i];
    listItemLayer = new Layer({
      x: 0,
      y: i * defaults.tableRowHeight + drumContainerHeight / 2,
      width: params.widthPct * defaults.screenWidth,
      height: defaults.tableRowHeight,
      superLayer: listLayer,
      backgroundColor: "none"
    });
    listItemLayer.html = li;
    listItemLayer.style = {
      color: params.textColor,
      fontFamily: defaults.pickerTextStyle.fontFamily,
      fontWeight: defaults.pickerTextStyle.fontWeight,
      fontSize: defaults.pickerTextStyle.fontSize,
      lineHeight: defaults.tableRowHeight + "px",
      textAlign: params.textAlign,
      padding: params.textPadding
    };
    listItemLayer.startY = i * defaults.tableRowHeight + drumContainerHeight / 2;
  }
  listLayer.on(Events.DragMove, (function(_this) {
    return function() {
      if (firstTouchAvailable) {
        _this.drumContainer.emit("DrumStartedMoving", {
          drum: drumName,
          index: _this.index,
          value: _this.val,
          velocity: 0
        });
        firstTouchAvailable = false;
      }
      return updateDrumAppearance();
    };
  })(this));
  listLayer.on(Events.DragEnd, (function(_this) {
    return function(e, f) {
      var bottomOverflow, distanceToTravel, finalPositionAfterMomentum, listHeightWithoutEndBuffer, newDistanceToTravel, overflowDampening, scrollVelocity, timeAfterDrag, topOverflow;
      firstTouchAvailable = true;
      scrollVelocity = listLayer.draggable.calculateVelocity().y;
      timeAfterDrag = (0.5 + Math.abs(scrollVelocity * 0.2)).toFixed(1);
      finalPositionAfterMomentum = quantize(listLayer.y + scrollVelocity * 400, defaults.tableRowHeight) + defaults.tableRowHeight / 2;
      distanceToTravel = finalPositionAfterMomentum - listLayer.y;
      listHeightWithoutEndBuffer = -listItems.length * defaults.tableRowHeight;
      bottomOverflow = Math.max(0, listHeightWithoutEndBuffer - finalPositionAfterMomentum);
      topOverflow = Math.max(0, finalPositionAfterMomentum);
      overflowDampening = 10;
      if (bottomOverflow > 0) {
        finalPositionAfterMomentum = listHeightWithoutEndBuffer - (bottomOverflow / overflowDampening);
        newDistanceToTravel = finalPositionAfterMomentum - listLayer.y;
        timeAfterDrag = timeAfterDrag * (newDistanceToTravel / distanceToTravel);
      }
      if (topOverflow > 0) {
        finalPositionAfterMomentum = 40 + (topOverflow / overflowDampening);
        newDistanceToTravel = finalPositionAfterMomentum - listLayer.y;
        timeAfterDrag = timeAfterDrag * (newDistanceToTravel / distanceToTravel);
      }
      listLayer.animate({
        properties: {
          y: finalPositionAfterMomentum
        },
        time: timeAfterDrag,
        curve: "ease-out"
      });
      return Utils.delay(timeAfterDrag, function() {
        return stopDrum();
      });
    };
  })(this));
  listLayer.on(Events.AnimationStart, function() {
    clearInterval(intervalToupdateDrumAppearance);
    return intervalToupdateDrumAppearance = Utils.interval(1 / 30, updateDrumAppearance);
  });
  listLayer.on(Events.AnimationEnd, (function(_this) {
    return function() {
      clearInterval(intervalToupdateDrumAppearance);
      return _this.drumContainer.emit("DrumFinishedChanging", {
        list: drumName,
        index: _this.index,
        value: _this.val
      });
    };
  })(this));
  updateDrumAppearance = (function(_this) {
    return function() {
      var cappedListPosition, distanceFromMiddle, focusItem, itemsInDrum, k, listPosition, ref, ref1;
      itemsInDrum = 4;
      listPosition = listLayer.y / -defaults.tableRowHeight - 0.5;
      cappedListPosition = Math.max(0, Math.min(listLayer.y / -defaults.tableRowHeight - 0.5, listItems.length - 1));
      focusItem = Math.round(cappedListPosition);
      distanceFromMiddle = Math.abs(focusItem - cappedListPosition);
      for (i = k = ref = focusItem - itemsInDrum, ref1 = focusItem + itemsInDrum; ref <= ref1 ? k <= ref1 : k >= ref1; i = ref <= ref1 ? ++k : --k) {
        if (i >= 0 && i < listItems.length) {
          listLayer.subLayers[i].opacity = 1 - Math.abs(listPosition - i) / 5 - (i !== focusItem ? 0.3 : 0);
          listLayer.subLayers[i].scaleY = 1 - Math.min(1, Math.abs(listPosition - i) / 4);
          listLayer.subLayers[i].y = listLayer.subLayers[i].startY - (i - listPosition) * Math.abs(i - listPosition) * 10;
        }
      }
      if (_this.index !== focusItem) {
        return updateDrumValues(focusItem);
      }
    };
  })(this);
  stopDrum = (function(_this) {
    return function() {
      if (listLayer.y > listMinYPos) {
        listLayer.animate({
          properties: {
            y: listMinYPos
          },
          curve: "spring(400,50,0)"
        });
      }
      if (listLayer.y < listMaxYPos) {
        return listLayer.animate({
          properties: {
            y: listMaxYPos
          },
          curve: "spring(400,50,0)"
        });
      }
    };
  })(this);
  updateDrumValues = (function(_this) {
    return function(newIndex) {
      _this.index = newIndex;
      _this.val = listItems[_this.index];
      return _this.drumContainer.emit("DrumDidChange", {
        list: drumName,
        index: _this.index,
        value: _this.val
      });
    };
  })(this);
  updateDrumAppearance();
  this.setIndex = (function(_this) {
    return function(index) {
      var yPositionForThisIndex;
      yPositionForThisIndex = -defaults.tableRowHeight / 2 - (index * defaults.tableRowHeight);
      return listLayer.animate({
        properties: {
          y: yPositionForThisIndex
        },
        time: 0.5,
        curve: "ease-out"
      });
    };
  })(this);
  this.setValue = (function(_this) {
    return function(val) {
      var index;
      index = listItems.indexOf(val);
      if (index !== -1) {
        return _this.setIndex(index);
      }
    };
  })(this);
  return this;
};


/*
	PICKER
	This contains the picker
 */

exports.Picker = function(params) {
  var drum, drumContainerHeight, j, len, newDrum, pickerDidChange, pickerFinishedChanging, pickerStartedMoving, ref;
  params = params || {};
  _.defaults(params, {
    x: 0,
    y: 0,
    width: defaults.screenWidth,
    defaultText: "",
    textColor: defaults.tint
  });
  drumContainerHeight = defaults.tableRowHeight * 5;
  this.pickerContainer = new Layer({
    x: params.x,
    y: params.y,
    width: params.width,
    height: drumContainerHeight + 88,
    backgroundColor: defaults.itemBackground
  });
  this.drum = new Layer({
    x: 0,
    y: 88,
    width: params.width,
    height: drumContainerHeight,
    backgroundColor: "none",
    superLayer: this.pickerContainer
  });
  this.selectedItem = new Layer({
    x: 0,
    y: drumContainerHeight / 2 - defaults.tableRowHeight / 2,
    width: params.width,
    height: defaults.tableRowHeight,
    backgroundColor: "none",
    superLayer: this.drum
  });
  this.pickerContainer.pickerHeader = new Layer({
    x: 0,
    y: 0,
    width: params.width,
    height: 88,
    backgroundColor: defaults.itemBackground,
    superLayer: this.pickerContainer
  });
  this.drum.style = {
    pointerEvents: "none",
    borderTop: "1px solid " + defaults.lineTint,
    borderBottom: "1px solid " + defaults.lineTint
  };
  this.selectedItem.style = {
    pointerEvents: "none",
    borderTop: "1px solid rgba(0,0,0,0.3)",
    borderBottom: "1px solid rgba(0,0,0,0.3)"
  };
  this.pickerContainer.pickerHeader.style = defaults.listItemTextStyle;
  this.pickerContainer.pickerHeader.style = {
    color: params.textColor,
    paddingLeft: "20px",
    borderTop: "1px solid " + defaults.lineTint
  };
  this.pickerContainer.pickerHeader.html = params.defaultText;
  this.pickerContainer.drums = [];
  this.pickerContainer.drumsByName = {};
  pickerStartedMoving = (function(_this) {
    return function() {
      var drum, drumValues, newValues;
      drumValues = {};
      newValues = (function() {
        var j, len, ref, results;
        ref = this.pickerContainer.drums;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          drum = ref[j];
          results.push(drumValues[drum.name] = {
            index: drum.index,
            val: drum.val,
            velocity: 0
          });
        }
        return results;
      }).call(_this);
      return _this.pickerContainer.emit("PickerStartedMoving");
    };
  })(this);
  pickerDidChange = (function(_this) {
    return function() {
      var drum, drumValues, newValues;
      drumValues = {};
      newValues = (function() {
        var j, len, ref, results;
        ref = this.pickerContainer.drums;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          drum = ref[j];
          results.push(drumValues[drum.name] = {
            index: drum.index,
            val: drum.val
          });
        }
        return results;
      }).call(_this);
      return _this.pickerContainer.emit("PickerDidChange", drumValues);
    };
  })(this);
  pickerFinishedChanging = (function(_this) {
    return function() {
      var drum, drumValues, newValues;
      drumValues = {};
      newValues = (function() {
        var j, len, ref, results;
        ref = this.pickerContainer.drums;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          drum = ref[j];
          results.push(drumValues[drum.name] = {
            index: drum.index,
            val: drum.val
          });
        }
        return results;
      }).call(_this);
      return _this.pickerContainer.emit("PickerFinishedChanging", drumValues);
    };
  })(this);
  if (params.drums && params.drums.length > 0) {
    ref = params.drums;
    for (j = 0, len = ref.length; j < len; j++) {
      drum = ref[j];
      newDrum = new Drum(this.drum, drum.name, drum.items, drum.params);
      this.pickerContainer.drums.push(newDrum);
      this.pickerContainer.drumsByName[drum.name] = newDrum;
      newDrum.drumContainer.on("DrumDidChange", pickerDidChange);
      newDrum.drumContainer.on("DrumFinishedChanging", pickerFinishedChanging);
      newDrum.drumContainer.on("DrumStartedMoving", pickerStartedMoving);
    }
  }
  return this.pickerContainer;
};



},{}],"tabBarModule":[function(require,module,exports){

/*
	tabBarModule
	–
	Created by Petter Nilsson
	http://petter.pro
 */
var defaults, getItemFromName, setBadgeValue, setSelected, updateViews;

defaults = {
  screenWidth: Screen.width,
  screenHeight: Screen.height,
  barHeight: 98,
  labelOffset: -28,
  iconOffset: -12,
  tintColor: "#007aff",
  tintColorUnselected: "#929292",
  blur: 40,
  opacity: 0.75,
  borderShadow: "0px -1px 0px 0px rgba(0,0,0,0.32)",
  backgroundColor: "#f8f8f8",
  showLabels: true,
  badgeSize: 36,
  badgeColor: "#FF3B30"
};

defaults.labelTextStyle = {
  fontSize: "20px",
  textAlign: "center",
  fontFamily: "Helvetica Neue', sans-serif"
};

defaults.badgeTextStyle = {
  fontSize: "26px",
  lineHeight: "36px",
  color: "#fff",
  textAlign: "center",
  fontFamily: "Helvetica Neue', sans-serif"
};

exports.defaults = defaults;

getItemFromName = function(name) {
  var item, j, len, ref;
  ref = this.items;
  for (j = 0, len = ref.length; j < len; j++) {
    item = ref[j];
    if (item.name === name) {
      return item;
    }
  }
};

updateViews = function(selectedItem) {
  var item, j, len, ref, results;
  ref = this.items;
  results = [];
  for (j = 0, len = ref.length; j < len; j++) {
    item = ref[j];
    if (item.view != null) {
      if (item.view === selectedItem.view) {
        item.view.visible = true;
      } else {
        item.view.visible = false;
      }
      if (item.blurView === selectedItem.blurView) {
        results.push(item.blurView.visible = true);
      } else {
        results.push(item.blurView.visible = false);
      }
    } else {
      results.push(void 0);
    }
  }
  return results;
};

setSelected = function(name) {
  var item, j, len, ref, results;
  if (name !== this.selected) {
    ref = this.items;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      item = ref[j];
      if (item.name === name) {
        item.iconLayer.backgroundColor = defaults.tintColor;
        if (item.labelLayer) {
          item.labelLayer.style = {
            "color": defaults.tintColor
          };
        }
        if (item.iconLayer.selectedIcon) {
          item.iconLayer.style = {
            "-webkit-mask-image": "url(" + item.iconLayer.selectedIcon + ")"
          };
        }
        this.selected = item.name;
        this.updateViews(item);
        results.push(this.emit("tabBarDidSwitch", item.name));
      } else {
        item.iconLayer.backgroundColor = defaults.tintColorUnselected;
        if (item.labelLayer) {
          item.labelLayer.style = {
            "color": defaults.tintColorUnselected
          };
        }
        if (item.iconLayer.selectedIcon) {
          results.push(item.iconLayer.style = {
            "-webkit-mask-image": "url(" + item.iconLayer.icon + ")"
          });
        } else {
          results.push(void 0);
        }
      }
    }
    return results;
  }
};

setBadgeValue = function(name, value) {
  var item, j, len, ref, results;
  ref = this.items;
  results = [];
  for (j = 0, len = ref.length; j < len; j++) {
    item = ref[j];
    if (item.name === name) {
      if (value) {
        item.badgeLayer.html = value;
        results.push(item.badgeLayer.visible = true);
      } else {
        results.push(item.badgeLayer.visible = false);
      }
    } else {
      results.push(void 0);
    }
  }
  return results;
};

exports.tabBar = function(barItems) {
  var background, badgeLayer, blurView, i, iconLayer, itemCount, itemLayer, labelLayer, name, params, tabBar;
  tabBar = new Layer({
    x: 0,
    y: defaults.screenHeight - defaults.barHeight,
    width: defaults.screenWidth,
    height: defaults.barHeight,
    backgroundColor: defaults.backgroundColor
  });
  tabBar.style = {
    "box-shadow": defaults.borderShadow
  };
  tabBar.getItemFromName = getItemFromName;
  tabBar.updateViews = updateViews;
  tabBar.setSelected = setSelected;
  tabBar.setBadgeValue = setBadgeValue;
  tabBar.selected = null;
  tabBar.items = [];
  background = new Layer({
    x: 0,
    y: 0,
    width: defaults.screenWidth,
    height: defaults.barHeight,
    backgroundColor: defaults.backgroundColor,
    opacity: defaults.opacity,
    superLayer: tabBar
  });
  itemCount = Object.keys(barItems).length;
  i = 0;
  for (name in barItems) {
    params = barItems[name];
    itemLayer = new Layer({
      backgroundColor: "none",
      width: defaults.screenWidth / itemCount,
      height: defaults.barHeight,
      x: i * (defaults.screenWidth / itemCount),
      y: 0,
      superLayer: tabBar,
      name: name
    });
    if (params.view != null) {
      blurView = params.view.copy();
      if (ScrollComponent.prototype.isPrototypeOf(blurView)) {
        blurView.content.blur = defaults.blur;
      } else {
        blurView.blur = defaults.blur;
      }
      blurView.superLayer = tabBar;
      blurView.index = 0;
      blurView.y = blurView.y - (defaults.screenHeight - defaults.barHeight);
      itemLayer.view = params.view;
      itemLayer.blurView = blurView;
    }
    iconLayer = new Layer({
      width: 60,
      height: 60,
      superLayer: itemLayer
    });
    iconLayer.icon = params.icon;
    if (params.selectedIcon != null) {
      iconLayer.selectedIcon = params.selectedIcon;
    }
    iconLayer.style = {
      "-webkit-mask-image": "url(" + iconLayer.icon + ")",
      "-webkit-mask-repeat": "no-repeat",
      "-webkit-mask-position": "center center"
    };
    iconLayer.centerX();
    iconLayer.centerY(defaults.iconOffset);
    itemLayer.iconLayer = iconLayer;
    if (defaults.showLabels) {
      labelLayer = new Layer({
        width: itemLayer.width,
        x: 0,
        y: defaults.barHeight + defaults.labelOffset,
        superLayer: itemLayer,
        backgroundColor: "none"
      });
      labelLayer.html = name;
      labelLayer.style = defaults.labelTextStyle;
      itemLayer.labelLayer = labelLayer;
    }
    badgeLayer = new Layer({
      width: defaults.badgeSize,
      height: defaults.badgeSize,
      x: 0,
      y: 6,
      borderRadius: 18,
      superLayer: itemLayer,
      backgroundColor: defaults.badgeColor
    });
    badgeLayer.style = defaults.badgeTextStyle;
    badgeLayer.centerX(26);
    itemLayer.badgeLayer = badgeLayer;
    itemLayer.badgeLayer.visible = false;
    tabBar.items.push(itemLayer);
    itemLayer.on(Events.Click, function() {
      return tabBar.setSelected(this.name);
    });
    i++;
  }
  tabBar.setSelected(tabBar.items[0].name);
  return tabBar;
};



},{}],"welcomeScreen":[function(require,module,exports){
exports.bg = new BackgroundLayer;

exports.bg.backgroundColor = 'white';

exports.title = new Layer({
  backgroundColor: 'transparent',
  html: 'Framer Scaffold,<br> quick start with basic modules.',
  style: {
    'color': 'slategray',
    'text-align': 'center',
    'font-family': 'San Francisco Display',
    'font-weight': '500',
    'font-size': '48px',
    'line-height': '120%',
    'padding': '10px'
  },
  width: Screen.width,
  height: 400,
  y: 300
});

exports.spark = new Layer({
  image: "images/flat-spark.png",
  scale: 2.5
});

exports.spark.center();



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvemFjaGFyeS9SZXBvcy9mcmFtZXJTY2FmZm9sZC5mcmFtZXIvbW9kdWxlcy9WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIuY29mZmVlIiwiL1VzZXJzL3phY2hhcnkvUmVwb3MvZnJhbWVyU2NhZmZvbGQuZnJhbWVyL21vZHVsZXMvZnJhbWVyS2l0LmNvZmZlZSIsIi9Vc2Vycy96YWNoYXJ5L1JlcG9zL2ZyYW1lclNjYWZmb2xkLmZyYW1lci9tb2R1bGVzL3RhYkJhck1vZHVsZS5jb2ZmZWUiLCIvVXNlcnMvemFjaGFyeS9SZXBvcy9mcmFtZXJTY2FmZm9sZC5mcmFtZXIvbW9kdWxlcy93ZWxjb21lU2NyZWVuLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7NkJBQUE7O0FBQUEsT0FBYSxDQUFDO0FBR2IsTUFBQSxvR0FBQTs7QUFBQSw4Q0FBQSxDQUFBOztBQUFBLEVBQUEsaUJBQUEsR0FBb0IsYUFBcEIsQ0FBQTs7QUFBQSxFQUNBLG9CQUFBLEdBQXVCLGdCQUR2QixDQUFBOztBQUFBLEVBRUEsaUJBQUEsR0FDQztBQUFBLElBQUEsSUFBQSxFQUFNLEdBQU47QUFBQSxJQUNBLEtBQUEsRUFBTyxhQURQO0dBSEQsQ0FBQTs7QUFBQSxFQUtBLGlCQUFBLEdBQ0M7QUFBQSxJQUFBLENBQUEsRUFBRyxDQUFIO0FBQUEsSUFDQSxDQUFBLEVBQUcsRUFESDtBQUFBLElBRUEsS0FBQSxFQUFPLEVBRlA7QUFBQSxJQUdBLE1BQUEsRUFBUSxFQUhSO0dBTkQsQ0FBQTs7QUFBQSxFQVVBLElBQUEsR0FDQztBQUFBLElBQUEsRUFBQSxFQUFRLFFBQVI7QUFBQSxJQUNBLElBQUEsRUFBUSxVQURSO0FBQUEsSUFFQSxJQUFBLEVBQVEsVUFGUjtBQUFBLElBR0EsS0FBQSxFQUFRLFdBSFI7QUFBQSxJQUlBLE1B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YyxRQUZSO0FBQUEsSUFHTixhQUFBLEVBQWUsdUJBSFQ7QUFBQSxJQUlOLGFBQUEsRUFBZSxLQUpUO0FBQUEsSUFLTixXQUFBLEVBQWEsTUFMUDtBQUFBLElBTU4sYUFBQSxFQUFlLE1BTlQ7QUFBQSxJQU9OLFNBQUEsRUFBVyxNQVBMO0dBRlA7QUFBQSxFQVVBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FWZDtBQUFBLEVBV0EsTUFBQSxFQUFRLEdBWFI7QUFBQSxFQVlBLENBQUEsRUFBRyxHQVpIO0NBRG1CLENBSnBCLENBQUE7O0FBQUEsT0FxQk8sQ0FBQyxLQUFSLEdBQW9CLElBQUEsS0FBQSxDQUNuQjtBQUFBLEVBQUEsS0FBQSxFQUFPLHVCQUFQO0FBQUEsRUFDQSxLQUFBLEVBQU8sR0FEUDtDQURtQixDQXJCcEIsQ0FBQTs7QUFBQSxPQXlCTyxDQUFDLEtBQUssQ0FBQyxNQUFkLENBQUEsQ0F6QkEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBleHBvcnRzLlZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBleHRlbmRzIExheWVyXG5cblx0IyBTZXR1cCBDbGFzcyBDb25zdGFudHNcblx0SU5JVElBTF9WSUVXX05BTUUgPSBcImluaXRpYWxWaWV3XCJcblx0QkFDS0JVVFRPTl9WSUVXX05BTUUgPSBcInZuYy1iYWNrQnV0dG9uXCJcblx0QU5JTUFUSU9OX09QVElPTlMgPVxuXHRcdHRpbWU6IDAuM1xuXHRcdGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblx0QkFDS19CVVRUT05fRlJBTUUgPVxuXHRcdHg6IDBcblx0XHR5OiA0MFxuXHRcdHdpZHRoOiA4OFxuXHRcdGhlaWdodDogODhcblx0UFVTSCA9XG5cdFx0VVA6ICAgICBcInB1c2hVcFwiXG5cdFx0RE9XTjogICBcInB1c2hEb3duXCJcblx0XHRMRUZUOiAgIFwicHVzaExlZnRcIlxuXHRcdFJJR0hUOiAgXCJwdXNoUmlnaHRcIlxuXHRcdENFTlRFUjogXCJwdXNoQ2VudGVyXCJcblx0RElSID1cblx0XHRVUDogICAgXCJ1cFwiXG5cdFx0RE9XTjogIFwiZG93blwiXG5cdFx0TEVGVDogIFwibGVmdFwiXG5cdFx0UklHSFQ6IFwicmlnaHRcIlxuXHRERUJVR19NT0RFID0gZmFsc2VcblxuXHQjIFNldHVwIEluc3RhbmNlIGFuZCBJbnN0YW5jZSBWYXJpYWJsZXNcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblxuXHRcdEB2aWV3cyA9IEBoaXN0b3J5ID0gQGluaXRpYWxWaWV3ID0gQGN1cnJlbnRWaWV3ID0gQHByZXZpb3VzVmlldyA9IEBhbmltYXRpb25PcHRpb25zID0gQGluaXRpYWxWaWV3TmFtZSA9IG51bGxcblx0XHRAb3B0aW9ucy53aWR0aCAgICAgICAgICAgPz0gU2NyZWVuLndpZHRoXG5cdFx0QG9wdGlvbnMuaGVpZ2h0ICAgICAgICAgID89IFNjcmVlbi5oZWlnaHRcblx0XHRAb3B0aW9ucy5jbGlwICAgICAgICAgICAgPz0gdHJ1ZVxuXHRcdEBvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcIiM5OTlcIlxuXG5cdFx0c3VwZXIgQG9wdGlvbnNcblxuXHRcdEB2aWV3cyAgID0gW11cblx0XHRAaGlzdG9yeSA9IFtdXG5cdFx0QGFuaW1hdGlvbk9wdGlvbnMgPSBAb3B0aW9ucy5hbmltYXRpb25PcHRpb25zIG9yIEFOSU1BVElPTl9PUFRJT05TXG5cdFx0QGluaXRpYWxWaWV3TmFtZSAgPSBAb3B0aW9ucy5pbml0aWFsVmlld05hbWUgIG9yIElOSVRJQUxfVklFV19OQU1FXG5cdFx0QGJhY2tCdXR0b25GcmFtZSAgPSBAb3B0aW9ucy5iYWNrQnV0dG9uRnJhbWUgIG9yIEJBQ0tfQlVUVE9OX0ZSQU1FXG5cdFx0QGRlYnVnTW9kZSAgICAgICAgPSBAb3B0aW9ucy5kZWJ1Z01vZGUgICAgICAgIG9yIERFQlVHX01PREVcblxuXHRcdEAub24gXCJjaGFuZ2U6c3ViTGF5ZXJzXCIsIChjaGFuZ2VMaXN0KSAtPlxuXHRcdFx0QGFkZFZpZXcgc3ViTGF5ZXIsIHRydWUgZm9yIHN1YkxheWVyIGluIGNoYW5nZUxpc3QuYWRkZWRcblxuXHRhZGRWaWV3OiAodmlldywgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudCkgLT5cblxuXHRcdHZuY1dpZHRoICA9IEBvcHRpb25zLndpZHRoXG5cdFx0dm5jSGVpZ2h0ID0gQG9wdGlvbnMuaGVpZ2h0XG5cblx0XHR2aWV3LnN0YXRlcy5hZGQoXG5cdFx0XHRcIiN7IFBVU0guVVAgfVwiOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IC12bmNIZWlnaHRcblx0XHRcdFwiI3sgUFVTSC5MRUZUIH1cIjpcblx0XHRcdFx0eDogLXZuY1dpZHRoXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5DRU5URVIgfVwiOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5SSUdIVCB9XCI6XG5cdFx0XHRcdHg6IHZuY1dpZHRoXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5ET1dOIH1cIjpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiB2bmNIZWlnaHRcblx0XHQpXG5cblxuXHRcdHZpZXcuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9uc1xuXG5cdFx0aWYgdmlldy5uYW1lIGlzIEBpbml0aWFsVmlld05hbWVcblx0XHRcdEBpbml0aWFsVmlldyA9IHZpZXdcblx0XHRcdEBjdXJyZW50VmlldyA9IHZpZXdcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5DRU5URVJcblx0XHRcdEBoaXN0b3J5LnB1c2ggdmlld1xuXHRcdGVsc2Vcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5SSUdIVFxuXG5cdFx0dW5sZXNzIHZpZXcuc3VwZXJMYXllciBpcyBAIG9yIHZpYUludGVybmFsQ2hhbmdlRXZlbnRcblx0XHRcdHZpZXcuc3VwZXJMYXllciA9IEBcblxuXHRcdEBfYXBwbHlCYWNrQnV0dG9uIHZpZXcgdW5sZXNzIHZpZXcubmFtZSBpcyBAaW5pdGlhbFZpZXdOYW1lXG5cblx0XHRAdmlld3MucHVzaCB2aWV3XG5cblx0dHJhbnNpdGlvbjogKHZpZXcsIGRpcmVjdGlvbiA9IERJUi5SSUdIVCwgc3dpdGNoSW5zdGFudCA9IGZhbHNlLCBwcmV2ZW50SGlzdG9yeSA9IGZhbHNlKSAtPlxuXG5cdFx0cmV0dXJuIGZhbHNlIGlmIHZpZXcgaXMgQGN1cnJlbnRWaWV3XG5cblx0XHQjIFNldHVwIFZpZXdzIGZvciB0aGUgdHJhbnNpdGlvblxuXG5cdFx0aWYgZGlyZWN0aW9uIGlzIERJUi5SSUdIVFxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5SSUdIVFxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5MRUZUXG5cdFx0ZWxzZSBpZiBkaXJlY3Rpb24gaXMgRElSLkRPV05cblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guRE9XTlxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5VUFxuXHRcdGVsc2UgaWYgZGlyZWN0aW9uIGlzIERJUi5MRUZUXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILkxFRlRcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guUklHSFRcblx0XHRlbHNlIGlmIGRpcmVjdGlvbiBpcyBESVIuVVBcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guVVBcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guRE9XTlxuXHRcdGVsc2Vcblx0XHRcdCMgSWYgdGhleSBzcGVjaWZpZWQgc29tZXRoaW5nIGRpZmZlcmVudCBqdXN0IHN3aXRjaCBpbW1lZGlhdGVseVxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBQVVNILkNFTlRFUlxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guTEVGVFxuXG5cdFx0IyBQdXNoIHZpZXcgdG8gQ2VudGVyXG5cdFx0dmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guQ0VOVEVSXG5cdFx0IyBjdXJyZW50VmlldyBpcyBub3cgb3VyIHByZXZpb3VzVmlld1xuXHRcdEBwcmV2aW91c1ZpZXcgPSBAY3VycmVudFZpZXdcblx0XHQjIFNldCBvdXIgY3VycmVudFZpZXcgdG8gdGhlIHZpZXcgd2UncmUgYnJpbmdpbmcgaW5cblx0XHRAY3VycmVudFZpZXcgPSB2aWV3XG5cblx0XHQjIFN0b3JlIHRoZSBsYXN0IHZpZXcgaW4gaGlzdG9yeVxuXHRcdEBoaXN0b3J5LnB1c2ggQHByZXZpb3VzVmlldyBpZiBwcmV2ZW50SGlzdG9yeSBpcyBmYWxzZVxuXG5cdFx0QGVtaXQgRXZlbnRzLkNoYW5nZVxuXG5cdHJlbW92ZUJhY2tCdXR0b246ICh2aWV3KSAtPlxuXHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdFx0XHR2aWV3LnN1YkxheWVyc0J5TmFtZShCQUNLQlVUVE9OX1ZJRVdfTkFNRSlbMF0udmlzaWJsZSA9IGZhbHNlXG5cblx0YmFjazogKCkgLT5cblx0XHRAdHJhbnNpdGlvbihAX2dldExhc3RIaXN0b3J5SXRlbSgpLCBkaXJlY3Rpb24gPSBESVIuTEVGVCwgc3dpdGNoSW5zdGFudCA9IGZhbHNlLCBwcmV2ZW50SGlzdG9yeSA9IHRydWUpXG5cdFx0QGhpc3RvcnkucG9wKClcblxuXHRfZ2V0TGFzdEhpc3RvcnlJdGVtOiAoKSAtPlxuXHRcdHJldHVybiBAaGlzdG9yeVtAaGlzdG9yeS5sZW5ndGggLSAxXVxuXG5cdF9hcHBseUJhY2tCdXR0b246ICh2aWV3LCBmcmFtZSA9IEBiYWNrQnV0dG9uRnJhbWUpIC0+XG5cdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0XHRcdGlmIHZpZXcuYmFja0J1dHRvbiBpc250IGZhbHNlXG5cdFx0XHRcdGJhY2tCdXR0b24gPSBuZXcgTGF5ZXJcblx0XHRcdFx0XHRuYW1lOiBCQUNLQlVUVE9OX1ZJRVdfTkFNRVxuXHRcdFx0XHRcdHdpZHRoOiA4MFxuXHRcdFx0XHRcdGhlaWdodDogODBcblx0XHRcdFx0XHRzdXBlckxheWVyOiB2aWV3XG5cblx0XHRcdFx0aWYgQGRlYnVnTW9kZSBpcyBmYWxzZVxuXHRcdFx0XHRcdGJhY2tCdXR0b24uYmFja2dyb3VuZENvbG9yID0gXCJ0cmFuc3BhcmVudFwiXG5cblx0XHRcdFx0YmFja0J1dHRvbi5mcmFtZSA9IGZyYW1lXG5cblx0XHRcdFx0YmFja0J1dHRvbi5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRcdFx0QGJhY2soKVxuXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgVVNBR0UgRVhBTVBMRSAxIC0gRGVmaW5lIEluaXRpYWxWaWV3TmFtZSAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiMgaW5pdGlhbFZpZXdLZXkgPSBcInZpZXcxXCJcbiNcbiMgdm5jID0gbmV3IFZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBpbml0aWFsVmlld05hbWU6IGluaXRpYWxWaWV3S2V5XG4jIHZpZXcxID0gbmV3IExheWVyXG4jIFx0bmFtZTogaW5pdGlhbFZpZXdLZXlcbiMgXHR3aWR0aDogIFNjcmVlbi53aWR0aFxuIyBcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuIyBcdGJhY2tncm91bmRDb2xvcjogXCJyZWRcIlxuIyBcdHN1cGVyTGF5ZXI6IHZuY1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuIyBVU0FHRSBFWEFNUExFIDIgLSBVc2UgZGVmYXVsdCBpbml0aWFsVmlld05hbWUgXCJpbml0aWFsVmlld1wiICMjIyMjIyMjIyMjIyMjIyMjI1xuXG4jIHZuYyA9IG5ldyBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXJcblxuIyB2aWV3MSA9IG5ldyBMYXllclxuIyBcdG5hbWU6IFwiaW5pdGlhbFZpZXdcIlxuIyBcdHdpZHRoOiAgU2NyZWVuLndpZHRoXG4jIFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG4jIFx0YmFja2dyb3VuZENvbG9yOiBcInJlZFwiXG4jIFx0c3VwZXJMYXllcjogdm5jXG5cbiMgdmlldzIgPSBuZXcgTGF5ZXJcbiMgXHR3aWR0aDogIFNjcmVlbi53aWR0aFxuIyBcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuIyBcdGJhY2tncm91bmRDb2xvcjogXCJncmVlblwiXG4jIFx0c3VwZXJMYXllcjogdm5jXG5cbiMgdmlldzEub24gRXZlbnRzLkNsaWNrLCAtPiB2bmMudHJhbnNpdGlvbiB2aWV3MlxuIyB2aWV3Mi5vbiBFdmVudHMuQ2xpY2ssIC0+IHZuYy5iYWNrKClcbiIsIiMjI1xuICBGcmFtZXJLaXQgZm9yIEZyYW1lclxuICBodHRwczovL2dpdGh1Yi5jb20vcmFwaGRhbWljby9mcmFtZXJLaXRcblxuICBDb3B5cmlnaHQgKGMpIDIwMTUsIFJhcGggRCdBbWljbyBodHRwOi8vcmFwaGRhbWljby5jb20gKEByYXBoZGFtaWNvKVxuICBNSVQgTGljZW5zZVxuXG4gIFJlYWRtZTpcbiAgaHR0cHM6Ly9naXRodWIuY29tL3JhcGhkYW1pY28vZnJhbWVyS2l0XG5cbiAgTGljZW5zZTpcbiAgaHR0cHM6Ly9naXRodWIuY29tL3JhcGhkYW1pY28vZnJhbWVyS2l0L2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiMjI1xuXG5cblxuXG4jIyNcblx0REVGQVVMVCBTVFlMRVNcblx0Tm90ZSB0aGUgc2NyZWVud2lkdGggY29uc3RhbnQ6IHRoaXMgaXMgcHJvYmFibHkgb25lIG9mIHRoZVxuXHRmaXJzdCB0aGluZ3MgeW91IHdhbnQgdG8gY2hhbmdlIHNvIGl0IG1hdGNoZXMgdGhlIGRldmljZVxuXHR5b3UncmUgcHJvdG90eXBpbmcgb24uXG4jIyNcbmRlZmF1bHRzID0ge1xuXHRzY3JlZW5XaWR0aDogNzUwXG59XG5cbiMjI1xuXHRNT1JFIFNUWUxFU1xuIyMjXG5kZWZhdWx0cy50YWJsZVJvd0hlaWdodCA9IDg4XG5kZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nID0gMjBcbmRlZmF1bHRzLnRpbnQgPSAnZ3JleSdcbmRlZmF1bHRzLmxpbmVUaW50ID0gXCJyZ2JhKDIwMCwyMDAsMjAwLDEpXCJcbmRlZmF1bHRzLnN3aXRjaFRpbnQgPSAnIzFEQzI0QidcbmRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kID0gJ3doaXRlJ1xuZGVmYXVsdHMubGlzdEl0ZW1UZXh0U3R5bGUgPSB7XG5cdGZvbnRTaXplOiBcIjMycHhcIlxuXHRsaW5lSGVpZ2h0OiAoZGVmYXVsdHMudGFibGVSb3dIZWlnaHQtNCkrXCJweFwiXHRcdFxuXHRmb250RmFtaWx5OiBcIkhlbHZldGljYSBOZXVlXCJcblx0Zm9udFdlaWdodDogXCIyMDBcIlxufVxuZGVmYXVsdHMuZGl2aWRlckl0ZW1UZXh0U3R5bGUgPSB7XG5cdGZvbnRTaXplOiBcIjIycHhcIlxuXHRsaW5lSGVpZ2h0OiAoZGVmYXVsdHMudGFibGVSb3dIZWlnaHQtNCkrXCJweFwiXHRcdFxuXHRmb250RmFtaWx5OiBcIkhlbHZldGljYSBOZXVlXCJcblx0Zm9udFdlaWdodDogXCIyMDBcIlxuXHR0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJ1xufVxuZGVmYXVsdHMucGlja2VyVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXHRcdFwiNDJweFwiXG5cdGZvbnRGYW1pbHk6IFx0XCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdGZvbnRXZWlnaHQ6IFx0XCIyMDBcIlxufVxuZXhwb3J0cy5kZWZhdWx0cyA9IGRlZmF1bHRzXG5cblxuIyMjXG5cdFRBQkxFIFZJRVcgRUxFTUVOVFNcblx0KGUuZy4gXCJUaHVtYlwiIGZvciB0aGUgc3dpdGNoIGNvbnRyb2wpXG4jIyNcblxuU3dpdGNoID0gKHBhcmFtcykgLT5cblx0cGFyYW1zID0gcGFyYW1zIG9yIHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLCBcblx0XHRzd2l0Y2hUaW50OiBkZWZhdWx0cy5zd2l0Y2hUaW50XG5cdFx0c2NyZWVuV2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0dGFibGVSb3dIZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0c3dpdGNoQ29udGFpbmVyQm9yZGVyOiA0XG5cdFx0c3dpdGNoQ29udGFpbmVySGVpZ2h0OiA1NFxuXHRcdHN3aXRjaENvbnRhaW5lcldpZHRoOiA5NFxuXHRcdGJvcmRlckNvbG9yOiBkZWZhdWx0cy5saW5lVGludCAjIEdyZXkgcm91bmRlZCBwaWxsICYgYm9yZGVycyBiZXR3ZWVuIGNlbGxzXG5cblx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcblx0IyBTb21lIG9mIHRoZSB2YWx1ZXMgYXJlIGJhc2VkIG9uIG90aGVyIGNvbnN0YW50cyxcblx0IyBzbyB5b3UgaGF2ZSB0byBjYWxjdWxhdGUgdGhlbSBpbiBhIHNlY29uZCBwYXNzXG5cdHN3aXRjaEJ1dHRvblJhZGl1cyA9IHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQvMlxuXHRzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlciA9IDJcblx0XG5cdCMgVGhpcyBpcyBvdXIgZmFuY3kgYW5pbWF0ZWQgc3dpdGNoIHN3aXRjaFxuXHQjIHdlIG5lZWQgdG8gbWFrZSBhIHJvdW5kZWQgcmVjdGFuZ2xlIHdpdGggYSBjaXJjbGUgaW5zaWRlIGl0LlxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdFx0XHRcdDBcblx0XHR5OiBcdFx0XHRcdFx0MFxuXHRcdGNsaXA6IFx0XHRcdFx0ZmFsc2UgIyBDbGlwcGluZyBodXJ0cyB0aGUgc3VidGxlIHNoYWRvdyBvbiB0aGUgYnV0dG9uXG5cdFx0d2lkdGg6XHRcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGggXG5cdFx0aGVpZ2h0Olx0XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIlwiXG5cdFx0b3BhY2l0eTogXHRcdFx0MVxuXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kID0gbmV3IExheWVyXG5cdFx0eDpcdFx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzIC0gc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIvMlxuXHRcdHk6XHRcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzIgLSA0XG5cdFx0d2lkdGg6IFx0XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIC0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodCArIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyXG5cdFx0aGVpZ2h0OiBcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0IC0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodCArIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyXG5cdFx0Ym9yZGVyUmFkaXVzOiBcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdHNoYWRvd1NwcmVhZDpcdFx0c3dpdGNoQnV0dG9uUmFkaXVzIC0gc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIvMiArIHBhcmFtcy5zd2l0Y2hDb250YWluZXJCb3JkZXJcblx0XHRzaGFkb3dDb2xvcjogXHRcdHBhcmFtcy5zd2l0Y2hUaW50XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdCcnXG5cdFx0b3BhY2l0eTogXHRcdFx0MVxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFx0XG5cdEBzd2l0Y2hCdXR0b24gPSBuZXcgTGF5ZXJcblx0XHR4OiBwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGggLSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0XG5cdFx0eTogLTRcblx0XHR3aWR0aDpcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyoyXG5cdFx0aGVpZ2h0Olx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzKjJcblx0XHRib3JkZXJSYWRpdXM6IFx0XHRzd2l0Y2hCdXR0b25SYWRpdXNcblx0XHRzaGFkb3dZOlx0XHRcdDNcblx0XHRzaGFkb3dCbHVyOiBcdFx0NVxuXHRcdHNoYWRvd0NvbG9yOiBcdFx0J3JnYmEoMCwwLDAsMC4zKSdcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJ3aGl0ZVwiXG5cdFx0b3BhY2l0eTogXHRcdFx0MVxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFxuXHQjIFNFVCBVUCBBTklNQVRJT05TXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5hZGRcblx0XHRkZXNlbGVjdGVkOiBcblx0XHRcdHg6IFx0XHRcdFx0MFxuXHRcdFx0eTogXHRcdFx0XHQtNFxuXHRcdFx0d2lkdGg6XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoXG5cdFx0XHRoZWlnaHQ6XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdFx0c2hhZG93U3ByZWFkOiBcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJCb3JkZXJcblx0XHRcdHNhdHVyYXRlOiBcdFx0MFxuXHRcdFx0YnJpZ2h0bmVzczogXHQxNTNcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJcIlxuXHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdFx0Y3VydmU6IFwiZWFzZS1pbi1vdXRcIlxuXHRcdHRpbWU6IDAuMyBcblx0QHN3aXRjaEJhY2tncm91bmQub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cblx0XHRVdGlscy5kZWxheSAwLCA9PlxuXHQgXHRcdGlmIEBzZWxlY3RlZFxuIFx0XHRcdFx0QHN3aXRjaEJhY2tncm91bmQuYmFja2dyb3VuZENvbG9yID0gcGFyYW1zLnN3aXRjaFRpbnRcblxuXHRAc3dpdGNoQmFja2dyb3VuZC5vbiBFdmVudHMuQW5pbWF0aW9uU3RhcnQsID0+XG5cdFx0QHN3aXRjaEJhY2tncm91bmQuYmFja2dyb3VuZENvbG9yID0gJydcblxuXHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5hZGRcblx0XHRkZXNlbGVjdGVkOiB7eDogMH1cblx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9XG5cdFx0Y3VydmU6IFwic3ByaW5nKDQwMCwyNSwwKVwiXG5cdFx0XG5cdEBzd2l0Y2hCdXR0b25Db250YWluZXIuc2VsZWN0ID0gPT5cblx0XHRAc2VsZWN0ZWQgPSB0cnVlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLnN3aXRjaChcImRlZmF1bHRcIilcblx0XHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5zd2l0Y2goXCJkZWZhdWx0XCIpXG5cdFx0XG5cdEBzd2l0Y2hCdXR0b25Db250YWluZXIuZGVzZWxlY3QgPSA9PlxuXHRcdEBzZWxlY3RlZCA9IGZhbHNlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLnN3aXRjaChcImRlc2VsZWN0ZWRcIilcblx0XHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5zd2l0Y2goXCJkZXNlbGVjdGVkXCIpXG5cblx0aWYgQHNlbGVjdGVkID09IGZhbHNlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLnN3aXRjaEluc3RhbnQoXCJkZXNlbGVjdGVkXCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoSW5zdGFudChcImRlc2VsZWN0ZWRcIilcblx0ZWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5zd2l0Y2hUaW50XG5cblx0cmV0dXJuIEBzd2l0Y2hCdXR0b25Db250YWluZXJcblx0XG5Dcm9zcyA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjcm9zc1RoaWNrbmVzcyA9IDRcblx0Y3Jvc3MgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcdFxuXHRcdGhlaWdodDogMzBcdFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXG5cdGNyb3NzVXBzdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNyb3NzVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIwXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdG9yaWdpblg6IDFcblx0XHRzdXBlckxheWVyOiBjcm9zc1xuXHRjcm9zc1Vwc3Ryb2tlLnkgPSAxNFxuXHRjcm9zc1Vwc3Ryb2tlLnJvdGF0aW9uWiA9IDQ1XG5cdGNyb3NzRG93bnN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY3Jvc3NUaGlja25lc3Ncblx0XHR3aWR0aDogMjBcblx0XHRvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdHN1cGVyTGF5ZXI6IGNyb3NzXG5cdGNyb3NzRG93bnN0cm9rZS5yb3RhdGlvblogPSAtNDVcblx0Y3Jvc3Muc2VsZWN0ID0gLT5cblx0XHRjcm9zcy5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdGNyb3NzLmRlc2VsZWN0ID0gLT5cblx0XHRjcm9zcy5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjRcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcdFx0XG5cdHJldHVybiBjcm9zc1xuXHRcbkNhcmV0ID0gLT5cblx0Y29sb3IgPSBkZWZhdWx0cy50aW50XG5cdGNhcmV0VGhpY2tuZXNzID0gNFxuXHRjYXJldCA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiAzMFxuXHRcdGhlaWdodDogMzBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1x0XHRcblx0Y2FyZXRVcHN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2FyZXRUaGlja25lc3Ncblx0XHR3aWR0aDogMThcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0b3JpZ2luWDogMVxuXHRcdHN1cGVyTGF5ZXI6IGNhcmV0XG5cdGNhcmV0VXBzdHJva2UueSA9IDE0XG5cdGNhcmV0VXBzdHJva2Uucm90YXRpb25aID0gNDVcblx0Y2FyZXREb3duc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjYXJldFRoaWNrbmVzc1xuXHRcdHdpZHRoOiAxOFxuXHRcdG9yaWdpblg6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0c3VwZXJMYXllcjogY2FyZXRcblx0Y2FyZXREb3duc3Ryb2tlLnkgPSAxMlx0XHRcblx0Y2FyZXREb3duc3Ryb2tlLnJvdGF0aW9uWiA9IC00NVxuXHRjYXJldC5zZWxlY3QgPSAtPlxuXHRcdGNhcmV0LmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0Y2FyZXQuZGVzZWxlY3QgPSAtPlxuXHRcdGNhcmV0LmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuNFxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1x0XG5cdHJldHVybiBjYXJldFxuXHRcbkNoZWNrID0gLT5cblx0Y29sb3IgPSBkZWZhdWx0cy50aW50XG5cdGNoZWNrVGhpY2tuZXNzID0gNFxuXHRjaGVjayA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiAzMFxuXHRcdGhlaWdodDogMzBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRjaGVja1Vwc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjaGVja1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAxM1xuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRvcmlnaW5YOiAxXG5cdFx0c3VwZXJMYXllcjogY2hlY2tcblx0Y2hlY2tVcHN0cm9rZS55ID0gMTZcblx0Y2hlY2tVcHN0cm9rZS5yb3RhdGlvblogPSA0NVxuXHRjaGVja0Rvd25zdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNoZWNrVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIyXG5cdFx0b3JpZ2luWDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRzdXBlckxheWVyOiBjaGVja1x0XG5cdGNoZWNrRG93bnN0cm9rZS54ID0gNFxuXHRjaGVja0Rvd25zdHJva2Uucm90YXRpb25aID0gLTQ1XG5cdGNoZWNrLnNlbGVjdCA9IC0+XG5cdFx0Y2hlY2suYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRjaGVjay5kZXNlbGVjdCA9IC0+XG5cdFx0Y2hlY2suYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRzY2FsZTogMC40XG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdHJldHVybiBjaGVja1xuXG5cbiMjI1xuXHRUQUJMRSBWSUVXXG5cdFxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRUYWJsZVZpZXdSb3dcdFx0W0VsZW1lbnRzIGdvIGhlcmVdXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiMjI1xuXG5leHBvcnRzLlRhYmxlVmlld1JvdyA9IChwYXJhbXMpIC0+XG5cdFxuXHQjIFRoZSB0cmlja3kgdGhpbmcgYWJvdXQgcmV1c2FibGUgY29tcG9uZW50cyBpcyByZW1lbWJlcmluZ1xuXHQjIGhvdyB0byB1c2UgdGhlbSAocGFydGljdWxhcmx5IGlmIHRoZXkgaGF2ZSBsb3RzIG9mIGN1c3RvbWl6YWJsZVxuXHQjIHBhcmFtZXRlcnMpLiBTZXR0aW5nIHNlbnNpYmxlIGRlZmF1bHRzIG1ha2VzIGl0IHdheSBlYXNpZXIgdG8gZ2V0XG5cdCMgc3RhcnRlZCAoYW5kIHJlbWVtYmVyIGhvdyB0byB1c2UgdGhlIHRoaW5nIHlvdSBtYWRlKVxuXHRfLmRlZmF1bHRzIHBhcmFtcywgXG5cdFx0bmFtZTogJ0dpdmUgbWUgYSBuYW1lISdcblx0XHR4OiAwXG5cdFx0eTogMFxuXHRcdGVuYWJsZWQ6IHRydWVcblx0XHRzZWxlY3RlZDogdHJ1ZVxuXHRcdGljb246ICdjaGVjaydcblx0XHR0ZXh0Q29sb3I6IGRlZmF1bHRzLnRpbnRcblx0XHRzd2l0Y2hUaW50OiBkZWZhdWx0cy5zd2l0Y2hUaW50XG5cdFx0Zmlyc3RJdGVtSW5MaXN0OiB0cnVlICMgY291bGQgYmUgZmlyc3Qgb3IgbGFzdFxuXHRcdGxhc3RJdGVtSW5MaXN0OiB0cnVlICMgY291bGQgYmUgZmlyc3Qgb3IgbGFzdFxuXHRcdFxuXHRcdCMgQ29uc3RhbnRzXG5cdFx0c2NyZWVuV2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0dGFibGVSb3dIb3Jpem9udGFsUGFkZGluZzogZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHRcdHRhYmxlUm93SGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGJvcmRlckNvbG9yOiBkZWZhdWx0cy5saW5lVGludCAjIEdyZXkgcm91bmRlZCBwaWxsICYgYm9yZGVycyBiZXR3ZWVuIGNlbGxzXG5cblx0IyBTb21lIG9mIHRoZSB2YWx1ZXMgYXJlIGJhc2VkIG9uIG90aGVyIGNvbnN0YW50cyxcblx0IyBzbyB5b3UgaGF2ZSB0byBjYWxjdWxhdGUgdGhlbSBpbiBhIHNlY29uZCBwYXNzXG5cdHN3aXRjaEJ1dHRvblJhZGl1cyA9IHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQvMlxuXHRzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlciA9IDJcblx0XHRcblx0IyBUaGlzIGlzIHRoZSByb290IG9iamVjdCBmb3IgdGhpcyBlbnRpcmUgY29tcG9uZW50LlxuXHQjIFdlIHdpbGwgYXR0YWNoIGFsbCBvdXIgZnVuY3Rpb25zIGRpcmVjdGx5IHRvIHRoaXMgbGF5ZXJcblx0QGxpc3RJdGVtQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnhcblx0XHR5OiBwYXJhbXMueVxuXHRcdHdpZHRoOiBcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGNsaXA6IGZhbHNlXG5cdFx0YmFja2dyb3VuZENvbG9yOiBkZWZhdWx0cy5pdGVtQmFja2dyb3VuZFxuXHRAbGlzdEl0ZW1Db250YWluZXIuc3R5bGUgPSBcblx0XHRib3JkZXJUb3A6IFx0XHRpZiBwYXJhbXMuZmlyc3RJdGVtSW5MaXN0IHRoZW4gXCIxcHggc29saWQgXCIgKyBwYXJhbXMuYm9yZGVyQ29sb3IgZWxzZSBcIlwiXG5cdFx0Ym9yZGVyQm90dG9tOiBcdGlmIHBhcmFtcy5sYXN0SXRlbUluTGlzdCB0aGVuIFwiMXB4IHNvbGlkIFwiICsgcGFyYW1zLmJvcmRlckNvbG9yIGVsc2UgXCJcIlxuXG5cdCMgVGhlc2Ugd2lsbCBiZSBhY2Nlc3NlZCB1c2luZyBmdW5jdGlvbnNcblx0QGVuYWJsZWQgPSBwYXJhbXMuZW5hYmxlZFxuXHRAc2VsZWN0ZWQgPSBwYXJhbXMuc2VsZWN0ZWRcblx0XG5cdEBsaXN0SXRlbSA9IG5ldyBMYXllciBcblx0XHR4OiBwYXJhbXMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHRcdHdpZHRoOiBcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdHN1cGVyTGF5ZXI6IEBsaXN0SXRlbUNvbnRhaW5lclxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXHRcblx0QGxpc3RJdGVtLnN0eWxlID0gZGVmYXVsdHMubGlzdEl0ZW1UZXh0U3R5bGVcblx0QGxpc3RJdGVtLnN0eWxlID1cblx0XHRjb2xvcjogcGFyYW1zLnRleHRDb2xvclxuXHRcdGJvcmRlclRvcDogXHRpZiBwYXJhbXMuZmlyc3RJdGVtSW5MaXN0IHRoZW4gXCJcIiBlbHNlIFwiMXB4IHNvbGlkIFwiICsgcGFyYW1zLmJvcmRlckNvbG9yXG5cblx0IyBUaGlzIGlzIHdoZXJlIHRoZSBsYWJlbCBvZiB0aGUgbGlzdCBpdGVtIGxpdmVzXG5cdEBsaXN0SXRlbS5odG1sID0gcGFyYW1zLm5hbWUgXG5cblx0IyBBZGQgdGhlIGNoZWNrbWFyayBmb3IgdGhlIGxpc3Rcblx0dGhpbmdUb1N3aXRjaCA9IHN3aXRjaFxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ2NoZWNrJyB0aGVuIG5ldyBDaGVjaygpXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnY3Jvc3MnIHRoZW4gbmV3IENyb3NzKClcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdjYXJldCcgdGhlbiBuZXcgQ2FyZXQoKVxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ3N3aXRjaCcgdGhlbiBuZXcgU3dpdGNoKClcblxuXHR0aGluZ1RvU3dpdGNoLnN1cGVyTGF5ZXIgPSBAbGlzdEl0ZW1Db250YWluZXJcblx0dGhpbmdUb1N3aXRjaC54ID0gZGVmYXVsdHMuc2NyZWVuV2lkdGggLSB0aGluZ1RvU3dpdGNoLndpZHRoIC0gZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHR0aGluZ1RvU3dpdGNoLmNlbnRlclkoMilcbiMgXHR0aGluZ1RvU3dpdGNoLnkgPSAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMiAtIHRoaW5nVG9Td2l0Y2guaGVpZ2h0LzJcblx0XG5cdCMgTUFLRSBJVCBBTEwgSU5URVJBQ1RJVkVcblx0IyBPbiBhIGNsaWNrLCBnbyB0byB0aGUgbmV4dCBzdGF0ZVxuXHRpZiBwYXJhbXMuaWNvbiA9PSAnc3dpdGNoJ1xuXHRcdHRoaW5nVG9Td2l0Y2gub24gRXZlbnRzLkNsaWNrLCA9PlxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLnN3aXRjaCgpXG5cdGVsc2UgXG5cdFx0QGxpc3RJdGVtLm9uIEV2ZW50cy5DbGljaywgPT5cblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5zd2l0Y2goKVxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zd2l0Y2ggPSA9PlxuXHRcdGlmIEBzZWxlY3RlZCB0aGVuIEBsaXN0SXRlbUNvbnRhaW5lci5kZXNlbGVjdCgpIGVsc2UgQGxpc3RJdGVtQ29udGFpbmVyLnNlbGVjdCgpXG5cdFx0XG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zZWxlY3QgPSAob3B0aW9ucykgPT5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7c3VwcmVzc0V2ZW50czogZmFsc2V9XG5cdFx0aWYgQGVuYWJsZWQgXG5cdFx0XHR0aGluZ1RvU3dpdGNoLnNlbGVjdCgpXG5cdFx0XHRAc2VsZWN0ZWQgPSB0cnVlXG5cdFx0aWYgb3B0aW9ucy5zdXByZXNzRXZlbnRzID09IGZhbHNlXG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiBAc2VsZWN0ZWQgfVxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5kZXNlbGVjdCA9IChvcHRpb25zKSA9PlxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHtzdXByZXNzRXZlbnRzOiBmYWxzZX1cblx0XHRpZiBAZW5hYmxlZCBcblx0XHRcdHRoaW5nVG9Td2l0Y2guZGVzZWxlY3QoKVx0XHRcblx0XHRcdEBzZWxlY3RlZCA9IGZhbHNlXG5cdFx0aWYgb3B0aW9ucy5zdXByZXNzRXZlbnRzID09IGZhbHNlXG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiBAc2VsZWN0ZWQgfVxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci51cGRhdGVMYWJlbCA9IChuZXdUZXh0KSA9PlxuXHRcdEBsaXN0SXRlbS5odG1sID0gbmV3VGV4dFxuXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zZWxlY3RlZCA9ICgpID0+XG5cdFx0cmV0dXJuIEBzZWxlY3RlZFxuXHRcdFx0XG5cdEBsaXN0SXRlbUNvbnRhaW5lci51cGRhdGVMYWJlbChwYXJhbXMubmFtZSlcblxuXHRyZXR1cm4gQGxpc3RJdGVtQ29udGFpbmVyXG5cbmV4cG9ydHMuVGFibGVWaWV3ID0gKHBhcmFtcykgLT5cblx0cGFyYW1zID0gcGFyYW1zIG9yIHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdHk6IFx0XHQwXG5cdFx0d2lkdGg6XHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGl0ZW1zOiBbXCJJdCdzIGp1c3QgbWUhXCJdXG5cdFx0aWNvbjogJ2NoZWNrJ1xuXHRcdHZhbGlkYXRpb246ICdub25lJ1xuXHRcblx0QGJ1dHRvbkdyb3VwQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5Olx0XHRwYXJhbXMueVxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKiBwYXJhbXMuaXRlbXMubGVuZ3RoXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwibm9uZVwiXG5cdFx0XHRcdFx0XG5cdEBidXR0b25BcnJheSA9IFtdXG5cdGZvciBidXR0b25OYW1lLCBpIGluIHBhcmFtcy5pdGVtc1xuXHRcdGZpcnN0SXRlbUluTGlzdCA9IGlmIGkgPT0gMCB0aGVuIHRydWUgZWxzZSBmYWxzZVxuXHRcdGxhc3RJdGVtSW5MaXN0ID0gaWYgaSA9PSAocGFyYW1zLml0ZW1zLmxlbmd0aC0xKSB0aGVuIHRydWUgZWxzZSBmYWxzZVxuXHRcdG5ld0J1dHRvbiA9IG5ldyBleHBvcnRzLlRhYmxlVmlld1Jvdyh7XG5cdFx0XHR4OiAwLCBcblx0XHRcdHk6IGkqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQsIFxuXHRcdFx0bmFtZTogYnV0dG9uTmFtZSwgXG5cdFx0XHRpY29uOiBwYXJhbXMuaWNvbixcblx0XHRcdGZpcnN0SXRlbUluTGlzdDogZmlyc3RJdGVtSW5MaXN0LFxuXHRcdFx0bGFzdEl0ZW1Jbkxpc3Q6IGxhc3RJdGVtSW5MaXN0XG5cdFx0fSlcblx0XHRAYnV0dG9uQXJyYXkucHVzaChuZXdCdXR0b24pXG5cdFx0bmV3QnV0dG9uLnN1cGVyTGF5ZXIgPSBAYnV0dG9uR3JvdXBDb250YWluZXJcblxuXHRhdHRhY2hSYWRpb0J1dHRvblZhbGlkYXRpb24gPSAoYnV0dG9uQXJyYXkpID0+XG5cdFx0YnV0dG9uR3JvdXBDb250YWluZXIgPSBAYnV0dG9uR3JvdXBDb250YWluZXJcblx0XHRmb3IgYnV0dG9uQ2xpY2tlZCwgaW5kZXhPZkJ1dHRvbkNsaWNrZWQgaW4gYnV0dG9uQXJyYXlcblx0XHRcdGJ1dHRvbkNsaWNrZWQuZGVzZWxlY3Qoe3N1cHJlc3NFdmVudHM6IHRydWV9KVxuXHRcdFx0IyBDcmVhdGVzIGEgY2xvc3VyZSB0byBzYXZlIHRoZSBpbmRleCBvZiB0aGUgYnV0dG9uIHdlJ3JlIGRlYWxpbmcgd2l0aFxuXHRcdFx0ZG8gKGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkKSAtPiBcblx0XHRcdFx0IyBMaXN0ZW4gZm9yIGV2ZW50cyBhbmQgY2hhbmdlIG90aGVyIGJ1dHRvbnMgaW4gcmVzcG9uc2Vcblx0XHRcdFx0YnV0dG9uQ2xpY2tlZC5vbiAnRGlkQ2hhbmdlJywgKGV2ZW50KSA9PlxuXHRcdFx0XHRcdGZvciBvdGhlckJ1dHRvbiwgb3RoZXJCdXR0b25JbmRleCBpbiBidXR0b25BcnJheVxuXHRcdFx0XHRcdFx0aWYgb3RoZXJCdXR0b25JbmRleCAhPSBpbmRleE9mQnV0dG9uQ2xpY2tlZFxuXHRcdFx0XHRcdFx0XHQjIERvIHN0dWZmIHRvIHRoZSBvdGhlciBidXR0b25zXG5cdFx0XHRcdFx0XHRcdG90aGVyQnV0dG9uLmRlc2VsZWN0KHtzdXBwcmVzc0V2ZW50czogdHJ1ZX0pXG5cdFx0XHRcdFx0YnV0dG9uR3JvdXBDb250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiBpbmRleE9mQnV0dG9uQ2xpY2tlZCwgbnVtU2VsZWN0ZWQ6IDEsIGJ1dHRvbnM6IGJ1dHRvbkFycmF5IH1cblxuXHRhdHRhY2hEZWZhdWx0VmFsaWRhdGlvbiA9IChidXR0b25BcnJheSkgPT5cblx0XHQjIEp1c3QgZW1pdHMgdGhlIG5ldyB2YWx1ZXNcblx0XHRidXR0b25Hcm91cENvbnRhaW5lciA9IEBidXR0b25Hcm91cENvbnRhaW5lclxuXHRcdGZvciBidXR0b25DbGlja2VkLCBpbmRleE9mQnV0dG9uQ2xpY2tlZCBpbiBidXR0b25BcnJheVxuXHRcdFx0YnV0dG9uQ2xpY2tlZC5kZXNlbGVjdCh7c3VwcmVzc0V2ZW50czogdHJ1ZX0pXG5cdFx0XHQjIENyZWF0ZXMgYSBjbG9zdXJlIHRvIHNhdmUgdGhlIGluZGV4IG9mIHRoZSBidXR0b24gd2UncmUgZGVhbGluZyB3aXRoXG5cdFx0XHRkbyAoYnV0dG9uQ2xpY2tlZCwgaW5kZXhPZkJ1dHRvbkNsaWNrZWQpIC0+IFxuXHRcdFx0XHQjIExpc3RlbiBmb3IgZXZlbnRzIGFuZCBjaGFuZ2Ugb3RoZXIgYnV0dG9ucyBpbiByZXNwb25zZVxuXHRcdFx0XHRidXR0b25DbGlja2VkLm9uICdEaWRDaGFuZ2UnLCAoZXZlbnQpID0+XG5cdFx0XHRcdFx0bnVtU2VsZWN0ZWQgPSAwXG5cdFx0XHRcdFx0dGFibGVWaWV3U3RhdGVzID0gW11cdFx0XG5cdFx0XHRcdFx0Zm9yIGJ1dHRvbiBpbiBidXR0b25BcnJheVxuXHRcdFx0XHRcdFx0dGFibGVWaWV3U3RhdGVzLnB1c2goYnV0dG9uLnNlbGVjdGVkKCkpXG5cdFx0XHRcdFx0XHRpZiBidXR0b24uc2VsZWN0ZWQoKSB0aGVuIG51bVNlbGVjdGVkKytcblx0XHRcdFx0XHRidXR0b25Hcm91cENvbnRhaW5lci5lbWl0IFwiRGlkQ2hhbmdlXCIsIHsgc2VsZWN0ZWQ6IHRhYmxlVmlld1N0YXRlcywgbnVtU2VsZWN0ZWQ6IG51bVNlbGVjdGVkLCBidXR0b25zOiBidXR0b25BcnJheSB9XG5cblx0aWYgcGFyYW1zLnZhbGlkYXRpb24gPT0gJ3JhZGlvJ1xuXHRcdGF0dGFjaFJhZGlvQnV0dG9uVmFsaWRhdGlvbihAYnV0dG9uQXJyYXkpXG5cdGVsc2UgXG5cdFx0YXR0YWNoRGVmYXVsdFZhbGlkYXRpb24oQGJ1dHRvbkFycmF5KVxuXHRcdFxuXHRyZXR1cm4gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cblxuXG4jIyNcblx0VEFCTEUgVklFVyBIRUFERVJcblx0SW4gaU9TLCB0aGlzIGlzIHR5cGljYWxseSBhdHRhY2hlZCB0byB0aGUgdGFibGUgdmlldywgXG5cdGJ1dCBpdCdzIGluZGVwZW5kZW50IGhlcmUgc28geW91IGNhbiBwdXQgaXQgd2hlcmV2ZXIgeW91IHdhbnQuXG4jIyNcblxuZXhwb3J0cy5UYWJsZVZpZXdIZWFkZXIgPSAocGFyYW1zKSAtPlxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0dGV4dDogJ0kgYW0gYSBkaXZpZGVyJ1xuXHRcdHg6IDBcblx0XHR5OiAwXG5cdGxpc3REaXZpZGVyID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnggKyBkZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdFx0eTogcGFyYW1zLnlcblx0XHR3aWR0aDogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRsaXN0RGl2aWRlci5odG1sID0gcGFyYW1zLnRleHRcblx0bGlzdERpdmlkZXIuc3R5bGUgPSBkZWZhdWx0cy5kaXZpZGVySXRlbVRleHRTdHlsZVxuXHRsaXN0RGl2aWRlci5zdHlsZSA9IFxuXHRcdGNvbG9yOiBkZWZhdWx0cy50aW50XG5cdHJldHVybiBsaXN0RGl2aWRlclxuXG5cblxuIyMjXG5cdFBJQ0tFUlxuXHRJbiBpT1MsIHRoaXMgaXMgdHlwaWNhbGx5IGF0dGFjaGVkIHRvIHRoZSB0YWJsZSB2aWV3LCBcblx0YnV0IGl0J3MgaW5kZXBlbmRlbnQgaGVyZSBzbyB5b3UgY2FuIHB1dCBpdCB3aGVyZXZlciB5b3Ugd2FudC5cbiMjI1xuXG5cbiMjIFV0aWxpdHkgZnVuY3Rpb25zXG5cbnF1YW50aXplID0gKGlucHV0LCBzdGVwU2l6ZSkgLT5cblx0cmV0dXJuIE1hdGguZmxvb3IoaW5wdXQvc3RlcFNpemUpICogc3RlcFNpemVcblxuXG4jIyBUaGUgaXRlbXMgaW4gdGhlIHBpY2tlclxuXG5EcnVtID0gKHBhcmVudERydW1MYXllciwgZHJ1bU5hbWUsIGxpc3RJdGVtcywgcGFyYW1zKSAtPlxuXHRcblx0IyBTZXR1cCB2YXJpYWJsZXNcblx0QHBhcmVudERydW1MYXllciA9IHBhcmVudERydW1MYXllclxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0ZW5hYmxlZDogdHJ1ZVxuXHRcdHhQY3Q6IDAgIFx0XHRcdFx0IyAwIHRvIDFcblx0XHR3aWR0aFBjdDogMVx0XHRcdFx0IyAwIHRvIDFcblx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCJcdFx0IyBsZWZ0LCBjZW50ZXIsIHJpZ2h0XG5cdFx0dGV4dFBhZGRpbmc6IFwiMFwiXG5cdFx0dGV4dENvbG9yOiBkZWZhdWx0cy50aW50XG5cdFxuXHQjIFZhbHVlcyBkZXJpdmVkIGZyb20gcGFyYW1zXG5cdGRydW1Db250YWluZXJIZWlnaHQgPSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCo1XG5cblx0IyBTZXQgdXAgY29udGVudCBvZiBsaXN0IFx0XHRcblx0bGlzdEl0ZW1zID0gbGlzdEl0ZW1zXG5cdEBuYW1lID0gZHJ1bU5hbWVcblx0QGluZGV4ID0gMFxuXHRAdmFsID0gbGlzdEl0ZW1zW0BpbmRleF1cblx0QHZlbG9jaXR5ID0gMFxuXHRmaXJzdFRvdWNoQXZhaWxhYmxlID0gdHJ1ZSAgICAjIGlzIHRoaXMgdGhlIGZpcnN0IHRvdWNoIGluIGEgZ2l2ZW4gZ2VzdHVyZT9cblx0XG5cdGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSA9IDBcblx0XG5cdCMgQ2FsY3VsYXRlIGhlaWdodCBhbmQgdmVydGljYWwgYm91bmRzIG9mIHRoZSBsaXN0XG5cdGxpc3RNaW5ZUG9zIFx0PSAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRsaXN0TWF4WVBvcyBcdD0gLWxpc3RJdGVtcy5sZW5ndGgqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQrZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRsaXN0SGVpZ2h0IFx0XHQ9IGxpc3RJdGVtcy5sZW5ndGgqZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKyBkcnVtQ29udGFpbmVySGVpZ2h0XG5cblx0QGRydW1Db250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0XHRcdFx0cGFyYW1zLnhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHk6IFx0XHRcdFx0XHQwXG5cdFx0d2lkdGg6IFx0XHRcdFx0cGFyYW1zLndpZHRoUGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IFx0XHRcdGRydW1Db250YWluZXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJub25lXCJcblx0XHRzdXBlckxheWVyOiBcdFx0cGFyZW50RHJ1bUxheWVyXG5cdFxuXHRsaXN0TGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0XHRcdFx0MFxuXHRcdHk6IFx0XHRcdFx0XHQtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy53aWR0aFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBcdFx0XHRsaXN0SGVpZ2h0XG5cdFx0c3VwZXJMYXllcjogXHRcdEBkcnVtQ29udGFpbmVyXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwibm9uZVwiXG5cdFxuXHQjIGxpc3RMYXllci5zY3JvbGwgPSB0cnVlXG5cdGxpc3RMYXllci5kcmFnZ2FibGUuZW5hYmxlZCA9IHBhcmFtcy5lbmFibGVkXG5cdGxpc3RMYXllci5kcmFnZ2FibGUuc3BlZWRYID0gMFxuXHRcblx0Zm9yIGxpLCBpIGluIGxpc3RJdGVtc1xuXHRcdGxpc3RJdGVtTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHg6IFx0XHRcdFx0MFxuXHRcdFx0eTogXHRcdFx0XHRpICogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKyBkcnVtQ29udGFpbmVySGVpZ2h0LzJcblx0XHRcdHdpZHRoOiBcdFx0XHRwYXJhbXMud2lkdGhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdFx0aGVpZ2h0OiBcdFx0ZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRcdHN1cGVyTGF5ZXI6IFx0bGlzdExheWVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiI1V0aWxzLnJhbmRvbUNvbG9yKClcblx0XHRsaXN0SXRlbUxheWVyLmh0bWwgPSBsaVxuXHRcdGxpc3RJdGVtTGF5ZXIuc3R5bGUgPVxuXHRcdFx0Y29sb3I6IFx0XHRcdHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRcdGZvbnRGYW1pbHk6IFx0ZGVmYXVsdHMucGlja2VyVGV4dFN0eWxlLmZvbnRGYW1pbHlcblx0XHRcdGZvbnRXZWlnaHQ6IFx0ZGVmYXVsdHMucGlja2VyVGV4dFN0eWxlLmZvbnRXZWlnaHRcblx0XHRcdGZvbnRTaXplOiBcdFx0ZGVmYXVsdHMucGlja2VyVGV4dFN0eWxlLmZvbnRTaXplXG5cdFx0XHRsaW5lSGVpZ2h0OiBcdGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0K1wicHhcIlxuXHRcdFx0dGV4dEFsaWduOiBcdFx0cGFyYW1zLnRleHRBbGlnblxuXHRcdFx0cGFkZGluZzogXHRcdHBhcmFtcy50ZXh0UGFkZGluZ1xuXG5cdFx0bGlzdEl0ZW1MYXllci5zdGFydFkgPSBpICogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgKyBkcnVtQ29udGFpbmVySGVpZ2h0LzJcblxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkRyYWdNb3ZlLCA9PlxuXHRcdGlmIGZpcnN0VG91Y2hBdmFpbGFibGVcblx0XHRcdEBkcnVtQ29udGFpbmVyLmVtaXQoXCJEcnVtU3RhcnRlZE1vdmluZ1wiLCB7ZHJ1bTogZHJ1bU5hbWUsIGluZGV4OiBAaW5kZXgsIHZhbHVlOiBAdmFsLCB2ZWxvY2l0eTogMH0pXG5cdFx0XHRmaXJzdFRvdWNoQXZhaWxhYmxlID0gZmFsc2VcdFx0XG5cdFx0XHRcblx0XHR1cGRhdGVEcnVtQXBwZWFyYW5jZSgpXG5cdFx0XG5cdCMgVG8gc2ltdWxhdGUgaU9TIG1vbWVudHVtIHNjcm9sbGluZyAod2hpY2ggY2F1c2VzIHRoZSBkcnVtIHRvIGtlZXAgc3Bpbm5pbmcgXG5cdCMgYWZ0ZXIgeW91ciBmaW5nZXIgbGlmdHMgb2ZmIGl0KSwgd2UgdHJpZ2dlciBhbiBhbmltYXRpb24gdGhlIG1vbWVudCB5b3UgbGlmdFxuXHQjIHlvdXIgZmluZ2VyLiBUaGUgaW50ZW5zaXR5IG9mIHRoaXMgYW5pbWF0aW9uIGlzIHByb3BvcnRpb25hbCB0byB0aGUgc3BlZWQgd2hlblxuXHQjIG9mIHRoZSBkcmFnZ2luZyB3aGVuIHlvdXIgZmluZ2VyIHdhcyBsaWZ0ZWQuXG5cdGxpc3RMYXllci5vbiBFdmVudHMuRHJhZ0VuZCwgKGUsIGYpID0+XG5cdFx0XG5cdFx0IyBOZXh0IHRvdWNoIHNob3VsZCB0cmlnZ2VyIERydW1TdGFydGVkTW92aW5nXG5cdFx0Zmlyc3RUb3VjaEF2YWlsYWJsZSA9IHRydWVcblx0XG5cdFx0IyBUaGlzIGNhbGN1bGF0ZXMgdGhlIGFuaW1hdGlvblxuXHRcdHNjcm9sbFZlbG9jaXR5ID0gbGlzdExheWVyLmRyYWdnYWJsZS5jYWxjdWxhdGVWZWxvY2l0eSgpLnlcblx0XHR0aW1lQWZ0ZXJEcmFnID0gKDAuNStNYXRoLmFicyhzY3JvbGxWZWxvY2l0eSowLjIpKS50b0ZpeGVkKDEpXG5cdFx0ZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gPSBxdWFudGl6ZShsaXN0TGF5ZXIueSArIHNjcm9sbFZlbG9jaXR5KjQwMCwgZGVmYXVsdHMudGFibGVSb3dIZWlnaHQpICsgZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdFxuXHRcdCMgQXQgdGhlIHRvcCBhbmQgYm90dG9tLCB0aGUgbW9tZW50dW0gc2hvdWxkIGJlIGFkanVzdGVkIHNvIHRoZSBcblx0XHQjIGZpcnN0IGFuZCBsYXN0IHZhbHVlcyBvbiB0aGUgZHJ1bSBkb24ndCBnbyB0b28gZmFyIG91dCBvZiB2aWV3XG5cdFx0ZGlzdGFuY2VUb1RyYXZlbCA9IGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIC0gbGlzdExheWVyLnlcblx0XHRsaXN0SGVpZ2h0V2l0aG91dEVuZEJ1ZmZlciA9IC1saXN0SXRlbXMubGVuZ3RoKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0Ym90dG9tT3ZlcmZsb3cgPSBNYXRoLm1heCgwLCBsaXN0SGVpZ2h0V2l0aG91dEVuZEJ1ZmZlci1maW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSApXG5cdFx0dG9wT3ZlcmZsb3cgPSBNYXRoLm1heCgwLCBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSApXG5cdFx0b3ZlcmZsb3dEYW1wZW5pbmcgPSAxMFxuXHRcdFxuXHRcdGlmIGJvdHRvbU92ZXJmbG93ID4gMFxuXHRcdFx0ZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gPSBsaXN0SGVpZ2h0V2l0aG91dEVuZEJ1ZmZlciAtIChib3R0b21PdmVyZmxvdyAvIG92ZXJmbG93RGFtcGVuaW5nKVxuXHRcdFx0bmV3RGlzdGFuY2VUb1RyYXZlbCA9IGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIC0gbGlzdExheWVyLnlcblx0XHRcdHRpbWVBZnRlckRyYWcgPSB0aW1lQWZ0ZXJEcmFnICogKG5ld0Rpc3RhbmNlVG9UcmF2ZWwvZGlzdGFuY2VUb1RyYXZlbClcblxuXHRcdGlmIHRvcE92ZXJmbG93ID4gMFxuXHRcdFx0ZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gPSA0MCArICh0b3BPdmVyZmxvdyAvIG92ZXJmbG93RGFtcGVuaW5nKVxuXHRcdFx0bmV3RGlzdGFuY2VUb1RyYXZlbCA9IGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIC0gbGlzdExheWVyLnlcblx0XHRcdHRpbWVBZnRlckRyYWcgPSB0aW1lQWZ0ZXJEcmFnICogKG5ld0Rpc3RhbmNlVG9UcmF2ZWwvZGlzdGFuY2VUb1RyYXZlbClcblxuXHRcdCMgVHJpZ2dlciB0aGUgYW5pbWF0aW9uLCBhbmQgc2NoZWR1bGUgYW4gZXZlbnQgdGhhdCB3aWxsXG5cdFx0IyB0cmlnZ2VyIHdoZW4gdGhlIGRydW0gZmluYWxseSBzdG9wcyBzcGlubmluZy5cblx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt5OiBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bX1cblx0XHRcdFx0dGltZTogdGltZUFmdGVyRHJhZ1xuXHRcdFx0XHRjdXJ2ZTogXCJlYXNlLW91dFwiXG5cdFx0XHR9KVxuXHRcdFV0aWxzLmRlbGF5IHRpbWVBZnRlckRyYWcsIC0+XG5cdFx0XHRzdG9wRHJ1bSgpXG5cblx0IyBUaGlzIGVuc3VyZXMgdGhhdCBkdXJpbmcgdGhlIGFuaW1hdGlvbiBvZiB0aGUgbGlzdCBsYXllciwgdGhlIGRydW0ncyBhcHBlYXJhbmNlIGNvbnRpbnVlc1xuXHQjIHRvIGJlIHVwZGF0ZWQuIEJlY2F1c2UgbXVsdGlwbGUgYW5pbWF0aW9ucyBjb3VsZCBvdmVybGFwLCB3ZSBlbnN1cmUgdGhhdCBldmVyeSBuZXcgYW5pbWF0aW9uXG5cdCMgZW5kcyB0aGUgaW50ZXJ2YWwgYW5kIHN0YXJ0cyBhIG5ldyBvbmUgc28gdGhhdCB3ZSBuZXZlciBoYXZlIG1vcmUgdGhhbiBvbmUgcnVubmluZyBcblx0bGlzdExheWVyLm9uIEV2ZW50cy5BbmltYXRpb25TdGFydCwgLT5cblx0XHRjbGVhckludGVydmFsKGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSlcblx0XHRpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UgPSBVdGlscy5pbnRlcnZhbCAxLzMwLCB1cGRhdGVEcnVtQXBwZWFyYW5jZSAgICBcblxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT5cdFx0XG5cdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UpXG5cblx0XHQjIEVtaXQgYWZ0ZXIgYWxsIG1vdmVtZW50IGVuZHMgaW4gdGhlIGxpc3Rcblx0XHRAZHJ1bUNvbnRhaW5lci5lbWl0KFwiRHJ1bUZpbmlzaGVkQ2hhbmdpbmdcIiwge2xpc3Q6IGRydW1OYW1lLCBpbmRleDogQGluZGV4LCB2YWx1ZTogQHZhbH0pXG5cblx0dXBkYXRlRHJ1bUFwcGVhcmFuY2UgPSA9PlxuXHRcdGl0ZW1zSW5EcnVtID0gNFxuXHRcdGxpc3RQb3NpdGlvbiA9IGxpc3RMYXllci55IC8gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0IC0gMC41XG5cdFx0Y2FwcGVkTGlzdFBvc2l0aW9uID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obGlzdExheWVyLnkgLyAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgLSAwLjUsIGxpc3RJdGVtcy5sZW5ndGggLSAxKSlcblx0XHRmb2N1c0l0ZW0gPSBNYXRoLnJvdW5kKGNhcHBlZExpc3RQb3NpdGlvbilcblx0XHRkaXN0YW5jZUZyb21NaWRkbGUgPSBNYXRoLmFicyhmb2N1c0l0ZW0gLSBjYXBwZWRMaXN0UG9zaXRpb24pXG5cdFx0Zm9yIGkgaW4gWyhmb2N1c0l0ZW0taXRlbXNJbkRydW0pLi4oZm9jdXNJdGVtK2l0ZW1zSW5EcnVtKV1cblx0XHRcdGlmIGkgPj0gMCBhbmQgaSA8IGxpc3RJdGVtcy5sZW5ndGhcblx0XHRcdFx0bGlzdExheWVyLnN1YkxheWVyc1tpXS5vcGFjaXR5ID0gMSAtIE1hdGguYWJzKGxpc3RQb3NpdGlvbiAtIGkpLzUgLSAoaWYgKGkgIT0gZm9jdXNJdGVtKSB0aGVuIDAuMyBlbHNlIDApXG5cdFx0XHRcdGxpc3RMYXllci5zdWJMYXllcnNbaV0uc2NhbGVZID0gMSAtIE1hdGgubWluKDEsIE1hdGguYWJzKGxpc3RQb3NpdGlvbiAtIGkpLzQpXG5cdFx0XHRcdGxpc3RMYXllci5zdWJMYXllcnNbaV0ueSA9IGxpc3RMYXllci5zdWJMYXllcnNbaV0uc3RhcnRZIC0gKGktbGlzdFBvc2l0aW9uKSpNYXRoLmFicyhpLWxpc3RQb3NpdGlvbikqMTBcblxuXHRcdCMgVXBkYXRlIHRoZSB2YWx1ZSBvZiB0aGUgZHJ1bSBvbmx5IHdoZW4gYSBuZXcgdmFsdWUgaXMgcmVhY2hlZFxuXHRcdGlmIChAaW5kZXggIT0gZm9jdXNJdGVtKVxuXHRcdFx0dXBkYXRlRHJ1bVZhbHVlcyhmb2N1c0l0ZW0pXG5cdFx0XG5cdHN0b3BEcnVtID0gPT5cdFx0XG5cdFx0IyBFbnN1cmUgdGhlIGRydW0gbmV2ZXIgZW5kcyBvdXQgb2YgYm91bmRzXG5cdFx0aWYgbGlzdExheWVyLnkgPiBsaXN0TWluWVBvcyBcblx0XHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHQgICAgXHRwcm9wZXJ0aWVzOiB7eTpsaXN0TWluWVBvc31cblx0XHQgICAgXHRjdXJ2ZTogXCJzcHJpbmcoNDAwLDUwLDApXCJcblx0XHRcdH0pXG5cdFx0aWYgbGlzdExheWVyLnkgPCBsaXN0TWF4WVBvc1xuXHRcdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eTogbGlzdE1heFlQb3N9XG5cdFx0XHRcdGN1cnZlOiBcInNwcmluZyg0MDAsNTAsMClcIlxuXHRcdFx0fSlcblx0XG5cdCMgVXBkYXRlIHRoZSB2YWx1ZXMgb2YgdGhlIGRydW1zIGFuZCBpbnZva2UgdGhlIGNhbGxiYWNrIFxuXHR1cGRhdGVEcnVtVmFsdWVzID0gKG5ld0luZGV4KSA9PlxuXHRcdEBpbmRleCA9IG5ld0luZGV4XG5cdFx0QHZhbCA9IGxpc3RJdGVtc1tAaW5kZXhdXG5cdFx0QGRydW1Db250YWluZXIuZW1pdChcIkRydW1EaWRDaGFuZ2VcIiwge2xpc3Q6IGRydW1OYW1lLCBpbmRleDogQGluZGV4LCB2YWx1ZTogQHZhbH0pXG5cdFxuXHQjIFJlbmRlciBmb3IgdGhlIGZpcnN0IHRpbWVcdFx0XG5cdHVwZGF0ZURydW1BcHBlYXJhbmNlKClcblx0XG5cdEBzZXRJbmRleCA9IChpbmRleCkgPT5cblx0XHR5UG9zaXRpb25Gb3JUaGlzSW5kZXggPSAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMiAtIChpbmRleCAqIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KVxuXHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHRcdFx0cHJvcGVydGllczoge3k6IHlQb3NpdGlvbkZvclRoaXNJbmRleH1cblx0XHRcdFx0dGltZTogMC41XG5cdFx0XHRcdGN1cnZlOiBcImVhc2Utb3V0XCJcblx0XHRcdH0pXG5cblx0QHNldFZhbHVlID0gKHZhbCkgPT5cblx0XHRpbmRleCA9IGxpc3RJdGVtcy5pbmRleE9mKHZhbClcblx0XHRpZiBpbmRleCAhPSAtMVxuXHRcdFx0QHNldEluZGV4KGluZGV4KVxuXG5cdCMgUmV0dXJuIHRoZSBkcnVtIG9iamVjdCBzbyB3ZSBjYW4gYWNjZXNzIGl0cyB2YWx1ZXNcblx0cmV0dXJuIEBcblxuXG4jIyNcblx0UElDS0VSXG5cdFRoaXMgY29udGFpbnMgdGhlIHBpY2tlciBcbiMjIyBcbmV4cG9ydHMuUGlja2VyID0gKHBhcmFtcykgLT5cblx0XG5cdHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHQwXG5cdFx0d2lkdGg6XHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGRlZmF1bHRUZXh0OiBcIlwiXG5cdFx0dGV4dENvbG9yOiBkZWZhdWx0cy50aW50XG5cblx0ZHJ1bUNvbnRhaW5lckhlaWdodCA9IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KjVcblxuXHRAcGlja2VyQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdHBhcmFtcy54XG5cdFx0eTpcdFx0cGFyYW1zLnlcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRydW1Db250YWluZXJIZWlnaHQrODhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0ZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0XHRcdFxuXHRAZHJ1bSA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdDg4XG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkcnVtQ29udGFpbmVySGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIm5vbmVcIlxuXHRcdHN1cGVyTGF5ZXI6IEBwaWNrZXJDb250YWluZXJcdFx0XG5cdFx0XG5cdEBzZWxlY3RlZEl0ZW0gPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHRkcnVtQ29udGFpbmVySGVpZ2h0LzIgLSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCJcblx0XHRzdXBlckxheWVyOiBAZHJ1bVxuXG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDpcdDg4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBkZWZhdWx0cy5pdGVtQmFja2dyb3VuZFxuXHRcdHN1cGVyTGF5ZXI6IEBwaWNrZXJDb250YWluZXJcblx0XHRcblx0IyBTdHlsZXNcblx0QGRydW0uc3R5bGUgPVxuXHRcdHBvaW50ZXJFdmVudHM6IFwibm9uZVwiXG5cdFx0Ym9yZGVyVG9wOiBcIjFweCBzb2xpZCBcIiArIGRlZmF1bHRzLmxpbmVUaW50XG5cdFx0Ym9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCBcIiArIGRlZmF1bHRzLmxpbmVUaW50XG5cdFxuXHRAc2VsZWN0ZWRJdGVtLnN0eWxlID1cblx0XHRwb2ludGVyRXZlbnRzOiBcIm5vbmVcIlxuXHRcdGJvcmRlclRvcDogXCIxcHggc29saWQgcmdiYSgwLDAsMCwwLjMpXCJcblx0XHRib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4zKVwiXG5cdFx0XG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyLnN0eWxlID0gZGVmYXVsdHMubGlzdEl0ZW1UZXh0U3R5bGVcblx0QHBpY2tlckNvbnRhaW5lci5waWNrZXJIZWFkZXIuc3R5bGUgPSBcblx0XHRjb2xvcjogcGFyYW1zLnRleHRDb2xvclxuXHRcdHBhZGRpbmdMZWZ0OiBcIjIwcHhcIlxuXHRcdGJvcmRlclRvcDogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcdFx0XG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyLmh0bWwgPSBwYXJhbXMuZGVmYXVsdFRleHRcblx0XHRcblx0XHRcblx0IyBBZGQgZHJ1bXNcblx0QHBpY2tlckNvbnRhaW5lci5kcnVtcyA9IFtdXG5cdEBwaWNrZXJDb250YWluZXIuZHJ1bXNCeU5hbWUgPSB7fVxuXHRcblx0cGlja2VyU3RhcnRlZE1vdmluZyA9ICgpPT5cblx0XHRkcnVtVmFsdWVzID0ge31cblx0XHRuZXdWYWx1ZXMgPSBmb3IgZHJ1bSBpbiBAcGlja2VyQ29udGFpbmVyLmRydW1zXG5cdFx0XHRkcnVtVmFsdWVzW2RydW0ubmFtZV0gPSB7aW5kZXg6IGRydW0uaW5kZXgsIHZhbDogZHJ1bS52YWwsIHZlbG9jaXR5OiAwfVx0XG5cdFx0QHBpY2tlckNvbnRhaW5lci5lbWl0KFwiUGlja2VyU3RhcnRlZE1vdmluZ1wiIClcblx0XHRcblx0cGlja2VyRGlkQ2hhbmdlID0gKCk9PlxuXHRcdGRydW1WYWx1ZXMgPSB7fVxuXHRcdG5ld1ZhbHVlcyA9IGZvciBkcnVtIGluIEBwaWNrZXJDb250YWluZXIuZHJ1bXNcblx0XHRcdGRydW1WYWx1ZXNbZHJ1bS5uYW1lXSA9IHtpbmRleDogZHJ1bS5pbmRleCwgdmFsOiBkcnVtLnZhbH1cblxuXHRcdEBwaWNrZXJDb250YWluZXIuZW1pdChcIlBpY2tlckRpZENoYW5nZVwiLCBkcnVtVmFsdWVzIClcblx0XG5cdHBpY2tlckZpbmlzaGVkQ2hhbmdpbmcgPSAoKT0+XG5cdFx0ZHJ1bVZhbHVlcyA9IHt9XG5cdFx0bmV3VmFsdWVzID0gZm9yIGRydW0gaW4gQHBpY2tlckNvbnRhaW5lci5kcnVtc1xuXHRcdFx0ZHJ1bVZhbHVlc1tkcnVtLm5hbWVdID0ge2luZGV4OiBkcnVtLmluZGV4LCB2YWw6IGRydW0udmFsfVxuXG5cdFx0QHBpY2tlckNvbnRhaW5lci5lbWl0KFwiUGlja2VyRmluaXNoZWRDaGFuZ2luZ1wiLCBkcnVtVmFsdWVzIClcdFxuXHRpZiAocGFyYW1zLmRydW1zIGFuZCBwYXJhbXMuZHJ1bXMubGVuZ3RoID4gMClcblx0XHRmb3IgZHJ1bSBpbiBwYXJhbXMuZHJ1bXNcblx0XHRcdG5ld0RydW0gPSBuZXcgRHJ1bShAZHJ1bSwgZHJ1bS5uYW1lLCBkcnVtLml0ZW1zLCBkcnVtLnBhcmFtcylcblxuXHRcdFx0IyMgU3RvcmUgZHJ1bXMgaW5zaWRlIHRoZSBwaWNrZXJcblx0XHRcdEBwaWNrZXJDb250YWluZXIuZHJ1bXMucHVzaChuZXdEcnVtKVxuXHRcdFx0QHBpY2tlckNvbnRhaW5lci5kcnVtc0J5TmFtZVtkcnVtLm5hbWVdID0gbmV3RHJ1bSBcblxuXHRcdFx0IyMgRW5zdXJlIHRoYXQgY2hhbmdlcyB0byB0aGUgZHJ1bSBidWJibGUgdXAgdG8gdGhlIHBpY2tlclxuXHRcdFx0bmV3RHJ1bS5kcnVtQ29udGFpbmVyLm9uIFwiRHJ1bURpZENoYW5nZVwiLCBwaWNrZXJEaWRDaGFuZ2Vcblx0XHRcdFxuXHRcdFx0IyMgRW1pdCBhbiBldmVudCB3aGVuIGRydW1zIHN0b3AgbW92aW5nIGFsdG9nZXRoZXJcblx0XHRcdG5ld0RydW0uZHJ1bUNvbnRhaW5lci5vbiBcIkRydW1GaW5pc2hlZENoYW5naW5nXCIsIHBpY2tlckZpbmlzaGVkQ2hhbmdpbmdcblxuXHRcdFx0IyMgRW1pdCBhbiBldmVudCB3aGVuIGxpc3RzIHN0b3AgbW92aW5nIGFsdG9nZXRoZXJcblx0XHRcdG5ld0RydW0uZHJ1bUNvbnRhaW5lci5vbiBcIkRydW1TdGFydGVkTW92aW5nXCIsIHBpY2tlclN0YXJ0ZWRNb3ZpbmdcblxuXG5cdHJldHVybiBAcGlja2VyQ29udGFpbmVyXG4iLCIjIyNcblx0dGFiQmFyTW9kdWxlXG5cdOKAk1xuXHRDcmVhdGVkIGJ5IFBldHRlciBOaWxzc29uXG5cdGh0dHA6Ly9wZXR0ZXIucHJvXG4jIyNcblxuIyBEZWZhdWx0IHN0eWxlc1xuZGVmYXVsdHMgPSB7XG5cdHNjcmVlbldpZHRoOiBTY3JlZW4ud2lkdGhcblx0c2NyZWVuSGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG5cdGJhckhlaWdodDogOThcblx0bGFiZWxPZmZzZXQ6IC0yOFxuXHRpY29uT2Zmc2V0OiAtMTJcblx0dGludENvbG9yOiBcIiMwMDdhZmZcIlxuXHR0aW50Q29sb3JVbnNlbGVjdGVkOiBcIiM5MjkyOTJcIlxuXHRibHVyOiA0MFxuXHRvcGFjaXR5OiAwLjc1XG5cdGJvcmRlclNoYWRvdzogXCIwcHggLTFweCAwcHggMHB4IHJnYmEoMCwwLDAsMC4zMilcIlxuXHRiYWNrZ3JvdW5kQ29sb3I6IFwiI2Y4ZjhmOFwiXG5cdHNob3dMYWJlbHM6IHRydWVcblx0YmFkZ2VTaXplOiAzNlxuXHRiYWRnZUNvbG9yOiBcIiNGRjNCMzBcIlxufVxuZGVmYXVsdHMubGFiZWxUZXh0U3R5bGUgPSB7XG5cdGZvbnRTaXplOiBcIjIwcHhcIlxuXHR0ZXh0QWxpZ246IFwiY2VudGVyXCJcblx0Zm9udEZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZScsIHNhbnMtc2VyaWZcIlxufVxuZGVmYXVsdHMuYmFkZ2VUZXh0U3R5bGUgPSB7XG5cdGZvbnRTaXplOiBcIjI2cHhcIlxuXHRsaW5lSGVpZ2h0OiBcIjM2cHhcIlxuXHRjb2xvcjogXCIjZmZmXCJcblx0dGV4dEFsaWduOiBcImNlbnRlclwiXG5cdGZvbnRGYW1pbHk6IFwiSGVsdmV0aWNhIE5ldWUnLCBzYW5zLXNlcmlmXCJcbn1cbmV4cG9ydHMuZGVmYXVsdHMgPSBkZWZhdWx0c1xuXG5cbmdldEl0ZW1Gcm9tTmFtZSA9IChuYW1lKSAtPlxuXHQjIFJldHVybnMgYSB0YWIgYmFyIGl0ZW0gaWYgbmFtZXMgbWF0Y2hlc1xuXG5cdGZvciBpdGVtIGluIEBpdGVtc1xuXHRcdHJldHVybiBpdGVtIGlmIGl0ZW0ubmFtZSBpcyBuYW1lXG5cblxudXBkYXRlVmlld3MgPSAoc2VsZWN0ZWRJdGVtKSAtPlxuXHQjIFNob3dzL2hpZGVzIHZpZXdzIGJhc2VkIG9uIHNlbGVjdGVkIHRhYiBiYXIgaXRlbVxuXG5cdGZvciBpdGVtIGluIEBpdGVtc1xuXHRcdGlmIGl0ZW0udmlldz9cblx0XHRcdGlmIGl0ZW0udmlldyBpcyBzZWxlY3RlZEl0ZW0udmlldyB0aGVuIGl0ZW0udmlldy52aXNpYmxlID0gdHJ1ZSBlbHNlIGl0ZW0udmlldy52aXNpYmxlID0gZmFsc2Vcblx0XHRcdGlmIGl0ZW0uYmx1clZpZXcgaXMgc2VsZWN0ZWRJdGVtLmJsdXJWaWV3IHRoZW4gaXRlbS5ibHVyVmlldy52aXNpYmxlID0gdHJ1ZSBlbHNlIGl0ZW0uYmx1clZpZXcudmlzaWJsZSA9IGZhbHNlXG5cblxuc2V0U2VsZWN0ZWQgPSAobmFtZSkgLT5cblx0IyBTZXRzIHNlbGVjdGVkIHRhYiBpdGVtIGZyb20gdGhlIGtleSAobmFtZSkgdXNlZCB3aGVuIGNyZWF0aW5nIGl0XG5cblx0aWYgbmFtZSAhPSBAc2VsZWN0ZWRcblx0XHRmb3IgaXRlbSBpbiBAaXRlbXNcblx0XHRcdGlmIGl0ZW0ubmFtZSBpcyBuYW1lXG5cdFx0XHRcdGl0ZW0uaWNvbkxheWVyLmJhY2tncm91bmRDb2xvciA9IGRlZmF1bHRzLnRpbnRDb2xvclxuXHRcdFx0XHRpdGVtLmxhYmVsTGF5ZXIuc3R5bGUgPSBcImNvbG9yXCI6IGRlZmF1bHRzLnRpbnRDb2xvciBpZiBpdGVtLmxhYmVsTGF5ZXJcblx0XHRcdFx0aXRlbS5pY29uTGF5ZXIuc3R5bGUgPSBcIi13ZWJraXQtbWFzay1pbWFnZVwiOiBcInVybChcIiArIGl0ZW0uaWNvbkxheWVyLnNlbGVjdGVkSWNvbiArIFwiKVwiIGlmIGl0ZW0uaWNvbkxheWVyLnNlbGVjdGVkSWNvblxuXHRcdFx0XHRAc2VsZWN0ZWQgPSBpdGVtLm5hbWVcblx0XHRcdFx0QHVwZGF0ZVZpZXdzKGl0ZW0pXG5cdFx0XHRcdEAuZW1pdChcInRhYkJhckRpZFN3aXRjaFwiLCBpdGVtLm5hbWUpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGl0ZW0uaWNvbkxheWVyLmJhY2tncm91bmRDb2xvciA9IGRlZmF1bHRzLnRpbnRDb2xvclVuc2VsZWN0ZWRcblx0XHRcdFx0aXRlbS5sYWJlbExheWVyLnN0eWxlID0gXCJjb2xvclwiOiBkZWZhdWx0cy50aW50Q29sb3JVbnNlbGVjdGVkIGlmIGl0ZW0ubGFiZWxMYXllclxuXHRcdFx0XHRpdGVtLmljb25MYXllci5zdHlsZSA9IFwiLXdlYmtpdC1tYXNrLWltYWdlXCI6IFwidXJsKFwiICsgaXRlbS5pY29uTGF5ZXIuaWNvbiArIFwiKVwiIGlmIGl0ZW0uaWNvbkxheWVyLnNlbGVjdGVkSWNvblxuXG5cbnNldEJhZGdlVmFsdWUgPSAobmFtZSwgdmFsdWUpIC0+XG5cdCMgQWRkcyBhIGJhZGdlIHRvIHRoZSB0YWIgaXRlbSBpZiB2YWx1ZSBpcyBhIG51bWJlciA+IDAgYW5kIHJlbW92ZXMgdGhlIGJhZGdlIGlmIG51bGxcblxuXHRmb3IgaXRlbSBpbiBAaXRlbXNcblx0XHRpZiBpdGVtLm5hbWUgaXMgbmFtZVxuXHRcdFx0aWYgdmFsdWVcblx0XHRcdFx0aXRlbS5iYWRnZUxheWVyLmh0bWwgPSB2YWx1ZVxuXHRcdFx0XHRpdGVtLmJhZGdlTGF5ZXIudmlzaWJsZSA9IHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXRlbS5iYWRnZUxheWVyLnZpc2libGUgPSBmYWxzZVxuXG5cbmV4cG9ydHMudGFiQmFyID0gKGJhckl0ZW1zKSAtPlxuXHQjIENyZWF0ZXMgYW5kIHNldC11cHMgdGhlIHRhYiBiYXJcblxuXHR0YWJCYXIgPSBuZXcgTGF5ZXJcblx0XHR4OiAwXG5cdFx0eTogZGVmYXVsdHMuc2NyZWVuSGVpZ2h0IC0gZGVmYXVsdHMuYmFySGVpZ2h0XG5cdFx0d2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy5iYXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGRlZmF1bHRzLmJhY2tncm91bmRDb2xvclxuXG5cdHRhYkJhci5zdHlsZSA9IFwiYm94LXNoYWRvd1wiOiBkZWZhdWx0cy5ib3JkZXJTaGFkb3dcblx0dGFiQmFyLmdldEl0ZW1Gcm9tTmFtZSA9IGdldEl0ZW1Gcm9tTmFtZVxuXHR0YWJCYXIudXBkYXRlVmlld3MgPSB1cGRhdGVWaWV3c1xuXHR0YWJCYXIuc2V0U2VsZWN0ZWQgPSBzZXRTZWxlY3RlZFxuXHR0YWJCYXIuc2V0QmFkZ2VWYWx1ZSA9IHNldEJhZGdlVmFsdWVcblx0dGFiQmFyLnNlbGVjdGVkID0gbnVsbFxuXHR0YWJCYXIuaXRlbXMgPSBbXVxuXG5cdGJhY2tncm91bmQgPSBuZXcgTGF5ZXJcblx0XHR4OiAwXG5cdFx0eTogMFxuXHRcdHdpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMuYmFySGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBkZWZhdWx0cy5iYWNrZ3JvdW5kQ29sb3Jcblx0XHRvcGFjaXR5OiBkZWZhdWx0cy5vcGFjaXR5XG5cdFx0c3VwZXJMYXllcjogdGFiQmFyXG5cblx0aXRlbUNvdW50ID0gT2JqZWN0LmtleXMoYmFySXRlbXMpLmxlbmd0aFxuXHRpID0gMFxuXG5cdGZvciBuYW1lLHBhcmFtcyBvZiBiYXJJdGVtc1xuXHRcdGl0ZW1MYXllciA9IG5ldyBMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIm5vbmVcIlxuXHRcdFx0d2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoIC8gaXRlbUNvdW50XG5cdFx0XHRoZWlnaHQ6IGRlZmF1bHRzLmJhckhlaWdodFxuXHRcdFx0eDogaSAqIChkZWZhdWx0cy5zY3JlZW5XaWR0aCAvIGl0ZW1Db3VudClcblx0XHRcdHk6IDBcblx0XHRcdHN1cGVyTGF5ZXI6IHRhYkJhclxuXHRcdFx0bmFtZTogbmFtZVxuXG5cdFx0aWYgcGFyYW1zLnZpZXc/XG5cdFx0XHQjIENyZWF0ZSBhIGNvcHkgb2YgdGhlIHZpZXcsIGJsdXIgaXQgYW5kIHVzZSBpdCBhcyBhIGJhY2tncm91bmRcblx0XHRcdGJsdXJWaWV3ID0gcGFyYW1zLnZpZXcuY29weSgpXG5cdFx0XHRpZiBTY3JvbGxDb21wb25lbnQucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYmx1clZpZXcpXG5cdFx0XHRcdGJsdXJWaWV3LmNvbnRlbnQuYmx1ciA9IGRlZmF1bHRzLmJsdXJcblx0XHRcdGVsc2Vcblx0XHRcdFx0Ymx1clZpZXcuYmx1ciA9IGRlZmF1bHRzLmJsdXJcblx0XHRcdGJsdXJWaWV3LnN1cGVyTGF5ZXIgPSB0YWJCYXJcblx0XHRcdGJsdXJWaWV3LmluZGV4ID0gMFxuXHRcdFx0Ymx1clZpZXcueSA9IGJsdXJWaWV3LnkgLSAoZGVmYXVsdHMuc2NyZWVuSGVpZ2h0IC0gZGVmYXVsdHMuYmFySGVpZ2h0KVxuXG5cdFx0XHRpdGVtTGF5ZXIudmlldyA9IHBhcmFtcy52aWV3XG5cdFx0XHRpdGVtTGF5ZXIuYmx1clZpZXcgPSBibHVyVmlld1xuXG5cdFx0aWNvbkxheWVyID0gbmV3IExheWVyXG5cdFx0XHR3aWR0aDogNjBcblx0XHRcdGhlaWdodDogNjBcblx0XHRcdHN1cGVyTGF5ZXI6IGl0ZW1MYXllclxuXHRcdGljb25MYXllci5pY29uID0gcGFyYW1zLmljb25cblx0XHRpY29uTGF5ZXIuc2VsZWN0ZWRJY29uID0gcGFyYW1zLnNlbGVjdGVkSWNvbiBpZiBwYXJhbXMuc2VsZWN0ZWRJY29uP1xuXG5cdFx0IyBUaGlzIGJsYWNrIG1hZ2ljIGlzIHVzZWQgdG8gdGludCB0aGUgUE5HIGltYWdlcy4gT25seSB3b3JrcyBvbiB3ZWJraXQgYnJvd3NlcnMgOi9cblx0XHRpY29uTGF5ZXIuc3R5bGUgPVxuXHRcdFx0XCItd2Via2l0LW1hc2staW1hZ2VcIjogXCJ1cmwoXCIgKyBpY29uTGF5ZXIuaWNvbiArIFwiKVwiXG5cdFx0XHRcIi13ZWJraXQtbWFzay1yZXBlYXRcIjogXCJuby1yZXBlYXRcIlxuXHRcdFx0XCItd2Via2l0LW1hc2stcG9zaXRpb25cIjogXCJjZW50ZXIgY2VudGVyXCJcblx0XHRpY29uTGF5ZXIuY2VudGVyWCgpXG5cdFx0aWNvbkxheWVyLmNlbnRlclkoZGVmYXVsdHMuaWNvbk9mZnNldClcblx0XHRpdGVtTGF5ZXIuaWNvbkxheWVyID0gaWNvbkxheWVyXG5cblx0XHRpZiBkZWZhdWx0cy5zaG93TGFiZWxzXG5cdFx0XHRsYWJlbExheWVyID0gbmV3IExheWVyXG5cdFx0XHRcdHdpZHRoOiBpdGVtTGF5ZXIud2lkdGhcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiBkZWZhdWx0cy5iYXJIZWlnaHQgKyBkZWZhdWx0cy5sYWJlbE9mZnNldFxuXHRcdFx0XHRzdXBlckxheWVyOiBpdGVtTGF5ZXJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIm5vbmVcIlxuXHRcdFx0bGFiZWxMYXllci5odG1sID0gbmFtZVxuXHRcdFx0bGFiZWxMYXllci5zdHlsZSA9IGRlZmF1bHRzLmxhYmVsVGV4dFN0eWxlXG5cdFx0XHRpdGVtTGF5ZXIubGFiZWxMYXllciA9IGxhYmVsTGF5ZXJcblxuXHRcdGJhZGdlTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHdpZHRoOiBkZWZhdWx0cy5iYWRnZVNpemVcblx0XHRcdGhlaWdodDogZGVmYXVsdHMuYmFkZ2VTaXplXG5cdFx0XHR4OiAwXG5cdFx0XHR5OiA2XG5cdFx0XHRib3JkZXJSYWRpdXM6IDE4XG5cdFx0XHRzdXBlckxheWVyOiBpdGVtTGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuYmFkZ2VDb2xvclxuXHRcdGJhZGdlTGF5ZXIuc3R5bGUgPSBkZWZhdWx0cy5iYWRnZVRleHRTdHlsZVxuXHRcdGJhZGdlTGF5ZXIuY2VudGVyWCgyNilcblxuXHRcdGl0ZW1MYXllci5iYWRnZUxheWVyID0gYmFkZ2VMYXllclxuXHRcdGl0ZW1MYXllci5iYWRnZUxheWVyLnZpc2libGUgPSBmYWxzZVxuXG5cdFx0dGFiQmFyLml0ZW1zLnB1c2goaXRlbUxheWVyKVxuXG5cdFx0aXRlbUxheWVyLm9uIEV2ZW50cy5DbGljaywgLT5cblx0XHRcdHRhYkJhci5zZXRTZWxlY3RlZChAbmFtZSlcblxuXHRcdGkrK1xuXG5cdCMgU2VsZWN0IHRoZSBmaXJzdCBpdGVtIGluIHRoZSB0YWIgYmFyXG5cdHRhYkJhci5zZXRTZWxlY3RlZCh0YWJCYXIuaXRlbXNbMF0ubmFtZSlcblxuXHRyZXR1cm4gdGFiQmFyXG4iLCJleHBvcnRzLmJnID0gbmV3IEJhY2tncm91bmRMYXllclxuZXhwb3J0cy5iZy5iYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnXG5cblxuZXhwb3J0cy50aXRsZSA9IG5ldyBMYXllclxuXHRiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcblx0aHRtbDogJ0ZyYW1lciBTY2FmZm9sZCw8YnI+IHF1aWNrIHN0YXJ0IHdpdGggYmFzaWMgbW9kdWxlcy4nXG5cdHN0eWxlOiB7XG5cdFx0J2NvbG9yJzogJ3NsYXRlZ3JheScsXG5cdFx0J3RleHQtYWxpZ24nOiAnY2VudGVyJyxcblx0XHQnZm9udC1mYW1pbHknOiAnU2FuIEZyYW5jaXNjbyBEaXNwbGF5Jyxcblx0XHQnZm9udC13ZWlnaHQnOiAnNTAwJyxcblx0XHQnZm9udC1zaXplJzogJzQ4cHgnLFxuXHRcdCdsaW5lLWhlaWdodCc6ICcxMjAlJyxcblx0XHQncGFkZGluZyc6ICcxMHB4J31cblx0d2lkdGg6IFNjcmVlbi53aWR0aFxuXHRoZWlnaHQ6IDQwMFxuXHR5OiAzMDBcblxuXG5cbmV4cG9ydHMuc3BhcmsgPSBuZXcgTGF5ZXJcblx0aW1hZ2U6IFwiaW1hZ2VzL2ZsYXQtc3BhcmsucG5nXCJcblx0c2NhbGU6IDIuNVxuXG5leHBvcnRzLnNwYXJrLmNlbnRlcigpXG4iXX0=
