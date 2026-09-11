// constants.js — Massive Category Expansion with Contextual Hints
// Each word has a hint object for smarter imposter hints

// ─── VIDEO GAMES ────────────────────────────────────────────────
const VIDEO_GAMES = [
  { word: "FreeFire", hint: "Battle royale mobile game by Garena" },
  { word: "PUBG", hint: "PlayerUnknown's battle royale" },
  { word: "BGMI", hint: "Indian version of a famous battle royale" },
  { word: "Valorant", hint: "5v5 tactical shooter by Riot Games" },
  { word: "Fortnite", hint: "Build and shoot battle royale" },
  { word: "GTA V", hint: "Open world crime game, Los Santos" },
  { word: "Minecraft", hint: "Block-building sandbox game" },
  { word: "Call of Duty", hint: "FPS war franchise, Modern Warfare" },
  { word: "Apex Legends", hint: "Hero-based battle royale by EA" },
  { word: "Among Us", hint: "Social deduction game in space" },
  { word: "Clash of Clans", hint: "Build village, train troops, clan wars" },
  { word: "Clash Royale", hint: "Real-time card battle game" },
  { word: "League of Legends", hint: "5v5 MOBA by Riot Games" },
  { word: "Dota 2", hint: "Valve's complex MOBA" },
  { word: "Genshin Impact", hint: "Open-world gacha RPG, Teyvat" },
  { word: "Roblox", hint: "User-generated game platform" },
  { word: "FIFA", hint: "Football/soccer simulation game" },
  { word: "Elden Ring", hint: "FromSoftware open-world RPG" },
  { word: "God of War", hint: "Kratos, Greek/Norse mythology" },
  { word: "The Last of Us", hint: "Post-apocalyptic survival story" },
  { word: "Red Dead Redemption", hint: "Wild West open world by Rockstar" },
  { word: "Spider-Man", hint: "Swing through New York City" },
  { word: "Subway Surfers", hint: "Endless runner, dodge trains" },
  { word: "Temple Run", hint: "Endless runner, escape the temple" },
  { word: "Candy Crush", hint: "Match-3 puzzle game" },
  { word: "CSGO", hint: "Counter-Strike tactical FPS" },
  { word: "Overwatch", hint: "Hero-based team shooter by Blizzard" },
  { word: "Pokemon", hint: "Catch and battle creatures" },
  { word: "Mario", hint: "Nintendo plumber, mushroom kingdom" },
  { word: "Zelda", hint: "Link, Hyrule, Triforce" },
];

// ─── SPORTS ─────────────────────────────────────────────────────
const SPORTS = [
  { word: "Cricket", hint: "Bat and ball, 11 players, overs" },
  { word: "Football", hint: "The beautiful game, 90 minutes" },
  { word: "Badminton", hint: "Shuttlecock and racket sport" },
  { word: "Tennis", hint: "Grand Slam, racket sport, love-30" },
  { word: "Basketball", hint: "Dunk, dribble, NBA" },
  { word: "Volleyball", hint: "Net game, spike and serve" },
  { word: "Hockey", hint: "India's national game, stick and ball" },
  { word: "Kabaddi", hint: "Raid and tackle, Pro Kabaddi" },
  { word: "Wrestling", hint: "Mat sport, pins and holds" },
  { word: "Boxing", hint: "Gloves, rounds, knockout" },
  { word: "Swimming", hint: "Water sport, strokes and laps" },
  { word: "Athletics", hint: "Track and field events" },
  { word: "Formula 1", hint: "Fast cars, Grand Prix, pit stops" },
  { word: "Table Tennis", hint: "Ping pong, small ball and paddle" },
  { word: "Archery", hint: "Bow and arrow, bullseye" },
  { word: "Cycling", hint: "Tour de France, pedals" },
  { word: "Gymnastics", hint: "Flips and balance beam" },
  { word: "Golf", hint: "Clubs, holes, par and birdie" },
  { word: "Chess", hint: "Strategy board game, checkmate" },
  { word: "Kho Kho", hint: "Indian chase tag game" },
  { word: "Virat Kohli", hint: "Indian cricket captain, RCB" },
  { word: "MS Dhoni", hint: "Captain Cool, helicopter shot" },
  { word: "Sachin Tendulkar", hint: "God of Cricket, 100 centuries" },
  { word: "Lionel Messi", hint: "Argentine GOAT, World Cup 2022" },
  { word: "Cristiano Ronaldo", hint: "CR7, SIUUU celebration" },
  { word: "Neymar", hint: "Brazilian football star, skills king" },
  { word: "Usain Bolt", hint: "Fastest man alive, 9.58s 100m" },
  { word: "PV Sindhu", hint: "Indian badminton Olympic medalist" },
  { word: "Neeraj Chopra", hint: "Indian javelin gold medalist" },
  { word: "Roger Federer", hint: "Swiss tennis maestro, 20 Grand Slams" },
];

