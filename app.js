const SUPABASE_URL = "https://kjhudctuuvfjgbifgjky.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqaHVkY3R1dXZmamdiaWZnamt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTIxMTQsImV4cCI6MjA5OTA4ODExNH0.NGvxhUFFnTrVukZL8E2brAz1aZ7yGm5GwsTo9y2nhSs";

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Dünya Ölkələrinin Geniş Siyahısı
const countriesData = [
  { id: 0, name: "Rusiya", price: 0.40, rate: "92%", flag: "🇷🇺", code: "+7" },
  { id: 1, name: "Ukrayna", price: 0.60, rate: "95%", flag: "🇺🇦", code: "+380" },
  { id: 2, name: "İndoneziya", price: 0.35, rate: "89%", flag: "🇮🇩", code: "+62" },
  { id: 3, name: "Polşa", price: 0.80, rate: "97%", flag: "🇵🇱", code: "+48" },
  { id: 4, name: "Hindistan", price: 0.30, rate: "86%", flag: "🇮🇳", code: "+91" },
  { id: 5, name: "Böyük Britaniya", price: 0.90, rate: "99%", flag: "🇬🇧", code: "+44" },
  { id: 6, name: "ABŞ", price: 0.50, rate: "91%", flag: "🇺🇸", code: "+1" },
  { id: 7, name: "Almaniya", price: 1.20, rate: "98%", flag: "🇩🇪", code: "+49" },
  { id: 8, name: "Türkiyə", price: 0.75, rate: "94%", flag: "🇹🇷", code: "+90" },
  { id: 9, name: "Braziliya", price: 0.45, rate: "88%", flag: "🇧🇷", code: "+55" },
  { id: 10, name: "Fransa", price: 1.10, rate: "96%", flag: "🇫🇷", code: "+33" },
  { id: 11, name: "Niderland", price: 1.30, rate: "97%", flag: "🇳🇱", code: "+31" },
  { id: 12, name: "Azərbaycan", price: 0.50, rate: "95%", flag: "🇦🇿", code: "+994" },
  { id: 13, name: "Qazaxıstan", price: 0.40, rate: "91%", flag: "🇰🇿", code: "+7" },
  { id: 14, name: "Özbəkistan", price: 0.35, rate: "89%", flag: "🇺🇿", code: "+998" },
  { id: 15, name: "Qırğızıstan", price: 0.35, rate: "88%", flag: "🇰🇬", code: "+996" },
  { id: 16, name: "Tacikistan", price: 0.30, rate: "85%", flag: "🇹🇯", code: "+992" },
  { id: 17, name: "Türkmənistan", price: 0.60, rate: "80%", flag: "🇹🇲", code: "+993" },
  { id: 18, name: "Gürcüstan", price: 0.55, rate: "93%", flag: "🇬🇪", code: "+995" },
  { id: 19, name: "Ermənistan", price: 0.50, rate: "90%", flag: "🇦🇲", code: "+374" },
  { id: 20, name: "Belarus", price: 0.40, rate: "92%", flag: "🇧🇾", code: "+375" },
  { id: 21, name: "Moldova", price: 0.45, rate: "91%", flag: "🇲🇩", code: "+373" },
  { id: 22, name: "Çin", price: 0.65, rate: "90%", flag: "🇨🇳", code: "+86" },
  { id: 23, name: "Yaponiya", price: 1.40, rate: "99%", flag: "🇯🇵", code: "+81" },
  { id: 24, name: "Cənubi Koreya", price: 1.10, rate: "97%", flag: "🇰🇷", code: "+82" },
  { id: 25, name: "İtaliya", price: 1.00, rate: "96%", flag: "🇮🇹", code: "+39" },
  { id: 26, name: "İspaniya", price: 0.95, rate: "95%", flag: "🇪🇸", code: "+34" },
  { id: 27, name: "Portuqaliya", price: 0.90, rate: "94%", flag: "🇵🇹", code: "+351" },
  { id: 28, name: "Kanada", price: 0.85, rate: "94%", flag: "🇨🇦", code: "+1" },
  { id: 29, name: "Avstraliya", price: 1.05, rate: "96%", flag: "🇦🇺", code: "+61" },
  { id: 30, name: "Yeni Zelandiya", price: 1.10, rate: "97%", flag: "🇳🇿", code: "+64" },
  { id: 31, name: "Səudiyyə Ərəbistanı", price: 0.80, rate: "93%", flag: "🇸🇦", code: "+966" },
  { id: 32, "BƏƏ", price: 0.95, rate: "96%", flag: "🇦🇪", code: "+971" },
  { id: 33, name: "Qətər", price: 1.20, rate: "97%", flag: "🇶🇦", code: "+974" },
  { id: 34, name: "Küveyt", price: 1.15, rate: "95%", flag: "🇰🇼", code: "+965" },
  { id: 35, name: "Bəhreyn", price: 0.90, rate: "94%", flag: "🇧🇭", code: "+973" },
  { id: 36, name: "Oman", price: 0.85, rate: "93%", flag: "🇴🇲", code: "+968" },
  { id: 37, name: "Misir", price: 0.35, rate: "87%", flag: "🇪🇬", code: "+20" },
  { id: 38, name: "Cənubi Afrika", price: 0.50, rate: "91%", flag: "🇿🇦", code: "+27" },
  { id: 39, name: "Nigeriya", price: 0.30, rate: "84%", flag: "🇳🇬", code: "+234" },
  { id: 40, name: "Keniya", price: 0.35, rate: "88%", flag: "🇰🇪", code: "+254" },
  { id: 41, name: "Mərakeş", price: 0.45, rate: "90%", flag: "🇲🇦", code: "+212" },
  { id: 42, name: "Əlcəzair", price: 0.40, rate: "88%", flag: "🇩🇿", code: "+213" },
  { id: 43, name: "Tunis", price: 0.45, rate: "89%", flag: "🇹🇳", code: "+216" },
  { id: 44, name: "Liviya", price: 0.50, rate: "82%", flag: "🇱🇾", code: "+218" },
  { id: 45, name: "İran", price: 0.40, rate: "85%", flag: "🇮🇷", code: "+98" },
  { id: 46, name: "İraq", price: 0.45, rate: "86%", flag: "🇮🇶", code: "+964" },
  { id: 47, name: "İsrail", price: 0.90, rate: "95%", flag: "🇮🇱", code: "+972" },
  { id: 48, name: "İordaniya", price: 0.60, rate: "91%", flag: "🇯🇴", code: "+962" },
  { id: 49, name: "Livan", price: 0.55, rate: "87%", flag: "🇱🇧", code: "+961" },
  { id: 50, name: "Suriya", price: 0.50, rate: "78%", flag: "🇸🇾", code: "+963" },
  { id: 51, name: "Yəmən", price: 0.45, rate: "75%", flag: "🇾🇪", code: "+967" },
  { id: 52, name: "Pakistan", price: 0.25, rate: "83%", flag: "🇵🇰", code: "+92" },
  { id: 53, name: "Banqladeş", price: 0.30, rate: "85%", flag: "🇧🇩", code: "+880" },
  { id: 54, name: "Şri-Lanka", price: 0.35, rate: "88%", flag: "🇱🇰", code: "+94" },
  { id: 55, name: "Maldiv adaları", price: 0.80, rate: "94%", flag: "🇲🇻", code: "+960" },
  { id: 56, name: "Nepal", price: 0.30, rate: "86%", flag: "🇳🇵", code: "+977" },
  { id: 57, name: "Butan", price: 0.40, rate: "89%", flag: "🇧🇹", code: "+975" },
  { id: 58, name: "Əfqanıstan", price: 0.35, rate: "75%", flag: "🇦🇫", code: "+93" },
  { id: 59, name: "Malayziya", price: 0.50, rate: "92%", flag: "🇲🇾", code: "+60" },
  { id: 60, name: "Sinqapur", price: 1.50, rate: "99%", flag: "🇸🇬", code: "+65" },
  { id: 61, name: "Tayland", price: 0.40, rate: "91%", flag: "🇹🇭", code: "+66" },
  { id: 62, name: "Vyetnam", price: 0.35, rate: "89%", flag: "🇻🇳", code: "+84" },
  { id: 63, name: "Filippin", price: 0.35, rate: "88%", flag: "🇵🇭", code: "+63" },
  { id: 64, name: "Miyanma", price: 0.30, rate: "82%", flag: "🇲🇲", code: "+95" },
  { id: 65, name: "Kamboca", price: 0.35, rate: "86%", flag: "🇰🇭", code: "+855" },
  { id: 66, name: "Laos", price: 0.35, rate: "85%", flag: "🇱🇦", code: "+856" },
  { id: 67, name: "Bruney", price: 0.80, rate: "94%", flag: "🇧🇳", code: "+673" },
  { id: 68, name: "Şərqi Timor", price: 0.40, rate: "84%", flag: "🇹🇱", code: "+670" },
  { id: 69, name: "Mundisialın (Meksika)", price: 0.55, rate: "91%", flag: "🇲🇽", code: "+52" },
  { id: 70, name: "Argentina", price: 0.50, rate: "90%", flag: "🇦🇷", code: "+54" },
  { id: 71, name: "Kolumbiya", price: 0.40, rate: "89%", flag: "🇨🇴", code: "+57" },
  { id: 72, name: "Çili", price: 0.65, rate: "93%", flag: "🇨🇱", code: "+56" },
  { id: 73, name: "Peru", price: 0.40, rate: "89%", flag: "🇵🇪", code: "+51" },
  { id: 74, name: "Venesuela", price: 0.45, rate: "80%", flag: "🇻🇪", code: "+58" },
  { id: 75, name: "Ekvador", price: 0.45, rate: "88%", flag: "🇪🇨", code: "+593" },
  { id: 76, name: "Boliviya", price: 0.35, rate: "87%", flag: "🇧🇴", code: "+591" },
  { id: 77, name: "Paraqvay", price: 0.40, rate: "88%", flag: "🇵🇾", code: "+595" },
  { id: 78, name: "Uruqvay", price: 0.70, rate: "93%", flag: "🇺🇾", code: "+598" },
  { id: 79, name: "Qayana", price: 0.45, rate: "86%", flag: "🇬🇾", code: "+592" },
  { id: 80, name: "Surinam", price: 0.40, rate: "85%", flag: "🇸🇷", code: "+597" },
  { id: 81, name: "Yunanıstan", price: 0.75, rate: "94%", flag: "🇬🇷", code: "+30" },
  { id: 82, name: "Kipr", price: 0.80, rate: "95%", flag: "🇨🇾", code: "+357" },
  { id: 83, name: "Malta", price: 0.85, rate: "96%", flag: "🇲🇹", code: "+356" },
  { id: 84, name: "Belçika", price: 1.15, rate: "97%", flag: "🇧🇪", code: "+32" },
  { id: 85, name: "İsveçrə", price: 1.60, rate: "99%", flag: "🇨🇭", code: "+41" },
  { id: 86, name: "Avstriya", price: 1.20, rate: "98%", flag: "🇦🇹", code: "+43" },
  { id: 87, name: "Çexiya", price: 0.75, rate: "95%", flag: "🇨🇿", code: "+420" },
  { id: 88, name: "Slovakiya", price: 0.75, rate: "94%", flag: "🇸🇰", code: "+421" },
  { id: 89, name: "Macarıstan", price: 0.70, rate: "93%", flag: "🇭🇺", code: "+36" },
  { id: 90, name: "Rumıniya", price: 0.65, rate: "93%", flag: "🇷🇴", code: "+40" },
  { id: 91, name: "Bolqarıstan", price: 0.65, rate: "92%", flag: "🇧🇬", code: "+359" },
  { id: 92, name: "Serbiya", price: 0.60, rate: "91%", flag: "🇷🇸", code: "+381" },
  { id: 93, name: "Xorvatiya", price: 0.80, rate: "95%", flag: "🇭🇷", code: "+385" },
  { id: 94, name: "Sloveniya", price: 0.85, rate: "96%", flag: "🇸🇮", code: "+386" },
  { id: 95, name: "Bosniya və Herseqovina", price: 0.55, rate: "90%", flag: "🇧🇦", code: "+387" },
  { id: 96, name: "Monteneqro", price: 0.65, rate: "92%", flag: "🇲🇪", code: "+382" },
  { id: 97, name: "Şimali Makedoniya", price: 0.55, rate: "90%", flag: "🇲🇰", code: "+389" },
  { id: 98, name: "Albaniya", price: 0.55, rate: "91%", flag: "🇦🇱", code: "+355" },
  { id: 99, name: "İsveç", price: 1.25, rate: "98%", flag: "🇸🇪", code: "+46" },
  { id: 100, name: "Norveç", price: 1.40, rate: "99%", flag: "🇳🇴", code: "+47" },
  { id: 101, name: "Danimarka", price: 1.30, rate: "98%", flag: "🇩🇰", code: "+45" },
  { id: 102, name: "Finlandiya", price: 1.20, rate: "98%", flag: "🇫🇮", code: "+358" },
  { id: 103, name: "İslandiya", price: 1.35, rate: "97%", flag: "🇮🇸", code: "+354" },
  { id: 104, name: "Estoniya", price: 0.80, rate: "96%", flag: "🇪🇪", code: "+372" },
  { id: 105, name: "Latviya", price: 0.75, rate: "95%", flag: "🇱🇻", code: "+371" },
  { id: 106, name: "Litva", price: 0.75, rate: "95%", flag: "🇱🇹", code: "+370" },
  { id: 107, name: "İrlandiya", price: 1.10, rate: "97%", flag: "🇮🇪", code: "+353" },
  { id: 108, name: "Lüksemburq", price: 1.40, rate: "99%", flag: "🇱🇺", code: "+352" },
  { id: 109, name: "Kuba", price: 0.50, rate: "83%", flag: "🇨🇺", code: "+53" },
  { id: 110, name: "Yamayka", price: 0.55, rate: "89%", flag: "🇯🇲", code: "+1" },
  { id: 111, name: "Haiti", price: 0.40, rate: "76%", flag: "🇭🇹", code: "+509" },
  { id: 112, name: "Dominikan Respublikası", price: 0.50, rate: "89%", flag: "🇩🇴", code: "+1" },
  { id: 113, name: "Qvatemala", price: 0.45, rate: "88%", flag: "🇬🇹", code: "+502" },
  { id: 114, name: "Honduras", price: 0.40, rate: "87%", flag: "🇭🇳", code: "+504" },
  { id: 115, name: "El Salvador", price: 0.45, rate: "88%", flag: "🇸🇻", code: "+503" },
  { id: 116, name: "Nikaraqua", price: 0.40, rate: "86%", flag: "🇳🇮", code: "+505" },
  { id: 117, name: "Kosta Rika", price: 0.60, rate: "92%", flag: "🇨🇷", code: "+506" },
  { id: 118, name: "Panama", price: 0.60, rate: "91%", flag: "🇵🇦", code: "+507" },
  { id: 119, name: "Anqola", price: 0.35, rate: "83%", flag: "🇦🇴", code: "+244" },
  { id: 120, name: "Qana", price: 0.35, rate: "87%", flag: "🇬🇭", code: "+233" },
  { id: 121, name: "Kot-d'İvuar", price: 0.40, rate: "88%", flag: "🇨🇮", code: "+225" },
  { id: 122, name: "Kamerun", price: 0.35, rate: "85%", flag: "🇨🇲", code: "+237" },
  { id: 123, name: "Efiopiya", price: 0.30, rate: "82%", flag: "🇪🇹", code: "+251" },
  { id: 124, name: "Tanzaniya", price: 0.35, rate: "88%", flag: "🇹🇿", code: "+255" },
  { id: 125, name: "Uqanda", price: 0.30, rate: "86%", flag: "🇺🇬", code: "+256" },
  { id: 126, name: "Zimbabve", price: 0.40, rate: "81%", flag: "🇿🇼", code: "+263" },
  { id: 127, name: "Zambiya", price: 0.35, rate: "85%", flag: "🇿🇲", code: "+260" },
  { id: 128, name: "Botsvana", price: 0.50, rate: "90%", flag: "🇧🇼", code: "+267" },
  { id: 129, name: "Namibiya", price: 0.50, rate: "89%", flag: "🇳🇦", code: "+264" },
  { id: 130, name: "Moqambik", price: 0.35, rate: "84%", flag: "🇲🇿", code: "+258" },
  { id: 131, name: "Madaqaskar", price: 0.35, rate: "85%", flag: "🇲🇬", code: "+261" },
  { id: 132, name: "Mavriki", price: 0.65, rate: "93%", flag: "🇲🇺", code: "+230" },
  { id: 133, name: "Seneqal", price: 0.40, rate: "88%", flag: "🇸🇳", code: "+221" },
  { id: 134, name: "Mali", price: 0.30, rate: "80%", flag: "🇲🇱", code: "+223" },
  { id: 135, name: "Burkina Faso", price: 0.30, rate: "81%", flag: "🇧🇫", code: "+226" },
  { id: 136, name: "Niger", price: 0.30, rate: "79%", flag: "🇳🇪", code: "+227" },
  { id: 137, name: "Çad", price: 0.35, rate: "78%", flag: "🇹🇩", code: "+235" },
  { id: 138, name: "Sudan", price: 0.35, rate: "76%", flag: "🇸🇩", code: "+249" },
  { id: 139, name: "Cənubi Sudan", price: 0.35, rate: "70%", flag: "🇸🇸", code: "+211" },
  { id: 140, name: "Somali", price: 0.30, rate: "72%", flag: "🇸🇴", code: "+252" },
  { id: 141, name: "Konqo DR", price: 0.35, rate: "80%", flag: "🇨🇩", code: "+243" },
  { id: 142, name: "Konqo Respublikası", price: 0.40, rate: "83%", flag: "🇨🇬", code: "+242" },
  { id: 143, name: "Qabon", price: 0.55, rate: "88%", flag: "🇬🇦", code: "+241" },
  { id: 144, name: "Mərkəzi Afrika Respublikası", price: 0.35, rate: "73%", flag: "🇨🇫", code: "+236" },
  { id: 145, name: "Eritreya", price: 0.40, rate: "77%", flag: "🇪🇷", code: "+291" },
  { id: 146, name: "Cibuti", price: 0.50, rate: "86%", flag: "🇩🇯", code: "+253" },
  { id: 147, name: "Qambiya", price: 0.35, rate: "85%", flag: "🇬🇲", code: "+220" },
  { id: 148, name: "Qvineya", price: 0.30, rate: "82%", flag: "🇬🇳", code: "+224" },
  { id: 149, name: "Qvineya-Bisau", price: 0.30, rate: "81%", flag: "🇬🇼", code: "+245" },
  { id: 150, name: "Syerra-Leone", price: 0.30, rate: "80%", flag: "🇸🇱", code: "+232" },
  { id: 151, name: "Liberiya", price: 0.30, rate: "81%", flag: "🇱🇷", code: "+231" },
  { id: 152, name: "Togo", price: 0.35, rate: "84%", flag: "🇹🇬", code: "+228" },
  { id: 153, name: "Benin", price: 0.35, rate: "85%", flag: "🇧🇯", code: "+229" },
  { id: 154, name: "Ekvatorial Qvineya", price: 0.50, rate: "84%", flag: "🇬🇶", code: "+240" },
  { id: 155, name: "Mavritaniya", price: 0.35, rate: "83%", flag: "🇲🇷", code: "+222" },
  { id: 156, name: "Lesoto", price: 0.45, rate: "86%", flag: "🇱🇸", code: "+266" },
  { id: 157, name: "Esvatini", price: 0.45, rate: "86%", flag: "🇸🇿", code: "+268" },
  { id: 158, name: "Malavi", price: 0.30, rate: "83%", flag: "🇲🇼", code: "+265" },
  { id: 159, name: "Burundi", price: 0.30, rate: "79%", flag: "🇧🇮", code: "+257" },
  { id: 160, name: "Ruanda", price: 0.35, rate: "88%", flag: "🇷🇼", code: "+250" },
  { id: 161, name: "Kaboverde", price: 0.55, rate: "90%", flag: "🇨🇻", code: "+238" },
  { id: 162, name: "San-Tome və Prinsipi", price: 0.45, rate: "85%", flag: "🇸🇹", code: "+239" },
  { id: 163, name: "Seyşel adaları", price: 0.85, rate: "94%", flag: "🇸🇨", code: "+248" },
  { id: 164, name: "Komor adaları", price: 0.40, rate: "82%", flag: "🇰🇲", code: "+269" },
  { id: 165, name: "Monako", price: 1.80, rate: "99%", flag: "🇲🇨", code: "+377" },
  { id: 166, name: "Andorra", price: 1.10, rate: "97%", flag: "🇦🇩", code: "+376" },
  { id: 167, name: "Lixtenşteyn", price: 1.60, rate: "99%", flag: "🇱🇮", code: "+423" },
  { id: 168, name: "San-Marino", price: 1.00, rate: "97%", flag: "🇸🇲", code: "+378" },
  { id: 169, name: "Vatikan", price: 1.50, rate: "98%", flag: "🇻🇦", code: "+39" },
  { id: 170, name: "Monqolustan", price: 0.45, rate: "90%", flag: "🇲🇳", code: "+976" },
  { id: 171, name: "Fici", price: 0.55, rate: "91%", flag: "🇫🇯", code: "+679" },
  { id: 172, name: "Papua-Yeni Qvineya", price: 0.40, rate: "83%", flag: "🇵🇬", code: "+675" },
  { id: 173, name: "Samoa", price: 0.50, rate: "89%", flag: "🇼🇸", code: "+685" },
  { id: 174, name: "Solomon adaları", price: 0.45, rate: "85%", flag: "🇸🇧", code: "+677" },
  { id: 175, name: "Vanuatu", price: 0.50, rate: "87%", flag: "🇻🇺", code: "+678" },
  { id: 176, name: "Tonqa", price: 0.50, rate: "88%", flag: "🇹🇴", code: "+676" },
  { id: 177, name: "Kiribati", price: 0.45, rate: "86%", flag: "🇰🇮", code: "+686" },
  { id: 178, name: "Tuvalu", price: 0.55, rate: "85%", flag: "🇹🇻", code: "+688" },
  { id: 179, name: "Nauru", price: 0.50, rate: "84%", flag: "🇳🇷", code: "+674" },
  { id: 180, name: "Marşall adaları", price: 0.55, rate: "87%", flag: "🇲🇭", code: "+692" },
  { id: 181, name: "Mikroneziya", price: 0.50, rate: "86%", flag: "🇫🇲", code: "+691" },
  { id: 182, name: "Palau", price: 0.60, rate: "90%", flag: "🇵🇼", code: "+680" },
  { id: 183, name: "Baham adaları", price: 0.75, rate: "93%", flag: "🇧🇸", code: "+1" },
  { id: 184, name: "Barbados", price: 0.75, rate: "94%", flag: "🇧🇧", code: "+1" },
  { id: 185, name: "Trinidad və Tobaqo", price: 0.60, rate: "91%", flag: "🇹🇹", code: "+1" },
  { id: 186, name: "Yamayka", price: 0.55, rate: "89%", flag: "🇯🇲", code: "+1" },
  { id: 187, name: "Sent-Lüsiya", price: 0.60, rate: "90%", flag: "🇱🇨", code: "+1" },
  { id: 188, name: "Sent-Vinsent və Qrenadin", price: 0.55, rate: "89%", flag: "🇻🇨", code: "+1" },
  { id: 189, name: "Qrenada", price: 0.60, rate: "90%", flag: "🇬🇩", code: "+1" },
  { id: 190, name: "Antiqua və Barbuda", price: 0.65, rate: "91%", flag: "🇦🇬", code: "+1" },
  { id: 191, name: "Sent-Kits və Nevis", price: 0.65, rate: "91%", flag: "🇰🇳", code: "+1" },
  { id: 192, name: "Beliz", price: 0.50, rate: "88%", flag: "🇧🇿", code: "+501" },
  { id: 193, name: "Kosovo", price: 0.55, rate: "91%", flag: "🇽🇰", code: "+383" },
  { id: 194, name: "Tayvan", price: 0.90, rate: "96%", flag: "🇹🇼", code: "+886" }
];

