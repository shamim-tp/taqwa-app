/**
 * Taqwa Property BD - Consolidated Frontend (LocalStorage + Optional Firebase)
 * - Single file, deduplicated UI and backends
 * - Toggle backend via USE_FIREBASE flag
 *
 * Usage:
 * - By default the app runs in demo/local mode (no network).
 * - To enable Firebase set USE_FIREBASE = true and provide firebaseConfig (below).
 * - When USE_FIREBASE = true the Firebase SDKs are loaded dynamically.
 *
 * Notes:
 * - This file is intended to be loaded as a module in the browser:
 *     <script type="module" src="app.js"></script>
 *
 * Author: Consolidated fresh version (generated)
 */

const USE_FIREBASE = false; // set true to use Firebase backend (ensure firebaseConfig filled)
const FIREBASE_SDK_VERSION = '10.7.1'; // change as needed

// If enabling Firebase, fill with your project's config
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// -----------------------------
// DOM references (single set)
// -----------------------------
const app = document.getElementById("app");
const userInfo = document.getElementById("userInfo");
const userNameSpan = document.getElementById("userName");

// -----------------------------
// Backend: LocalStorage (Demo)
// -----------------------------
class BackendLocal {
  constructor() {
    this.initData();
  }

  initData() {
    if (!localStorage.getItem('taqwa_members')) {
      const initialMembers = [
        { memberId: '100', name: 'Admin User', mobile: '01700000000', password: '123', role: 'Admin', monthlyFee: 0, joinDate: '2023-01-01' },
        { memberId: '101', name: 'Abdul Karim', mobile: '01711111111', password: '123', role: 'Member', monthlyFee: 5000, joinDate: '2023-05-15' },
        { memberId: '102', name: 'Rahim Uddin', mobile: '01822222222', password: '123', role: 'Member', monthlyFee: 10000, joinDate: '2023-06-20' }
      ];
      localStorage.setItem('taqwa_members', JSON.stringify(initialMembers));
    }

    if (!localStorage.getItem('taqwa_collections')) {
      const initialCollections = [
        { id: 1, memberId: '101', memberName: 'Abdul Karim', amount: 5000, date: '2023-08-01', month: 'August 2023', status: 'Approved' },
        { id: 2, memberId: '101', memberName: 'Abdul Karim', amount: 5000, date: '2023-09-05', month: 'September 2023', status: 'Approved' },
        { id: 3, memberId: '102', memberName: 'Rahim Uddin', amount: 10000, date: '2023-09-10', month: 'September 2023', status: 'Approved' }
      ];
      localStorage.setItem('taqwa_collections', JSON.stringify(initialCollections));
    }

    if (!localStorage.getItem('taqwa_investments')) {
      const initialInvestments = [{ id: 1, title: 'Land Purchase - Sector 5', amount: 50000, date: '2023-07-10' }];
      localStorage.setItem('taqwa_investments', JSON.stringify(initialInvestments));
    }

    if (!localStorage.getItem('taqwa_funds')) {
      localStorage.setItem('taqwa_funds', JSON.stringify({ englishFund: 25000 }));
    }

    if (!localStorage.getItem('taqwa_notifications')) {
      localStorage.setItem('taqwa_notifications', JSON.stringify([]));
    }
  }

  delay(ms = 200) { return new Promise(r => setTimeout(r, ms)); }

  getMembers() { return JSON.parse(localStorage.getItem('taqwa_members') || '[]'); }
  getCollections() { return JSON.parse(localStorage.getItem('taqwa_collections') || '[]'); }
  getInvestments() { return JSON.parse(localStorage.getItem('taqwa_investments') || '[]'); }
  getFunds() { return JSON.parse(localStorage.getItem('taqwa_funds') || '{"englishFund":0}'); }
  getNotifications() { return JSON.parse(localStorage.getItem('taqwa_notifications') || '[]'); }

  async login(memberId, mobile) {
    await this.delay();
    const members = this.getMembers();
    // allow demo admin if DB empty or explicit
    const user = members.find(m => m.memberId === memberId && m.mobile === mobile);
    if (user) return { status: 'success', ...user };
    throw new Error('Invalid Member ID or Mobile');
  }

