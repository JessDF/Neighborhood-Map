var Cat = function() {
	this.clickCount = ko.observable(0);
	this.name = ko.observable('Tabby');
	this.imgSrc = ko.observable('img/22252709_010df3379e_z.jpg');
	this.nicknames = ko.observable(['Tabtab', 'ttt', 'Mr. T', 'tab']);
	
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
	this.currentCat = ko.observable( new Cat() );
	this.incrementCounter = function() {
		this.clickCount(this.clickCount() + 1);
	};
};

ko.applyBindings(new ViewModel());