let activeOrderSubscription = null;
let countdownInterval = null;
let currentOrderId = null;
let CURRENT_USER_ID = null;

// DOM Elementləri
const balanceEl = document.getElementById('user-balance');
const countriesListEl = document.getElementById('countries-list');
const activeSection = document.getElementById('active-order-section');
const timerEl = document.getElementById('order-timer');
const numDisplay = document.getElementById('display-number');
const smsLoader = document.getElementById('sms-loader');
const smsDisplay = document.getElementById('display-sms');
const btnCancel = document.getElementById('btn-cancel-order');
const btnCopyNum = document.getElementById('btn-copy-num');
const btnAddFunds = document.getElementById('btn-add-funds');
const searchInput = document.getElementById('search-country');

// 1. Unikal İstifadəçi Seansı və Avtomatik 10 AZN Balans
async function initializeUser() {
  if (!supabaseClient) return;

  // Mövcud sessiyanı yoxla
  let { data: { session } } = await supabaseClient.auth.getSession();
  
  // Əgər sessiya yoxdursa, yeni Anonim istifadəçi yarat (Hər cihaz üçün fərqli ID)
  if (!session) {
    const { data, error } = await supabaseClient.auth.signInAnonymously();
    if (error) {
      console.error("Giriş xətası:", error.message);
      return;
    }
    session = data.session;
  }

  CURRENT_USER_ID = session.user.id;

  // Profil varmı deyə yoxla, yoxdursa 10 AZN-lə yarat
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('balance')
    .eq('id', CURRENT_USER_ID)
    .single();

  if (!profile) {
    await supabaseClient
      .from('profiles')
      .insert([{ id: CURRENT_USER_ID, balance: 10.00 }]);
  }

  await loadUserBalance();
  await checkActiveOrder(); // Səhifə yenilənəndə yarımçıq sifarişi yoxla
}

