function playAudio(file) {
    var url = 'file:///android_asset/www/src/sound/'+file+'.mp3';

    var my_media = new Media(url,
        function() {
            console.log("playAudio():Audio Success");
        },
        function(err) {
            console.log("playAudio():Audio Error: "+err+'url:'+url);
    });
    my_media.play();
}

window.Home_View = Backbone.View.extend({

    template:_.template($('#home_tmp').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

window.Start_game_View = Backbone.View.extend({

    template:_.template($('#start_game_tmp').html()),

    events: {
      "blur #player1_name":  "player1_change_name",
      "blur #player2_name":  "player2_change_name",
      "blur #player1_sound":  "player1_change_sound",
      "blur #player2_sound":  "player2_change_sound",
    },

    render:function (eventName) {
        $(this.el).html(this.template());

        //asign vars of the inputs
        this.asign_vars_inputs();

        return this;
    },

    player1_change_name: function(e){
        localStorage.player1_name = this.$('#player1_name').val();
    },
    player2_change_name: function(e){
        localStorage.player2_name = this.$('#player2_name').val();
    },

    player1_change_sound: function(e){
        localStorage.player1_sound = this.$('#player1_sound').val();
        playAudio(localStorage.player1_sound);
    },
    player2_change_sound: function(e){
        localStorage.player2_sound = this.$('#player2_sound').val();
        playAudio(localStorage.player2_sound);
    },

    asign_vars_inputs: function(e){
        this.$('#player1_name').val(localStorage.player1_name);
        this.$('#player2_name').val(localStorage.player2_name);
        if (localStorage.player1_sound != '')
            this.$('#player1_sound').val(localStorage.player1_sound);
        if (localStorage.player2_sound != '')
            this.$('#player2_sound').val(localStorage.player2_sound);
        if (localStorage.player1_wall != 'none')
            this.$('#player1_wall').css('background',localStorage.player1_wall);
        if (localStorage.player2_wall != 'none')
            this.$('#player2_wall').css('background',localStorage.player2_wall);
    },

});

window.Select_wall_View = Backbone.View.extend({

    template:_.template($('#select_wall_tmp').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        //revisem quin usuari es
        if (document.URL.indexOf("start_game/select_wall/1") !== -1)
            n_player = 1;
        else 
            n_player = 2;
        console.log(n_player);
        return this;
    },

    events: {
        'click .marcar_color_player':'wall_selected',
        'click #generar_color':'generar_color',
        'click #none':'none',
        'click #color_generat':'color_generat'
    },

    wall_selected: function(e){
        if ( n_player == 1 )
            localStorage.player1_wall = $(e.currentTarget).css('background-image');
        else
            localStorage.player2_wall = $(e.currentTarget).css('background-image');
    },

    generar_color: function(e){
        $(e.currentTarget).css('background', '#'+Math.floor(Math.random()*16777215).toString(16));
    },

    none: function(e){
        if ( n_player == 1 )
            localStorage.player1_wall = '';
        else
            localStorage.player2_wall = '';
    },

    color_generat: function(e){
        if ( n_player == 1 )
            localStorage.player1_wall = this.$('#generar_color').css('background-color');
        else
            localStorage.player2_wall = this.$('#generar_color').css('background-color');
    }

});

window.About_View = Backbone.View.extend({

    template:_.template($('#about_tmp').html()),

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"home",
        "start_game":"start_game",
        "about":"about",
        "start_game/select_wall/:query":"select_wall",
    },

    initialize:function () {
        // Handle back button throughout the application
        $('.pag_back').live('click', function(event) {
            window.history.back();
            return false;
        });
        this.firstPage = true;
    },

    home:function () {
        console.log('#home');
        this.changePage(new Home_View());
    },

    start_game:function () {
        console.log('#start_game');
        this.changePage(new Start_game_View());
    },

    select_wall:function () {
        console.log('#select_wall');
        this.changePage(new Select_wall_View());
    },

    about:function () {
        console.log('#about');
        this.changePage(new About_View());
    },

    changePage:function (page) {
        $(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    }

});

$(document).ready(function () {
    console.log('document ready');
    app = new AppRouter();
    Backbone.history.start();
});