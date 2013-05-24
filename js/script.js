var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

jQuery(function() {
  var BlogView, Message, MsgList, MsgView, blogview, getDate;
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

    MsgView.prototype.tagName = 'li';

    MsgView.prototype.initialize = function() {
      _.bindAll(this);
      this.model.bind('change', this.render);
      this.model.bind('remove', this.unrender);
      return this.oldMsg = '';
    };

    MsgView.prototype.events = {
      'click a.moderate': 'moderate',
      'click a.delete': 'remove',
      'click a.validate': 'validate',
      'click a.cancel': 'cancel'
    };

    MsgView.prototype.render = function() {
      $(this.el).html('On ' + this.model.get('created') + ', by ' + this.model.get('author') + ' <a class="btn btn-small btn-info moderate" href="#"><i class="icon-pencil"></i> Moderate</a>' + '<a class="btn btn-small btn-danger delete" ><i class="icon-trash"></i> Delete</a> ');
      $(this.el).append('<a class="btn btn-small validate" href="#" style="display:none;"><i class="icon-check" style="color:green;"></i> Valider</a><a class="btn btn-small cancel" href="#" style="display:none;"><i class="icon-check" style="color:red;"></i> Annuler</a><br />');
      $(this.el).append('<span id="editable">' + this.model.get('msg') + "</span>");
      if (this.model.get("modified")) {
        $(this.el).append("<br />moderated on " + this.model.get('modified'));
      }
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
  BlogView = (function(_super) {

    __extends(BlogView, _super);

    function BlogView() {
      BlogView.__super__.constructor.apply(this, arguments);
    }

    BlogView.prototype.el = $('#blog');

    BlogView.prototype.events = {
      "click button#submit": "addMsg"
    };

    BlogView.prototype.initialize = function() {
      this.collection = new MsgList();
      this.collection.bind('add', this.appendMsg);
      return this.render();
    };

    BlogView.prototype.render = function() {
      $(this.el).append("<label for='nick'>Nickname : </label><input type='text' id='nick' /> <br /><label for='msg'>Message : </label><textarea rows='3' id='msg'></textarea><br /><button id='submit'>Envoyer</button><br />");
      return $(this.el).append("<ul></ul>");
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
      return $('ul', this.el).append(msgView.render().el);
    };

    return BlogView;

  })(Backbone.View);
  Backbone.sync = function(method, model, success, error) {
    return success();
  };
  return blogview = new BlogView;
});