// 2. Balansı Yaxşılaşdırılmış Şəkildə Yüklə
async function loadUserBalance() {
  if (!supabaseClient || !CURRENT_USER_ID) return 0;
  const { data } = await supabaseClient
    .from('profiles')
    .select('balance')
    .eq('id', CURRENT_USER_ID)
    .single();

  if (data) {
    balanceEl.innerText = parseFloat(data.balance).toFixed(2);
    return data.balance;
  }
  return 0;
}

// 3. Yarımçıq Qalan Sifarişləri Yoxla (Yenilənmə Qoruyucusu)
async function checkActiveOrder() {
  const { data: orders } = await supabaseClient
    .from('orders')
    .select('*')
    .eq('user_id', CURRENT_USER_ID)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1);

  if (orders && orders.length > 0) {
    const activeOrder = orders[0];
    
    // Keçən zamanı hesabla (15 dəqiqə limit)
    const orderTime = new Date(activeOrder.created_at).getTime();
    const now = new Date().getTime();
    const diffSeconds = Math.floor((now - orderTime) / 1000);
    const limit = 15 * 60;

    if (diffSeconds < limit) {
      currentOrderId = activeOrder.id;
      showOrderUI(activeOrder, limit - diffSeconds);
      listenToOrderChanges(activeOrder.id);
    } else {
      // Vaxtı keçibsə avtomatik ləğv et
      await supabaseClient.from('orders').update({ status: 'canceled' }).eq('id', activeOrder.id);
      loadUserBalance();
    }
  }
}

