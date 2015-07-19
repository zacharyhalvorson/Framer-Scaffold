{ViewNavigationController} = require "ViewNavigationController"

# This imports all the layers for "tester" into testerLayers
s = Framer.Importer.load "imported/tester"

vnc = new ViewNavigationController
vnc.backgroundColor = 'white'

viewPDP = new ScrollComponent
	width: Screen.width
	height: Screen.height

s.navBar.superLayer = Framer.Device.screen
s.tabBar.superLayer = Framer.Device.screen
s.statusBar.superLayer = Framer.Device.screen

s.statusBarWhite.states.add
	hide: {visible: false}
	show: {visible: true}
		
	
s.statusBarBlack.states.add
	show: {visible: true}
	hide: {visible: false}

s.navBar.states.add
	hide: {y: -s.navBar.height}
	show: {y: 0}
	
s.navBar.states.animationOptions = 
	curve: "ease-in-out"
	time: 0.2

s.pdp.visible = true
s.settings.visible = true


# # # # # # # # # # # # # # # # # # # # # # # #
# VIEWS
# # # # # # # # # # # # # # # # # # # # # # # #
s.pdp.superLayer = viewPDP.content
viewPDP.scrollHorizontal = false

viewTrending = s.trending
viewSettings = s.settings

viewTrending.name = 'initialView'
viewSettings.name = 'viewSettings'

viewPDP.superLayer = vnc
viewSettings.superLayer = vnc
viewTrending.superLayer = vnc

# vnc.removeBackButton(viewPDP)

# # # # # # # # # # # # # # # # # # # # # # # #
# BUTTONS
# # # # # # # # # # # # # # # # # # # # # # # #
btnSettings = new Layer
	width: Screen.width/3
	x: Screen.width - (Screen.width/3)
	backgroundColor: "transparent"
	superLayer: s.tabBar
	
btnTrending = new Layer
	width: Screen.width/3
	backgroundColor: "transparent"
	superLayer: s.tabBar

btnProduct = new Layer
	width: 400
	height: 450
	y: s.navBar.height
	backgroundColor: "transparent"
	superLayer: viewTrending
btnProduct.centerX()

btnPDPBack = new Layer
	x: 0
	y: 40
	width: 88
	height: 88
	backgroundColor: 'transparent'
	superLayer: viewPDP

# 
# Functions
# 
colorStatusBar = (state) ->
	if state is "white"
		s.statusBarBlack.states.switch("hide")
		s.statusBarWhite.states.switch("show")
	else if state is "black"
		s.statusBarBlack.states.switch("show")
		s.statusBarWhite.states.switch("hide")

# # # # # # # # # # # # # # # # # # # # # # # #
# EVENTS
# # # # # # # # # # # # # # # # # # # # # # # #
btnTrending.on Events.Click, ->
	vnc.transition viewTrending, 'left'
	s.navBar.states.switch("show")
	colorStatusBar("white")

btnPDPBack.on Events.Click, ->
	vnc.transition viewTrending, 'left'
	s.navBar.states.switch("show")
	colorStatusBar("white")
	
btnSettings.on Events.Click, ->
	vnc.transition viewSettings,
	s.navBar.states.switch("show")
	colorStatusBar("white")

btnProduct.on Events.Click, ->
	vnc.transition viewPDP
	s.navBar.states.switch("hide")
	colorStatusBar("black")
	
	
	
	
	