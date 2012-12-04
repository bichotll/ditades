/*vistas*/
window.NewGame = Backbone.View.extend({

    template:_.template($('#tmp_game').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});
window.EndGame = Backbone.View.extend({

    template:_.template($('#tmp_game_end').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});


/*model*/
Game = Backbone.Model.extend({
    initialize: function(){
        console.log('new game');
        this.attributes.game = true;
        this.init_tablero();
        this.init_binding_p_ply();
    },
    defaults: {
        height: '',
        width: '',
        game: false,
        width_click: '',
    },
    init_tablero: function(){
        this.attributes.game = true;
        this.attributes.height = window.innerHeight;
        this.attributes.width = window.innerWidth;
        this.attributes.width_click = this.attributes.width/30;
        ply[0].set({
                element:'p_ply0',
                height:this.attributes.height,
                width:(this.attributes.width/2)
        });
        ply[1].set({
                element:'p_ply1',
                height:this.attributes.height,
                width:(this.attributes.width/2)
        });
        ply[0].set_dimensions();
        ply[1].set_dimensions();
        console.log('init tablero');
    },
    init_binding_p_ply: function(){
        $('.p_ply').hammer({prevent_default:false}).on('release',function(){
            if ( game.attributes.game == true )
                game.ditada($(this));
            else {
                if(confirm('Vols iniciar un altre joc?')){
                    location.reload();
                }
            }
        });
    },
    ditada: function(element){
        n_ply = parseInt(element.attr('id').replace('p_ply', ''));

        ply[n_ply].attributes.width += game.attributes.width_click;
        ply[n_ply].set_width();

        n_ply = (n_ply+1)%2;

        ply[n_ply].attributes.width -= game.attributes.width_click;
        ply[n_ply].set_width();

        if ( ply[0].attributes.width <= 0 || ply[1].attributes.width <= 0 ){
            game.attributes.game = false;
            alert('joc finalitzat!');
        }
    },
    gameover: function(){
        this.attributes.game = false;
        alert('joc finalitzat');
    }
});

Player = Backbone.Model.extend({
    initialize: function(){
        this.attributes.color = '#'+Math.floor(Math.random()*16777215).toString(16);
        $('body').css('background',this.attributes.color);
    },
    defaults: {
        nom: 'player',
        color: '',
        height: '',
        width: '',
        element: '',
    },
    set_dimensions: function(){
        console.log(this.attributes.color);
        $('#'+this.attributes.element).css('background', this.attributes.color);
        $('#'+this.attributes.element).css('height', this.attributes.height+'px');
        $('#'+this.attributes.element).css('width', this.attributes.width+'px');
    },
    set_width: function(){
        $('#'+this.attributes.element).css('width', this.attributes.width+'px');
        console.log(this.attributes.width);
    }
});

Zepto(function($){
    ply = {};
    ply[0] = new Player();
    ply[1] = new Player();
    game = new Game();
});