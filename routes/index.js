module.exports = {
  homepage: (req,res) => {
      res.render('index.ejs');
  },
  titlepage: (req,res) => {
        res.render('titlepage.ejs');
  },
  lyricspage: (req,res) => {
        res.render('lyricspage.ejs');
  },
};
