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
exports.bg = new BackgroundLayer({
  backgroundColor: "#fff",
  name: 'bg'
});

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
  y: 300,
  name: 'title'
});

exports.spark = new Layer({
  image: "images/flat-spark.png",
  scale: 2.5,
  name: 'spark'
});

exports.spark.center();



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvemFjaGFyeS9SZXBvcy9mcmFtZXJTY2FmZm9sZC5mcmFtZXIvbW9kdWxlcy9WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIuY29mZmVlIiwiL1VzZXJzL3phY2hhcnkvUmVwb3MvZnJhbWVyU2NhZmZvbGQuZnJhbWVyL21vZHVsZXMvZnJhbWVyS2l0LmNvZmZlZSIsIi9Vc2Vycy96YWNoYXJ5L1JlcG9zL2ZyYW1lclNjYWZmb2xkLmZyYW1lci9tb2R1bGVzL3RhYkJhck1vZHVsZS5jb2ZmZWUiLCIvVXNlcnMvemFjaGFyeS9SZXBvcy9mcmFtZXJTY2FmZm9sZC5mcmFtZXIvbW9kdWxlcy93ZWxjb21lU2NyZWVuLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7NkJBQUE7O0FBQUEsT0FBYSxDQUFDO0FBR2IsTUFBQSxvR0FBQTs7QUFBQSw4Q0FBQSxDQUFBOztBQUFBLEVBQUEsaUJBQUEsR0FBb0IsYUFBcEIsQ0FBQTs7QUFBQSxFQUNBLG9CQUFBLEdBQXVCLGdCQUR2QixDQUFBOztBQUFBLEVBRUEsaUJBQUEsR0FDQztBQUFBLElBQUEsSUFBQSxFQUFNLEdBQU47QUFBQSxJQUNBLEtBQUEsRUFBTyxhQURQO0dBSEQsQ0FBQTs7QUFBQSxFQUtBLGlCQUFBLEdBQ0M7QUFBQSxJQUFBLENBQUEsRUFBRyxDQUFIO0FBQUEsSUFDQSxDQUFBLEVBQUcsRUFESDtBQUFBLElBRUEsS0FBQSxFQUFPLEVBRlA7QUFBQSxJQUdBLE1BQUEsRUFBUSxFQUhSO0dBTkQsQ0FBQTs7QUFBQSxFQVVBLElBQUEsR0FDQztBQUFBLElBQUEsRUFBQSxFQUFRLFFBQVI7QUFBQSxJQUNBLElBQUEsRUFBUSxVQURSO0FBQUEsSUFFQSxJQUFBLEVBQVEsVUFGUjtBQUFBLElBR0EsS0FBQSxFQUFRLFdBSFI7QUFBQSxJQUlBLE1BQUEsRUFBUSxZQUpSO0dBWEQsQ0FBQTs7QUFBQSxFQWdCQSxHQUFBLEdBQ0M7QUFBQSxJQUFBLEVBQUEsRUFBTyxJQUFQO0FBQUEsSUFDQSxJQUFBLEVBQU8sTUFEUDtBQUFBLElBRUEsSUFBQSxFQUFPLE1BRlA7QUFBQSxJQUdBLEtBQUEsRUFBTyxPQUhQO0dBakJELENBQUE7O0FBQUEsRUFxQkEsVUFBQSxHQUFhLEtBckJiLENBQUE7O0FBd0JhLEVBQUEsa0NBQUMsT0FBRCxHQUFBO0FBRVosUUFBQSx5QkFBQTtBQUFBLElBRmEsSUFBQyxDQUFBLDRCQUFELFVBQVMsRUFFdEIsQ0FBQTtBQUFBLElBQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBQyxDQUFBLGVBQUQsR0FBbUIsSUFBekcsQ0FBQTs7VUFDUSxDQUFDLFFBQW1CLE1BQU0sQ0FBQztLQURuQzs7V0FFUSxDQUFDLFNBQW1CLE1BQU0sQ0FBQztLQUZuQzs7V0FHUSxDQUFDLE9BQW1CO0tBSDVCOztXQUlRLENBQUMsa0JBQW1CO0tBSjVCO0FBQUEsSUFNQSwwREFBTSxJQUFDLENBQUEsT0FBUCxDQU5BLENBQUE7QUFBQSxJQVFBLElBQUMsQ0FBQSxLQUFELEdBQVcsRUFSWCxDQUFBO0FBQUEsSUFTQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBVFgsQ0FBQTtBQUFBLElBVUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUMsQ0FBQSxPQUFPLENBQUMsZ0JBQVQsSUFBNkIsaUJBVmpELENBQUE7QUFBQSxJQVdBLElBQUMsQ0FBQSxlQUFELEdBQW9CLElBQUMsQ0FBQSxPQUFPLENBQUMsZUFBVCxJQUE2QixpQkFYakQsQ0FBQTtBQUFBLElBWUEsSUFBQyxDQUFBLGVBQUQsR0FBb0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxlQUFULElBQTZCLGlCQVpqRCxDQUFBO0FBQUEsSUFhQSxJQUFDLENBQUEsU0FBRCxHQUFvQixJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVQsSUFBNkIsVUFiakQsQ0FBQTtBQUFBLElBZUEsSUFBQyxDQUFDLEVBQUYsQ0FBSyxrQkFBTCxFQUF5QixTQUFDLFVBQUQsR0FBQTtBQUN4QixVQUFBLDhCQUFBO0FBQUE7QUFBQTtXQUFBLHFDQUFBOzBCQUFBO0FBQUEscUJBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxRQUFULEVBQW1CLElBQW5CLEVBQUEsQ0FBQTtBQUFBO3FCQUR3QjtJQUFBLENBQXpCLENBZkEsQ0FGWTtFQUFBLENBeEJiOztBQUFBLHFDQTRDQSxPQUFBLEdBQVMsU0FBQyxJQUFELEVBQU8sc0JBQVAsR0FBQTtBQUVSLFFBQUEsd0JBQUE7QUFBQSxJQUFBLFFBQUEsR0FBWSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQXJCLENBQUE7QUFBQSxJQUNBLFNBQUEsR0FBWSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BRHJCLENBQUE7QUFBQSxJQUdBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUNDO1lBQUEsRUFBQTtBQUFBLFVBQUEsRUFBQSxHQUFJLElBQUksQ0FBQyxNQUNSO0FBQUEsUUFBQSxDQUFBLEVBQUcsQ0FBSDtBQUFBLFFBQ0EsQ0FBQSxFQUFHLENBQUEsU0FESDtPQUREO0FBQUEsVUFHQSxFQUFBLEdBQUksSUFBSSxDQUFDLFFBQ1I7QUFBQSxRQUFBLENBQUEsRUFBRyxDQUFBLFFBQUg7QUFBQSxRQUNBLENBQUEsRUFBRyxDQURIO09BSkQ7QUFBQSxVQU1BLEVBQUEsR0FBSSxJQUFJLENBQUMsVUFDUjtBQUFBLFFBQUEsQ0FBQSxFQUFHLENBQUg7QUFBQSxRQUNBLENBQUEsRUFBRyxDQURIO09BUEQ7QUFBQSxVQVNBLEVBQUEsR0FBSSxJQUFJLENBQUMsU0FDUjtBQUFBLFFBQUEsQ0FBQSxFQUFHLFFBQUg7QUFBQSxRQUNBLENBQUEsRUFBRyxDQURIO09BVkQ7QUFBQSxVQVlBLEVBQUEsR0FBSSxJQUFJLENBQUMsUUFDUjtBQUFBLFFBQUEsQ0FBQSxFQUFHLENBQUg7QUFBQSxRQUNBLENBQUEsRUFBRyxTQURIO09BYkQ7O0tBREQsQ0FIQSxDQUFBO0FBQUEsSUFzQkEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBWixHQUErQixJQUFDLENBQUEsZ0JBdEJoQyxDQUFBO0FBd0JBLElBQUEsSUFBRyxJQUFJLENBQUMsSUFBTCxLQUFhLElBQUMsQ0FBQSxlQUFqQjtBQUNDLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFmLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFEZixDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQVosQ0FBMEIsSUFBSSxDQUFDLE1BQS9CLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsSUFBZCxDQUhBLENBREQ7S0FBQSxNQUFBO0FBTUMsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQVosQ0FBMEIsSUFBSSxDQUFDLEtBQS9CLENBQUEsQ0FORDtLQXhCQTtBQWdDQSxJQUFBLElBQUEsQ0FBQSxDQUFPLElBQUksQ0FBQyxVQUFMLEtBQW1CLElBQW5CLElBQXdCLHNCQUEvQixDQUFBO0FBQ0MsTUFBQSxJQUFJLENBQUMsVUFBTCxHQUFrQixJQUFsQixDQUREO0tBaENBO0FBbUNBLElBQUEsSUFBOEIsSUFBSSxDQUFDLElBQUwsS0FBYSxJQUFDLENBQUEsZUFBNUM7QUFBQSxNQUFBLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixJQUFsQixDQUFBLENBQUE7S0FuQ0E7V0FxQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksSUFBWixFQXZDUTtFQUFBLENBNUNULENBQUE7O0FBQUEscUNBcUZBLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxTQUFQLEVBQThCLGFBQTlCLEVBQXFELGNBQXJELEdBQUE7O01BQU8sWUFBWSxHQUFHLENBQUM7S0FFbEM7O01BRnlDLGdCQUFnQjtLQUV6RDs7TUFGZ0UsaUJBQWlCO0tBRWpGO0FBQUEsSUFBQSxJQUFnQixJQUFBLEtBQVEsSUFBQyxDQUFBLFdBQXpCO0FBQUEsYUFBTyxLQUFQLENBQUE7S0FBQTtBQUlBLElBQUEsSUFBRyxTQUFBLEtBQWEsR0FBRyxDQUFDLEtBQXBCO0FBQ0MsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQVosQ0FBMkIsSUFBSSxDQUFDLEtBQWhDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBRCxDQUFuQixDQUEyQixJQUFJLENBQUMsSUFBaEMsQ0FEQSxDQUREO0tBQUEsTUFHSyxJQUFHLFNBQUEsS0FBYSxHQUFHLENBQUMsSUFBcEI7QUFDSixNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBWixDQUEyQixJQUFJLENBQUMsSUFBaEMsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFELENBQW5CLENBQTJCLElBQUksQ0FBQyxFQUFoQyxDQURBLENBREk7S0FBQSxNQUdBLElBQUcsU0FBQSxLQUFhLEdBQUcsQ0FBQyxJQUFwQjtBQUNKLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFaLENBQTJCLElBQUksQ0FBQyxJQUFoQyxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQUQsQ0FBbkIsQ0FBMkIsSUFBSSxDQUFDLEtBQWhDLENBREEsQ0FESTtLQUFBLE1BR0EsSUFBRyxTQUFBLEtBQWEsR0FBRyxDQUFDLEVBQXBCO0FBQ0osTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQVosQ0FBMkIsSUFBSSxDQUFDLEVBQWhDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBRCxDQUFuQixDQUEyQixJQUFJLENBQUMsSUFBaEMsQ0FEQSxDQURJO0tBQUEsTUFBQTtBQUtKLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFaLENBQTBCLElBQUksQ0FBQyxNQUEvQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBTSxDQUFDLGFBQXBCLENBQWtDLElBQUksQ0FBQyxJQUF2QyxDQURBLENBTEk7S0FiTDtBQUFBLElBc0JBLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBRCxDQUFYLENBQW1CLElBQUksQ0FBQyxNQUF4QixDQXRCQSxDQUFBO0FBQUEsSUF3QkEsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBQyxDQUFBLFdBeEJqQixDQUFBO0FBQUEsSUEwQkEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQTFCZixDQUFBO0FBNkJBLElBQUEsSUFBK0IsY0FBQSxLQUFrQixLQUFqRDtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsSUFBQyxDQUFBLFlBQWYsQ0FBQSxDQUFBO0tBN0JBO1dBK0JBLElBQUMsQ0FBQSxJQUFELENBQU0sTUFBTSxDQUFDLE1BQWIsRUFqQ1c7RUFBQSxDQXJGWixDQUFBOztBQUFBLHFDQXdIQSxnQkFBQSxHQUFrQixTQUFDLElBQUQsR0FBQTtXQUNqQixLQUFLLENBQUMsS0FBTixDQUFZLENBQVosRUFBZSxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLGVBQUwsQ0FBcUIsb0JBQXJCLENBQTJDLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBOUMsR0FBd0QsTUFEMUM7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmLEVBRGlCO0VBQUEsQ0F4SGxCLENBQUE7O0FBQUEscUNBNEhBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDTCxRQUFBLHdDQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsVUFBRCxDQUFZLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQVosRUFBb0MsU0FBQSxHQUFZLEdBQUcsQ0FBQyxJQUFwRCxFQUEwRCxhQUFBLEdBQWdCLEtBQTFFLEVBQWlGLGNBQUEsR0FBaUIsSUFBbEcsQ0FBQSxDQUFBO1dBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxHQUFULENBQUEsRUFGSztFQUFBLENBNUhOLENBQUE7O0FBQUEscUNBZ0lBLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTtBQUNwQixXQUFPLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULEdBQWtCLENBQWxCLENBQWhCLENBRG9CO0VBQUEsQ0FoSXJCLENBQUE7O0FBQUEscUNBbUlBLGdCQUFBLEdBQWtCLFNBQUMsSUFBRCxFQUFPLEtBQVAsR0FBQTs7TUFBTyxRQUFRLElBQUMsQ0FBQTtLQUNqQztXQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksQ0FBWixFQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFBLEdBQUE7QUFDZCxZQUFBLFVBQUE7QUFBQSxRQUFBLElBQUcsSUFBSSxDQUFDLFVBQUwsS0FBcUIsS0FBeEI7QUFDQyxVQUFBLFVBQUEsR0FBaUIsSUFBQSxLQUFBLENBQ2hCO0FBQUEsWUFBQSxJQUFBLEVBQU0sb0JBQU47QUFBQSxZQUNBLEtBQUEsRUFBTyxFQURQO0FBQUEsWUFFQSxNQUFBLEVBQVEsRUFGUjtBQUFBLFlBR0EsVUFBQSxFQUFZLElBSFo7V0FEZ0IsQ0FBakIsQ0FBQTtBQU1BLFVBQUEsSUFBRyxLQUFDLENBQUEsU0FBRCxLQUFjLEtBQWpCO0FBQ0MsWUFBQSxVQUFVLENBQUMsZUFBWCxHQUE2QixhQUE3QixDQUREO1dBTkE7QUFBQSxVQVNBLFVBQVUsQ0FBQyxLQUFYLEdBQW1CLEtBVG5CLENBQUE7aUJBV0EsVUFBVSxDQUFDLEVBQVgsQ0FBYyxNQUFNLENBQUMsS0FBckIsRUFBNEIsU0FBQSxHQUFBO21CQUMzQixLQUFDLENBQUEsSUFBRCxDQUFBLEVBRDJCO1VBQUEsQ0FBNUIsRUFaRDtTQURjO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZixFQURpQjtFQUFBLENBbklsQixDQUFBOztrQ0FBQTs7R0FIOEMsTUFBL0MsQ0FBQTs7Ozs7QUNBQTtBQUFBOzs7Ozs7Ozs7Ozs7R0FBQTtBQWlCQTtBQUFBOzs7OztHQWpCQTtBQUFBLElBQUEscURBQUE7O0FBQUEsUUF1QkEsR0FBVztBQUFBLEVBQ1YsV0FBQSxFQUFhLEdBREg7Q0F2QlgsQ0FBQTs7QUEyQkE7QUFBQTs7R0EzQkE7O0FBQUEsUUE4QlEsQ0FBQyxjQUFULEdBQTBCLEVBOUIxQixDQUFBOztBQUFBLFFBK0JRLENBQUMseUJBQVQsR0FBcUMsRUEvQnJDLENBQUE7O0FBQUEsUUFnQ1EsQ0FBQyxJQUFULEdBQWdCLE1BaENoQixDQUFBOztBQUFBLFFBaUNRLENBQUMsUUFBVCxHQUFvQixxQkFqQ3BCLENBQUE7O0FBQUEsUUFrQ1EsQ0FBQyxVQUFULEdBQXNCLFNBbEN0QixDQUFBOztBQUFBLFFBbUNRLENBQUMsY0FBVCxHQUEwQixPQW5DMUIsQ0FBQTs7QUFBQSxRQW9DUSxDQUFDLGlCQUFULEdBQTZCO0FBQUEsRUFDNUIsUUFBQSxFQUFVLE1BRGtCO0FBQUEsRUFFNUIsVUFBQSxFQUFZLENBQUMsUUFBUSxDQUFDLGNBQVQsR0FBd0IsQ0FBekIsQ0FBQSxHQUE0QixJQUZaO0FBQUEsRUFHNUIsVUFBQSxFQUFZLGdCQUhnQjtBQUFBLEVBSTVCLFVBQUEsRUFBWSxLQUpnQjtDQXBDN0IsQ0FBQTs7QUFBQSxRQTBDUSxDQUFDLG9CQUFULEdBQWdDO0FBQUEsRUFDL0IsUUFBQSxFQUFVLE1BRHFCO0FBQUEsRUFFL0IsVUFBQSxFQUFZLENBQUMsUUFBUSxDQUFDLGNBQVQsR0FBd0IsQ0FBekIsQ0FBQSxHQUE0QixJQUZUO0FBQUEsRUFHL0IsVUFBQSxFQUFZLGdCQUhtQjtBQUFBLEVBSS9CLFVBQUEsRUFBWSxLQUptQjtBQUFBLEVBSy9CLGFBQUEsRUFBZSxXQUxnQjtDQTFDaEMsQ0FBQTs7QUFBQSxRQWlEUSxDQUFDLGVBQVQsR0FBMkI7QUFBQSxFQUMxQixRQUFBLEVBQVksTUFEYztBQUFBLEVBRTFCLFVBQUEsRUFBYSxnQkFGYTtBQUFBLEVBRzFCLFVBQUEsRUFBYSxLQUhhO0NBakQzQixDQUFBOztBQUFBLE9Bc0RPLENBQUMsUUFBUixHQUFtQixRQXREbkIsQ0FBQTs7QUF5REE7QUFBQTs7O0dBekRBOztBQUFBLE1BOERBLEdBQVMsU0FBQyxNQUFELEdBQUE7QUFDUixNQUFBLDhDQUFBO0FBQUEsRUFBQSxNQUFBLEdBQVMsTUFBQSxJQUFVLEVBQW5CLENBQUE7QUFBQSxFQUNBLENBQUMsQ0FBQyxRQUFGLENBQVcsTUFBWCxFQUNDO0FBQUEsSUFBQSxVQUFBLEVBQVksUUFBUSxDQUFDLFVBQXJCO0FBQUEsSUFDQSxXQUFBLEVBQWEsUUFBUSxDQUFDLFdBRHRCO0FBQUEsSUFFQSxjQUFBLEVBQWdCLFFBQVEsQ0FBQyxjQUZ6QjtBQUFBLElBR0EscUJBQUEsRUFBdUIsQ0FIdkI7QUFBQSxJQUlBLHFCQUFBLEVBQXVCLEVBSnZCO0FBQUEsSUFLQSxvQkFBQSxFQUFzQixFQUx0QjtBQUFBLElBTUEsV0FBQSxFQUFhLFFBQVEsQ0FBQyxRQU50QjtHQURELENBREEsQ0FBQTtBQUFBLEVBVUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQVZaLENBQUE7QUFBQSxFQWNBLGtCQUFBLEdBQXFCLE1BQU0sQ0FBQyxxQkFBUCxHQUE2QixDQWRsRCxDQUFBO0FBQUEsRUFlQSwwQkFBQSxHQUE2QixDQWY3QixDQUFBO0FBQUEsRUFtQkEsSUFBQyxDQUFBLHFCQUFELEdBQTZCLElBQUEsS0FBQSxDQUM1QjtBQUFBLElBQUEsQ0FBQSxFQUFRLENBQVI7QUFBQSxJQUNBLENBQUEsRUFBUSxDQURSO0FBQUEsSUFFQSxJQUFBLEVBQVUsS0FGVjtBQUFBLElBR0EsS0FBQSxFQUFVLE1BQU0sQ0FBQyxvQkFIakI7QUFBQSxJQUlBLE1BQUEsRUFBVyxNQUFNLENBQUMscUJBSmxCO0FBQUEsSUFLQSxlQUFBLEVBQWtCLEVBTGxCO0FBQUEsSUFNQSxPQUFBLEVBQVksQ0FOWjtHQUQ0QixDQW5CN0IsQ0FBQTtBQUFBLEVBNEJBLElBQUMsQ0FBQSxnQkFBRCxHQUF3QixJQUFBLEtBQUEsQ0FDdkI7QUFBQSxJQUFBLENBQUEsRUFBTyxrQkFBQSxHQUFxQiwwQkFBQSxHQUEyQixDQUF2RDtBQUFBLElBQ0EsQ0FBQSxFQUFPLGtCQUFBLEdBQXFCLDBCQUFBLEdBQTJCLENBQWhELEdBQW9ELENBRDNEO0FBQUEsSUFFQSxLQUFBLEVBQVcsTUFBTSxDQUFDLG9CQUFQLEdBQThCLE1BQU0sQ0FBQyxxQkFBckMsR0FBNkQsMEJBRnhFO0FBQUEsSUFHQSxNQUFBLEVBQVcsTUFBTSxDQUFDLHFCQUFQLEdBQStCLE1BQU0sQ0FBQyxxQkFBdEMsR0FBOEQsMEJBSHpFO0FBQUEsSUFJQSxZQUFBLEVBQWdCLE1BQU0sQ0FBQyxxQkFKdkI7QUFBQSxJQUtBLFlBQUEsRUFBZSxrQkFBQSxHQUFxQiwwQkFBQSxHQUEyQixDQUFoRCxHQUFvRCxNQUFNLENBQUMscUJBTDFFO0FBQUEsSUFNQSxXQUFBLEVBQWUsTUFBTSxDQUFDLFVBTnRCO0FBQUEsSUFPQSxlQUFBLEVBQWtCLEVBUGxCO0FBQUEsSUFRQSxPQUFBLEVBQVksQ0FSWjtBQUFBLElBU0EsVUFBQSxFQUFjLElBQUMsQ0FBQSxxQkFUZjtHQUR1QixDQTVCeEIsQ0FBQTtBQUFBLEVBd0NBLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsS0FBQSxDQUNuQjtBQUFBLElBQUEsQ0FBQSxFQUFHLE1BQU0sQ0FBQyxvQkFBUCxHQUE4QixNQUFNLENBQUMscUJBQXhDO0FBQUEsSUFDQSxDQUFBLEVBQUcsQ0FBQSxDQURIO0FBQUEsSUFFQSxLQUFBLEVBQVUsa0JBQUEsR0FBbUIsQ0FGN0I7QUFBQSxJQUdBLE1BQUEsRUFBVyxrQkFBQSxHQUFtQixDQUg5QjtBQUFBLElBSUEsWUFBQSxFQUFnQixrQkFKaEI7QUFBQSxJQUtBLE9BQUEsRUFBVyxDQUxYO0FBQUEsSUFNQSxVQUFBLEVBQWMsQ0FOZDtBQUFBLElBT0EsV0FBQSxFQUFlLGlCQVBmO0FBQUEsSUFRQSxlQUFBLEVBQWtCLE9BUmxCO0FBQUEsSUFTQSxPQUFBLEVBQVksQ0FUWjtBQUFBLElBVUEsVUFBQSxFQUFjLElBQUMsQ0FBQSxxQkFWZjtHQURtQixDQXhDcEIsQ0FBQTtBQUFBLEVBc0RBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsR0FBekIsQ0FDQztBQUFBLElBQUEsVUFBQSxFQUNDO0FBQUEsTUFBQSxDQUFBLEVBQU8sQ0FBUDtBQUFBLE1BQ0EsQ0FBQSxFQUFPLENBQUEsQ0FEUDtBQUFBLE1BRUEsS0FBQSxFQUFTLE1BQU0sQ0FBQyxvQkFGaEI7QUFBQSxNQUdBLE1BQUEsRUFBVSxNQUFNLENBQUMscUJBSGpCO0FBQUEsTUFJQSxZQUFBLEVBQWUsTUFBTSxDQUFDLHFCQUp0QjtBQUFBLE1BS0EsUUFBQSxFQUFZLENBTFo7QUFBQSxNQU1BLFVBQUEsRUFBYSxHQU5iO0FBQUEsTUFPQSxlQUFBLEVBQWlCLEVBUGpCO0tBREQ7R0FERCxDQXREQSxDQUFBO0FBQUEsRUFnRUEsSUFBQyxDQUFBLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxnQkFBekIsR0FDQztBQUFBLElBQUEsS0FBQSxFQUFPLGFBQVA7QUFBQSxJQUNBLElBQUEsRUFBTSxHQUROO0dBakVELENBQUE7QUFBQSxFQW1FQSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsRUFBbEIsQ0FBcUIsTUFBTSxDQUFDLFlBQTVCLEVBQTBDLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFBLEdBQUE7YUFDekMsS0FBSyxDQUFDLEtBQU4sQ0FBWSxDQUFaLEVBQWUsU0FBQSxHQUFBO0FBQ2IsUUFBQSxJQUFHLEtBQUMsQ0FBQSxRQUFKO2lCQUNDLEtBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxlQUFsQixHQUFvQyxNQUFNLENBQUMsV0FENUM7U0FEYTtNQUFBLENBQWYsRUFEeUM7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQyxDQW5FQSxDQUFBO0FBQUEsRUF3RUEsSUFBQyxDQUFBLGdCQUFnQixDQUFDLEVBQWxCLENBQXFCLE1BQU0sQ0FBQyxjQUE1QixFQUE0QyxDQUFBLFNBQUEsS0FBQSxHQUFBO1dBQUEsU0FBQSxHQUFBO2FBQzNDLEtBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxlQUFsQixHQUFvQyxHQURPO0lBQUEsRUFBQTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUMsQ0F4RUEsQ0FBQTtBQUFBLEVBMkVBLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQXJCLENBQ0M7QUFBQSxJQUFBLFVBQUEsRUFBWTtBQUFBLE1BQUMsQ0FBQSxFQUFHLENBQUo7S0FBWjtHQURELENBM0VBLENBQUE7QUFBQSxFQTZFQSxJQUFDLENBQUEsWUFBWSxDQUFDLE1BQU0sQ0FBQyxnQkFBckIsR0FDQztBQUFBLElBQUEsS0FBQSxFQUFPLGtCQUFQO0dBOUVELENBQUE7QUFBQSxFQWdGQSxJQUFDLENBQUEscUJBQXFCLENBQUMsTUFBdkIsR0FBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtXQUFBLFNBQUEsR0FBQTtBQUMvQixNQUFBLEtBQUMsQ0FBQSxRQUFELEdBQVksSUFBWixDQUFBO0FBQUEsTUFDQSxLQUFDLENBQUEsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLFFBQUQsQ0FBeEIsQ0FBZ0MsU0FBaEMsQ0FEQSxDQUFBO2FBRUEsS0FBQyxDQUFBLFlBQVksQ0FBQyxNQUFNLENBQUMsUUFBRCxDQUFwQixDQUE0QixTQUE1QixFQUgrQjtJQUFBLEVBQUE7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBaEZoQyxDQUFBO0FBQUEsRUFxRkEsSUFBQyxDQUFBLHFCQUFxQixDQUFDLFFBQXZCLEdBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFBLEdBQUE7QUFDakMsTUFBQSxLQUFDLENBQUEsUUFBRCxHQUFZLEtBQVosQ0FBQTtBQUFBLE1BQ0EsS0FBQyxDQUFBLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxRQUFELENBQXhCLENBQWdDLFlBQWhDLENBREEsQ0FBQTthQUVBLEtBQUMsQ0FBQSxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQUQsQ0FBcEIsQ0FBNEIsWUFBNUIsRUFIaUM7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXJGbEMsQ0FBQTtBQTBGQSxFQUFBLElBQUcsSUFBQyxDQUFBLFFBQUQsS0FBYSxLQUFoQjtBQUNDLElBQUEsSUFBQyxDQUFBLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxhQUF6QixDQUF1QyxZQUF2QyxDQUFBLENBQUE7QUFBQSxJQUNBLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBTSxDQUFDLGFBQXJCLENBQW1DLFlBQW5DLENBREEsQ0FERDtHQUFBLE1BQUE7QUFJQyxJQUFBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxlQUFsQixHQUFvQyxNQUFNLENBQUMsVUFBM0MsQ0FKRDtHQTFGQTtBQWdHQSxTQUFPLElBQUMsQ0FBQSxxQkFBUixDQWpHUTtBQUFBLENBOURULENBQUE7O0FBQUEsS0FpS0EsR0FBUSxTQUFBLEdBQUE7QUFDUCxNQUFBLDREQUFBO0FBQUEsRUFBQSxLQUFBLEdBQVEsUUFBUSxDQUFDLElBQWpCLENBQUE7QUFBQSxFQUNBLGNBQUEsR0FBaUIsQ0FEakIsQ0FBQTtBQUFBLEVBRUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUNYO0FBQUEsSUFBQSxLQUFBLEVBQU8sRUFBUDtBQUFBLElBQ0EsTUFBQSxFQUFRLEVBRFI7QUFBQSxJQUVBLGVBQUEsRUFBaUIsTUFGakI7R0FEVyxDQUZaLENBQUE7QUFBQSxFQU1BLGFBQUEsR0FBb0IsSUFBQSxLQUFBLENBQ25CO0FBQUEsSUFBQSxNQUFBLEVBQVEsY0FBUjtBQUFBLElBQ0EsS0FBQSxFQUFPLEVBRFA7QUFBQSxJQUVBLGVBQUEsRUFBaUIsS0FGakI7QUFBQSxJQUdBLE9BQUEsRUFBUyxDQUhUO0FBQUEsSUFJQSxVQUFBLEVBQVksS0FKWjtHQURtQixDQU5wQixDQUFBO0FBQUEsRUFZQSxhQUFhLENBQUMsQ0FBZCxHQUFrQixFQVpsQixDQUFBO0FBQUEsRUFhQSxhQUFhLENBQUMsU0FBZCxHQUEwQixFQWIxQixDQUFBO0FBQUEsRUFjQSxlQUFBLEdBQXNCLElBQUEsS0FBQSxDQUNyQjtBQUFBLElBQUEsTUFBQSxFQUFRLGNBQVI7QUFBQSxJQUNBLEtBQUEsRUFBTyxFQURQO0FBQUEsSUFFQSxPQUFBLEVBQVMsQ0FGVDtBQUFBLElBR0EsZUFBQSxFQUFpQixLQUhqQjtBQUFBLElBSUEsVUFBQSxFQUFZLEtBSlo7R0FEcUIsQ0FkdEIsQ0FBQTtBQUFBLEVBb0JBLGVBQWUsQ0FBQyxTQUFoQixHQUE0QixDQUFBLEVBcEI1QixDQUFBO0FBQUEsRUFxQkEsS0FBSyxDQUFDLE1BQU4sR0FBZSxTQUFBLEdBQUE7V0FDZCxLQUFLLENBQUMsT0FBTixDQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLE9BQUEsRUFBUyxDQUFUO0FBQUEsUUFDQSxLQUFBLEVBQU8sQ0FEUDtPQUREO0FBQUEsTUFHQSxLQUFBLEVBQU8sa0JBSFA7S0FERCxFQURjO0VBQUEsQ0FyQmYsQ0FBQTtBQUFBLEVBMkJBLEtBQUssQ0FBQyxRQUFOLEdBQWlCLFNBQUEsR0FBQTtXQUNoQixLQUFLLENBQUMsT0FBTixDQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLE9BQUEsRUFBUyxDQUFUO0FBQUEsUUFDQSxLQUFBLEVBQU8sR0FEUDtPQUREO0FBQUEsTUFHQSxLQUFBLEVBQU8sa0JBSFA7S0FERCxFQURnQjtFQUFBLENBM0JqQixDQUFBO0FBaUNBLFNBQU8sS0FBUCxDQWxDTztBQUFBLENBaktSLENBQUE7O0FBQUEsS0FxTUEsR0FBUSxTQUFBLEdBQUE7QUFDUCxNQUFBLDREQUFBO0FBQUEsRUFBQSxLQUFBLEdBQVEsUUFBUSxDQUFDLElBQWpCLENBQUE7QUFBQSxFQUNBLGNBQUEsR0FBaUIsQ0FEakIsQ0FBQTtBQUFBLEVBRUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUNYO0FBQUEsSUFBQSxLQUFBLEVBQU8sRUFBUDtBQUFBLElBQ0EsTUFBQSxFQUFRLEVBRFI7QUFBQSxJQUVBLGVBQUEsRUFBaUIsTUFGakI7R0FEVyxDQUZaLENBQUE7QUFBQSxFQU1BLGFBQUEsR0FBb0IsSUFBQSxLQUFBLENBQ25CO0FBQUEsSUFBQSxNQUFBLEVBQVEsY0FBUjtBQUFBLElBQ0EsS0FBQSxFQUFPLEVBRFA7QUFBQSxJQUVBLGVBQUEsRUFBaUIsS0FGakI7QUFBQSxJQUdBLE9BQUEsRUFBUyxDQUhUO0FBQUEsSUFJQSxVQUFBLEVBQVksS0FKWjtHQURtQixDQU5wQixDQUFBO0FBQUEsRUFZQSxhQUFhLENBQUMsQ0FBZCxHQUFrQixFQVpsQixDQUFBO0FBQUEsRUFhQSxhQUFhLENBQUMsU0FBZCxHQUEwQixFQWIxQixDQUFBO0FBQUEsRUFjQSxlQUFBLEdBQXNCLElBQUEsS0FBQSxDQUNyQjtBQUFBLElBQUEsTUFBQSxFQUFRLGNBQVI7QUFBQSxJQUNBLEtBQUEsRUFBTyxFQURQO0FBQUEsSUFFQSxPQUFBLEVBQVMsQ0FGVDtBQUFBLElBR0EsZUFBQSxFQUFpQixLQUhqQjtBQUFBLElBSUEsVUFBQSxFQUFZLEtBSlo7R0FEcUIsQ0FkdEIsQ0FBQTtBQUFBLEVBb0JBLGVBQWUsQ0FBQyxDQUFoQixHQUFvQixFQXBCcEIsQ0FBQTtBQUFBLEVBcUJBLGVBQWUsQ0FBQyxTQUFoQixHQUE0QixDQUFBLEVBckI1QixDQUFBO0FBQUEsRUFzQkEsS0FBSyxDQUFDLE1BQU4sR0FBZSxTQUFBLEdBQUE7V0FDZCxLQUFLLENBQUMsT0FBTixDQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLE9BQUEsRUFBUyxDQUFUO0FBQUEsUUFDQSxLQUFBLEVBQU8sQ0FEUDtPQUREO0FBQUEsTUFHQSxLQUFBLEVBQU8sa0JBSFA7S0FERCxFQURjO0VBQUEsQ0F0QmYsQ0FBQTtBQUFBLEVBNEJBLEtBQUssQ0FBQyxRQUFOLEdBQWlCLFNBQUEsR0FBQTtXQUNoQixLQUFLLENBQUMsT0FBTixDQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLE9BQUEsRUFBUyxDQUFUO0FBQUEsUUFDQSxLQUFBLEVBQU8sR0FEUDtPQUREO0FBQUEsTUFHQSxLQUFBLEVBQU8sa0JBSFA7S0FERCxFQURnQjtFQUFBLENBNUJqQixDQUFBO0FBa0NBLFNBQU8sS0FBUCxDQW5DTztBQUFBLENBck1SLENBQUE7O0FBQUEsS0EwT0EsR0FBUSxTQUFBLEdBQUE7QUFDUCxNQUFBLDREQUFBO0FBQUEsRUFBQSxLQUFBLEdBQVEsUUFBUSxDQUFDLElBQWpCLENBQUE7QUFBQSxFQUNBLGNBQUEsR0FBaUIsQ0FEakIsQ0FBQTtBQUFBLEVBRUEsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUNYO0FBQUEsSUFBQSxLQUFBLEVBQU8sRUFBUDtBQUFBLElBQ0EsTUFBQSxFQUFRLEVBRFI7QUFBQSxJQUVBLGVBQUEsRUFBaUIsTUFGakI7R0FEVyxDQUZaLENBQUE7QUFBQSxFQU1BLGFBQUEsR0FBb0IsSUFBQSxLQUFBLENBQ25CO0FBQUEsSUFBQSxNQUFBLEVBQVEsY0FBUjtBQUFBLElBQ0EsS0FBQSxFQUFPLEVBRFA7QUFBQSxJQUVBLGVBQUEsRUFBaUIsS0FGakI7QUFBQSxJQUdBLE9BQUEsRUFBUyxDQUhUO0FBQUEsSUFJQSxVQUFBLEVBQVksS0FKWjtHQURtQixDQU5wQixDQUFBO0FBQUEsRUFZQSxhQUFhLENBQUMsQ0FBZCxHQUFrQixFQVpsQixDQUFBO0FBQUEsRUFhQSxhQUFhLENBQUMsU0FBZCxHQUEwQixFQWIxQixDQUFBO0FBQUEsRUFjQSxlQUFBLEdBQXNCLElBQUEsS0FBQSxDQUNyQjtBQUFBLElBQUEsTUFBQSxFQUFRLGNBQVI7QUFBQSxJQUNBLEtBQUEsRUFBTyxFQURQO0FBQUEsSUFFQSxPQUFBLEVBQVMsQ0FGVDtBQUFBLElBR0EsZUFBQSxFQUFpQixLQUhqQjtBQUFBLElBSUEsVUFBQSxFQUFZLEtBSlo7R0FEcUIsQ0FkdEIsQ0FBQTtBQUFBLEVBb0JBLGVBQWUsQ0FBQyxDQUFoQixHQUFvQixDQXBCcEIsQ0FBQTtBQUFBLEVBcUJBLGVBQWUsQ0FBQyxTQUFoQixHQUE0QixDQUFBLEVBckI1QixDQUFBO0FBQUEsRUFzQkEsS0FBSyxDQUFDLE1BQU4sR0FBZSxTQUFBLEdBQUE7V0FDZCxLQUFLLENBQUMsT0FBTixDQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLE9BQUEsRUFBUyxDQUFUO0FBQUEsUUFDQSxLQUFBLEVBQU8sQ0FEUDtPQUREO0FBQUEsTUFHQSxLQUFBLEVBQU8sa0JBSFA7S0FERCxFQURjO0VBQUEsQ0F0QmYsQ0FBQTtBQUFBLEVBNEJBLEtBQUssQ0FBQyxRQUFOLEdBQWlCLFNBQUEsR0FBQTtXQUNoQixLQUFLLENBQUMsT0FBTixDQUNDO0FBQUEsTUFBQSxVQUFBLEVBQ0M7QUFBQSxRQUFBLE9BQUEsRUFBUyxDQUFUO0FBQUEsUUFDQSxLQUFBLEVBQU8sR0FEUDtPQUREO0FBQUEsTUFHQSxLQUFBLEVBQU8sa0JBSFA7S0FERCxFQURnQjtFQUFBLENBNUJqQixDQUFBO0FBa0NBLFNBQU8sS0FBUCxDQW5DTztBQUFBLENBMU9SLENBQUE7O0FBZ1JBO0FBQUE7Ozs7OztHQWhSQTs7QUFBQSxPQXlSTyxDQUFDLFlBQVIsR0FBdUIsU0FBQyxNQUFELEdBQUE7QUFNdEIsTUFBQSw2REFBQTtBQUFBLEVBQUEsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxNQUFYLEVBQ0M7QUFBQSxJQUFBLElBQUEsRUFBTSxpQkFBTjtBQUFBLElBQ0EsQ0FBQSxFQUFHLENBREg7QUFBQSxJQUVBLENBQUEsRUFBRyxDQUZIO0FBQUEsSUFHQSxPQUFBLEVBQVMsSUFIVDtBQUFBLElBSUEsUUFBQSxFQUFVLElBSlY7QUFBQSxJQUtBLElBQUEsRUFBTSxPQUxOO0FBQUEsSUFNQSxTQUFBLEVBQVcsUUFBUSxDQUFDLElBTnBCO0FBQUEsSUFPQSxVQUFBLEVBQVksUUFBUSxDQUFDLFVBUHJCO0FBQUEsSUFRQSxlQUFBLEVBQWlCLElBUmpCO0FBQUEsSUFTQSxjQUFBLEVBQWdCLElBVGhCO0FBQUEsSUFZQSxXQUFBLEVBQWEsUUFBUSxDQUFDLFdBWnRCO0FBQUEsSUFhQSx5QkFBQSxFQUEyQixRQUFRLENBQUMseUJBYnBDO0FBQUEsSUFjQSxjQUFBLEVBQWdCLFFBQVEsQ0FBQyxjQWR6QjtBQUFBLElBZUEsV0FBQSxFQUFhLFFBQVEsQ0FBQyxRQWZ0QjtHQURELENBQUEsQ0FBQTtBQUFBLEVBb0JBLGtCQUFBLEdBQXFCLE1BQU0sQ0FBQyxxQkFBUCxHQUE2QixDQXBCbEQsQ0FBQTtBQUFBLEVBcUJBLDBCQUFBLEdBQTZCLENBckI3QixDQUFBO0FBQUEsRUF5QkEsSUFBQyxDQUFBLGlCQUFELEdBQXlCLElBQUEsS0FBQSxDQUN4QjtBQUFBLElBQUEsQ0FBQSxFQUFHLE1BQU0sQ0FBQyxDQUFWO0FBQUEsSUFDQSxDQUFBLEVBQUcsTUFBTSxDQUFDLENBRFY7QUFBQSxJQUVBLEtBQUEsRUFBUSxRQUFRLENBQUMsV0FGakI7QUFBQSxJQUdBLE1BQUEsRUFBUSxRQUFRLENBQUMsY0FIakI7QUFBQSxJQUlBLElBQUEsRUFBTSxLQUpOO0FBQUEsSUFLQSxlQUFBLEVBQWlCLFFBQVEsQ0FBQyxjQUwxQjtHQUR3QixDQXpCekIsQ0FBQTtBQUFBLEVBZ0NBLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxLQUFuQixHQUNDO0FBQUEsSUFBQSxTQUFBLEVBQWdCLE1BQU0sQ0FBQyxlQUFWLEdBQStCLFlBQUEsR0FBZSxNQUFNLENBQUMsV0FBckQsR0FBc0UsRUFBbkY7QUFBQSxJQUNBLFlBQUEsRUFBa0IsTUFBTSxDQUFDLGNBQVYsR0FBOEIsWUFBQSxHQUFlLE1BQU0sQ0FBQyxXQUFwRCxHQUFxRSxFQURwRjtHQWpDRCxDQUFBO0FBQUEsRUFxQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxNQUFNLENBQUMsT0FyQ2xCLENBQUE7QUFBQSxFQXNDQSxJQUFDLENBQUEsUUFBRCxHQUFZLE1BQU0sQ0FBQyxRQXRDbkIsQ0FBQTtBQUFBLEVBd0NBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsS0FBQSxDQUNmO0FBQUEsSUFBQSxDQUFBLEVBQUcsTUFBTSxDQUFDLHlCQUFWO0FBQUEsSUFDQSxLQUFBLEVBQVEsUUFBUSxDQUFDLFdBRGpCO0FBQUEsSUFFQSxNQUFBLEVBQVEsUUFBUSxDQUFDLGNBRmpCO0FBQUEsSUFHQSxVQUFBLEVBQVksSUFBQyxDQUFBLGlCQUhiO0FBQUEsSUFJQSxlQUFBLEVBQWlCLE1BSmpCO0dBRGUsQ0F4Q2hCLENBQUE7QUFBQSxFQThDQSxJQUFDLENBQUEsUUFBUSxDQUFDLEtBQVYsR0FBa0IsUUFBUSxDQUFDLGlCQTlDM0IsQ0FBQTtBQUFBLEVBK0NBLElBQUMsQ0FBQSxRQUFRLENBQUMsS0FBVixHQUNDO0FBQUEsSUFBQSxLQUFBLEVBQU8sTUFBTSxDQUFDLFNBQWQ7QUFBQSxJQUNBLFNBQUEsRUFBZSxNQUFNLENBQUMsZUFBVixHQUErQixFQUEvQixHQUF1QyxZQUFBLEdBQWUsTUFBTSxDQUFDLFdBRHpFO0dBaERELENBQUE7QUFBQSxFQW9EQSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsR0FBaUIsTUFBTSxDQUFDLElBcER4QixDQUFBO0FBQUEsRUF1REEsYUFBQTtBQUFnQixZQUFBLEtBQUE7QUFBQSxXQUNWLE1BQU0sQ0FBQyxJQUFQLEtBQWUsT0FETDtlQUNzQixJQUFBLEtBQUEsQ0FBQSxFQUR0QjtBQUFBLFdBRVYsTUFBTSxDQUFDLElBQVAsS0FBZSxPQUZMO2VBRXNCLElBQUEsS0FBQSxDQUFBLEVBRnRCO0FBQUEsV0FHVixNQUFNLENBQUMsSUFBUCxLQUFlLE9BSEw7ZUFHc0IsSUFBQSxLQUFBLENBQUEsRUFIdEI7QUFBQSxXQUlWLE1BQU0sQ0FBQyxJQUFQLEtBQWUsUUFKTDtlQUl1QixJQUFBLE1BQUEsQ0FBQSxFQUp2QjtBQUFBO01BdkRoQixDQUFBO0FBQUEsRUE2REEsYUFBYSxDQUFDLFVBQWQsR0FBMkIsSUFBQyxDQUFBLGlCQTdENUIsQ0FBQTtBQUFBLEVBOERBLGFBQWEsQ0FBQyxDQUFkLEdBQWtCLFFBQVEsQ0FBQyxXQUFULEdBQXVCLGFBQWEsQ0FBQyxLQUFyQyxHQUE2QyxRQUFRLENBQUMseUJBOUR4RSxDQUFBO0FBQUEsRUErREEsYUFBYSxDQUFDLE9BQWQsQ0FBc0IsQ0FBdEIsQ0EvREEsQ0FBQTtBQW9FQSxFQUFBLElBQUcsTUFBTSxDQUFDLElBQVAsS0FBZSxRQUFsQjtBQUNDLElBQUEsYUFBYSxDQUFDLEVBQWQsQ0FBaUIsTUFBTSxDQUFDLEtBQXhCLEVBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFBLEdBQUE7ZUFDOUIsS0FBQyxDQUFBLGlCQUFpQixDQUFDLFFBQUQsQ0FBbEIsQ0FBQSxFQUQ4QjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9CLENBQUEsQ0FERDtHQUFBLE1BQUE7QUFJQyxJQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsRUFBVixDQUFhLE1BQU0sQ0FBQyxLQUFwQixFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQSxHQUFBO2VBQzFCLEtBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxRQUFELENBQWxCLENBQUEsRUFEMEI7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixDQUFBLENBSkQ7R0FwRUE7QUFBQSxFQTJFQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsUUFBRCxDQUFsQixHQUE0QixDQUFBLFNBQUEsS0FBQSxHQUFBO1dBQUEsU0FBQSxHQUFBO0FBQzNCLE1BQUEsSUFBRyxLQUFDLENBQUEsUUFBSjtlQUFrQixLQUFDLENBQUEsaUJBQWlCLENBQUMsUUFBbkIsQ0FBQSxFQUFsQjtPQUFBLE1BQUE7ZUFBcUQsS0FBQyxDQUFBLGlCQUFpQixDQUFDLE1BQW5CLENBQUEsRUFBckQ7T0FEMkI7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQTNFNUIsQ0FBQTtBQUFBLEVBOEVBLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxNQUFuQixHQUE0QixDQUFBLFNBQUEsS0FBQSxHQUFBO1dBQUEsU0FBQyxPQUFELEdBQUE7QUFDM0IsTUFBQSxPQUFBLEdBQVUsT0FBQSxJQUFXO0FBQUEsUUFBQyxhQUFBLEVBQWUsS0FBaEI7T0FBckIsQ0FBQTtBQUNBLE1BQUEsSUFBRyxLQUFDLENBQUEsT0FBSjtBQUNDLFFBQUEsYUFBYSxDQUFDLE1BQWQsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLEtBQUMsQ0FBQSxRQUFELEdBQVksSUFEWixDQUREO09BREE7QUFJQSxNQUFBLElBQUcsT0FBTyxDQUFDLGFBQVIsS0FBeUIsS0FBNUI7ZUFDQyxLQUFDLENBQUEsaUJBQWlCLENBQUMsSUFBbkIsQ0FBd0IsV0FBeEIsRUFBcUM7QUFBQSxVQUFFLFFBQUEsRUFBVSxLQUFDLENBQUEsUUFBYjtTQUFyQyxFQUREO09BTDJCO0lBQUEsRUFBQTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0E5RTVCLENBQUE7QUFBQSxFQXNGQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsUUFBbkIsR0FBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtXQUFBLFNBQUMsT0FBRCxHQUFBO0FBQzdCLE1BQUEsT0FBQSxHQUFVLE9BQUEsSUFBVztBQUFBLFFBQUMsYUFBQSxFQUFlLEtBQWhCO09BQXJCLENBQUE7QUFDQSxNQUFBLElBQUcsS0FBQyxDQUFBLE9BQUo7QUFDQyxRQUFBLGFBQWEsQ0FBQyxRQUFkLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxLQUFDLENBQUEsUUFBRCxHQUFZLEtBRFosQ0FERDtPQURBO0FBSUEsTUFBQSxJQUFHLE9BQU8sQ0FBQyxhQUFSLEtBQXlCLEtBQTVCO2VBQ0MsS0FBQyxDQUFBLGlCQUFpQixDQUFDLElBQW5CLENBQXdCLFdBQXhCLEVBQXFDO0FBQUEsVUFBRSxRQUFBLEVBQVUsS0FBQyxDQUFBLFFBQWI7U0FBckMsRUFERDtPQUw2QjtJQUFBLEVBQUE7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBdEY5QixDQUFBO0FBQUEsRUE4RkEsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFdBQW5CLEdBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFDLE9BQUQsR0FBQTthQUNoQyxLQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsR0FBaUIsUUFEZTtJQUFBLEVBQUE7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBOUZqQyxDQUFBO0FBQUEsRUFpR0EsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFFBQW5CLEdBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFBLEdBQUE7QUFDN0IsYUFBTyxLQUFDLENBQUEsUUFBUixDQUQ2QjtJQUFBLEVBQUE7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBakc5QixDQUFBO0FBQUEsRUFvR0EsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFdBQW5CLENBQStCLE1BQU0sQ0FBQyxJQUF0QyxDQXBHQSxDQUFBO0FBc0dBLFNBQU8sSUFBQyxDQUFBLGlCQUFSLENBNUdzQjtBQUFBLENBelJ2QixDQUFBOztBQUFBLE9BdVlPLENBQUMsU0FBUixHQUFvQixTQUFDLE1BQUQsR0FBQTtBQUNuQixNQUFBLDRIQUFBO0FBQUEsRUFBQSxNQUFBLEdBQVMsTUFBQSxJQUFVLEVBQW5CLENBQUE7QUFBQSxFQUNBLENBQUMsQ0FBQyxRQUFGLENBQVcsTUFBWCxFQUNDO0FBQUEsSUFBQSxDQUFBLEVBQUssQ0FBTDtBQUFBLElBQ0EsS0FBQSxFQUFPLFFBQVEsQ0FBQyxXQURoQjtBQUFBLElBRUEsS0FBQSxFQUFPLENBQUMsZUFBRCxDQUZQO0FBQUEsSUFHQSxJQUFBLEVBQU0sT0FITjtBQUFBLElBSUEsVUFBQSxFQUFZLE1BSlo7R0FERCxDQURBLENBQUE7QUFBQSxFQVFBLElBQUMsQ0FBQSxvQkFBRCxHQUE0QixJQUFBLEtBQUEsQ0FDM0I7QUFBQSxJQUFBLENBQUEsRUFBSyxDQUFMO0FBQUEsSUFDQSxDQUFBLEVBQUksTUFBTSxDQUFDLENBRFg7QUFBQSxJQUVBLEtBQUEsRUFBUSxNQUFNLENBQUMsS0FGZjtBQUFBLElBR0EsTUFBQSxFQUFRLFFBQVEsQ0FBQyxjQUFULEdBQTBCLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFIL0M7QUFBQSxJQUlBLGVBQUEsRUFBa0IsTUFKbEI7R0FEMkIsQ0FSNUIsQ0FBQTtBQUFBLEVBZUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxFQWZmLENBQUE7QUFnQkE7QUFBQSxPQUFBLDZDQUFBO3dCQUFBO0FBQ0MsSUFBQSxlQUFBLEdBQXFCLENBQUEsS0FBSyxDQUFSLEdBQWUsSUFBZixHQUF5QixLQUEzQyxDQUFBO0FBQUEsSUFDQSxjQUFBLEdBQW9CLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBYixHQUFvQixDQUFyQixDQUFSLEdBQXFDLElBQXJDLEdBQStDLEtBRGhFLENBQUE7QUFBQSxJQUVBLFNBQUEsR0FBZ0IsSUFBQSxPQUFPLENBQUMsWUFBUixDQUFxQjtBQUFBLE1BQ3BDLENBQUEsRUFBRyxDQURpQztBQUFBLE1BRXBDLENBQUEsRUFBRyxDQUFBLEdBQUUsUUFBUSxDQUFDLGNBRnNCO0FBQUEsTUFHcEMsSUFBQSxFQUFNLFVBSDhCO0FBQUEsTUFJcEMsSUFBQSxFQUFNLE1BQU0sQ0FBQyxJQUp1QjtBQUFBLE1BS3BDLGVBQUEsRUFBaUIsZUFMbUI7QUFBQSxNQU1wQyxjQUFBLEVBQWdCLGNBTm9CO0tBQXJCLENBRmhCLENBQUE7QUFBQSxJQVVBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixTQUFsQixDQVZBLENBQUE7QUFBQSxJQVdBLFNBQVMsQ0FBQyxVQUFWLEdBQXVCLElBQUMsQ0FBQSxvQkFYeEIsQ0FERDtBQUFBLEdBaEJBO0FBQUEsRUE4QkEsMkJBQUEsR0FBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtXQUFBLFNBQUMsV0FBRCxHQUFBO0FBQzdCLFVBQUEsMkVBQUE7QUFBQSxNQUFBLG9CQUFBLEdBQXVCLEtBQUMsQ0FBQSxvQkFBeEIsQ0FBQTtBQUNBO1dBQUEsNkZBQUE7MERBQUE7QUFDQyxRQUFBLGFBQWEsQ0FBQyxRQUFkLENBQXVCO0FBQUEsVUFBQyxhQUFBLEVBQWUsSUFBaEI7U0FBdkIsQ0FBQSxDQUFBO0FBQUEscUJBRUcsQ0FBQSxTQUFDLGFBQUQsRUFBZ0Isb0JBQWhCLEdBQUE7aUJBRUYsYUFBYSxDQUFDLEVBQWQsQ0FBaUIsV0FBakIsRUFBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTttQkFBQSxTQUFDLEtBQUQsR0FBQTtBQUM3QixrQkFBQSxzQ0FBQTtBQUFBLG1CQUFBLHFGQUFBOzREQUFBO0FBQ0MsZ0JBQUEsSUFBRyxnQkFBQSxLQUFvQixvQkFBdkI7QUFFQyxrQkFBQSxXQUFXLENBQUMsUUFBWixDQUFxQjtBQUFBLG9CQUFDLGNBQUEsRUFBZ0IsSUFBakI7bUJBQXJCLENBQUEsQ0FGRDtpQkFERDtBQUFBLGVBQUE7cUJBSUEsb0JBQW9CLENBQUMsSUFBckIsQ0FBMEIsV0FBMUIsRUFBdUM7QUFBQSxnQkFBRSxRQUFBLEVBQVUsb0JBQVo7QUFBQSxnQkFBa0MsV0FBQSxFQUFhLENBQS9DO0FBQUEsZ0JBQWtELE9BQUEsRUFBUyxXQUEzRDtlQUF2QyxFQUw2QjtZQUFBLEVBQUE7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLEVBRkU7UUFBQSxDQUFBLENBQUgsQ0FBSSxhQUFKLEVBQW1CLG9CQUFuQixFQUZBLENBREQ7QUFBQTtxQkFGNkI7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQTlCOUIsQ0FBQTtBQUFBLEVBNENBLHVCQUFBLEdBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFDLFdBQUQsR0FBQTtBQUV6QixVQUFBLDJFQUFBO0FBQUEsTUFBQSxvQkFBQSxHQUF1QixLQUFDLENBQUEsb0JBQXhCLENBQUE7QUFDQTtXQUFBLDZGQUFBOzBEQUFBO0FBQ0MsUUFBQSxhQUFhLENBQUMsUUFBZCxDQUF1QjtBQUFBLFVBQUMsYUFBQSxFQUFlLElBQWhCO1NBQXZCLENBQUEsQ0FBQTtBQUFBLHFCQUVHLENBQUEsU0FBQyxhQUFELEVBQWdCLG9CQUFoQixHQUFBO2lCQUVGLGFBQWEsQ0FBQyxFQUFkLENBQWlCLFdBQWpCLEVBQThCLENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQyxLQUFELEdBQUE7QUFDN0Isa0JBQUEsNkNBQUE7QUFBQSxjQUFBLFdBQUEsR0FBYyxDQUFkLENBQUE7QUFBQSxjQUNBLGVBQUEsR0FBa0IsRUFEbEIsQ0FBQTtBQUVBLG1CQUFBLCtDQUFBO3dDQUFBO0FBQ0MsZ0JBQUEsZUFBZSxDQUFDLElBQWhCLENBQXFCLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBckIsQ0FBQSxDQUFBO0FBQ0EsZ0JBQUEsSUFBRyxNQUFNLENBQUMsUUFBUCxDQUFBLENBQUg7QUFBMEIsa0JBQUEsV0FBQSxFQUFBLENBQTFCO2lCQUZEO0FBQUEsZUFGQTtxQkFLQSxvQkFBb0IsQ0FBQyxJQUFyQixDQUEwQixXQUExQixFQUF1QztBQUFBLGdCQUFFLFFBQUEsRUFBVSxlQUFaO0FBQUEsZ0JBQTZCLFdBQUEsRUFBYSxXQUExQztBQUFBLGdCQUF1RCxPQUFBLEVBQVMsV0FBaEU7ZUFBdkMsRUFONkI7WUFBQSxFQUFBO1VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QixFQUZFO1FBQUEsQ0FBQSxDQUFILENBQUksYUFBSixFQUFtQixvQkFBbkIsRUFGQSxDQUREO0FBQUE7cUJBSHlCO0lBQUEsRUFBQTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0E1QzFCLENBQUE7QUE0REEsRUFBQSxJQUFHLE1BQU0sQ0FBQyxVQUFQLEtBQXFCLE9BQXhCO0FBQ0MsSUFBQSwyQkFBQSxDQUE0QixJQUFDLENBQUEsV0FBN0IsQ0FBQSxDQUREO0dBQUEsTUFBQTtBQUdDLElBQUEsdUJBQUEsQ0FBd0IsSUFBQyxDQUFBLFdBQXpCLENBQUEsQ0FIRDtHQTVEQTtBQWlFQSxTQUFPLElBQUMsQ0FBQSxvQkFBUixDQWxFbUI7QUFBQSxDQXZZcEIsQ0FBQTs7QUE2Y0E7QUFBQTs7OztHQTdjQTs7QUFBQSxPQW1kTyxDQUFDLGVBQVIsR0FBMEIsU0FBQyxNQUFELEdBQUE7QUFDekIsTUFBQSxXQUFBO0FBQUEsRUFBQSxNQUFBLEdBQVMsTUFBQSxJQUFVLEVBQW5CLENBQUE7QUFBQSxFQUNBLENBQUMsQ0FBQyxRQUFGLENBQVcsTUFBWCxFQUNDO0FBQUEsSUFBQSxJQUFBLEVBQU0sZ0JBQU47QUFBQSxJQUNBLENBQUEsRUFBRyxDQURIO0FBQUEsSUFFQSxDQUFBLEVBQUcsQ0FGSDtHQURELENBREEsQ0FBQTtBQUFBLEVBS0EsV0FBQSxHQUFrQixJQUFBLEtBQUEsQ0FDakI7QUFBQSxJQUFBLENBQUEsRUFBRyxNQUFNLENBQUMsQ0FBUCxHQUFXLFFBQVEsQ0FBQyx5QkFBdkI7QUFBQSxJQUNBLENBQUEsRUFBRyxNQUFNLENBQUMsQ0FEVjtBQUFBLElBRUEsS0FBQSxFQUFPLFFBQVEsQ0FBQyxXQUZoQjtBQUFBLElBR0EsZUFBQSxFQUFpQixNQUhqQjtHQURpQixDQUxsQixDQUFBO0FBQUEsRUFVQSxXQUFXLENBQUMsSUFBWixHQUFtQixNQUFNLENBQUMsSUFWMUIsQ0FBQTtBQUFBLEVBV0EsV0FBVyxDQUFDLEtBQVosR0FBb0IsUUFBUSxDQUFDLG9CQVg3QixDQUFBO0FBQUEsRUFZQSxXQUFXLENBQUMsS0FBWixHQUNDO0FBQUEsSUFBQSxLQUFBLEVBQU8sUUFBUSxDQUFDLElBQWhCO0dBYkQsQ0FBQTtBQWNBLFNBQU8sV0FBUCxDQWZ5QjtBQUFBLENBbmQxQixDQUFBOztBQXNlQTtBQUFBOzs7O0dBdGVBOztBQUFBLFFBK2VBLEdBQVcsU0FBQyxLQUFELEVBQVEsUUFBUixHQUFBO0FBQ1YsU0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQUEsR0FBTSxRQUFqQixDQUFBLEdBQTZCLFFBQXBDLENBRFU7QUFBQSxDQS9lWCxDQUFBOztBQUFBLElBcWZBLEdBQU8sU0FBQyxlQUFELEVBQWtCLFFBQWxCLEVBQTRCLFNBQTVCLEVBQXVDLE1BQXZDLEdBQUE7QUFHTixNQUFBLHlNQUFBO0FBQUEsRUFBQSxJQUFDLENBQUEsZUFBRCxHQUFtQixlQUFuQixDQUFBO0FBQUEsRUFDQSxNQUFBLEdBQVMsTUFBQSxJQUFVLEVBRG5CLENBQUE7QUFBQSxFQUVBLENBQUMsQ0FBQyxRQUFGLENBQVcsTUFBWCxFQUNDO0FBQUEsSUFBQSxPQUFBLEVBQVMsSUFBVDtBQUFBLElBQ0EsSUFBQSxFQUFNLENBRE47QUFBQSxJQUVBLFFBQUEsRUFBVSxDQUZWO0FBQUEsSUFHQSxTQUFBLEVBQVcsUUFIWDtBQUFBLElBSUEsV0FBQSxFQUFhLEdBSmI7QUFBQSxJQUtBLFNBQUEsRUFBVyxRQUFRLENBQUMsSUFMcEI7R0FERCxDQUZBLENBQUE7QUFBQSxFQVdBLG1CQUFBLEdBQXNCLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBWDlDLENBQUE7QUFBQSxFQWNBLFNBQUEsR0FBWSxTQWRaLENBQUE7QUFBQSxFQWVBLElBQUMsQ0FBQSxJQUFELEdBQVEsUUFmUixDQUFBO0FBQUEsRUFnQkEsSUFBQyxDQUFBLEtBQUQsR0FBUyxDQWhCVCxDQUFBO0FBQUEsRUFpQkEsSUFBQyxDQUFBLEdBQUQsR0FBTyxTQUFVLENBQUEsSUFBQyxDQUFBLEtBQUQsQ0FqQmpCLENBQUE7QUFBQSxFQWtCQSxJQUFDLENBQUEsUUFBRCxHQUFZLENBbEJaLENBQUE7QUFBQSxFQW1CQSxtQkFBQSxHQUFzQixJQW5CdEIsQ0FBQTtBQUFBLEVBcUJBLDhCQUFBLEdBQWlDLENBckJqQyxDQUFBO0FBQUEsRUF3QkEsV0FBQSxHQUFlLENBQUEsUUFBUyxDQUFDLGNBQVYsR0FBeUIsQ0F4QnhDLENBQUE7QUFBQSxFQXlCQSxXQUFBLEdBQWUsQ0FBQSxTQUFVLENBQUMsTUFBWCxHQUFrQixRQUFRLENBQUMsY0FBM0IsR0FBMEMsUUFBUSxDQUFDLGNBQVQsR0FBd0IsQ0F6QmpGLENBQUE7QUFBQSxFQTBCQSxVQUFBLEdBQWUsU0FBUyxDQUFDLE1BQVYsR0FBaUIsUUFBUSxDQUFDLGNBQTFCLEdBQTJDLG1CQTFCMUQsQ0FBQTtBQUFBLEVBNEJBLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUEsS0FBQSxDQUNwQjtBQUFBLElBQUEsQ0FBQSxFQUFRLE1BQU0sQ0FBQyxJQUFQLEdBQWMsUUFBUSxDQUFDLFdBQS9CO0FBQUEsSUFDQSxDQUFBLEVBQVEsQ0FEUjtBQUFBLElBRUEsS0FBQSxFQUFXLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLFFBQVEsQ0FBQyxXQUZ0QztBQUFBLElBR0EsTUFBQSxFQUFXLG1CQUhYO0FBQUEsSUFJQSxlQUFBLEVBQWtCLE1BSmxCO0FBQUEsSUFLQSxVQUFBLEVBQWMsZUFMZDtHQURvQixDQTVCckIsQ0FBQTtBQUFBLEVBb0NBLFNBQUEsR0FBZ0IsSUFBQSxLQUFBLENBQ2Y7QUFBQSxJQUFBLENBQUEsRUFBUSxDQUFSO0FBQUEsSUFDQSxDQUFBLEVBQVEsQ0FBQSxRQUFTLENBQUMsY0FBVixHQUF5QixDQURqQztBQUFBLElBRUEsS0FBQSxFQUFXLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLFFBQVEsQ0FBQyxXQUZ0QztBQUFBLElBR0EsTUFBQSxFQUFXLFVBSFg7QUFBQSxJQUlBLFVBQUEsRUFBYyxJQUFDLENBQUEsYUFKZjtBQUFBLElBS0EsZUFBQSxFQUFrQixNQUxsQjtHQURlLENBcENoQixDQUFBO0FBQUEsRUE2Q0EsU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFwQixHQUE4QixNQUFNLENBQUMsT0E3Q3JDLENBQUE7QUFBQSxFQThDQSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQXBCLEdBQTZCLENBOUM3QixDQUFBO0FBZ0RBLE9BQUEsbURBQUE7c0JBQUE7QUFDQyxJQUFBLGFBQUEsR0FBb0IsSUFBQSxLQUFBLENBQ25CO0FBQUEsTUFBQSxDQUFBLEVBQU8sQ0FBUDtBQUFBLE1BQ0EsQ0FBQSxFQUFPLENBQUEsR0FBSSxRQUFRLENBQUMsY0FBYixHQUE4QixtQkFBQSxHQUFvQixDQUR6RDtBQUFBLE1BRUEsS0FBQSxFQUFVLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLFFBQVEsQ0FBQyxXQUZyQztBQUFBLE1BR0EsTUFBQSxFQUFVLFFBQVEsQ0FBQyxjQUhuQjtBQUFBLE1BSUEsVUFBQSxFQUFhLFNBSmI7QUFBQSxNQUtBLGVBQUEsRUFBaUIsTUFMakI7S0FEbUIsQ0FBcEIsQ0FBQTtBQUFBLElBT0EsYUFBYSxDQUFDLElBQWQsR0FBcUIsRUFQckIsQ0FBQTtBQUFBLElBUUEsYUFBYSxDQUFDLEtBQWQsR0FDQztBQUFBLE1BQUEsS0FBQSxFQUFVLE1BQU0sQ0FBQyxTQUFqQjtBQUFBLE1BQ0EsVUFBQSxFQUFhLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFEdEM7QUFBQSxNQUVBLFVBQUEsRUFBYSxRQUFRLENBQUMsZUFBZSxDQUFDLFVBRnRDO0FBQUEsTUFHQSxRQUFBLEVBQVksUUFBUSxDQUFDLGVBQWUsQ0FBQyxRQUhyQztBQUFBLE1BSUEsVUFBQSxFQUFhLFFBQVEsQ0FBQyxjQUFULEdBQXdCLElBSnJDO0FBQUEsTUFLQSxTQUFBLEVBQWEsTUFBTSxDQUFDLFNBTHBCO0FBQUEsTUFNQSxPQUFBLEVBQVcsTUFBTSxDQUFDLFdBTmxCO0tBVEQsQ0FBQTtBQUFBLElBaUJBLGFBQWEsQ0FBQyxNQUFkLEdBQXVCLENBQUEsR0FBSSxRQUFRLENBQUMsY0FBYixHQUE4QixtQkFBQSxHQUFvQixDQWpCekUsQ0FERDtBQUFBLEdBaERBO0FBQUEsRUFvRUEsU0FBUyxDQUFDLEVBQVYsQ0FBYSxNQUFNLENBQUMsUUFBcEIsRUFBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtXQUFBLFNBQUEsR0FBQTtBQUM3QixNQUFBLElBQUcsbUJBQUg7QUFDQyxRQUFBLEtBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixtQkFBcEIsRUFBeUM7QUFBQSxVQUFDLElBQUEsRUFBTSxRQUFQO0FBQUEsVUFBaUIsS0FBQSxFQUFPLEtBQUMsQ0FBQSxLQUF6QjtBQUFBLFVBQWdDLEtBQUEsRUFBTyxLQUFDLENBQUEsR0FBeEM7QUFBQSxVQUE2QyxRQUFBLEVBQVUsQ0FBdkQ7U0FBekMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxtQkFBQSxHQUFzQixLQUR0QixDQUREO09BQUE7YUFJQSxvQkFBQSxDQUFBLEVBTDZCO0lBQUEsRUFBQTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUIsQ0FwRUEsQ0FBQTtBQUFBLEVBK0VBLFNBQVMsQ0FBQyxFQUFWLENBQWEsTUFBTSxDQUFDLE9BQXBCLEVBQTZCLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFDLENBQUQsRUFBSSxDQUFKLEdBQUE7QUFHNUIsVUFBQSw0S0FBQTtBQUFBLE1BQUEsbUJBQUEsR0FBc0IsSUFBdEIsQ0FBQTtBQUFBLE1BR0EsY0FBQSxHQUFpQixTQUFTLENBQUMsU0FBUyxDQUFDLGlCQUFwQixDQUFBLENBQXVDLENBQUMsQ0FIekQsQ0FBQTtBQUFBLE1BSUEsYUFBQSxHQUFnQixDQUFDLEdBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLGNBQUEsR0FBZSxHQUF4QixDQUFMLENBQWtDLENBQUMsT0FBbkMsQ0FBMkMsQ0FBM0MsQ0FKaEIsQ0FBQTtBQUFBLE1BS0EsMEJBQUEsR0FBNkIsUUFBQSxDQUFTLFNBQVMsQ0FBQyxDQUFWLEdBQWMsY0FBQSxHQUFlLEdBQXRDLEVBQTJDLFFBQVEsQ0FBQyxjQUFwRCxDQUFBLEdBQXNFLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBTDNILENBQUE7QUFBQSxNQVNBLGdCQUFBLEdBQW1CLDBCQUFBLEdBQTZCLFNBQVMsQ0FBQyxDQVQxRCxDQUFBO0FBQUEsTUFVQSwwQkFBQSxHQUE2QixDQUFBLFNBQVUsQ0FBQyxNQUFYLEdBQWtCLFFBQVEsQ0FBQyxjQVZ4RCxDQUFBO0FBQUEsTUFXQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLDBCQUFBLEdBQTJCLDBCQUF2QyxDQVhqQixDQUFBO0FBQUEsTUFZQSxXQUFBLEdBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksMEJBQVosQ0FaZCxDQUFBO0FBQUEsTUFhQSxpQkFBQSxHQUFvQixFQWJwQixDQUFBO0FBZUEsTUFBQSxJQUFHLGNBQUEsR0FBaUIsQ0FBcEI7QUFDQyxRQUFBLDBCQUFBLEdBQTZCLDBCQUFBLEdBQTZCLENBQUMsY0FBQSxHQUFpQixpQkFBbEIsQ0FBMUQsQ0FBQTtBQUFBLFFBQ0EsbUJBQUEsR0FBc0IsMEJBQUEsR0FBNkIsU0FBUyxDQUFDLENBRDdELENBQUE7QUFBQSxRQUVBLGFBQUEsR0FBZ0IsYUFBQSxHQUFnQixDQUFDLG1CQUFBLEdBQW9CLGdCQUFyQixDQUZoQyxDQUREO09BZkE7QUFvQkEsTUFBQSxJQUFHLFdBQUEsR0FBYyxDQUFqQjtBQUNDLFFBQUEsMEJBQUEsR0FBNkIsRUFBQSxHQUFLLENBQUMsV0FBQSxHQUFjLGlCQUFmLENBQWxDLENBQUE7QUFBQSxRQUNBLG1CQUFBLEdBQXNCLDBCQUFBLEdBQTZCLFNBQVMsQ0FBQyxDQUQ3RCxDQUFBO0FBQUEsUUFFQSxhQUFBLEdBQWdCLGFBQUEsR0FBZ0IsQ0FBQyxtQkFBQSxHQUFvQixnQkFBckIsQ0FGaEMsQ0FERDtPQXBCQTtBQUFBLE1BMkJBLFNBQVMsQ0FBQyxPQUFWLENBQWtCO0FBQUEsUUFDaEIsVUFBQSxFQUFZO0FBQUEsVUFBQyxDQUFBLEVBQUcsMEJBQUo7U0FESTtBQUFBLFFBRWhCLElBQUEsRUFBTSxhQUZVO0FBQUEsUUFHaEIsS0FBQSxFQUFPLFVBSFM7T0FBbEIsQ0EzQkEsQ0FBQTthQWdDQSxLQUFLLENBQUMsS0FBTixDQUFZLGFBQVosRUFBMkIsU0FBQSxHQUFBO2VBQzFCLFFBQUEsQ0FBQSxFQUQwQjtNQUFBLENBQTNCLEVBbkM0QjtJQUFBLEVBQUE7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCLENBL0VBLENBQUE7QUFBQSxFQXdIQSxTQUFTLENBQUMsRUFBVixDQUFhLE1BQU0sQ0FBQyxjQUFwQixFQUFvQyxTQUFBLEdBQUE7QUFDbkMsSUFBQSxhQUFBLENBQWMsOEJBQWQsQ0FBQSxDQUFBO1dBQ0EsOEJBQUEsR0FBaUMsS0FBSyxDQUFDLFFBQU4sQ0FBZSxDQUFBLEdBQUUsRUFBakIsRUFBcUIsb0JBQXJCLEVBRkU7RUFBQSxDQUFwQyxDQXhIQSxDQUFBO0FBQUEsRUE0SEEsU0FBUyxDQUFDLEVBQVYsQ0FBYSxNQUFNLENBQUMsWUFBcEIsRUFBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtXQUFBLFNBQUEsR0FBQTtBQUNqQyxNQUFBLGFBQUEsQ0FBYyw4QkFBZCxDQUFBLENBQUE7YUFHQSxLQUFDLENBQUEsYUFBYSxDQUFDLElBQWYsQ0FBb0Isc0JBQXBCLEVBQTRDO0FBQUEsUUFBQyxJQUFBLEVBQU0sUUFBUDtBQUFBLFFBQWlCLEtBQUEsRUFBTyxLQUFDLENBQUEsS0FBekI7QUFBQSxRQUFnQyxLQUFBLEVBQU8sS0FBQyxDQUFBLEdBQXhDO09BQTVDLEVBSmlDO0lBQUEsRUFBQTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0E1SEEsQ0FBQTtBQUFBLEVBa0lBLG9CQUFBLEdBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFBLEdBQUE7QUFDdEIsVUFBQSwwRkFBQTtBQUFBLE1BQUEsV0FBQSxHQUFjLENBQWQsQ0FBQTtBQUFBLE1BQ0EsWUFBQSxHQUFlLFNBQVMsQ0FBQyxDQUFWLEdBQWMsQ0FBQSxRQUFTLENBQUMsY0FBeEIsR0FBeUMsR0FEeEQsQ0FBQTtBQUFBLE1BRUEsa0JBQUEsR0FBcUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVksSUFBSSxDQUFDLEdBQUwsQ0FBUyxTQUFTLENBQUMsQ0FBVixHQUFjLENBQUEsUUFBUyxDQUFDLGNBQXhCLEdBQXlDLEdBQWxELEVBQXVELFNBQVMsQ0FBQyxNQUFWLEdBQW1CLENBQTFFLENBQVosQ0FGckIsQ0FBQTtBQUFBLE1BR0EsU0FBQSxHQUFZLElBQUksQ0FBQyxLQUFMLENBQVcsa0JBQVgsQ0FIWixDQUFBO0FBQUEsTUFJQSxrQkFBQSxHQUFxQixJQUFJLENBQUMsR0FBTCxDQUFTLFNBQUEsR0FBWSxrQkFBckIsQ0FKckIsQ0FBQTtBQUtBLFdBQVMsdUlBQVQsR0FBQTtBQUNDLFFBQUEsSUFBRyxDQUFBLElBQUssQ0FBTCxJQUFXLENBQUEsR0FBSSxTQUFTLENBQUMsTUFBNUI7QUFDQyxVQUFBLFNBQVMsQ0FBQyxTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBdkIsR0FBaUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxHQUFMLENBQVMsWUFBQSxHQUFlLENBQXhCLENBQUEsR0FBMkIsQ0FBL0IsR0FBbUMsQ0FBSyxDQUFBLEtBQUssU0FBVCxHQUF5QixHQUF6QixHQUFrQyxDQUFuQyxDQUFwRSxDQUFBO0FBQUEsVUFDQSxTQUFTLENBQUMsU0FBVSxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQXZCLEdBQWdDLENBQUEsR0FBSSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsRUFBWSxJQUFJLENBQUMsR0FBTCxDQUFTLFlBQUEsR0FBZSxDQUF4QixDQUFBLEdBQTJCLENBQXZDLENBRHBDLENBQUE7QUFBQSxVQUVBLFNBQVMsQ0FBQyxTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsQ0FBdkIsR0FBMkIsU0FBUyxDQUFDLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUF2QixHQUFnQyxDQUFDLENBQUEsR0FBRSxZQUFILENBQUEsR0FBaUIsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFBLEdBQUUsWUFBWCxDQUFqQixHQUEwQyxFQUZyRyxDQUREO1NBREQ7QUFBQSxPQUxBO0FBWUEsTUFBQSxJQUFJLEtBQUMsQ0FBQSxLQUFELEtBQVUsU0FBZDtlQUNDLGdCQUFBLENBQWlCLFNBQWpCLEVBREQ7T0Fic0I7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWxJdkIsQ0FBQTtBQUFBLEVBa0pBLFFBQUEsR0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO1dBQUEsU0FBQSxHQUFBO0FBRVYsTUFBQSxJQUFHLFNBQVMsQ0FBQyxDQUFWLEdBQWMsV0FBakI7QUFDQyxRQUFBLFNBQVMsQ0FBQyxPQUFWLENBQWtCO0FBQUEsVUFDZCxVQUFBLEVBQVk7QUFBQSxZQUFDLENBQUEsRUFBRSxXQUFIO1dBREU7QUFBQSxVQUVkLEtBQUEsRUFBTyxrQkFGTztTQUFsQixDQUFBLENBREQ7T0FBQTtBQUtBLE1BQUEsSUFBRyxTQUFTLENBQUMsQ0FBVixHQUFjLFdBQWpCO2VBQ0MsU0FBUyxDQUFDLE9BQVYsQ0FBa0I7QUFBQSxVQUNqQixVQUFBLEVBQVk7QUFBQSxZQUFDLENBQUEsRUFBRyxXQUFKO1dBREs7QUFBQSxVQUVqQixLQUFBLEVBQU8sa0JBRlU7U0FBbEIsRUFERDtPQVBVO0lBQUEsRUFBQTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FsSlgsQ0FBQTtBQUFBLEVBZ0tBLGdCQUFBLEdBQW1CLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFDLFFBQUQsR0FBQTtBQUNsQixNQUFBLEtBQUMsQ0FBQSxLQUFELEdBQVMsUUFBVCxDQUFBO0FBQUEsTUFDQSxLQUFDLENBQUEsR0FBRCxHQUFPLFNBQVUsQ0FBQSxLQUFDLENBQUEsS0FBRCxDQURqQixDQUFBO2FBRUEsS0FBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQW9CLGVBQXBCLEVBQXFDO0FBQUEsUUFBQyxJQUFBLEVBQU0sUUFBUDtBQUFBLFFBQWlCLEtBQUEsRUFBTyxLQUFDLENBQUEsS0FBekI7QUFBQSxRQUFnQyxLQUFBLEVBQU8sS0FBQyxDQUFBLEdBQXhDO09BQXJDLEVBSGtCO0lBQUEsRUFBQTtFQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FoS25CLENBQUE7QUFBQSxFQXNLQSxvQkFBQSxDQUFBLENBdEtBLENBQUE7QUFBQSxFQXdLQSxJQUFDLENBQUEsUUFBRCxHQUFZLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFDLEtBQUQsR0FBQTtBQUNYLFVBQUEscUJBQUE7QUFBQSxNQUFBLHFCQUFBLEdBQXdCLENBQUEsUUFBUyxDQUFDLGNBQVYsR0FBeUIsQ0FBekIsR0FBNkIsQ0FBQyxLQUFBLEdBQVEsUUFBUSxDQUFDLGNBQWxCLENBQXJELENBQUE7YUFDQSxTQUFTLENBQUMsT0FBVixDQUFrQjtBQUFBLFFBQ2hCLFVBQUEsRUFBWTtBQUFBLFVBQUMsQ0FBQSxFQUFHLHFCQUFKO1NBREk7QUFBQSxRQUVoQixJQUFBLEVBQU0sR0FGVTtBQUFBLFFBR2hCLEtBQUEsRUFBTyxVQUhTO09BQWxCLEVBRlc7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXhLWixDQUFBO0FBQUEsRUFnTEEsSUFBQyxDQUFBLFFBQUQsR0FBWSxDQUFBLFNBQUEsS0FBQSxHQUFBO1dBQUEsU0FBQyxHQUFELEdBQUE7QUFDWCxVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxTQUFTLENBQUMsT0FBVixDQUFrQixHQUFsQixDQUFSLENBQUE7QUFDQSxNQUFBLElBQUcsS0FBQSxLQUFTLENBQUEsQ0FBWjtlQUNDLEtBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixFQUREO09BRlc7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQWhMWixDQUFBO0FBc0xBLFNBQU8sSUFBUCxDQXpMTTtBQUFBLENBcmZQLENBQUE7O0FBaXJCQTtBQUFBOzs7R0FqckJBOztBQUFBLE9BcXJCTyxDQUFDLE1BQVIsR0FBaUIsU0FBQyxNQUFELEdBQUE7QUFFaEIsTUFBQSw2R0FBQTtBQUFBLEVBQUEsTUFBQSxHQUFTLE1BQUEsSUFBVSxFQUFuQixDQUFBO0FBQUEsRUFDQSxDQUFDLENBQUMsUUFBRixDQUFXLE1BQVgsRUFDQztBQUFBLElBQUEsQ0FBQSxFQUFLLENBQUw7QUFBQSxJQUNBLENBQUEsRUFBSyxDQURMO0FBQUEsSUFFQSxLQUFBLEVBQU8sUUFBUSxDQUFDLFdBRmhCO0FBQUEsSUFHQSxXQUFBLEVBQWEsRUFIYjtBQUFBLElBSUEsU0FBQSxFQUFXLFFBQVEsQ0FBQyxJQUpwQjtHQURELENBREEsQ0FBQTtBQUFBLEVBUUEsbUJBQUEsR0FBc0IsUUFBUSxDQUFDLGNBQVQsR0FBd0IsQ0FSOUMsQ0FBQTtBQUFBLEVBVUEsSUFBQyxDQUFBLGVBQUQsR0FBdUIsSUFBQSxLQUFBLENBQ3RCO0FBQUEsSUFBQSxDQUFBLEVBQUssTUFBTSxDQUFDLENBQVo7QUFBQSxJQUNBLENBQUEsRUFBSSxNQUFNLENBQUMsQ0FEWDtBQUFBLElBRUEsS0FBQSxFQUFRLE1BQU0sQ0FBQyxLQUZmO0FBQUEsSUFHQSxNQUFBLEVBQVEsbUJBQUEsR0FBb0IsRUFINUI7QUFBQSxJQUlBLGVBQUEsRUFBa0IsUUFBUSxDQUFDLGNBSjNCO0dBRHNCLENBVnZCLENBQUE7QUFBQSxFQWlCQSxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsS0FBQSxDQUNYO0FBQUEsSUFBQSxDQUFBLEVBQUssQ0FBTDtBQUFBLElBQ0EsQ0FBQSxFQUFLLEVBREw7QUFBQSxJQUVBLEtBQUEsRUFBUSxNQUFNLENBQUMsS0FGZjtBQUFBLElBR0EsTUFBQSxFQUFRLG1CQUhSO0FBQUEsSUFJQSxlQUFBLEVBQWlCLE1BSmpCO0FBQUEsSUFLQSxVQUFBLEVBQVksSUFBQyxDQUFBLGVBTGI7R0FEVyxDQWpCWixDQUFBO0FBQUEsRUF5QkEsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxLQUFBLENBQ25CO0FBQUEsSUFBQSxDQUFBLEVBQUssQ0FBTDtBQUFBLElBQ0EsQ0FBQSxFQUFLLG1CQUFBLEdBQW9CLENBQXBCLEdBQXdCLFFBQVEsQ0FBQyxjQUFULEdBQXdCLENBRHJEO0FBQUEsSUFFQSxLQUFBLEVBQVEsTUFBTSxDQUFDLEtBRmY7QUFBQSxJQUdBLE1BQUEsRUFBUSxRQUFRLENBQUMsY0FIakI7QUFBQSxJQUlBLGVBQUEsRUFBaUIsTUFKakI7QUFBQSxJQUtBLFVBQUEsRUFBWSxJQUFDLENBQUEsSUFMYjtHQURtQixDQXpCcEIsQ0FBQTtBQUFBLEVBaUNBLElBQUMsQ0FBQSxlQUFlLENBQUMsWUFBakIsR0FBb0MsSUFBQSxLQUFBLENBQ25DO0FBQUEsSUFBQSxDQUFBLEVBQUssQ0FBTDtBQUFBLElBQ0EsQ0FBQSxFQUFLLENBREw7QUFBQSxJQUVBLEtBQUEsRUFBUSxNQUFNLENBQUMsS0FGZjtBQUFBLElBR0EsTUFBQSxFQUFRLEVBSFI7QUFBQSxJQUlBLGVBQUEsRUFBaUIsUUFBUSxDQUFDLGNBSjFCO0FBQUEsSUFLQSxVQUFBLEVBQVksSUFBQyxDQUFBLGVBTGI7R0FEbUMsQ0FqQ3BDLENBQUE7QUFBQSxFQTBDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sR0FDQztBQUFBLElBQUEsYUFBQSxFQUFlLE1BQWY7QUFBQSxJQUNBLFNBQUEsRUFBVyxZQUFBLEdBQWUsUUFBUSxDQUFDLFFBRG5DO0FBQUEsSUFFQSxZQUFBLEVBQWMsWUFBQSxHQUFlLFFBQVEsQ0FBQyxRQUZ0QztHQTNDRCxDQUFBO0FBQUEsRUErQ0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxLQUFkLEdBQ0M7QUFBQSxJQUFBLGFBQUEsRUFBZSxNQUFmO0FBQUEsSUFDQSxTQUFBLEVBQVcsMkJBRFg7QUFBQSxJQUVBLFlBQUEsRUFBYywyQkFGZDtHQWhERCxDQUFBO0FBQUEsRUFvREEsSUFBQyxDQUFBLGVBQWUsQ0FBQyxZQUFZLENBQUMsS0FBOUIsR0FBc0MsUUFBUSxDQUFDLGlCQXBEL0MsQ0FBQTtBQUFBLEVBcURBLElBQUMsQ0FBQSxlQUFlLENBQUMsWUFBWSxDQUFDLEtBQTlCLEdBQ0M7QUFBQSxJQUFBLEtBQUEsRUFBTyxNQUFNLENBQUMsU0FBZDtBQUFBLElBQ0EsV0FBQSxFQUFhLE1BRGI7QUFBQSxJQUVBLFNBQUEsRUFBVyxZQUFBLEdBQWUsUUFBUSxDQUFDLFFBRm5DO0dBdERELENBQUE7QUFBQSxFQTBEQSxJQUFDLENBQUEsZUFBZSxDQUFDLFlBQVksQ0FBQyxJQUE5QixHQUFxQyxNQUFNLENBQUMsV0ExRDVDLENBQUE7QUFBQSxFQThEQSxJQUFDLENBQUEsZUFBZSxDQUFDLEtBQWpCLEdBQXlCLEVBOUR6QixDQUFBO0FBQUEsRUErREEsSUFBQyxDQUFBLGVBQWUsQ0FBQyxXQUFqQixHQUErQixFQS9EL0IsQ0FBQTtBQUFBLEVBaUVBLG1CQUFBLEdBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFBLEdBQUE7QUFDckIsVUFBQSwyQkFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLEVBQWIsQ0FBQTtBQUFBLE1BQ0EsU0FBQTs7QUFBWTtBQUFBO2FBQUEscUNBQUE7d0JBQUE7QUFDWCx1QkFBQSxVQUFXLENBQUEsSUFBSSxDQUFDLElBQUwsQ0FBWCxHQUF3QjtBQUFBLFlBQUMsS0FBQSxFQUFPLElBQUksQ0FBQyxLQUFiO0FBQUEsWUFBb0IsR0FBQSxFQUFLLElBQUksQ0FBQyxHQUE5QjtBQUFBLFlBQW1DLFFBQUEsRUFBVSxDQUE3QztZQUF4QixDQURXO0FBQUE7O29CQURaLENBQUE7YUFHQSxLQUFDLENBQUEsZUFBZSxDQUFDLElBQWpCLENBQXNCLHFCQUF0QixFQUpxQjtJQUFBLEVBQUE7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBakV0QixDQUFBO0FBQUEsRUF1RUEsZUFBQSxHQUFrQixDQUFBLFNBQUEsS0FBQSxHQUFBO1dBQUEsU0FBQSxHQUFBO0FBQ2pCLFVBQUEsMkJBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxFQUFiLENBQUE7QUFBQSxNQUNBLFNBQUE7O0FBQVk7QUFBQTthQUFBLHFDQUFBO3dCQUFBO0FBQ1gsdUJBQUEsVUFBVyxDQUFBLElBQUksQ0FBQyxJQUFMLENBQVgsR0FBd0I7QUFBQSxZQUFDLEtBQUEsRUFBTyxJQUFJLENBQUMsS0FBYjtBQUFBLFlBQW9CLEdBQUEsRUFBSyxJQUFJLENBQUMsR0FBOUI7WUFBeEIsQ0FEVztBQUFBOztvQkFEWixDQUFBO2FBSUEsS0FBQyxDQUFBLGVBQWUsQ0FBQyxJQUFqQixDQUFzQixpQkFBdEIsRUFBeUMsVUFBekMsRUFMaUI7SUFBQSxFQUFBO0VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXZFbEIsQ0FBQTtBQUFBLEVBOEVBLHNCQUFBLEdBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7V0FBQSxTQUFBLEdBQUE7QUFDeEIsVUFBQSwyQkFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLEVBQWIsQ0FBQTtBQUFBLE1BQ0EsU0FBQTs7QUFBWTtBQUFBO2FBQUEscUNBQUE7d0JBQUE7QUFDWCx1QkFBQSxVQUFXLENBQUEsSUFBSSxDQUFDLElBQUwsQ0FBWCxHQUF3QjtBQUFBLFlBQUMsS0FBQSxFQUFPLElBQUksQ0FBQyxLQUFiO0FBQUEsWUFBb0IsR0FBQSxFQUFLLElBQUksQ0FBQyxHQUE5QjtZQUF4QixDQURXO0FBQUE7O29CQURaLENBQUE7YUFJQSxLQUFDLENBQUEsZUFBZSxDQUFDLElBQWpCLENBQXNCLHdCQUF0QixFQUFnRCxVQUFoRCxFQUx3QjtJQUFBLEVBQUE7RUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBOUV6QixDQUFBO0FBb0ZBLEVBQUEsSUFBSSxNQUFNLENBQUMsS0FBUCxJQUFpQixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQWIsR0FBc0IsQ0FBM0M7QUFDQztBQUFBLFNBQUEscUNBQUE7b0JBQUE7QUFDQyxNQUFBLE9BQUEsR0FBYyxJQUFBLElBQUEsQ0FBSyxJQUFDLENBQUEsSUFBTixFQUFZLElBQUksQ0FBQyxJQUFqQixFQUF1QixJQUFJLENBQUMsS0FBNUIsRUFBbUMsSUFBSSxDQUFDLE1BQXhDLENBQWQsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBdkIsQ0FBNEIsT0FBNUIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsZUFBZSxDQUFDLFdBQVksQ0FBQSxJQUFJLENBQUMsSUFBTCxDQUE3QixHQUEwQyxPQUoxQyxDQUFBO0FBQUEsTUFPQSxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQXRCLENBQXlCLGVBQXpCLEVBQTBDLGVBQTFDLENBUEEsQ0FBQTtBQUFBLE1BVUEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUF0QixDQUF5QixzQkFBekIsRUFBaUQsc0JBQWpELENBVkEsQ0FBQTtBQUFBLE1BYUEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUF0QixDQUF5QixtQkFBekIsRUFBOEMsbUJBQTlDLENBYkEsQ0FERDtBQUFBLEtBREQ7R0FwRkE7QUFzR0EsU0FBTyxJQUFDLENBQUEsZUFBUixDQXhHZ0I7QUFBQSxDQXJyQmpCLENBQUE7Ozs7O0FDQUE7QUFBQTs7Ozs7R0FBQTtBQUFBLElBQUEsa0VBQUE7O0FBQUEsUUFRQSxHQUFXO0FBQUEsRUFDVixXQUFBLEVBQWEsTUFBTSxDQUFDLEtBRFY7QUFBQSxFQUVWLFlBQUEsRUFBYyxNQUFNLENBQUMsTUFGWDtBQUFBLEVBR1YsU0FBQSxFQUFXLEVBSEQ7QUFBQSxFQUlWLFdBQUEsRUFBYSxDQUFBLEVBSkg7QUFBQSxFQUtWLFVBQUEsRUFBWSxDQUFBLEVBTEY7QUFBQSxFQU1WLFNBQUEsRUFBVyxTQU5EO0FBQUEsRUFPVixtQkFBQSxFQUFxQixTQVBYO0FBQUEsRUFRVixJQUFBLEVBQU0sRUFSSTtBQUFBLEVBU1YsT0FBQSxFQUFTLElBVEM7QUFBQSxFQVVWLFlBQUEsRUFBYyxtQ0FWSjtBQUFBLEVBV1YsZUFBQSxFQUFpQixTQVhQO0FBQUEsRUFZVixVQUFBLEVBQVksSUFaRjtBQUFBLEVBYVYsU0FBQSxFQUFXLEVBYkQ7QUFBQSxFQWNWLFVBQUEsRUFBWSxTQWRGO0NBUlgsQ0FBQTs7QUFBQSxRQXdCUSxDQUFDLGNBQVQsR0FBMEI7QUFBQSxFQUN6QixRQUFBLEVBQVUsTUFEZTtBQUFBLEVBRXpCLFNBQUEsRUFBVyxRQUZjO0FBQUEsRUFHekIsVUFBQSxFQUFZLDZCQUhhO0NBeEIxQixDQUFBOztBQUFBLFFBNkJRLENBQUMsY0FBVCxHQUEwQjtBQUFBLEVBQ3pCLFFBQUEsRUFBVSxNQURlO0FBQUEsRUFFekIsVUFBQSxFQUFZLE1BRmE7QUFBQSxFQUd6QixLQUFBLEVBQU8sTUFIa0I7QUFBQSxFQUl6QixTQUFBLEVBQVcsUUFKYztBQUFBLEVBS3pCLFVBQUEsRUFBWSw2QkFMYTtDQTdCMUIsQ0FBQTs7QUFBQSxPQW9DTyxDQUFDLFFBQVIsR0FBbUIsUUFwQ25CLENBQUE7O0FBQUEsZUF1Q0EsR0FBa0IsU0FBQyxJQUFELEdBQUE7QUFHakIsTUFBQSxpQkFBQTtBQUFBO0FBQUEsT0FBQSxxQ0FBQTtrQkFBQTtBQUNDLElBQUEsSUFBZSxJQUFJLENBQUMsSUFBTCxLQUFhLElBQTVCO0FBQUEsYUFBTyxJQUFQLENBQUE7S0FERDtBQUFBLEdBSGlCO0FBQUEsQ0F2Q2xCLENBQUE7O0FBQUEsV0E4Q0EsR0FBYyxTQUFDLFlBQUQsR0FBQTtBQUdiLE1BQUEsMEJBQUE7QUFBQTtBQUFBO09BQUEscUNBQUE7a0JBQUE7QUFDQyxJQUFBLElBQUcsaUJBQUg7QUFDQyxNQUFBLElBQUcsSUFBSSxDQUFDLElBQUwsS0FBYSxZQUFZLENBQUMsSUFBN0I7QUFBdUMsUUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQVYsR0FBb0IsSUFBcEIsQ0FBdkM7T0FBQSxNQUFBO0FBQXFFLFFBQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFWLEdBQW9CLEtBQXBCLENBQXJFO09BQUE7QUFDQSxNQUFBLElBQUcsSUFBSSxDQUFDLFFBQUwsS0FBaUIsWUFBWSxDQUFDLFFBQWpDO3FCQUErQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQWQsR0FBd0IsTUFBdkU7T0FBQSxNQUFBO3FCQUFpRixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQWQsR0FBd0IsT0FBekc7T0FGRDtLQUFBLE1BQUE7MkJBQUE7S0FERDtBQUFBO2lCQUhhO0FBQUEsQ0E5Q2QsQ0FBQTs7QUFBQSxXQXVEQSxHQUFjLFNBQUMsSUFBRCxHQUFBO0FBR2IsTUFBQSwwQkFBQTtBQUFBLEVBQUEsSUFBRyxJQUFBLEtBQVEsSUFBQyxDQUFBLFFBQVo7QUFDQztBQUFBO1NBQUEscUNBQUE7b0JBQUE7QUFDQyxNQUFBLElBQUcsSUFBSSxDQUFDLElBQUwsS0FBYSxJQUFoQjtBQUNDLFFBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLEdBQWlDLFFBQVEsQ0FBQyxTQUExQyxDQUFBO0FBQ0EsUUFBQSxJQUF1RCxJQUFJLENBQUMsVUFBNUQ7QUFBQSxVQUFBLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBaEIsR0FBd0I7QUFBQSxZQUFBLE9BQUEsRUFBUyxRQUFRLENBQUMsU0FBbEI7V0FBeEIsQ0FBQTtTQURBO0FBRUEsUUFBQSxJQUEyRixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQTFHO0FBQUEsVUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsR0FBdUI7QUFBQSxZQUFBLG9CQUFBLEVBQXNCLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQXhCLEdBQXVDLEdBQTdEO1dBQXZCLENBQUE7U0FGQTtBQUFBLFFBR0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMsSUFIakIsQ0FBQTtBQUFBLFFBSUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFiLENBSkEsQ0FBQTtBQUFBLHFCQUtBLElBQUMsQ0FBQyxJQUFGLENBQU8saUJBQVAsRUFBMEIsSUFBSSxDQUFDLElBQS9CLEVBTEEsQ0FERDtPQUFBLE1BQUE7QUFRQyxRQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixHQUFpQyxRQUFRLENBQUMsbUJBQTFDLENBQUE7QUFDQSxRQUFBLElBQWlFLElBQUksQ0FBQyxVQUF0RTtBQUFBLFVBQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFoQixHQUF3QjtBQUFBLFlBQUEsT0FBQSxFQUFTLFFBQVEsQ0FBQyxtQkFBbEI7V0FBeEIsQ0FBQTtTQURBO0FBRUEsUUFBQSxJQUFtRixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWxHO3VCQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBZixHQUF1QjtBQUFBLFlBQUEsb0JBQUEsRUFBc0IsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBeEIsR0FBK0IsR0FBckQ7YUFBdkI7U0FBQSxNQUFBOytCQUFBO1NBVkQ7T0FERDtBQUFBO21CQUREO0dBSGE7QUFBQSxDQXZEZCxDQUFBOztBQUFBLGFBeUVBLEdBQWdCLFNBQUMsSUFBRCxFQUFPLEtBQVAsR0FBQTtBQUdmLE1BQUEsMEJBQUE7QUFBQTtBQUFBO09BQUEscUNBQUE7a0JBQUE7QUFDQyxJQUFBLElBQUcsSUFBSSxDQUFDLElBQUwsS0FBYSxJQUFoQjtBQUNDLE1BQUEsSUFBRyxLQUFIO0FBQ0MsUUFBQSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQWhCLEdBQXVCLEtBQXZCLENBQUE7QUFBQSxxQkFDQSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQWhCLEdBQTBCLEtBRDFCLENBREQ7T0FBQSxNQUFBO3FCQUlDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBaEIsR0FBMEIsT0FKM0I7T0FERDtLQUFBLE1BQUE7MkJBQUE7S0FERDtBQUFBO2lCQUhlO0FBQUEsQ0F6RWhCLENBQUE7O0FBQUEsT0FxRk8sQ0FBQyxNQUFSLEdBQWlCLFNBQUMsUUFBRCxHQUFBO0FBR2hCLE1BQUEsc0dBQUE7QUFBQSxFQUFBLE1BQUEsR0FBYSxJQUFBLEtBQUEsQ0FDWjtBQUFBLElBQUEsQ0FBQSxFQUFHLENBQUg7QUFBQSxJQUNBLENBQUEsRUFBRyxRQUFRLENBQUMsWUFBVCxHQUF3QixRQUFRLENBQUMsU0FEcEM7QUFBQSxJQUVBLEtBQUEsRUFBTyxRQUFRLENBQUMsV0FGaEI7QUFBQSxJQUdBLE1BQUEsRUFBUSxRQUFRLENBQUMsU0FIakI7QUFBQSxJQUlBLGVBQUEsRUFBaUIsUUFBUSxDQUFDLGVBSjFCO0dBRFksQ0FBYixDQUFBO0FBQUEsRUFPQSxNQUFNLENBQUMsS0FBUCxHQUFlO0FBQUEsSUFBQSxZQUFBLEVBQWMsUUFBUSxDQUFDLFlBQXZCO0dBUGYsQ0FBQTtBQUFBLEVBUUEsTUFBTSxDQUFDLGVBQVAsR0FBeUIsZUFSekIsQ0FBQTtBQUFBLEVBU0EsTUFBTSxDQUFDLFdBQVAsR0FBcUIsV0FUckIsQ0FBQTtBQUFBLEVBVUEsTUFBTSxDQUFDLFdBQVAsR0FBcUIsV0FWckIsQ0FBQTtBQUFBLEVBV0EsTUFBTSxDQUFDLGFBQVAsR0FBdUIsYUFYdkIsQ0FBQTtBQUFBLEVBWUEsTUFBTSxDQUFDLFFBQVAsR0FBa0IsSUFabEIsQ0FBQTtBQUFBLEVBYUEsTUFBTSxDQUFDLEtBQVAsR0FBZSxFQWJmLENBQUE7QUFBQSxFQWVBLFVBQUEsR0FBaUIsSUFBQSxLQUFBLENBQ2hCO0FBQUEsSUFBQSxDQUFBLEVBQUcsQ0FBSDtBQUFBLElBQ0EsQ0FBQSxFQUFHLENBREg7QUFBQSxJQUVBLEtBQUEsRUFBTyxRQUFRLENBQUMsV0FGaEI7QUFBQSxJQUdBLE1BQUEsRUFBUSxRQUFRLENBQUMsU0FIakI7QUFBQSxJQUlBLGVBQUEsRUFBaUIsUUFBUSxDQUFDLGVBSjFCO0FBQUEsSUFLQSxPQUFBLEVBQVMsUUFBUSxDQUFDLE9BTGxCO0FBQUEsSUFNQSxVQUFBLEVBQVksTUFOWjtHQURnQixDQWZqQixDQUFBO0FBQUEsRUF3QkEsU0FBQSxHQUFZLE1BQU0sQ0FBQyxJQUFQLENBQVksUUFBWixDQUFxQixDQUFDLE1BeEJsQyxDQUFBO0FBQUEsRUF5QkEsQ0FBQSxHQUFJLENBekJKLENBQUE7QUEyQkEsT0FBQSxnQkFBQTs0QkFBQTtBQUNDLElBQUEsU0FBQSxHQUFnQixJQUFBLEtBQUEsQ0FDZjtBQUFBLE1BQUEsZUFBQSxFQUFpQixNQUFqQjtBQUFBLE1BQ0EsS0FBQSxFQUFPLFFBQVEsQ0FBQyxXQUFULEdBQXVCLFNBRDlCO0FBQUEsTUFFQSxNQUFBLEVBQVEsUUFBUSxDQUFDLFNBRmpCO0FBQUEsTUFHQSxDQUFBLEVBQUcsQ0FBQSxHQUFJLENBQUMsUUFBUSxDQUFDLFdBQVQsR0FBdUIsU0FBeEIsQ0FIUDtBQUFBLE1BSUEsQ0FBQSxFQUFHLENBSkg7QUFBQSxNQUtBLFVBQUEsRUFBWSxNQUxaO0FBQUEsTUFNQSxJQUFBLEVBQU0sSUFOTjtLQURlLENBQWhCLENBQUE7QUFTQSxJQUFBLElBQUcsbUJBQUg7QUFFQyxNQUFBLFFBQUEsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQVosQ0FBQSxDQUFYLENBQUE7QUFDQSxNQUFBLElBQUcsZUFBZSxDQUFDLFNBQVMsQ0FBQyxhQUExQixDQUF3QyxRQUF4QyxDQUFIO0FBQ0MsUUFBQSxRQUFRLENBQUMsT0FBTyxDQUFDLElBQWpCLEdBQXdCLFFBQVEsQ0FBQyxJQUFqQyxDQUREO09BQUEsTUFBQTtBQUdDLFFBQUEsUUFBUSxDQUFDLElBQVQsR0FBZ0IsUUFBUSxDQUFDLElBQXpCLENBSEQ7T0FEQTtBQUFBLE1BS0EsUUFBUSxDQUFDLFVBQVQsR0FBc0IsTUFMdEIsQ0FBQTtBQUFBLE1BTUEsUUFBUSxDQUFDLEtBQVQsR0FBaUIsQ0FOakIsQ0FBQTtBQUFBLE1BT0EsUUFBUSxDQUFDLENBQVQsR0FBYSxRQUFRLENBQUMsQ0FBVCxHQUFhLENBQUMsUUFBUSxDQUFDLFlBQVQsR0FBd0IsUUFBUSxDQUFDLFNBQWxDLENBUDFCLENBQUE7QUFBQSxNQVNBLFNBQVMsQ0FBQyxJQUFWLEdBQWlCLE1BQU0sQ0FBQyxJQVR4QixDQUFBO0FBQUEsTUFVQSxTQUFTLENBQUMsUUFBVixHQUFxQixRQVZyQixDQUZEO0tBVEE7QUFBQSxJQXVCQSxTQUFBLEdBQWdCLElBQUEsS0FBQSxDQUNmO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBUDtBQUFBLE1BQ0EsTUFBQSxFQUFRLEVBRFI7QUFBQSxNQUVBLFVBQUEsRUFBWSxTQUZaO0tBRGUsQ0F2QmhCLENBQUE7QUFBQSxJQTJCQSxTQUFTLENBQUMsSUFBVixHQUFpQixNQUFNLENBQUMsSUEzQnhCLENBQUE7QUE0QkEsSUFBQSxJQUFnRCwyQkFBaEQ7QUFBQSxNQUFBLFNBQVMsQ0FBQyxZQUFWLEdBQXlCLE1BQU0sQ0FBQyxZQUFoQyxDQUFBO0tBNUJBO0FBQUEsSUErQkEsU0FBUyxDQUFDLEtBQVYsR0FDQztBQUFBLE1BQUEsb0JBQUEsRUFBc0IsTUFBQSxHQUFTLFNBQVMsQ0FBQyxJQUFuQixHQUEwQixHQUFoRDtBQUFBLE1BQ0EscUJBQUEsRUFBdUIsV0FEdkI7QUFBQSxNQUVBLHVCQUFBLEVBQXlCLGVBRnpCO0tBaENELENBQUE7QUFBQSxJQW1DQSxTQUFTLENBQUMsT0FBVixDQUFBLENBbkNBLENBQUE7QUFBQSxJQW9DQSxTQUFTLENBQUMsT0FBVixDQUFrQixRQUFRLENBQUMsVUFBM0IsQ0FwQ0EsQ0FBQTtBQUFBLElBcUNBLFNBQVMsQ0FBQyxTQUFWLEdBQXNCLFNBckN0QixDQUFBO0FBdUNBLElBQUEsSUFBRyxRQUFRLENBQUMsVUFBWjtBQUNDLE1BQUEsVUFBQSxHQUFpQixJQUFBLEtBQUEsQ0FDaEI7QUFBQSxRQUFBLEtBQUEsRUFBTyxTQUFTLENBQUMsS0FBakI7QUFBQSxRQUNBLENBQUEsRUFBRyxDQURIO0FBQUEsUUFFQSxDQUFBLEVBQUcsUUFBUSxDQUFDLFNBQVQsR0FBcUIsUUFBUSxDQUFDLFdBRmpDO0FBQUEsUUFHQSxVQUFBLEVBQVksU0FIWjtBQUFBLFFBSUEsZUFBQSxFQUFpQixNQUpqQjtPQURnQixDQUFqQixDQUFBO0FBQUEsTUFNQSxVQUFVLENBQUMsSUFBWCxHQUFrQixJQU5sQixDQUFBO0FBQUEsTUFPQSxVQUFVLENBQUMsS0FBWCxHQUFtQixRQUFRLENBQUMsY0FQNUIsQ0FBQTtBQUFBLE1BUUEsU0FBUyxDQUFDLFVBQVYsR0FBdUIsVUFSdkIsQ0FERDtLQXZDQTtBQUFBLElBa0RBLFVBQUEsR0FBaUIsSUFBQSxLQUFBLENBQ2hCO0FBQUEsTUFBQSxLQUFBLEVBQU8sUUFBUSxDQUFDLFNBQWhCO0FBQUEsTUFDQSxNQUFBLEVBQVEsUUFBUSxDQUFDLFNBRGpCO0FBQUEsTUFFQSxDQUFBLEVBQUcsQ0FGSDtBQUFBLE1BR0EsQ0FBQSxFQUFHLENBSEg7QUFBQSxNQUlBLFlBQUEsRUFBYyxFQUpkO0FBQUEsTUFLQSxVQUFBLEVBQVksU0FMWjtBQUFBLE1BTUEsZUFBQSxFQUFpQixRQUFRLENBQUMsVUFOMUI7S0FEZ0IsQ0FsRGpCLENBQUE7QUFBQSxJQTBEQSxVQUFVLENBQUMsS0FBWCxHQUFtQixRQUFRLENBQUMsY0ExRDVCLENBQUE7QUFBQSxJQTJEQSxVQUFVLENBQUMsT0FBWCxDQUFtQixFQUFuQixDQTNEQSxDQUFBO0FBQUEsSUE2REEsU0FBUyxDQUFDLFVBQVYsR0FBdUIsVUE3RHZCLENBQUE7QUFBQSxJQThEQSxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQXJCLEdBQStCLEtBOUQvQixDQUFBO0FBQUEsSUFnRUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFiLENBQWtCLFNBQWxCLENBaEVBLENBQUE7QUFBQSxJQWtFQSxTQUFTLENBQUMsRUFBVixDQUFhLE1BQU0sQ0FBQyxLQUFwQixFQUEyQixTQUFBLEdBQUE7YUFDMUIsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsSUFBQyxDQUFBLElBQXBCLEVBRDBCO0lBQUEsQ0FBM0IsQ0FsRUEsQ0FBQTtBQUFBLElBcUVBLENBQUEsRUFyRUEsQ0FERDtBQUFBLEdBM0JBO0FBQUEsRUFvR0EsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsTUFBTSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFuQyxDQXBHQSxDQUFBO0FBc0dBLFNBQU8sTUFBUCxDQXpHZ0I7QUFBQSxDQXJGakIsQ0FBQTs7Ozs7QUNBQSxPQUFPLENBQUMsRUFBUixHQUFpQixJQUFBLGVBQUEsQ0FDaEI7QUFBQSxFQUFBLGVBQUEsRUFBZ0IsTUFBaEI7QUFBQSxFQUNBLElBQUEsRUFBTSxJQUROO0NBRGdCLENBQWpCLENBQUE7O0FBQUEsT0FJTyxDQUFDLEtBQVIsR0FBb0IsSUFBQSxLQUFBLENBQ25CO0FBQUEsRUFBQSxlQUFBLEVBQWlCLGFBQWpCO0FBQUEsRUFDQSxJQUFBLEVBQU0sc0RBRE47QUFBQSxFQUVBLEtBQUEsRUFBTztBQUFBLElBQ04sT0FBQSxFQUFTLFdBREg7QUFBQSxJQUVOLFlBQUEsRUFBYyxRQUZSO0FBQUEsSUFHTixhQUFBLEVBQWUsdUJBSFQ7QUFBQSxJQUlOLGFBQUEsRUFBZSxLQUpUO0FBQUEsSUFLTixXQUFBLEVBQWEsTUFMUDtBQUFBLElBTU4sYUFBQSxFQUFlLE1BTlQ7QUFBQSxJQU9OLFNBQUEsRUFBVyxNQVBMO0dBRlA7QUFBQSxFQVVBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FWZDtBQUFBLEVBV0EsTUFBQSxFQUFRLEdBWFI7QUFBQSxFQVlBLENBQUEsRUFBRyxHQVpIO0FBQUEsRUFhQSxJQUFBLEVBQU0sT0FiTjtDQURtQixDQUpwQixDQUFBOztBQUFBLE9Bb0JPLENBQUMsS0FBUixHQUFvQixJQUFBLEtBQUEsQ0FDbkI7QUFBQSxFQUFBLEtBQUEsRUFBTyx1QkFBUDtBQUFBLEVBQ0EsS0FBQSxFQUFPLEdBRFA7QUFBQSxFQUVBLElBQUEsRUFBTSxPQUZOO0NBRG1CLENBcEJwQixDQUFBOztBQUFBLE9BeUJPLENBQUMsS0FBSyxDQUFDLE1BQWQsQ0FBQSxDQXpCQSxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIGV4cG9ydHMuVmlld05hdmlnYXRpb25Db250cm9sbGVyIGV4dGVuZHMgTGF5ZXJcblxuXHQjIFNldHVwIENsYXNzIENvbnN0YW50c1xuXHRJTklUSUFMX1ZJRVdfTkFNRSA9IFwiaW5pdGlhbFZpZXdcIlxuXHRCQUNLQlVUVE9OX1ZJRVdfTkFNRSA9IFwidm5jLWJhY2tCdXR0b25cIlxuXHRBTklNQVRJT05fT1BUSU9OUyA9XG5cdFx0dGltZTogMC4zXG5cdFx0Y3VydmU6IFwiZWFzZS1pbi1vdXRcIlxuXHRCQUNLX0JVVFRPTl9GUkFNRSA9XG5cdFx0eDogMFxuXHRcdHk6IDQwXG5cdFx0d2lkdGg6IDg4XG5cdFx0aGVpZ2h0OiA4OFxuXHRQVVNIID1cblx0XHRVUDogICAgIFwicHVzaFVwXCJcblx0XHRET1dOOiAgIFwicHVzaERvd25cIlxuXHRcdExFRlQ6ICAgXCJwdXNoTGVmdFwiXG5cdFx0UklHSFQ6ICBcInB1c2hSaWdodFwiXG5cdFx0Q0VOVEVSOiBcInB1c2hDZW50ZXJcIlxuXHRESVIgPVxuXHRcdFVQOiAgICBcInVwXCJcblx0XHRET1dOOiAgXCJkb3duXCJcblx0XHRMRUZUOiAgXCJsZWZ0XCJcblx0XHRSSUdIVDogXCJyaWdodFwiXG5cdERFQlVHX01PREUgPSBmYWxzZVxuXG5cdCMgU2V0dXAgSW5zdGFuY2UgYW5kIEluc3RhbmNlIFZhcmlhYmxlc1xuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zPXt9KSAtPlxuXG5cdFx0QHZpZXdzID0gQGhpc3RvcnkgPSBAaW5pdGlhbFZpZXcgPSBAY3VycmVudFZpZXcgPSBAcHJldmlvdXNWaWV3ID0gQGFuaW1hdGlvbk9wdGlvbnMgPSBAaW5pdGlhbFZpZXdOYW1lID0gbnVsbFxuXHRcdEBvcHRpb25zLndpZHRoICAgICAgICAgICA/PSBTY3JlZW4ud2lkdGhcblx0XHRAb3B0aW9ucy5oZWlnaHQgICAgICAgICAgPz0gU2NyZWVuLmhlaWdodFxuXHRcdEBvcHRpb25zLmNsaXAgICAgICAgICAgICA/PSB0cnVlXG5cdFx0QG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwiIzk5OVwiXG5cblx0XHRzdXBlciBAb3B0aW9uc1xuXG5cdFx0QHZpZXdzICAgPSBbXVxuXHRcdEBoaXN0b3J5ID0gW11cblx0XHRAYW5pbWF0aW9uT3B0aW9ucyA9IEBvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgb3IgQU5JTUFUSU9OX09QVElPTlNcblx0XHRAaW5pdGlhbFZpZXdOYW1lICA9IEBvcHRpb25zLmluaXRpYWxWaWV3TmFtZSAgb3IgSU5JVElBTF9WSUVXX05BTUVcblx0XHRAYmFja0J1dHRvbkZyYW1lICA9IEBvcHRpb25zLmJhY2tCdXR0b25GcmFtZSAgb3IgQkFDS19CVVRUT05fRlJBTUVcblx0XHRAZGVidWdNb2RlICAgICAgICA9IEBvcHRpb25zLmRlYnVnTW9kZSAgICAgICAgb3IgREVCVUdfTU9ERVxuXG5cdFx0QC5vbiBcImNoYW5nZTpzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpIC0+XG5cdFx0XHRAYWRkVmlldyBzdWJMYXllciwgdHJ1ZSBmb3Igc3ViTGF5ZXIgaW4gY2hhbmdlTGlzdC5hZGRlZFxuXG5cdGFkZFZpZXc6ICh2aWV3LCB2aWFJbnRlcm5hbENoYW5nZUV2ZW50KSAtPlxuXG5cdFx0dm5jV2lkdGggID0gQG9wdGlvbnMud2lkdGhcblx0XHR2bmNIZWlnaHQgPSBAb3B0aW9ucy5oZWlnaHRcblxuXHRcdHZpZXcuc3RhdGVzLmFkZChcblx0XHRcdFwiI3sgUFVTSC5VUCB9XCI6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogLXZuY0hlaWdodFxuXHRcdFx0XCIjeyBQVVNILkxFRlQgfVwiOlxuXHRcdFx0XHR4OiAtdm5jV2lkdGhcblx0XHRcdFx0eTogMFxuXHRcdFx0XCIjeyBQVVNILkNFTlRFUiB9XCI6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogMFxuXHRcdFx0XCIjeyBQVVNILlJJR0hUIH1cIjpcblx0XHRcdFx0eDogdm5jV2lkdGhcblx0XHRcdFx0eTogMFxuXHRcdFx0XCIjeyBQVVNILkRPV04gfVwiOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IHZuY0hlaWdodFxuXHRcdClcblxuXG5cdFx0dmlldy5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zXG5cblx0XHRpZiB2aWV3Lm5hbWUgaXMgQGluaXRpYWxWaWV3TmFtZVxuXHRcdFx0QGluaXRpYWxWaWV3ID0gdmlld1xuXHRcdFx0QGN1cnJlbnRWaWV3ID0gdmlld1xuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBQVVNILkNFTlRFUlxuXHRcdFx0QGhpc3RvcnkucHVzaCB2aWV3XG5cdFx0ZWxzZVxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBQVVNILlJJR0hUXG5cblx0XHR1bmxlc3Mgdmlldy5zdXBlckxheWVyIGlzIEAgb3IgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudFxuXHRcdFx0dmlldy5zdXBlckxheWVyID0gQFxuXG5cdFx0QF9hcHBseUJhY2tCdXR0b24gdmlldyB1bmxlc3Mgdmlldy5uYW1lIGlzIEBpbml0aWFsVmlld05hbWVcblxuXHRcdEB2aWV3cy5wdXNoIHZpZXdcblxuXHR0cmFuc2l0aW9uOiAodmlldywgZGlyZWN0aW9uID0gRElSLlJJR0hULCBzd2l0Y2hJbnN0YW50ID0gZmFsc2UsIHByZXZlbnRIaXN0b3J5ID0gZmFsc2UpIC0+XG5cblx0XHRyZXR1cm4gZmFsc2UgaWYgdmlldyBpcyBAY3VycmVudFZpZXdcblxuXHRcdCMgU2V0dXAgVmlld3MgZm9yIHRoZSB0cmFuc2l0aW9uXG5cblx0XHRpZiBkaXJlY3Rpb24gaXMgRElSLlJJR0hUXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILlJJR0hUXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILkxFRlRcblx0XHRlbHNlIGlmIGRpcmVjdGlvbiBpcyBESVIuRE9XTlxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5ET1dOXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILlVQXG5cdFx0ZWxzZSBpZiBkaXJlY3Rpb24gaXMgRElSLkxFRlRcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guTEVGVFxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5SSUdIVFxuXHRcdGVsc2UgaWYgZGlyZWN0aW9uIGlzIERJUi5VUFxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5VUFxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5ET1dOXG5cdFx0ZWxzZVxuXHRcdFx0IyBJZiB0aGV5IHNwZWNpZmllZCBzb21ldGhpbmcgZGlmZmVyZW50IGp1c3Qgc3dpdGNoIGltbWVkaWF0ZWx5XG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guQ0VOVEVSXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5MRUZUXG5cblx0XHQjIFB1c2ggdmlldyB0byBDZW50ZXJcblx0XHR2aWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5DRU5URVJcblx0XHQjIGN1cnJlbnRWaWV3IGlzIG5vdyBvdXIgcHJldmlvdXNWaWV3XG5cdFx0QHByZXZpb3VzVmlldyA9IEBjdXJyZW50Vmlld1xuXHRcdCMgU2V0IG91ciBjdXJyZW50VmlldyB0byB0aGUgdmlldyB3ZSdyZSBicmluZ2luZyBpblxuXHRcdEBjdXJyZW50VmlldyA9IHZpZXdcblxuXHRcdCMgU3RvcmUgdGhlIGxhc3QgdmlldyBpbiBoaXN0b3J5XG5cdFx0QGhpc3RvcnkucHVzaCBAcHJldmlvdXNWaWV3IGlmIHByZXZlbnRIaXN0b3J5IGlzIGZhbHNlXG5cblx0XHRAZW1pdCBFdmVudHMuQ2hhbmdlXG5cblx0cmVtb3ZlQmFja0J1dHRvbjogKHZpZXcpIC0+XG5cdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0XHRcdHZpZXcuc3ViTGF5ZXJzQnlOYW1lKEJBQ0tCVVRUT05fVklFV19OQU1FKVswXS52aXNpYmxlID0gZmFsc2VcblxuXHRiYWNrOiAoKSAtPlxuXHRcdEB0cmFuc2l0aW9uKEBfZ2V0TGFzdEhpc3RvcnlJdGVtKCksIGRpcmVjdGlvbiA9IERJUi5MRUZULCBzd2l0Y2hJbnN0YW50ID0gZmFsc2UsIHByZXZlbnRIaXN0b3J5ID0gdHJ1ZSlcblx0XHRAaGlzdG9yeS5wb3AoKVxuXG5cdF9nZXRMYXN0SGlzdG9yeUl0ZW06ICgpIC0+XG5cdFx0cmV0dXJuIEBoaXN0b3J5W0BoaXN0b3J5Lmxlbmd0aCAtIDFdXG5cblx0X2FwcGx5QmFja0J1dHRvbjogKHZpZXcsIGZyYW1lID0gQGJhY2tCdXR0b25GcmFtZSkgLT5cblx0XHRVdGlscy5kZWxheSAwLCA9PlxuXHRcdFx0aWYgdmlldy5iYWNrQnV0dG9uIGlzbnQgZmFsc2Vcblx0XHRcdFx0YmFja0J1dHRvbiA9IG5ldyBMYXllclxuXHRcdFx0XHRcdG5hbWU6IEJBQ0tCVVRUT05fVklFV19OQU1FXG5cdFx0XHRcdFx0d2lkdGg6IDgwXG5cdFx0XHRcdFx0aGVpZ2h0OiA4MFxuXHRcdFx0XHRcdHN1cGVyTGF5ZXI6IHZpZXdcblxuXHRcdFx0XHRpZiBAZGVidWdNb2RlIGlzIGZhbHNlXG5cdFx0XHRcdFx0YmFja0J1dHRvbi5iYWNrZ3JvdW5kQ29sb3IgPSBcInRyYW5zcGFyZW50XCJcblxuXHRcdFx0XHRiYWNrQnV0dG9uLmZyYW1lID0gZnJhbWVcblxuXHRcdFx0XHRiYWNrQnV0dG9uLm9uIEV2ZW50cy5DbGljaywgPT5cblx0XHRcdFx0XHRAYmFjaygpXG5cblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuIyBVU0FHRSBFWEFNUExFIDEgLSBEZWZpbmUgSW5pdGlhbFZpZXdOYW1lICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuIyBpbml0aWFsVmlld0tleSA9IFwidmlldzFcIlxuI1xuIyB2bmMgPSBuZXcgVmlld05hdmlnYXRpb25Db250cm9sbGVyIGluaXRpYWxWaWV3TmFtZTogaW5pdGlhbFZpZXdLZXlcbiMgdmlldzEgPSBuZXcgTGF5ZXJcbiMgXHRuYW1lOiBpbml0aWFsVmlld0tleVxuIyBcdHdpZHRoOiAgU2NyZWVuLndpZHRoXG4jIFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG4jIFx0YmFja2dyb3VuZENvbG9yOiBcInJlZFwiXG4jIFx0c3VwZXJMYXllcjogdm5jXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jIFVTQUdFIEVYQU1QTEUgMiAtIFVzZSBkZWZhdWx0IGluaXRpYWxWaWV3TmFtZSBcImluaXRpYWxWaWV3XCIgIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiMgdm5jID0gbmV3IFZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlclxuXG4jIHZpZXcxID0gbmV3IExheWVyXG4jIFx0bmFtZTogXCJpbml0aWFsVmlld1wiXG4jIFx0d2lkdGg6ICBTY3JlZW4ud2lkdGhcbiMgXHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcbiMgXHRiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCJcbiMgXHRzdXBlckxheWVyOiB2bmNcblxuIyB2aWV3MiA9IG5ldyBMYXllclxuIyBcdHdpZHRoOiAgU2NyZWVuLndpZHRoXG4jIFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG4jIFx0YmFja2dyb3VuZENvbG9yOiBcImdyZWVuXCJcbiMgXHRzdXBlckxheWVyOiB2bmNcblxuIyB2aWV3MS5vbiBFdmVudHMuQ2xpY2ssIC0+IHZuYy50cmFuc2l0aW9uIHZpZXcyXG4jIHZpZXcyLm9uIEV2ZW50cy5DbGljaywgLT4gdm5jLmJhY2soKVxuIiwiIyMjXG4gIEZyYW1lcktpdCBmb3IgRnJhbWVyXG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXBoZGFtaWNvL2ZyYW1lcktpdFxuXG4gIENvcHlyaWdodCAoYykgMjAxNSwgUmFwaCBEJ0FtaWNvIGh0dHA6Ly9yYXBoZGFtaWNvLmNvbSAoQHJhcGhkYW1pY28pXG4gIE1JVCBMaWNlbnNlXG5cbiAgUmVhZG1lOlxuICBodHRwczovL2dpdGh1Yi5jb20vcmFwaGRhbWljby9mcmFtZXJLaXRcblxuICBMaWNlbnNlOlxuICBodHRwczovL2dpdGh1Yi5jb20vcmFwaGRhbWljby9mcmFtZXJLaXQvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuIyMjXG5cblxuXG5cbiMjI1xuXHRERUZBVUxUIFNUWUxFU1xuXHROb3RlIHRoZSBzY3JlZW53aWR0aCBjb25zdGFudDogdGhpcyBpcyBwcm9iYWJseSBvbmUgb2YgdGhlXG5cdGZpcnN0IHRoaW5ncyB5b3Ugd2FudCB0byBjaGFuZ2Ugc28gaXQgbWF0Y2hlcyB0aGUgZGV2aWNlXG5cdHlvdSdyZSBwcm90b3R5cGluZyBvbi5cbiMjI1xuZGVmYXVsdHMgPSB7XG5cdHNjcmVlbldpZHRoOiA3NTBcbn1cblxuIyMjXG5cdE1PUkUgU1RZTEVTXG4jIyNcbmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ID0gODhcbmRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmcgPSAyMFxuZGVmYXVsdHMudGludCA9ICdncmV5J1xuZGVmYXVsdHMubGluZVRpbnQgPSBcInJnYmEoMjAwLDIwMCwyMDAsMSlcIlxuZGVmYXVsdHMuc3dpdGNoVGludCA9ICcjMURDMjRCJ1xuZGVmYXVsdHMuaXRlbUJhY2tncm91bmQgPSAnd2hpdGUnXG5kZWZhdWx0cy5saXN0SXRlbVRleHRTdHlsZSA9IHtcblx0Zm9udFNpemU6IFwiMzJweFwiXG5cdGxpbmVIZWlnaHQ6IChkZWZhdWx0cy50YWJsZVJvd0hlaWdodC00KStcInB4XCJcdFx0XG5cdGZvbnRGYW1pbHk6IFwiSGVsdmV0aWNhIE5ldWVcIlxuXHRmb250V2VpZ2h0OiBcIjIwMFwiXG59XG5kZWZhdWx0cy5kaXZpZGVySXRlbVRleHRTdHlsZSA9IHtcblx0Zm9udFNpemU6IFwiMjJweFwiXG5cdGxpbmVIZWlnaHQ6IChkZWZhdWx0cy50YWJsZVJvd0hlaWdodC00KStcInB4XCJcdFx0XG5cdGZvbnRGYW1pbHk6IFwiSGVsdmV0aWNhIE5ldWVcIlxuXHRmb250V2VpZ2h0OiBcIjIwMFwiXG5cdHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnXG59XG5kZWZhdWx0cy5waWNrZXJUZXh0U3R5bGUgPSB7XG5cdGZvbnRTaXplOiBcdFx0XCI0MnB4XCJcblx0Zm9udEZhbWlseTogXHRcIkhlbHZldGljYSBOZXVlXCJcblx0Zm9udFdlaWdodDogXHRcIjIwMFwiXG59XG5leHBvcnRzLmRlZmF1bHRzID0gZGVmYXVsdHNcblxuXG4jIyNcblx0VEFCTEUgVklFVyBFTEVNRU5UU1xuXHQoZS5nLiBcIlRodW1iXCIgZm9yIHRoZSBzd2l0Y2ggY29udHJvbClcbiMjI1xuXG5Td2l0Y2ggPSAocGFyYW1zKSAtPlxuXHRwYXJhbXMgPSBwYXJhbXMgb3Ige31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsIFxuXHRcdHN3aXRjaFRpbnQ6IGRlZmF1bHRzLnN3aXRjaFRpbnRcblx0XHRzY3JlZW5XaWR0aDogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHR0YWJsZVJvd0hlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRzd2l0Y2hDb250YWluZXJCb3JkZXI6IDRcblx0XHRzd2l0Y2hDb250YWluZXJIZWlnaHQ6IDU0XG5cdFx0c3dpdGNoQ29udGFpbmVyV2lkdGg6IDk0XG5cdFx0Ym9yZGVyQ29sb3I6IGRlZmF1bHRzLmxpbmVUaW50ICMgR3JleSByb3VuZGVkIHBpbGwgJiBib3JkZXJzIGJldHdlZW4gY2VsbHNcblxuXHRAc2VsZWN0ZWQgPSB0cnVlXG5cdFxuXHQjIFNvbWUgb2YgdGhlIHZhbHVlcyBhcmUgYmFzZWQgb24gb3RoZXIgY29uc3RhbnRzLFxuXHQjIHNvIHlvdSBoYXZlIHRvIGNhbGN1bGF0ZSB0aGVtIGluIGEgc2Vjb25kIHBhc3Ncblx0c3dpdGNoQnV0dG9uUmFkaXVzID0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodC8yXG5cdHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyID0gMlxuXHRcblx0IyBUaGlzIGlzIG91ciBmYW5jeSBhbmltYXRlZCBzd2l0Y2ggc3dpdGNoXG5cdCMgd2UgbmVlZCB0byBtYWtlIGEgcm91bmRlZCByZWN0YW5nbGUgd2l0aCBhIGNpcmNsZSBpbnNpZGUgaXQuXG5cdEBzd2l0Y2hCdXR0b25Db250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0XHRcdFx0MFxuXHRcdHk6IFx0XHRcdFx0XHQwXG5cdFx0Y2xpcDogXHRcdFx0XHRmYWxzZSAjIENsaXBwaW5nIGh1cnRzIHRoZSBzdWJ0bGUgc2hhZG93IG9uIHRoZSBidXR0b25cblx0XHR3aWR0aDpcdFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aCBcblx0XHRoZWlnaHQ6XHRcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwiXCJcblx0XHRvcGFjaXR5OiBcdFx0XHQxXG5cblx0QHN3aXRjaEJhY2tncm91bmQgPSBuZXcgTGF5ZXJcblx0XHR4Olx0XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMgLSBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlci8yXG5cdFx0eTpcdFx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzIC0gc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIvMiAtIDRcblx0XHR3aWR0aDogXHRcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGggLSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0ICsgc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXJcblx0XHRoZWlnaHQ6IFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQgLSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0ICsgc2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXJcblx0XHRib3JkZXJSYWRpdXM6IFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0XG5cdFx0c2hhZG93U3ByZWFkOlx0XHRzd2l0Y2hCdXR0b25SYWRpdXMgLSBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlci8yICsgcGFyYW1zLnN3aXRjaENvbnRhaW5lckJvcmRlclxuXHRcdHNoYWRvd0NvbG9yOiBcdFx0cGFyYW1zLnN3aXRjaFRpbnRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0Jydcblx0XHRvcGFjaXR5OiBcdFx0XHQxXG5cdFx0c3VwZXJMYXllcjogXHRcdEBzd2l0Y2hCdXR0b25Db250YWluZXJcblx0XHRcblx0QHN3aXRjaEJ1dHRvbiA9IG5ldyBMYXllclxuXHRcdHg6IHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aCAtIHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHR5OiAtNFxuXHRcdHdpZHRoOlx0XHRcdFx0c3dpdGNoQnV0dG9uUmFkaXVzKjJcblx0XHRoZWlnaHQ6XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMqMlxuXHRcdGJvcmRlclJhZGl1czogXHRcdHN3aXRjaEJ1dHRvblJhZGl1c1xuXHRcdHNoYWRvd1k6XHRcdFx0M1xuXHRcdHNoYWRvd0JsdXI6IFx0XHQ1XG5cdFx0c2hhZG93Q29sb3I6IFx0XHQncmdiYSgwLDAsMCwwLjMpJ1xuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIndoaXRlXCJcblx0XHRvcGFjaXR5OiBcdFx0XHQxXG5cdFx0c3VwZXJMYXllcjogXHRcdEBzd2l0Y2hCdXR0b25Db250YWluZXJcblx0XG5cdCMgU0VUIFVQIEFOSU1BVElPTlNcblx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLmFkZFxuXHRcdGRlc2VsZWN0ZWQ6IFxuXHRcdFx0eDogXHRcdFx0XHQwXG5cdFx0XHR5OiBcdFx0XHRcdC00XG5cdFx0XHR3aWR0aDpcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyV2lkdGhcblx0XHRcdGhlaWdodDpcdFx0XHRwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0XG5cdFx0XHRzaGFkb3dTcHJlYWQ6IFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckJvcmRlclxuXHRcdFx0c2F0dXJhdGU6IFx0XHQwXG5cdFx0XHRicmlnaHRuZXNzOiBcdDE1M1xuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIlwiXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5hbmltYXRpb25PcHRpb25zID1cblx0XHRjdXJ2ZTogXCJlYXNlLWluLW91dFwiXG5cdFx0dGltZTogMC4zIFxuXHRAc3dpdGNoQmFja2dyb3VuZC5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdCBcdFx0aWYgQHNlbGVjdGVkXG4gXHRcdFx0XHRAc3dpdGNoQmFja2dyb3VuZC5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuc3dpdGNoVGludFxuXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLm9uIEV2ZW50cy5BbmltYXRpb25TdGFydCwgPT5cblx0XHRAc3dpdGNoQmFja2dyb3VuZC5iYWNrZ3JvdW5kQ29sb3IgPSAnJ1xuXG5cdEBzd2l0Y2hCdXR0b24uc3RhdGVzLmFkZFxuXHRcdGRlc2VsZWN0ZWQ6IHt4OiAwfVxuXHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5hbmltYXRpb25PcHRpb25zID1cblx0XHRjdXJ2ZTogXCJzcHJpbmcoNDAwLDI1LDApXCJcblx0XHRcblx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lci5zZWxlY3QgPSA9PlxuXHRcdEBzZWxlY3RlZCA9IHRydWVcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuc3dpdGNoKFwiZGVmYXVsdFwiKVxuXHRcdEBzd2l0Y2hCdXR0b24uc3RhdGVzLnN3aXRjaChcImRlZmF1bHRcIilcblx0XHRcblx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lci5kZXNlbGVjdCA9ID0+XG5cdFx0QHNlbGVjdGVkID0gZmFsc2Vcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuc3dpdGNoKFwiZGVzZWxlY3RlZFwiKVxuXHRcdEBzd2l0Y2hCdXR0b24uc3RhdGVzLnN3aXRjaChcImRlc2VsZWN0ZWRcIilcblxuXHRpZiBAc2VsZWN0ZWQgPT0gZmFsc2Vcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuc3dpdGNoSW5zdGFudChcImRlc2VsZWN0ZWRcIilcblx0XHRAc3dpdGNoQnV0dG9uLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwiZGVzZWxlY3RlZFwiKVxuXHRlbHNlXG5cdFx0QHN3aXRjaEJhY2tncm91bmQuYmFja2dyb3VuZENvbG9yID0gcGFyYW1zLnN3aXRjaFRpbnRcblxuXHRyZXR1cm4gQHN3aXRjaEJ1dHRvbkNvbnRhaW5lclxuXHRcbkNyb3NzID0gLT5cblx0Y29sb3IgPSBkZWZhdWx0cy50aW50XG5cdGNyb3NzVGhpY2tuZXNzID0gNFxuXHRjcm9zcyA9IG5ldyBMYXllclxuXHRcdHdpZHRoOiAzMFx0XG5cdFx0aGVpZ2h0OiAzMFx0XG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcblx0Y3Jvc3NVcHN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY3Jvc3NUaGlja25lc3Ncblx0XHR3aWR0aDogMjBcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0b3JpZ2luWDogMVxuXHRcdHN1cGVyTGF5ZXI6IGNyb3NzXG5cdGNyb3NzVXBzdHJva2UueSA9IDE0XG5cdGNyb3NzVXBzdHJva2Uucm90YXRpb25aID0gNDVcblx0Y3Jvc3NEb3duc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjcm9zc1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMFxuXHRcdG9yaWdpblg6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0c3VwZXJMYXllcjogY3Jvc3Ncblx0Y3Jvc3NEb3duc3Ryb2tlLnJvdGF0aW9uWiA9IC00NVxuXHRjcm9zcy5zZWxlY3QgPSAtPlxuXHRcdGNyb3NzLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0Y3Jvc3MuZGVzZWxlY3QgPSAtPlxuXHRcdGNyb3NzLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuNFxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1x0XHRcblx0cmV0dXJuIGNyb3NzXG5cdFxuQ2FyZXQgPSAtPlxuXHRjb2xvciA9IGRlZmF1bHRzLnRpbnRcblx0Y2FyZXRUaGlja25lc3MgPSA0XG5cdGNhcmV0ID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IDMwXG5cdFx0aGVpZ2h0OiAzMFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXHRcdFxuXHRjYXJldFVwc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjYXJldFRoaWNrbmVzc1xuXHRcdHdpZHRoOiAxOFxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRvcmlnaW5YOiAxXG5cdFx0c3VwZXJMYXllcjogY2FyZXRcblx0Y2FyZXRVcHN0cm9rZS55ID0gMTRcblx0Y2FyZXRVcHN0cm9rZS5yb3RhdGlvblogPSA0NVxuXHRjYXJldERvd25zdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNhcmV0VGhpY2tuZXNzXG5cdFx0d2lkdGg6IDE4XG5cdFx0b3JpZ2luWDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRzdXBlckxheWVyOiBjYXJldFxuXHRjYXJldERvd25zdHJva2UueSA9IDEyXHRcdFxuXHRjYXJldERvd25zdHJva2Uucm90YXRpb25aID0gLTQ1XG5cdGNhcmV0LnNlbGVjdCA9IC0+XG5cdFx0Y2FyZXQuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRjYXJldC5kZXNlbGVjdCA9IC0+XG5cdFx0Y2FyZXQuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRzY2FsZTogMC40XG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXHRcblx0cmV0dXJuIGNhcmV0XG5cdFxuQ2hlY2sgPSAtPlxuXHRjb2xvciA9IGRlZmF1bHRzLnRpbnRcblx0Y2hlY2tUaGlja25lc3MgPSA0XG5cdGNoZWNrID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IDMwXG5cdFx0aGVpZ2h0OiAzMFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXG5cdGNoZWNrVXBzdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNoZWNrVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDEzXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdG9yaWdpblg6IDFcblx0XHRzdXBlckxheWVyOiBjaGVja1xuXHRjaGVja1Vwc3Ryb2tlLnkgPSAxNlxuXHRjaGVja1Vwc3Ryb2tlLnJvdGF0aW9uWiA9IDQ1XG5cdGNoZWNrRG93bnN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2hlY2tUaGlja25lc3Ncblx0XHR3aWR0aDogMjJcblx0XHRvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdHN1cGVyTGF5ZXI6IGNoZWNrXHRcblx0Y2hlY2tEb3duc3Ryb2tlLnggPSA0XG5cdGNoZWNrRG93bnN0cm9rZS5yb3RhdGlvblogPSAtNDVcblx0Y2hlY2suc2VsZWN0ID0gLT5cblx0XHRjaGVjay5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdGNoZWNrLmRlc2VsZWN0ID0gLT5cblx0XHRjaGVjay5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjRcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0cmV0dXJuIGNoZWNrXG5cblxuIyMjXG5cdFRBQkxFIFZJRVdcblx0XG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFRhYmxlVmlld1Jvd1x0XHRbRWxlbWVudHMgZ28gaGVyZV1cblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuIyMjXG5cbmV4cG9ydHMuVGFibGVWaWV3Um93ID0gKHBhcmFtcykgLT5cblx0XG5cdCMgVGhlIHRyaWNreSB0aGluZyBhYm91dCByZXVzYWJsZSBjb21wb25lbnRzIGlzIHJlbWVtYmVyaW5nXG5cdCMgaG93IHRvIHVzZSB0aGVtIChwYXJ0aWN1bGFybHkgaWYgdGhleSBoYXZlIGxvdHMgb2YgY3VzdG9taXphYmxlXG5cdCMgcGFyYW1ldGVycykuIFNldHRpbmcgc2Vuc2libGUgZGVmYXVsdHMgbWFrZXMgaXQgd2F5IGVhc2llciB0byBnZXRcblx0IyBzdGFydGVkIChhbmQgcmVtZW1iZXIgaG93IHRvIHVzZSB0aGUgdGhpbmcgeW91IG1hZGUpXG5cdF8uZGVmYXVsdHMgcGFyYW1zLCBcblx0XHRuYW1lOiAnR2l2ZSBtZSBhIG5hbWUhJ1xuXHRcdHg6IDBcblx0XHR5OiAwXG5cdFx0ZW5hYmxlZDogdHJ1ZVxuXHRcdHNlbGVjdGVkOiB0cnVlXG5cdFx0aWNvbjogJ2NoZWNrJ1xuXHRcdHRleHRDb2xvcjogZGVmYXVsdHMudGludFxuXHRcdHN3aXRjaFRpbnQ6IGRlZmF1bHRzLnN3aXRjaFRpbnRcblx0XHRmaXJzdEl0ZW1Jbkxpc3Q6IHRydWUgIyBjb3VsZCBiZSBmaXJzdCBvciBsYXN0XG5cdFx0bGFzdEl0ZW1Jbkxpc3Q6IHRydWUgIyBjb3VsZCBiZSBmaXJzdCBvciBsYXN0XG5cdFx0XG5cdFx0IyBDb25zdGFudHNcblx0XHRzY3JlZW5XaWR0aDogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHR0YWJsZVJvd0hvcml6b250YWxQYWRkaW5nOiBkZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdFx0dGFibGVSb3dIZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0Ym9yZGVyQ29sb3I6IGRlZmF1bHRzLmxpbmVUaW50ICMgR3JleSByb3VuZGVkIHBpbGwgJiBib3JkZXJzIGJldHdlZW4gY2VsbHNcblxuXHQjIFNvbWUgb2YgdGhlIHZhbHVlcyBhcmUgYmFzZWQgb24gb3RoZXIgY29uc3RhbnRzLFxuXHQjIHNvIHlvdSBoYXZlIHRvIGNhbGN1bGF0ZSB0aGVtIGluIGEgc2Vjb25kIHBhc3Ncblx0c3dpdGNoQnV0dG9uUmFkaXVzID0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodC8yXG5cdHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyID0gMlxuXHRcdFxuXHQjIFRoaXMgaXMgdGhlIHJvb3Qgb2JqZWN0IGZvciB0aGlzIGVudGlyZSBjb21wb25lbnQuXG5cdCMgV2Ugd2lsbCBhdHRhY2ggYWxsIG91ciBmdW5jdGlvbnMgZGlyZWN0bHkgdG8gdGhpcyBsYXllclxuXHRAbGlzdEl0ZW1Db250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBwYXJhbXMueFxuXHRcdHk6IHBhcmFtcy55XG5cdFx0d2lkdGg6IFx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0Y2xpcDogZmFsc2Vcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kXG5cdEBsaXN0SXRlbUNvbnRhaW5lci5zdHlsZSA9IFxuXHRcdGJvcmRlclRvcDogXHRcdGlmIHBhcmFtcy5maXJzdEl0ZW1Jbkxpc3QgdGhlbiBcIjFweCBzb2xpZCBcIiArIHBhcmFtcy5ib3JkZXJDb2xvciBlbHNlIFwiXCJcblx0XHRib3JkZXJCb3R0b206IFx0aWYgcGFyYW1zLmxhc3RJdGVtSW5MaXN0IHRoZW4gXCIxcHggc29saWQgXCIgKyBwYXJhbXMuYm9yZGVyQ29sb3IgZWxzZSBcIlwiXG5cblx0IyBUaGVzZSB3aWxsIGJlIGFjY2Vzc2VkIHVzaW5nIGZ1bmN0aW9uc1xuXHRAZW5hYmxlZCA9IHBhcmFtcy5lbmFibGVkXG5cdEBzZWxlY3RlZCA9IHBhcmFtcy5zZWxlY3RlZFxuXHRcblx0QGxpc3RJdGVtID0gbmV3IExheWVyIFxuXHRcdHg6IHBhcmFtcy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdFx0d2lkdGg6IFx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0c3VwZXJMYXllcjogQGxpc3RJdGVtQ29udGFpbmVyXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcdFxuXHRAbGlzdEl0ZW0uc3R5bGUgPSBkZWZhdWx0cy5saXN0SXRlbVRleHRTdHlsZVxuXHRAbGlzdEl0ZW0uc3R5bGUgPVxuXHRcdGNvbG9yOiBwYXJhbXMudGV4dENvbG9yXG5cdFx0Ym9yZGVyVG9wOiBcdGlmIHBhcmFtcy5maXJzdEl0ZW1Jbkxpc3QgdGhlbiBcIlwiIGVsc2UgXCIxcHggc29saWQgXCIgKyBwYXJhbXMuYm9yZGVyQ29sb3JcblxuXHQjIFRoaXMgaXMgd2hlcmUgdGhlIGxhYmVsIG9mIHRoZSBsaXN0IGl0ZW0gbGl2ZXNcblx0QGxpc3RJdGVtLmh0bWwgPSBwYXJhbXMubmFtZSBcblxuXHQjIEFkZCB0aGUgY2hlY2ttYXJrIGZvciB0aGUgbGlzdFxuXHR0aGluZ1RvU3dpdGNoID0gc3dpdGNoXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnY2hlY2snIHRoZW4gbmV3IENoZWNrKClcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdjcm9zcycgdGhlbiBuZXcgQ3Jvc3MoKVxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ2NhcmV0JyB0aGVuIG5ldyBDYXJldCgpXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnc3dpdGNoJyB0aGVuIG5ldyBTd2l0Y2goKVxuXG5cdHRoaW5nVG9Td2l0Y2guc3VwZXJMYXllciA9IEBsaXN0SXRlbUNvbnRhaW5lclxuXHR0aGluZ1RvU3dpdGNoLnggPSBkZWZhdWx0cy5zY3JlZW5XaWR0aCAtIHRoaW5nVG9Td2l0Y2gud2lkdGggLSBkZWZhdWx0cy50YWJsZVJvd0hvcml6b250YWxQYWRkaW5nXG5cdHRoaW5nVG9Td2l0Y2guY2VudGVyWSgyKVxuIyBcdHRoaW5nVG9Td2l0Y2gueSA9IC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yIC0gdGhpbmdUb1N3aXRjaC5oZWlnaHQvMlxuXHRcblx0IyBNQUtFIElUIEFMTCBJTlRFUkFDVElWRVxuXHQjIE9uIGEgY2xpY2ssIGdvIHRvIHRoZSBuZXh0IHN0YXRlXG5cdGlmIHBhcmFtcy5pY29uID09ICdzd2l0Y2gnXG5cdFx0dGhpbmdUb1N3aXRjaC5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuc3dpdGNoKClcblx0ZWxzZSBcblx0XHRAbGlzdEl0ZW0ub24gRXZlbnRzLkNsaWNrLCA9PlxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLnN3aXRjaCgpXG5cblx0QGxpc3RJdGVtQ29udGFpbmVyLnN3aXRjaCA9ID0+XG5cdFx0aWYgQHNlbGVjdGVkIHRoZW4gQGxpc3RJdGVtQ29udGFpbmVyLmRlc2VsZWN0KCkgZWxzZSBAbGlzdEl0ZW1Db250YWluZXIuc2VsZWN0KClcblx0XHRcblx0QGxpc3RJdGVtQ29udGFpbmVyLnNlbGVjdCA9IChvcHRpb25zKSA9PlxuXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHtzdXByZXNzRXZlbnRzOiBmYWxzZX1cblx0XHRpZiBAZW5hYmxlZCBcblx0XHRcdHRoaW5nVG9Td2l0Y2guc2VsZWN0KClcblx0XHRcdEBzZWxlY3RlZCA9IHRydWVcblx0XHRpZiBvcHRpb25zLnN1cHJlc3NFdmVudHMgPT0gZmFsc2Vcblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5lbWl0IFwiRGlkQ2hhbmdlXCIsIHsgc2VsZWN0ZWQ6IEBzZWxlY3RlZCB9XG5cblx0QGxpc3RJdGVtQ29udGFpbmVyLmRlc2VsZWN0ID0gKG9wdGlvbnMpID0+XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge3N1cHJlc3NFdmVudHM6IGZhbHNlfVxuXHRcdGlmIEBlbmFibGVkIFxuXHRcdFx0dGhpbmdUb1N3aXRjaC5kZXNlbGVjdCgpXHRcdFxuXHRcdFx0QHNlbGVjdGVkID0gZmFsc2Vcblx0XHRpZiBvcHRpb25zLnN1cHJlc3NFdmVudHMgPT0gZmFsc2Vcblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5lbWl0IFwiRGlkQ2hhbmdlXCIsIHsgc2VsZWN0ZWQ6IEBzZWxlY3RlZCB9XG5cblx0QGxpc3RJdGVtQ29udGFpbmVyLnVwZGF0ZUxhYmVsID0gKG5ld1RleHQpID0+XG5cdFx0QGxpc3RJdGVtLmh0bWwgPSBuZXdUZXh0XG5cblx0QGxpc3RJdGVtQ29udGFpbmVyLnNlbGVjdGVkID0gKCkgPT5cblx0XHRyZXR1cm4gQHNlbGVjdGVkXG5cdFx0XHRcblx0QGxpc3RJdGVtQ29udGFpbmVyLnVwZGF0ZUxhYmVsKHBhcmFtcy5uYW1lKVxuXG5cdHJldHVybiBAbGlzdEl0ZW1Db250YWluZXJcblxuZXhwb3J0cy5UYWJsZVZpZXcgPSAocGFyYW1zKSAtPlxuXHRwYXJhbXMgPSBwYXJhbXMgb3Ige31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0eTogXHRcdDBcblx0XHR3aWR0aDpcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aXRlbXM6IFtcIkl0J3MganVzdCBtZSFcIl1cblx0XHRpY29uOiAnY2hlY2snXG5cdFx0dmFsaWRhdGlvbjogJ25vbmUnXG5cdFxuXHRAYnV0dG9uR3JvdXBDb250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6XHRcdHBhcmFtcy55XG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCAqIHBhcmFtcy5pdGVtcy5sZW5ndGhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJub25lXCJcblx0XHRcdFx0XHRcblx0QGJ1dHRvbkFycmF5ID0gW11cblx0Zm9yIGJ1dHRvbk5hbWUsIGkgaW4gcGFyYW1zLml0ZW1zXG5cdFx0Zmlyc3RJdGVtSW5MaXN0ID0gaWYgaSA9PSAwIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cdFx0bGFzdEl0ZW1Jbkxpc3QgPSBpZiBpID09IChwYXJhbXMuaXRlbXMubGVuZ3RoLTEpIHRoZW4gdHJ1ZSBlbHNlIGZhbHNlXG5cdFx0bmV3QnV0dG9uID0gbmV3IGV4cG9ydHMuVGFibGVWaWV3Um93KHtcblx0XHRcdHg6IDAsIFxuXHRcdFx0eTogaSpkZWZhdWx0cy50YWJsZVJvd0hlaWdodCwgXG5cdFx0XHRuYW1lOiBidXR0b25OYW1lLCBcblx0XHRcdGljb246IHBhcmFtcy5pY29uLFxuXHRcdFx0Zmlyc3RJdGVtSW5MaXN0OiBmaXJzdEl0ZW1Jbkxpc3QsXG5cdFx0XHRsYXN0SXRlbUluTGlzdDogbGFzdEl0ZW1Jbkxpc3Rcblx0XHR9KVxuXHRcdEBidXR0b25BcnJheS5wdXNoKG5ld0J1dHRvbilcblx0XHRuZXdCdXR0b24uc3VwZXJMYXllciA9IEBidXR0b25Hcm91cENvbnRhaW5lclxuXG5cdGF0dGFjaFJhZGlvQnV0dG9uVmFsaWRhdGlvbiA9IChidXR0b25BcnJheSkgPT5cblx0XHRidXR0b25Hcm91cENvbnRhaW5lciA9IEBidXR0b25Hcm91cENvbnRhaW5lclxuXHRcdGZvciBidXR0b25DbGlja2VkLCBpbmRleE9mQnV0dG9uQ2xpY2tlZCBpbiBidXR0b25BcnJheVxuXHRcdFx0YnV0dG9uQ2xpY2tlZC5kZXNlbGVjdCh7c3VwcmVzc0V2ZW50czogdHJ1ZX0pXG5cdFx0XHQjIENyZWF0ZXMgYSBjbG9zdXJlIHRvIHNhdmUgdGhlIGluZGV4IG9mIHRoZSBidXR0b24gd2UncmUgZGVhbGluZyB3aXRoXG5cdFx0XHRkbyAoYnV0dG9uQ2xpY2tlZCwgaW5kZXhPZkJ1dHRvbkNsaWNrZWQpIC0+IFxuXHRcdFx0XHQjIExpc3RlbiBmb3IgZXZlbnRzIGFuZCBjaGFuZ2Ugb3RoZXIgYnV0dG9ucyBpbiByZXNwb25zZVxuXHRcdFx0XHRidXR0b25DbGlja2VkLm9uICdEaWRDaGFuZ2UnLCAoZXZlbnQpID0+XG5cdFx0XHRcdFx0Zm9yIG90aGVyQnV0dG9uLCBvdGhlckJ1dHRvbkluZGV4IGluIGJ1dHRvbkFycmF5XG5cdFx0XHRcdFx0XHRpZiBvdGhlckJ1dHRvbkluZGV4ICE9IGluZGV4T2ZCdXR0b25DbGlja2VkXG5cdFx0XHRcdFx0XHRcdCMgRG8gc3R1ZmYgdG8gdGhlIG90aGVyIGJ1dHRvbnNcblx0XHRcdFx0XHRcdFx0b3RoZXJCdXR0b24uZGVzZWxlY3Qoe3N1cHByZXNzRXZlbnRzOiB0cnVlfSlcblx0XHRcdFx0XHRidXR0b25Hcm91cENvbnRhaW5lci5lbWl0IFwiRGlkQ2hhbmdlXCIsIHsgc2VsZWN0ZWQ6IGluZGV4T2ZCdXR0b25DbGlja2VkLCBudW1TZWxlY3RlZDogMSwgYnV0dG9uczogYnV0dG9uQXJyYXkgfVxuXG5cdGF0dGFjaERlZmF1bHRWYWxpZGF0aW9uID0gKGJ1dHRvbkFycmF5KSA9PlxuXHRcdCMgSnVzdCBlbWl0cyB0aGUgbmV3IHZhbHVlc1xuXHRcdGJ1dHRvbkdyb3VwQ29udGFpbmVyID0gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cdFx0Zm9yIGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkIGluIGJ1dHRvbkFycmF5XG5cdFx0XHRidXR0b25DbGlja2VkLmRlc2VsZWN0KHtzdXByZXNzRXZlbnRzOiB0cnVlfSlcblx0XHRcdCMgQ3JlYXRlcyBhIGNsb3N1cmUgdG8gc2F2ZSB0aGUgaW5kZXggb2YgdGhlIGJ1dHRvbiB3ZSdyZSBkZWFsaW5nIHdpdGhcblx0XHRcdGRvIChidXR0b25DbGlja2VkLCBpbmRleE9mQnV0dG9uQ2xpY2tlZCkgLT4gXG5cdFx0XHRcdCMgTGlzdGVuIGZvciBldmVudHMgYW5kIGNoYW5nZSBvdGhlciBidXR0b25zIGluIHJlc3BvbnNlXG5cdFx0XHRcdGJ1dHRvbkNsaWNrZWQub24gJ0RpZENoYW5nZScsIChldmVudCkgPT5cblx0XHRcdFx0XHRudW1TZWxlY3RlZCA9IDBcblx0XHRcdFx0XHR0YWJsZVZpZXdTdGF0ZXMgPSBbXVx0XHRcblx0XHRcdFx0XHRmb3IgYnV0dG9uIGluIGJ1dHRvbkFycmF5XG5cdFx0XHRcdFx0XHR0YWJsZVZpZXdTdGF0ZXMucHVzaChidXR0b24uc2VsZWN0ZWQoKSlcblx0XHRcdFx0XHRcdGlmIGJ1dHRvbi5zZWxlY3RlZCgpIHRoZW4gbnVtU2VsZWN0ZWQrK1xuXHRcdFx0XHRcdGJ1dHRvbkdyb3VwQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogdGFibGVWaWV3U3RhdGVzLCBudW1TZWxlY3RlZDogbnVtU2VsZWN0ZWQsIGJ1dHRvbnM6IGJ1dHRvbkFycmF5IH1cblxuXHRpZiBwYXJhbXMudmFsaWRhdGlvbiA9PSAncmFkaW8nXG5cdFx0YXR0YWNoUmFkaW9CdXR0b25WYWxpZGF0aW9uKEBidXR0b25BcnJheSlcblx0ZWxzZSBcblx0XHRhdHRhY2hEZWZhdWx0VmFsaWRhdGlvbihAYnV0dG9uQXJyYXkpXG5cdFx0XG5cdHJldHVybiBAYnV0dG9uR3JvdXBDb250YWluZXJcblxuXG5cbiMjI1xuXHRUQUJMRSBWSUVXIEhFQURFUlxuXHRJbiBpT1MsIHRoaXMgaXMgdHlwaWNhbGx5IGF0dGFjaGVkIHRvIHRoZSB0YWJsZSB2aWV3LCBcblx0YnV0IGl0J3MgaW5kZXBlbmRlbnQgaGVyZSBzbyB5b3UgY2FuIHB1dCBpdCB3aGVyZXZlciB5b3Ugd2FudC5cbiMjI1xuXG5leHBvcnRzLlRhYmxlVmlld0hlYWRlciA9IChwYXJhbXMpIC0+XG5cdHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHR0ZXh0OiAnSSBhbSBhIGRpdmlkZXInXG5cdFx0eDogMFxuXHRcdHk6IDBcblx0bGlzdERpdmlkZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBwYXJhbXMueCArIGRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0XHR5OiBwYXJhbXMueVxuXHRcdHdpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGJhY2tncm91bmRDb2xvcjogJ25vbmUnXG5cdGxpc3REaXZpZGVyLmh0bWwgPSBwYXJhbXMudGV4dFxuXHRsaXN0RGl2aWRlci5zdHlsZSA9IGRlZmF1bHRzLmRpdmlkZXJJdGVtVGV4dFN0eWxlXG5cdGxpc3REaXZpZGVyLnN0eWxlID0gXG5cdFx0Y29sb3I6IGRlZmF1bHRzLnRpbnRcblx0cmV0dXJuIGxpc3REaXZpZGVyXG5cblxuXG4jIyNcblx0UElDS0VSXG5cdEluIGlPUywgdGhpcyBpcyB0eXBpY2FsbHkgYXR0YWNoZWQgdG8gdGhlIHRhYmxlIHZpZXcsIFxuXHRidXQgaXQncyBpbmRlcGVuZGVudCBoZXJlIHNvIHlvdSBjYW4gcHV0IGl0IHdoZXJldmVyIHlvdSB3YW50LlxuIyMjXG5cblxuIyMgVXRpbGl0eSBmdW5jdGlvbnNcblxucXVhbnRpemUgPSAoaW5wdXQsIHN0ZXBTaXplKSAtPlxuXHRyZXR1cm4gTWF0aC5mbG9vcihpbnB1dC9zdGVwU2l6ZSkgKiBzdGVwU2l6ZVxuXG5cbiMjIFRoZSBpdGVtcyBpbiB0aGUgcGlja2VyXG5cbkRydW0gPSAocGFyZW50RHJ1bUxheWVyLCBkcnVtTmFtZSwgbGlzdEl0ZW1zLCBwYXJhbXMpIC0+XG5cdFxuXHQjIFNldHVwIHZhcmlhYmxlc1xuXHRAcGFyZW50RHJ1bUxheWVyID0gcGFyZW50RHJ1bUxheWVyXG5cdHBhcmFtcyA9IHBhcmFtcyB8fCB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHRlbmFibGVkOiB0cnVlXG5cdFx0eFBjdDogMCAgXHRcdFx0XHQjIDAgdG8gMVxuXHRcdHdpZHRoUGN0OiAxXHRcdFx0XHQjIDAgdG8gMVxuXHRcdHRleHRBbGlnbjogXCJjZW50ZXJcIlx0XHQjIGxlZnQsIGNlbnRlciwgcmlnaHRcblx0XHR0ZXh0UGFkZGluZzogXCIwXCJcblx0XHR0ZXh0Q29sb3I6IGRlZmF1bHRzLnRpbnRcblx0XG5cdCMgVmFsdWVzIGRlcml2ZWQgZnJvbSBwYXJhbXNcblx0ZHJ1bUNvbnRhaW5lckhlaWdodCA9IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KjVcblxuXHQjIFNldCB1cCBjb250ZW50IG9mIGxpc3QgXHRcdFxuXHRsaXN0SXRlbXMgPSBsaXN0SXRlbXNcblx0QG5hbWUgPSBkcnVtTmFtZVxuXHRAaW5kZXggPSAwXG5cdEB2YWwgPSBsaXN0SXRlbXNbQGluZGV4XVxuXHRAdmVsb2NpdHkgPSAwXG5cdGZpcnN0VG91Y2hBdmFpbGFibGUgPSB0cnVlICAgICMgaXMgdGhpcyB0aGUgZmlyc3QgdG91Y2ggaW4gYSBnaXZlbiBnZXN0dXJlP1xuXHRcblx0aW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlID0gMFxuXHRcblx0IyBDYWxjdWxhdGUgaGVpZ2h0IGFuZCB2ZXJ0aWNhbCBib3VuZHMgb2YgdGhlIGxpc3Rcblx0bGlzdE1pbllQb3MgXHQ9IC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdGxpc3RNYXhZUG9zIFx0PSAtbGlzdEl0ZW1zLmxlbmd0aCpkZWZhdWx0cy50YWJsZVJvd0hlaWdodCtkZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdGxpc3RIZWlnaHQgXHRcdD0gbGlzdEl0ZW1zLmxlbmd0aCpkZWZhdWx0cy50YWJsZVJvd0hlaWdodCArIGRydW1Db250YWluZXJIZWlnaHRcblxuXHRAZHJ1bUNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRcdFx0XHRwYXJhbXMueFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0eTogXHRcdFx0XHRcdDBcblx0XHR3aWR0aDogXHRcdFx0XHRwYXJhbXMud2lkdGhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogXHRcdFx0ZHJ1bUNvbnRhaW5lckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIm5vbmVcIlxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRwYXJlbnREcnVtTGF5ZXJcblx0XG5cdGxpc3RMYXllciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRcdFx0XHQwXG5cdFx0eTogXHRcdFx0XHRcdC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdFx0d2lkdGg6IFx0XHRcdFx0cGFyYW1zLndpZHRoUGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IFx0XHRcdGxpc3RIZWlnaHRcblx0XHRzdXBlckxheWVyOiBcdFx0QGRydW1Db250YWluZXJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJub25lXCJcblx0XG5cdCMgbGlzdExheWVyLnNjcm9sbCA9IHRydWVcblx0bGlzdExheWVyLmRyYWdnYWJsZS5lbmFibGVkID0gcGFyYW1zLmVuYWJsZWRcblx0bGlzdExheWVyLmRyYWdnYWJsZS5zcGVlZFggPSAwXG5cdFxuXHRmb3IgbGksIGkgaW4gbGlzdEl0ZW1zXG5cdFx0bGlzdEl0ZW1MYXllciA9IG5ldyBMYXllclxuXHRcdFx0eDogXHRcdFx0XHQwXG5cdFx0XHR5OiBcdFx0XHRcdGkgKiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCArIGRydW1Db250YWluZXJIZWlnaHQvMlxuXHRcdFx0d2lkdGg6IFx0XHRcdHBhcmFtcy53aWR0aFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0XHRoZWlnaHQ6IFx0XHRkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdFx0c3VwZXJMYXllcjogXHRsaXN0TGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCIjVXRpbHMucmFuZG9tQ29sb3IoKVxuXHRcdGxpc3RJdGVtTGF5ZXIuaHRtbCA9IGxpXG5cdFx0bGlzdEl0ZW1MYXllci5zdHlsZSA9XG5cdFx0XHRjb2xvcjogXHRcdFx0cGFyYW1zLnRleHRDb2xvclxuXHRcdFx0Zm9udEZhbWlseTogXHRkZWZhdWx0cy5waWNrZXJUZXh0U3R5bGUuZm9udEZhbWlseVxuXHRcdFx0Zm9udFdlaWdodDogXHRkZWZhdWx0cy5waWNrZXJUZXh0U3R5bGUuZm9udFdlaWdodFxuXHRcdFx0Zm9udFNpemU6IFx0XHRkZWZhdWx0cy5waWNrZXJUZXh0U3R5bGUuZm9udFNpemVcblx0XHRcdGxpbmVIZWlnaHQ6IFx0ZGVmYXVsdHMudGFibGVSb3dIZWlnaHQrXCJweFwiXG5cdFx0XHR0ZXh0QWxpZ246IFx0XHRwYXJhbXMudGV4dEFsaWduXG5cdFx0XHRwYWRkaW5nOiBcdFx0cGFyYW1zLnRleHRQYWRkaW5nXG5cblx0XHRsaXN0SXRlbUxheWVyLnN0YXJ0WSA9IGkgKiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCArIGRydW1Db250YWluZXJIZWlnaHQvMlxuXG5cdGxpc3RMYXllci5vbiBFdmVudHMuRHJhZ01vdmUsID0+XG5cdFx0aWYgZmlyc3RUb3VjaEF2YWlsYWJsZVxuXHRcdFx0QGRydW1Db250YWluZXIuZW1pdChcIkRydW1TdGFydGVkTW92aW5nXCIsIHtkcnVtOiBkcnVtTmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWwsIHZlbG9jaXR5OiAwfSlcblx0XHRcdGZpcnN0VG91Y2hBdmFpbGFibGUgPSBmYWxzZVx0XHRcblx0XHRcdFxuXHRcdHVwZGF0ZURydW1BcHBlYXJhbmNlKClcblx0XHRcblx0IyBUbyBzaW11bGF0ZSBpT1MgbW9tZW50dW0gc2Nyb2xsaW5nICh3aGljaCBjYXVzZXMgdGhlIGRydW0gdG8ga2VlcCBzcGlubmluZyBcblx0IyBhZnRlciB5b3VyIGZpbmdlciBsaWZ0cyBvZmYgaXQpLCB3ZSB0cmlnZ2VyIGFuIGFuaW1hdGlvbiB0aGUgbW9tZW50IHlvdSBsaWZ0XG5cdCMgeW91ciBmaW5nZXIuIFRoZSBpbnRlbnNpdHkgb2YgdGhpcyBhbmltYXRpb24gaXMgcHJvcG9ydGlvbmFsIHRvIHRoZSBzcGVlZCB3aGVuXG5cdCMgb2YgdGhlIGRyYWdnaW5nIHdoZW4geW91ciBmaW5nZXIgd2FzIGxpZnRlZC5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5EcmFnRW5kLCAoZSwgZikgPT5cblx0XHRcblx0XHQjIE5leHQgdG91Y2ggc2hvdWxkIHRyaWdnZXIgRHJ1bVN0YXJ0ZWRNb3Zpbmdcblx0XHRmaXJzdFRvdWNoQXZhaWxhYmxlID0gdHJ1ZVxuXHRcblx0XHQjIFRoaXMgY2FsY3VsYXRlcyB0aGUgYW5pbWF0aW9uXG5cdFx0c2Nyb2xsVmVsb2NpdHkgPSBsaXN0TGF5ZXIuZHJhZ2dhYmxlLmNhbGN1bGF0ZVZlbG9jaXR5KCkueVxuXHRcdHRpbWVBZnRlckRyYWcgPSAoMC41K01hdGguYWJzKHNjcm9sbFZlbG9jaXR5KjAuMikpLnRvRml4ZWQoMSlcblx0XHRmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSA9IHF1YW50aXplKGxpc3RMYXllci55ICsgc2Nyb2xsVmVsb2NpdHkqNDAwLCBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCkgKyBkZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yXG5cdFx0XG5cdFx0IyBBdCB0aGUgdG9wIGFuZCBib3R0b20sIHRoZSBtb21lbnR1bSBzaG91bGQgYmUgYWRqdXN0ZWQgc28gdGhlIFxuXHRcdCMgZmlyc3QgYW5kIGxhc3QgdmFsdWVzIG9uIHRoZSBkcnVtIGRvbid0IGdvIHRvbyBmYXIgb3V0IG9mIHZpZXdcblx0XHRkaXN0YW5jZVRvVHJhdmVsID0gZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gLSBsaXN0TGF5ZXIueVxuXHRcdGxpc3RIZWlnaHRXaXRob3V0RW5kQnVmZmVyID0gLWxpc3RJdGVtcy5sZW5ndGgqZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRib3R0b21PdmVyZmxvdyA9IE1hdGgubWF4KDAsIGxpc3RIZWlnaHRXaXRob3V0RW5kQnVmZmVyLWZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIClcblx0XHR0b3BPdmVyZmxvdyA9IE1hdGgubWF4KDAsIGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtIClcblx0XHRvdmVyZmxvd0RhbXBlbmluZyA9IDEwXG5cdFx0XG5cdFx0aWYgYm90dG9tT3ZlcmZsb3cgPiAwXG5cdFx0XHRmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSA9IGxpc3RIZWlnaHRXaXRob3V0RW5kQnVmZmVyIC0gKGJvdHRvbU92ZXJmbG93IC8gb3ZlcmZsb3dEYW1wZW5pbmcpXG5cdFx0XHRuZXdEaXN0YW5jZVRvVHJhdmVsID0gZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gLSBsaXN0TGF5ZXIueVxuXHRcdFx0dGltZUFmdGVyRHJhZyA9IHRpbWVBZnRlckRyYWcgKiAobmV3RGlzdGFuY2VUb1RyYXZlbC9kaXN0YW5jZVRvVHJhdmVsKVxuXG5cdFx0aWYgdG9wT3ZlcmZsb3cgPiAwXG5cdFx0XHRmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSA9IDQwICsgKHRvcE92ZXJmbG93IC8gb3ZlcmZsb3dEYW1wZW5pbmcpXG5cdFx0XHRuZXdEaXN0YW5jZVRvVHJhdmVsID0gZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gLSBsaXN0TGF5ZXIueVxuXHRcdFx0dGltZUFmdGVyRHJhZyA9IHRpbWVBZnRlckRyYWcgKiAobmV3RGlzdGFuY2VUb1RyYXZlbC9kaXN0YW5jZVRvVHJhdmVsKVxuXG5cdFx0IyBUcmlnZ2VyIHRoZSBhbmltYXRpb24sIGFuZCBzY2hlZHVsZSBhbiBldmVudCB0aGF0IHdpbGxcblx0XHQjIHRyaWdnZXIgd2hlbiB0aGUgZHJ1bSBmaW5hbGx5IHN0b3BzIHNwaW5uaW5nLlxuXHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHRcdFx0cHJvcGVydGllczoge3k6IGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtfVxuXHRcdFx0XHR0aW1lOiB0aW1lQWZ0ZXJEcmFnXG5cdFx0XHRcdGN1cnZlOiBcImVhc2Utb3V0XCJcblx0XHRcdH0pXG5cdFx0VXRpbHMuZGVsYXkgdGltZUFmdGVyRHJhZywgLT5cblx0XHRcdHN0b3BEcnVtKClcblxuXHQjIFRoaXMgZW5zdXJlcyB0aGF0IGR1cmluZyB0aGUgYW5pbWF0aW9uIG9mIHRoZSBsaXN0IGxheWVyLCB0aGUgZHJ1bSdzIGFwcGVhcmFuY2UgY29udGludWVzXG5cdCMgdG8gYmUgdXBkYXRlZC4gQmVjYXVzZSBtdWx0aXBsZSBhbmltYXRpb25zIGNvdWxkIG92ZXJsYXAsIHdlIGVuc3VyZSB0aGF0IGV2ZXJ5IG5ldyBhbmltYXRpb25cblx0IyBlbmRzIHRoZSBpbnRlcnZhbCBhbmQgc3RhcnRzIGEgbmV3IG9uZSBzbyB0aGF0IHdlIG5ldmVyIGhhdmUgbW9yZSB0aGFuIG9uZSBydW5uaW5nIFxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkFuaW1hdGlvblN0YXJ0LCAtPlxuXHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlKVxuXHRcdGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSA9IFV0aWxzLmludGVydmFsIDEvMzAsIHVwZGF0ZURydW1BcHBlYXJhbmNlICAgIFxuXG5cdGxpc3RMYXllci5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9Plx0XHRcblx0XHRjbGVhckludGVydmFsKGludGVydmFsVG91cGRhdGVEcnVtQXBwZWFyYW5jZSlcblxuXHRcdCMgRW1pdCBhZnRlciBhbGwgbW92ZW1lbnQgZW5kcyBpbiB0aGUgbGlzdFxuXHRcdEBkcnVtQ29udGFpbmVyLmVtaXQoXCJEcnVtRmluaXNoZWRDaGFuZ2luZ1wiLCB7bGlzdDogZHJ1bU5hbWUsIGluZGV4OiBAaW5kZXgsIHZhbHVlOiBAdmFsfSlcblxuXHR1cGRhdGVEcnVtQXBwZWFyYW5jZSA9ID0+XG5cdFx0aXRlbXNJbkRydW0gPSA0XG5cdFx0bGlzdFBvc2l0aW9uID0gbGlzdExheWVyLnkgLyAtZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgLSAwLjVcblx0XHRjYXBwZWRMaXN0UG9zaXRpb24gPSBNYXRoLm1heCgwLCBNYXRoLm1pbihsaXN0TGF5ZXIueSAvIC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodCAtIDAuNSwgbGlzdEl0ZW1zLmxlbmd0aCAtIDEpKVxuXHRcdGZvY3VzSXRlbSA9IE1hdGgucm91bmQoY2FwcGVkTGlzdFBvc2l0aW9uKVxuXHRcdGRpc3RhbmNlRnJvbU1pZGRsZSA9IE1hdGguYWJzKGZvY3VzSXRlbSAtIGNhcHBlZExpc3RQb3NpdGlvbilcblx0XHRmb3IgaSBpbiBbKGZvY3VzSXRlbS1pdGVtc0luRHJ1bSkuLihmb2N1c0l0ZW0raXRlbXNJbkRydW0pXVxuXHRcdFx0aWYgaSA+PSAwIGFuZCBpIDwgbGlzdEl0ZW1zLmxlbmd0aFxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLm9wYWNpdHkgPSAxIC0gTWF0aC5hYnMobGlzdFBvc2l0aW9uIC0gaSkvNSAtIChpZiAoaSAhPSBmb2N1c0l0ZW0pIHRoZW4gMC4zIGVsc2UgMClcblx0XHRcdFx0bGlzdExheWVyLnN1YkxheWVyc1tpXS5zY2FsZVkgPSAxIC0gTWF0aC5taW4oMSwgTWF0aC5hYnMobGlzdFBvc2l0aW9uIC0gaSkvNClcblx0XHRcdFx0bGlzdExheWVyLnN1YkxheWVyc1tpXS55ID0gbGlzdExheWVyLnN1YkxheWVyc1tpXS5zdGFydFkgLSAoaS1saXN0UG9zaXRpb24pKk1hdGguYWJzKGktbGlzdFBvc2l0aW9uKSoxMFxuXG5cdFx0IyBVcGRhdGUgdGhlIHZhbHVlIG9mIHRoZSBkcnVtIG9ubHkgd2hlbiBhIG5ldyB2YWx1ZSBpcyByZWFjaGVkXG5cdFx0aWYgKEBpbmRleCAhPSBmb2N1c0l0ZW0pXG5cdFx0XHR1cGRhdGVEcnVtVmFsdWVzKGZvY3VzSXRlbSlcblx0XHRcblx0c3RvcERydW0gPSA9Plx0XHRcblx0XHQjIEVuc3VyZSB0aGUgZHJ1bSBuZXZlciBlbmRzIG91dCBvZiBib3VuZHNcblx0XHRpZiBsaXN0TGF5ZXIueSA+IGxpc3RNaW5ZUG9zIFxuXHRcdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdCAgICBcdHByb3BlcnRpZXM6IHt5Omxpc3RNaW5ZUG9zfVxuXHRcdCAgICBcdGN1cnZlOiBcInNwcmluZyg0MDAsNTAsMClcIlxuXHRcdFx0fSlcblx0XHRpZiBsaXN0TGF5ZXIueSA8IGxpc3RNYXhZUG9zXG5cdFx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt5OiBsaXN0TWF4WVBvc31cblx0XHRcdFx0Y3VydmU6IFwic3ByaW5nKDQwMCw1MCwwKVwiXG5cdFx0XHR9KVxuXHRcblx0IyBVcGRhdGUgdGhlIHZhbHVlcyBvZiB0aGUgZHJ1bXMgYW5kIGludm9rZSB0aGUgY2FsbGJhY2sgXG5cdHVwZGF0ZURydW1WYWx1ZXMgPSAobmV3SW5kZXgpID0+XG5cdFx0QGluZGV4ID0gbmV3SW5kZXhcblx0XHRAdmFsID0gbGlzdEl0ZW1zW0BpbmRleF1cblx0XHRAZHJ1bUNvbnRhaW5lci5lbWl0KFwiRHJ1bURpZENoYW5nZVwiLCB7bGlzdDogZHJ1bU5hbWUsIGluZGV4OiBAaW5kZXgsIHZhbHVlOiBAdmFsfSlcblx0XG5cdCMgUmVuZGVyIGZvciB0aGUgZmlyc3QgdGltZVx0XHRcblx0dXBkYXRlRHJ1bUFwcGVhcmFuY2UoKVxuXHRcblx0QHNldEluZGV4ID0gKGluZGV4KSA9PlxuXHRcdHlQb3NpdGlvbkZvclRoaXNJbmRleCA9IC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodC8yIC0gKGluZGV4ICogZGVmYXVsdHMudGFibGVSb3dIZWlnaHQpXG5cdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eTogeVBvc2l0aW9uRm9yVGhpc0luZGV4fVxuXHRcdFx0XHR0aW1lOiAwLjVcblx0XHRcdFx0Y3VydmU6IFwiZWFzZS1vdXRcIlxuXHRcdFx0fSlcblxuXHRAc2V0VmFsdWUgPSAodmFsKSA9PlxuXHRcdGluZGV4ID0gbGlzdEl0ZW1zLmluZGV4T2YodmFsKVxuXHRcdGlmIGluZGV4ICE9IC0xXG5cdFx0XHRAc2V0SW5kZXgoaW5kZXgpXG5cblx0IyBSZXR1cm4gdGhlIGRydW0gb2JqZWN0IHNvIHdlIGNhbiBhY2Nlc3MgaXRzIHZhbHVlc1xuXHRyZXR1cm4gQFxuXG5cbiMjI1xuXHRQSUNLRVJcblx0VGhpcyBjb250YWlucyB0aGUgcGlja2VyIFxuIyMjIFxuZXhwb3J0cy5QaWNrZXIgPSAocGFyYW1zKSAtPlxuXHRcblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdDBcblx0XHR3aWR0aDpcdGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0ZGVmYXVsdFRleHQ6IFwiXCJcblx0XHR0ZXh0Q29sb3I6IGRlZmF1bHRzLnRpbnRcblxuXHRkcnVtQ29udGFpbmVySGVpZ2h0ID0gZGVmYXVsdHMudGFibGVSb3dIZWlnaHQqNVxuXG5cdEBwaWNrZXJDb250YWluZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0cGFyYW1zLnhcblx0XHR5Olx0XHRwYXJhbXMueVxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZHJ1bUNvbnRhaW5lckhlaWdodCs4OFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRkZWZhdWx0cy5pdGVtQmFja2dyb3VuZFxuXHRcdFx0XG5cdEBkcnVtID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0ODhcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRydW1Db250YWluZXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiXG5cdFx0c3VwZXJMYXllcjogQHBpY2tlckNvbnRhaW5lclx0XHRcblx0XHRcblx0QHNlbGVjdGVkSXRlbSA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdGRydW1Db250YWluZXJIZWlnaHQvMiAtIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcIm5vbmVcIlxuXHRcdHN1cGVyTGF5ZXI6IEBkcnVtXG5cblx0QHBpY2tlckNvbnRhaW5lci5waWNrZXJIZWFkZXIgPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHQwXG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0Olx0ODhcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kXG5cdFx0c3VwZXJMYXllcjogQHBpY2tlckNvbnRhaW5lclxuXHRcdFxuXHQjIFN0eWxlc1xuXHRAZHJ1bS5zdHlsZSA9XG5cdFx0cG9pbnRlckV2ZW50czogXCJub25lXCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIFwiICsgZGVmYXVsdHMubGluZVRpbnRcblx0XHRib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIFwiICsgZGVmYXVsdHMubGluZVRpbnRcblx0XG5cdEBzZWxlY3RlZEl0ZW0uc3R5bGUgPVxuXHRcdHBvaW50ZXJFdmVudHM6IFwibm9uZVwiXG5cdFx0Ym9yZGVyVG9wOiBcIjFweCBzb2xpZCByZ2JhKDAsMCwwLDAuMylcIlxuXHRcdGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgwLDAsMCwwLjMpXCJcblx0XHRcblx0QHBpY2tlckNvbnRhaW5lci5waWNrZXJIZWFkZXIuc3R5bGUgPSBkZWZhdWx0cy5saXN0SXRlbVRleHRTdHlsZVxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5zdHlsZSA9IFxuXHRcdGNvbG9yOiBwYXJhbXMudGV4dENvbG9yXG5cdFx0cGFkZGluZ0xlZnQ6IFwiMjBweFwiXG5cdFx0Ym9yZGVyVG9wOiBcIjFweCBzb2xpZCBcIiArIGRlZmF1bHRzLmxpbmVUaW50XG5cdFx0XHRcblx0QHBpY2tlckNvbnRhaW5lci5waWNrZXJIZWFkZXIuaHRtbCA9IHBhcmFtcy5kZWZhdWx0VGV4dFxuXHRcdFxuXHRcdFxuXHQjIEFkZCBkcnVtc1xuXHRAcGlja2VyQ29udGFpbmVyLmRydW1zID0gW11cblx0QHBpY2tlckNvbnRhaW5lci5kcnVtc0J5TmFtZSA9IHt9XG5cdFxuXHRwaWNrZXJTdGFydGVkTW92aW5nID0gKCk9PlxuXHRcdGRydW1WYWx1ZXMgPSB7fVxuXHRcdG5ld1ZhbHVlcyA9IGZvciBkcnVtIGluIEBwaWNrZXJDb250YWluZXIuZHJ1bXNcblx0XHRcdGRydW1WYWx1ZXNbZHJ1bS5uYW1lXSA9IHtpbmRleDogZHJ1bS5pbmRleCwgdmFsOiBkcnVtLnZhbCwgdmVsb2NpdHk6IDB9XHRcblx0XHRAcGlja2VyQ29udGFpbmVyLmVtaXQoXCJQaWNrZXJTdGFydGVkTW92aW5nXCIgKVxuXHRcdFxuXHRwaWNrZXJEaWRDaGFuZ2UgPSAoKT0+XG5cdFx0ZHJ1bVZhbHVlcyA9IHt9XG5cdFx0bmV3VmFsdWVzID0gZm9yIGRydW0gaW4gQHBpY2tlckNvbnRhaW5lci5kcnVtc1xuXHRcdFx0ZHJ1bVZhbHVlc1tkcnVtLm5hbWVdID0ge2luZGV4OiBkcnVtLmluZGV4LCB2YWw6IGRydW0udmFsfVxuXG5cdFx0QHBpY2tlckNvbnRhaW5lci5lbWl0KFwiUGlja2VyRGlkQ2hhbmdlXCIsIGRydW1WYWx1ZXMgKVxuXHRcblx0cGlja2VyRmluaXNoZWRDaGFuZ2luZyA9ICgpPT5cblx0XHRkcnVtVmFsdWVzID0ge31cblx0XHRuZXdWYWx1ZXMgPSBmb3IgZHJ1bSBpbiBAcGlja2VyQ29udGFpbmVyLmRydW1zXG5cdFx0XHRkcnVtVmFsdWVzW2RydW0ubmFtZV0gPSB7aW5kZXg6IGRydW0uaW5kZXgsIHZhbDogZHJ1bS52YWx9XG5cblx0XHRAcGlja2VyQ29udGFpbmVyLmVtaXQoXCJQaWNrZXJGaW5pc2hlZENoYW5naW5nXCIsIGRydW1WYWx1ZXMgKVx0XG5cdGlmIChwYXJhbXMuZHJ1bXMgYW5kIHBhcmFtcy5kcnVtcy5sZW5ndGggPiAwKVxuXHRcdGZvciBkcnVtIGluIHBhcmFtcy5kcnVtc1xuXHRcdFx0bmV3RHJ1bSA9IG5ldyBEcnVtKEBkcnVtLCBkcnVtLm5hbWUsIGRydW0uaXRlbXMsIGRydW0ucGFyYW1zKVxuXG5cdFx0XHQjIyBTdG9yZSBkcnVtcyBpbnNpZGUgdGhlIHBpY2tlclxuXHRcdFx0QHBpY2tlckNvbnRhaW5lci5kcnVtcy5wdXNoKG5ld0RydW0pXG5cdFx0XHRAcGlja2VyQ29udGFpbmVyLmRydW1zQnlOYW1lW2RydW0ubmFtZV0gPSBuZXdEcnVtIFxuXG5cdFx0XHQjIyBFbnN1cmUgdGhhdCBjaGFuZ2VzIHRvIHRoZSBkcnVtIGJ1YmJsZSB1cCB0byB0aGUgcGlja2VyXG5cdFx0XHRuZXdEcnVtLmRydW1Db250YWluZXIub24gXCJEcnVtRGlkQ2hhbmdlXCIsIHBpY2tlckRpZENoYW5nZVxuXHRcdFx0XG5cdFx0XHQjIyBFbWl0IGFuIGV2ZW50IHdoZW4gZHJ1bXMgc3RvcCBtb3ZpbmcgYWx0b2dldGhlclxuXHRcdFx0bmV3RHJ1bS5kcnVtQ29udGFpbmVyLm9uIFwiRHJ1bUZpbmlzaGVkQ2hhbmdpbmdcIiwgcGlja2VyRmluaXNoZWRDaGFuZ2luZ1xuXG5cdFx0XHQjIyBFbWl0IGFuIGV2ZW50IHdoZW4gbGlzdHMgc3RvcCBtb3ZpbmcgYWx0b2dldGhlclxuXHRcdFx0bmV3RHJ1bS5kcnVtQ29udGFpbmVyLm9uIFwiRHJ1bVN0YXJ0ZWRNb3ZpbmdcIiwgcGlja2VyU3RhcnRlZE1vdmluZ1xuXG5cblx0cmV0dXJuIEBwaWNrZXJDb250YWluZXJcbiIsIiMjI1xuXHR0YWJCYXJNb2R1bGVcblx04oCTXG5cdENyZWF0ZWQgYnkgUGV0dGVyIE5pbHNzb25cblx0aHR0cDovL3BldHRlci5wcm9cbiMjI1xuXG4jIERlZmF1bHQgc3R5bGVzXG5kZWZhdWx0cyA9IHtcblx0c2NyZWVuV2lkdGg6IFNjcmVlbi53aWR0aFxuXHRzY3JlZW5IZWlnaHQ6IFNjcmVlbi5oZWlnaHRcblx0YmFySGVpZ2h0OiA5OFxuXHRsYWJlbE9mZnNldDogLTI4XG5cdGljb25PZmZzZXQ6IC0xMlxuXHR0aW50Q29sb3I6IFwiIzAwN2FmZlwiXG5cdHRpbnRDb2xvclVuc2VsZWN0ZWQ6IFwiIzkyOTI5MlwiXG5cdGJsdXI6IDQwXG5cdG9wYWNpdHk6IDAuNzVcblx0Ym9yZGVyU2hhZG93OiBcIjBweCAtMXB4IDBweCAwcHggcmdiYSgwLDAsMCwwLjMyKVwiXG5cdGJhY2tncm91bmRDb2xvcjogXCIjZjhmOGY4XCJcblx0c2hvd0xhYmVsczogdHJ1ZVxuXHRiYWRnZVNpemU6IDM2XG5cdGJhZGdlQ29sb3I6IFwiI0ZGM0IzMFwiXG59XG5kZWZhdWx0cy5sYWJlbFRleHRTdHlsZSA9IHtcblx0Zm9udFNpemU6IFwiMjBweFwiXG5cdHRleHRBbGlnbjogXCJjZW50ZXJcIlxuXHRmb250RmFtaWx5OiBcIkhlbHZldGljYSBOZXVlJywgc2Fucy1zZXJpZlwiXG59XG5kZWZhdWx0cy5iYWRnZVRleHRTdHlsZSA9IHtcblx0Zm9udFNpemU6IFwiMjZweFwiXG5cdGxpbmVIZWlnaHQ6IFwiMzZweFwiXG5cdGNvbG9yOiBcIiNmZmZcIlxuXHR0ZXh0QWxpZ246IFwiY2VudGVyXCJcblx0Zm9udEZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZScsIHNhbnMtc2VyaWZcIlxufVxuZXhwb3J0cy5kZWZhdWx0cyA9IGRlZmF1bHRzXG5cblxuZ2V0SXRlbUZyb21OYW1lID0gKG5hbWUpIC0+XG5cdCMgUmV0dXJucyBhIHRhYiBiYXIgaXRlbSBpZiBuYW1lcyBtYXRjaGVzXG5cblx0Zm9yIGl0ZW0gaW4gQGl0ZW1zXG5cdFx0cmV0dXJuIGl0ZW0gaWYgaXRlbS5uYW1lIGlzIG5hbWVcblxuXG51cGRhdGVWaWV3cyA9IChzZWxlY3RlZEl0ZW0pIC0+XG5cdCMgU2hvd3MvaGlkZXMgdmlld3MgYmFzZWQgb24gc2VsZWN0ZWQgdGFiIGJhciBpdGVtXG5cblx0Zm9yIGl0ZW0gaW4gQGl0ZW1zXG5cdFx0aWYgaXRlbS52aWV3P1xuXHRcdFx0aWYgaXRlbS52aWV3IGlzIHNlbGVjdGVkSXRlbS52aWV3IHRoZW4gaXRlbS52aWV3LnZpc2libGUgPSB0cnVlIGVsc2UgaXRlbS52aWV3LnZpc2libGUgPSBmYWxzZVxuXHRcdFx0aWYgaXRlbS5ibHVyVmlldyBpcyBzZWxlY3RlZEl0ZW0uYmx1clZpZXcgdGhlbiBpdGVtLmJsdXJWaWV3LnZpc2libGUgPSB0cnVlIGVsc2UgaXRlbS5ibHVyVmlldy52aXNpYmxlID0gZmFsc2VcblxuXG5zZXRTZWxlY3RlZCA9IChuYW1lKSAtPlxuXHQjIFNldHMgc2VsZWN0ZWQgdGFiIGl0ZW0gZnJvbSB0aGUga2V5IChuYW1lKSB1c2VkIHdoZW4gY3JlYXRpbmcgaXRcblxuXHRpZiBuYW1lICE9IEBzZWxlY3RlZFxuXHRcdGZvciBpdGVtIGluIEBpdGVtc1xuXHRcdFx0aWYgaXRlbS5uYW1lIGlzIG5hbWVcblx0XHRcdFx0aXRlbS5pY29uTGF5ZXIuYmFja2dyb3VuZENvbG9yID0gZGVmYXVsdHMudGludENvbG9yXG5cdFx0XHRcdGl0ZW0ubGFiZWxMYXllci5zdHlsZSA9IFwiY29sb3JcIjogZGVmYXVsdHMudGludENvbG9yIGlmIGl0ZW0ubGFiZWxMYXllclxuXHRcdFx0XHRpdGVtLmljb25MYXllci5zdHlsZSA9IFwiLXdlYmtpdC1tYXNrLWltYWdlXCI6IFwidXJsKFwiICsgaXRlbS5pY29uTGF5ZXIuc2VsZWN0ZWRJY29uICsgXCIpXCIgaWYgaXRlbS5pY29uTGF5ZXIuc2VsZWN0ZWRJY29uXG5cdFx0XHRcdEBzZWxlY3RlZCA9IGl0ZW0ubmFtZVxuXHRcdFx0XHRAdXBkYXRlVmlld3MoaXRlbSlcblx0XHRcdFx0QC5lbWl0KFwidGFiQmFyRGlkU3dpdGNoXCIsIGl0ZW0ubmFtZSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXRlbS5pY29uTGF5ZXIuYmFja2dyb3VuZENvbG9yID0gZGVmYXVsdHMudGludENvbG9yVW5zZWxlY3RlZFxuXHRcdFx0XHRpdGVtLmxhYmVsTGF5ZXIuc3R5bGUgPSBcImNvbG9yXCI6IGRlZmF1bHRzLnRpbnRDb2xvclVuc2VsZWN0ZWQgaWYgaXRlbS5sYWJlbExheWVyXG5cdFx0XHRcdGl0ZW0uaWNvbkxheWVyLnN0eWxlID0gXCItd2Via2l0LW1hc2staW1hZ2VcIjogXCJ1cmwoXCIgKyBpdGVtLmljb25MYXllci5pY29uICsgXCIpXCIgaWYgaXRlbS5pY29uTGF5ZXIuc2VsZWN0ZWRJY29uXG5cblxuc2V0QmFkZ2VWYWx1ZSA9IChuYW1lLCB2YWx1ZSkgLT5cblx0IyBBZGRzIGEgYmFkZ2UgdG8gdGhlIHRhYiBpdGVtIGlmIHZhbHVlIGlzIGEgbnVtYmVyID4gMCBhbmQgcmVtb3ZlcyB0aGUgYmFkZ2UgaWYgbnVsbFxuXG5cdGZvciBpdGVtIGluIEBpdGVtc1xuXHRcdGlmIGl0ZW0ubmFtZSBpcyBuYW1lXG5cdFx0XHRpZiB2YWx1ZVxuXHRcdFx0XHRpdGVtLmJhZGdlTGF5ZXIuaHRtbCA9IHZhbHVlXG5cdFx0XHRcdGl0ZW0uYmFkZ2VMYXllci52aXNpYmxlID0gdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpdGVtLmJhZGdlTGF5ZXIudmlzaWJsZSA9IGZhbHNlXG5cblxuZXhwb3J0cy50YWJCYXIgPSAoYmFySXRlbXMpIC0+XG5cdCMgQ3JlYXRlcyBhbmQgc2V0LXVwcyB0aGUgdGFiIGJhclxuXG5cdHRhYkJhciA9IG5ldyBMYXllclxuXHRcdHg6IDBcblx0XHR5OiBkZWZhdWx0cy5zY3JlZW5IZWlnaHQgLSBkZWZhdWx0cy5iYXJIZWlnaHRcblx0XHR3aWR0aDogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLmJhckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuYmFja2dyb3VuZENvbG9yXG5cblx0dGFiQmFyLnN0eWxlID0gXCJib3gtc2hhZG93XCI6IGRlZmF1bHRzLmJvcmRlclNoYWRvd1xuXHR0YWJCYXIuZ2V0SXRlbUZyb21OYW1lID0gZ2V0SXRlbUZyb21OYW1lXG5cdHRhYkJhci51cGRhdGVWaWV3cyA9IHVwZGF0ZVZpZXdzXG5cdHRhYkJhci5zZXRTZWxlY3RlZCA9IHNldFNlbGVjdGVkXG5cdHRhYkJhci5zZXRCYWRnZVZhbHVlID0gc2V0QmFkZ2VWYWx1ZVxuXHR0YWJCYXIuc2VsZWN0ZWQgPSBudWxsXG5cdHRhYkJhci5pdGVtcyA9IFtdXG5cblx0YmFja2dyb3VuZCA9IG5ldyBMYXllclxuXHRcdHg6IDBcblx0XHR5OiAwXG5cdFx0d2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBkZWZhdWx0cy5iYXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGRlZmF1bHRzLmJhY2tncm91bmRDb2xvclxuXHRcdG9wYWNpdHk6IGRlZmF1bHRzLm9wYWNpdHlcblx0XHRzdXBlckxheWVyOiB0YWJCYXJcblxuXHRpdGVtQ291bnQgPSBPYmplY3Qua2V5cyhiYXJJdGVtcykubGVuZ3RoXG5cdGkgPSAwXG5cblx0Zm9yIG5hbWUscGFyYW1zIG9mIGJhckl0ZW1zXG5cdFx0aXRlbUxheWVyID0gbmV3IExheWVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiXG5cdFx0XHR3aWR0aDogZGVmYXVsdHMuc2NyZWVuV2lkdGggLyBpdGVtQ291bnRcblx0XHRcdGhlaWdodDogZGVmYXVsdHMuYmFySGVpZ2h0XG5cdFx0XHR4OiBpICogKGRlZmF1bHRzLnNjcmVlbldpZHRoIC8gaXRlbUNvdW50KVxuXHRcdFx0eTogMFxuXHRcdFx0c3VwZXJMYXllcjogdGFiQmFyXG5cdFx0XHRuYW1lOiBuYW1lXG5cblx0XHRpZiBwYXJhbXMudmlldz9cblx0XHRcdCMgQ3JlYXRlIGEgY29weSBvZiB0aGUgdmlldywgYmx1ciBpdCBhbmQgdXNlIGl0IGFzIGEgYmFja2dyb3VuZFxuXHRcdFx0Ymx1clZpZXcgPSBwYXJhbXMudmlldy5jb3B5KClcblx0XHRcdGlmIFNjcm9sbENvbXBvbmVudC5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihibHVyVmlldylcblx0XHRcdFx0Ymx1clZpZXcuY29udGVudC5ibHVyID0gZGVmYXVsdHMuYmx1clxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRibHVyVmlldy5ibHVyID0gZGVmYXVsdHMuYmx1clxuXHRcdFx0Ymx1clZpZXcuc3VwZXJMYXllciA9IHRhYkJhclxuXHRcdFx0Ymx1clZpZXcuaW5kZXggPSAwXG5cdFx0XHRibHVyVmlldy55ID0gYmx1clZpZXcueSAtIChkZWZhdWx0cy5zY3JlZW5IZWlnaHQgLSBkZWZhdWx0cy5iYXJIZWlnaHQpXG5cblx0XHRcdGl0ZW1MYXllci52aWV3ID0gcGFyYW1zLnZpZXdcblx0XHRcdGl0ZW1MYXllci5ibHVyVmlldyA9IGJsdXJWaWV3XG5cblx0XHRpY29uTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdHdpZHRoOiA2MFxuXHRcdFx0aGVpZ2h0OiA2MFxuXHRcdFx0c3VwZXJMYXllcjogaXRlbUxheWVyXG5cdFx0aWNvbkxheWVyLmljb24gPSBwYXJhbXMuaWNvblxuXHRcdGljb25MYXllci5zZWxlY3RlZEljb24gPSBwYXJhbXMuc2VsZWN0ZWRJY29uIGlmIHBhcmFtcy5zZWxlY3RlZEljb24/XG5cblx0XHQjIFRoaXMgYmxhY2sgbWFnaWMgaXMgdXNlZCB0byB0aW50IHRoZSBQTkcgaW1hZ2VzLiBPbmx5IHdvcmtzIG9uIHdlYmtpdCBicm93c2VycyA6L1xuXHRcdGljb25MYXllci5zdHlsZSA9XG5cdFx0XHRcIi13ZWJraXQtbWFzay1pbWFnZVwiOiBcInVybChcIiArIGljb25MYXllci5pY29uICsgXCIpXCJcblx0XHRcdFwiLXdlYmtpdC1tYXNrLXJlcGVhdFwiOiBcIm5vLXJlcGVhdFwiXG5cdFx0XHRcIi13ZWJraXQtbWFzay1wb3NpdGlvblwiOiBcImNlbnRlciBjZW50ZXJcIlxuXHRcdGljb25MYXllci5jZW50ZXJYKClcblx0XHRpY29uTGF5ZXIuY2VudGVyWShkZWZhdWx0cy5pY29uT2Zmc2V0KVxuXHRcdGl0ZW1MYXllci5pY29uTGF5ZXIgPSBpY29uTGF5ZXJcblxuXHRcdGlmIGRlZmF1bHRzLnNob3dMYWJlbHNcblx0XHRcdGxhYmVsTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdFx0d2lkdGg6IGl0ZW1MYXllci53aWR0aFxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IGRlZmF1bHRzLmJhckhlaWdodCArIGRlZmF1bHRzLmxhYmVsT2Zmc2V0XG5cdFx0XHRcdHN1cGVyTGF5ZXI6IGl0ZW1MYXllclxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiXG5cdFx0XHRsYWJlbExheWVyLmh0bWwgPSBuYW1lXG5cdFx0XHRsYWJlbExheWVyLnN0eWxlID0gZGVmYXVsdHMubGFiZWxUZXh0U3R5bGVcblx0XHRcdGl0ZW1MYXllci5sYWJlbExheWVyID0gbGFiZWxMYXllclxuXG5cdFx0YmFkZ2VMYXllciA9IG5ldyBMYXllclxuXHRcdFx0d2lkdGg6IGRlZmF1bHRzLmJhZGdlU2l6ZVxuXHRcdFx0aGVpZ2h0OiBkZWZhdWx0cy5iYWRnZVNpemVcblx0XHRcdHg6IDBcblx0XHRcdHk6IDZcblx0XHRcdGJvcmRlclJhZGl1czogMThcblx0XHRcdHN1cGVyTGF5ZXI6IGl0ZW1MYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBkZWZhdWx0cy5iYWRnZUNvbG9yXG5cdFx0YmFkZ2VMYXllci5zdHlsZSA9IGRlZmF1bHRzLmJhZGdlVGV4dFN0eWxlXG5cdFx0YmFkZ2VMYXllci5jZW50ZXJYKDI2KVxuXG5cdFx0aXRlbUxheWVyLmJhZGdlTGF5ZXIgPSBiYWRnZUxheWVyXG5cdFx0aXRlbUxheWVyLmJhZGdlTGF5ZXIudmlzaWJsZSA9IGZhbHNlXG5cblx0XHR0YWJCYXIuaXRlbXMucHVzaChpdGVtTGF5ZXIpXG5cblx0XHRpdGVtTGF5ZXIub24gRXZlbnRzLkNsaWNrLCAtPlxuXHRcdFx0dGFiQmFyLnNldFNlbGVjdGVkKEBuYW1lKVxuXG5cdFx0aSsrXG5cblx0IyBTZWxlY3QgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIHRhYiBiYXJcblx0dGFiQmFyLnNldFNlbGVjdGVkKHRhYkJhci5pdGVtc1swXS5uYW1lKVxuXG5cdHJldHVybiB0YWJCYXJcbiIsImV4cG9ydHMuYmcgPSBuZXcgQmFja2dyb3VuZExheWVyXG5cdGJhY2tncm91bmRDb2xvcjpcIiNmZmZcIlxuXHRuYW1lOiAnYmcnXG5cbmV4cG9ydHMudGl0bGUgPSBuZXcgTGF5ZXJcblx0YmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXG5cdGh0bWw6ICdGcmFtZXIgU2NhZmZvbGQsPGJyPiBxdWljayBzdGFydCB3aXRoIGJhc2ljIG1vZHVsZXMuJ1xuXHRzdHlsZToge1xuXHRcdCdjb2xvcic6ICdzbGF0ZWdyYXknLFxuXHRcdCd0ZXh0LWFsaWduJzogJ2NlbnRlcicsXG5cdFx0J2ZvbnQtZmFtaWx5JzogJ1NhbiBGcmFuY2lzY28gRGlzcGxheScsXG5cdFx0J2ZvbnQtd2VpZ2h0JzogJzUwMCcsXG5cdFx0J2ZvbnQtc2l6ZSc6ICc0OHB4Jyxcblx0XHQnbGluZS1oZWlnaHQnOiAnMTIwJScsXG5cdFx0J3BhZGRpbmcnOiAnMTBweCd9XG5cdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0aGVpZ2h0OiA0MDBcblx0eTogMzAwXG5cdG5hbWU6ICd0aXRsZSdcblxuZXhwb3J0cy5zcGFyayA9IG5ldyBMYXllclxuXHRpbWFnZTogXCJpbWFnZXMvZmxhdC1zcGFyay5wbmdcIlxuXHRzY2FsZTogMi41XG5cdG5hbWU6ICdzcGFyaydcblxuZXhwb3J0cy5zcGFyay5jZW50ZXIoKVxuIl19