// ─── TAMIL MOVIES ───────────────────────────────────────────────
const TAMIL_MOVIES = [
  { word: "Vada Chennai", hint: "Dhanush gangster trilogy, North Madras" },
  { word: "Master", hint: "Vijay vs Vijay Sethupathi, juvenile home" },
  { word: "Vikram", hint: "Kamal Haasan, action thriller, LOK" },
  { word: "Ponniyin Selvan", hint: "Mani Ratnam, Chola dynasty epic" },
  { word: "Jailer", hint: "Rajinikanth as a retired jailer" },
  { word: "Enthiran", hint: "Rajini as a robot, Shankar directed" },
  { word: "Ghilli", hint: "Vijay, kabaddi, Trisha" },
  { word: "Kaththi", hint: "Vijay double role, social message" },
  { word: "Mersal", hint: "Vijay triple role, medical thriller" },
  { word: "Theri", hint: "Vijay as cop protecting daughter" },
  { word: "Mankatha", hint: "Ajith as a conman, heist" },
  { word: "Vedalam", hint: "Ajith protecting sister, emotional action" },
  { word: "Viswasam", hint: "Ajith village action drama" },
  { word: "Asuran", hint: "Dhanush, caste drama, Vetrimaaran" },
  { word: "Karnan", hint: "Dhanush village uprising, Mari Selvaraj" },
  { word: "Soorarai Pottru", hint: "Suriya as budget airline founder" },
  { word: "Jai Bhim", hint: "Suriya legal drama, tribal justice" },
  { word: "Kaithi", hint: "Karthi, no heroine, no songs, chase thriller" },
  { word: "96", hint: "Vijay Sethupathi, Trisha, school reunion love" },
  { word: "Pariyerum Perumal", hint: "Law student, caste discrimination" },
  { word: "Rocketry", hint: "R Madhavan as ISRO scientist Nambi" },
  { word: "Anbe Sivam", hint: "Kamal, Madhavan, communism, comedy" },
  { word: "Pithamagan", hint: "Vikram as a graveyard dweller" },
  { word: "Kaakha Kaakha", hint: "Suriya cop thriller, Gautham Menon" },
  { word: "Sivaji", hint: "Rajini, software millionaire, Shankar" },
];

// ─── TELUGU MOVIES ──────────────────────────────────────────────
const TELUGU_MOVIES = [
  { word: "Baahubali", hint: "Rajamouli epic, Why did Kattappa..." },
  { word: "RRR", hint: "Ram Charan & NTR Jr, freedom fighters" },
  { word: "Pushpa", hint: "Allu Arjun, smuggling, Thaggede Le" },
  { word: "Arjun Reddy", hint: "Vijay Deverakonda, intense love story" },
  { word: "Ala Vaikunthapurramuloo", hint: "Allu Arjun, switched at birth" },
  { word: "Eega", hint: "Rajamouli, man reborn as a fly for revenge" },
  { word: "Magadheera", hint: "Ram Charan, warrior reincarnation" },
  { word: "Pokiri", hint: "Mahesh Babu undercover cop" },
  { word: "Athadu", hint: "Mahesh Babu hired assassin" },
  { word: "Srimanthudu", hint: "Mahesh Babu adopts a village" },
  { word: "Rangasthalam", hint: "Ram Charan, village drama, 1980s" },
  { word: "Jersey", hint: "Nani, cricketer comeback story" },
  { word: "Mahanati", hint: "Biopic of actress Savitri" },
  { word: "Bahubali 2", hint: "Rajamouli sequel, epic war conclusion" },
  { word: "Chatrapathi", hint: "Prabhas, refugee fights for justice" },
  { word: "Mirchi", hint: "Prabhas, land dispute action drama" },
  { word: "Businessman", hint: "Mahesh Babu, underworld, Puri Jagannadh" },
  { word: "Fidaa", hint: "Varun Tej, Sai Pallavi, Telangana village" },
  { word: "Kushi", hint: "Vijay Deverakonda, Samantha, romantic drama" },
  { word: "Saaho", hint: "Prabhas, action thriller, big budget" },
];

