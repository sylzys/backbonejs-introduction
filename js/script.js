 Backbone.sync = function(method, model, success, error){
	success();
  };
function getDate(){
	var d = new Date();
	var month = d.getUTCMonth();
	var day = d.getUTCDate();
	var year = d.getUTCFullYear();
	var hour = d.getHours();
	var minute = d.getMinutes();
	var second = d.getSeconds();
	return (day + "/"+month+"/"+year+" ("+hour+ ":" + minute + ":" + second + ")");
}
var Message = Backbone.Model.extend({
	defaults: {
		created: getDate(),
	},
	validate: function(attrs){
		if (!attrs.author) {
			return ("Please specify an author");
		}
		if (!attrs.msg) {
			return ("Please specify a message");
		}
	}
	initialize:function(){
		this.on("change", "title", function(){
		console.log("my title has changed !");
		});
		this.on("error", function(){
		console.log("NO NO NO !");
		});
	}

});
var msgList = Backbone.Collection.extend({
	model: Message
});

var MsgView = Backbone.View.extend({
	tagName: 'li',
	events: {
		'click a.moderate': 'moderate',
		'click a.delete': 'remove',
		'click a.validate': 'validate',
		'click a.cancel': 'cancel'
	},
	initialize: function(){
		_.bindAll(this, 'render', 'unrender', 'moderate', 'remove');
		this.model.bind('change', this.render);
		this.model.bind('remove', this.unrender);
	},
	render: function(){
		$(this.el).html('On ' + this.model.get('created') + ', by ' + this.model.get('author') + ' <a class="btn btn-small btn-info moderate" href="'+this.model.get('id')+'"><i class="icon-pencil"></i> Moderate</a>'+
			'<a class="btn btn-small btn-danger delete" ><i class="icon-trash"></i> Delete</a> ');
		$(this.el).append('<a class="btn btn-small validate" href="#" style="display:none;"><i class="icon-check" style="color:green;"></i> Valider</a><a class="btn btn-small cancel" href="#" style="display:none;"><i class="icon-check" style="color:red;"></i> Annuler</a><br />');
		$(this.el).append('<span id="editable">'+ this.model.get('msg')+ "</span>");
		if (this.model.get("modified"))
			$(this.el).append("<br />moderated on "+this.model.get('modified'));
		return this;
	},
	unrender: function(){
		$(this.el).remove();
	},
	moderate: function(){
		console.log($('#editable').attr("contenteditable"));
		console.log("moderating");
		$('#editable').attr("contenteditable", true);
		console.log($('#editable').attr("contenteditable"));
		$('.validate').show();
		$('.cancel').show();
	},
	validate: function(){
		console.log("moderated post + " + $('#msg').html());
		this.model.set({modified: getDate(), msg: $('#editable').text()});
		$('#editable').attr("contenteditable", false);
		$('.validate').hide();
		$('.cancel').hide();
	},
	cancel: function(){
		$('#editable').attr("contenteditable", false);
		$('.validate').hide();
		$('.cancel').hide();
	},
	remove: function(){
		this.model.destroy();
	}
});

var BlogView = Backbone.View.extend({
	el: $('#blog'),
	events: {
		"click button#submit": "addMsg"
	},
	initialize: function(){
		this.collection = new msgList();
		this.collection.bind('add', this.appendMsg);
		this.render();
	},
	render: function(){
		var self = this;
		$(this.el).append("Nickname: <input type='text' id='nick' /> <br />Message: <input type='text' id='msg' /><br /><button id='submit'>Envoyer</button><br />");
		$(this.el).append("<ul></ul>");
		_(this.collection.models).each(function(msg){ // in case collection is not empty
		self.appendMsg(msg);
	}, this);
	},
	addMsg: function(){
		var msg = new Message({msg: $('#msg').val(), author: $('#nick').val(), id: this.collection.length});
		this.collection.add(msg);
		$('#msg').val('');
		$('#nick').val('');
	},
	appendMsg: function(msg){
		var msgView = new MsgView({
			model: msg
		});
		$('ul', this.el).append(msgView.render().el);
	}
});
var blogview = new BlogView();