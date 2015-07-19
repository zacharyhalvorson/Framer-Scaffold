# Welcome to Framer
# Learn prototyping at http://framerjs.com/learn

# Create a background
background = new BackgroundLayer backgroundColor: "#DDD"

# Create a layer
square = new Layer
	width: 250, height: 250
	backgroundColor: "#FFF", borderRadius: 25
square.center()

# Create additional states
square.states.add
	second: scale: 1.5, rotation: 225
	third:  scale: 0.5, blur: 25, borderRadius: 250

# Create a spring animation
square.states.animationOptions =
	curve: "spring(250,25,0)"

# Animate to the next state on click
square.on Events.Click, ->
	square.states.next()