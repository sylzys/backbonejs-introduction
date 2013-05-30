 Backbone.sync = function(method, model, success, error){
	success = function(){};
 };
 // function getDate(){
	// var d = new Date();
	// var month = d.getUTCMonth();
	// var day = d.getUTCDate();
	// var year = d.getUTCFullYear();
	// var hour = d.getHours();
	// var minute = d.getMinutes();
	// var second = d.getSeconds();
	// return (day + "/"+month+"/"+year+" at "+hour+ ":" + minute + ":" + second);
 // }
function getDate() {
var d = new Date();
options = {year: "numeric", month: "numeric", day: "numeric",
hour: "numeric", minute: "numeric", second: "numeric",
hour12: false};
return(d.toLocaleString("en-GB", options));
}
 var Message = Backbone.Model.extend({
	defaults: {
		created: getDate()
	}
 });

 var msgList = Backbone.Collection.extend({
	model: Message
 });

 var MsgView = Backbone.View.extend({
	el : $('#viewmsg'),
	events: {
		'click a.moderate': 'moderate',
		'click a.delete': 'remove',
		'click a.validate': 'validate',
		'click a.cancel': 'cancel'
	},
	initialize: function(){
		this.template = _.template($('#msg-template').html());
		/*--- binding ---*/
		this.oldMsg = "";
		this.model = this.collection.at(this.id);
		this.render();
	},
	render: function(){
		var renderedContent = this.template(this.model.toJSON());
		$('#viewmsg').html(renderedContent);
		return this;
	},
	unrender: function(){
		$(this.el).remove();
	},
	moderate: function(){
		this.oldMsg = $('#editable').text();
		$('#editable').attr("contenteditable", true);
		$('#editable').addClass("editable");
		$('.validate').show();
		$('.cancel').show();
	},
	validate: function(){
		this.model.set({modified: getDate(), msg: $('#editable').text()});
		$('#editable').attr("contenteditable", false);
		$('.validate').hide();
		$('.cancel').hide();
		$('#editable').removeClass("editable");
	},
	cancel: function(){
		$('#editable').attr("contenteditable", false);
		$('#editable').text(this.oldMsg);
		$('.validate').hide();
		$('.cancel').hide();
		$('#editable').removeClass("editable");
	},
	remove: function(){
		this.model.destroy();
	}
 });

 var MsgListView = Backbone.View.extend({
	el : $('#msglist'),
	initialize: function(){
		this.template = _.template($('#msglist-template').html());
		/*--- binding ---*/
		_.bindAll(this, 'render');
		this.collection = msglst;
		this.collection.bind('change', this.render);
		this.collection.bind('add', this.render);
		this.collection.bind('remove', this.render);
	},
	render: function(){
		var self = this;
		var renderedContent = this.template({ messages : this.collection.toJSON() });
		$(this.el).html(renderedContent);
		return this;
	}

});

 var BlogView = Backbone.View.extend({
	el: $('#form'),
	events: {
		"click button#submit": "addMsg"
	},
	initialize: function(){
		//this.collection = msglst;
		this.collection.bind('add', this.appendMsg);
	},
	addMsg: function(){
		var msg = new Message({msg: $('#msg').val(), author: $('#nick').val(), id: this.collection.length});
		this.collection.add(msg);
		$('#msg').val('');
		$('#nick').val('');
	},
	appendMsg: function(msg){
		var msgListView = new MsgListView({
			model: msg
		});
		$('ul', this.el).append(msgListView.render().el);
	}
});

 var BlogRouter = Backbone.Router.extend({
	initialize: function(){
		this.collection = new msglist();
		this.blogview = new BlogView({
			collection: this.collection
		});
		this.route("view/:id", "showMsg");
	},
	showMsg: function(id){
		var self = this;
		var msgview = new MsgView({
			collection: self.msglst,
			id : id
		});
	}
 });

 //var msglst = new msgList();
 var router = new BlogRouter();
 Backbone.history.start();

