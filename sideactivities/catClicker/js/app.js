var model = {
    currentCat: null,
	admin: false,
    cats: [
        {
            clickCount : 0,
            name : 'Tabby',
            imgSrc : 'cat_picture1.jpg'
        },
        {
            clickCount : 0,
            name : 'Tiger',
            imgSrc : 'cat_picture2.jpeg'
        },
        {
            clickCount : 0,
            name : 'Scaredy',
            imgSrc : 'cat_picture3.jpeg'
        },
        {
            clickCount : 0,
            name : 'Shadow',
            imgSrc : 'cat_picture4.jpeg'
        },
        {
            clickCount : 0,
            name : 'Sleepy',
            imgSrc : 'cat_picture5.jpeg'
        }
    ]
};


/* ======= Octopus ======= */

var octopus = {

    init: function() {
        // set our current cat to the first one in the list
        model.currentCat = model.cats[0];

        // tell our views to initialize
        catListView.init();
        catView.init();
		adminView.init();
		adminButtonView.init();
    },

    getCurrentCat: function() {
        return model.currentCat;
    },

    getCats: function() {
        return model.cats;
    },

    // set the currently-selected cat to the object passed in
    setCurrentCat: function(cat) {
        model.currentCat = cat;
    },

    // increments the counter for the currently-selected cat
    incrementCounter: function() {
        model.currentCat.clickCount++;
        catView.render();
    },
	
	adminFunc: function() {
		adminView.render();
	},
	
	setAdminValues: function() {
		this.newName = document.getElementById('aName');
        this.newImage = document.getElementById('aUrl');
        this.newCount = document.getElementById('aCount');
		
		var currentCat = octopus.getCurrentCat();
		
		if(currentCat){
			this.newName.value = currentCat.name;
			this.newImage.value = currentCat.imgSrc;
			this.newCount.value = currentCat.clickCount;
		}
	},
	
	saveFunc: function() {
		var currentCat = octopus.getCurrentCat();
		
		this.newName = document.getElementById('aName');
        this.newImage = document.getElementById('aUrl');
        this.newCount = document.getElementById('aCount');
		
		currentCat.name = this.newName.value;
		currentCat.imgSrc = this.newImage.value;
		currentCat.clickCount = this.newCount.value;
		
		catView.render();
		catListView.render();
		
	}
};


/* ======= View ======= */

var catView = {

    init: function() {
        // store pointers to our DOM elements for easy access later
        this.catElem = document.getElementById('cat');
        this.catNameElem = document.getElementById('name');
        this.catImageElem = document.getElementById('img');
        this.countElem = document.getElementById('count');

        // on click, increment the current cat's counter
        this.catImageElem.addEventListener('click', function(){
            octopus.incrementCounter();
        });

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function() {
        // update the DOM elements with values from the current cat
        var currentCat = octopus.getCurrentCat();
        this.countElem.textContent = currentCat.clickCount;
        this.catNameElem.textContent = currentCat.name;
        this.catImageElem.src = currentCat.imgSrc;
		this.adminView = document.getElementById('adminview');
		this.adminView.style.visibility = 'hidden';
		octopus.setAdminValues();
    }
};

var catListView = {

    init: function() {
        // store the DOM element for easy access later
        this.catListElem = document.getElementById('list');

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function() {
        var cat, elem, i;
        // get the cats we'll be rendering from the octopus
        var cats = octopus.getCats();

        // empty the cat list
        this.catListElem.innerHTML = '';

        // loop over the cats
        for (i = 0; i < cats.length; i++) {
            // this is the cat we're currently looping over
            cat = cats[i];

            // make a new cat list item and set its text
            elem = document.createElement('li');
            elem.textContent = cat.name;

            // on click, setCurrentCat and render the catView
            // (this uses our closure-in-a-loop trick to connect the value
            //  of the cat variable to the click event function)
            elem.addEventListener('click', (function(catCopy) {
                return function() {
                    octopus.setCurrentCat(catCopy);
                    catView.render();
                };
            })(cat));

            // finally, add the element to the list
            this.catListElem.appendChild(elem);
        }
    }
};
var adminButtonView = {
	init: function() {
        this.render();
    },
	render: function() {
		this.adminButton = document.getElementById('adminbutton');
        this.adminButton.addEventListener('click', function(){
			octopus.adminFunc();
        });
    }
};
var adminView = {
	init: function() {
        this.adminView = document.getElementById('adminview');
		this.adminView.style.visibility = 'hidden';
		octopus.setAdminValues();
    },
	render: function() {
		this.adminView = document.getElementById('adminview');
		this.adminView.style.visibility = 'visible';
		octopus.setAdminValues();
		
		
		this.saveButton = document.getElementById('savebutton');
        this.saveButton.addEventListener('click', function(){
            octopus.saveFunc();
        });
    }
}
// make it go!
octopus.init();