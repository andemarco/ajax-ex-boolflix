$(document).ready(function(){
  $.ajax({
    url: "https://api.themoviedb.org/3/search/movie",
    method: "GET",
    data: {
      api_key: '466183d1b959d57a63f0f76bf58bd387',
      query: 'shining',
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
});


function stampFilms (filmsFounded) {
  for (var i = 0; i < filmsFounded.length; i++) {
    var film = filmsFounded[i]
    console.log(film);
  }
}
