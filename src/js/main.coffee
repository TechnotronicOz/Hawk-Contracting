window.hawk =
	views: {}
	models: {}
	collections: {}
	router: {}
	helpers: {}

hawk.helpers.vent = _.extend({}, Backbone.Events)

hawk.helpers.template = (id) ->
	_.template( $('#' + id).html() )


### -----------------------------------------
Model: HomeGalleryView
----------------------------------------- ###
class hawk.models.HomeGalleryView extends Backbone.Model
	defaults:
		imgSmall: ''
		imgLarge: ''
		url: ''
		title: ''
		description: ''



### -----------------------------------------
Collection: HomeGallery
Related Model: HomeGalleryView
----------------------------------------- ###
class hawk.collections.HomeGallery extends Backbone.Collection
	model: hawk.models.HomeGalleryView
	url: 'data/gallery.json'



### -----------------------------------------
View: General App View
----------------------------------------- ###
class hawk.views.App extends Backbone.View

	initialize: ->
		@loadBody()

	render: ->
		@loadBackstretch()
		@setBlockOneHeight()
		@setupParallax()

	loadBody: ->
		$('body').addClass 'loaded'

	loadBackstretch: ->
		$('body').backstretch ["img/bg/bg1.jpg", "img/bg/bg2.jpg", "img/bg/bg3.jpg", "img/bg/bg4.jpg", "img/bg/bg5.jpg", "img/bg/bg6.jpg"],
			duration: 5000
			fade: 750

	setBlockOneHeight: ->
		$('#background').css height: $(window).height()

	setupParallax: ->
		$window = $(window)
		$window.scroll(->
			$('[data-type]').each(->
				$a = $(@)
				$a.data 'speed', $a.attr('data-speed')
				$a.data 'offsetY', parseInt($a.attr('data-offsetY'))
				$a.data 'XPosition', $a.attr('data-Xposition')
			)

			$('[data-type="sprite"]').each(->
				$sprite = $(@)
				yPos = $window.scrollTop() * $sprite.data('XPosition')
				coords = (yPos + $sprite.data('offsetY')) + 'px'
				$sprite.css top: coords

				$sprite.css('position', 'relative') if $sprite.offset().top > $('#background').height() - 300
			)
		)



### -----------------------------------------
View: Home Photo Album
----------------------------------------- ###
class hawk.views.HomeAlbum extends Backbone.View

	initialize: ->
		#console.log 'views.HomePhotos > initialize'
		#@collection.on('add', @addone, @)

	render: ->
		@collection.each(@addOne)
		@displayGallery()
		@loadHoverfold '#grid'

	addOne: (item) ->
		itemView = new hawk.views.HomeAlbumItem model: item
		$('#grid').append(itemView.render().el)

	displayGallery: ->
		$('#grid').fadeIn 'slow'

	loadHoverfold: (args)->
		if not $(args).length then return false
		if Modernizr.csstransforms3d and Modernizr.csstransitions then $(args).hoverfold()



### -----------------------------------------
View: Home Gallery Photo Items
----------------------------------------- ###
class hawk.views.HomeAlbumItem extends Backbone.View

	tagName: 'div'
	className: 'view'

	template: hawk.helpers.template('view-template')

	initialize: ->
		#@model.on('change', @render, @)

	render: ->
		template = @template( @model.toJSON() )
		@$el.html(template)
		return @

	events: ->
		'click a' : 'openModal'

	openModal: (e) ->
		e.preventDefault()
		itemModal = new hawk.views.WorkModal model: @model
		itemModal.render()
		$('#modal').fadeIn()



### -----------------------------------------
View: Home Gallery Photo Items
----------------------------------------- ###
class hawk.views.WorkModal extends Backbone.View

	el: '#modal'

	template: hawk.helpers.template 'modal-tpl'

	initialize: ->
		_.bindAll(this)

	render: ->
		template = @template( @model.toJSON() )
		$modalContent = $('#modal').find('.content')
		$modalContent.append(template).css({ top: '-555px', left: 0, right: 0, bottom: 0, position: 'absolute', opacity: 0 })
		$modalContent.animate({ top: 55, opacity: 1 }, { easing: 'easeOutCirc' });

	events: ->
		'click': 'closeModal'
		'click .next': 'nextItem'
		'click .prev': 'prevItem'

	closeModal: ->
		$modal = $('#modal')
		$modal.find('.content').animate({ top: '1500px', opacity: 0 }, { easing: 'easeInOutQuart' })
		setTimeout(->
			$modal.find('.content').empty()
			$modal.fadeOut()
		,250)

	nextItem: ->
		nextModel = @nextModel()

		if nextModel.cid.length is 0 or typeof nextModel is 'undefined'
			@closeModal
		else
			$('#modal').find('.content').empty()
			itemModal = new hawk.views.WorkModal model: nextModel
			itemModal.render()

	prevItem: ->
		prevModel = @prevModel()

		if prevModel.cid.length is 0 or typeof prevModel is 'undefined'
			@closeModal
		else
			$('#modal').find('.content').empty()
			itemModal = new hawk.views.WorkModal model: prevModel
			itemModal.render()

	nextModel: ->
		@model.collection.at(@model.collection.indexOf(@model) + 1)

	prevModel: ->
		@model.collection.at(@model.collection.indexOf(@model) - 1)


### -----------------------------------------
Router
----------------------------------------- ###
class hawk.router.App extends Backbone.Router

	routes:
		'': 'default'
		'contact': 'openContact'
		'work': 'openWork'
		'work/:id': 'openProject'
		'about': 'openAbout'

	openContact: ->
		#console.log 'openContact'
		$('html, body').animate({ scrollTop: $('#footer').offset().top }, { easing: 'easeOutCirc', duration: 500 })

	openWork: ->
		#console.log 'openWork'
		$('html, body').animate({ scrollTop: $('#gallery').offset().top }, { easing: 'easeOutCirc', duration: 500 })

	openProject: (id) ->
		#console.log 'openProject: ' + id

	openAbout: ->
		#console.log 'openAbout'
		$('html, body').animate({ scrollTop: $('#about').offset().top }, { easing: 'easeOutCirc', duration: 500 })

	default: ->
		#console.log 'default'
		$('html, body').animate({ scrollTop: 0 }, { easing: 'easeOutCirc', duration: 500 })

	initialize: ->
		window.appView = new hawk.views.App()
		window.appView.render()

