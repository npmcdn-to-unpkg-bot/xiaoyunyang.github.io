$(function(){

	var ApplicationRouter = Backbone.Router.extend({

		//map url routes to contained methods
		routes: {
			"": "home",
			"home": "home",
			"life": "life",
			"writing": "writing",
			"about": "about",
			"contact": "contact",
			"cost": "cost"
		},

		deselectPills: function(){
			//deselect all navigation pills
			$('ul.pills li').removeClass('active');
		},

		selectPill: function(pill){
			//deselect all navigation pills
			this.deselectPills();
			//select passed navigation pill by selector
			$(pill).addClass('active');
		},

		hidePages: function(){
			//hide all pages with 'pages' class
			$('div.pages').hide();
		},

		showPage: function(page){
			//hide all pages
			this.hidePages();
			//show passed page by selector
			$(page).show();
		},

		home: function() {
			this.showPage('div#home-page');
			this.selectPill('li.home-pill');
		},
		life: function() {
			this.showPage('div#life-page');
			this.selectPill('li.life-pill');
		},
		writing: function() {
			this.showPage('div#writing-page');
			this.selectPill('li.writing-pill');
		},

		about: function() {
			this.showPage('div#about-page');
			this.selectPill('li.about-pill');
		},

		contact: function() {
			this.showPage('div#contact-page');
			this.selectPill('li.contact-pill');
		},
		cost: function() {
			this.showPage('div#cost-page');
			this.selectPill('li.cost-pill');
		},
	});

	var ApplicationView = Backbone.View.extend({

		//bind view to body element (all views should be bound to DOM elements)
		el: $('body'),

		//observe navigation click events and map to contained methods
		events: {
			'click ul.pills li.home-pill a': 'displayHome',
			'click ul.pills li.home-pill a': 'displayLife',
			'click ul.pills li.home-pill a': 'displayWriting',
			'click ul.pills li.about-pill a': 'displayAbout',
			'click ul.pills li.contact-pill a': 'displayContact'
		},

		//called on instantiation
		initialize: function(){
			//set dependency on ApplicationRouter
			this.router = new ApplicationRouter();

			//call to begin monitoring uri and route changes
			Backbone.history.start();
		},

		displayHome: function(){
			//update url and pass true to execute route method
			this.router.navigate("home", true);
		},

		displayLife: function(){
			//update url and pass true to execute route method
			this.router.navigate("life", true);
		},

		displayWriting: function(){
			//update url and pass true to execute route method
			this.router.navigate("writing", true);
		},

		displayAbout: function(){
			//update url and pass true to execute route method
			this.router.navigate("about", true);
		},


		displayContact: function(){
			//update url and pass true to execute route method
			this.router.navigate("contact", true);
		},
		displayCost: function(){
			//update url and pass true to execute route method
			this.router.navigate("cost", true);
		}

	});

	//load application
	new ApplicationView();

});

