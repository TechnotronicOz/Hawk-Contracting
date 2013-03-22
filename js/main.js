(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.hawk = {
    views: {},
    models: {},
    collections: {},
    router: {},
    helpers: {}
  };

  hawk.helpers.vent = _.extend({}, Backbone.Events);

  hawk.helpers.template = function(id) {
    return _.template($('#' + id).html());
  };

  /* -----------------------------------------
  Model: HomeGalleryView
  -----------------------------------------
  */


  hawk.models.HomeGalleryView = (function(_super) {

    __extends(HomeGalleryView, _super);

    function HomeGalleryView() {
      return HomeGalleryView.__super__.constructor.apply(this, arguments);
    }

    HomeGalleryView.prototype.defaults = {
      imgSmall: '',
      imgLarge: '',
      url: '',
      title: '',
      description: ''
    };

    return HomeGalleryView;

  })(Backbone.Model);

  /* -----------------------------------------
  Collection: HomeGallery
  Related Model: HomeGalleryView
  -----------------------------------------
  */


  hawk.collections.HomeGallery = (function(_super) {

    __extends(HomeGallery, _super);

    function HomeGallery() {
      return HomeGallery.__super__.constructor.apply(this, arguments);
    }

    HomeGallery.prototype.model = hawk.models.HomeGalleryView;

    HomeGallery.prototype.url = 'data/gallery.json';

    return HomeGallery;

  })(Backbone.Collection);

  /* -----------------------------------------
  View: General App View
  -----------------------------------------
  */


  hawk.views.App = (function(_super) {

    __extends(App, _super);

    function App() {
      return App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.initialize = function() {
      return this.loadBody();
    };

    App.prototype.render = function() {
      this.loadBackstretch();
      this.setBlockOneHeight();
      return this.setupParallax();
    };

    App.prototype.loadBody = function() {
      return $('body').addClass('loaded');
    };

    App.prototype.loadBackstretch = function() {
      return $('body').backstretch(["img/bg/bg1.jpg", "img/bg/bg2.jpg", "img/bg/bg3.jpg", "img/bg/bg4.jpg", "img/bg/bg5.jpg", "img/bg/bg6.jpg"], {
        duration: 5000,
        fade: 750
      });
    };

    App.prototype.setBlockOneHeight = function() {
      return $('#background').css({
        height: $(window).height()
      });
    };

    App.prototype.setupParallax = function() {
      var $window;
      $window = $(window);
      return $window.scroll(function() {
        $('[data-type]').each(function() {
          var $a;
          $a = $(this);
          $a.data('speed', $a.attr('data-speed'));
          $a.data('offsetY', parseInt($a.attr('data-offsetY')));
          return $a.data('XPosition', $a.attr('data-Xposition'));
        });
        return $('[data-type="sprite"]').each(function() {
          var $sprite, coords, yPos;
          $sprite = $(this);
          yPos = $window.scrollTop() * $sprite.data('XPosition');
          coords = (yPos + $sprite.data('offsetY')) + 'px';
          $sprite.css({
            top: coords
          });
          if ($sprite.offset().top > $('#background').height() - 300) {
            return $sprite.css('position', 'relative');
          }
        });
      });
    };

    return App;

  })(Backbone.View);

  /* -----------------------------------------
  View: Home Photo Album
  -----------------------------------------
  */


  hawk.views.HomeAlbum = (function(_super) {

    __extends(HomeAlbum, _super);

    function HomeAlbum() {
      return HomeAlbum.__super__.constructor.apply(this, arguments);
    }

    HomeAlbum.prototype.initialize = function() {};

    HomeAlbum.prototype.render = function() {
      this.collection.each(this.addOne);
      this.displayGallery();
      return this.loadHoverfold('#grid');
    };

    HomeAlbum.prototype.addOne = function(item) {
      var itemView;
      itemView = new hawk.views.HomeAlbumItem({
        model: item
      });
      return $('#grid').append(itemView.render().el);
    };

    HomeAlbum.prototype.displayGallery = function() {
      return $('#grid').fadeIn('slow');
    };

    HomeAlbum.prototype.loadHoverfold = function(args) {
      if (!$(args).length) {
        return false;
      }
      if (Modernizr.csstransforms3d && Modernizr.csstransitions) {
        return $(args).hoverfold();
      }
    };

    return HomeAlbum;

  })(Backbone.View);

  /* -----------------------------------------
  View: Home Gallery Photo Items
  -----------------------------------------
  */


  hawk.views.HomeAlbumItem = (function(_super) {

    __extends(HomeAlbumItem, _super);

    function HomeAlbumItem() {
      return HomeAlbumItem.__super__.constructor.apply(this, arguments);
    }

    HomeAlbumItem.prototype.tagName = 'div';

    HomeAlbumItem.prototype.className = 'view';

    HomeAlbumItem.prototype.template = hawk.helpers.template('view-template');

    HomeAlbumItem.prototype.initialize = function() {};

    HomeAlbumItem.prototype.render = function() {
      var template;
      template = this.template(this.model.toJSON());
      this.$el.html(template);
      return this;
    };

    HomeAlbumItem.prototype.events = function() {
      return {
        'click a': 'openModal'
      };
    };

    HomeAlbumItem.prototype.openModal = function(e) {
      var itemModal;
      e.preventDefault();
      itemModal = new hawk.views.WorkModal({
        model: this.model
      });
      itemModal.render();
      return $('#modal').fadeIn();
    };

    return HomeAlbumItem;

  })(Backbone.View);

  /* -----------------------------------------
  View: Home Gallery Photo Items
  -----------------------------------------
  */


  hawk.views.WorkModal = (function(_super) {

    __extends(WorkModal, _super);

    function WorkModal() {
      return WorkModal.__super__.constructor.apply(this, arguments);
    }

    WorkModal.prototype.el = '#modal';

    WorkModal.prototype.template = hawk.helpers.template('modal-tpl');

    WorkModal.prototype.initialize = function() {
      return _.bindAll(this);
    };

    WorkModal.prototype.render = function() {
      var $modalContent, template;
      template = this.template(this.model.toJSON());
      $modalContent = $('#modal').find('.content');
      $modalContent.append(template).css({
        top: '-555px',
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        opacity: 0
      });
      return $modalContent.animate({
        top: 55,
        opacity: 1
      }, {
        easing: 'easeOutCirc'
      });
    };

    WorkModal.prototype.events = function() {
      return {
        'click': 'closeModal',
        'click .next': 'nextItem',
        'click .prev': 'prevItem'
      };
    };

    WorkModal.prototype.closeModal = function() {
      var $modal;
      $modal = $('#modal');
      $modal.find('.content').animate({
        top: '1500px',
        opacity: 0
      }, {
        easing: 'easeInOutQuart'
      });
      return setTimeout(function() {
        $modal.find('.content').empty();
        return $modal.fadeOut();
      }, 250);
    };

    WorkModal.prototype.nextItem = function() {
      var itemModal, nextModel;
      nextModel = this.nextModel();
      if (nextModel.cid.length === 0 || typeof nextModel === 'undefined') {
        return this.closeModal;
      } else {
        $('#modal').find('.content').empty();
        itemModal = new hawk.views.WorkModal({
          model: nextModel
        });
        return itemModal.render();
      }
    };

    WorkModal.prototype.prevItem = function() {
      var itemModal, prevModel;
      prevModel = this.prevModel();
      if (prevModel.cid.length === 0 || typeof prevModel === 'undefined') {
        return this.closeModal;
      } else {
        $('#modal').find('.content').empty();
        itemModal = new hawk.views.WorkModal({
          model: prevModel
        });
        return itemModal.render();
      }
    };

    WorkModal.prototype.nextModel = function() {
      return this.model.collection.at(this.model.collection.indexOf(this.model) + 1);
    };

    WorkModal.prototype.prevModel = function() {
      return this.model.collection.at(this.model.collection.indexOf(this.model) - 1);
    };

    return WorkModal;

  })(Backbone.View);

  /* -----------------------------------------
  Router
  -----------------------------------------
  */


  hawk.router.App = (function(_super) {

    __extends(App, _super);

    function App() {
      return App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.routes = {
      '': 'default',
      'contact': 'openContact',
      'work': 'openWork',
      'work/:id': 'openProject',
      'about': 'openAbout'
    };

    App.prototype.openContact = function() {
      return $('html, body').animate({
        scrollTop: $('#footer').offset().top
      }, {
        easing: 'easeOutCirc',
        duration: 500
      });
    };

    App.prototype.openWork = function() {
      return $('html, body').animate({
        scrollTop: $('#gallery').offset().top
      }, {
        easing: 'easeOutCirc',
        duration: 500
      });
    };

    App.prototype.openProject = function(id) {};

    App.prototype.openAbout = function() {
      return $('html, body').animate({
        scrollTop: $('#about').offset().top
      }, {
        easing: 'easeOutCirc',
        duration: 500
      });
    };

    App.prototype["default"] = function() {
      return $('html, body').animate({
        scrollTop: 0
      }, {
        easing: 'easeOutCirc',
        duration: 500
      });
    };

    App.prototype.initialize = function() {
      window.appView = new hawk.views.App();
      return window.appView.render();
    };

    return App;

  })(Backbone.Router);

}).call(this);
