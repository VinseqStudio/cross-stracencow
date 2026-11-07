// Cała treść wydarzenia w jednym miejscu. Edytuj tutaj, strona przebuduje się sama.
// Dane robocze na XVII edycję (ceny, limity, godziny jak w regulaminie 2026). Pola z `assumed: true` do potwierdzenia.

export const event = {
  name: 'Cross Straceńców',
  edition: 'XVII',
  // Termin XVII edycji: założenie z systemu marki, do potwierdzenia przez organizatora.
  dates: { label: '24 i 25 kwietnia 2027', start: '2027-04-24T16:00:00+02:00', end: '2027-04-25T14:00:00+02:00', assumed: true },
  venue: { name: 'Tor motocrossowy Górków', district: 'Górków', city: 'Głogów' },
  registration: { open: false },
  organizer: { name: 'Sport Górski Jerzy Górski', email: 'biuro@sport-gorski.pl' },
  facebook: 'https://www.facebook.com/Cross-Stracencow-376557065776815/',
  feeFrom: '30 zł',
};

export type Distance = {
  id: string;
  name: string;
  distance: string;
  tier: 'gold' | 'silver' | 'copper';
  difficulty: 1 | 2 | 3 | 4 | 5;
  description: string;
  facts: { label: string; value: string }[];
  price: string;
  limit: string;
  photo: string;
  alt: string;
  first?: boolean;
};

export const distances: Distance[] = [
  {
    id: '10km',
    name: 'Bieg Złoty',
    distance: '10 km',
    tier: 'gold',
    difficulty: 4,
    description: 'Dwie pętle po torze. Rowy z wodą, błoto i podbiegi pokonujesz dwa razy.',
    facts: [
      { label: 'Wiek', value: 'od 16 lat' },
      { label: 'Start', value: 'sobota, 16:00' },
    ],
    price: '50 zł',
    limit: '200 osób',
    photo: '2022/2022-01.jpg',
    alt: 'Zawodnik z numerem 12 biegnie po trawie wzdłuż żółtej taśmy trasy',
  },
  {
    id: '5km',
    name: 'Bieg Srebrny',
    distance: '5 km',
    tier: 'silver',
    difficulty: 3,
    description: 'Jedna pętla z rowami, błotem i piaszczystymi podbiegami. Dobry wybór na pierwszy start.',
    facts: [
      { label: 'Wiek', value: 'od 14 lat' },
      { label: 'Start', value: 'sobota, ok. 16:15' },
    ],
    price: '50 zł',
    limit: '300 osób',
    photo: '2019/2019-03.jpg',
    alt: 'Uśmiechnięta zawodniczka pochyla się na podbiegu, za nią tłum biegaczy',
    first: true,
  },
  {
    id: 'sztafeta',
    name: 'Sztafeta',
    distance: '6 × 1 km',
    tier: 'copper',
    difficulty: 2,
    description: 'Sześć osób z klasy, firmy albo podwórka. Każdy biegnie jedną pętlę. Opłata za całą drużynę.',
    facts: [
      { label: 'Skład', value: '6 osób, dowolny' },
      { label: 'Start', value: 'niedziela, 10:30' },
    ],
    price: '120 zł',
    limit: '10 drużyn',
    photo: '2023/2023-10.jpg',
    alt: 'Drużyna w zielonych koszulkach z numerami startowymi pozuje po biegu',
  },
  {
    id: 'junior',
    name: 'Cross Junior',
    distance: '1,1 km',
    tier: 'copper',
    difficulty: 1,
    description: 'Dzieci do 13 lat biegną 950 m albo 1,1 km. Najmłodsi do 6 lat biegną 450 m razem z rodzicem.',
    facts: [
      { label: 'Wiek', value: 'do 13 lat' },
      { label: 'Start', value: 'niedziela, od 12:00' },
    ],
    price: '30 zł',
    limit: '400 dzieci',
    photo: '2019/2019-14.jpg',
    alt: 'Dzieci z numerami startowymi biegną piaszczystą ścieżką trasy',
  },
];

