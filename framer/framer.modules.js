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
var spark, title;

title = new Layer({
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

spark = new Layer({
  image: "images/flat-spark.png",
  scale: 2.5
});

spark.center();



},{}]},{},[])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvemFjaGFyeS9SZXBvcy9mcmFtZXJTY2FmZm9sZC5mcmFtZXIvbW9kdWxlcy9WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIuY29mZmVlIiwiL1VzZXJzL3phY2hhcnkvUmVwb3MvZnJhbWVyU2NhZmZvbGQuZnJhbWVyL21vZHVsZXMvZnJhbWVyS2l0LmNvZmZlZSIsIi9Vc2Vycy96YWNoYXJ5L1JlcG9zL2ZyYW1lclNjYWZmb2xkLmZyYW1lci9tb2R1bGVzL3RhYkJhck1vZHVsZS5jb2ZmZWUiLCIvVXNlcnMvemFjaGFyeS9SZXBvcy9mcmFtZXJTY2FmZm9sZC5mcmFtZXIvbW9kdWxlcy93ZWxjb21lU2NyZWVuLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7NkJBQUE7O0FBQUEsT0FBYSxDQUFDO0FBR2IsTUFBQSxvR0FBQTs7QUFBQSw4Q0FBQSxDQUFBOztBQUFBLEVBQUEsaUJBQUEsR0FBb0IsYUFBcEIsQ0FBQTs7QUFBQSxFQUNBLG9CQUFBLEdBQXVCLGdCQUR2QixDQUFBOztBQUFBLEVBRUEsaUJBQUEsR0FDQztBQUFBLElBQUEsSUFBQSxFQUFNLEdBQU47QUFBQSxJQUNBLEtBQUEsRUFBTyxhQURQO0dBSEQsQ0FBQTs7QUFBQSxFQUtBLGlCQUFBLEdBQ0M7QUFBQSxJQUFBLENBQUEsRUFBRyxDQUFIO0FBQUEsSUFDQSxDQUFBLEVBQUcsRUFESDtBQUFBLElBRUEsS0FBQSxFQUFPLEVBRlA7QUFBQSxJQUdBLE1BQUEsRUFBUSxFQUhSO0dBTkQsQ0FBQTs7QUFBQSxFQVVBLElBQUEsR0FDQztBQUFBLElBQUEsRUFBQSxFQUFRLFFBQVI7QUFBQSxJQUNBLElBQUEsRUFBUSxVQURSO0FBQUEsSUFFQSxJQUFBLEVBQVEsVUFGUjtBQUFBLElBR0EsS0FBQSxFQUFRLFdBSFI7QUFBQSxJQUlBLE1B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TU4sYUFBQSxFQUFlLE1BTlQ7QUFBQSxJQU9OLFNBQUEsRUFBVyxNQVBMO0dBRlA7QUFBQSxFQVVBLEtBQUEsRUFBTyxNQUFNLENBQUMsS0FWZDtBQUFBLEVBV0EsTUFBQSxFQUFRLEdBWFI7QUFBQSxFQVlBLENBQUEsRUFBRyxHQVpIO0NBRFcsQ0FBWixDQUFBOztBQUFBLEtBaUJBLEdBQVksSUFBQSxLQUFBLENBQ1g7QUFBQSxFQUFBLEtBQUEsRUFBTyx1QkFBUDtBQUFBLEVBQ0EsS0FBQSxFQUFPLEdBRFA7Q0FEVyxDQWpCWixDQUFBOztBQUFBLEtBcUJLLENBQUMsTUFBTixDQUFBLENBckJBLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgZXhwb3J0cy5WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIgZXh0ZW5kcyBMYXllclxuXG5cdCMgU2V0dXAgQ2xhc3MgQ29uc3RhbnRzXG5cdElOSVRJQUxfVklFV19OQU1FID0gXCJpbml0aWFsVmlld1wiXG5cdEJBQ0tCVVRUT05fVklFV19OQU1FID0gXCJ2bmMtYmFja0J1dHRvblwiXG5cdEFOSU1BVElPTl9PUFRJT05TID1cblx0XHR0aW1lOiAwLjNcblx0XHRjdXJ2ZTogXCJlYXNlLWluLW91dFwiXG5cdEJBQ0tfQlVUVE9OX0ZSQU1FID1cblx0XHR4OiAwXG5cdFx0eTogNDBcblx0XHR3aWR0aDogODhcblx0XHRoZWlnaHQ6IDg4XG5cdFBVU0ggPVxuXHRcdFVQOiAgICAgXCJwdXNoVXBcIlxuXHRcdERPV046ICAgXCJwdXNoRG93blwiXG5cdFx0TEVGVDogICBcInB1c2hMZWZ0XCJcblx0XHRSSUdIVDogIFwicHVzaFJpZ2h0XCJcblx0XHRDRU5URVI6IFwicHVzaENlbnRlclwiXG5cdERJUiA9XG5cdFx0VVA6ICAgIFwidXBcIlxuXHRcdERPV046ICBcImRvd25cIlxuXHRcdExFRlQ6ICBcImxlZnRcIlxuXHRcdFJJR0hUOiBcInJpZ2h0XCJcblx0REVCVUdfTU9ERSA9IGZhbHNlXG5cblx0IyBTZXR1cCBJbnN0YW5jZSBhbmQgSW5zdGFuY2UgVmFyaWFibGVzXG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cblx0XHRAdmlld3MgPSBAaGlzdG9yeSA9IEBpbml0aWFsVmlldyA9IEBjdXJyZW50VmlldyA9IEBwcmV2aW91c1ZpZXcgPSBAYW5pbWF0aW9uT3B0aW9ucyA9IEBpbml0aWFsVmlld05hbWUgPSBudWxsXG5cdFx0QG9wdGlvbnMud2lkdGggICAgICAgICAgID89IFNjcmVlbi53aWR0aFxuXHRcdEBvcHRpb25zLmhlaWdodCAgICAgICAgICA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0QG9wdGlvbnMuY2xpcCAgICAgICAgICAgID89IHRydWVcblx0XHRAb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCIjOTk5XCJcblxuXHRcdHN1cGVyIEBvcHRpb25zXG5cblx0XHRAdmlld3MgICA9IFtdXG5cdFx0QGhpc3RvcnkgPSBbXVxuXHRcdEBhbmltYXRpb25PcHRpb25zID0gQG9wdGlvbnMuYW5pbWF0aW9uT3B0aW9ucyBvciBBTklNQVRJT05fT1BUSU9OU1xuXHRcdEBpbml0aWFsVmlld05hbWUgID0gQG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lICBvciBJTklUSUFMX1ZJRVdfTkFNRVxuXHRcdEBiYWNrQnV0dG9uRnJhbWUgID0gQG9wdGlvbnMuYmFja0J1dHRvbkZyYW1lICBvciBCQUNLX0JVVFRPTl9GUkFNRVxuXHRcdEBkZWJ1Z01vZGUgICAgICAgID0gQG9wdGlvbnMuZGVidWdNb2RlICAgICAgICBvciBERUJVR19NT0RFXG5cblx0XHRALm9uIFwiY2hhbmdlOnN1YkxheWVyc1wiLCAoY2hhbmdlTGlzdCkgLT5cblx0XHRcdEBhZGRWaWV3IHN1YkxheWVyLCB0cnVlIGZvciBzdWJMYXllciBpbiBjaGFuZ2VMaXN0LmFkZGVkXG5cblx0YWRkVmlldzogKHZpZXcsIHZpYUludGVybmFsQ2hhbmdlRXZlbnQpIC0+XG5cblx0XHR2bmNXaWR0aCAgPSBAb3B0aW9ucy53aWR0aFxuXHRcdHZuY0hlaWdodCA9IEBvcHRpb25zLmhlaWdodFxuXG5cdFx0dmlldy5zdGF0ZXMuYWRkKFxuXHRcdFx0XCIjeyBQVVNILlVQIH1cIjpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAtdm5jSGVpZ2h0XG5cdFx0XHRcIiN7IFBVU0guTEVGVCB9XCI6XG5cdFx0XHRcdHg6IC12bmNXaWR0aFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcIiN7IFBVU0guQ0VOVEVSIH1cIjpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcIiN7IFBVU0guUklHSFQgfVwiOlxuXHRcdFx0XHR4OiB2bmNXaWR0aFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcIiN7IFBVU0guRE9XTiB9XCI6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogdm5jSGVpZ2h0XG5cdFx0KVxuXG5cblx0XHR2aWV3LnN0YXRlcy5hbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnNcblxuXHRcdGlmIHZpZXcubmFtZSBpcyBAaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRAaW5pdGlhbFZpZXcgPSB2aWV3XG5cdFx0XHRAY3VycmVudFZpZXcgPSB2aWV3XG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guQ0VOVEVSXG5cdFx0XHRAaGlzdG9yeS5wdXNoIHZpZXdcblx0XHRlbHNlXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guUklHSFRcblxuXHRcdHVubGVzcyB2aWV3LnN1cGVyTGF5ZXIgaXMgQCBvciB2aWFJbnRlcm5hbENoYW5nZUV2ZW50XG5cdFx0XHR2aWV3LnN1cGVyTGF5ZXIgPSBAXG5cblx0XHRAX2FwcGx5QmFja0J1dHRvbiB2aWV3IHVubGVzcyB2aWV3Lm5hbWUgaXMgQGluaXRpYWxWaWV3TmFtZVxuXG5cdFx0QHZpZXdzLnB1c2ggdmlld1xuXG5cdHRyYW5zaXRpb246ICh2aWV3LCBkaXJlY3Rpb24gPSBESVIuUklHSFQsIHN3aXRjaEluc3RhbnQgPSBmYWxzZSwgcHJldmVudEhpc3RvcnkgPSBmYWxzZSkgLT5cblxuXHRcdHJldHVybiBmYWxzZSBpZiB2aWV3IGlzIEBjdXJyZW50Vmlld1xuXG5cdFx0IyBTZXR1cCBWaWV3cyBmb3IgdGhlIHRyYW5zaXRpb25cblxuXHRcdGlmIGRpcmVjdGlvbiBpcyBESVIuUklHSFRcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guUklHSFRcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guTEVGVFxuXHRcdGVsc2UgaWYgZGlyZWN0aW9uIGlzIERJUi5ET1dOXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILkRPV05cblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guVVBcblx0XHRlbHNlIGlmIGRpcmVjdGlvbiBpcyBESVIuTEVGVFxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5MRUZUXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILlJJR0hUXG5cdFx0ZWxzZSBpZiBkaXJlY3Rpb24gaXMgRElSLlVQXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILlVQXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILkRPV05cblx0XHRlbHNlXG5cdFx0XHQjIElmIHRoZXkgc3BlY2lmaWVkIHNvbWV0aGluZyBkaWZmZXJlbnQganVzdCBzd2l0Y2ggaW1tZWRpYXRlbHlcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5DRU5URVJcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBQVVNILkxFRlRcblxuXHRcdCMgUHVzaCB2aWV3IHRvIENlbnRlclxuXHRcdHZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILkNFTlRFUlxuXHRcdCMgY3VycmVudFZpZXcgaXMgbm93IG91ciBwcmV2aW91c1ZpZXdcblx0XHRAcHJldmlvdXNWaWV3ID0gQGN1cnJlbnRWaWV3XG5cdFx0IyBTZXQgb3VyIGN1cnJlbnRWaWV3IHRvIHRoZSB2aWV3IHdlJ3JlIGJyaW5naW5nIGluXG5cdFx0QGN1cnJlbnRWaWV3ID0gdmlld1xuXG5cdFx0IyBTdG9yZSB0aGUgbGFzdCB2aWV3IGluIGhpc3Rvcnlcblx0XHRAaGlzdG9yeS5wdXNoIEBwcmV2aW91c1ZpZXcgaWYgcHJldmVudEhpc3RvcnkgaXMgZmFsc2VcblxuXHRcdEBlbWl0IEV2ZW50cy5DaGFuZ2VcblxuXHRyZW1vdmVCYWNrQnV0dG9uOiAodmlldykgLT5cblx0XHRVdGlscy5kZWxheSAwLCA9PlxuXHRcdFx0dmlldy5zdWJMYXllcnNCeU5hbWUoQkFDS0JVVFRPTl9WSUVXX05BTUUpWzBdLnZpc2libGUgPSBmYWxzZVxuXG5cdGJhY2s6ICgpIC0+XG5cdFx0QHRyYW5zaXRpb24oQF9nZXRMYXN0SGlzdG9yeUl0ZW0oKSwgZGlyZWN0aW9uID0gRElSLkxFRlQsIHN3aXRjaEluc3RhbnQgPSBmYWxzZSwgcHJldmVudEhpc3RvcnkgPSB0cnVlKVxuXHRcdEBoaXN0b3J5LnBvcCgpXG5cblx0X2dldExhc3RIaXN0b3J5SXRlbTogKCkgLT5cblx0XHRyZXR1cm4gQGhpc3RvcnlbQGhpc3RvcnkubGVuZ3RoIC0gMV1cblxuXHRfYXBwbHlCYWNrQnV0dG9uOiAodmlldywgZnJhbWUgPSBAYmFja0J1dHRvbkZyYW1lKSAtPlxuXHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdFx0XHRpZiB2aWV3LmJhY2tCdXR0b24gaXNudCBmYWxzZVxuXHRcdFx0XHRiYWNrQnV0dG9uID0gbmV3IExheWVyXG5cdFx0XHRcdFx0bmFtZTogQkFDS0JVVFRPTl9WSUVXX05BTUVcblx0XHRcdFx0XHR3aWR0aDogODBcblx0XHRcdFx0XHRoZWlnaHQ6IDgwXG5cdFx0XHRcdFx0c3VwZXJMYXllcjogdmlld1xuXG5cdFx0XHRcdGlmIEBkZWJ1Z01vZGUgaXMgZmFsc2Vcblx0XHRcdFx0XHRiYWNrQnV0dG9uLmJhY2tncm91bmRDb2xvciA9IFwidHJhbnNwYXJlbnRcIlxuXG5cdFx0XHRcdGJhY2tCdXR0b24uZnJhbWUgPSBmcmFtZVxuXG5cdFx0XHRcdGJhY2tCdXR0b24ub24gRXZlbnRzLkNsaWNrLCA9PlxuXHRcdFx0XHRcdEBiYWNrKClcblxuXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jIFVTQUdFIEVYQU1QTEUgMSAtIERlZmluZSBJbml0aWFsVmlld05hbWUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4jIGluaXRpYWxWaWV3S2V5ID0gXCJ2aWV3MVwiXG4jXG4jIHZuYyA9IG5ldyBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIgaW5pdGlhbFZpZXdOYW1lOiBpbml0aWFsVmlld0tleVxuIyB2aWV3MSA9IG5ldyBMYXllclxuIyBcdG5hbWU6IGluaXRpYWxWaWV3S2V5XG4jIFx0d2lkdGg6ICBTY3JlZW4ud2lkdGhcbiMgXHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcbiMgXHRiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCJcbiMgXHRzdXBlckxheWVyOiB2bmNcblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgVVNBR0UgRVhBTVBMRSAyIC0gVXNlIGRlZmF1bHQgaW5pdGlhbFZpZXdOYW1lIFwiaW5pdGlhbFZpZXdcIiAjIyMjIyMjIyMjIyMjIyMjIyNcblxuIyB2bmMgPSBuZXcgVmlld05hdmlnYXRpb25Db250cm9sbGVyXG5cbiMgdmlldzEgPSBuZXcgTGF5ZXJcbiMgXHRuYW1lOiBcImluaXRpYWxWaWV3XCJcbiMgXHR3aWR0aDogIFNjcmVlbi53aWR0aFxuIyBcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuIyBcdGJhY2tncm91bmRDb2xvcjogXCJyZWRcIlxuIyBcdHN1cGVyTGF5ZXI6IHZuY1xuXG4jIHZpZXcyID0gbmV3IExheWVyXG4jIFx0d2lkdGg6ICBTY3JlZW4ud2lkdGhcbiMgXHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcbiMgXHRiYWNrZ3JvdW5kQ29sb3I6IFwiZ3JlZW5cIlxuIyBcdHN1cGVyTGF5ZXI6IHZuY1xuXG4jIHZpZXcxLm9uIEV2ZW50cy5DbGljaywgLT4gdm5jLnRyYW5zaXRpb24gdmlldzJcbiMgdmlldzIub24gRXZlbnRzLkNsaWNrLCAtPiB2bmMuYmFjaygpXG4iLCIjIyNcbiAgRnJhbWVyS2l0IGZvciBGcmFtZXJcbiAgaHR0cHM6Ly9naXRodWIuY29tL3JhcGhkYW1pY28vZnJhbWVyS2l0XG5cbiAgQ29weXJpZ2h0IChjKSAyMDE1LCBSYXBoIEQnQW1pY28gaHR0cDovL3JhcGhkYW1pY28uY29tIChAcmFwaGRhbWljbylcbiAgTUlUIExpY2Vuc2VcblxuICBSZWFkbWU6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXBoZGFtaWNvL2ZyYW1lcktpdFxuXG4gIExpY2Vuc2U6XG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9yYXBoZGFtaWNvL2ZyYW1lcktpdC9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4jIyNcblxuXG5cblxuIyMjXG5cdERFRkFVTFQgU1RZTEVTXG5cdE5vdGUgdGhlIHNjcmVlbndpZHRoIGNvbnN0YW50OiB0aGlzIGlzIHByb2JhYmx5IG9uZSBvZiB0aGVcblx0Zmlyc3QgdGhpbmdzIHlvdSB3YW50IHRvIGNoYW5nZSBzbyBpdCBtYXRjaGVzIHRoZSBkZXZpY2Vcblx0eW91J3JlIHByb3RvdHlwaW5nIG9uLlxuIyMjXG5kZWZhdWx0cyA9IHtcblx0c2NyZWVuV2lkdGg6IDc1MFxufVxuXG4jIyNcblx0TU9SRSBTVFlMRVNcbiMjI1xuZGVmYXVsdHMudGFibGVSb3dIZWlnaHQgPSA4OFxuZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZyA9IDIwXG5kZWZhdWx0cy50aW50ID0gJ2dyZXknXG5kZWZhdWx0cy5saW5lVGludCA9IFwicmdiYSgyMDAsMjAwLDIwMCwxKVwiXG5kZWZhdWx0cy5zd2l0Y2hUaW50ID0gJyMxREMyNEInXG5kZWZhdWx0cy5pdGVtQmFja2dyb3VuZCA9ICd3aGl0ZSdcbmRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXCIzMnB4XCJcblx0bGluZUhlaWdodDogKGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LTQpK1wicHhcIlx0XHRcblx0Zm9udEZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdGZvbnRXZWlnaHQ6IFwiMjAwXCJcbn1cbmRlZmF1bHRzLmRpdmlkZXJJdGVtVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXCIyMnB4XCJcblx0bGluZUhlaWdodDogKGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LTQpK1wicHhcIlx0XHRcblx0Zm9udEZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZVwiXG5cdGZvbnRXZWlnaHQ6IFwiMjAwXCJcblx0dGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZSdcbn1cbmRlZmF1bHRzLnBpY2tlclRleHRTdHlsZSA9IHtcblx0Zm9udFNpemU6IFx0XHRcIjQycHhcIlxuXHRmb250RmFtaWx5OiBcdFwiSGVsdmV0aWNhIE5ldWVcIlxuXHRmb250V2VpZ2h0OiBcdFwiMjAwXCJcbn1cbmV4cG9ydHMuZGVmYXVsdHMgPSBkZWZhdWx0c1xuXG5cbiMjI1xuXHRUQUJMRSBWSUVXIEVMRU1FTlRTXG5cdChlLmcuIFwiVGh1bWJcIiBmb3IgdGhlIHN3aXRjaCBjb250cm9sKVxuIyMjXG5cblN3aXRjaCA9IChwYXJhbXMpIC0+XG5cdHBhcmFtcyA9IHBhcmFtcyBvciB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcywgXG5cdFx0c3dpdGNoVGludDogZGVmYXVsdHMuc3dpdGNoVGludFxuXHRcdHNjcmVlbldpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHRhYmxlUm93SGVpZ2h0OiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdHN3aXRjaENvbnRhaW5lckJvcmRlcjogNFxuXHRcdHN3aXRjaENvbnRhaW5lckhlaWdodDogNTRcblx0XHRzd2l0Y2hDb250YWluZXJXaWR0aDogOTRcblx0XHRib3JkZXJDb2xvcjogZGVmYXVsdHMubGluZVRpbnQgIyBHcmV5IHJvdW5kZWQgcGlsbCAmIGJvcmRlcnMgYmV0d2VlbiBjZWxsc1xuXG5cdEBzZWxlY3RlZCA9IHRydWVcblx0XG5cdCMgU29tZSBvZiB0aGUgdmFsdWVzIGFyZSBiYXNlZCBvbiBvdGhlciBjb25zdGFudHMsXG5cdCMgc28geW91IGhhdmUgdG8gY2FsY3VsYXRlIHRoZW0gaW4gYSBzZWNvbmQgcGFzc1xuXHRzd2l0Y2hCdXR0b25SYWRpdXMgPSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0LzJcblx0c2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIgPSAyXG5cdFxuXHQjIFRoaXMgaXMgb3VyIGZhbmN5IGFuaW1hdGVkIHN3aXRjaCBzd2l0Y2hcblx0IyB3ZSBuZWVkIHRvIG1ha2UgYSByb3VuZGVkIHJlY3RhbmdsZSB3aXRoIGEgY2lyY2xlIGluc2lkZSBpdC5cblx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRcdFx0XHQwXG5cdFx0eTogXHRcdFx0XHRcdDBcblx0XHRjbGlwOiBcdFx0XHRcdGZhbHNlICMgQ2xpcHBpbmcgaHVydHMgdGhlIHN1YnRsZSBzaGFkb3cgb24gdGhlIGJ1dHRvblxuXHRcdHdpZHRoOlx0XHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIFxuXHRcdGhlaWdodDpcdFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFx0XCJcIlxuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblxuXHRAc3dpdGNoQmFja2dyb3VuZCA9IG5ldyBMYXllclxuXHRcdHg6XHRcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzJcblx0XHR5Olx0XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMgLSBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlci8yIC0gNFxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aCAtIHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQgKyBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlclxuXHRcdGhlaWdodDogXHRcdFx0cGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodCAtIHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHQgKyBzaHJ1bmtlbkJhY2tncm91bmREaWFtZXRlclxuXHRcdGJvcmRlclJhZGl1czogXHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRzaGFkb3dTcHJlYWQ6XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyAtIHNocnVua2VuQmFja2dyb3VuZERpYW1ldGVyLzIgKyBwYXJhbXMuc3dpdGNoQ29udGFpbmVyQm9yZGVyXG5cdFx0c2hhZG93Q29sb3I6IFx0XHRwYXJhbXMuc3dpdGNoVGludFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHQnJ1xuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblx0XHRzdXBlckxheWVyOiBcdFx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lclxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uID0gbmV3IExheWVyXG5cdFx0eDogcGFyYW1zLnN3aXRjaENvbnRhaW5lcldpZHRoIC0gcGFyYW1zLnN3aXRjaENvbnRhaW5lckhlaWdodFxuXHRcdHk6IC00XG5cdFx0d2lkdGg6XHRcdFx0XHRzd2l0Y2hCdXR0b25SYWRpdXMqMlxuXHRcdGhlaWdodDpcdFx0XHRcdHN3aXRjaEJ1dHRvblJhZGl1cyoyXG5cdFx0Ym9yZGVyUmFkaXVzOiBcdFx0c3dpdGNoQnV0dG9uUmFkaXVzXG5cdFx0c2hhZG93WTpcdFx0XHQzXG5cdFx0c2hhZG93Qmx1cjogXHRcdDVcblx0XHRzaGFkb3dDb2xvcjogXHRcdCdyZ2JhKDAsMCwwLDAuMyknXG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwid2hpdGVcIlxuXHRcdG9wYWNpdHk6IFx0XHRcdDFcblx0XHRzdXBlckxheWVyOiBcdFx0QHN3aXRjaEJ1dHRvbkNvbnRhaW5lclxuXHRcblx0IyBTRVQgVVAgQU5JTUFUSU9OU1xuXHRAc3dpdGNoQmFja2dyb3VuZC5zdGF0ZXMuYWRkXG5cdFx0ZGVzZWxlY3RlZDogXG5cdFx0XHR4OiBcdFx0XHRcdDBcblx0XHRcdHk6IFx0XHRcdFx0LTRcblx0XHRcdHdpZHRoOlx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJXaWR0aFxuXHRcdFx0aGVpZ2h0Olx0XHRcdHBhcmFtcy5zd2l0Y2hDb250YWluZXJIZWlnaHRcblx0XHRcdHNoYWRvd1NwcmVhZDogXHRwYXJhbXMuc3dpdGNoQ29udGFpbmVyQm9yZGVyXG5cdFx0XHRzYXR1cmF0ZTogXHRcdDBcblx0XHRcdGJyaWdodG5lc3M6IFx0MTUzXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiXCJcblx0QHN3aXRjaEJhY2tncm91bmQuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblx0XHR0aW1lOiAwLjMgXG5cdEBzd2l0Y2hCYWNrZ3JvdW5kLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XG5cdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0IFx0XHRpZiBAc2VsZWN0ZWRcbiBcdFx0XHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9IHBhcmFtcy5zd2l0Y2hUaW50XG5cblx0QHN3aXRjaEJhY2tncm91bmQub24gRXZlbnRzLkFuaW1hdGlvblN0YXJ0LCA9PlxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLmJhY2tncm91bmRDb2xvciA9ICcnXG5cblx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuYWRkXG5cdFx0ZGVzZWxlY3RlZDoge3g6IDB9XG5cdEBzd2l0Y2hCdXR0b24uc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRcdGN1cnZlOiBcInNwcmluZyg0MDAsMjUsMClcIlxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyLnNlbGVjdCA9ID0+XG5cdFx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2goXCJkZWZhdWx0XCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoKFwiZGVmYXVsdFwiKVxuXHRcdFxuXHRAc3dpdGNoQnV0dG9uQ29udGFpbmVyLmRlc2VsZWN0ID0gPT5cblx0XHRAc2VsZWN0ZWQgPSBmYWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2goXCJkZXNlbGVjdGVkXCIpXG5cdFx0QHN3aXRjaEJ1dHRvbi5zdGF0ZXMuc3dpdGNoKFwiZGVzZWxlY3RlZFwiKVxuXG5cdGlmIEBzZWxlY3RlZCA9PSBmYWxzZVxuXHRcdEBzd2l0Y2hCYWNrZ3JvdW5kLnN0YXRlcy5zd2l0Y2hJbnN0YW50KFwiZGVzZWxlY3RlZFwiKVxuXHRcdEBzd2l0Y2hCdXR0b24uc3RhdGVzLnN3aXRjaEluc3RhbnQoXCJkZXNlbGVjdGVkXCIpXG5cdGVsc2Vcblx0XHRAc3dpdGNoQmFja2dyb3VuZC5iYWNrZ3JvdW5kQ29sb3IgPSBwYXJhbXMuc3dpdGNoVGludFxuXG5cdHJldHVybiBAc3dpdGNoQnV0dG9uQ29udGFpbmVyXG5cdFxuQ3Jvc3MgPSAtPlxuXHRjb2xvciA9IGRlZmF1bHRzLnRpbnRcblx0Y3Jvc3NUaGlja25lc3MgPSA0XG5cdGNyb3NzID0gbmV3IExheWVyXG5cdFx0d2lkdGg6IDMwXHRcblx0XHRoZWlnaHQ6IDMwXHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1xuXHRjcm9zc1Vwc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjcm9zc1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMFxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRvcmlnaW5YOiAxXG5cdFx0c3VwZXJMYXllcjogY3Jvc3Ncblx0Y3Jvc3NVcHN0cm9rZS55ID0gMTRcblx0Y3Jvc3NVcHN0cm9rZS5yb3RhdGlvblogPSA0NVxuXHRjcm9zc0Rvd25zdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNyb3NzVGhpY2tuZXNzXG5cdFx0d2lkdGg6IDIwXG5cdFx0b3JpZ2luWDogMVxuXHRcdGJhY2tncm91bmRDb2xvcjogY29sb3Jcblx0XHRzdXBlckxheWVyOiBjcm9zc1xuXHRjcm9zc0Rvd25zdHJva2Uucm90YXRpb25aID0gLTQ1XG5cdGNyb3NzLnNlbGVjdCA9IC0+XG5cdFx0Y3Jvc3MuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRjcm9zcy5kZXNlbGVjdCA9IC0+XG5cdFx0Y3Jvc3MuYW5pbWF0ZVxuXHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRzY2FsZTogMC40XG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXHRcdFxuXHRyZXR1cm4gY3Jvc3Ncblx0XG5DYXJldCA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjYXJldFRoaWNrbmVzcyA9IDRcblx0Y2FyZXQgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcblx0XHRoZWlnaHQ6IDMwXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcdFx0XG5cdGNhcmV0VXBzdHJva2UgPSBuZXcgTGF5ZXJcblx0XHRoZWlnaHQ6IGNhcmV0VGhpY2tuZXNzXG5cdFx0d2lkdGg6IDE4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdG9yaWdpblg6IDFcblx0XHRzdXBlckxheWVyOiBjYXJldFxuXHRjYXJldFVwc3Ryb2tlLnkgPSAxNFxuXHRjYXJldFVwc3Ryb2tlLnJvdGF0aW9uWiA9IDQ1XG5cdGNhcmV0RG93bnN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2FyZXRUaGlja25lc3Ncblx0XHR3aWR0aDogMThcblx0XHRvcmlnaW5YOiAxXG5cdFx0YmFja2dyb3VuZENvbG9yOiBjb2xvclxuXHRcdHN1cGVyTGF5ZXI6IGNhcmV0XG5cdGNhcmV0RG93bnN0cm9rZS55ID0gMTJcdFx0XG5cdGNhcmV0RG93bnN0cm9rZS5yb3RhdGlvblogPSAtNDVcblx0Y2FyZXQuc2VsZWN0ID0gLT5cblx0XHRjYXJldC5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRjdXJ2ZTogJ3NwcmluZyg0MDAsMTUsMCknXG5cdGNhcmV0LmRlc2VsZWN0ID0gLT5cblx0XHRjYXJldC5hbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjRcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcdFxuXHRyZXR1cm4gY2FyZXRcblx0XG5DaGVjayA9IC0+XG5cdGNvbG9yID0gZGVmYXVsdHMudGludFxuXHRjaGVja1RoaWNrbmVzcyA9IDRcblx0Y2hlY2sgPSBuZXcgTGF5ZXJcblx0XHR3aWR0aDogMzBcblx0XHRoZWlnaHQ6IDMwXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcblx0Y2hlY2tVcHN0cm9rZSA9IG5ldyBMYXllclxuXHRcdGhlaWdodDogY2hlY2tUaGlja25lc3Ncblx0XHR3aWR0aDogMTNcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0b3JpZ2luWDogMVxuXHRcdHN1cGVyTGF5ZXI6IGNoZWNrXG5cdGNoZWNrVXBzdHJva2UueSA9IDE2XG5cdGNoZWNrVXBzdHJva2Uucm90YXRpb25aID0gNDVcblx0Y2hlY2tEb3duc3Ryb2tlID0gbmV3IExheWVyXG5cdFx0aGVpZ2h0OiBjaGVja1RoaWNrbmVzc1xuXHRcdHdpZHRoOiAyMlxuXHRcdG9yaWdpblg6IDFcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yXG5cdFx0c3VwZXJMYXllcjogY2hlY2tcdFxuXHRjaGVja0Rvd25zdHJva2UueCA9IDRcblx0Y2hlY2tEb3duc3Ryb2tlLnJvdGF0aW9uWiA9IC00NVxuXHRjaGVjay5zZWxlY3QgPSAtPlxuXHRcdGNoZWNrLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdGN1cnZlOiAnc3ByaW5nKDQwMCwxNSwwKSdcblx0Y2hlY2suZGVzZWxlY3QgPSAtPlxuXHRcdGNoZWNrLmFuaW1hdGVcblx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0c2NhbGU6IDAuNFxuXHRcdFx0Y3VydmU6ICdzcHJpbmcoNDAwLDE1LDApJ1xuXHRyZXR1cm4gY2hlY2tcblxuXG4jIyNcblx0VEFCTEUgVklFV1xuXHRcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0VGFibGVWaWV3Um93XHRcdFtFbGVtZW50cyBnbyBoZXJlXVxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4jIyNcblxuZXhwb3J0cy5UYWJsZVZpZXdSb3cgPSAocGFyYW1zKSAtPlxuXHRcblx0IyBUaGUgdHJpY2t5IHRoaW5nIGFib3V0IHJldXNhYmxlIGNvbXBvbmVudHMgaXMgcmVtZW1iZXJpbmdcblx0IyBob3cgdG8gdXNlIHRoZW0gKHBhcnRpY3VsYXJseSBpZiB0aGV5IGhhdmUgbG90cyBvZiBjdXN0b21pemFibGVcblx0IyBwYXJhbWV0ZXJzKS4gU2V0dGluZyBzZW5zaWJsZSBkZWZhdWx0cyBtYWtlcyBpdCB3YXkgZWFzaWVyIHRvIGdldFxuXHQjIHN0YXJ0ZWQgKGFuZCByZW1lbWJlciBob3cgdG8gdXNlIHRoZSB0aGluZyB5b3UgbWFkZSlcblx0Xy5kZWZhdWx0cyBwYXJhbXMsIFxuXHRcdG5hbWU6ICdHaXZlIG1lIGEgbmFtZSEnXG5cdFx0eDogMFxuXHRcdHk6IDBcblx0XHRlbmFibGVkOiB0cnVlXG5cdFx0c2VsZWN0ZWQ6IHRydWVcblx0XHRpY29uOiAnY2hlY2snXG5cdFx0dGV4dENvbG9yOiBkZWZhdWx0cy50aW50XG5cdFx0c3dpdGNoVGludDogZGVmYXVsdHMuc3dpdGNoVGludFxuXHRcdGZpcnN0SXRlbUluTGlzdDogdHJ1ZSAjIGNvdWxkIGJlIGZpcnN0IG9yIGxhc3Rcblx0XHRsYXN0SXRlbUluTGlzdDogdHJ1ZSAjIGNvdWxkIGJlIGZpcnN0IG9yIGxhc3Rcblx0XHRcblx0XHQjIENvbnN0YW50c1xuXHRcdHNjcmVlbldpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdHRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmc6IGRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0XHR0YWJsZVJvd0hlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRib3JkZXJDb2xvcjogZGVmYXVsdHMubGluZVRpbnQgIyBHcmV5IHJvdW5kZWQgcGlsbCAmIGJvcmRlcnMgYmV0d2VlbiBjZWxsc1xuXG5cdCMgU29tZSBvZiB0aGUgdmFsdWVzIGFyZSBiYXNlZCBvbiBvdGhlciBjb25zdGFudHMsXG5cdCMgc28geW91IGhhdmUgdG8gY2FsY3VsYXRlIHRoZW0gaW4gYSBzZWNvbmQgcGFzc1xuXHRzd2l0Y2hCdXR0b25SYWRpdXMgPSBwYXJhbXMuc3dpdGNoQ29udGFpbmVySGVpZ2h0LzJcblx0c2hydW5rZW5CYWNrZ3JvdW5kRGlhbWV0ZXIgPSAyXG5cdFx0XG5cdCMgVGhpcyBpcyB0aGUgcm9vdCBvYmplY3QgZm9yIHRoaXMgZW50aXJlIGNvbXBvbmVudC5cblx0IyBXZSB3aWxsIGF0dGFjaCBhbGwgb3VyIGZ1bmN0aW9ucyBkaXJlY3RseSB0byB0aGlzIGxheWVyXG5cdEBsaXN0SXRlbUNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IHBhcmFtcy54XG5cdFx0eTogcGFyYW1zLnlcblx0XHR3aWR0aDogXHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRjbGlwOiBmYWxzZVxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0QGxpc3RJdGVtQ29udGFpbmVyLnN0eWxlID0gXG5cdFx0Ym9yZGVyVG9wOiBcdFx0aWYgcGFyYW1zLmZpcnN0SXRlbUluTGlzdCB0aGVuIFwiMXB4IHNvbGlkIFwiICsgcGFyYW1zLmJvcmRlckNvbG9yIGVsc2UgXCJcIlxuXHRcdGJvcmRlckJvdHRvbTogXHRpZiBwYXJhbXMubGFzdEl0ZW1Jbkxpc3QgdGhlbiBcIjFweCBzb2xpZCBcIiArIHBhcmFtcy5ib3JkZXJDb2xvciBlbHNlIFwiXCJcblxuXHQjIFRoZXNlIHdpbGwgYmUgYWNjZXNzZWQgdXNpbmcgZnVuY3Rpb25zXG5cdEBlbmFibGVkID0gcGFyYW1zLmVuYWJsZWRcblx0QHNlbGVjdGVkID0gcGFyYW1zLnNlbGVjdGVkXG5cdFxuXHRAbGlzdEl0ZW0gPSBuZXcgTGF5ZXIgXG5cdFx0eDogcGFyYW1zLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0XHR3aWR0aDogXHRkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRzdXBlckxheWVyOiBAbGlzdEl0ZW1Db250YWluZXJcblx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdub25lJ1x0XG5cdEBsaXN0SXRlbS5zdHlsZSA9IGRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlXG5cdEBsaXN0SXRlbS5zdHlsZSA9XG5cdFx0Y29sb3I6IHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRib3JkZXJUb3A6IFx0aWYgcGFyYW1zLmZpcnN0SXRlbUluTGlzdCB0aGVuIFwiXCIgZWxzZSBcIjFweCBzb2xpZCBcIiArIHBhcmFtcy5ib3JkZXJDb2xvclxuXG5cdCMgVGhpcyBpcyB3aGVyZSB0aGUgbGFiZWwgb2YgdGhlIGxpc3QgaXRlbSBsaXZlc1xuXHRAbGlzdEl0ZW0uaHRtbCA9IHBhcmFtcy5uYW1lIFxuXG5cdCMgQWRkIHRoZSBjaGVja21hcmsgZm9yIHRoZSBsaXN0XG5cdHRoaW5nVG9Td2l0Y2ggPSBzd2l0Y2hcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdjaGVjaycgdGhlbiBuZXcgQ2hlY2soKVxuXHRcdHdoZW4gcGFyYW1zLmljb24gPT0gJ2Nyb3NzJyB0aGVuIG5ldyBDcm9zcygpXG5cdFx0d2hlbiBwYXJhbXMuaWNvbiA9PSAnY2FyZXQnIHRoZW4gbmV3IENhcmV0KClcblx0XHR3aGVuIHBhcmFtcy5pY29uID09ICdzd2l0Y2gnIHRoZW4gbmV3IFN3aXRjaCgpXG5cblx0dGhpbmdUb1N3aXRjaC5zdXBlckxheWVyID0gQGxpc3RJdGVtQ29udGFpbmVyXG5cdHRoaW5nVG9Td2l0Y2gueCA9IGRlZmF1bHRzLnNjcmVlbldpZHRoIC0gdGhpbmdUb1N3aXRjaC53aWR0aCAtIGRlZmF1bHRzLnRhYmxlUm93SG9yaXpvbnRhbFBhZGRpbmdcblx0dGhpbmdUb1N3aXRjaC5jZW50ZXJZKDIpXG4jIFx0dGhpbmdUb1N3aXRjaC55ID0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzIgLSB0aGluZ1RvU3dpdGNoLmhlaWdodC8yXG5cdFxuXHQjIE1BS0UgSVQgQUxMIElOVEVSQUNUSVZFXG5cdCMgT24gYSBjbGljaywgZ28gdG8gdGhlIG5leHQgc3RhdGVcblx0aWYgcGFyYW1zLmljb24gPT0gJ3N3aXRjaCdcblx0XHR0aGluZ1RvU3dpdGNoLm9uIEV2ZW50cy5DbGljaywgPT5cblx0XHRcdEBsaXN0SXRlbUNvbnRhaW5lci5zd2l0Y2goKVxuXHRlbHNlIFxuXHRcdEBsaXN0SXRlbS5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRAbGlzdEl0ZW1Db250YWluZXIuc3dpdGNoKClcblxuXHRAbGlzdEl0ZW1Db250YWluZXIuc3dpdGNoID0gPT5cblx0XHRpZiBAc2VsZWN0ZWQgdGhlbiBAbGlzdEl0ZW1Db250YWluZXIuZGVzZWxlY3QoKSBlbHNlIEBsaXN0SXRlbUNvbnRhaW5lci5zZWxlY3QoKVxuXHRcdFxuXHRAbGlzdEl0ZW1Db250YWluZXIuc2VsZWN0ID0gKG9wdGlvbnMpID0+XG5cdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge3N1cHJlc3NFdmVudHM6IGZhbHNlfVxuXHRcdGlmIEBlbmFibGVkIFxuXHRcdFx0dGhpbmdUb1N3aXRjaC5zZWxlY3QoKVxuXHRcdFx0QHNlbGVjdGVkID0gdHJ1ZVxuXHRcdGlmIG9wdGlvbnMuc3VwcmVzc0V2ZW50cyA9PSBmYWxzZVxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogQHNlbGVjdGVkIH1cblxuXHRAbGlzdEl0ZW1Db250YWluZXIuZGVzZWxlY3QgPSAob3B0aW9ucykgPT5cblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7c3VwcmVzc0V2ZW50czogZmFsc2V9XG5cdFx0aWYgQGVuYWJsZWQgXG5cdFx0XHR0aGluZ1RvU3dpdGNoLmRlc2VsZWN0KClcdFx0XG5cdFx0XHRAc2VsZWN0ZWQgPSBmYWxzZVxuXHRcdGlmIG9wdGlvbnMuc3VwcmVzc0V2ZW50cyA9PSBmYWxzZVxuXHRcdFx0QGxpc3RJdGVtQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogQHNlbGVjdGVkIH1cblxuXHRAbGlzdEl0ZW1Db250YWluZXIudXBkYXRlTGFiZWwgPSAobmV3VGV4dCkgPT5cblx0XHRAbGlzdEl0ZW0uaHRtbCA9IG5ld1RleHRcblxuXHRAbGlzdEl0ZW1Db250YWluZXIuc2VsZWN0ZWQgPSAoKSA9PlxuXHRcdHJldHVybiBAc2VsZWN0ZWRcblx0XHRcdFxuXHRAbGlzdEl0ZW1Db250YWluZXIudXBkYXRlTGFiZWwocGFyYW1zLm5hbWUpXG5cblx0cmV0dXJuIEBsaXN0SXRlbUNvbnRhaW5lclxuXG5leHBvcnRzLlRhYmxlVmlldyA9IChwYXJhbXMpIC0+XG5cdHBhcmFtcyA9IHBhcmFtcyBvciB7fVxuXHRfLmRlZmF1bHRzIHBhcmFtcyxcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOlx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRpdGVtczogW1wiSXQncyBqdXN0IG1lIVwiXVxuXHRcdGljb246ICdjaGVjaydcblx0XHR2YWxpZGF0aW9uOiAnbm9uZSdcblx0XG5cdEBidXR0b25Hcm91cENvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTpcdFx0cGFyYW1zLnlcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICogcGFyYW1zLml0ZW1zLmxlbmd0aFxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIm5vbmVcIlxuXHRcdFx0XHRcdFxuXHRAYnV0dG9uQXJyYXkgPSBbXVxuXHRmb3IgYnV0dG9uTmFtZSwgaSBpbiBwYXJhbXMuaXRlbXNcblx0XHRmaXJzdEl0ZW1Jbkxpc3QgPSBpZiBpID09IDAgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRsYXN0SXRlbUluTGlzdCA9IGlmIGkgPT0gKHBhcmFtcy5pdGVtcy5sZW5ndGgtMSkgdGhlbiB0cnVlIGVsc2UgZmFsc2Vcblx0XHRuZXdCdXR0b24gPSBuZXcgZXhwb3J0cy5UYWJsZVZpZXdSb3coe1xuXHRcdFx0eDogMCwgXG5cdFx0XHR5OiBpKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LCBcblx0XHRcdG5hbWU6IGJ1dHRvbk5hbWUsIFxuXHRcdFx0aWNvbjogcGFyYW1zLmljb24sXG5cdFx0XHRmaXJzdEl0ZW1Jbkxpc3Q6IGZpcnN0SXRlbUluTGlzdCxcblx0XHRcdGxhc3RJdGVtSW5MaXN0OiBsYXN0SXRlbUluTGlzdFxuXHRcdH0pXG5cdFx0QGJ1dHRvbkFycmF5LnB1c2gobmV3QnV0dG9uKVxuXHRcdG5ld0J1dHRvbi5zdXBlckxheWVyID0gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cblx0YXR0YWNoUmFkaW9CdXR0b25WYWxpZGF0aW9uID0gKGJ1dHRvbkFycmF5KSA9PlxuXHRcdGJ1dHRvbkdyb3VwQ29udGFpbmVyID0gQGJ1dHRvbkdyb3VwQ29udGFpbmVyXG5cdFx0Zm9yIGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkIGluIGJ1dHRvbkFycmF5XG5cdFx0XHRidXR0b25DbGlja2VkLmRlc2VsZWN0KHtzdXByZXNzRXZlbnRzOiB0cnVlfSlcblx0XHRcdCMgQ3JlYXRlcyBhIGNsb3N1cmUgdG8gc2F2ZSB0aGUgaW5kZXggb2YgdGhlIGJ1dHRvbiB3ZSdyZSBkZWFsaW5nIHdpdGhcblx0XHRcdGRvIChidXR0b25DbGlja2VkLCBpbmRleE9mQnV0dG9uQ2xpY2tlZCkgLT4gXG5cdFx0XHRcdCMgTGlzdGVuIGZvciBldmVudHMgYW5kIGNoYW5nZSBvdGhlciBidXR0b25zIGluIHJlc3BvbnNlXG5cdFx0XHRcdGJ1dHRvbkNsaWNrZWQub24gJ0RpZENoYW5nZScsIChldmVudCkgPT5cblx0XHRcdFx0XHRmb3Igb3RoZXJCdXR0b24sIG90aGVyQnV0dG9uSW5kZXggaW4gYnV0dG9uQXJyYXlcblx0XHRcdFx0XHRcdGlmIG90aGVyQnV0dG9uSW5kZXggIT0gaW5kZXhPZkJ1dHRvbkNsaWNrZWRcblx0XHRcdFx0XHRcdFx0IyBEbyBzdHVmZiB0byB0aGUgb3RoZXIgYnV0dG9uc1xuXHRcdFx0XHRcdFx0XHRvdGhlckJ1dHRvbi5kZXNlbGVjdCh7c3VwcHJlc3NFdmVudHM6IHRydWV9KVxuXHRcdFx0XHRcdGJ1dHRvbkdyb3VwQ29udGFpbmVyLmVtaXQgXCJEaWRDaGFuZ2VcIiwgeyBzZWxlY3RlZDogaW5kZXhPZkJ1dHRvbkNsaWNrZWQsIG51bVNlbGVjdGVkOiAxLCBidXR0b25zOiBidXR0b25BcnJheSB9XG5cblx0YXR0YWNoRGVmYXVsdFZhbGlkYXRpb24gPSAoYnV0dG9uQXJyYXkpID0+XG5cdFx0IyBKdXN0IGVtaXRzIHRoZSBuZXcgdmFsdWVzXG5cdFx0YnV0dG9uR3JvdXBDb250YWluZXIgPSBAYnV0dG9uR3JvdXBDb250YWluZXJcblx0XHRmb3IgYnV0dG9uQ2xpY2tlZCwgaW5kZXhPZkJ1dHRvbkNsaWNrZWQgaW4gYnV0dG9uQXJyYXlcblx0XHRcdGJ1dHRvbkNsaWNrZWQuZGVzZWxlY3Qoe3N1cHJlc3NFdmVudHM6IHRydWV9KVxuXHRcdFx0IyBDcmVhdGVzIGEgY2xvc3VyZSB0byBzYXZlIHRoZSBpbmRleCBvZiB0aGUgYnV0dG9uIHdlJ3JlIGRlYWxpbmcgd2l0aFxuXHRcdFx0ZG8gKGJ1dHRvbkNsaWNrZWQsIGluZGV4T2ZCdXR0b25DbGlja2VkKSAtPiBcblx0XHRcdFx0IyBMaXN0ZW4gZm9yIGV2ZW50cyBhbmQgY2hhbmdlIG90aGVyIGJ1dHRvbnMgaW4gcmVzcG9uc2Vcblx0XHRcdFx0YnV0dG9uQ2xpY2tlZC5vbiAnRGlkQ2hhbmdlJywgKGV2ZW50KSA9PlxuXHRcdFx0XHRcdG51bVNlbGVjdGVkID0gMFxuXHRcdFx0XHRcdHRhYmxlVmlld1N0YXRlcyA9IFtdXHRcdFxuXHRcdFx0XHRcdGZvciBidXR0b24gaW4gYnV0dG9uQXJyYXlcblx0XHRcdFx0XHRcdHRhYmxlVmlld1N0YXRlcy5wdXNoKGJ1dHRvbi5zZWxlY3RlZCgpKVxuXHRcdFx0XHRcdFx0aWYgYnV0dG9uLnNlbGVjdGVkKCkgdGhlbiBudW1TZWxlY3RlZCsrXG5cdFx0XHRcdFx0YnV0dG9uR3JvdXBDb250YWluZXIuZW1pdCBcIkRpZENoYW5nZVwiLCB7IHNlbGVjdGVkOiB0YWJsZVZpZXdTdGF0ZXMsIG51bVNlbGVjdGVkOiBudW1TZWxlY3RlZCwgYnV0dG9uczogYnV0dG9uQXJyYXkgfVxuXG5cdGlmIHBhcmFtcy52YWxpZGF0aW9uID09ICdyYWRpbydcblx0XHRhdHRhY2hSYWRpb0J1dHRvblZhbGlkYXRpb24oQGJ1dHRvbkFycmF5KVxuXHRlbHNlIFxuXHRcdGF0dGFjaERlZmF1bHRWYWxpZGF0aW9uKEBidXR0b25BcnJheSlcblx0XHRcblx0cmV0dXJuIEBidXR0b25Hcm91cENvbnRhaW5lclxuXG5cblxuIyMjXG5cdFRBQkxFIFZJRVcgSEVBREVSXG5cdEluIGlPUywgdGhpcyBpcyB0eXBpY2FsbHkgYXR0YWNoZWQgdG8gdGhlIHRhYmxlIHZpZXcsIFxuXHRidXQgaXQncyBpbmRlcGVuZGVudCBoZXJlIHNvIHlvdSBjYW4gcHV0IGl0IHdoZXJldmVyIHlvdSB3YW50LlxuIyMjXG5cbmV4cG9ydHMuVGFibGVWaWV3SGVhZGVyID0gKHBhcmFtcykgLT5cblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdHRleHQ6ICdJIGFtIGEgZGl2aWRlcidcblx0XHR4OiAwXG5cdFx0eTogMFxuXHRsaXN0RGl2aWRlciA9IG5ldyBMYXllclxuXHRcdHg6IHBhcmFtcy54ICsgZGVmYXVsdHMudGFibGVSb3dIb3Jpem9udGFsUGFkZGluZ1xuXHRcdHk6IHBhcmFtcy55XG5cdFx0d2lkdGg6IGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0YmFja2dyb3VuZENvbG9yOiAnbm9uZSdcblx0bGlzdERpdmlkZXIuaHRtbCA9IHBhcmFtcy50ZXh0XG5cdGxpc3REaXZpZGVyLnN0eWxlID0gZGVmYXVsdHMuZGl2aWRlckl0ZW1UZXh0U3R5bGVcblx0bGlzdERpdmlkZXIuc3R5bGUgPSBcblx0XHRjb2xvcjogZGVmYXVsdHMudGludFxuXHRyZXR1cm4gbGlzdERpdmlkZXJcblxuXG5cbiMjI1xuXHRQSUNLRVJcblx0SW4gaU9TLCB0aGlzIGlzIHR5cGljYWxseSBhdHRhY2hlZCB0byB0aGUgdGFibGUgdmlldywgXG5cdGJ1dCBpdCdzIGluZGVwZW5kZW50IGhlcmUgc28geW91IGNhbiBwdXQgaXQgd2hlcmV2ZXIgeW91IHdhbnQuXG4jIyNcblxuXG4jIyBVdGlsaXR5IGZ1bmN0aW9uc1xuXG5xdWFudGl6ZSA9IChpbnB1dCwgc3RlcFNpemUpIC0+XG5cdHJldHVybiBNYXRoLmZsb29yKGlucHV0L3N0ZXBTaXplKSAqIHN0ZXBTaXplXG5cblxuIyMgVGhlIGl0ZW1zIGluIHRoZSBwaWNrZXJcblxuRHJ1bSA9IChwYXJlbnREcnVtTGF5ZXIsIGRydW1OYW1lLCBsaXN0SXRlbXMsIHBhcmFtcykgLT5cblx0XG5cdCMgU2V0dXAgdmFyaWFibGVzXG5cdEBwYXJlbnREcnVtTGF5ZXIgPSBwYXJlbnREcnVtTGF5ZXJcblx0cGFyYW1zID0gcGFyYW1zIHx8IHt9XG5cdF8uZGVmYXVsdHMgcGFyYW1zLFxuXHRcdGVuYWJsZWQ6IHRydWVcblx0XHR4UGN0OiAwICBcdFx0XHRcdCMgMCB0byAxXG5cdFx0d2lkdGhQY3Q6IDFcdFx0XHRcdCMgMCB0byAxXG5cdFx0dGV4dEFsaWduOiBcImNlbnRlclwiXHRcdCMgbGVmdCwgY2VudGVyLCByaWdodFxuXHRcdHRleHRQYWRkaW5nOiBcIjBcIlxuXHRcdHRleHRDb2xvcjogZGVmYXVsdHMudGludFxuXHRcblx0IyBWYWx1ZXMgZGVyaXZlZCBmcm9tIHBhcmFtc1xuXHRkcnVtQ29udGFpbmVySGVpZ2h0ID0gZGVmYXVsdHMudGFibGVSb3dIZWlnaHQqNVxuXG5cdCMgU2V0IHVwIGNvbnRlbnQgb2YgbGlzdCBcdFx0XG5cdGxpc3RJdGVtcyA9IGxpc3RJdGVtc1xuXHRAbmFtZSA9IGRydW1OYW1lXG5cdEBpbmRleCA9IDBcblx0QHZhbCA9IGxpc3RJdGVtc1tAaW5kZXhdXG5cdEB2ZWxvY2l0eSA9IDBcblx0Zmlyc3RUb3VjaEF2YWlsYWJsZSA9IHRydWUgICAgIyBpcyB0aGlzIHRoZSBmaXJzdCB0b3VjaCBpbiBhIGdpdmVuIGdlc3R1cmU/XG5cdFxuXHRpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UgPSAwXG5cdFxuXHQjIENhbGN1bGF0ZSBoZWlnaHQgYW5kIHZlcnRpY2FsIGJvdW5kcyBvZiB0aGUgbGlzdFxuXHRsaXN0TWluWVBvcyBcdD0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0bGlzdE1heFlQb3MgXHQ9IC1saXN0SXRlbXMubGVuZ3RoKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0K2RlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0bGlzdEhlaWdodCBcdFx0PSBsaXN0SXRlbXMubGVuZ3RoKmRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodFxuXG5cdEBkcnVtQ29udGFpbmVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdFx0XHRcdHBhcmFtcy54UGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHR5OiBcdFx0XHRcdFx0MFxuXHRcdHdpZHRoOiBcdFx0XHRcdHBhcmFtcy53aWR0aFBjdCAqIGRlZmF1bHRzLnNjcmVlbldpZHRoXG5cdFx0aGVpZ2h0OiBcdFx0XHRkcnVtQ29udGFpbmVySGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdFwibm9uZVwiXG5cdFx0c3VwZXJMYXllcjogXHRcdHBhcmVudERydW1MYXllclxuXHRcblx0bGlzdExheWVyID0gbmV3IExheWVyXG5cdFx0eDogXHRcdFx0XHRcdDBcblx0XHR5OiBcdFx0XHRcdFx0LWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0XHR3aWR0aDogXHRcdFx0XHRwYXJhbXMud2lkdGhQY3QgKiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogXHRcdFx0bGlzdEhlaWdodFxuXHRcdHN1cGVyTGF5ZXI6IFx0XHRAZHJ1bUNvbnRhaW5lclxuXHRcdGJhY2tncm91bmRDb2xvcjogXHRcIm5vbmVcIlxuXHRcblx0IyBsaXN0TGF5ZXIuc2Nyb2xsID0gdHJ1ZVxuXHRsaXN0TGF5ZXIuZHJhZ2dhYmxlLmVuYWJsZWQgPSBwYXJhbXMuZW5hYmxlZFxuXHRsaXN0TGF5ZXIuZHJhZ2dhYmxlLnNwZWVkWCA9IDBcblx0XG5cdGZvciBsaSwgaSBpbiBsaXN0SXRlbXNcblx0XHRsaXN0SXRlbUxheWVyID0gbmV3IExheWVyXG5cdFx0XHR4OiBcdFx0XHRcdDBcblx0XHRcdHk6IFx0XHRcdFx0aSAqIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodC8yXG5cdFx0XHR3aWR0aDogXHRcdFx0cGFyYW1zLndpZHRoUGN0ICogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRcdGhlaWdodDogXHRcdGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0XG5cdFx0XHRzdXBlckxheWVyOiBcdGxpc3RMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcIm5vbmVcIiNVdGlscy5yYW5kb21Db2xvcigpXG5cdFx0bGlzdEl0ZW1MYXllci5odG1sID0gbGlcblx0XHRsaXN0SXRlbUxheWVyLnN0eWxlID1cblx0XHRcdGNvbG9yOiBcdFx0XHRwYXJhbXMudGV4dENvbG9yXG5cdFx0XHRmb250RmFtaWx5OiBcdGRlZmF1bHRzLnBpY2tlclRleHRTdHlsZS5mb250RmFtaWx5XG5cdFx0XHRmb250V2VpZ2h0OiBcdGRlZmF1bHRzLnBpY2tlclRleHRTdHlsZS5mb250V2VpZ2h0XG5cdFx0XHRmb250U2l6ZTogXHRcdGRlZmF1bHRzLnBpY2tlclRleHRTdHlsZS5mb250U2l6ZVxuXHRcdFx0bGluZUhlaWdodDogXHRkZWZhdWx0cy50YWJsZVJvd0hlaWdodCtcInB4XCJcblx0XHRcdHRleHRBbGlnbjogXHRcdHBhcmFtcy50ZXh0QWxpZ25cblx0XHRcdHBhZGRpbmc6IFx0XHRwYXJhbXMudGV4dFBhZGRpbmdcblxuXHRcdGxpc3RJdGVtTGF5ZXIuc3RhcnRZID0gaSAqIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0ICsgZHJ1bUNvbnRhaW5lckhlaWdodC8yXG5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5EcmFnTW92ZSwgPT5cblx0XHRpZiBmaXJzdFRvdWNoQXZhaWxhYmxlXG5cdFx0XHRAZHJ1bUNvbnRhaW5lci5lbWl0KFwiRHJ1bVN0YXJ0ZWRNb3ZpbmdcIiwge2RydW06IGRydW1OYW1lLCBpbmRleDogQGluZGV4LCB2YWx1ZTogQHZhbCwgdmVsb2NpdHk6IDB9KVxuXHRcdFx0Zmlyc3RUb3VjaEF2YWlsYWJsZSA9IGZhbHNlXHRcdFxuXHRcdFx0XG5cdFx0dXBkYXRlRHJ1bUFwcGVhcmFuY2UoKVxuXHRcdFxuXHQjIFRvIHNpbXVsYXRlIGlPUyBtb21lbnR1bSBzY3JvbGxpbmcgKHdoaWNoIGNhdXNlcyB0aGUgZHJ1bSB0byBrZWVwIHNwaW5uaW5nIFxuXHQjIGFmdGVyIHlvdXIgZmluZ2VyIGxpZnRzIG9mZiBpdCksIHdlIHRyaWdnZXIgYW4gYW5pbWF0aW9uIHRoZSBtb21lbnQgeW91IGxpZnRcblx0IyB5b3VyIGZpbmdlci4gVGhlIGludGVuc2l0eSBvZiB0aGlzIGFuaW1hdGlvbiBpcyBwcm9wb3J0aW9uYWwgdG8gdGhlIHNwZWVkIHdoZW5cblx0IyBvZiB0aGUgZHJhZ2dpbmcgd2hlbiB5b3VyIGZpbmdlciB3YXMgbGlmdGVkLlxuXHRsaXN0TGF5ZXIub24gRXZlbnRzLkRyYWdFbmQsIChlLCBmKSA9PlxuXHRcdFxuXHRcdCMgTmV4dCB0b3VjaCBzaG91bGQgdHJpZ2dlciBEcnVtU3RhcnRlZE1vdmluZ1xuXHRcdGZpcnN0VG91Y2hBdmFpbGFibGUgPSB0cnVlXG5cdFxuXHRcdCMgVGhpcyBjYWxjdWxhdGVzIHRoZSBhbmltYXRpb25cblx0XHRzY3JvbGxWZWxvY2l0eSA9IGxpc3RMYXllci5kcmFnZ2FibGUuY2FsY3VsYXRlVmVsb2NpdHkoKS55XG5cdFx0dGltZUFmdGVyRHJhZyA9ICgwLjUrTWF0aC5hYnMoc2Nyb2xsVmVsb2NpdHkqMC4yKSkudG9GaXhlZCgxKVxuXHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gcXVhbnRpemUobGlzdExheWVyLnkgKyBzY3JvbGxWZWxvY2l0eSo0MDAsIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0KSArIGRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzJcblx0XHRcblx0XHQjIEF0IHRoZSB0b3AgYW5kIGJvdHRvbSwgdGhlIG1vbWVudHVtIHNob3VsZCBiZSBhZGp1c3RlZCBzbyB0aGUgXG5cdFx0IyBmaXJzdCBhbmQgbGFzdCB2YWx1ZXMgb24gdGhlIGRydW0gZG9uJ3QgZ28gdG9vIGZhciBvdXQgb2Ygdmlld1xuXHRcdGRpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0bGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXIgPSAtbGlzdEl0ZW1zLmxlbmd0aCpkZWZhdWx0cy50YWJsZVJvd0hlaWdodFxuXHRcdGJvdHRvbU92ZXJmbG93ID0gTWF0aC5tYXgoMCwgbGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXItZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gKVxuXHRcdHRvcE92ZXJmbG93ID0gTWF0aC5tYXgoMCwgZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW0gKVxuXHRcdG92ZXJmbG93RGFtcGVuaW5nID0gMTBcblx0XHRcblx0XHRpZiBib3R0b21PdmVyZmxvdyA+IDBcblx0XHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gbGlzdEhlaWdodFdpdGhvdXRFbmRCdWZmZXIgLSAoYm90dG9tT3ZlcmZsb3cgLyBvdmVyZmxvd0RhbXBlbmluZylcblx0XHRcdG5ld0Rpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0XHR0aW1lQWZ0ZXJEcmFnID0gdGltZUFmdGVyRHJhZyAqIChuZXdEaXN0YW5jZVRvVHJhdmVsL2Rpc3RhbmNlVG9UcmF2ZWwpXG5cblx0XHRpZiB0b3BPdmVyZmxvdyA+IDBcblx0XHRcdGZpbmFsUG9zaXRpb25BZnRlck1vbWVudHVtID0gNDAgKyAodG9wT3ZlcmZsb3cgLyBvdmVyZmxvd0RhbXBlbmluZylcblx0XHRcdG5ld0Rpc3RhbmNlVG9UcmF2ZWwgPSBmaW5hbFBvc2l0aW9uQWZ0ZXJNb21lbnR1bSAtIGxpc3RMYXllci55XG5cdFx0XHR0aW1lQWZ0ZXJEcmFnID0gdGltZUFmdGVyRHJhZyAqIChuZXdEaXN0YW5jZVRvVHJhdmVsL2Rpc3RhbmNlVG9UcmF2ZWwpXG5cblx0XHQjIFRyaWdnZXIgdGhlIGFuaW1hdGlvbiwgYW5kIHNjaGVkdWxlIGFuIGV2ZW50IHRoYXQgd2lsbFxuXHRcdCMgdHJpZ2dlciB3aGVuIHRoZSBkcnVtIGZpbmFsbHkgc3RvcHMgc3Bpbm5pbmcuXG5cdFx0bGlzdExheWVyLmFuaW1hdGUoe1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7eTogZmluYWxQb3NpdGlvbkFmdGVyTW9tZW50dW19XG5cdFx0XHRcdHRpbWU6IHRpbWVBZnRlckRyYWdcblx0XHRcdFx0Y3VydmU6IFwiZWFzZS1vdXRcIlxuXHRcdFx0fSlcblx0XHRVdGlscy5kZWxheSB0aW1lQWZ0ZXJEcmFnLCAtPlxuXHRcdFx0c3RvcERydW0oKVxuXG5cdCMgVGhpcyBlbnN1cmVzIHRoYXQgZHVyaW5nIHRoZSBhbmltYXRpb24gb2YgdGhlIGxpc3QgbGF5ZXIsIHRoZSBkcnVtJ3MgYXBwZWFyYW5jZSBjb250aW51ZXNcblx0IyB0byBiZSB1cGRhdGVkLiBCZWNhdXNlIG11bHRpcGxlIGFuaW1hdGlvbnMgY291bGQgb3ZlcmxhcCwgd2UgZW5zdXJlIHRoYXQgZXZlcnkgbmV3IGFuaW1hdGlvblxuXHQjIGVuZHMgdGhlIGludGVydmFsIGFuZCBzdGFydHMgYSBuZXcgb25lIHNvIHRoYXQgd2UgbmV2ZXIgaGF2ZSBtb3JlIHRoYW4gb25lIHJ1bm5pbmcgXG5cdGxpc3RMYXllci5vbiBFdmVudHMuQW5pbWF0aW9uU3RhcnQsIC0+XG5cdFx0Y2xlYXJJbnRlcnZhbChpbnRlcnZhbFRvdXBkYXRlRHJ1bUFwcGVhcmFuY2UpXG5cdFx0aW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlID0gVXRpbHMuaW50ZXJ2YWwgMS8zMCwgdXBkYXRlRHJ1bUFwcGVhcmFuY2UgICAgXG5cblx0bGlzdExheWVyLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XHRcdFxuXHRcdGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxUb3VwZGF0ZURydW1BcHBlYXJhbmNlKVxuXG5cdFx0IyBFbWl0IGFmdGVyIGFsbCBtb3ZlbWVudCBlbmRzIGluIHRoZSBsaXN0XG5cdFx0QGRydW1Db250YWluZXIuZW1pdChcIkRydW1GaW5pc2hlZENoYW5naW5nXCIsIHtsaXN0OiBkcnVtTmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWx9KVxuXG5cdHVwZGF0ZURydW1BcHBlYXJhbmNlID0gPT5cblx0XHRpdGVtc0luRHJ1bSA9IDRcblx0XHRsaXN0UG9zaXRpb24gPSBsaXN0TGF5ZXIueSAvIC1kZWZhdWx0cy50YWJsZVJvd0hlaWdodCAtIDAuNVxuXHRcdGNhcHBlZExpc3RQb3NpdGlvbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKGxpc3RMYXllci55IC8gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0IC0gMC41LCBsaXN0SXRlbXMubGVuZ3RoIC0gMSkpXG5cdFx0Zm9jdXNJdGVtID0gTWF0aC5yb3VuZChjYXBwZWRMaXN0UG9zaXRpb24pXG5cdFx0ZGlzdGFuY2VGcm9tTWlkZGxlID0gTWF0aC5hYnMoZm9jdXNJdGVtIC0gY2FwcGVkTGlzdFBvc2l0aW9uKVxuXHRcdGZvciBpIGluIFsoZm9jdXNJdGVtLWl0ZW1zSW5EcnVtKS4uKGZvY3VzSXRlbStpdGVtc0luRHJ1bSldXG5cdFx0XHRpZiBpID49IDAgYW5kIGkgPCBsaXN0SXRlbXMubGVuZ3RoXG5cdFx0XHRcdGxpc3RMYXllci5zdWJMYXllcnNbaV0ub3BhY2l0eSA9IDEgLSBNYXRoLmFicyhsaXN0UG9zaXRpb24gLSBpKS81IC0gKGlmIChpICE9IGZvY3VzSXRlbSkgdGhlbiAwLjMgZWxzZSAwKVxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnNjYWxlWSA9IDEgLSBNYXRoLm1pbigxLCBNYXRoLmFicyhsaXN0UG9zaXRpb24gLSBpKS80KVxuXHRcdFx0XHRsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnkgPSBsaXN0TGF5ZXIuc3ViTGF5ZXJzW2ldLnN0YXJ0WSAtIChpLWxpc3RQb3NpdGlvbikqTWF0aC5hYnMoaS1saXN0UG9zaXRpb24pKjEwXG5cblx0XHQjIFVwZGF0ZSB0aGUgdmFsdWUgb2YgdGhlIGRydW0gb25seSB3aGVuIGEgbmV3IHZhbHVlIGlzIHJlYWNoZWRcblx0XHRpZiAoQGluZGV4ICE9IGZvY3VzSXRlbSlcblx0XHRcdHVwZGF0ZURydW1WYWx1ZXMoZm9jdXNJdGVtKVxuXHRcdFxuXHRzdG9wRHJ1bSA9ID0+XHRcdFxuXHRcdCMgRW5zdXJlIHRoZSBkcnVtIG5ldmVyIGVuZHMgb3V0IG9mIGJvdW5kc1xuXHRcdGlmIGxpc3RMYXllci55ID4gbGlzdE1pbllQb3MgXG5cdFx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0ICAgIFx0cHJvcGVydGllczoge3k6bGlzdE1pbllQb3N9XG5cdFx0ICAgIFx0Y3VydmU6IFwic3ByaW5nKDQwMCw1MCwwKVwiXG5cdFx0XHR9KVxuXHRcdGlmIGxpc3RMYXllci55IDwgbGlzdE1heFlQb3Ncblx0XHRcdGxpc3RMYXllci5hbmltYXRlKHtcblx0XHRcdFx0cHJvcGVydGllczoge3k6IGxpc3RNYXhZUG9zfVxuXHRcdFx0XHRjdXJ2ZTogXCJzcHJpbmcoNDAwLDUwLDApXCJcblx0XHRcdH0pXG5cdFxuXHQjIFVwZGF0ZSB0aGUgdmFsdWVzIG9mIHRoZSBkcnVtcyBhbmQgaW52b2tlIHRoZSBjYWxsYmFjayBcblx0dXBkYXRlRHJ1bVZhbHVlcyA9IChuZXdJbmRleCkgPT5cblx0XHRAaW5kZXggPSBuZXdJbmRleFxuXHRcdEB2YWwgPSBsaXN0SXRlbXNbQGluZGV4XVxuXHRcdEBkcnVtQ29udGFpbmVyLmVtaXQoXCJEcnVtRGlkQ2hhbmdlXCIsIHtsaXN0OiBkcnVtTmFtZSwgaW5kZXg6IEBpbmRleCwgdmFsdWU6IEB2YWx9KVxuXHRcblx0IyBSZW5kZXIgZm9yIHRoZSBmaXJzdCB0aW1lXHRcdFxuXHR1cGRhdGVEcnVtQXBwZWFyYW5jZSgpXG5cdFxuXHRAc2V0SW5kZXggPSAoaW5kZXgpID0+XG5cdFx0eVBvc2l0aW9uRm9yVGhpc0luZGV4ID0gLWRlZmF1bHRzLnRhYmxlUm93SGVpZ2h0LzIgLSAoaW5kZXggKiBkZWZhdWx0cy50YWJsZVJvd0hlaWdodClcblx0XHRsaXN0TGF5ZXIuYW5pbWF0ZSh7XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt5OiB5UG9zaXRpb25Gb3JUaGlzSW5kZXh9XG5cdFx0XHRcdHRpbWU6IDAuNVxuXHRcdFx0XHRjdXJ2ZTogXCJlYXNlLW91dFwiXG5cdFx0XHR9KVxuXG5cdEBzZXRWYWx1ZSA9ICh2YWwpID0+XG5cdFx0aW5kZXggPSBsaXN0SXRlbXMuaW5kZXhPZih2YWwpXG5cdFx0aWYgaW5kZXggIT0gLTFcblx0XHRcdEBzZXRJbmRleChpbmRleClcblxuXHQjIFJldHVybiB0aGUgZHJ1bSBvYmplY3Qgc28gd2UgY2FuIGFjY2VzcyBpdHMgdmFsdWVzXG5cdHJldHVybiBAXG5cblxuIyMjXG5cdFBJQ0tFUlxuXHRUaGlzIGNvbnRhaW5zIHRoZSBwaWNrZXIgXG4jIyMgXG5leHBvcnRzLlBpY2tlciA9IChwYXJhbXMpIC0+XG5cdFxuXHRwYXJhbXMgPSBwYXJhbXMgfHwge31cblx0Xy5kZWZhdWx0cyBwYXJhbXMsXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0MFxuXHRcdHdpZHRoOlx0ZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRkZWZhdWx0VGV4dDogXCJcIlxuXHRcdHRleHRDb2xvcjogZGVmYXVsdHMudGludFxuXG5cdGRydW1Db250YWluZXJIZWlnaHQgPSBkZWZhdWx0cy50YWJsZVJvd0hlaWdodCo1XG5cblx0QHBpY2tlckNvbnRhaW5lciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHRwYXJhbXMueFxuXHRcdHk6XHRcdHBhcmFtcy55XG5cdFx0d2lkdGg6IFx0cGFyYW1zLndpZHRoXG5cdFx0aGVpZ2h0OiBkcnVtQ29udGFpbmVySGVpZ2h0Kzg4XG5cdFx0YmFja2dyb3VuZENvbG9yOiBcdGRlZmF1bHRzLml0ZW1CYWNrZ3JvdW5kXG5cdFx0XHRcblx0QGRydW0gPSBuZXcgTGF5ZXJcblx0XHR4OiBcdFx0MFxuXHRcdHk6IFx0XHQ4OFxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZHJ1bUNvbnRhaW5lckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCJcblx0XHRzdXBlckxheWVyOiBAcGlja2VyQ29udGFpbmVyXHRcdFxuXHRcdFxuXHRAc2VsZWN0ZWRJdGVtID0gbmV3IExheWVyXG5cdFx0eDogXHRcdDBcblx0XHR5OiBcdFx0ZHJ1bUNvbnRhaW5lckhlaWdodC8yIC0gZGVmYXVsdHMudGFibGVSb3dIZWlnaHQvMlxuXHRcdHdpZHRoOiBcdHBhcmFtcy53aWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMudGFibGVSb3dIZWlnaHRcblx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwibm9uZVwiXG5cdFx0c3VwZXJMYXllcjogQGRydW1cblxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlciA9IG5ldyBMYXllclxuXHRcdHg6IFx0XHQwXG5cdFx0eTogXHRcdDBcblx0XHR3aWR0aDogXHRwYXJhbXMud2lkdGhcblx0XHRoZWlnaHQ6XHQ4OFxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuaXRlbUJhY2tncm91bmRcblx0XHRzdXBlckxheWVyOiBAcGlja2VyQ29udGFpbmVyXG5cdFx0XG5cdCMgU3R5bGVzXG5cdEBkcnVtLnN0eWxlID1cblx0XHRwb2ludGVyRXZlbnRzOiBcIm5vbmVcIlxuXHRcdGJvcmRlclRvcDogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcdGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgXCIgKyBkZWZhdWx0cy5saW5lVGludFxuXHRcblx0QHNlbGVjdGVkSXRlbS5zdHlsZSA9XG5cdFx0cG9pbnRlckV2ZW50czogXCJub25lXCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIHJnYmEoMCwwLDAsMC4zKVwiXG5cdFx0Ym9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCByZ2JhKDAsMCwwLDAuMylcIlxuXHRcdFxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5zdHlsZSA9IGRlZmF1bHRzLmxpc3RJdGVtVGV4dFN0eWxlXG5cdEBwaWNrZXJDb250YWluZXIucGlja2VySGVhZGVyLnN0eWxlID0gXG5cdFx0Y29sb3I6IHBhcmFtcy50ZXh0Q29sb3Jcblx0XHRwYWRkaW5nTGVmdDogXCIyMHB4XCJcblx0XHRib3JkZXJUb3A6IFwiMXB4IHNvbGlkIFwiICsgZGVmYXVsdHMubGluZVRpbnRcblx0XHRcdFxuXHRAcGlja2VyQ29udGFpbmVyLnBpY2tlckhlYWRlci5odG1sID0gcGFyYW1zLmRlZmF1bHRUZXh0XG5cdFx0XG5cdFx0XG5cdCMgQWRkIGRydW1zXG5cdEBwaWNrZXJDb250YWluZXIuZHJ1bXMgPSBbXVxuXHRAcGlja2VyQ29udGFpbmVyLmRydW1zQnlOYW1lID0ge31cblx0XG5cdHBpY2tlclN0YXJ0ZWRNb3ZpbmcgPSAoKT0+XG5cdFx0ZHJ1bVZhbHVlcyA9IHt9XG5cdFx0bmV3VmFsdWVzID0gZm9yIGRydW0gaW4gQHBpY2tlckNvbnRhaW5lci5kcnVtc1xuXHRcdFx0ZHJ1bVZhbHVlc1tkcnVtLm5hbWVdID0ge2luZGV4OiBkcnVtLmluZGV4LCB2YWw6IGRydW0udmFsLCB2ZWxvY2l0eTogMH1cdFxuXHRcdEBwaWNrZXJDb250YWluZXIuZW1pdChcIlBpY2tlclN0YXJ0ZWRNb3ZpbmdcIiApXG5cdFx0XG5cdHBpY2tlckRpZENoYW5nZSA9ICgpPT5cblx0XHRkcnVtVmFsdWVzID0ge31cblx0XHRuZXdWYWx1ZXMgPSBmb3IgZHJ1bSBpbiBAcGlja2VyQ29udGFpbmVyLmRydW1zXG5cdFx0XHRkcnVtVmFsdWVzW2RydW0ubmFtZV0gPSB7aW5kZXg6IGRydW0uaW5kZXgsIHZhbDogZHJ1bS52YWx9XG5cblx0XHRAcGlja2VyQ29udGFpbmVyLmVtaXQoXCJQaWNrZXJEaWRDaGFuZ2VcIiwgZHJ1bVZhbHVlcyApXG5cdFxuXHRwaWNrZXJGaW5pc2hlZENoYW5naW5nID0gKCk9PlxuXHRcdGRydW1WYWx1ZXMgPSB7fVxuXHRcdG5ld1ZhbHVlcyA9IGZvciBkcnVtIGluIEBwaWNrZXJDb250YWluZXIuZHJ1bXNcblx0XHRcdGRydW1WYWx1ZXNbZHJ1bS5uYW1lXSA9IHtpbmRleDogZHJ1bS5pbmRleCwgdmFsOiBkcnVtLnZhbH1cblxuXHRcdEBwaWNrZXJDb250YWluZXIuZW1pdChcIlBpY2tlckZpbmlzaGVkQ2hhbmdpbmdcIiwgZHJ1bVZhbHVlcyApXHRcblx0aWYgKHBhcmFtcy5kcnVtcyBhbmQgcGFyYW1zLmRydW1zLmxlbmd0aCA+IDApXG5cdFx0Zm9yIGRydW0gaW4gcGFyYW1zLmRydW1zXG5cdFx0XHRuZXdEcnVtID0gbmV3IERydW0oQGRydW0sIGRydW0ubmFtZSwgZHJ1bS5pdGVtcywgZHJ1bS5wYXJhbXMpXG5cblx0XHRcdCMjIFN0b3JlIGRydW1zIGluc2lkZSB0aGUgcGlja2VyXG5cdFx0XHRAcGlja2VyQ29udGFpbmVyLmRydW1zLnB1c2gobmV3RHJ1bSlcblx0XHRcdEBwaWNrZXJDb250YWluZXIuZHJ1bXNCeU5hbWVbZHJ1bS5uYW1lXSA9IG5ld0RydW0gXG5cblx0XHRcdCMjIEVuc3VyZSB0aGF0IGNoYW5nZXMgdG8gdGhlIGRydW0gYnViYmxlIHVwIHRvIHRoZSBwaWNrZXJcblx0XHRcdG5ld0RydW0uZHJ1bUNvbnRhaW5lci5vbiBcIkRydW1EaWRDaGFuZ2VcIiwgcGlja2VyRGlkQ2hhbmdlXG5cdFx0XHRcblx0XHRcdCMjIEVtaXQgYW4gZXZlbnQgd2hlbiBkcnVtcyBzdG9wIG1vdmluZyBhbHRvZ2V0aGVyXG5cdFx0XHRuZXdEcnVtLmRydW1Db250YWluZXIub24gXCJEcnVtRmluaXNoZWRDaGFuZ2luZ1wiLCBwaWNrZXJGaW5pc2hlZENoYW5naW5nXG5cblx0XHRcdCMjIEVtaXQgYW4gZXZlbnQgd2hlbiBsaXN0cyBzdG9wIG1vdmluZyBhbHRvZ2V0aGVyXG5cdFx0XHRuZXdEcnVtLmRydW1Db250YWluZXIub24gXCJEcnVtU3RhcnRlZE1vdmluZ1wiLCBwaWNrZXJTdGFydGVkTW92aW5nXG5cblxuXHRyZXR1cm4gQHBpY2tlckNvbnRhaW5lclxuIiwiIyMjXG5cdHRhYkJhck1vZHVsZVxuXHTigJNcblx0Q3JlYXRlZCBieSBQZXR0ZXIgTmlsc3NvblxuXHRodHRwOi8vcGV0dGVyLnByb1xuIyMjXG5cbiMgRGVmYXVsdCBzdHlsZXNcbmRlZmF1bHRzID0ge1xuXHRzY3JlZW5XaWR0aDogU2NyZWVuLndpZHRoXG5cdHNjcmVlbkhlaWdodDogU2NyZWVuLmhlaWdodFxuXHRiYXJIZWlnaHQ6IDk4XG5cdGxhYmVsT2Zmc2V0OiAtMjhcblx0aWNvbk9mZnNldDogLTEyXG5cdHRpbnRDb2xvcjogXCIjMDA3YWZmXCJcblx0dGludENvbG9yVW5zZWxlY3RlZDogXCIjOTI5MjkyXCJcblx0Ymx1cjogNDBcblx0b3BhY2l0eTogMC43NVxuXHRib3JkZXJTaGFkb3c6IFwiMHB4IC0xcHggMHB4IDBweCByZ2JhKDAsMCwwLDAuMzIpXCJcblx0YmFja2dyb3VuZENvbG9yOiBcIiNmOGY4ZjhcIlxuXHRzaG93TGFiZWxzOiB0cnVlXG5cdGJhZGdlU2l6ZTogMzZcblx0YmFkZ2VDb2xvcjogXCIjRkYzQjMwXCJcbn1cbmRlZmF1bHRzLmxhYmVsVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXCIyMHB4XCJcblx0dGV4dEFsaWduOiBcImNlbnRlclwiXG5cdGZvbnRGYW1pbHk6IFwiSGVsdmV0aWNhIE5ldWUnLCBzYW5zLXNlcmlmXCJcbn1cbmRlZmF1bHRzLmJhZGdlVGV4dFN0eWxlID0ge1xuXHRmb250U2l6ZTogXCIyNnB4XCJcblx0bGluZUhlaWdodDogXCIzNnB4XCJcblx0Y29sb3I6IFwiI2ZmZlwiXG5cdHRleHRBbGlnbjogXCJjZW50ZXJcIlxuXHRmb250RmFtaWx5OiBcIkhlbHZldGljYSBOZXVlJywgc2Fucy1zZXJpZlwiXG59XG5leHBvcnRzLmRlZmF1bHRzID0gZGVmYXVsdHNcblxuXG5nZXRJdGVtRnJvbU5hbWUgPSAobmFtZSkgLT5cblx0IyBSZXR1cm5zIGEgdGFiIGJhciBpdGVtIGlmIG5hbWVzIG1hdGNoZXNcblxuXHRmb3IgaXRlbSBpbiBAaXRlbXNcblx0XHRyZXR1cm4gaXRlbSBpZiBpdGVtLm5hbWUgaXMgbmFtZVxuXG5cbnVwZGF0ZVZpZXdzID0gKHNlbGVjdGVkSXRlbSkgLT5cblx0IyBTaG93cy9oaWRlcyB2aWV3cyBiYXNlZCBvbiBzZWxlY3RlZCB0YWIgYmFyIGl0ZW1cblxuXHRmb3IgaXRlbSBpbiBAaXRlbXNcblx0XHRpZiBpdGVtLnZpZXc/XG5cdFx0XHRpZiBpdGVtLnZpZXcgaXMgc2VsZWN0ZWRJdGVtLnZpZXcgdGhlbiBpdGVtLnZpZXcudmlzaWJsZSA9IHRydWUgZWxzZSBpdGVtLnZpZXcudmlzaWJsZSA9IGZhbHNlXG5cdFx0XHRpZiBpdGVtLmJsdXJWaWV3IGlzIHNlbGVjdGVkSXRlbS5ibHVyVmlldyB0aGVuIGl0ZW0uYmx1clZpZXcudmlzaWJsZSA9IHRydWUgZWxzZSBpdGVtLmJsdXJWaWV3LnZpc2libGUgPSBmYWxzZVxuXG5cbnNldFNlbGVjdGVkID0gKG5hbWUpIC0+XG5cdCMgU2V0cyBzZWxlY3RlZCB0YWIgaXRlbSBmcm9tIHRoZSBrZXkgKG5hbWUpIHVzZWQgd2hlbiBjcmVhdGluZyBpdFxuXG5cdGlmIG5hbWUgIT0gQHNlbGVjdGVkXG5cdFx0Zm9yIGl0ZW0gaW4gQGl0ZW1zXG5cdFx0XHRpZiBpdGVtLm5hbWUgaXMgbmFtZVxuXHRcdFx0XHRpdGVtLmljb25MYXllci5iYWNrZ3JvdW5kQ29sb3IgPSBkZWZhdWx0cy50aW50Q29sb3Jcblx0XHRcdFx0aXRlbS5sYWJlbExheWVyLnN0eWxlID0gXCJjb2xvclwiOiBkZWZhdWx0cy50aW50Q29sb3IgaWYgaXRlbS5sYWJlbExheWVyXG5cdFx0XHRcdGl0ZW0uaWNvbkxheWVyLnN0eWxlID0gXCItd2Via2l0LW1hc2staW1hZ2VcIjogXCJ1cmwoXCIgKyBpdGVtLmljb25MYXllci5zZWxlY3RlZEljb24gKyBcIilcIiBpZiBpdGVtLmljb25MYXllci5zZWxlY3RlZEljb25cblx0XHRcdFx0QHNlbGVjdGVkID0gaXRlbS5uYW1lXG5cdFx0XHRcdEB1cGRhdGVWaWV3cyhpdGVtKVxuXHRcdFx0XHRALmVtaXQoXCJ0YWJCYXJEaWRTd2l0Y2hcIiwgaXRlbS5uYW1lKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpdGVtLmljb25MYXllci5iYWNrZ3JvdW5kQ29sb3IgPSBkZWZhdWx0cy50aW50Q29sb3JVbnNlbGVjdGVkXG5cdFx0XHRcdGl0ZW0ubGFiZWxMYXllci5zdHlsZSA9IFwiY29sb3JcIjogZGVmYXVsdHMudGludENvbG9yVW5zZWxlY3RlZCBpZiBpdGVtLmxhYmVsTGF5ZXJcblx0XHRcdFx0aXRlbS5pY29uTGF5ZXIuc3R5bGUgPSBcIi13ZWJraXQtbWFzay1pbWFnZVwiOiBcInVybChcIiArIGl0ZW0uaWNvbkxheWVyLmljb24gKyBcIilcIiBpZiBpdGVtLmljb25MYXllci5zZWxlY3RlZEljb25cblxuXG5zZXRCYWRnZVZhbHVlID0gKG5hbWUsIHZhbHVlKSAtPlxuXHQjIEFkZHMgYSBiYWRnZSB0byB0aGUgdGFiIGl0ZW0gaWYgdmFsdWUgaXMgYSBudW1iZXIgPiAwIGFuZCByZW1vdmVzIHRoZSBiYWRnZSBpZiBudWxsXG5cblx0Zm9yIGl0ZW0gaW4gQGl0ZW1zXG5cdFx0aWYgaXRlbS5uYW1lIGlzIG5hbWVcblx0XHRcdGlmIHZhbHVlXG5cdFx0XHRcdGl0ZW0uYmFkZ2VMYXllci5odG1sID0gdmFsdWVcblx0XHRcdFx0aXRlbS5iYWRnZUxheWVyLnZpc2libGUgPSB0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGl0ZW0uYmFkZ2VMYXllci52aXNpYmxlID0gZmFsc2VcblxuXG5leHBvcnRzLnRhYkJhciA9IChiYXJJdGVtcykgLT5cblx0IyBDcmVhdGVzIGFuZCBzZXQtdXBzIHRoZSB0YWIgYmFyXG5cblx0dGFiQmFyID0gbmV3IExheWVyXG5cdFx0eDogMFxuXHRcdHk6IGRlZmF1bHRzLnNjcmVlbkhlaWdodCAtIGRlZmF1bHRzLmJhckhlaWdodFxuXHRcdHdpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aFxuXHRcdGhlaWdodDogZGVmYXVsdHMuYmFySGVpZ2h0XG5cdFx0YmFja2dyb3VuZENvbG9yOiBkZWZhdWx0cy5iYWNrZ3JvdW5kQ29sb3JcblxuXHR0YWJCYXIuc3R5bGUgPSBcImJveC1zaGFkb3dcIjogZGVmYXVsdHMuYm9yZGVyU2hhZG93XG5cdHRhYkJhci5nZXRJdGVtRnJvbU5hbWUgPSBnZXRJdGVtRnJvbU5hbWVcblx0dGFiQmFyLnVwZGF0ZVZpZXdzID0gdXBkYXRlVmlld3Ncblx0dGFiQmFyLnNldFNlbGVjdGVkID0gc2V0U2VsZWN0ZWRcblx0dGFiQmFyLnNldEJhZGdlVmFsdWUgPSBzZXRCYWRnZVZhbHVlXG5cdHRhYkJhci5zZWxlY3RlZCA9IG51bGxcblx0dGFiQmFyLml0ZW1zID0gW11cblxuXHRiYWNrZ3JvdW5kID0gbmV3IExheWVyXG5cdFx0eDogMFxuXHRcdHk6IDBcblx0XHR3aWR0aDogZGVmYXVsdHMuc2NyZWVuV2lkdGhcblx0XHRoZWlnaHQ6IGRlZmF1bHRzLmJhckhlaWdodFxuXHRcdGJhY2tncm91bmRDb2xvcjogZGVmYXVsdHMuYmFja2dyb3VuZENvbG9yXG5cdFx0b3BhY2l0eTogZGVmYXVsdHMub3BhY2l0eVxuXHRcdHN1cGVyTGF5ZXI6IHRhYkJhclxuXG5cdGl0ZW1Db3VudCA9IE9iamVjdC5rZXlzKGJhckl0ZW1zKS5sZW5ndGhcblx0aSA9IDBcblxuXHRmb3IgbmFtZSxwYXJhbXMgb2YgYmFySXRlbXNcblx0XHRpdGVtTGF5ZXIgPSBuZXcgTGF5ZXJcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCJcblx0XHRcdHdpZHRoOiBkZWZhdWx0cy5zY3JlZW5XaWR0aCAvIGl0ZW1Db3VudFxuXHRcdFx0aGVpZ2h0OiBkZWZhdWx0cy5iYXJIZWlnaHRcblx0XHRcdHg6IGkgKiAoZGVmYXVsdHMuc2NyZWVuV2lkdGggLyBpdGVtQ291bnQpXG5cdFx0XHR5OiAwXG5cdFx0XHRzdXBlckxheWVyOiB0YWJCYXJcblx0XHRcdG5hbWU6IG5hbWVcblxuXHRcdGlmIHBhcmFtcy52aWV3P1xuXHRcdFx0IyBDcmVhdGUgYSBjb3B5IG9mIHRoZSB2aWV3LCBibHVyIGl0IGFuZCB1c2UgaXQgYXMgYSBiYWNrZ3JvdW5kXG5cdFx0XHRibHVyVmlldyA9IHBhcmFtcy52aWV3LmNvcHkoKVxuXHRcdFx0aWYgU2Nyb2xsQ29tcG9uZW50LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJsdXJWaWV3KVxuXHRcdFx0XHRibHVyVmlldy5jb250ZW50LmJsdXIgPSBkZWZhdWx0cy5ibHVyXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGJsdXJWaWV3LmJsdXIgPSBkZWZhdWx0cy5ibHVyXG5cdFx0XHRibHVyVmlldy5zdXBlckxheWVyID0gdGFiQmFyXG5cdFx0XHRibHVyVmlldy5pbmRleCA9IDBcblx0XHRcdGJsdXJWaWV3LnkgPSBibHVyVmlldy55IC0gKGRlZmF1bHRzLnNjcmVlbkhlaWdodCAtIGRlZmF1bHRzLmJhckhlaWdodClcblxuXHRcdFx0aXRlbUxheWVyLnZpZXcgPSBwYXJhbXMudmlld1xuXHRcdFx0aXRlbUxheWVyLmJsdXJWaWV3ID0gYmx1clZpZXdcblxuXHRcdGljb25MYXllciA9IG5ldyBMYXllclxuXHRcdFx0d2lkdGg6IDYwXG5cdFx0XHRoZWlnaHQ6IDYwXG5cdFx0XHRzdXBlckxheWVyOiBpdGVtTGF5ZXJcblx0XHRpY29uTGF5ZXIuaWNvbiA9IHBhcmFtcy5pY29uXG5cdFx0aWNvbkxheWVyLnNlbGVjdGVkSWNvbiA9IHBhcmFtcy5zZWxlY3RlZEljb24gaWYgcGFyYW1zLnNlbGVjdGVkSWNvbj9cblxuXHRcdCMgVGhpcyBibGFjayBtYWdpYyBpcyB1c2VkIHRvIHRpbnQgdGhlIFBORyBpbWFnZXMuIE9ubHkgd29ya3Mgb24gd2Via2l0IGJyb3dzZXJzIDovXG5cdFx0aWNvbkxheWVyLnN0eWxlID1cblx0XHRcdFwiLXdlYmtpdC1tYXNrLWltYWdlXCI6IFwidXJsKFwiICsgaWNvbkxheWVyLmljb24gKyBcIilcIlxuXHRcdFx0XCItd2Via2l0LW1hc2stcmVwZWF0XCI6IFwibm8tcmVwZWF0XCJcblx0XHRcdFwiLXdlYmtpdC1tYXNrLXBvc2l0aW9uXCI6IFwiY2VudGVyIGNlbnRlclwiXG5cdFx0aWNvbkxheWVyLmNlbnRlclgoKVxuXHRcdGljb25MYXllci5jZW50ZXJZKGRlZmF1bHRzLmljb25PZmZzZXQpXG5cdFx0aXRlbUxheWVyLmljb25MYXllciA9IGljb25MYXllclxuXG5cdFx0aWYgZGVmYXVsdHMuc2hvd0xhYmVsc1xuXHRcdFx0bGFiZWxMYXllciA9IG5ldyBMYXllclxuXHRcdFx0XHR3aWR0aDogaXRlbUxheWVyLndpZHRoXG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogZGVmYXVsdHMuYmFySGVpZ2h0ICsgZGVmYXVsdHMubGFiZWxPZmZzZXRcblx0XHRcdFx0c3VwZXJMYXllcjogaXRlbUxheWVyXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJub25lXCJcblx0XHRcdGxhYmVsTGF5ZXIuaHRtbCA9IG5hbWVcblx0XHRcdGxhYmVsTGF5ZXIuc3R5bGUgPSBkZWZhdWx0cy5sYWJlbFRleHRTdHlsZVxuXHRcdFx0aXRlbUxheWVyLmxhYmVsTGF5ZXIgPSBsYWJlbExheWVyXG5cblx0XHRiYWRnZUxheWVyID0gbmV3IExheWVyXG5cdFx0XHR3aWR0aDogZGVmYXVsdHMuYmFkZ2VTaXplXG5cdFx0XHRoZWlnaHQ6IGRlZmF1bHRzLmJhZGdlU2l6ZVxuXHRcdFx0eDogMFxuXHRcdFx0eTogNlxuXHRcdFx0Ym9yZGVyUmFkaXVzOiAxOFxuXHRcdFx0c3VwZXJMYXllcjogaXRlbUxheWVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IGRlZmF1bHRzLmJhZGdlQ29sb3Jcblx0XHRiYWRnZUxheWVyLnN0eWxlID0gZGVmYXVsdHMuYmFkZ2VUZXh0U3R5bGVcblx0XHRiYWRnZUxheWVyLmNlbnRlclgoMjYpXG5cblx0XHRpdGVtTGF5ZXIuYmFkZ2VMYXllciA9IGJhZGdlTGF5ZXJcblx0XHRpdGVtTGF5ZXIuYmFkZ2VMYXllci52aXNpYmxlID0gZmFsc2VcblxuXHRcdHRhYkJhci5pdGVtcy5wdXNoKGl0ZW1MYXllcilcblxuXHRcdGl0ZW1MYXllci5vbiBFdmVudHMuQ2xpY2ssIC0+XG5cdFx0XHR0YWJCYXIuc2V0U2VsZWN0ZWQoQG5hbWUpXG5cblx0XHRpKytcblxuXHQjIFNlbGVjdCB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgdGFiIGJhclxuXHR0YWJCYXIuc2V0U2VsZWN0ZWQodGFiQmFyLml0ZW1zWzBdLm5hbWUpXG5cblx0cmV0dXJuIHRhYkJhclxuIiwidGl0bGUgPSBuZXcgTGF5ZXJcblx0YmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXG5cdGh0bWw6ICdGcmFtZXIgU2NhZmZvbGQsPGJyPiBxdWljayBzdGFydCB3aXRoIGJhc2ljIG1vZHVsZXMuJ1xuXHRzdHlsZToge1xuXHRcdCdjb2xvcic6ICdzbGF0ZWdyYXknLFxuXHRcdCd0ZXh0LWFsaWduJzogJ2NlbnRlcicsXG5cdFx0J2ZvbnQtZmFtaWx5JzogJ1NhbiBGcmFuY2lzY28gRGlzcGxheScsXG5cdFx0J2ZvbnQtd2VpZ2h0JzogJzUwMCcsXG5cdFx0J2ZvbnQtc2l6ZSc6ICc0OHB4Jyxcblx0XHQnbGluZS1oZWlnaHQnOiAnMTIwJScsXG5cdFx0J3BhZGRpbmcnOiAnMTBweCd9XG5cdHdpZHRoOiBTY3JlZW4ud2lkdGhcblx0aGVpZ2h0OiA0MDBcblx0eTogMzAwXG5cblxuXG5zcGFyayA9IG5ldyBMYXllclxuXHRpbWFnZTogXCJpbWFnZXMvZmxhdC1zcGFyay5wbmdcIlxuXHRzY2FsZTogMi41XG5cbnNwYXJrLmNlbnRlcigpXG4iXX0=
