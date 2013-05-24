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
		tagName: 'li'

		initialize: ->
			_.bindAll @ #, render, unrender, moderate, remove
			@model.bind('change', @render);
			@model.bind('remove', @unrender);
			@oldMsg = ''

		events:
			'click a.moderate': 'moderate'
			'click a.delete': 'remove'
			'click a.validate': 'validate'
			'click a.cancel': 'cancel'

		render: ->
			$(@el).html 	'On ' + @model.get('created') + ', by ' + @model.get('author') + ' <a class="btn btn-small btn-info moderate" href="#"><i class="icon-pencil"></i> Moderate</a>'+
			'<a class="btn btn-small btn-danger delete" ><i class="icon-trash"></i> Delete</a> '
			$(@el).append('<a class="btn btn-small validate" href="#" style="display:none;"><i class="icon-check" style="color:green;"></i> Valider</a><a class="btn btn-small cancel" href="#" style="display:none;"><i class="icon-check" style="color:red;"></i> Annuler</a><br />')
			$(@el).append('<span id="editable">'+ @model.get('msg')+ "</span>")
			if @model.get("modified")
				$(@el).append("<br />moderated on "+@model.get('modified'))
			return @

		unrender: ->
			$(@el).remove

		moderate: ->
			$('#editable').attr("contenteditable", true)
			$('.validate').show()
			$('.cancel').show()

		validate: ->
			@model.set({modified: getDate(), msg: $('#editable').text()})
			$('#editable').attr("contenteditable", false)
			$('.validate').hide()
			$('.cancel').hide()

		cancel: ->
			$('#editable').attr("contenteditable", false)
			$('#editable').text(@oldMsg)
			$('.validate').hide()
			$('.cancel').hide()
			@oldMsg = ""

		remove: ->
			@model.destroy()

	class BlogView extends Backbone.View
		el: $('#blog')
		events:
			"click button#submit": "addMsg"
		initialize: ->
			@collection = new MsgList()
			@collection.bind 'add', @appendMsg
			@render()

		render: ->
			$(@el).append("Nickname: <input type='text' id='nick' /> <br />Message: <input type='text' id='msg' /><br /><button id='submit'>Envoyer</button><br />")
			$(@el).append("<ul></ul>")

		addMsg: ->
			msg = new Message msg: $('#msg').val(), author: $('#nick').val(), id: @collection.length
			@collection.add msg
			$('#msg').val('')
			$('#nick').val('')

		appendMsg: (msg) ->
			msgView = new MsgView model: msg
			$('ul', @el).append(msgView.render().el);

	Backbone.sync = (method, model, success, error) ->
		success()
	blogview = new BlogView