// 4. Ölkələri Siyahıla və Axtarış Sistemini Aktiv Et
function renderCountries(filterText = "") {
  countriesListEl.innerHTML = '';
  const filtered = countriesData.filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()));

  if (filtered.length === 0) {
    countriesListEl.innerHTML = `<p class="text-center text-xs text-slate-500 py-4">Ölkə tapılmadı...</p>`;
    return;
  }

  filtered.forEach(c => {
    const div = document.createElement('div');
    div.className = "flex justify-between items-center bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 cursor-pointer transition-all duration-200 group";
    div.innerHTML = `
      <div class="flex items-center gap-3.5">
        <span class="text-2xl group-hover:scale-110 transition-transform">${c.flag}</span>
        <div>
          <p class="font-semibold text-sm text-slate-200">${c.name}</p>
          <p class="text-xs text-emerald-400/80 font-medium">Uğurlu Activation: ${c.rate}</p>
        </div>
      </div>
      <button class="bg-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-slate-950 text-emerald-400 text-xs font-bold px-4 py-2 rounded-lg border border-emerald-500/20 transition-all duration-200">
        ${c.price.toFixed(2)} AZN
      </button>
    `;
    div.onclick = () => buyNumber(c);
    countriesListEl.appendChild(div);
  });
}

// 5. Nömrə Satın Al
async function buyNumber(country) {
  if (!supabaseClient || currentOrderId) {
    if(currentOrderId) alert("Hazırda aktiv bir sifarişiniz var!");
    return;
  }
  
  const currentBalance = await loadUserBalance();
  if (currentBalance < country.price) {
    alert("Balansınız yetərli deyil!");
    return;
  }

  const { data: order } = await supabaseClient
    .from('orders')
    .insert([{ 
        user_id: CURRENT_USER_ID, 
        country_id: country.id, 
        price: country.price,
        status: 'pending',
        phone_number: 'Yüklənir...' 
    }])
    .select()
    .single();

  if (order) {
    currentOrderId = order.id;
    showOrderUI(order, 15 * 60);
    listenToOrderChanges(order.id);
    
    // PROVAYDER SİMULYASİYASI (Real SMS API qoşulanadək test rejimi)
    simulateProviderAPI(order.id, country.code);
  }
}

