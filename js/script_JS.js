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
	return (day + "/"+month+"/"+year+" at "+hour+ ":" + minute + ":" + second);
 }
 var Message = Backbone.Model.extend({
	defaults: {
		created: getDate()
	},
	validate: function(attrs){
		if (!attrs.author) {
			return ("Please specify an author");
		}
		if (!attrs.msg) {
			return ("Please specify a message");
		}
	}
 });
 var msgList = Backbone.Collection.extend({
	model: Message
 });

 var MsgView = Backbone.View.extend({
	el : $('#msglist'),
	events: {
		'click a.moderate': 'moderate',
		'click a.delete': 'remove',
		'click a.validate': 'validate',
		'click a.cancel': 'cancel'
	},
	initialize: function(){
		this.template = _.template($('#item-template').html());

		/*--- binding ---*/
		this.collection = msglst;
		this.oldMsg = "";
		_.bindAll(this, 'render');
		this.collection.bind('change', this.render);
		this.collection.bind('add', this.render);
		this.collection.bind('remove', this.render);
	},
	render: function(){
		var renderedContent = this.template({ messages : this.collection.toJSON() });
		$(this.el).html(renderedContent);
		return this;
	},
	unrender: function(){
		$(this.el).remove();
	},
	moderate: function(){
		console.log($('#editable').attr("contenteditable"));
		console.log("moderating");
		this.oldMsg = $('#editable').text();
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
		$('#editable').text(this.oldMsg);
		$('.validate').hide();
		$('.cancel').hide();
	},
	remove: function(){
		this.model.destroy();
	}
 });

 var BlogView = Backbone.View.extend({
	el: $('#form'),
	events: {
		"click button#submit": "addMsg"
	},
	initialize: function(){
		this.collection = msglst;
		this.collection.bind('add', this.appendMsg);
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
 var msglst = new msgList();
 var blogview = new BlogView();