/*vistas*/
window.HomeView = Backbone.View.extend({

    template:_.template($('#home').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

window.Page1View = Backbone.View.extend({

    template:_.template($('#page1').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

window.Page2View = Backbone.View.extend({

    template:_.template($('#page2').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

/*model*/
Game = Backbone.Model.extend({
    initialize: function(){
        this.game = true;
        this.init_tablero();
        ply1 = new Player;
    },
    defaults: {
        height: '',
        width: '',
        game: false,
    },
    init_tablero: function(){
        this.height = window.innerHeight;
        this.width = window.innerWidth;
    }
});
Player = Backbone.Model.extend({
    initialize: function(){
        this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
    },
    defaults: {
        nom: 'Default title',
        color: '',
    }
})


$(document).ready(function () {
    console.log('document ready');
    game = new game();
});