  async getDashboardData() {
    await this.delay();
    const members = this.getMembers().filter(m => m.role !== 'Admin');
    const collections = this.getCollections().filter(c => c.status === 'Approved');
    const investments = this.getInvestments();
    const funds = this.getFunds();

    const totalDeposit = collections.reduce((s, c) => s + parseInt(c.amount || 0), 0);
    const totalInvested = investments.reduce((s, i) => s + parseInt(i.amount || 0), 0);
    const englishFund = parseInt(funds.englishFund || 0);
    const availableBalance = (totalDeposit + englishFund) - totalInvested;

    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const thisMonthDeposit = collections.filter(c => c.month === currentMonth).reduce((s, c) => s + parseInt(c.amount || 0), 0);

    return { totalMembers: members.length, totalDeposit, totalInvested, englishFund, availableBalance, thisMonthDeposit };
  }

  async saveCollection(collectionData) {
    await this.delay();
    const members = this.getMembers();
    const member = members.find(m => m.memberId === collectionData.memberId);
    if (!member && collectionData.memberId !== '100') throw new Error('Member ID not found');

    const collections = this.getCollections();
    const newCollection = {
      id: Date.now(),
      memberName: member ? member.name : 'Admin',
      date: new Date().toISOString().split('T')[0],
      status: collectionData.status || 'Approved',
      ...collectionData
    };
    collections.push(newCollection);
    localStorage.setItem('taqwa_collections', JSON.stringify(collections));
    return { success: true, collection: newCollection };
  }

  async addMember(memberData) {
    await this.delay();
    const members = this.getMembers();
    if (members.find(m => m.memberId === memberData.memberId)) throw new Error('Member ID already exists');
    members.push(memberData);
    localStorage.setItem('taqwa_members', JSON.stringify(members));
    return { success: true };
  }

  async saveInvestment(title, amount) {
    await this.delay();
    const investments = this.getInvestments();
    investments.push({ id: Date.now(), title, amount: parseInt(amount), date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('taqwa_investments', JSON.stringify(investments));
    return { success: true };
  }

  async updateEnglishFund(amount) {
    await this.delay();
    const funds = this.getFunds();
    funds.englishFund = parseInt(amount);
    localStorage.setItem('taqwa_funds', JSON.stringify(funds));
    return { success: true };
  }

  async sendNotification(message) {
    await this.delay();
    const notifications = this.getNotifications();
    notifications.push({ id: Date.now(), message, date: new Date().toLocaleString() });
    localStorage.setItem('taqwa_notifications', JSON.stringify(notifications));
    return { success: true };
  }

  async getMemberDue(memberId) {
    await this.delay();
    const members = this.getMembers();
    const member = members.find(m => m.memberId === memberId);
    if (!member) throw new Error('Member not found');
    const collections = this.getCollections().filter(c => c.memberId === memberId && c.status === 'Approved');
    const totalPaid = collections.reduce((s, c) => s + parseInt(c.amount || 0), 0);
    const joinDate = new Date(member.joinDate);
    const now = new Date();
    const monthsJoined = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth()) + 1;
    const totalExpected = monthsJoined * (member.monthlyFee || 0);
    return { paid: totalPaid, due: Math.max(0, totalExpected - totalPaid) };
  }

  async getCollectionById(id) {
    await this.delay();
    return this.getCollections().find(c => c.id === parseInt(id));
  }

  async getMemberCollections(memberId) {
    await this.delay();
    return this.getCollections().filter(c => c.memberId === memberId);
  }

  async getAllMembers() {
    await this.delay();
    return this.getMembers();
  }

  async getMemberProfile(memberId) {
    await this.delay();
    const member = this.getMembers().find(m => m.memberId === memberId);
    if (!member) return null;
    const dueData = await this.getMemberDue(memberId);
    return { ...member, totalPaid: dueData.paid, totalDue: dueData.due };
  }
}

// -----------------------------
// Backend: Firebase (Optional)
// -----------------------------
class BackendFirebase {
  constructor(db) {
    this.db = db;
    this.ref = dbRef => dbRef; // placeholder - we'll use functions directly from imported modules
  }

