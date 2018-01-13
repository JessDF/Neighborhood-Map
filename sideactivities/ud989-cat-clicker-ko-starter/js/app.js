var initalCats = [
	{
		clickCount: 0,
		name: 'Tabby',
		imgSrc: 'img/22252709_010df3379e_z.jpg',
		nicknames: ['Tabtab', 'ttt', 'Mr. T', 'tab']
	},
	{
		clickCount: 0,
		name: 'Fred',
		imgSrc: 'img/434164568_fea0ad4013_z.jpg',
		nicknames: ['Freddy', 'fff', 'Mr. F', 'Fre']
	},
	{
		clickCount: 0,
		name: 'Sam',
		imgSrc: 'img/1413379559_412a540d29_z.jpg',
		nicknames: ['Samsam', 'sss', 'Mr. S', 'Sammy']
	},
	{
		clickCount: 0,
		name: 'Bobby',
		imgSrc: 'img/4154543904_6e2428c421_z.jpg',
		nicknames: ['Bob', 'Bobobo', 'Mr. B', 'Bab']
	},
	{
		clickCount: 0,
		name: 'James',
		imgSrc: 'img/9648464288_2516b35537_z.jpg',
		nicknames: ['Jamjam', 'jjj', 'Mr. J', 'Jaja']
	}
];
var Cat = function(data) {
	this.clickCount = ko.observable(data.clickCount);
	this.name = ko.observable(data.name);
	this.imgSrc = ko.observable(data.imgSrc);
	this.nicknames = ko.observable(data.nicknames);
	
	this.title = ko.computed(function(){
		var title;
		var clicks = this.clickCount();
		if(clicks < 10) {
			title = 'Newborn';
		} else if (clicks < 50) {
			title = 'Infant';
		} else if (clicks < 100) {
			title = 'Child';
		} else if (clicks < 200) {
			title = 'Teen';
		} else {
			title = 'Ninja';
		}
		return title;
	}, this);
};

var ViewModel = function () {
	var self = this;
	this.catList = ko.observableArray([]);
	initalCats.forEach(function(catItem){
		self.catList.push(new Cat(catItem));
	});
	
	this.currentCat = ko.observable( this.catList()[0] );
	
	this.incrementCounter = function() {
		//this.clickCount(this.clickCount() + 1);
		self.currentCat().clickCount(self.currentCat().clickCount() + 1);
	};
	
	this.setCat = function(clickedCat) {
		self.currentCat(clickedCat);
	};
};

ko.applyBindings(new ViewModel());