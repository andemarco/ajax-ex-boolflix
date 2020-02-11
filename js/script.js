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
    $('.film_founded div').remove(); //SVUOTO LISTA
    $('.tv_series div').remove(); //SVUOTO LISTA
    var searchBar = $('input').val() //PRENDO FILM UTENTE
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
        alert ('Non ha indicato il titolo da ricercare')
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
      var img = thisResults.poster_path;
      var context = {
        "Titolo": title,
        "Titolo_Originale": originalTitle,
        "Lingua_Originale":stampFlag(thisResults.original_language),
        "stelle": starVote(thisResults.vote_average),
        "type" : type,
        "poster" : printPoster(img),
        "Riassunto" : thisResults.overview,
        "data-film": thisResults.id,
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

  // FUNZIONE STAMPA POSTER
  function printPoster (img) {
    var link = '<img class="lang" src="https://image.tmdb.org/t/p/w185' + img + '" alt="en">';

    if (link == '<img class="lang" src="https://image.tmdb.org/t/p/w185null" alt="en">') {
      link = '<img class="lang" src="https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png"alt="en">'
    } else {
      link = '<img class="lang" src="https://image.tmdb.org/t/p/w185' + img + '" alt="en">';
    }
    return link
  }

  // FACCIO CHIAMATA PER ATTORI
  $(document).on("click",".info",function () {
    var id = $(this).parent().parent('.film_box').attr("data-film");
    var title = $(this).siblings('.title').text();
    $('.more_info').addClass('visible');
    var sinossi = $(this).parent().parent('.film_box').find('.sinossi').text();
    console.log(sinossi);
    $.ajax({
      url : "https://api.themoviedb.org/3/movie/"+id+"/credits",
      method : "GET",
      data : {
        api_key :"466183d1b959d57a63f0f76bf58bd387",
      },
      success : function (data) {
        var attori = data.cast
        for (var i = 0; i < 8; i++) {
          var source = $("#moreinfo-template").html();
          var template = Handlebars.compile(source);
          var image = "https://image.tmdb.org/t/p/w185" +  attori[i].profile_path;
          var context = {
            actors : attori[i].name,
            image : image,
          }
          var html = template(context);
          $(".more_info").append(html)
        }
        var source = $("#moreinfotitle-template").html();
        var template = Handlebars.compile(source);
        var context = {
          'Titolo': title,
          'Riassunto': sinossi
        }
        var html = template(context);
        $(".more_info").prepend(html)
      },
      error : function (request,state,error) {
        alert("errore e"+error)
      }
    });
  });
  $(document).on("click",".more_info",function () {
    if ($('.more_info').hasClass('visible') == true) {
      $('.more_info').removeClass('visible');
      $('.more_info div').remove();
    } else {
        $('.more_info').hasClass('visible') == false
    }
  });
});
