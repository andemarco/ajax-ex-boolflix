$(document).ready(function(){
  // CLICK SU BUTTON PER RICERCA
  $('button').click(function(){
    findYourMovie();
  });
  // RICERCA CON INVIO
  $('input').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      findYourMovie();
    }
  });

  // CREO FUNZIONE PER COMPORTAMENTO PAGINA
  function findYourMovie() {
    $('.film_founded li').remove(); //SVUOTO LISTA
    var searchBar = $('input').val() //PRENDO FILM UTENTE
    ajaxFilmCall(searchBar) //ESEGUO CHIAMATA FILM
    ajaxTvCall(searchBar)//ESEGUO CHIAMATA SERIE TV
    $('input').val('') //SVUOTO BARRA DI RICERCA
  }

  //CREO FUNZIONE CHIAMATA PER VISUALIZZARE FILM
  function ajaxFilmCall (searchbar) {
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method: "GET",
      data: {
        api_key: '466183d1b959d57a63f0f76bf58bd387',
        query: searchbar,
        language: "it-IT",
      },
      success: function (data, stato) {
        if (data.total_results > 0) {
          var filmsFounded = data.results
          stampFilms(filmsFounded)
        } else {
          alert ('Non abbiamo trovato il film ricercato')
        }

      },
      error: function() {
        alert ('cazzo cerchi?')
      }
    });
  }
  //CREO FUNZIONE CHIAMATA PER VISUALIZZARE SERIE TV
  function ajaxTvCall (searchbar) {
    $.ajax({
      url: "https://api.themoviedb.org/3/search/tv",
      method: "GET",
      data: {
        api_key: '466183d1b959d57a63f0f76bf58bd387',
        query: searchbar,
        language: "it-IT",
      },
      success: function (data, stato) {
        if (data.total_results > 0) {
          var tvFounded = data.results
          stampTv(tvFounded)
        } else {
          alert ('Non abbiamo trovato il film ricercato')
        }
      },
      error: function() {
        alert ('cazzo cerchi?')
      }
    });
  }

  // CREO FUNZIONE PER STAMPARE A SCHERMO FILM TROVATI
  function stampFilms (filmsFounded) {
    var source = document.getElementById("entry-template").innerHTML;
    var template = Handlebars.compile(source);

    for (var i = 0; i < filmsFounded.length; i++) {
      var film = filmsFounded[i]
      var src = 'img/bandiera_' + film.original_language + '.png'
      var vote = Math.ceil((film.vote_average*5)/10);
      var context = {
        "Titolo": film.title,
        "Titolo_Originale": film.original_title,
        "Lingua_Originale": src,
        "stelle": starVote(vote)
      };

      var html = template(context);
      $('.film_founded').append(html);
    }
  }

  // CREO FUNZIONE PER STAMPARE A SCHERMO SERIE TV TROVATE
  function stampTv (tvFounded) {
    var source = document.getElementById("entry-template").innerHTML;
    var template = Handlebars.compile(source);

    for (var i = 0; i < tvFounded.length; i++) {
      var tvSerie = tvFounded[i]
      var src = 'img/bandiera_' + tvSerie.original_language + '.png'
      var vote = Math.ceil((tvSerie.vote_average*5)/10);
      var context = {
        "Titolo": tvSerie.name,
        "Titolo_Originale": tvSerie.original_name,
        "Lingua_Originale": src,
        "stelle": starVote(vote)
      };

      var html = template(context);
      $('.film_founded').append(html);
    }
  }

  function starVote(vote)  {
     var totVoto = " ";
   for (var i = 0; i <5; i++) {
     if ( i < vote) {
       var stellavoto = ' <i class="fas fa-star"></i> ';
     } else {
       var stellavoto = ' <i class="far fa-star"></i> ';
     }
     totVoto = totVoto + stellavoto;
    }
    return totVoto;
  }
});
