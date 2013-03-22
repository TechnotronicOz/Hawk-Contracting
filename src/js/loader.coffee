Modernizr.load [
	load: ["//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js", "//use.typekit.net/iyl5mxg.js"]
	complete: ->
		try
			Typekit.load()

		Modernizr.load "js/vendor/jquery-1.9.1.min.js" unless window.jQuery
,

	load: ["js/compiled.js", "js/main.js"]
	complete: ->

		$(->
			appRoot = '/'
			appRouter = new hawk.router.App()
			Backbone.history.start({ pushState: true, root: appRoot })

			$(document).on 'click', 'a:not([data-bypass])', (evt) ->
				href = $(this).attr('href')
				protocol = @protocol + '//'

				if href.slice(protocol.length) isnt protocol
					evt.preventDefault()
					appRouter.navigate href, true

			homeGalleryItems = new hawk.collections.HomeGallery()
			homeGalleryItems.fetch().then(->
				homeAlbum = new hawk.views.HomeAlbum({ collection: homeGalleryItems })
				homeAlbum.render()
			)
		)


]