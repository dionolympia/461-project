module.exports = {
  homepage: (req,res) => {
    let query = "SELECT title FROM song_data LIMIT 10";
    db.query(query, (err,results) => {
      if(err){
        res.redirect('/');
      }
      else{
        res.render('index.ejs', {
          title: "SongSearch.js",
          titles: results
        });
      }
    });
  },
  titlepage: (req,res) => {
    let query = "SELECT title FROM song_data LIMIT 10";
    db.query(query, (err,results) => {
      if(err){
        res.redirect('/');
      }
      else{
        res.render('title.ejs', {
          title: "Titles",
          titles: results
        });
      }
    });
  },
};
