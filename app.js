const SUPABASE_URL = "https://kjhudctuuvfjgbifgjky.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqaHVkY3R1dXZmamdiaWZnamt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTIxMTQsImV4cCI6MjA5OTA4ODExNH0.NGvxhUFFnTrVukZL8E2brAz1aZ7yGm5GwsTo9y2nhSs";

const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Dünya Ölkələrinin Geniş Siyahısı
const countriesData = [
  { id: 0, name: "Rusiya", price: 0.40, rate: "92%", flag: "🇷🇺", code: "+7" },
  { id: 1, name: "Ukrayna", price: 0.60, rate: "95%", flag: "🇺🇦", code: "+380" },
  { id: 6, name: "İndoneziya", price: 0.35, rate: "89%", flag: "🇮🇩", code: "+62" },
  { id: 15, name: "Polşa", price: 0.80, rate: "97%", flag: "🇵🇱", code: "+48" },
  { id: 22, name: "Hindistan", price: 0.30, rate: "86%", flag: "🇮🇳", code: "+91" },
  { id: 10, name: "Böyük Britaniya", price: 0.90, rate: "99%", flag: "🇬🇧", code: "+44" },
  { id: 12, name: "ABŞ", price: 0.50, rate: "91%", flag: "🇺🇸", code: "+1" },
  { id: 25, name: "Almaniya", price: 1.20, rate: "98%", flag: "🇩🇪", code: "+49" },
  { id: 30, name: "Türkiyə", price: 0.75, rate: "94%", flag: "🇹🇷", code: "+90" },
  { id: 40, name: "Braziliya", price: 0.45, rate: "88%", flag: "🇧🇷", code: "+55" },
  { id: 50, name: "Fransa", price: 1.10, rate: "96%", flag: "🇫🇷", code: "+33" },
  { id: 60, name: "Niderland", price: 1.30, rate: "97%", flag: "🇳🇱", code: "+31" }
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