// 6. Sifariş İnterfeysi və Taymer
function showOrderUI(order, durationSeconds) {
  activeSection.classList.remove('hidden');
  activeSection.scrollIntoView({ behavior: 'smooth' });
  numDisplay.innerText = order.phone_number;
  
  if (order.status === 'sms_received' && order.sms_code) {
    smsLoader.classList.add('hidden');
    smsDisplay.innerText = order.sms_code;
    smsDisplay.classList.remove('hidden');
    return;
  }

  smsDisplay.classList.add('hidden');
  smsLoader.classList.remove('hidden');
  
  clearInterval(countdownInterval);
  let timeLeft = durationSeconds;
  countdownInterval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerEl.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      cancelOrder();
    }
    timeLeft--;
  }, 1000);
}

// 7. Real-time Dinləyici
function listenToOrderChanges(orderId) {
  if (!supabaseClient) return;
  if (activeOrderSubscription) supabaseClient.removeChannel(activeOrderSubscription);

  activeOrderSubscription = supabaseClient
    .channel(`live-orders-${orderId}`)
    .on('postgres_changes', { event: 'UPDATE', filter: `id=eq.${orderId}`, schema: 'public', table: 'orders' }, payload => {
      const updated = payload.new;
      numDisplay.innerText = updated.phone_number;
      
      if (updated.status === 'sms_received' && updated.sms_code) {
        clearInterval(countdownInterval);
        smsLoader.classList.add('hidden');
        smsDisplay.innerText = updated.sms_code;
        smsDisplay.classList.remove('hidden');
        loadUserBalance(); 
        currentOrderId = null;
        if (activeOrderSubscription) supabaseClient.removeChannel(activeOrderSubscription);
      }
    })
    .subscribe();
}

