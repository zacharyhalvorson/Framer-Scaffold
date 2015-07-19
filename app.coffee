# This imports all the layers for "viewControllerExample" into viewcontrollerexampleLayers
s = Framer.Importer.load "imported/viewControllerExample"

tabBarModule = require "tabBarModule"
framerKit = require "framerKit"
{ViewNavigationController} = require "ViewNavigationController"

# welcomeScreen = require 'welcomeScreen'

new BackgroundLayer({backgroundColor: '#fff'})

s.tabBar.visible = false
s.navBar.superLayer = Framer.Device.screen
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

settingsView = s.settings
trendingView = new Layer
	width: Screen.width
	height: Screen.height

tabBar = new tabBarModule.tabBar
	Trending:
		icon: 'images/trending-icon.png',
		selectedIcon: s.home__active.image,
		view: trendingView
	Explore:
		icon: s.explore__inactive.image
	Profile:
		icon: s.profile__inactive.image
		selectedIcon: 'images/profile-selected.png'
		view: settingsView
		
trendingNC = new ViewNavigationController
trendingNC.backgroundColor = '#fff'
trendingNC.superLayer = trendingView

s.pdp.visible = true
s.settings.visible = true

viewTrending = s.trending
viewSettings = s.settings
viewPDP = s.pdp

viewPDP = new ScrollComponent
	width: Screen.width
	height: Screen.height

s.pdp.superLayer = viewPDP.content
viewPDP.scrollHorizontal = false

viewTrending.name = 'initialView'
viewSettings.name = 'viewSettings'
viewPDP.name = 'viewPDP'

viewPDP.superLayer = trendingNC
viewSettings.superLayer = trendingNC
viewTrending.superLayer = trendingNC

trendingNC.removeBackButton(viewPDP)

# # # # # # # # # # # # # # # # # # # # # # # #
# FUNCTIONS
# # # # # # # # # # # # # # # # # # # # # # # #
colorStatusBar = (state) ->
	if state is "white"
		s.statusBarBlack.states.switch("hide")
		s.statusBarWhite.states.switch("show")
	else if state is "black"
		s.statusBarBlack.states.switch("show")
		s.statusBarWhite.states.switch("hide")

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
	
# # # # # # # # # # # # # # # # # # # # # # # #
# EVENTS
# # # # # # # # # # # # # # # # # # # # # # # #
btnTrending.on Events.Click, ->
	trendingNC.transition viewTrending, 'left'
	s.navBar.states.switch("show")
	colorStatusBar("white")

btnPDPBack.on Events.Click, ->
	console.log('back clicked')
	trendingNC.transition viewTrending, 'left'
	s.navBar.states.switch("show")
	colorStatusBar("white")
	
btnSettings.on Events.Click, ->
	trendingNC.transition viewSettings,
	s.navBar.states.switch("show")
	colorStatusBar("white")

btnProduct.on Events.Click, ->
	trendingNC.transition viewPDP
	s.navBar.states.switch("hide")
	colorStatusBar("black")








