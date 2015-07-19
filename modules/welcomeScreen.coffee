title = new Layer
	backgroundColor: 'transparent'
	html: 'Framer Scaffold,<br> get your prototype on.'
	style: {
		'color': 'slategray',
		'text-align': 'center',
		'font-family': 'San Francisco Display',
		'font-weight': '500',
		'font-size': '48px',
		'line-height': '120%',
		'padding': '10px'}
	width: Screen.width
	height: 400
	y: 300



spark = new Layer
	image: "images/flat-spark.png"
	scale: 2.5

spark.center()