// 8. Sifarişi İptal Et
async function cancelOrder() {
  if (!supabaseClient || !currentOrderId) return;
  
  const { error } = await supabaseClient
    .from('orders')
    .update({ status: 'canceled' })
    .eq('id', currentOrderId);

  if (!error) {
    clearInterval(countdownInterval);
    activeSection.classList.add('hidden');
    currentOrderId = null;
    loadUserBalance();
    alert("Sifariş ləğv edildi və balans geri qaytarıldı.");
  }
}

// 9. Sənədli Test Rejimi Provayder Simulyasiyası
function simulateProviderAPI(orderId, countryCode) {
  // 3 saniyə sonra nömrə generasiya olunur və bazaya yazılır
  setTimeout(async () => {
    if (currentOrderId !== orderId) return;
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    const mockNumber = `${countryCode} ${randomDigits}`;
    
    await supabaseClient.from('orders').update({ phone_number: mockNumber }).eq('id', orderId);
    numDisplay.innerText = mockNumber;

    // Nömrə gəldikdən 7 saniyə sonra bura virtual SMS təsdiq kodu düşür
    setTimeout(async () => {
      if (currentOrderId !== orderId) return;
      const mockSMS = Math.floor(100000 + Math.random() * 900000);
      await supabaseClient.from('orders').update({ sms_code: mockSMS.toString(), status: 'sms_received' }).eq('id', orderId);
    }, 7000);

  }, 3000);
}

// Event Listeners
searchInput.oninput = (e) => renderCountries(e.target.value);
btnCancel.onclick = () => cancelOrder();
btnCopyNum.onclick = () => {
  navigator.clipboard.writeText(numDisplay.innerText);
  alert("Nömrə kopyalandı!");
};
btnAddFunds.onclick = async () => {
  if (!supabaseClient || !CURRENT_USER_ID) return;
  const { data } = await supabaseClient.from('profiles').select('balance').eq('id', CURRENT_USER_ID).single();
  await supabaseClient.from('profiles').update({ balance: (data.balance + 5.00) }).eq('id', CURRENT_USER_ID);
  loadUserBalance();
};

window.onload = () => {
  initializeUser();
  renderCountries();
};
