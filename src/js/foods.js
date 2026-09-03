/*
 * Bread Units Calculator - food reference data
 * -------------------------------------------------
 * `carbs` = approximate grams of carbohydrates per 100 g of the product.
 * Rounded reference figures from commonly published food-composition and
 * bread-unit tables (incl. the Sanofi "Таблиця хлібних одиниць", 2024).
 * Estimates for informational use only.
 *
 * `gi` = approximate glycemic index (glucose scale, 0-100+). Rounded figures
 * from public GI databases (University of Sydney, USDA and similar). GI varies
 * widely with variety, ripeness and preparation, so treat these as a rough
 * band only. Omitted for foods with negligible carbohydrate, where GI has
 * little practical meaning.
 *   low <= 55   |   medium 56-69   |   high >= 70
 *
 * The calculator keeps the original project formula:
 *     XE = (carbs / 100) * weight / norm      (norm = 10 or 12)
 *
 * Selecting a food only pre-fills the "carbohydrates per 100 g" field;
 * the user can still type any value manually.
 *
 * `piece` (optional) = typical weight of one piece, in grams.
 * `liquid` = true -> measured in millilitres.
 */
window.BUC_FOODS = [
  // ---------- Bread & Bakery ----------
  { id: "white-bread",      cat: "bakery",  carbs: 49, gi: 75, name: { uk: "Білий хліб",              en: "White bread",              es: "Pan blanco" } },
  { id: "rye-bread",        cat: "bakery",  carbs: 42, gi: 58, name: { uk: "Житній хліб",             en: "Rye bread",                es: "Pan de centeno" } },
  { id: "borodino-bread",   cat: "bakery",  carbs: 40, gi: 65, name: { uk: "Бородінський хліб",       en: "Borodinsky bread",         es: "Pan Borodinsky" } },
  { id: "bran-bread",       cat: "bakery",  carbs: 40, gi: 55, name: { uk: "Хліб із висівками",       en: "Bran bread",               es: "Pan de salvado" } },
  { id: "rusks",            cat: "bakery",  carbs: 70, gi: 70, name: { uk: "Сухарі",                  en: "Rusks / dried bread",      es: "Pan tostado seco" } },
  { id: "crispbread",       cat: "bakery",  carbs: 75, gi: 65, name: { uk: "Хлібці хрусткі",          en: "Crispbread",               es: "Pan crujiente" } },
  { id: "crackers",         cat: "bakery",  carbs: 68, gi: 70, name: { uk: "Крекери несолодкі",       en: "Plain crackers",           es: "Galletas saladas" } },
  { id: "bread-sticks",     cat: "bakery",  carbs: 72, gi: 70, name: { uk: "Хлібні палички",          en: "Bread sticks",             es: "Palitos de pan" } },
  { id: "bagel",            cat: "bakery",  carbs: 56, gi: 72, piece: 50,  name: { uk: "Бублик",       en: "Bagel",                    es: "Bagel" } },
  { id: "lavash",           cat: "bakery",  carbs: 47, gi: 68, name: { uk: "Лаваш",                   en: "Lavash flatbread",         es: "Pan de lavash" } },
  { id: "wheat-flour",      cat: "bakery",  carbs: 73, gi: 70, name: { uk: "Борошно пшеничне",        en: "Wheat flour",              es: "Harina de trigo" } },
  { id: "breadcrumbs",      cat: "bakery",  carbs: 72, gi: 74, name: { uk: "Панірувальні сухарі",     en: "Breadcrumbs",              es: "Pan rallado" } },
  { id: "puff-pastry",      cat: "bakery",  carbs: 34, gi: 55, name: { uk: "Листкове тісто",          en: "Puff pastry (raw)",        es: "Masa de hojaldre" } },
  { id: "yeast-dough",      cat: "bakery",  carbs: 43, gi: 60, name: { uk: "Дріжджове тісто",         en: "Yeast dough (raw)",        es: "Masa de levadura" } },
  { id: "pancake",          cat: "bakery",  carbs: 28, gi: 66, piece: 40,  name: { uk: "Млинець",      en: "Thin pancake",             es: "Panqueque" } },
  { id: "oladki",           cat: "bakery",  carbs: 33, gi: 62, piece: 30,  name: { uk: "Оладки",       en: "Thick pancakes (oladki)",  es: "Tortitas gruesas" } },
  { id: "dumplings-curd",   cat: "bakery",  carbs: 19, gi: 55, piece: 13,  name: { uk: "Вареники з сиром", en: "Curd dumplings",       es: "Vareniki de requesón" } },
  { id: "pelmeni",          cat: "bakery",  carbs: 22, gi: 55, piece: 13,  name: { uk: "Пельмені",     en: "Pelmeni (meat dumplings)", es: "Pelmeni (empanadillas)" } },
  { id: "vatrushka",        cat: "bakery",  carbs: 40, gi: 60, piece: 50,  name: { uk: "Ватрушка",     en: "Vatrushka (curd bun)",     es: "Bollo de requesón" } },
  { id: "raisin-bun",       cat: "bakery",  carbs: 47, gi: 65, piece: 25,  name: { uk: "Булочка з родзинками", en: "Raisin bun",       es: "Bollo con pasas" } },
  { id: "gingerbread",      cat: "bakery",  carbs: 74, gi: 65, piece: 40,  name: { uk: "Пряник",       en: "Gingerbread",              es: "Pan de jengibre" } },
  { id: "waffles",          cat: "bakery",  carbs: 65, gi: 76, name: { uk: "Вафлі",                   en: "Waffles",                  es: "Barquillos" } },
  { id: "butter-cookies",   cat: "bakery",  carbs: 66, gi: 55, name: { uk: "Печиво вершкове",         en: "Butter cookies",           es: "Galletas de mantequilla" } },
  { id: "muesli",           cat: "bakery",  carbs: 62, gi: 57, name: { uk: "Мюслі без цукру",         en: "Muesli (no sugar)",        es: "Muesli sin azúcar" } },
  { id: "cornflakes",       cat: "bakery",  carbs: 83, gi: 81, name: { uk: "Кукурудзяні пластівці",   en: "Cornflakes",               es: "Copos de maíz" } },
  { id: "wheat-bran",       cat: "bakery",  carbs: 22, gi: 43, name: { uk: "Пшеничні висівки",        en: "Wheat bran",               es: "Salvado de trigo" } },
  { id: "popcorn",          cat: "bakery",  carbs: 78, gi: 65, name: { uk: "Попкорн без цукру",       en: "Popcorn (unsweetened)",    es: "Palomitas sin azúcar" } },

  // ---------- Cereals ----------
  { id: "buckwheat-dry",    cat: "cereals", carbs: 62, gi: 50, name: { uk: "Гречка (сухою вагою)",    en: "Buckwheat (dry)",     es: "Trigo sarraceno (seco)" } },
  { id: "rice-dry",         cat: "cereals", carbs: 74, gi: 70, name: { uk: "Рис (сухою вагою)",       en: "Rice (dry)",          es: "Arroz (seco)" } },
  { id: "rice-cooked",      cat: "cereals", carbs: 25, gi: 70, name: { uk: "Рис відварений",          en: "Rice (cooked)",       es: "Arroz (cocido)" } },
  { id: "oatmeal-dry",      cat: "cereals", carbs: 60, gi: 55, name: { uk: "Вівсянка (сухою вагою)",  en: "Oatmeal (dry)",       es: "Avena (seca)" } },
  { id: "semolina-dry",     cat: "cereals", carbs: 70, gi: 65, name: { uk: "Манка (сухою вагою)",     en: "Semolina (dry)",      es: "Sémola (seca)" } },
  { id: "millet-dry",       cat: "cereals", carbs: 66, gi: 70, name: { uk: "Пшоно (сухою вагою)",     en: "Millet (dry)",        es: "Mijo (seco)" } },
  { id: "barley-dry",       cat: "cereals", carbs: 67, gi: 28, name: { uk: "Перловка (сухою вагою)",  en: "Pearl barley (dry)",  es: "Cebada perlada (seca)" } },
  { id: "porridge-cooked",  cat: "cereals", carbs: 15, gi: 60, name: { uk: "Каша (варена)",           en: "Porridge (cooked)",   es: "Gachas (cocidas)" } },
  { id: "starch",           cat: "cereals", carbs: 85, gi: 85, name: { uk: "Крохмаль",                en: "Starch",              es: "Almidón" } },
  { id: "sprouted-grain",   cat: "cereals", carbs: 31, gi: 45, name: { uk: "Пророщене зерно",         en: "Sprouted grain",      es: "Grano germinado" } },
  { id: "corn-cob",         cat: "cereals", carbs: 22, gi: 52, piece: 250, name: { uk: "Кукурудза (качан)", en: "Corn on the cob",  es: "Mazorca de maíz" } },
  { id: "corn-boiled",      cat: "cereals", carbs: 21, gi: 52, name: { uk: "Кукурудза варена",        en: "Corn (boiled)",       es: "Maíz (cocido)" } },
  { id: "corn-canned",      cat: "cereals", carbs: 20, gi: 55, name: { uk: "Кукурудза консервована",  en: "Sweet corn (canned)", es: "Maíz dulce (lata)" } },

  // ---------- Pasta & Potatoes ----------
  { id: "pasta-dry",        cat: "pasta",   carbs: 71, gi: 50, name: { uk: "Макарони (сухою вагою)",  en: "Pasta (dry)",         es: "Pasta (seca)" } },
  { id: "pasta-cooked",     cat: "pasta",   carbs: 25, gi: 50, name: { uk: "Макарони відварені",      en: "Pasta (cooked)",      es: "Pasta (cocida)" } },
  { id: "potato-raw",       cat: "pasta",   carbs: 17, piece: 90,  name: { uk: "Картопля сира", en: "Potato (raw)",       es: "Papa (cruda)" } },
  { id: "potato-boiled",    cat: "pasta",   carbs: 16, gi: 78, name: { uk: "Картопля відварена",      en: "Boiled potato",       es: "Papa hervida" } },
  { id: "potato-jacket",    cat: "pasta",   carbs: 16, gi: 75, piece: 75,  name: { uk: "Картопля в мундирі", en: "Jacket potato",   es: "Papa con piel" } },
  { id: "mashed-potato",    cat: "pasta",   carbs: 14, gi: 83, name: { uk: "Картопляне пюре",         en: "Mashed potato",       es: "Puré de papa" } },
  { id: "fried-potato",     cat: "pasta",   carbs: 30, gi: 75, name: { uk: "Смажена картопля",        en: "Fried potato",        es: "Papa frita" } },
  { id: "french-fries",     cat: "pasta",   carbs: 34, gi: 63, piece: 115, name: { uk: "Картопля фрі",  en: "French fries",        es: "Papas fritas" } },
  { id: "potato-pancakes",  cat: "pasta",   carbs: 20, gi: 75, name: { uk: "Деруни (картопляні оладки)", en: "Potato pancakes", es: "Tortitas de papa" } },
  { id: "potato-chips",     cat: "pasta",   carbs: 50, gi: 56, name: { uk: "Картопляні чіпси",        en: "Potato chips",        es: "Papas fritas de bolsa" } },

  // ---------- Vegetables ----------
  { id: "carrot",           cat: "veggies", carbs: 7,  gi: 39, piece: 75,  name: { uk: "Морква",       en: "Carrot",              es: "Zanahoria" } },
  { id: "beetroot",         cat: "veggies", carbs: 9,  gi: 64, piece: 130, name: { uk: "Буряк",        en: "Beetroot",            es: "Remolacha" } },
  { id: "pumpkin",          cat: "veggies", carbs: 6,  gi: 75, name: { uk: "Гарбуз",                  en: "Pumpkin",             es: "Calabaza" } },
  { id: "jerusalem-artichoke", cat: "veggies", carbs: 13, gi: 50, name: { uk: "Топінамбур",           en: "Jerusalem artichoke", es: "Tupinambo" } },
  { id: "sauerkraut",       cat: "veggies", carbs: 3,  name: { uk: "Квашена капуста",         en: "Sauerkraut",          es: "Chucrut" } },
  { id: "cauliflower",      cat: "veggies", carbs: 4,  name: { uk: "Цвітна капуста",          en: "Cauliflower",         es: "Coliflor" } },
  { id: "white-cabbage",    cat: "veggies", carbs: 5,  name: { uk: "Білокачанна капуста",     en: "White cabbage",       es: "Col blanca" } },
  { id: "red-cabbage",      cat: "veggies", carbs: 6,  name: { uk: "Червонокачанна капуста",  en: "Red cabbage",         es: "Col lombarda" } },
  { id: "brussels-sprouts", cat: "veggies", carbs: 6,  name: { uk: "Брюссельська капуста",    en: "Brussels sprouts",    es: "Coles de Bruselas" } },
  { id: "bell-pepper",      cat: "veggies", carbs: 5,  piece: 120, name: { uk: "Болгарський перець", en: "Bell pepper",     es: "Pimiento" } },
  { id: "cucumber",         cat: "veggies", carbs: 2,  name: { uk: "Огірки",                  en: "Cucumber",            es: "Pepino" } },
  { id: "tomato",           cat: "veggies", carbs: 3,  name: { uk: "Помідори",                en: "Tomato",              es: "Tomate" } },
  { id: "radish",           cat: "veggies", carbs: 3,  name: { uk: "Редис",                   en: "Radish",              es: "Rábano" } },
  { id: "spinach",          cat: "veggies", carbs: 2,  name: { uk: "Шпинат",                  en: "Spinach",             es: "Espinaca" } },

  // ---------- Legumes ----------
  { id: "green-peas",       cat: "legumes", carbs: 13, gi: 48, name: { uk: "Горошок зелений",         en: "Green peas",          es: "Guisantes verdes" } },
  { id: "beans-dry",        cat: "legumes", carbs: 55, gi: 35, name: { uk: "Квасоля (сухою вагою)",   en: "Beans (dry)",         es: "Frijoles (secos)" } },
  { id: "beans-boiled",     cat: "legumes", carbs: 22, gi: 30, name: { uk: "Квасоля відварена",       en: "Beans (boiled)",      es: "Frijoles (cocidos)" } },
  { id: "lentils-dry",      cat: "legumes", carbs: 57, gi: 30, name: { uk: "Сочевиця (сухою вагою)",  en: "Lentils (dry)",       es: "Lentejas (secas)" } },
  { id: "lentils-boiled",   cat: "legumes", carbs: 20, gi: 30, name: { uk: "Сочевиця відварена",      en: "Lentils (boiled)",    es: "Lentejas (cocidas)" } },
  { id: "chickpeas-dry",    cat: "legumes", carbs: 57, gi: 30, name: { uk: "Нут (сухою вагою)",       en: "Chickpeas (dry)",     es: "Garbanzos (secos)" } },
  { id: "soybeans-dry",     cat: "legumes", carbs: 20, gi: 16, name: { uk: "Соя (сухою вагою)",       en: "Soybeans (dry)",      es: "Soja (seca)" } },

  // ---------- Fruits & Berries ----------
  { id: "apple",            cat: "fruits",  carbs: 11, gi: 35, piece: 150, name: { uk: "Яблуко",       en: "Apple",               es: "Manzana" } },
  { id: "pear",             cat: "fruits",  carbs: 10, gi: 38, piece: 135, name: { uk: "Груша",        en: "Pear",                es: "Pera" } },
  { id: "quince",           cat: "fruits",  carbs: 10, gi: 35, piece: 140, name: { uk: "Айва",         en: "Quince",              es: "Membrillo" } },
  { id: "banana",           cat: "fruits",  carbs: 21, gi: 51, piece: 120, name: { uk: "Банан",        en: "Banana",              es: "Plátano" } },
  { id: "orange",           cat: "fruits",  carbs: 8,  gi: 43, piece: 180, name: { uk: "Апельсин",     en: "Orange",              es: "Naranja" } },
  { id: "tangerine",        cat: "fruits",  carbs: 8,  gi: 45, piece: 70,  name: { uk: "Мандарин",     en: "Tangerine",           es: "Mandarina" } },
  { id: "grapefruit",       cat: "fruits",  carbs: 7,  gi: 25, piece: 350, name: { uk: "Грейпфрут",    en: "Grapefruit",          es: "Pomelo" } },
  { id: "lemon",            cat: "fruits",  carbs: 3,  gi: 20, piece: 90,  name: { uk: "Лимон",        en: "Lemon",               es: "Limón" } },
  { id: "pomegranate",      cat: "fruits",  carbs: 14, gi: 35, piece: 200, name: { uk: "Гранат",       en: "Pomegranate",         es: "Granada" } },
  { id: "grapes",           cat: "fruits",  carbs: 16, gi: 46, name: { uk: "Виноград",                en: "Grapes",              es: "Uvas" } },
  { id: "watermelon",       cat: "fruits",  carbs: 8,  gi: 72, name: { uk: "Кавун",                   en: "Watermelon",          es: "Sandía" } },
  { id: "melon",            cat: "fruits",  carbs: 8,  gi: 65, name: { uk: "Диня",                    en: "Melon",               es: "Melón" } },
  { id: "pineapple",        cat: "fruits",  carbs: 12, gi: 59, name: { uk: "Ананас",                  en: "Pineapple",           es: "Piña" } },
  { id: "mango",            cat: "fruits",  carbs: 15, gi: 51, piece: 200, name: { uk: "Манго",        en: "Mango",               es: "Mango" } },
  { id: "papaya",           cat: "fruits",  carbs: 11, gi: 59, name: { uk: "Папайя",                  en: "Papaya",              es: "Papaya" } },
  { id: "kiwi",             cat: "fruits",  carbs: 10, gi: 50, piece: 75,  name: { uk: "Ківі",         en: "Kiwi",                es: "Kiwi" } },
  { id: "peach",            cat: "fruits",  carbs: 10, gi: 42, piece: 120, name: { uk: "Персик",       en: "Peach",               es: "Durazno" } },
  { id: "nectarine",        cat: "fruits",  carbs: 12, gi: 43, piece: 120, name: { uk: "Нектарин",     en: "Nectarine",           es: "Nectarina" } },
  { id: "apricot",          cat: "fruits",  carbs: 9,  gi: 34, piece: 30,  name: { uk: "Абрикос",      en: "Apricot",             es: "Albaricoque" } },
  { id: "plum",             cat: "fruits",  carbs: 11, gi: 39, piece: 40,  name: { uk: "Слива",        en: "Plum",                es: "Ciruela" } },
  { id: "cherry-plum",      cat: "fruits",  carbs: 8,  gi: 25, name: { uk: "Алича",                   en: "Cherry plum",         es: "Ciruela mirabel" } },
  { id: "persimmon",        cat: "fruits",  carbs: 17, gi: 50, piece: 170, name: { uk: "Хурма",        en: "Persimmon",           es: "Caqui" } },
  { id: "fig-fresh",        cat: "fruits",  carbs: 16, gi: 35, piece: 50,  name: { uk: "Інжир свіжий", en: "Fig (fresh)",         es: "Higo (fresco)" } },
  { id: "avocado",          cat: "fruits",  carbs: 6,  piece: 200, name: { uk: "Авокадо",      en: "Avocado",             es: "Aguacate" } },
  { id: "cherry",           cat: "fruits",  carbs: 13, gi: 22, name: { uk: "Черешня",                 en: "Sweet cherry",        es: "Cereza" } },
  { id: "sour-cherry",      cat: "fruits",  carbs: 11, gi: 22, name: { uk: "Вишня",                   en: "Sour cherry",         es: "Guinda" } },
  { id: "strawberry",       cat: "fruits",  carbs: 7,  gi: 40, name: { uk: "Полуниця",                en: "Strawberry",          es: "Fresa" } },
  { id: "raspberry",        cat: "fruits",  carbs: 8,  gi: 32, name: { uk: "Малина",                  en: "Raspberry",           es: "Frambuesa" } },
  { id: "blackberry",       cat: "fruits",  carbs: 10, gi: 25, name: { uk: "Ожина",                   en: "Blackberry",          es: "Mora" } },
  { id: "blueberry",        cat: "fruits",  carbs: 8,  gi: 53, name: { uk: "Чорниця",                 en: "Blueberry",           es: "Arándano" } },
  { id: "lingonberry",      cat: "fruits",  carbs: 8,  gi: 25, name: { uk: "Брусниця",                en: "Lingonberry",         es: "Arándano rojo" } },
  { id: "cranberry",        cat: "fruits",  carbs: 8,  gi: 45, name: { uk: "Журавлина",               en: "Cranberry",           es: "Arándano agrio" } },
  { id: "gooseberry",       cat: "fruits",  carbs: 10, gi: 25, name: { uk: "Аґрус",                   en: "Gooseberry",          es: "Grosella espinosa" } },
  { id: "blackcurrant",     cat: "fruits",  carbs: 8,  gi: 15, name: { uk: "Чорна смородина",         en: "Blackcurrant",        es: "Grosella negra" } },
  { id: "redcurrant",       cat: "fruits",  carbs: 8,  gi: 25, name: { uk: "Червона смородина",       en: "Redcurrant",          es: "Grosella roja" } },
  { id: "feijoa",           cat: "fruits",  carbs: 13, gi: 35, name: { uk: "Фейхоа",                  en: "Feijoa",              es: "Feijoa" } },
  { id: "dried-apricots",   cat: "fruits",  carbs: 62, gi: 30, name: { uk: "Курага",                  en: "Dried apricots",      es: "Orejones" } },
  { id: "prunes",           cat: "fruits",  carbs: 60, gi: 40, name: { uk: "Чорнослив",               en: "Prunes",              es: "Ciruelas pasas" } },
  { id: "raisins",          cat: "fruits",  carbs: 72, gi: 65, name: { uk: "Родзинки",                en: "Raisins",             es: "Pasas" } },
  { id: "dates",            cat: "fruits",  carbs: 69, gi: 62, piece: 8, name: { uk: "Фініки",         en: "Dates",               es: "Dátiles" } },
  { id: "dried-figs",       cat: "fruits",  carbs: 58, gi: 61, name: { uk: "Інжир сушений",           en: "Dried figs",          es: "Higos secos" } },
  { id: "dried-apple",      cat: "fruits",  carbs: 59, gi: 41, name: { uk: "Яблука сушені",           en: "Dried apple",         es: "Manzana seca" } },

  // ---------- Juices ----------
  { id: "orange-juice",     cat: "juices",  carbs: 11, gi: 50, liquid: true, name: { uk: "Апельсиновий сік", en: "Orange juice",     es: "Zumo de naranja" } },
  { id: "apple-juice",      cat: "juices",  carbs: 11, gi: 41, liquid: true, name: { uk: "Яблучний сік",     en: "Apple juice",      es: "Zumo de manzana" } },
  { id: "grape-juice",      cat: "juices",  carbs: 14, gi: 55, liquid: true, name: { uk: "Виноградний сік",  en: "Grape juice",      es: "Zumo de uva" } },
  { id: "cherry-juice",     cat: "juices",  carbs: 12, gi: 40, liquid: true, name: { uk: "Вишневий сік",     en: "Cherry juice",     es: "Zumo de cereza" } },
  { id: "pear-juice",       cat: "juices",  carbs: 10, gi: 44, liquid: true, name: { uk: "Грушевий сік",     en: "Pear juice",       es: "Zumo de pera" } },
  { id: "plum-juice",       cat: "juices",  carbs: 12, gi: 45, liquid: true, name: { uk: "Сливовий сік",     en: "Plum juice",       es: "Zumo de ciruela" } },
  { id: "grapefruit-juice", cat: "juices",  carbs: 8,  gi: 48, liquid: true, name: { uk: "Грейпфрутовий сік", en: "Grapefruit juice", es: "Zumo de pomelo" } },
  { id: "carrot-juice",     cat: "juices",  carbs: 8,  gi: 43, liquid: true, name: { uk: "Морквяний сік",    en: "Carrot juice",     es: "Zumo de zanahoria" } },
  { id: "beet-juice",       cat: "juices",  carbs: 8,  gi: 64, liquid: true, name: { uk: "Буряковий сік",    en: "Beetroot juice",   es: "Zumo de remolacha" } },
  { id: "tomato-juice",     cat: "juices",  carbs: 3,  gi: 38, liquid: true, name: { uk: "Томатний сік",     en: "Tomato juice",     es: "Zumo de tomate" } },

  // ---------- Dairy ----------
  { id: "milk",             cat: "dairy",   carbs: 5,  gi: 39, liquid: true, name: { uk: "Молоко",          en: "Milk",             es: "Leche" } },
  { id: "baked-milk",       cat: "dairy",   carbs: 5,  gi: 40, liquid: true, name: { uk: "Молоко пряжене",  en: "Baked milk",       es: "Leche horneada" } },
  { id: "kefir",            cat: "dairy",   carbs: 4,  gi: 25, liquid: true, name: { uk: "Кефір",           en: "Kefir",            es: "Kéfir" } },
  { id: "ryazhanka",        cat: "dairy",   carbs: 4,  gi: 30, liquid: true, name: { uk: "Ряжанка",         en: "Ryazhanka (fermented baked milk)", es: "Leche horneada fermentada" } },
  { id: "soured-milk",      cat: "dairy",   carbs: 4,  gi: 30, liquid: true, name: { uk: "Кисле молоко",    en: "Soured milk",      es: "Leche cortada" } },
  { id: "buttermilk",       cat: "dairy",   carbs: 4,  gi: 30, liquid: true, name: { uk: "Маслянка",        en: "Buttermilk",       es: "Suero de mantequilla" } },
  { id: "cream",            cat: "dairy",   carbs: 4,  gi: 30, liquid: true, name: { uk: "Вершки",          en: "Cream",            es: "Nata" } },
  { id: "plain-yogurt",     cat: "dairy",   carbs: 6,  gi: 35, liquid: true, name: { uk: "Йогурт без цукру", en: "Plain yogurt",    es: "Yogur natural" } },
  { id: "fruit-yogurt",     cat: "dairy",   carbs: 14, gi: 41, name: { uk: "Йогурт фруктовий",        en: "Fruit yogurt",        es: "Yogur de frutas" } },
  { id: "condensed-milk",   cat: "dairy",   carbs: 9,  gi: 45, name: { uk: "Згущене молоко без цукру", en: "Condensed milk (unsweetened)", es: "Leche condensada sin azúcar" } },
  { id: "milk-powder",      cat: "dairy",   carbs: 50, gi: 46, name: { uk: "Сухе молоко",             en: "Milk powder",         es: "Leche en polvo" } },
  { id: "sweet-curd-mass",  cat: "dairy",   carbs: 15, gi: 55, name: { uk: "Сирна маса солодка",      en: "Sweet curd mass",     es: "Requesón dulce" } },
  { id: "glazed-curd-bar",  cat: "dairy",   carbs: 30, gi: 55, piece: 40, name: { uk: "Сирок глазурований", en: "Glazed curd bar", es: "Barrita de requesón glaseada" } },
  { id: "syrnik",           cat: "dairy",   carbs: 22, gi: 50, piece: 75, name: { uk: "Сирник",         en: "Syrnik (curd fritter)", es: "Buñuelo de requesón" } },
  { id: "ice-cream",        cat: "dairy",   carbs: 23, gi: 60, name: { uk: "Морозиво",                en: "Ice cream",           es: "Helado" } },

  // ---------- Nuts ----------
  { id: "walnuts",          cat: "nuts",    carbs: 11, gi: 15, name: { uk: "Волоські горіхи",         en: "Walnuts",             es: "Nueces" } },
  { id: "peanuts",          cat: "nuts",    carbs: 16, gi: 15, name: { uk: "Арахіс",                  en: "Peanuts",             es: "Cacahuetes" } },
  { id: "pine-nuts",        cat: "nuts",    carbs: 13, gi: 15, name: { uk: "Кедрові горіхи",          en: "Pine nuts",           es: "Piñones" } },
  { id: "cashew",           cat: "nuts",    carbs: 27, gi: 25, name: { uk: "Кеш'ю",                   en: "Cashews",             es: "Anacardos" } },
  { id: "almonds",          cat: "nuts",    carbs: 13, gi: 15, name: { uk: "Мигдаль",                 en: "Almonds",             es: "Almendras" } },
  { id: "pistachios",       cat: "nuts",    carbs: 28, gi: 20, name: { uk: "Фісташки",               en: "Pistachios",          es: "Pistachos" } },
  { id: "hazelnuts",        cat: "nuts",    carbs: 17, gi: 15, name: { uk: "Фундук",                  en: "Hazelnuts",           es: "Avellanas" } },

  // ---------- Ready meals & fast food ----------
  { id: "hamburger",        cat: "fastfood", carbs: 30, gi: 66, piece: 100, name: { uk: "Гамбургер",   en: "Hamburger",           es: "Hamburguesa" } },
  { id: "cheeseburger",     cat: "fastfood", carbs: 30, gi: 66, piece: 105, name: { uk: "Чізбургер",   en: "Cheeseburger",        es: "Hamburguesa con queso" } },
  { id: "big-mac",          cat: "fastfood", carbs: 20, gi: 70, piece: 215, name: { uk: "Біг Мак",     en: "Big Mac",             es: "Big Mac" } },
  { id: "chicken-nuggets",  cat: "fastfood", carbs: 16, gi: 46, piece: 100, name: { uk: "Курячі нагетси", en: "Chicken nuggets",  es: "Nuggets de pollo" } },
  { id: "pizza",            cat: "fastfood", carbs: 25, gi: 60, piece: 300, name: { uk: "Піца",        en: "Pizza",               es: "Pizza" } },
  { id: "bean-burrito",     cat: "fastfood", carbs: 25, gi: 55, piece: 220, name: { uk: "Буріто з квасолею", en: "Bean burrito",  es: "Burrito de frijoles" } },
  { id: "cutlet",           cat: "fastfood", carbs: 10, gi: 50, piece: 90,  name: { uk: "Котлета",     en: "Cutlet (breaded)",    es: "Filete empanado" } },
  { id: "cake-slice",       cat: "fastfood", carbs: 45, gi: 55, piece: 100, name: { uk: "Торт / пиріг", en: "Cake / pie",         es: "Tarta / pastel" } },

  // ---------- Other foods ----------
  { id: "sugar",            cat: "other",   carbs: 100, gi: 65, name: { uk: "Цукор",                  en: "Sugar",               es: "Azúcar" } },
  { id: "fructose",         cat: "other",   carbs: 100, gi: 20, name: { uk: "Фруктоза",               en: "Fructose",            es: "Fructosa" } },
  { id: "honey",            cat: "other",   carbs: 80, gi: 55, name: { uk: "Мед",                     en: "Honey",               es: "Miel" } },
  { id: "jam",              cat: "other",   carbs: 70, gi: 55, name: { uk: "Варення",                 en: "Jam",                 es: "Mermelada" } },
  { id: "marmalade",        cat: "other",   carbs: 77, gi: 65, name: { uk: "Мармелад",               en: "Marmalade sweets",    es: "Gominolas de mermelada" } },
  { id: "caramel",          cat: "other",   carbs: 90, gi: 70, name: { uk: "Карамель",               en: "Caramel / hard candy", es: "Caramelo duro" } },
  { id: "chocolate",        cat: "other",   carbs: 55, gi: 45, name: { uk: "Шоколад",                 en: "Chocolate",           es: "Chocolate" } },
  { id: "chocolate-candy",  cat: "other",   carbs: 60, gi: 50, piece: 15, name: { uk: "Шоколадна цукерка", en: "Chocolate candy", es: "Bombón de chocolate" } },
  { id: "pudding",          cat: "other",   carbs: 16, gi: 45, name: { uk: "Пудинг",                  en: "Pudding",             es: "Pudín" } },
  { id: "kissel",           cat: "other",   carbs: 13, gi: 50, liquid: true, name: { uk: "Кисіль",     en: "Kissel",              es: "Kissel" } },
  { id: "compote",          cat: "other",   carbs: 14, gi: 60, liquid: true, name: { uk: "Компот",     en: "Compote (fruit drink)", es: "Compota (bebida)" } },
  { id: "kvass",            cat: "other",   carbs: 5,  gi: 45, liquid: true, name: { uk: "Квас",       en: "Kvass",               es: "Kvas" } },
  { id: "beer-light",       cat: "other",   carbs: 4,  gi: 66, liquid: true, name: { uk: "Пиво світле", en: "Light beer",         es: "Cerveza rubia" } },
  { id: "cola",             cat: "other",   carbs: 11, gi: 63, liquid: true, name: { uk: "Солодка газована вода", en: "Sugary soda", es: "Refresco azucarado" } }
];
