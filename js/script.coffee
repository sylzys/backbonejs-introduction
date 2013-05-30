jQuery ->
	getDate = ->
	  d = new Date()
	  month = d.getUTCMonth()
	  day = d.getUTCDate()
	  year = d.getUTCFullYear()
	  hour = d.getHours()
	  minute = d.getMinutes()
	  second = d.getSeconds()
	  return day + "/" + month + "/" + year + " (" + hour + ":" + minute + ":" + second + ")"

	class Message extends Backbone.Model
		defaults:
			created: getDate()

	class MsgList extends Backbone.Collection
		model: Message

	class MsgView extends Backbone.View
		el: $('#viewmsg'),

		initialize: ->
			_.bindAll @
			@template = _.template $('#msg-template').html();
			@oldMsg = "";
			@model = @collection.at(@id);
			@render();

		events:
			'click a.moderate': 'moderate'
			'click a.delete': 'remove'
			'click a.validate': 'validate'
			'click a.cancel': 'cancel'

		render: ->
			renderedContent = @template(@model.toJSON());
			$('#viewmsg').html(renderedContent);
			@

		unrender: ->
			$(@el).remove

		moderate: ->
			$('#editable').attr("contenteditable", true)
			$('.validate').show()
			$('.cancel').show()
			@oldMsg = $('#editable').text();
			$('#editable').addClass("editable")

		validate: ->
			@model.set({modified: getDate(), msg: $('#editable').text()})
			$('#editable').attr("contenteditable", false)
			$('.validate').hide()
			$('.cancel').hide()
			$('#editable').removeClass("editable")

		cancel: ->
			$('#editable').attr("contenteditable", false)
			console.log "old : "+@oldMsg
			$('#editable').text(@oldMsg)
			$('.validate').hide()
			$('.cancel').hide()
			@oldMsg = ""
			$('#editable').removeClass("editable")

		remove: ->
			@model.destroy()

	class MsgListView extends Backbone.View
		el: $('#msglist')

		initialize: ->
			@template = _.template $('#msglist-template').html();
			_.bindAll(@, 'render')
			@collection = msglst
			@collection.bind 'change', @render
			@collection.bind 'add', @render
			@collection.bind 'remove', @render

		render: ->
			self = @
			renderedContent = @template({ messages : @collection.toJSON() })
			$(@el).html(renderedContent)
			@

	class BlogView extends Backbone.View
		el: $('#form')
		events:
			"click button#submit": "addMsg"
		initialize: ->
			@collection = msglst
			@collection.bind 'add', @appendMsg

		addMsg: ->
			msg = new Message msg: $('#msg').val(), author: $('#nick').val(), id: @collection.length
			@collection.add msg
			$('#msg').val('')
			$('#nick').val('')

		appendMsg: (msg) ->
			msgView = new MsgView model: msg
			$('ul', @el).append(msgListView.render().el)


	blogview = new BlogView
	router = new BlogRouter
	msglst = new MsgList
	Backbone.history.start();
