/**
 * taqwa_property_app.js
 * Consolidated and cleaned Taqwa Property BD application logic.
 */

/* Firebase imports */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, push, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --- CONFIGURATION ---
const USE_FIREBASE = true; // set to false to force localStorage mock mode

const firebaseConfig = {
    apiKey: "AIzaSyDrLvyex6ui6dbKqsX697PplrmZvr-6Hag",
    authDomain: "taqwa-property-41353.firebaseapp.com",
    databaseURL: "https://taqwa-property-41353-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "taqwa-property-41353",
    storageBucket: "taqwa-property-41353.firebasestorage.app",
    messagingSenderId: "287655809647",
    appId: "1:287655809647:web:598c88721282d8ae9b739a",
    measurementId: "G-7WTLSZ99TV"
};

let db = null;
if (USE_FIREBASE) {
    try {
        const firebaseApp = initializeApp(firebaseConfig);
        db = getDatabase(firebaseApp);
    } catch (e) {
        console.warn("Firebase initialization failed, falling back to mock local backend.", e);
        db = null;
    }
}

// --- DOM ELEMENTS ---
const app = document.getElementById("app");
const userInfo = document.getElementById("userInfo");
const userNameSpan = document.getElementById("userName");

// --- BACKEND CLASS ---
class Backend {
    constructor(options = {}) {
        this.useFirebase = options.useFirebase;
        if (!this.useFirebase) {
            this.initMockData();
        }
    }

