var request = require("request")
var cheerio = require("cheerio")

var url = 'http://www.imdb.com/chart/moviemeter'
request(url, function (err, res, body) {
  if (err)
    console.log("Err", err)

  var $ = cheerio.load(body)

  $('.lister-list tr').each(function () {
    var title = $(this).find('.titleColumn a').text().trim();
    var rating = $(this).find('.imdbRating strong').text().trim();

    console.log("Title: " + title + " Rating: " + rating);
  });
  console.log("Done!");
});