// ─── MALAYALAM MOVIES ───────────────────────────────────────────
const MALAYALAM_MOVIES = [
  { word: "Drishyam", hint: "Mohanlal, perfect crime cover-up" },
  { word: "Premam", hint: "Nivin Pauly, three love stories" },
  { word: "Lucifer", hint: "Mohanlal, political thriller, Prithviraj directed" },
  { word: "Minnal Murali", hint: "Tovino, Malayalam superhero, lightning" },
  { word: "Kumbalangi Nights", hint: "Four brothers, Kochi backwaters" },
  { word: "Bangalore Days", hint: "Dulquer, Nazriya, Nivin, three cousins" },
  { word: "Maheshinte Prathikaaram", hint: "Fahadh, no chappal until revenge" },
  { word: "Virus", hint: "Aashiq Abu, Nipah virus outbreak in Kerala" },
  { word: "Jallikattu", hint: "Lijo, buffalo chase in a village" },
  { word: "Uyare", hint: "Parvathy, acid attack survivor, pilot" },
  { word: "Sudani from Nigeria", hint: "Football player from Africa in Malappuram" },
  { word: "Manjummel Boys", hint: "Friends trapped in Guna Caves" },
  { word: "Aavesham", hint: "Fahadh as a gangster, Bangalore backdrop" },
  { word: "2018", hint: "Kerala floods, real-life rescue drama" },
  { word: "Joji", hint: "Fahadh, Macbeth adaptation, family murder" },
  { word: "Trance", hint: "Fahadh as a fake pastor" },
  { word: "Charlie", hint: "Dulquer, wanderer, mysterious love story" },
  { word: "Ustad Hotel", hint: "Dulquer, chef, grandfather's hotel" },
  { word: "Amen", hint: "Fahadh, church band rivalry, comedy" },
  { word: "Malik", hint: "Fahadh, political saga, coastal community" },
  { word: "Nayattu", hint: "Three cops on the run, political thriller" },
  { word: "Churuli", hint: "Lijo, strange village, mystery thriller" },
  { word: "Kappela", hint: "Anna Ben, wrong number love story" },
  { word: "Android Kunjappan", hint: "Robot caretaker for old father" },
  { word: "Romancham", hint: "Ouija board ghost comedy" },
];

// ─── HINDI MOVIES ───────────────────────────────────────────────
const HINDI_MOVIES = [
  { word: "Dangal", hint: "Aamir Khan, wrestler father, Phogat sisters" },
  { word: "3 Idiots", hint: "Aamir Khan, engineering college, All is Well" },
  { word: "PK", hint: "Aamir Khan as an alien questioning religion" },
  { word: "Jawan", hint: "SRK, vigilante with masks, Atlee directed" },
  { word: "Pathaan", hint: "SRK spy action, Siddharth Anand" },
  { word: "Sholay", hint: "Amitabh & Dharmendra, Gabbar, classic western" },
  { word: "Lagaan", hint: "Cricket match against British, Aamir Khan" },
  { word: "Dilwale Dulhania", hint: "SRK, Kajol, London to Punjab love" },
  { word: "Kabhi Khushi Kabhie Gham", hint: "Big Bollywood family drama, K3G" },
  { word: "Rang De Basanti", hint: "Aamir Khan, youth revolution, patriotism" },
  { word: "Gangs of Wasseypur", hint: "Anurag Kashyap, coal mafia, revenge saga" },
  { word: "Andhadhun", hint: "Ayushmann, blind pianist murder mystery" },
  { word: "Drishyam", hint: "Ajay Devgn, crime cover-up, Hindi remake" },
  { word: "Bajrangi Bhaijaan", hint: "Salman Khan, takes mute girl to Pakistan" },
  { word: "Sultan", hint: "Salman Khan as a wrestler" },
  { word: "War", hint: "Hrithik vs Tiger, spy action" },
  { word: "Dhoom", hint: "Bike chases, heist franchise" },
  { word: "Zindagi Na Milegi Dobara", hint: "Three friends, Spain road trip" },
  { word: "Barfi!", hint: "Ranbir Kapoor, deaf-mute, heartfelt love" },
  { word: "Queen", hint: "Kangana, solo honeymoon in Paris" },
  { word: "Gully Boy", hint: "Ranveer Singh, Mumbai rapper, Apna Time Aayega" },
  { word: "Padmaavat", hint: "Ranveer as Khilji, Deepika as Padmavati" },
  { word: "Stree", hint: "Horror comedy, O Stree Kal Aana" },
  { word: "Tumbbad", hint: "Horror, treasure, ancestral curse" },
  { word: "Animal", hint: "Ranbir Kapoor, dark father-son drama" },
];