  // The instance will be created with required firebase helpers injected in initFirebase()
  static async create(firebaseModules, config) {
    const { initializeApp } = firebaseModules.app;
    const { getDatabase, ref, set, get, push } = firebaseModules.database;

    const appInstance = initializeApp(config);
    const db = getDatabase(appInstance);

    // Return an object exposing the same methods as BackendLocal
    return {
      async getMembers() {
        const snap = await get(ref(db, 'members'));
        return snap.exists() ? Object.values(snap.val()) : [];
      },

      async getCollections() {
        const snap = await get(ref(db, 'collections'));
        return snap.exists() ? Object.values(snap.val()) : [];
      },

      async getInvestments() {
        const snap = await get(ref(db, 'investments'));
        return snap.exists() ? Object.values(snap.val()) : [];
      },

      async getFunds() {
        const snap = await get(ref(db, 'funds'));
        return snap.exists() ? snap.val() : { englishFund: 0 };
      },

      async getNotifications() {
        const snap = await get(ref(db, 'notifications'));
        return snap.exists() ? Object.values(snap.val()) : [];
      },

      async login(memberId, mobile) {
        if (memberId === '100' && mobile === '01700000000') {
          return { memberId: '100', name: 'Admin User', role: 'Admin' };
        }
        const members = await this.getMembers();
        const user = members.find(m => m.memberId === memberId && m.mobile === mobile);
        if (user) return { status: 'success', ...user };
        throw new Error('Invalid Member ID or Mobile');
      },

      async getDashboardData() {
        const membersList = await this.getMembers();
        const members = membersList.filter(m => m.role !== 'Admin');
        const collectionsList = await this.getCollections();
        const collections = collectionsList.filter(c => c.status === 'Approved');
        const investments = await this.getInvestments();
        const funds = await this.getFunds();

        const totalDeposit = collections.reduce((s, c) => s + parseInt(c.amount || 0), 0);
        const totalInvested = investments.reduce((s, i) => s + parseInt(i.amount || 0), 0);
        const englishFund = parseInt(funds.englishFund || 0);
        const availableBalance = (totalDeposit + englishFund) - totalInvested;

        return { totalMembers: members.length, totalDeposit, totalInvested, englishFund, availableBalance };
      },

      async saveCollection(collectionData) {
        const members = await this.getMembers();
        const member = members.find(m => m.memberId === collectionData.memberId);
        if (!member && collectionData.memberId !== '100') throw new Error('Member ID not found');

        const newColRef = push(ref(db, 'collections'));
        const newCollection = {
          id: Date.now(),
          memberName: member ? member.name : 'Admin',
          date: new Date().toISOString().split('T')[0],
          status: collectionData.status || 'Approved',
          ...collectionData
        };
        await set(newColRef, newCollection);
        return { success: true, collection: newCollection };
      },

      async addMember(memberData) {
        const members = await this.getMembers();
        if (members.find(m => m.memberId === memberData.memberId)) throw new Error('Member ID already exists');
        await set(ref(db, `members/${memberData.memberId}`), memberData);
        return { success: true };
      },

      async saveInvestment(title, amount) {
        const newInvRef = push(ref(db, 'investments'));
        await set(newInvRef, { id: Date.now(), title, amount: parseInt(amount), date: new Date().toISOString().split('T')[0] });
        return { success: true };
      },

      async updateEnglishFund(amount) {
        await set(ref(db, 'funds/englishFund'), parseInt(amount));
        return { success: true };
      },

      async sendNotification(message) {
        const newNotifRef = push(ref(db, 'notifications'));
        await set(newNotifRef, { id: Date.now(), message, date: new Date().toLocaleString() });
        return { success: true };
      },

      async getMemberDue(memberId) {
        const members = await this.getMembers();
        const member = members.find(m => m.memberId === memberId);
        if (!member) return { paid: 0, due: 0 };
        const collections = (await this.getCollections()).filter(c => c.memberId === memberId && c.status === 'Approved');
        const totalPaid = collections.reduce((s, c) => s + parseInt(c.amount || 0), 0);

        const joinDate = new Date(member.joinDate);
        const now = new Date();
        const monthsJoined = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth()) + 1;
        const totalExpected = monthsJoined * (member.monthlyFee || 0);

        return { paid: totalPaid, due: Math.max(0, totalExpected - totalPaid) };
      },

      async getCollectionById(id) {
        const cols = await this.getCollections();
        return cols.find(c => c.id === parseInt(id));
      },

      async getMemberCollections(memberId) {
        return (await this.getCollections()).filter(c => c.memberId === memberId);
      },

      async getAllMembers() {
        return await this.getMembers();
      },

      async getMemberProfile(memberId) {
        const members = await this.getMembers();
        const member = members.find(m => m.memberId === memberId);
        if (!member) return null;
        const dueData = await this.getMemberDue(memberId);
        return { ...member, totalPaid: dueData.paid, totalDue: dueData.due };
      }
    };
  }
}

