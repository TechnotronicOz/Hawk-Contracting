(function() {

  Modernizr.load([
    {
      load: ["//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js", "//use.typekit.net/iyl5mxg.js"],
      complete: function() {
        try {
          Typekit.load();
        } catch (_error) {}
        if (!window.jQuery) {
          return Modernizr.load("js/vendor/jquery-1.9.1.min.js");
        }
      }
    }, {
      load: ["js/compiled.js", "js/main.js"],
      complete: function() {
        return $(function() {
          var appRoot, appRouter, homeGalleryItems;
          appRoot = '/';
          appRouter = new hawk.router.App();
          Backbone.history.start({
            pushState: true,
            root: appRoot
          });
          $(document).on('click', 'a:not([data-bypass])', function(evt) {
            var href, protocol;
            href = $(this).attr('href');
            protocol = this.protocol + '//';
            if (href.slice(protocol.length) !== protocol) {
              evt.preventDefault();
              return appRouter.navigate(href, true);
            }
          });
          homeGalleryItems = new hawk.collections.HomeGallery();
          return homeGalleryItems.fetch().then(function() {
            var homeAlbum;
            homeAlbum = new hawk.views.HomeAlbum({
              collection: homeGalleryItems
            });
            return homeAlbum.render();
          });
        });
      }
    }
  ]);

}).call(this);