// ─── ENGLISH MOVIES ─────────────────────────────────────────────
const ENGLISH_MOVIES = [
  { word: "Inception", hint: "Nolan, dreams within dreams, spinning top" },
  { word: "Interstellar", hint: "Nolan, space travel, time dilation, love" },
  { word: "The Dark Knight", hint: "Batman vs Joker, Why so serious?" },
  { word: "Avengers Endgame", hint: "Marvel, I am Iron Man, time heist" },
  { word: "Titanic", hint: "Jack and Rose, iceberg, 1912 ship" },
  { word: "Avatar", hint: "Pandora, blue Na'vi, James Cameron" },
  { word: "The Matrix", hint: "Neo, red pill blue pill, simulation" },
  { word: "Gladiator", hint: "Russell Crowe, Roman colosseum revenge" },
  { word: "Joker", hint: "Joaquin Phoenix, Gotham, society's outcast" },
  { word: "Parasite", hint: "Bong Joon-ho, rich vs poor, basement" },
  { word: "Dune", hint: "Villeneuve, desert planet, sandworms, spice" },
  { word: "Oppenheimer", hint: "Nolan, atomic bomb, J. Robert" },
  { word: "Spider-Man No Way Home", hint: "Three Spider-Men, multiverse" },
  { word: "Black Panther", hint: "Wakanda Forever, T'Challa" },
  { word: "Top Gun Maverick", hint: "Tom Cruise, fighter jets sequel" },
  { word: "John Wick", hint: "Keanu Reeves, assassin, dog" },
  { word: "The Shawshank Redemption", hint: "Prison escape, hope, Tim Robbins" },
  { word: "Fight Club", hint: "Brad Pitt, first rule of..." },
  { word: "Pulp Fiction", hint: "Tarantino, non-linear, Royale with Cheese" },
  { word: "Forrest Gump", hint: "Life is like a box of chocolates" },
  { word: "Harry Potter", hint: "Wizarding world, Hogwarts, The Boy Who Lived" },
  { word: "Lord of the Rings", hint: "One ring to rule them all, Frodo" },
  { word: "Star Wars", hint: "I am your father, the Force, Jedi" },
  { word: "The Lion King", hint: "Simba, Hakuna Matata, Pride Rock" },
  { word: "Frozen", hint: "Let it Go, Elsa, Anna, ice powers" },
];

// ─── TAMIL CHARACTERS (Heroes, Heroines, Villains) ─────────────
const TAMIL_CHARACTERS = [
  { word: "Rajinikanth", hint: "Superstar, style king, Thalaivar" },
  { word: "Vijay", hint: "Thalapathy, massive fan following" },
  { word: "Ajith Kumar", hint: "Thala, racing enthusiast, AK" },
  { word: "Suriya", hint: "Singam, Soorarai Pottru, intense actor" },
  { word: "Dhanush", hint: "Kolaveri Di, National Award winner" },
  { word: "Vikram", hint: "Chiyaan, method actor, I" },
  { word: "Karthi", hint: "Kaithi, Ponniyin Selvan, Suriya's brother" },
  { word: "Vijay Sethupathi", hint: "Makkal Selvan, versatile villain roles" },
  { word: "Sivakarthikeyan", hint: "Don, comedy to action star" },
  { word: "Nayanthara", hint: "Lady Superstar of Tamil cinema" },
  { word: "Jyothika", hint: "36 Vayadhinile, Suriya's wife" },
  { word: "Trisha", hint: "Ghilli heroine, South Indian star" },
  { word: "Samantha", hint: "Super Deluxe, Oo Antava fame" },
  { word: "Sathyaraj", hint: "Kattappa in Baahubali" },
  { word: "Prakash Raj", hint: "Versatile villain, 'Enna Rascala'" },
  { word: "S.J. Suryah", hint: "New, Vaali, eccentric villain" },
  { word: "Arvind Swamy", hint: "Roja, Thani Oruvan villain" },
  { word: "Keerthy Suresh", hint: "Mahanati, National Award winner" },
  { word: "Andrea Jeremiah", hint: "Singer-actress, multilingual star" },
  { word: "Aishwarya Rajesh", hint: "Kanaa, Ka Pae Ranasingam" },
];

// ─── TELUGU CHARACTERS ──────────────────────────────────────────
const TELUGU_CHARACTERS = [
  { word: "NTR Jr", hint: "RRR, Man of Masses, Tarak" },
  { word: "Ram Charan", hint: "RRR, Rangasthalam, Mega Power Star" },
  { word: "Allu Arjun", hint: "Pushpa, Stylish Star, Icon Star" },
  { word: "Mahesh Babu", hint: "Pokiri, Prince of Tollywood" },
  { word: "Prabhas", hint: "Baahubali, Darling of masses" },
  { word: "Vijay Deverakonda", hint: "Arjun Reddy, Rowdy Baby" },
  { word: "Samantha Ruth Prabhu", hint: "Oo Antava, Super Deluxe, Family Man" },
  { word: "Rashmika Mandanna", hint: "Pushpa heroine, National Crush" },
  { word: "Sai Pallavi", hint: "Fidaa, Rowdy Baby dancer" },
  { word: "Anushka Shetty", hint: "Baahubali Devasena, Arundhati" },
  { word: "Sudeep", hint: "Eega villain, Kannada superstar" },
  { word: "Jagapathi Babu", hint: "Versatile Telugu villain" },
  { word: "Brahmanandam", hint: "Comedy king of Telugu cinema" },
  { word: "Nagarjuna", hint: "King Nagarjuna, Akkineni family" },
  { word: "Chiranjeevi", hint: "Megastar, legend of Telugu cinema" },
  { word: "Nani", hint: "Natural Star, Jersey, Shyam Singha Roy" },
  { word: "Pooja Hegde", hint: "Ala Vaikunthapurramuloo heroine" },
  { word: "Kajal Aggarwal", hint: "Magadheera heroine, multilingual star" },
  { word: "Shruti Haasan", hint: "Kamal Haasan's daughter, Gabbar heroine" },
  { word: "Ravi Teja", hint: "Mass Maharaja, mass entertainer" },
];

