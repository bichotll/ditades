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
        this.attributes.width_click = Math.round(this.attributes.width/30);
        if (localStorage.player1_name != '')
            $('#n_ply0').html(localStorage.player1_name);
        if (localStorage.player2_name != '')
            $('#n_ply1').html(localStorage.player2_name);
        if (localStorage.player1_wall != '' && localStorage.player1_wall != 'none' && typeof localStorage.player1_wall !== "undefined")
            ply[0].attributes.color = localStorage.player1_wall;
        if (localStorage.player2_wall != '' && localStorage.player2_wall != 'none' && typeof localStorage.player2_wall !== "undefined")
            ply[1].attributes.color = localStorage.player2_wall;
        if (localStorage.player1_sound != '')
            ply[0].attributes.sound = localStorage.player2_wall;
        if (localStorage.player2_sound != '')
            ply[1].attributes.sound = localStorage.player2_wall;
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
        ply[n_ply].play_audio();

        n_ply = (n_ply+1)%2;

        ply[n_ply].attributes.width -= game.attributes.width_click;
        console.log(ply[n_ply].attributes.width);
        ply[n_ply].set_width();
        ply[n_ply].play_audio();

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
    },
    defaults: {
        nom: 'player',
        color: '',
        height: '',
        width: '',
        element: '',
        sound: '',
    },
    set_dimensions: function(){
        console.log(this.attributes.color);
        $('#'+this.attributes.element).css('background', this.attributes.color);
        $('#'+this.attributes.element).css('height', this.attributes.height+'px');
        $('#'+this.attributes.element).css('width', this.attributes.width+'px');
    },
    set_width: function(){
        if (this.attributes.width < 0)
            this.attributes.width = 0;
        $('#'+this.attributes.element).css('width', this.attributes.width+'px');
    },
    play_audio: function(){
        if ( this.attributes.sound != '' && this.attributes.sound != 'none' && typeof this.attributes.sound !== "undefined" ){
            var url = 'file:///android_asset/www/src/sound/'+this.attributes.sound+'.mp3';
            var my_media = new Media(url);
            my_media.play();
        }
    }
});

Zepto(function($){
    ply = {};
    ply[0] = new Player();
    ply[1] = new Player();
    game = new Game();
});