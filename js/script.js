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
    $('.tv_series li').remove(); //SVUOTO LISTA
    // var searchBar = $('input').val() //PRENDO FILM UTENTE
    var searchBar = 'rocky';
    ajaxFilmCall(searchBar) //ESEGUO CHIAMATA FILM
    ajaxTvCall(searchBar)//ESEGUO CHIAMATA SERIE TV
    $('input').val('') //SVUOTO BARRA DI RICERCA
  }

  //CREO FUNZIONE CHIAMATA PER VISUALIZZARE FILM
  function ajaxFilmCall (searchbar) {
    $.ajax({
      url: 'https://api.themoviedb.org/3/search/movie',
      method: "GET",
      data: {
        api_key: '466183d1b959d57a63f0f76bf58bd387',
        query: searchbar,
        language: "it-IT",
      },
      success: function (data, stato) {
        if (data.total_results > 0) {
          var filmsFounded = data.results
          stampFilms('film', filmsFounded)
        } else {
          printNoResult($('.film_founded'))
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
          stampFilms('tv', tvFounded)
        } else {
          printNoResult($('.tv_series'))
        }
      },
      error: function() {
        alert ('cazzo cerchi?')
      }
    });
  }

  // CREO FUNZIONE PER STAMPARE A SCHERMO TITOLI TROVATI
  function stampFilms (type, results) {
    var source = document.getElementById("entry-template").innerHTML;
    var template = Handlebars.compile(source);
    var title;
    var originalTitle;

    for (var i = 0; i < results.length; i++) {
      var thisResults = results[i]

      if(type == 'film') {
        originalTitle = thisResults.original_title;
        title = thisResults.title;
        var container = $('.film_founded');
      } else if (type == 'tv'){
        originalTitle = thisResults.original_name;
        title = thisResults.name;
        var container = $('.tv_series');
      }

      var context = {
        "Titolo": title,
        "Titolo_Originale": originalTitle,
        "Lingua_Originale":stampFlag(thisResults.original_language),
        "stelle": starVote(thisResults.vote_average),
        "type" : type,
        "poster" :  '<img class="lang" src="https://image.tmdb.org/t/p/w185' + thisResults.poster_path + '" alt="en">',
        "Riassunto" : thisResults.overview,
      };

      var html = template(context);
      container.append(html);
    }
  }

  // FUNZIONE PER VOTAZIONE A STELLE
  function starVote(vote)  {
    var vote = Math.ceil((vote*5)/10);
    var stellavoto = '';
   for (var i = 1; i <= 5; i++) {
     if ( i <= vote) {
       stellavoto += ' <i class="fas fa-star"></i> ';
     } else {
       stellavoto += ' <i class="far fa-star"></i> ';
     }
    }
    return stellavoto;
  }
});

// FUNZIONE PER STAMPA BANDIERE
function stampFlag(lang) {
  var languages = ['en', 'es', 'fr', 'it']

  if (languages.includes(lang)) {
    lang = '<img class="lang" src="img/bandiera_' + lang + '.png" alt="en">';
  }
  return lang
}

//FUNZIONE PER NESSUN RISULTATO OTTENUTO
function printNoResult(container) {
  var source = $('#noresult-template').html();
  var template = Handlebars.compile(source);
  var html = template();
  container.append(html);
}
