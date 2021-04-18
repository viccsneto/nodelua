local request = import("request")
local cheerio = import("cheerio")

local url = 'http://www.imdb.com/chart/moviemeter'

local b = 10

if (b >= 10 and a ~= 70) then
  request(url, function (this, err, res, body) 
    if (not isnull(err)) then
      console.log("Err:", err)
      return false
    end
  
    local S = MKC(cheerio:load(body))
  
    S('.lister-list tr'):each(function (this) 
      local title = S(this):find('.titleColumn a'):text()    
      local rating = S(this):find('.imdbRating strong'):text()
      
      print("Title: "..title.." Rating: "..rating);
    end);
    print("Done!");
  end);
end