// ─── MALAYALAM CHARACTERS ───────────────────────────────────────
const MALAYALAM_CHARACTERS = [
  { word: "Mohanlal", hint: "Complete Actor, Lalettan, Drishyam" },
  { word: "Mammootty", hint: "Megastar, CBI Diary, three-time National Award" },
  { word: "Dulquer Salmaan", hint: "DQ, Bangalore Days, Charlie" },
  { word: "Fahadh Faasil", hint: "FaFa, method acting, Aavesham" },
  { word: "Nivin Pauly", hint: "Premam, Bangalore Days, crowd puller" },
  { word: "Prithviraj Sukumaran", hint: "Director-actor, Lucifer director" },
  { word: "Tovino Thomas", hint: "Minnal Murali, rising superstar" },
  { word: "Manju Warrier", hint: "Lady Superstar of Malayalam cinema" },
  { word: "Parvathy Thiruvothu", hint: "Uyare, Take Off, strong roles" },
  { word: "Nazriya Nazim", hint: "Bangalore Days, Om Shanti Oshana" },
  { word: "Suraj Venjaramoodu", hint: "National Award winner, comedy king" },
  { word: "Soubin Shahir", hint: "Kumbalangi Nights, director-actor" },
  { word: "Basil Joseph", hint: "Minnal Murali director, actor" },
  { word: "Lijo Jose Pellissery", hint: "Jallikattu, Churuli, bold filmmaker" },
  { word: "Shane Nigam", hint: "Kumbalangi Nights, young talent" },
  { word: "Anna Ben", hint: "Kappela, Helen, rising star" },
  { word: "Biju Menon", hint: "Ayyappanum Koshiyum, comedy legend" },
  { word: "Joju George", hint: "Joseph, Nayattu, intense actor" },
  { word: "Vineeth Sreenivasan", hint: "Singer-director, Premam director" },
  { word: "Asif Ali", hint: "Kettyolaanu Ente Malakha, versatile" },
];

// ─── HINDI CHARACTERS ───────────────────────────────────────────
const HINDI_CHARACTERS = [
  { word: "Shah Rukh Khan", hint: "King Khan, Baadshah of Bollywood" },
  { word: "Aamir Khan", hint: "Mr. Perfectionist, Dangal, PK" },
  { word: "Salman Khan", hint: "Bhai, Dabangg, Tiger franchise" },
  { word: "Amitabh Bachchan", hint: "Big B, Angry Young Man, Shehenshah" },
  { word: "Hrithik Roshan", hint: "Greek God of Bollywood, Krrish" },
  { word: "Ranbir Kapoor", hint: "Rockstar, Sanju, Animal" },
  { word: "Ranveer Singh", hint: "Energy bomb, Padmaavat, Gully Boy" },
  { word: "Deepika Padukone", hint: "Padmaavat queen, Om Shanti Om" },
  { word: "Alia Bhatt", hint: "Gangubai, Highway, Raazi" },
  { word: "Priyanka Chopra", hint: "Desi Girl, Quantico, global star" },
  { word: "Kangana Ranaut", hint: "Queen, Manikarnika, bold actress" },
  { word: "Akshay Kumar", hint: "Khiladi Kumar, patriotic films" },
  { word: "Vidya Balan", hint: "Kahaani, Dirty Picture, powerhouse" },
  { word: "Ayushmann Khurrana", hint: "Andhadhun, unique story choices" },
  { word: "Rajkummar Rao", hint: "Stree, Bareilly Ki Barfi, method actor" },
  { word: "Gabbar Singh", hint: "Iconic Sholay villain, 'Kitne aadmi the'" },
  { word: "Mogambo", hint: "Mr. India villain, 'Mogambo khush hua'" },
  { word: "Ramadhir Singh", hint: "Gangs of Wasseypur villain, Tigmanshu" },
  { word: "Jim", hint: "Dhoom villain, Abhishek's nemesis" },
  { word: "Sanjay Dutt", hint: "Munna Bhai, KGF Adheera" },
];