// -----------------------------
// App initialization (choose backend)
// -----------------------------
let backend = null;
let currentUser = null;

async function initBackend() {
  if (!USE_FIREBASE) {
    backend = new BackendLocal();
    return;
  }

  // dynamic import of firebase modules
  try {
    const appModuleUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`;
    const dbModuleUrl = `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-database.js`;

    const appModule = await import(appModuleUrl);
    const dbModule = await import(dbModuleUrl);

    // create BackendFirebase facade
    backend = await BackendFirebase.create({ app: appModule, database: dbModule }, firebaseConfig);
  } catch (err) {
    console.error("Failed to initialize Firebase:", err);
    // fallback to local
    backend = new BackendLocal();
  }
}

// -----------------------------
// UI: Helpers & Renderers
// -----------------------------
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const tab = document.getElementById(tabId);
  if (tab) tab.classList.add('active');
  const btn = document.querySelector(`[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active');
}

function formatCurrency(n = 0) {
  return Number(n).toLocaleString();
}

// LOGIN screen
function renderLogin() {
  if (userInfo) userInfo.style.display = 'none';
  app.innerHTML = `
    <div class="card" style="max-width:420px;margin:40px auto;border-top:5px solid var(--primary);">
      <div class="text-center">
        <h3>Member Portal</h3>
        <p style="color:#666;font-size:.9rem;">Taqwa Property BD Management</p>
      </div>
      <div class="form-group">
        <label>Member ID</label>
        <input id="mid" placeholder="Enter ID" type="text">
      </div>
      <div class="form-group">
        <label>Mobile Number</label>
        <input id="mob" placeholder="Enter mobile" type="tel">
      </div>
      <button id="loginBtn">Login</button>
      <div id="msg" class="error" style="display:none;color:red;margin-top:10px;"></div>
      <div style="margin-top:18px;font-size:.85rem;color:#888;">
        <p>Demo Admin: 100 / 01700000000</p>
        <p>Demo Member: 101 / 01711111111</p>
      </div>
    </div>
  `;

  document.getElementById('loginBtn').addEventListener('click', async () => {
    const midVal = document.getElementById("mid").value.trim();
    const mobVal = document.getElementById("mob").value.trim();
    const msgEl = document.getElementById("msg");
    msgEl.style.display = 'none';
    try {
      const user = await backend.login(midVal, mobVal);
      currentUser = user;
      if (userNameSpan) userNameSpan.innerText = user.name;
      if (userInfo) userInfo.style.display = 'flex';
      if (user.role === 'Admin') {
        await renderAdmin();
      } else {
        await renderMember(user.memberId);
      }
    } catch (err) {
      msgEl.innerText = err.message || 'Login failed';
      msgEl.style.display = 'block';
    }
  });
}

// LOGOUT
function logout() {
  currentUser = null;
  if (userInfo) userInfo.style.display = 'none';
  renderLogin();
}

// Admin view
async function renderAdmin() {
  const data = await backend.getDashboardData();
  app.innerHTML = `
    <div class="tabs-container">
      <button class="tab-btn active" data-tab="dashboard" onclick="switchTab('dashboard')">Dashboard</button>
      <button class="tab-btn" data-tab="collections" onclick="switchTab('collections')">Collections</button>
      <button class="tab-btn" data-tab="members" onclick="switchTab('members')">Members</button>
      <button class="tab-btn" data-tab="investments" onclick="switchTab('investments')">Investments</button>
      <button class="tab-btn" data-tab="notifications" onclick="switchTab('notifications')">Alerts</button>
    </div>

    <div id="dashboard" class="tab-content active">
      <div class="stats-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:12px;">
        <div class="card"><h4>Total Members</h4><p>${data.totalMembers}</p></div>
        <div class="card"><h4>Total Deposits</h4><p>Tk. ${formatCurrency(data.totalDeposit)}</p></div>
        <div class="card"><h4>Available Cash</h4><p>Tk. ${formatCurrency(data.availableBalance)}</p></div>
      </div>
      <div class="card">
        <h4>Quick Actions</h4>
        <button id="expMembers" class="btn-secondary">Export Members</button>
        <button id="expCols" class="btn-secondary">Export Collections</button>
      </div>
    </div>

    <div id="collections" class="tab-content">
      <div class="card">
        <h3>Add Collection</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <input id="cmid" placeholder="Member ID" oninput="lookupMemberName(this.value,'cmName')">
          <input id="month" value="${new Date().toLocaleString('default',{month:'long',year:'numeric'})}">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:8px;">
          <select id="depType"><option>Monthly Fee</option><option>English Fund</option><option>Investment</option><option>Others</option></select>
          <input id="amt" type="number" value="5000" placeholder="Amount">
        </div>
        <div style="margin-top:10px;">
          <select id="gateway" onchange="toggleBankField(this.value,'bankGroup')">
            <option>Bkash</option><option>Nagad</option><option>Rocket</option><option>Bank Transfer</option><option>Cash</option>
          </select>
          <div id="bankGroup" style="display:none;margin-top:8px;"><input id="bankName" placeholder="Bank name"></div>
        </div>
        <div style="margin-top:10px;">
          <input id="trxId" placeholder="Transaction ID">
          <input id="slipPhoto" type="file" accept="image/*">
        </div>
        <button id="saveColBtn" style="margin-top:10px;">Record Collection</button>
        <div id="amsg" class="success" style="display:none;margin-top:8px;"></div>
        <div id="aerr" class="error" style="display:none;margin-top:8px;"></div>
      </div>
    </div>

    <div id="members" class="tab-content">
      <div class="card">
        <h3>Register New Member</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <input id="newMid" placeholder="Member ID">
          <input id="newName" placeholder="Full name">
          <input id="newMob" placeholder="Mobile">
          <input id="newFee" type="number" value="5000" placeholder="Monthly Fee">
        </div>
        <button id="addMemberBtn" style="margin-top:10px;">Add Member</button>
      </div>

      <div class="card" style="margin-top:12px;">
        <h3>Member Directory</h3>
        <div id="memberList">Loading...</div>
      </div>
    </div>

    <div id="investments" class="tab-content">
      <div class="card">
        <h3>Manage Funds</h3>
        <input id="engFund" type="number" value="${data.englishFund}">
        <button id="updateFundBtn" style="margin-top:8px;">Update English Fund</button>
      </div>

      <div class="card" style="margin-top:12px;">
        <h3>Record Investment</h3>
        <input id="invTitle" placeholder="Investment Title">
        <input id="invAmt" type="number" placeholder="Amount">
        <button id="saveInvBtn" style="margin-top:8px;">Save Investment</button>
      </div>
    </div>

    <div id="notifications" class="tab-content">
      <div class="card">
        <h3>Send Notification</h3>
        <textarea id="notifMsg" rows="3" placeholder="Enter message..."></textarea>
        <button id="sendNotifBtn" style="margin-top:8px;">Broadcast Message</button>
      </div>
    </div>
  `;

  // Attach handlers
  document.getElementById('expMembers').addEventListener('click', exportMembers);
  document.getElementById('expCols').addEventListener('click', exportCollections);
  document.getElementById('saveColBtn').addEventListener('click', saveCollection);
  document.getElementById('addMemberBtn').addEventListener('click', addNewMember);
  document.getElementById('updateFundBtn').addEventListener('click', updateFund);
  document.getElementById('saveInvBtn').addEventListener('click', saveInvestment);
  document.getElementById('sendNotifBtn').addEventListener('click', sendNotification);

  loadMemberList();
}

// Member view
async function renderMember(memberId) {
  const m = await backend.getMemberProfile(memberId);
  const d = await backend.getMemberDue(memberId);
  const notifications = await backend.getNotifications();

  app.innerHTML = `
    <div class="tabs-container">
      <button class="tab-btn active" data-tab="overview" onclick="switchTab('overview')">Overview</button>
      <button class="tab-btn" data-tab="payments" onclick="switchTab('payments')">Payments</button>
      <button class="tab-btn" data-tab="deposit" onclick="switchTab('deposit')">Submit Deposit</button>
      <button class="tab-btn" data-tab="alerts" onclick="switchTab('alerts')">Notifications (${notifications.length})</button>
    </div>

    <div id="overview" class="tab-content active">
      <div class="card">
        <h3>My Profile</h3>
        <p><b>Name:</b> ${m.name}</p>
        <p><b>Member ID:</b> ${m.memberId}</p>
        <p><b>Mobile:</b> ${m.mobile}</p>
        <p><b>Monthly Fee:</b> Tk. ${formatCurrency(m.monthlyFee)}</p>
      </div>

      <div class="stats-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;">
        <div class="card"><h4>Total Paid</h4><p>Tk. ${formatCurrency(d.paid)}</p></div>
        <div class="card"><h4>Total Due</h4><p>Tk. ${formatCurrency(d.due)}</p></div>
      </div>
    </div>

    <div id="payments" class="tab-content">
      <div class="card">
        <h3>Payment History</h3>
        <div id="hist">Loading history...</div>
      </div>
    </div>

    <div id="deposit" class="tab-content">
      <div class="card">
        <h3>Submit Monthly Deposit</h3>
        <input id="depMonth" value="${new Date().toLocaleString('default',{month:'long',year:'numeric'})}">
        <input id="depAmt" type="number" value="${m.monthlyFee}">
        <select id="depGateway" onchange="toggleBankField(this.value,'depBankGroup')">
          <option>Bkash</option><option>Nagad</option><option>Rocket</option><option>Bank Transfer</option><option>Cash</option>
        </select>
        <div id="depBankGroup" style="display:none;margin-top:6px;"><input id="depBankName" placeholder="Bank name"></div>
        <input id="depTrxId" placeholder="TRX ID">
        <textarea id="depNote" rows="2" placeholder="Note (optional)"></textarea>
        <button id="submitDepBtn" style="margin-top:8px;">Submit for Approval</button>
        <div id="depMsg" style="display:none;margin-top:8px;"></div>
      </div>
    </div>

    <div id="alerts" class="tab-content">
      <div class="card">
        <h3>Notifications</h3>
        <div id="notifList">${notifications.length ? '' : '<p style="color:#888;">No notifications yet.</p>'}</div>
      </div>
    </div>
  `;

  document.getElementById('submitDepBtn').addEventListener('click', submitDeposit);
  await loadMemberHistory(memberId);
  await loadNotifications();
}

// -----------------------------
// Shared UI actions
// -----------------------------
async function addNewMember() {
  const mid = document.getElementById("newMid").value.trim();
  const name = document.getElementById("newName").value.trim();
  const mob = document.getElementById("newMob").value.trim();
  const fee = document.getElementById("newFee").value.trim();
  if (!mid || !name || !mob || !fee) { alert("All fields are required"); return; }
  try {
    await backend.addMember({ memberId: mid, name, mobile: mob, monthlyFee: parseInt(fee), role: 'Member', joinDate: new Date().toISOString().split('T')[0] });
    alert("Member added successfully!");
    await renderAdmin();
  } catch (err) {
    alert(err.message || 'Failed to add member');
  }
}

async function updateFund() {
  const amt = document.getElementById("engFund").value;
  await backend.updateEnglishFund(amt);
  alert("Fund updated!");
  await renderAdmin();
}

async function saveInvestment() {
  const title = document.getElementById("invTitle").value.trim();
  const amt = document.getElementById("invAmt").value.trim();
  if (!title || !amt) { alert("Title and amount required"); return; }
  await backend.saveInvestment(title, parseInt(amt));
  alert("Investment recorded!");
  await renderAdmin();
}

async function sendNotification() {
  const msg = document.getElementById("notifMsg").value.trim();
  if (!msg) return;
  await backend.sendNotification(msg);
  alert("Notification sent!");
  document.getElementById("notifMsg").value = "";
}

async function saveCollection() {
  const mid = document.getElementById("cmid").value.trim();
  const amt = document.getElementById("amt").value.trim();
  const month = document.getElementById("month").value.trim();
  const sMsg = document.getElementById("amsg");
  const eMsg = document.getElementById("aerr");
  sMsg.style.display = eMsg.style.display = 'none';

  if (!mid || !amt) {
    eMsg.innerText = "Member ID and Amount are required"; eMsg.style.display = 'block'; return;
  }

  try {
    const result = await backend.saveCollection({
      memberId: mid,
      amount: parseInt(amt),
      month,
      type: document.getElementById("depType").value,
      gateway: document.getElementById("gateway").value,
      bankName: document.getElementById("bankName")?.value || '',
      trxId: document.getElementById("trxId")?.value || ''
    });
    sMsg.innerText = `Successfully collected Tk. ${amt} from Member ${mid}`; sMsg.style.display = 'block';
    showReceipt(result.collection);
    document.getElementById("cmid").value = "";
  } catch (err) {
    eMsg.innerText = err.message || 'Failed'; eMsg.style.display = 'block';
  }
}

async function submitDeposit() {
  const month = document.getElementById("depMonth").value;
  const amt = document.getElementById("depAmt").value;
  const gateway = document.getElementById("depGateway").value;
  const bankName = document.getElementById("depBankName")?.value || '';
  const trxId = document.getElementById("depTrxId").value;
  const note = document.getElementById("depNote").value;
  const msg = document.getElementById("depMsg");
  msg.style.display = 'none';

  if (!amt) { msg.innerText = "Please enter amount"; msg.style.display = "block"; return; }
  try {
    if (!currentUser) throw new Error("User session not found. Please login again.");
    await backend.saveCollection({
      memberId: currentUser.memberId,
      amount: parseInt(amt),
      month,
      gateway,
      bankName,
      trxId,
      note,
      status: 'Pending',
      type: 'Monthly Fee'
    });
    msg.innerText = "Deposit submitted! Waiting for admin approval."; msg.style.display = "block";
    document.getElementById("depTrxId").value = "";
    document.getElementById("depNote").value = "";
  } catch (err) {
    msg.innerText = err.message || 'Failed'; msg.style.display = "block";
  }
}

function lookupMemberName(id, displayId) {
  const members = JSON.parse(localStorage.getItem('taqwa_members') || '[]');
  const member = members.find(m => m.memberId === id);
  const display = document.getElementById(displayId);
  if (!display) return;
  if (member) { display.innerText = `Member: ${member.name}`; display.style.color = 'var(--primary)'; }
  else { display.innerText = id ? 'Member not found' : ''; display.style.color = '#dc3545'; }
}

function toggleBankField(val, targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.style.display = val === 'Bank Transfer' ? 'block' : 'none';
}

// Receipts & export
function showReceipt(data) {
  const modal = document.createElement('div');
  modal.id = 'receipt-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="receipt-card" id="receipt-content" style="position:relative;padding:18px;background:#fff;border-radius:8px;max-width:420px;margin:40px auto;">
      <h3>Payment Receipt</h3>
      <div><strong>Receipt ID:</strong> #${String(data.id).slice(-6)}</div>
      <div><strong>Date:</strong> ${data.date}</div>
      <div><strong>Member:</strong> ${data.memberName || 'N/A'} (${data.memberId})</div>
      <div style="margin-top:10px;"><strong>Amount:</strong> Tk. ${formatCurrency(data.amount)}</div>
      <div style="margin-top:12px;"><strong>Status:</strong> ${data.status || 'Approved'}</div>
      <div style="margin-top:14px;">
        <button onclick="window.print()" class="btn-secondary">Print</button>
        <button onclick="sendWhatsApp('${data.memberId}', '${data.amount}', '${data.month}')" class="btn-whatsapp">Send</button>
        <button onclick="document.getElementById('receipt-modal').remove()" style="margin-left:8px;">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

async function viewReceipt(id) {
  const data = await backend.getCollectionById(id);
  if (data) showReceipt(data);
}

async function sendWhatsApp(memberId, amount, month) {
  const members = await backend.getAllMembers();
  const member = members.find(m => m.memberId === memberId);
  if (!member) return;
  const message = `*Taqwa Property BD - Payment Received*%0A%0AHello ${member.name},%0AWe have received your payment of *Tk. ${amount}* for *${month}*.%0A%0AThank you!`;
  window.open(`https://wa.me/${member.mobile.replace(/\+/g, '')}?text=${message}`, '_blank');
}

async function loadMemberList() {
  const members = await backend.getAllMembers();
  let html = `<table style="width:100%;border-collapse:collapse;"><thead><tr><th>ID</th><th>Name</th><th>Mobile</th><th>Fee</th><th>Role</th></tr></thead><tbody>`;
  members.forEach(m => {
    html += `<tr style="cursor:pointer" onclick="openMemberProfile('${m.memberId}')">
      <td><b>${m.memberId}</b></td><td>${m.name}</td><td>${m.mobile}</td><td>Tk. ${formatCurrency(m.monthlyFee)}</td><td>${m.role}</td>
    </tr>`;
  });
  html += `</tbody></table>`;
  const el = document.getElementById("memberList");
  if (el) el.innerHTML = html;
}

async function openMemberProfile(memberId) {
  const m = await backend.getMemberProfile(memberId);
  const collections = await backend.getMemberCollections(memberId);
  let histHtml = '<div class="history-list">';
  collections.slice().reverse().forEach(r => {
    histHtml += `<div class="history-item" style="display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid #eee;cursor:pointer" onclick="viewReceipt('${r.id}')">
      <div><strong>${r.month}</strong><div style="font-size:.85rem;color:#666">${r.date}</div></div>
      <div>Tk. ${formatCurrency(r.amount)}</div>
    </div>`;
  });
  histHtml += '</div>';

  const el = document.getElementById("memberList");
  if (!el) return;
  el.innerHTML = `
    <div class="card">
      <h3>Member Profile: ${m.name}</h3>
      <button onclick="loadMemberList()" style="float:right;background:#6c757d;color:#fff;padding:6px 10px;border-radius:4px;border:none;">Back</button>
      <div style="clear:both"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;">
        <div class="card"><h4>Total Paid</h4><p>Tk. ${formatCurrency(m.totalPaid)}</p></div>
        <div class="card"><h4>Current Due</h4><p>Tk. ${formatCurrency(m.totalDue)}</p></div>
      </div>
      <div style="margin-top:12px;"><h4>Payment History</h4>${histHtml}</div>
    </div>
  `;
}

async function loadMemberHistory(mid) {
  const rows = await backend.getMemberCollections(mid);
  const el = document.getElementById("hist");
  if (!el) return;
  if (!rows.length) {
    el.innerHTML = "<p style='color:#888;padding:10px;'>No payments found.</p>";
    return;
  }
  let html = '<div class="history-list">';
  rows.slice().reverse().forEach(r => {
    html += `<div class="history-item" style="display:flex;justify-content:space-between;padding:8px;border-bottom:1px solid #eee;cursor:pointer" onclick="viewReceipt('${r.id}')">
      <div><strong>${r.month}</strong><div style="font-size:.85rem;color:#666">${r.date}</div></div>
      <div>Tk. ${formatCurrency(r.amount)}</div>
    </div>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

async function loadNotifications() {
  const list = document.getElementById("notifList");
  if (!list) return;
  const notifications = await backend.getNotifications();
  if (!notifications.length) { list.innerHTML = '<p style="color:#888;">No notifications yet.</p>'; return; }
  let html = '<div class="notification-list">';
  notifications.slice().reverse().forEach(n => {
    html += `<div style="padding:8px;border-bottom:1px solid #eee;"><div>${n.message}</div><div style="font-size:.8rem;color:#666">${n.date}</div></div>`;
  });
  html += '</div>';
  list.innerHTML = html;
}

function exportToCSV(filename, rows) {
  const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(",")).join("\n");
  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function exportMembers() {
  const members = await backend.getAllMembers();
  const rows = [["ID", "Name", "Mobile", "Role", "Fee"], ...members.map(m => [m.memberId, m.name, m.mobile, m.role, m.monthlyFee])];
  exportToCSV("members.csv", rows);
}

async function exportCollections() {
  const collections = await backend.getCollections();
  const rows = [["ID", "Member", "Amount", "Month", "Date", "Status"], ...collections.map(c => [c.id, c.memberName, c.amount, c.month, c.date, c.status])];
  exportToCSV("collections.csv", rows);
}

// -----------------------------
// Boot: initialize backend & render login
// -----------------------------
(async function boot() {
  await initBackend();
  renderLogin();
  // expose functions used by inline handlers (so "onclick" style calls still work)
  window.switchTab = switchTab;
  window.logout = logout;
  window.viewReceipt = viewReceipt;
  window.openMemberProfile = openMemberProfile;
  window.lookupMemberName = lookupMemberName;
  window.toggleBankField = toggleBankField;
  window.sendWhatsApp = sendWhatsApp;
})();