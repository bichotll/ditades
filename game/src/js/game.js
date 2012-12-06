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
        if (localStorage.player1_name != ''){
            $('#n_ply0').html(localStorage.player1_name);
            ply[0].attributes.nom = localStorage.player1_name;
        } else {
            ply[0].attributes.nom = 'PLAYER 1';
        }
        if (localStorage.player2_name != ''){
            $('#n_ply1').html(localStorage.player2_name);
            ply[1].attributes.nom = localStorage.player2_name;
        } else {
            ply[1].attributes.nom = 'PLAYER 2';
        }
        if (localStorage.player1_wall != '' && localStorage.player1_wall != 'none' && typeof localStorage.player1_wall !== "undefined")
            ply[0].attributes.color = localStorage.player1_wall;
        if (localStorage.player2_wall != '' && localStorage.player2_wall != 'none' && typeof localStorage.player2_wall !== "undefined")
            ply[1].attributes.color = localStorage.player2_wall;
        if (localStorage.player1_sound != ''){
            ply[0].attributes.sound = localStorage.player1_sound;
        }
        if (localStorage.player2_sound != ''){
            ply[1].attributes.sound = localStorage.player2_sound;
        }
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
                if(confirm('START NEW GAME?')){
                    location.reload();
                }
            }
        });
    },
    ditada: function(element){
        try{
            navigator.notification.vibrate(50);
        } catch(err) {
            console.log(err);
        }

        n_ply = parseInt(element.attr('id').replace('p_ply', ''));

        ply[n_ply].attributes.width += game.attributes.width_click;
        ply[n_ply].set_width();
        ply[n_ply].play_audio(n_ply);

        n_ply = (n_ply+1)%2;

        ply[n_ply].attributes.width -= game.attributes.width_click;
        ply[n_ply].set_width();

        this.check_gameover();
    },
    check_gameover: function(){
        if ( ply[0].attributes.width <= 0 ){
            this.attributes.game = false;
            alert(ply[0].attributes.nom + ' WIN!');
            ply[0].play_audio();
        } else if ( ply[1].attributes.width <= 0 ){
            this.attributes.game = false;
            alert(ply[1].attributes.nom + ' WIN!');
            ply[1].play_audio();
        }
    }
});

Player = Backbone.Model.extend({
    initialize: function(){
        this.attributes.color = '#'+Math.floor(Math.random()*16777215).toString(16);
    },
    defaults: {
        nom: '',
        color: '',
        height: '',
        width: '',
        element: '',
        sound: '',
    },
    set_dimensions: function(){
        $('#'+this.attributes.element).css('background', this.attributes.color);
        $('#'+this.attributes.element).css('height', this.attributes.height+'px');
        $('#'+this.attributes.element).css('width', this.attributes.width+'px');
    },
    set_width: function(){
        if (this.attributes.width < 0)
            this.attributes.width = 0;
        $('#'+this.attributes.element).css('width', this.attributes.width+'px');
    },
    play_audio: function(n_ply){
        console.log(my_media);
        if ( this.attributes.sound != '' && this.attributes.sound != 'none' && typeof this.attributes.sound !== "undefined" ){
            try{
                my_media[n_ply].stop();
            }catch(err){
                console.log(err);
            }
            try{
                my_media[n_ply].play();
            } catch(err) {
                console.log(err);
            }
        }
    }
});

//set sounds
var my_media = new Array();

document.addEventListener("deviceready",onDeviceReady,false);

function onDeviceReady () {
    if ( localStorage.player1_sound != '' && localStorage.player1_sound != 'none' && typeof localStorage.player1_sound !== "undefined" ){
        try{
            my_media[0] = new Media('file:///android_asset/www/src/sound/'+localStorage.player1_sound+'.mp3');
        } catch(err) {
            console.log(err);    
        }
    }
    if ( localStorage.player2_sound != '' && localStorage.player2_sound != 'none' && typeof localStorage.player2_sound !== "undefined" ){
        try{
            my_media[1] = new Media('file:///android_asset/www/src/sound/'+localStorage.player2_sound+'.mp3');
        } catch(err) {
            console.log(err);    
        }
    }
}


Zepto(function($){
    ply = new Array();
    ply[0] = new Player();
    ply[1] = new Player();
    game = new Game();
});