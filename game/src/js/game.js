/*vistas*/
window.HomeView = Backbone.View.extend({

    template:_.template($('#tmp_game').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});


/*model*/
Game = Backbone.Model.extend({
    initialize: function(){
        console.log('new game');
        this.game = true;
        ply = {};
        ply[0] = new Player();
        ply[1] = new Player();
        this.init_tablero();
    },
    defaults: {
        ply: '',
        height: '',
        width: '',
        game: false,
        width_click: '',
    },
    init_tablero: function(){
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        this.width_click = this.width/25;
        ply[0].set({
                element:'p_ply0',
                height:this.height,
                width:(this.width/2)
        });
        ply[1].set({
                element:'p_ply1',
                height:this.height,
                width:(this.width/2)
        });
        ply[0].set_dimensions();
        ply[1].set_dimensions();
        console.log('init tablero');
    }
});

Player = Backbone.Model.extend({
    initialize: function(){
        this.set({'color' : '#'+Math.floor(Math.random()*16777215).toString(16)});
    },
    defaults: {
        nom: 'Default title',
        color: '',
        height: '',
        width: '',
        element: '',
    },
    set_dimensions: function(){
        console.log(this.get('color'));
        $('#'+this.get('element')).css('background', this.get('color'));
        $('#'+this.get('element')).css('height', this.get('height')+'px');
        $('#'+this.get('element')).css('width', this.get('width')+'px');
    }
});

Zepto(function($){
    game = new Game();
});