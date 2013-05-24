var Todo = Backbone.Model.extend({
	// defaults:{
	// 	title : 'Mon titre'
	// },
	initialize: function(){
		console.log('hello model');
		this.on('change:title', function(){
			console.log("model title changed");
		});
	},
	validate: function(attrs){
		if (!attrs.done){
			return("you need to define a state");
		}
	}
});

var items = new Todo({});


// };

// var TodoView = Backbone.View.extend({
//   tagName: 'li', // required, but defaults to 'div' if not set
//   // className: 'container', // optional, you can assign multiple classes to this property like so: 'container homepage'
//   // id: 'todos', // optional

//   todoTpl: _.template($('#item-template').html()),

//   events: {
//   	"dblclick label": 'edit',
//   	"keypress .edit": "updateOnEnter",
//   	'blur .edit': 'close'
//   },

//   render: function(){
//   	this.$el.html(this.todoTpl(this.model.toJSON()));
//   	this.input = this.$('.edit');
//   	return this;
//   },

//   edit: function() {
// 		//when toto lbl is dbl clicked
// 	},

// 	close: function() {
// 		//when todo loses focus
// 	},

// 	updateOnEnter: function() {
// 		//each keypress otod in edit mode;
// 	}
// });
// todo2.set({'done' : 'plop'}, {validate: true});
// console.log(todo2.toJSON());
// var view = new Backbone.View();
// view.setElement('<p><a><b>test</b></a></p>');
// console.log(view.$('a b').html()); // outputs "test"
// console.log(todoView.el);
// var Todo = Backbone.Model.extend({
// 	initialize: function(){
// 		console.log('hello model');
// 	}
// });
// var ItemView = Backbone.View.extend({
// 	events: {},
// 	render: function() {
// 		this.$el.html(this.model.toJSON());
// 		return this;
// 	}
// })

// var listView = Backbone.View.extend({
// 	render: function() {
// 		var items = this.models.get('items');
// 		_.each(items, function(item){
// 			var itemView = new ItemView({model: item});
// 			this.$el.append(itemView.render().el);
// 		}, this);
// 	}
// });
var ListView = Backbone.View.extend({
    el: $('body'), // attaches `this.el` to an existing element.
    events: {
    	'click button#add':'addItem'
    },
    initialize:function(){
    	_.bindAll(this, 'render');
    	this.render();
    	this.counter = 0;
    },
    render: function(){
    	$(this.el).append("<button id='add'>Add an item</button><br />");
    	$(this.el).append("<ul></ul>");
    },
    addItem:function(){
    	this.counter++;
    	$('ul', this.el).append("<li>hello world"+this.counter+"</li>");
    }
});
var listview = new ListView();
// var todo2 = new Todo({});
// todo2.set({"title": "toto"}, {validate: true
// });
// console.log((todo2).toJSON());