// ─── ENGLISH CHARACTERS ─────────────────────────────────────────
const ENGLISH_CHARACTERS = [
  { word: "Iron Man", hint: "Tony Stark, genius billionaire, MCU" },
  { word: "Batman", hint: "Dark Knight, Gotham, Bruce Wayne" },
  { word: "Spider-Man", hint: "Peter Parker, friendly neighborhood" },
  { word: "Joker", hint: "Clown Prince of Crime, Batman villain" },
  { word: "Thanos", hint: "Infinity stones, snap, inevitable" },
  { word: "Wonder Woman", hint: "Diana Prince, Amazon warrior" },
  { word: "Captain America", hint: "Steve Rogers, I can do this all day" },
  { word: "Thor", hint: "God of Thunder, Mjolnir, Asgard" },
  { word: "Hulk", hint: "Bruce Banner, smash, green giant" },
  { word: "Black Widow", hint: "Natasha Romanoff, spy, Avenger" },
  { word: "Darth Vader", hint: "I am your father, Sith Lord" },
  { word: "Harry Potter", hint: "The Boy Who Lived, Hogwarts wizard" },
  { word: "Gandalf", hint: "You shall not pass! Lord of the Rings" },
  { word: "Jack Sparrow", hint: "Captain, savvy? Pirates of Caribbean" },
  { word: "James Bond", hint: "007, shaken not stirred, British spy" },
  { word: "Katniss Everdeen", hint: "Hunger Games, Girl on Fire" },
  { word: "Neo", hint: "The One, Matrix, red pill" },
  { word: "John Wick", hint: "Baba Yaga, pencil assassin" },
  { word: "Wolverine", hint: "Logan, adamantium claws, X-Men" },
  { word: "Elsa", hint: "Let It Go, ice powers, Frozen" },
];

// ─── FOOD (Expanded) ────────────────────────────────────────────
const FOOD = [
  { word: "Biriyani", hint: "Layered rice dish, fragrant spices" },
  { word: "Dosa", hint: "Crispy South Indian crepe, sambar" },
  { word: "Idli", hint: "Steamed rice cake, chutney companion" },
  { word: "Butter Chicken", hint: "Creamy North Indian curry" },
  { word: "Paneer Tikka", hint: "Grilled cottage cheese, tandoori" },
  { word: "Samosa", hint: "Triangular fried snack, potato filling" },
  { word: "Pani Puri", hint: "Hollow crispy ball, tangy water" },
  { word: "Vada Pav", hint: "Mumbai's burger, potato fritter" },
  { word: "Chole Bhature", hint: "Chickpea curry with fried bread" },
  { word: "Payasam", hint: "Sweet milk dessert, Kerala special" },
  { word: "Appam", hint: "Bowl-shaped pancake, stew companion" },
  { word: "Fish Curry", hint: "Coastal favorite, coconut base" },
  { word: "Puttu", hint: "Steamed rice cake, cylindrical shape" },
  { word: "Hyderabadi Dum Biriyani", hint: "Slow-cooked, sealed pot rice" },
  { word: "Masala Dosa", hint: "Crispy crepe with potato filling" },
  { word: "Rasgulla", hint: "Bengali sweet, spongy milk balls" },
  { word: "Gulab Jamun", hint: "Deep-fried milk balls in syrup" },
  { word: "Jalebi", hint: "Spiral-shaped orange sweet, crispy" },
  { word: "Pizza", hint: "Italian flatbread, cheese and toppings" },
  { word: "Sushi", hint: "Japanese rice rolls, raw fish" },
  { word: "Burger", hint: "Bun with patty, American classic" },
  { word: "Tacos", hint: "Mexican folded tortilla, fillings" },
  { word: "Ramen", hint: "Japanese noodle soup, broth" },
  { word: "Ice Cream", hint: "Frozen dairy dessert, scoops" },
  { word: "Chocolate", hint: "Cocoa-based sweet, everyone loves it" },
];

// ─── ANIMALS (Expanded) ─────────────────────────────────────────
const ANIMALS = [
  { word: "Elephant", hint: "Largest land animal, trunk" },
  { word: "Tiger", hint: "Striped big cat, India's national animal" },
  { word: "Lion", hint: "King of the jungle, mane" },
  { word: "Peacock", hint: "India's national bird, colorful tail" },
  { word: "Dolphin", hint: "Intelligent ocean mammal, playful" },
  { word: "Eagle", hint: "Majestic bird of prey, sharp vision" },
  { word: "Panda", hint: "Black and white bear, bamboo lover" },
  { word: "Penguin", hint: "Flightless bird, Antarctica, tuxedo" },
  { word: "Giraffe", hint: "Tallest animal, long neck, spots" },
  { word: "Cheetah", hint: "Fastest land animal, spots" },
  { word: "Wolf", hint: "Pack hunter, howls at moon" },
  { word: "Shark", hint: "Ocean predator, dorsal fin" },
  { word: "Octopus", hint: "Eight arms, ink squirter, smart" },
  { word: "Cobra", hint: "Hooded snake, venomous, India" },
  { word: "Crocodile", hint: "Armored reptile, river lurker" },
  { word: "Kangaroo", hint: "Hops, pouch baby, Australia" },
  { word: "Koala", hint: "Eucalyptus lover, Australian marsupial" },
  { word: "Sloth", hint: "Slowest mammal, hangs on trees" },
  { word: "Chameleon", hint: "Color-changing lizard, long tongue" },
  { word: "Owl", hint: "Nocturnal bird, wise, rotates head" },
];

