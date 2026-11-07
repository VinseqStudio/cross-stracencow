// Edycje biegu. Numery liczone od I edycji w 2011 r. (II edycja: 7 października 2012).
// Daty tylko tam, gdzie podaje je źródło wyników lub regulamin.
const site = 'https://crossstracencow.pl/index.php';

export const editions = [
  { year: 2011, number: 'I' },
  { year: 2012, number: 'II', date: '2012-10-07', galleryUrl: `${site}/galeria/2012-rok/ii-cross-stracencow-07-10-2012` },
  { year: 2013, number: 'III', galleryUrl: `${site}/galeria/2012-rok3/cross-stracencow-2013` },
  { year: 2014, number: 'IV', resultsUrl: `${site}/wyniki/wyniki2014`, resultsLabel: 'crossstracencow.pl', galleryUrl: `${site}/galeria/2014-rok/cross-stracencow-2014` },
  { year: 2015, number: 'V', resultsUrl: `${site}/wyniki/wyniki2015`, resultsLabel: 'crossstracencow.pl', galleryUrl: `${site}/galeria/2015-rok/galeria-cross-stracencow-2015` },
  { year: 2016, number: 'VI', resultsUrl: `${site}/wyniki/wyniki2016`, resultsLabel: 'crossstracencow.pl', galleryUrl: `${site}/galeria/2016-rok/galeria-cross-stracencow-2016` },
  { year: 2017, number: 'VII', resultsUrl: `${site}/wyniki/wyniki2017`, resultsLabel: 'crossstracencow.pl', galleryUrl: `${site}/galeria/2017-rok/dzien-2` },
  { year: 2018, number: 'VIII', resultsUrl: `${site}/wyniki/wyniki-2018`, resultsLabel: 'crossstracencow.pl', galleryUrl: `${site}/galeria/2018-rok/galeria-cross-stracencow-2018` },
  { year: 2019, number: 'IX', resultsUrl: 'http://sts-timing.pl/event/cross-stracencow-5/', resultsLabel: 'STS Timing', galleryUrl: `${site}/galeria/2019/niedziela` },
  { year: 2020, number: 'X', resultsUrl: 'https://plus-timing.pl/wyniki', resultsLabel: 'Plus Timing', galleryUrl: `${site}/galeria/2020-rok/czesc-1-2020` },
  { year: 2021, number: 'XI', resultsUrl: 'http://sts-timing.pl/event/cross-stracencow-2021/', resultsLabel: 'STS Timing' },
  { year: 2022, number: 'XII', resultsUrl: 'https://live.sts-timing.pl/cross2022/', resultsLabel: 'STS Timing', galleryUrl: `${site}/galeria/2022/galeria-1` },
  { year: 2023, number: 'XIII', resultsUrl: 'https://live.sts-timing.pl/cross2023/', resultsLabel: 'STS Timing', galleryUrl: `${site}/galeria/2023-rok/g1-2023` },
  { year: 2024, number: 'XIV', date: '2024-04-28', resultsUrl: 'https://wyniki.datasport.pl/results4696/indexnew.php', resultsLabel: 'Datasport', galleryUrl: `${site}/galeria/galeria-2024/czesc-1` },
  { year: 2025, number: 'XV', date: '2025-04-27', resultsUrl: 'https://wyniki.datasport.pl/results5483/indexnew.php', resultsLabel: 'Datasport', galleryUrl: `${site}/galeria/2025/xv-cross-stracencow` },
  { year: 2026, number: 'XVI', date: '2026-04-25' },
];
