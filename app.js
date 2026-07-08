// SUPABASE KONFİQURASİYASI
const SUPABASE_URL = "https://kjhudctuuvfjgbifgjky.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqaHVkY3R1dXZmamdiaWZnamt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MTIxMTQsImV4cCI6MjA5OTA4ODExNH0.NGvxhUFFnTrVukZL8E2brAz1aZ7yGm5GwsTo9y2nhSs";

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// İmitasiya edilmiş Cari İstifadəçi ID (Sisteminizdə qeydiyyat olanda dinamikləşəcək)
const CURRENT_USER_ID = "88888888-8888-8888-8888-888888888888"; 

// Ölkələrin Siyahısı (Uğur reytinqləri ilə birlikdə topdan satış qiymətinə əsasən tənzimlənir)
const countriesData = [
  { id: 0, name: "Rusiya", price: 0.40, rate: "92%", flag: "🇷🇺" },
  { id: 1, name: "Ukrayna", price: 0.60, rate: "95%", flag: "🇺🇦" },
  { id: 6, name: "İndoneziya", price: 0.35, rate: "89%", flag: "🇮🇩" },
  { id: 15, name: "Polşa", price: 0.80, rate: "97%", flag: "🇵🇱" },
  { id: 22, name: "Hindistan", price: 0.30, rate: "86%", flag: "🇮🇳" }
];

let activeOrderSubscription = null;
let countdownInterval = null;
let currentOrderId = null; 

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

// 1. İstifadəçi Balansını Yüklə
async function loadUserBalance() {
  const { data, error } = await supabase
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

// 2. Ölkələri Siyahıla
function renderCountries() {
  countriesListEl.innerHTML = '';
  countriesData.forEach(c => {
    const div = document.createElement('div');
    div.className = "flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition active:scale-[0.99]";
    div.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-xl">${c.flag}</span>
        <div>
          <p class="font-medium text-sm text-slate-200">${c.name}</p>
          <p class="text-xs text-emerald-400 font-semibold">Uğur: ${c.rate}</p>
        </div>
      </div>
      <button class="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 text-xs font-bold px-3 py-2 rounded-lg border border-emerald-500/20 transition">
        ${c.price.toFixed(2)} AZN
      </button>
    `;
    div.onclick = () => buyNumber(c);
    countriesListEl.appendChild(div);
  });
}

// 3. Nömrə Satın Al (Sifariş Yarat)
async function buyNumber(country) {
  const currentBalance = await loadUserBalance();
  if (currentBalance < country.price) {
    alert("Balansınız yetərli deyil! Zəhmət olmasa artırın.");
    return;
  }

  // Müştəridən pul çıx və sifariş yarat
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      { 
        user_id: CURRENT_USER_ID, 
        country_id: country.id, 
        price: country.price,
        status: 'pending',
        phone_number: 'Yüklənir...' // Edge function və ya backend provayderdən nömrəni bura yazacaq
      }
    ])
    .select()
    .single();

  if (order) {
    currentOrderId = order.id;
    showOrderUI(order);
    listenToOrderChanges(order.id);
  }
}

// 4. Sifariş İnterfeysini Göstər və Taymeri Başlat
function showOrderUI(order) {
  activeSection.classList.remove('hidden');
  numDisplay.innerText = order.phone_number;
  smsDisplay.classList.add('hidden');
  smsLoader.classList.remove('hidden');
  smsLoader.innerText = "⏳ Provayderdən nömrə alınır və ya SMS gözlənilir...";
  
  // 15 dəqiqəlik geri sayım
  clearInterval(countdownInterval);
  let timeLeft = 15 * 60;
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

// 5. SUPABASE REAL-TIME: Sifariş masasını canlı izlə
function listenToOrderChanges(orderId) {
  if (activeOrderSubscription) {
    supabase.removeChannel(activeOrderSubscription);
  }

  activeOrderSubscription = supabase
    .channel(`order-changes-${orderId}`)
    .on('postgres_changes', { event: 'UPDATE', filter: `id=eq.${orderId}`, schema: 'public', table: 'orders' }, payload => {
      const updatedOrder = payload.new;
      
      // Nömrə təyin olunduqda ekranda yenilə
      if (updatedOrder.phone_number) {
        numDisplay.innerText = updatedOrder.phone_number;
      }
      
      // SMS kodu gəldikdə ekranda göstər
      if (updatedOrder.status === 'sms_received' && updatedOrder.sms_code) {
        clearInterval(countdownInterval);
        smsLoader.classList.add('hidden');
        smsDisplay.innerText = updatedOrder.sms_code;
        smsDisplay.classList.remove('hidden');
        loadUserBalance(); // Balans yenilənməsini vizual göstər
        if (activeOrderSubscription) supabase.removeChannel(activeOrderSubscription);
      }
    })
    .subscribe();
}

// 6. Sifarişi İptal Et (Geri Ödəmə)
async function cancelOrder() {
  if (!currentOrderId) return;
  
  const { error } = await supabase
    .from('orders')
    .update({ status: 'canceled' })
    .eq('id', currentOrderId);

  if (!error) {
    clearInterval(countdownInterval);
    activeSection.classList.add('hidden');
    currentOrderId = null;
    loadUserBalance();
    alert("Sifariş ləğv edildi və balansınız bərpa olundu.");
  }
}

// Kopyalama Funksiyası
btnCopyNum.onclick = () => {
  navigator.clipboard.writeText(numDisplay.innerText);
  alert("Nömrə kopyalandı!");
};

btnCancel.onclick = () => cancelOrder();

// Pul Artırma Simulasiyası (Cryptomus qoşulana qədər balansı test etmək üçün)
btnAddFunds.onclick = async () => {
  const { data } = await supabase.from('profiles').select('balance').eq('id', CURRENT_USER_ID).single();
  await supabase.from('profiles').update({ balance: (data.balance + 5.00) }).eq('id', CURRENT_USER_ID);
  loadUserBalance();
};

// Sistemi Başlat
window.onload = () => {
  loadUserBalance();
  renderCountries();
};
