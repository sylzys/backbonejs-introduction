(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  jQuery(function() {
    var BlogView, Message, MsgList, MsgListView, MsgView, blogview, getDate, msglst, router;
    getDate = function() {
      var d, day, hour, minute, month, second, year;
      d = new Date();
      month = d.getUTCMonth();
      day = d.getUTCDate();
      year = d.getUTCFullYear();
      hour = d.getHours();
      minute = d.getMinutes();
      second = d.getSeconds();
      return day + "/" + month + "/" + year + " (" + hour + ":" + minute + ":" + second + ")";
    };
    Message = (function(_super) {

      __extends(Message, _super);

      function Message() {
        Message.__super__.constructor.apply(this, arguments);
      }

      Message.prototype.defaults = {
        created: getDate()
      };

      return Message;

    })(Backbone.Model);
    MsgList = (function(_super) {

      __extends(MsgList, _super);

      function MsgList() {
        MsgList.__super__.constructor.apply(this, arguments);
      }

      MsgList.prototype.model = Message;

      return MsgList;

    })(Backbone.Collection);
    MsgView = (function(_super) {

      __extends(MsgView, _super);

      function MsgView() {
        MsgView.__super__.constructor.apply(this, arguments);
      }

      MsgView.prototype.el = $('#viewmsg');

      MsgView.prototype.initialize = function() {
        _.bindAll(this);
        this.template = _.template($('#msg-template').html());
        this.oldMsg = "";
        this.model = this.collection.at(this.id);
        return this.render();
      };

      MsgView.prototype.events = {
        'click a.moderate': 'moderate',
        'click a.delete': 'remove',
        'click a.validate': 'validate',
        'click a.cancel': 'cancel'
      };

      MsgView.prototype.render = function() {
        var renderedContent;
        renderedContent = this.template(this.model.toJSON());
        $('#viewmsg').html(renderedContent);
        return this;
      };

      MsgView.prototype.unrender = function() {
        return $(this.el).remove;
      };

      MsgView.prototype.moderate = function() {
        $('#editable').attr("contenteditable", true);
        $('.validate').show();
        $('.cancel').show();
        this.oldMsg = $('#editable').text();
        return $('#editable').addClass("editable");
      };

      MsgView.prototype.validate = function() {
        this.model.set({
          modified: getDate(),
          msg: $('#editable').text()
        });
        $('#editable').attr("contenteditable", false);
        $('.validate').hide();
        $('.cancel').hide();
        return $('#editable').removeClass("editable");
      };

      MsgView.prototype.cancel = function() {
        $('#editable').attr("contenteditable", false);
        console.log("old : " + this.oldMsg);
        $('#editable').text(this.oldMsg);
        $('.validate').hide();
        $('.cancel').hide();
        this.oldMsg = "";
        return $('#editable').removeClass("editable");
      };

      MsgView.prototype.remove = function() {
        return this.model.destroy();
      };

      return MsgView;

    })(Backbone.View);
    MsgListView = (function(_super) {

      __extends(MsgListView, _super);

      function MsgListView() {
        MsgListView.__super__.constructor.apply(this, arguments);
      }

      MsgListView.prototype.el = $('#msglist');

      MsgListView.prototype.initialize = function() {
        this.template = _.template($('#msglist-template').html());
        _.bindAll(this, 'render');
        this.collection = msglst;
        this.collection.bind('change', this.render);
        this.collection.bind('add', this.render);
        return this.collection.bind('remove', this.render);
      };

      MsgListView.prototype.render = function() {
        var renderedContent, self;
        self = this;
        renderedContent = this.template({
          messages: this.collection.toJSON()
        });
        $(this.el).html(renderedContent);
        return this;
      };

      return MsgListView;

    })(Backbone.View);
    BlogView = (function(_super) {

      __extends(BlogView, _super);

      function BlogView() {
        BlogView.__super__.constructor.apply(this, arguments);
      }

      BlogView.prototype.el = $('#form');

      BlogView.prototype.events = {
        "click button#submit": "addMsg"
      };

      BlogView.prototype.initialize = function() {
        this.collection = msglst;
        return this.collection.bind('add', this.appendMsg);
      };

      BlogView.prototype.addMsg = function() {
        var msg;
        msg = new Message({
          msg: $('#msg').val(),
          author: $('#nick').val(),
          id: this.collection.length
        });
        this.collection.add(msg);
        $('#msg').val('');
        return $('#nick').val('');
      };

      BlogView.prototype.appendMsg = function(msg) {
        var msgView;
        msgView = new MsgView({
          model: msg
        });
        return $('ul', this.el).append(msgListView.render().el);
      };

      return BlogView;

    })(Backbone.View);
    blogview = new BlogView;
    router = new BlogRouter;
    msglst = new MsgList;
    return Backbone.history.start();
  });

}).call(this);
