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
  artistpage: (req,res) => {
        res.render('artistpage.ejs');
  },
  genrepage: (req,res) => {
        res.render('genrepage.ejs');
  },
  yearpage: (req,res) => {
        res.render('yearpage.ejs');
  },
  filterpage: (req,res) => {
        res.render('filter.ejs');
  },
};