// ─── PLACES (Expanded) ──────────────────────────────────────────
const PLACES = [
  { word: "Paris", hint: "City of Love, Eiffel Tower" },
  { word: "Tokyo", hint: "Japan's capital, cherry blossoms" },
  { word: "New York", hint: "Big Apple, Statue of Liberty" },
  { word: "Dubai", hint: "Burj Khalifa, desert luxury" },
  { word: "London", hint: "Big Ben, Buckingham Palace" },
  { word: "Mumbai", hint: "City of Dreams, Bollywood" },
  { word: "Chennai", hint: "Gateway of South India, Marina Beach" },
  { word: "Hyderabad", hint: "City of Pearls, Charminar" },
  { word: "Bangalore", hint: "Silicon Valley of India, IT hub" },
  { word: "Kerala", hint: "God's Own Country, backwaters" },
  { word: "Goa", hint: "Beaches, parties, Portuguese influence" },
  { word: "Munnar", hint: "Tea gardens, hill station, Kerala" },
  { word: "Jaipur", hint: "Pink City, Rajasthan, Hawa Mahal" },
  { word: "Varanasi", hint: "Oldest city, Ganges, spiritual capital" },
  { word: "Agra", hint: "Taj Mahal, Mughal architecture" },
  { word: "Ladakh", hint: "Land of high passes, monasteries" },
  { word: "Manali", hint: "Snow, Himalayan hill station, adventure" },
  { word: "Rome", hint: "Colosseum, Vatican, pasta capital" },
  { word: "Cairo", hint: "Pyramids, Sphinx, Nile River" },
  { word: "Sydney", hint: "Opera House, kangaroos, harbor" },
  { word: "Rio de Janeiro", hint: "Christ the Redeemer, carnival" },
  { word: "Istanbul", hint: "Two continents, Hagia Sophia" },
  { word: "Bangkok", hint: "Grand Palace, Thai street food" },
  { word: "Maldives", hint: "Tropical islands, overwater villas" },
  { word: "Singapore", hint: "Lion City, Marina Bay Sands" },
];

// ─── SONGS (Multi-language) ─────────────────────────────────────
const SONGS = [
  { word: "Why This Kolaveri Di", hint: "Dhanush, viral Tamil song" },
  { word: "Rowdy Baby", hint: "Maari 2, Dhanush, Sai Pallavi dance" },
  { word: "Vaathi Coming", hint: "Master, Vijay mass entry song" },
  { word: "Arabic Kuthu", hint: "Beast, Vijay, Halamithi Habibo" },
  { word: "Oo Antava", hint: "Pushpa, Samantha special song" },
  { word: "Naatu Naatu", hint: "RRR, Oscar-winning Telugu song" },
  { word: "Buttabomma", hint: "Ala Vaikunthapurramuloo, Armaan Malik" },
  { word: "Jimikki Kammal", hint: "Viral Malayalam dance song" },
  { word: "Appangalembadum", hint: "Viral Kerala song, funny gestures" },
  { word: "Tum Hi Ho", hint: "Aashiqui 2, Arijit Singh" },
  { word: "Chaiyya Chaiyya", hint: "Dil Se, train top dance, SRK" },
  { word: "Kal Ho Naa Ho", hint: "SRK, title track, emotional" },
  { word: "Apna Time Aayega", hint: "Gully Boy, Ranveer Singh rap" },
  { word: "Shape of You", hint: "Ed Sheeran, global hit" },
  { word: "Blinding Lights", hint: "The Weeknd, 80s retro vibe" },
  { word: "Bohemian Rhapsody", hint: "Queen, Freddie Mercury, opera rock" },
  { word: "Despacito", hint: "Luis Fonsi, Latin viral hit" },
  { word: "Rolling in the Deep", hint: "Adele, powerful vocals, fire" },
  { word: "Let It Go", hint: "Frozen, Elsa anthem" },
  { word: "Imagine", hint: "John Lennon, peace anthem" },
];