// Trasa: rozdziały momentu „photo-chapters”.
export const chapters = [
  { title: 'Start na torze motocrossowym', body: 'Pętla prowadzi po torze motocrossowym w Górkowie: piach, trawa i naturalne przeszkody.', photo: '2022/2022-03.jpg', alt: 'Sznur biegaczy na piaszczystej ścieżce pod górę między krzakami' },
  { title: 'Rów z wodą po kolana', body: 'Na trasie są rowy z wodą i błotem. Przejdziesz je także marszem, nikt nie ocenia stylu.', photo: '2022/2022-06.jpg', alt: 'Zawodnicy brodzą przez rów z brązową wodą między czerwonymi bandami' },
  { title: 'Piaszczyste podbiegi i strome zbiegi', body: 'Ziemia trzyma za buty. Kolce i korki są zabronione, wystarczy dobry protektor.', photo: '2022/2022-07.jpg', alt: 'Zawodnik podpiera się ręką, wychodząc z błotnistej kałuży' },
  { title: 'Meta i medal Finisher', body: 'Na mecie każdy dostaje medal Finisher i posiłek. Tu nikt nie przegrywa.', photo: '2022/2022-12.jpg', alt: 'Zawodnik z uniesioną ręką wbiega na niebieski dywan mety' },
];

export const schedule = {
  saturday: [
    { time: '14:00', what: 'Biuro zawodów', sub: 'Pakiety na 5 km i 10 km, namiot przy torze' },
    { time: '15:40', what: 'Rozgrzewka', sub: 'Dla wszystkich uczestników' },
    { time: '15:50', what: 'Odprawa techniczna', sub: 'Strefa startowa, obowiązkowa' },
    { time: '16:00', what: 'Start 10 km', key: true },
    { time: '16:15', what: 'Start 5 km', key: true },
    { time: '18:30', what: 'Dekoracja na scenie' },
  ],
  sunday: [
    { time: '09:00', what: 'Biuro zawodów', sub: 'Pakiety dla sztafet i Cross Junior' },
    { time: '10:30', what: 'Sztafetowe Mistrzostwa Crossu Straceńców', key: true },
    { time: '11:30', what: 'Dekoracja sztafet' },
    { time: '12:00', what: 'Bieg 450 m', sub: 'Dzieci do 6 lat z rodzicem' },
    { time: '12:30', what: 'Bieg 950 m' },
    { time: '13:00', what: 'Bieg 1,1 km' },
    { time: '13:30', what: 'Dekoracja dzieci' },
  ],
};

export const faq = [
  { q: 'Czy dam radę, jeśli nigdy nie biegałem w terenie?', a: 'Tak. Wybierz 5 km: to jedna pętla, a przeszkody pokonasz także marszem.' },
  { q: 'W jakich butach biegać?', a: 'W butach z protektorem, najlepiej trailowych. Buty z kolcami lub korkami są zabronione i oznaczają dyskwalifikację.' },
  { q: 'Gdzie i kiedy odebrać pakiet startowy?', a: 'W biurze zawodów, w namiocie przy torze: w sobotę od 14:00 na 5 i 10 km, w niedzielę od 9:00 dla sztafet i Cross Junior. Weź kod QR z zapisu i dokument tożsamości.' },
  { q: 'Czy na trasie jest woda?', a: 'Tak. Na punktach odżywiania czekają woda, napój izotoniczny i owoce.' },
  { q: 'Jakie są klasyfikacje dodatkowe?', a: 'Na 5 i 10 km prowadzimy Mistrzostwa Głogowa i Mistrzostwa Polski Stowarzyszenia MONAR. Zaznacz je przy zapisie, a przy MONAR podaj nazwę ośrodka.' },
  { q: 'Co jest w pakiecie startowym?', a: 'Numer z chipem, posiłek po biegu, woda i izotonik na trasie, medal Finisher, opieka medyczna, szatnia z depozytem i ubezpieczenie.' },
  { q: 'Czy mogę pobiec razem z dzieckiem?', a: 'W Cross Junior tak: dzieci do 6 lat biegną 450 m z rodzicem, starsze mogą mieć opiekuna na trasie.' },
  { q: 'Czy można zmienić dystans albo odzyskać opłatę?', a: 'Nie. Regulamin nie przewiduje zmiany dystansu ani zwrotu opłaty startowej.' },
  { q: 'Skąd nazwa „Straceńców”?', a: 'Bieg powstał z myślą o ludziach, których ktoś kiedyś spisał na straty, także o podopiecznych Monaru. Na mecie okazuje się, że nikt tu nie jest stracony.' },
];

// Organizatorzy i partnerzy z edycji 2026. Logotypy dojdą jako pliki, na razie nazwy.
export const partners = [
  'KGHM Polska Miedź',
  'Gmina Miejska Głogów',
  'SM Nadodrze',
  'Miejskie Centrum Wspierania Rodziny',
  'Stowarzyszenie MONAR',
  'Brooks',
  'Koło',
  'Korim',
  'True Men Skin Care',
  'PWiK Głogów',
  'NTI',
  'GPK Głogów',
  'Meryk',
  'Military Market',
  'Kazet',
  'FS Complex',
  'Top Poligrafia',
  'Chrobry Głogów',
];