    // Initialize Mock Data (if Firebase is not used)
    initMockData() {
        if (!localStorage.getItem('taqwa_members')) {
            const initialMembers = [
                { memberId: '100', name: 'Admin User', mobile: '01700000000', role: 'Admin', monthlyFee: 0, joinDate: '2023-01-01' },
                { memberId: '101', name: 'Abdul Karim', mobile: '01711111111', role: 'Member', monthlyFee: 5000, joinDate: '2023-05-15' },
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
            const initialInvestments = [
                { id: 1, title: 'Land Purchase - Sector 5', amount: 50000, date: '2023-07-10' }
            ];
            localStorage.setItem('taqwa_investments', JSON.stringify(initialInvestments));
        }
        if (!localStorage.getItem('taqwa_funds')) {
            const initialFunds = { englishFund: 25000 };
            localStorage.setItem('taqwa_funds', JSON.stringify(initialFunds));
        }
        if (!localStorage.getItem('taqwa_notifications')) {
            localStorage.setItem('taqwa_notifications', JSON.stringify([]));
        }
    }

    // ---------- Helpers ----------
    delay(ms = 250) { return new Promise(res => setTimeout(res, ms)); }
    _getLocal(key, fallback = '[]') { return JSON.parse(localStorage.getItem(key) || fallback); }
    _setLocal(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

    // ---------- Firebase wrappers ----------
    async _fb_get(path) {
        if (!db) return null;
        const snapshot = await get(ref(db, path));
        return (snapshot && snapshot.exists()) ? snapshot.val() : null;
    }

    async _fb_push(path, obj) {
        const newRef = push(ref(db, path));
        await set(newRef, obj);
        return obj;
    }

    async _fb_set(path, obj) {
        await set(ref(db, path), obj);
        return obj;
    }

    // ---------- Public API ----------
    async getMembers() {
        if (this.useFirebase) {
            const v = await this._fb_get('members');
            return v ? Object.values(v) : [];
        } else {
            return this._getLocal('taqwa_members', '[]');
        }
    }

    async getCollections() {
        if (this.useFirebase) {
            const v = await this._fb_get('collections');
            return v ? Object.values(v) : [];
        } else {
            return this._getLocal('taqwa_collections', '[]');
        }
    }

    async getInvestments() {
        if (this.useFirebase) {
            const v = await this._fb_get('investments');
            return v ? Object.values(v) : [];
        } else {
            return this._getLocal('taqwa_investments', '[]');
        }
    }

    async getFunds() {
        if (this.useFirebase) {
            const v = await this._fb_get('funds');
            return v || { englishFund: 0 };
        } else {
            return this._getLocal('taqwa_funds', '{"englishFund":0}');
        }
    }

    async getNotifications() {
        if (this.useFirebase) {
            const v = await this._fb_get('notifications');
            return v ? Object.values(v) : [];
        } else {
            return this._getLocal('taqwa_notifications', '[]');
        }
    }

    async login(memberId, mobile) {
        if (memberId === '100' && mobile === '01700000000') {
            return { memberId: '100', name: 'Admin User', role: 'Admin' };
        }

        if (this.useFirebase) {
            const members = await this.getMembers();
            const user = members.find(m => m.memberId === memberId && m.mobile === mobile);
            if (user) return { status: 'success', ...user };
            throw new Error('Invalid Member ID or Mobile');
        } else {
            await this.delay();
            const members = this.getMembers();
            const user = members.find(m => m.memberId === memberId && m.mobile === mobile);
            if (user) return { status: 'success', ...user };
            throw new Error('Invalid Member ID or Mobile');
        }
    }

    async getDashboardData() {
        if (this.useFirebase) {
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
        } else {
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
    }

    async saveCollection(collectionData) {
        if (this.useFirebase) {
            const members = await this.getMembers();
            const member = members.find(m => m.memberId === collectionData.memberId);
            if (!member && collectionData.memberId !== '100') throw new Error('Member ID not found');

            const newCollection = {
                id: Date.now(),
                memberName: member ? member.name : "Admin",
                date: new Date().toISOString().split('T')[0],
                status: collectionData.status || 'Approved',
                ...collectionData
            };
            await this._fb_push('collections', newCollection);
            return { success: true, collection: newCollection };
        } else {
            await this.delay();
            const members = this.getMembers();
            const member = members.find(m => m.memberId === collectionData.memberId);
            if (!member && collectionData.memberId !== '100') throw new Error('Member ID not found');

            const collections = this.getCollections();
            const newCollection = {
                id: Date.now(),
                memberName: member ? member.name : "Admin",
                date: new Date().toISOString().split('T')[0],
                status: collectionData.status || 'Approved',
                ...collectionData
            };
            collections.push(newCollection);
            this._setLocal('taqwa_collections', collections);
            return { success: true, collection: newCollection };
        }
    }

    async addMember(memberData) {
        if (this.useFirebase) {
            const members = await this.getMembers();
            if (members.find(m => m.memberId === memberData.memberId)) throw new Error('Member ID already exists');
            await this._fb_set(`members/${memberData.memberId}`, memberData);
            return { success: true };
        } else {
            await this.delay();
            const members = this.getMembers();
            if (members.find(m => m.memberId === memberData.memberId)) throw new Error('Member ID already exists');
            members.push(memberData);
            this._setLocal('taqwa_members', members);
            return { success: true };
        }
    }

    async saveInvestment(title, amount) {
        if (this.useFirebase) {
            const inv = { id: Date.now(), title, amount: parseInt(amount), date: new Date().toISOString().split('T')[0] };
            await this._fb_push('investments', inv);
            return { success: true };
        } else {
            await this.delay();
            const investments = this.getInvestments();
            const newInv = { id: Date.now(), title, amount: parseInt(amount), date: new Date().toISOString().split('T')[0] };
            investments.push(newInv);
            this._setLocal('taqwa_investments', investments);
            return { success: true };
        }
    }

    async updateEnglishFund(amount) {
        if (this.useFirebase) {
            await this._fb_set('funds/englishFund', parseInt(amount));
            return { success: true };
        } else {
            await this.delay();
            const funds = this.getFunds();
            funds.englishFund = parseInt(amount);
            this._setLocal('taqwa_funds', funds);
            return { success: true };
        }
    }

    async sendNotification(message) {
        const notif = { id: Date.now(), message, date: new Date().toLocaleString() };
        if (this.useFirebase) {
            await this._fb_push('notifications', notif);
            return { success: true };
        } else {
            await this.delay();
            const notifications = this.getNotifications();
            notifications.push(notif);
            this._setLocal('taqwa_notifications', notifications);
            return { success: true };
        }
    }

    async getMemberDue(memberId) {
        if (this.useFirebase) {
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
        } else {
            await this.delay();
            const members = this.getMembers();
            const member = members.find(m => m.memberId === memberId);
            if (!member) return { paid: 0, due: 0 };
            const collections = this.getCollections().filter(c => c.memberId === memberId && c.status === 'Approved');
            const totalPaid = collections.reduce((s, c) => s + parseInt(c.amount || 0), 0);
            const joinDate = new Date(member.joinDate);
            const now = new Date();
            const monthsJoined = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth()) + 1;
            const totalExpected = monthsJoined * (member.monthlyFee || 0);
            return { paid: totalPaid, due: Math.max(0, totalExpected - totalPaid) };
        }
    }

    async getCollectionById(id) {
        if (this.useFirebase) {
            const cols = await this.getCollections();
            return cols.find(c => c.id === parseInt(id));
        } else {
            await this.delay();
            const cols = this.getCollections();
            return cols.find(c => c.id === parseInt(id));
        }
    }

    async getMemberCollections(memberId) {
        if (this.useFirebase) {
            const cols = await this.getCollections();
            return cols.filter(c => c.memberId === memberId);
        } else {
            await this.delay();
            return this.getCollections().filter(c => c.memberId === memberId);
        }
    }

    async getAllMembers() {
        return this.getMembers();
    }

    async getMemberProfile(memberId) {
        if (this.useFirebase) {
            const member = (await this.getMembers()).find(m => m.memberId === memberId);
            if (!member) return null;
            const due = await this.getMemberDue(memberId);
            return { ...member, totalPaid: due.paid, totalDue: due.due };
        } else {
            await this.delay();
            const member = this.getMembers().find(m => m.memberId === memberId);
            if (!member) return null;
            const due = await this.getMemberDue(memberId);
            return { ...member, totalPaid: due.paid, totalDue: due.due };
        }
    }
}

// Instantiate backend
const backend = new Backend({ useFirebase: USE_FIREBASE && !!db });

// ---------------------- FRONTEND LOGIC ----------------------

// State
let currentUser = null;
let activeTab = 'dashboard';

// Tab switcher
window.switchTab = function (tabId) {
    activeTab = tabId;
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const el = document.getElementById(tabId);
    if (el) el.classList.add('active');
    const activeBtn = document.querySelector(`[onclick="switchTab('${tabId}')"]`);
    if (activeBtn) activeBtn.classList.add('active');
};

// Login / Logout
window.login = async function () {
    const midVal = document.getElementById("mid").value.trim();
    const mobVal = document.getElementById("mob").value.trim();
    const msgEl = document.getElementById("msg");

    try {
        const user = await backend.login(midVal, mobVal);
        currentUser = user;
        if (userNameSpan) userNameSpan.innerText = user.name;
        if (userInfo) userInfo.style.display = 'flex';

        if (user.role === "Admin") {
            await renderAdmin();
        } else {
            await renderMember(user.memberId);
        }
    } catch (err) {
        if (msgEl) {
            msgEl.innerText = err.message || String(err);
            msgEl.style.display = "block";
        } else {
            alert(err.message || String(err));
        }
    }
};

window.logout = function () {
    currentUser = null;
    if (userInfo) userInfo.style.display = 'none';
    renderLogin();
};

// ---------- Render login ----------
function renderLogin() {
    if (userInfo) userInfo.style.display = 'none';
    if (!app) return;
    app.innerHTML = `
    <div class="card" style="max-width: 400px; margin: 40px auto; border-top: 5px solid var(--primary);">
        <div class="text-center">
             <div style="background: #e8f5e9; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                <i class="fa-solid fa-shield-halved fa-2x" style="color: var(--primary);"></i>
             </div>
             <h3 style="margin-bottom: 10px;">Member Portal</h3>
             <p style="color: #666; font-size: 0.85rem; margin-bottom: 25px;">
                Taqwa Property BD Management System
             </p>
        </div>
        <div class="form-group">
            <label><i class="fa-solid fa-id-card"></i> Member ID</label>
            <input id="mid" placeholder="Enter your ID" type="text">
        </div>
        <div class="form-group">
            <label><i class="fa-solid fa-phone"></i> Mobile Number</label>
            <input id="mob" placeholder="Enter mobile number" type="tel">
        </div>
        <button onclick="login()"><i class="fa-solid fa-right-to-bracket"></i> Login Securely</button>
        <div id="msg" class="error" style="display:none;"></div>

        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8rem; color: #888;" class="text-center">
            <p>Demo Admin: 100 / 01700000000</p>
            <p>Demo Member: 101 / 01711111111</p>
        </div>
    </div>`;
}

// ---------- Admin / Member renderers ----------
async function renderAdmin() {
    const data = await backend.getDashboardData();

    app.innerHTML = `
    <div class="tabs-container">
        <button class="tab-btn active" onclick="switchTab('dashboard')"><i class="fa-solid fa-chart-line"></i> Dashboard</button>
        <button class="tab-btn" onclick="switchTab('collections')"><i class="fa-solid fa-money-bill-transfer"></i> Collections</button>
        <button class="tab-btn" onclick="switchTab('members')"><i class="fa-solid fa-users"></i> Members</button>
        <button class="tab-btn" onclick="switchTab('investments')"><i class="fa-solid fa-hand-holding-dollar"></i> Investments</button>
        <button class="tab-btn" onclick="switchTab('notifications')"><i class="fa-solid fa-bell"></i> Alerts</button>
    </div>

    <!-- Dashboard Tab -->
    <div id="dashboard" class="tab-content active">
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">${data.totalMembers}</div>
                <div class="stat-label">Total Members</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">Tk. ${Number(data.totalDeposit || 0).toLocaleString()}</div>
                <div class="stat-label">Total Deposits</div>
            </div>
            <div class="stat-item invested">
                <div class="stat-value">Tk. ${Number(data.totalInvested || 0).toLocaleString()}</div>
                <div class="stat-label">Total Invested</div>
            </div>
            <div class="stat-item fund">
                <div class="stat-value">Tk. ${Number(data.englishFund || 0).toLocaleString()}</div>
                <div class="stat-label">English Fund</div>
            </div>
            <div class="stat-item balance">
                <div class="stat-value">Tk. ${Number(data.availableBalance || 0).toLocaleString()}</div>
                <div class="stat-label">Available Cash</div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-gears"></i> Quick Actions</h3>
            </div>
            <div class="receipt-actions">
                <button onclick="exportMembers()" class="btn-secondary"><i class="fa-solid fa-file-csv"></i> Export Members</button>
                <button onclick="exportCollections()" class="btn-secondary"><i class="fa-solid fa-file-export"></i> Export Collections</button>
            </div>
        </div>
    </div>

    <!-- Collections Tab -->
    <div id="collections" class="tab-content">
        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-plus-circle"></i> Add Collection</h3>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Member ID</label>
                    <input id="cmid" placeholder="e.g. 101" oninput="lookupMemberName(this.value, 'cmName')">
                    <div id="cmName" style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-top: 5px;"></div>
                </div>
                <div class="form-group">
                    <label>Month</label>
                    <input id="month" value="${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Deposit Type</label>
                    <select id="depType">
                        <option value="Monthly Fee">Monthly Fee</option>
                        <option value="English Fund">English Fund</option>
                        <option value="Investment">Investment</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Amount (Tk)</label>
                    <input id="amt" type="number" value="5000">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Payment Gateway</label>
                    <select id="gateway" onchange="toggleBankField(this.value, 'bankGroup')">
                        <option value="Bkash">Bkash</option>
                        <option value="Nagad">Nagad</option>
                        <option value="Rocket">Rocket</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash">Cash</option>
                    </select>
                </div>
                <div class="form-group" id="bankGroup" style="display: none;">
                    <label>Bank Name</label>
                    <input id="bankName" placeholder="Enter bank name">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Transaction ID</label>
                    <input id="trxId" placeholder="Enter TRX ID">
                </div>
                <div class="form-group">
                    <label>Deposit Slip (Photo)</label>
                    <input id="slipPhoto" type="file" accept="image/*">
                </div>
            </div>
            <button onclick="saveCollection()"><i class="fa-solid fa-check-double"></i> Record Collection</button>
            <div id="amsg" class="success"></div>
            <div id="aerr" class="error"></div>
        </div>
    </div>

    <!-- Members Tab -->
    <div id="members" class="tab-content">
        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-user-plus"></i> Register New Member</h3>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Member ID</label>
                    <input id="newMid" placeholder="e.g. 103">
                </div>
                <div class="form-group">
                    <label>Full Name</label>
                    <input id="newName" placeholder="Enter name">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Mobile Number</label>
                    <input id="newMob" placeholder="017...">
                </div>
                <div class="form-group">
                    <label>Monthly Fee (Tk)</label>
                    <input id="newFee" type="number" value="5000">
                </div>
            </div>
            <button onclick="addNewMember()"><i class="fa-solid fa-user-check"></i> Add Member</button>
        </div>

        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-users"></i> Member Directory</h3>
            </div>
            <div class="table-container" id="memberList">Loading...</div>
        </div>
    </div>

    <!-- Investments Tab -->
    <div id="investments" class="tab-content">
        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-landmark"></i> Manage Funds</h3>
            </div>
            <div class="form-group">
                <label>English Fund Amount (Tk)</label>
                <input id="engFund" type="number" value="${Number(data.englishFund || 0)}">
            </div>
            <button onclick="updateFund()"><i class="fa-solid fa-save"></i> Update English Fund</button>
        </div>

        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-money-bill-trend-up"></i> Record Investment</h3>
            </div>
            <div class="form-group">
                <label>Investment Title</label>
                <input id="invTitle" placeholder="e.g. Land Purchase - Sector 10">
            </div>
            <div class="form-group">
                <label>Amount (Tk)</label>
                <input id="invAmt" type="number">
            </div>
            <button onclick="saveInvestment()"><i class="fa-solid fa-file-invoice-dollar"></i> Save Investment</button>
        </div>
    </div>

    <!-- Notifications Tab -->
    <div id="notifications" class="tab-content">
        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-bullhorn"></i> Send Notification</h3>
            </div>
            <div class="form-group">
                <label>Message to all members</label>
                <textarea id="notifMsg" rows="3" placeholder="Enter message here..."></textarea>
            </div>
            <button onclick="sendNotification()"><i class="fa-solid fa-paper-plane"></i> Broadcast Message</button>
        </div>
    </div>
    `;
    loadMemberList();
}

// ---------- Admin actions ----------
async function addNewMember() {
    const mid = document.getElementById("newMid").value.trim();
    const name = document.getElementById("newName").value.trim();
    const mob = document.getElementById("newMob").value.trim();
    const fee = document.getElementById("newFee").value.trim();

    if (!mid || !name || !mob || !fee) {
        alert("All fields are required");
        return;
    }

    try {
        await backend.addMember({
            memberId: mid,
            name,
            mobile: mob,
            monthlyFee: parseInt(fee),
            role: 'Member',
            joinDate: new Date().toISOString().split('T')[0]
        });
        alert("Member added successfully!");
        renderAdmin();
    } catch (err) {
        alert(err.message || String(err));
    }
}

async function updateFund() {
    const amt = document.getElementById("engFund").value;
    await backend.updateEnglishFund(amt);
    alert("Fund updated!");
    renderAdmin();
}

async function saveInvestment() {
    const title = document.getElementById("invTitle").value.trim();
    const amt = document.getElementById("invAmt").value.trim();
    if (!title || !amt) return;
    await backend.saveInvestment(title, parseInt(amt));
    alert("Investment recorded!");
    renderAdmin();
}

async function sendNotification() {
    const msg = document.getElementById("notifMsg").value.trim();
    if (!msg) return;
    await backend.sendNotification(msg);
    alert("Notification sent!");
    document.getElementById("notifMsg").value = "";
}

async function saveCollection() {
    const mid = (document.getElementById("cmid") || {}).value?.trim();
    const amt = (document.getElementById("amt") || {}).value?.trim();
    const month = (document.getElementById("month") || {}).value?.trim();
    const sMsg = document.getElementById("amsg");
    const eMsg = document.getElementById("aerr");

    if (sMsg) { sMsg.style.display = 'none'; }
    if (eMsg) { eMsg.style.display = 'none'; }

    if (!mid || !amt) {
        if (eMsg) { eMsg.innerText = "Member ID and Amount are required"; eMsg.style.display = 'block'; }
        return;
    }

    try {
        const result = await backend.saveCollection({
            memberId: mid,
            amount: parseInt(amt),
            month: month,
            type: document.getElementById("depType")?.value,
            gateway: document.getElementById("gateway")?.value,
            bankName: document.getElementById("bankName")?.value,
            trxId: document.getElementById("trxId")?.value,
            status: 'Approved'
        });
        if (sMsg) { sMsg.innerText = `Successfully collected Tk. ${amt} from Member ${mid}`; sMsg.style.display = 'block'; }
        if (result && result.collection) showReceipt(result.collection);
        if (document.getElementById("cmid")) document.getElementById("cmid").value = "";
    } catch (err) {
        if (eMsg) { eMsg.innerText = err.message || String(err); eMsg.style.display = 'block'; }
    }
}

// ---------- Member views ----------
async function renderMember(memberId) {
    const m = await backend.getMemberProfile(memberId);
    const d = await backend.getMemberDue(memberId);
    const notifications = await backend.getNotifications();

    app.innerHTML = `
    <div class="tabs-container">
        <button class="tab-btn active" onclick="switchTab('overview')"><i class="fa-solid fa-house-user"></i> Overview</button>
        <button class="tab-btn" onclick="switchTab('payments')"><i class="fa-solid fa-history"></i> Payments</button>
        <button class="tab-btn" onclick="switchTab('deposit')"><i class="fa-solid fa-hand-holding-medical"></i> Submit Deposit</button>
        <button class="tab-btn" onclick="switchTab('alerts')"><i class="fa-solid fa-bell"></i> Notifications (${notifications.length})</button>
    </div>

    <!-- Overview Tab -->
    <div id="overview" class="tab-content active">
        <div class="card" style="border-left: 5px solid var(--primary);">
            <div class="card-header">
                <h3><i class="fa-solid fa-user-circle"></i> My Profile</h3>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <p><b>Name:</b> ${m?.name || ''}</p>
                    <p><b>Member ID:</b> ${m?.memberId || ''}</p>
                    <p><b>Mobile:</b> ${m?.mobile || ''}</p>
                </div>
                <div>
                    <p><b>Join Date:</b> ${m?.joinDate || ''}</p>
                    <p><b>Monthly Fee:</b> Tk. ${m?.monthlyFee || 0}</p>
                    <p><b>Status:</b> <span class="badge badge-approved">Active</span></p>
                </div>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">Tk. ${Number(d.paid || 0).toLocaleString()}</div>
                <div class="stat-label">Total Paid</div>
            </div>
            <div class="stat-item" style="border-top-color: ${d.due > 0 ? '#dc3545' : '#198754'}">
                <div class="stat-value" style="color: ${d.due > 0 ? '#dc3545' : '#198754'}">Tk. ${Number(d.due || 0).toLocaleString()}</div>
                <div class="stat-label">Total Due</div>
            </div>
        </div>
    </div>

    <!-- Payments Tab -->
    <div id="payments" class="tab-content">
        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-receipt"></i> Payment History</h3>
            </div>
            <p style="font-size: 0.8rem; color: #666; margin-bottom: 15px;"><i class="fa-solid fa-info-circle"></i> Click any record to view/print receipt</p>
            <div id="hist">Loading history...</div>
        </div>
    </div>

    <!-- Deposit Tab -->
    <div id="deposit" class="tab-content">
        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-paper-plane"></i> Submit Monthly Deposit</h3>
            </div>
            <p style="font-size: 0.85rem; color: #666; margin-bottom: 20px;">Submit your monthly fee for admin approval.</p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Month</label>
                    <input id="depMonth" value="${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}">
                </div>
                <div class="form-group">
                    <label>Amount (Tk)</label>
                    <input id="depAmt" type="number" value="${m?.monthlyFee || 0}">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Payment Gateway</label>
                    <select id="depGateway" onchange="toggleBankField(this.value, 'depBankGroup')">
                        <option value="Bkash">Bkash</option>
                        <option value="Nagad">Nagad</option>
                        <option value="Rocket">Rocket</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash">Cash</option>
                    </select>
                </div>
                <div class="form-group" id="depBankGroup" style="display: none;">
                    <label>Bank Name</label>
                    <input id="depBankName" placeholder="Enter bank name">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Transaction ID</label>
                    <input id="depTrxId" placeholder="Enter TRX ID">
                </div>
                <div class="form-group">
                    <label>Deposit Slip (Photo)</label>
                    <input id="depSlipPhoto" type="file" accept="image/*">
                </div>
            </div>

            <div class="form-group">
                <label>Note (Optional)</label>
                <textarea id="depNote" rows="2" placeholder="Add any additional info..."></textarea>
            </div>

            <button onclick="submitDeposit()"><i class="fa-solid fa-cloud-upload"></i> Submit for Approval</button>
            <div id="depMsg" class="success"></div>
        </div>
    </div>

    <!-- Alerts Tab -->
    <div id="alerts" class="tab-content">
        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-bell"></i> Association Alerts</h3>
            </div>
            <div id="notifList">
                ${notifications.length ? '' : '<p class="text-center" style="color:#888; padding:20px;">No notifications yet.</p>'}
            </div>
        </div>
    </div>
    `;
    loadMemberHistory(memberId);
    loadNotifications();
}

async function submitDeposit() {
    const month = document.getElementById("depMonth").value;
    const amt = document.getElementById("depAmt").value;
    const gateway = document.getElementById("depGateway").value;
    const bankName = document.getElementById("depBankName").value;
    const trxId = document.getElementById("depTrxId").value;
    const note = document.getElementById("depNote").value;
    const msg = document.getElementById("depMsg");

    if (msg) { msg.style.display = 'none'; msg.className = 'success'; }

    if (!amt) {
        if (msg) { msg.innerText = "Please enter amount"; msg.className = "error"; msg.style.display = "block"; }
        return;
    }

    try {
        if (!currentUser) throw new Error("User session not found. Please login again.");

        await backend.saveCollection({
            memberId: currentUser.memberId,
            amount: parseInt(amt),
            month: month,
            gateway: gateway,
            bankName: bankName,
            trxId: trxId,
            note: note,
            status: 'Pending',
            type: 'Monthly Fee'
        });
        if (msg) { msg.innerText = "Deposit submitted! Waiting for admin approval."; msg.style.display = "block"; msg.className = "success"; }

        // Clear fields
        if (document.getElementById("depTrxId")) document.getElementById("depTrxId").value = "";
        if (document.getElementById("depNote")) document.getElementById("depNote").value = "";
    } catch (err) {
        if (msg) { msg.innerText = err.message || String(err); msg.className = "error"; msg.style.display = "block"; }
    }
}

// ---------- Shared helpers ----------
function lookupMemberName(id, displayId) {
    const members = backend.getAllMembers ? (backend.getAllMembers() instanceof Promise ? null : backend.getAllMembers()) : null;
    // fallback to localStorage immediate read if synchronous is needed:
    let member = null;
    try {
        const ls = JSON.parse(localStorage.getItem('taqwa_members') || '[]');
        member = ls.find(m => m.memberId === id);
    } catch { member = null; }
    const display = document.getElementById(displayId);
    if (!display) return;
    if (member) {
        display.innerText = `Member: ${member.name}`;
        display.style.color = 'var(--primary)';
    } else {
        display.innerText = id ? 'Member not found' : '';
        display.style.color = '#dc3545';
    }
}

function toggleBankField(val, targetId) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.style.display = (val === 'Bank Transfer') ? 'block' : 'none';
}

async function loadNotifications() {
    const list = document.getElementById("notifList");
    if (!list) return;
    const notifications = await backend.getNotifications();
    let html = '<div class="notification-list">';
    notifications.reverse().forEach(n => {
        html += `
        <div class="notification-item">
            <div class="notification-msg">${n.message}</div>
            <div class="notification-time"><i class="fa-regular fa-clock"></i> ${n.date}</div>
        </div>`;
    });
    list.innerHTML = html + '</div>';
}

function showReceipt(data) {
    const modal = document.createElement('div');
    modal.id = 'receipt-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="receipt-card" id="receipt-content">
            <div class="receipt-header">
                <div class="logo" style="justify-content: center; color: var(--primary); margin-bottom: 5px;">
                    <i class="fa-solid fa-building-user"></i> Taqwa Property BD
                </div>
                <h3 style="border:none; margin:0; padding:0; font-size: 1.2rem;">Payment Receipt</h3>
                <p style="font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 1px;">Official Record</p>
            </div>
            <div class="receipt-body">
                <div class="receipt-row"><span>Receipt ID:</span><b>#${String(data.id || '').slice(-6)}</b></div>
                <div class="receipt-row"><span>Date:</span><b>${data.date}</b></div>
                <hr style="border:none; border-top: 1px dashed #eee; margin: 15px 0;">
                <div class="receipt-row"><span>Member Name:</span><b>${data.memberName || 'N/A'}</b></div>
                <div class="receipt-row"><span>Member ID:</span><b>${data.memberId}</b></div>
                <div class="receipt-row"><span>Payment For:</span><b>${data.month}</b></div>
                <div class="receipt-row" style="margin-top: 20px; font-size: 1.3rem; color: var(--primary);">
                    <span>Amount Paid:</span>
                    <b>Tk. ${Number(data.amount || 0).toLocaleString()}</b>
                </div>
                <div class="receipt-row" style="margin-top: 5px;">
                    <span>Status:</span>
                    <b style="color: ${data.status === 'Approved' ? 'var(--primary)' : '#f39c12'}">${data.status || 'Approved'}</b>
                </div>
            </div>
            <div class="receipt-footer">
                <p>Thank you for your contribution!</p>
                <p style="font-size: 0.7rem;">This is a computer generated receipt.</p>
            </div>
            <div class="receipt-actions">
                <button onclick="window.print()" class="btn-secondary"><i class="fa-solid fa-print"></i> Print</button>
                <button onclick="sendWhatsApp('${data.memberId}', '${data.amount}', '${data.month}')" class="btn-whatsapp"><i class="fa-brands fa-whatsapp"></i> Send</button>
            </div>
            <button onclick="document.getElementById('receipt-modal').remove()" style="background:none; color:#999; position:absolute; top:15px; right:15px; width:auto; margin:0; padding:5px;">
                <i class="fa-solid fa-times fa-lg"></i>
            </button>
        </div>`;
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
    let html = `<table><thead><tr><th>ID</th><th>Name</th><th>Mobile</th><th>Fee</th><th>Role</th></tr></thead><tbody>`;
    members.forEach(m => {
        html += `
        <tr style="cursor:pointer" onclick="openMemberProfile('${m.memberId}')">
            <td><b>${m.memberId}</b></td>
            <td>${m.name}</td>
            <td>${m.mobile}</td>
            <td>Tk. ${m.monthlyFee}</td>
            <td><span class="badge badge-${(m.role || '').toLowerCase()}">${m.role}</span></td>
        </tr>`;
    });
    const container = document.getElementById("memberList");
    if (container) container.innerHTML = html + `</tbody></table>`;
}

async function openMemberProfile(memberId) {
    const m = await backend.getMemberProfile(memberId);
    const collections = await backend.getMemberCollections(memberId);

    let histHtml = '<div class="history-list">';
    collections.slice().reverse().forEach(r => {
        histHtml += `
        <div class="history-item" onclick="viewReceipt('${r.id}')">
            <div class="history-info">
                <h5>${r.month}</h5>
                <div class="history-date">${r.date}</div>
            </div>
            <div class="history-amount">Tk. ${Number(r.amount || 0).toLocaleString()}</div>
        </div>`;
    });
    histHtml += '</div>';

    const memberListEl = document.getElementById("memberList");
    if (!memberListEl) return;

    memberListEl.innerHTML = `
    <div class="card" style="border-left: 5px solid var(--primary);">
        <div class="card-header">
            <h3>Member Profile: ${m.name}</h3>
            <button onclick="loadMemberList()" style="width:auto; padding: 5px 15px; background:#6c757d;">Back</button>
        </div>
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">Tk. ${Number(m.totalPaid || 0).toLocaleString()}</div>
                <div class="stat-label">Total Paid</div>
            </div>
            <div class="stat-item" style="border-top-color: ${m.totalDue > 0 ? '#dc3545' : '#198754'}">
                <div class="stat-value" style="color: ${m.totalDue > 0 ? '#dc3545' : '#198754'}">Tk. ${Number(m.totalDue || 0).toLocaleString()}</div>
                <div class="stat-label">Current Due</div>
            </div>
        </div>
        <div style="margin-top: 20px;">
            <h4>Payment History</h4>
            ${histHtml}
        </div>
    </div>`;
}

async function loadMemberHistory(mid) {
    const rows = await backend.getMemberCollections(mid);
    const histEl = document.getElementById("hist");
    if (!histEl) return;
    if (!rows || !rows.length) {
        histEl.innerHTML = "<p class='text-center' style='color:#888; padding:20px;'>No payments found.</p>";
        return;
    }
    let html = '<div class="history-list">';
    rows.slice().reverse().forEach(r => {
        html += `
        <div class="history-item" onclick="viewReceipt('${r.id}')">
            <div class="history-info">
                <h5>${r.month}</h5>
                <div class="history-date">${r.date}</div>
            </div>
            <div class="history-amount">Tk. ${Number(r.amount || 0).toLocaleString()}</div>
        </div>`;
    });
    histEl.innerHTML = html + '</div>';
}

// Export helpers
function exportToCSV(filename, rows) {
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.map(x => `"${String(x).replace(/"/g,'""')}"`).join(",")).join("\n");
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

// --- GLOBAL SCOPE ATTACHMENT (FIX FOR ERROR) ---
window.addNewMember = addNewMember;
window.updateFund = updateFund;
window.saveInvestment = saveInvestment;
window.sendNotification = sendNotification;
window.saveCollection = saveCollection;
window.lookupMemberName = lookupMemberName;
window.toggleBankField = toggleBankField;
window.viewReceipt = viewReceipt;
window.sendWhatsApp = sendWhatsApp;
window.openMemberProfile = openMemberProfile;
window.submitDeposit = submitDeposit;
window.exportMembers = exportMembers;
window.exportCollections = exportCollections;

// Initialize App
renderLogin();