// ─── CELEBRITY (Expanded) ───────────────────────────────────────
const CELEBRITY = [
  { word: "Taylor Swift", hint: "Pop queen, Eras Tour, Swifties" },
  { word: "Elon Musk", hint: "Tesla, SpaceX, Twitter/X owner" },
  { word: "BTS", hint: "K-pop boyband, ARMY fandom" },
  { word: "Virat Kohli", hint: "Indian cricket captain, RCB" },
  { word: "MS Dhoni", hint: "Captain Cool, CSK, finisher" },
  { word: "AR Rahman", hint: "Mozart of Madras, Oscar winner" },
  { word: "Ilayaraja", hint: "Isaignani, legendary Tamil composer" },
  { word: "SP Balasubrahmanyam", hint: "Legendary Indian playback singer" },
  { word: "Anirudh Ravichander", hint: "Young music sensation, Kolaveri" },
  { word: "Atlee", hint: "Tamil director, Jawan with SRK" },
  { word: "SS Rajamouli", hint: "Baahubali, RRR, Telugu visionary" },
  { word: "Mani Ratnam", hint: "Ponniyin Selvan, Roja, master filmmaker" },
  { word: "Priyamani", hint: "Family Man actress, National Award" },
  { word: "Nithya Menen", hint: "Versatile South Indian actress" },
  { word: "Tamannaah", hint: "Baahubali Avantika, multi-language star" },
  { word: "Shraddha Kapoor", hint: "Stree 2, Aashiqui 2" },
  { word: "Yash", hint: "KGF Rocky Bhai, Kannada star" },
  { word: "Diljit Dosanjh", hint: "Punjabi icon, Amar Singh Chamkila" },
  { word: "Oprah Winfrey", hint: "Talk show queen, media mogul" },
  { word: "Leonardo DiCaprio", hint: "Titanic, Oscar for The Revenant" },
];

// ═══════════════════════════════════════════════════════════════
// EXPORT: GENRES with hint-enriched word objects
// ═══════════════════════════════════════════════════════════════

export const GENRES = {
  "🎮 Video Games": VIDEO_GAMES,
  "🏏 Sports": SPORTS,
  "🎬 Tamil Movies": TAMIL_MOVIES,
  "🎬 Telugu Movies": TELUGU_MOVIES,
  "🎬 Malayalam Movies": MALAYALAM_MOVIES,
  "🎬 Hindi Movies": HINDI_MOVIES,
  "🎬 English Movies": ENGLISH_MOVIES,
  "🎭 Tamil Characters": TAMIL_CHARACTERS,
  "🎭 Telugu Characters": TELUGU_CHARACTERS,
  "🎭 Malayalam Characters": MALAYALAM_CHARACTERS,
  "🎭 Hindi Characters": HINDI_CHARACTERS,
  "🎭 English Characters": ENGLISH_CHARACTERS,
  "🍕 Food": FOOD,
  "🐾 Animals": ANIMALS,
  "🌍 Places": PLACES,
  "🎵 Songs": SONGS,
  "🎮 Celebrity": CELEBRITY,
};

// Secure random number
export const cryptoRandom = (max) => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
};

// Generate contextual hints for the imposter
export const generateHint = (wordObj, genre) => {
  const categoryName = genre ? genre.replace(/^[^\s]+\s/, "") : "Secret Category";

  if (wordObj && wordObj.hint) {
    return {
      categoryClue: wordObj.hint,
      firstLetter: wordObj.word[0].toUpperCase(),
      wordLength: wordObj.word.length,
      categoryName,
      fullGenre: genre,
    };
  }

  const word = typeof wordObj === "string" ? wordObj : (wordObj?.word || "");
  return {
    categoryClue: `Word relates to ${categoryName}`,
    firstLetter: word ? word[0].toUpperCase() : "?",
    wordLength: word ? word.length : 0,
    categoryName,
    fullGenre: genre,
  };
};

// Assign roles to players (supports single genre or multi-genre array)
export const assignRoles = (players, selectedGenres, customWords = null, previousImposterIndex = null) => {
  let imposterIndex;
  
  if (players.length > 1 && previousImposterIndex !== null) {
    do {
      imposterIndex = cryptoRandom(players.length);
    } while (imposterIndex === previousImposterIndex);
  } else {
    imposterIndex = cryptoRandom(players.length);
  }

  let wordObj, word, genreName;
  if (customWords && customWords.length > 0) {
    word = customWords[cryptoRandom(customWords.length)];
    wordObj = { word, hint: null };
    genreName = typeof selectedGenres === "string" ? selectedGenres : "✨ Custom";
  } else {
    const genreList = Array.isArray(selectedGenres) ? selectedGenres : [selectedGenres];
    const validGenres = genreList.filter((g) => GENRES[g]);
    const chosenGenre = validGenres.length > 0
      ? validGenres[cryptoRandom(validGenres.length)]
      : Object.keys(GENRES)[0];

    const words = GENRES[chosenGenre];
    wordObj = words[cryptoRandom(words.length)];
    word = wordObj.word;
    genreName = chosenGenre;
  }

  return { imposterIndex, word, wordObj, genre: genreName, selectedGenres };
};