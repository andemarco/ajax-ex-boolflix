$(document).ready(function(){
  $('button').click(function(){
    $('.film_founded li').remove(); //SVUOTO LISTA
    var searchBar = $('input').val() //PRENDO FILM UTENTE
    ajaxCall(searchBar) //ESEGUO CHIAMATA
    $('input').val('') //SVUOTO BARRA DI RICERCA
  })


  //CREO FUNZIONE CHIAMATA PER VISUALIZZARE FILM
  function ajaxCall (searchbar) {
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method: "GET",
      data: {
        api_key: '466183d1b959d57a63f0f76bf58bd387',
        query: searchbar,
        language: "it-IT",
      },
      success: function (data, stato) {
        var filmsFounded = data.results
        stampFilms(filmsFounded)
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
      console.log(film);

      var context = {
        "Titolo": film.title,
        "Titolo_Originale": film.original_title,
        "Lingua_Originale": film.original_language,
        "Voto": film.vote_average,
      };
      var html = template(context);
      $('.film_founded').append(html)
    }
  }
});
