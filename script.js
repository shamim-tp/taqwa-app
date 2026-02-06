/**
 * Taqwa Property BD - Application Logic
 * Enhanced with Loan Management, Meeting System, Advanced Reporting
 */

const app = document.getElementById("app");
const userInfo = document.getElementById("userInfo");
const userNameSpan = document.getElementById("userName");

// --- MOCK DATABASE & BACKEND ---
class Backend {
    constructor() {
        this.initData();
    }

    initData() {
        if (!localStorage.getItem('taqwa_members')) {
            const initialMembers = [
                { 
                    memberId: '100', 
                    name: 'Admin User', 
                    mobile: '01700000000', 
                    password: '123', 
                    role: 'Admin', 
                    monthlyFee: 0, 
                    joinDate: '2023-01-01' 
                },
                { 
                    memberId: '101', 
                    name: 'Abdul Karim', 
                    mobile: '01711111111', 
                    password: '123', 
                    role: 'Member', 
                    monthlyFee: 5000, 
                    joinDate: '2023-05-15' 
                },
                { 
                    memberId: '102', 
                    name: 'Rahim Uddin', 
                    mobile: '01822222222', 
                    password: '123', 
                    role: 'Member', 
                    monthlyFee: 10000, 
                    joinDate: '2023-06-20' 
                }
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
            const initialFunds = {
                englishFund: 25000,
                emergencyFund: 50000,
                welfareFund: 15000
            };
            localStorage.setItem('taqwa_funds', JSON.stringify(initialFunds));
        }

        if (!localStorage.getItem('taqwa_notifications')) {
            localStorage.setItem('taqwa_notifications', JSON.stringify([]));
        }

        // New: Loan Management
        if (!localStorage.getItem('taqwa_loans')) {
            const initialLoans = [
                { 
                    id: 1, 
                    memberId: '101', 
                    memberName: 'Abdul Karim', 
                    amount: 20000, 
                    interestRate: 8, 
                    tenureMonths: 12, 
                    startDate: '2023-08-01', 
                    status: 'Active',
                    monthlyEMI: 1800,
                    remainingAmount: 18000,
                    totalPaid: 2000
                }
            ];
            localStorage.setItem('taqwa_loans', JSON.stringify(initialLoans));
        }

        // New: Meeting Management
        if (!localStorage.getItem('taqwa_meetings')) {
            const initialMeetings = [
                {
                    id: 1,
                    title: 'Monthly General Meeting',
                    date: '2023-10-15',
                    time: '15:00',
                    venue: 'Association Office',
                    agenda: 'Monthly financial review and planning',
                    attendees: ['100', '101', '102'],
                    minutes: 'Discussed new investment opportunities'
                }
            ];
            localStorage.setItem('taqwa_meetings', JSON.stringify(initialMeetings));
        }

        // New: Documents
        if (!localStorage.getItem('taqwa_documents')) {
            const initialDocuments = [
                {
                    id: 1,
                    title: 'Association Registration Certificate',
                    type: 'Legal',
                    uploadedBy: '100',
                    date: '2023-01-15',
                    size: '2.5 MB',
                    url: '#'
                }
            ];
            localStorage.setItem('taqwa_documents', JSON.stringify(initialDocuments));
        }
    }

    // Simulate API delay
    async delay(ms = 300) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getMembers() {
        return JSON.parse(localStorage.getItem('taqwa_members') || '[]');
    }

    getCollections() {
        return JSON.parse(localStorage.getItem('taqwa_collections') || '[]');
    }

    getInvestments() {
        return JSON.parse(localStorage.getItem('taqwa_investments') || '[]');
    }

    getFunds() {
        return JSON.parse(localStorage.getItem('taqwa_funds') || '{"englishFund": 0, "emergencyFund": 0, "welfareFund": 0}');
    }

    getNotifications() {
        return JSON.parse(localStorage.getItem('taqwa_notifications') || '[]');
    }

    getLoans() {
        return JSON.parse(localStorage.getItem('taqwa_loans') || '[]');
    }

    getMeetings() {
        return JSON.parse(localStorage.getItem('taqwa_meetings') || '[]');
    }

    getDocuments() {
        return JSON.parse(localStorage.getItem('taqwa_documents') || '[]');
    }

    async login(memberId, mobile) {
        await this.delay();
        const members = this.getMembers();
        const user = members.find(m => m.memberId === memberId && m.mobile === mobile);
        
        if (user) {
            return { status: 'success', ...user };
        } else {
            throw new Error('Invalid Member ID or Mobile');
        }
    }

    async getDashboardData() {
        await this.delay();
        const members = this.getMembers().filter(m => m.role !== 'Admin');
        const collections = this.getCollections().filter(c => c.status === 'Approved');
        const investments = this.getInvestments();
        const funds = this.getFunds();
        const loans = this.getLoans();
        
        const totalDeposit = collections.reduce((sum, c) => sum + parseInt(c.amount), 0);
        const totalInvested = investments.reduce((sum, i) => sum + parseInt(i.amount), 0);
        const totalLoans = loans.reduce((sum, l) => sum + parseInt(l.amount), 0);
        const activeLoans = loans.filter(l => l.status === 'Active').length;
        const englishFund = parseInt(funds.englishFund || 0);
        const emergencyFund = parseInt(funds.emergencyFund || 0);
        const welfareFund = parseInt(funds.welfareFund || 0);
        const totalFunds = englishFund + emergencyFund + welfareFund;
        const availableBalance = (totalDeposit + totalFunds) - totalInvested;
        
        const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        const thisMonthDeposit = collections
            .filter(c => c.month === currentMonth)
            .reduce((sum, c) => sum + parseInt(c.amount), 0);

        // Calculate growth metrics
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const lastMonthName = lastMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
        const lastMonthDeposit = collections
            .filter(c => c.month === lastMonthName)
            .reduce((sum, c) => sum + parseInt(c.amount), 0);
        
        const growthRate = lastMonthDeposit > 0 ? 
            ((thisMonthDeposit - lastMonthDeposit) / lastMonthDeposit * 100).toFixed(1) : 0;

        return {
            totalMembers: members.length,
            totalDeposit: totalDeposit,
            totalInvested: totalInvested,
            totalLoans: totalLoans,
            activeLoans: activeLoans,
            englishFund: englishFund,
            emergencyFund: emergencyFund,
            welfareFund: welfareFund,
            totalFunds: totalFunds,
            availableBalance: availableBalance,
            thisMonthDeposit: thisMonthDeposit,
            growthRate: growthRate
        };
    }

    async saveCollection(collectionData) {
        await this.delay();
        const members = this.getMembers();
        const member = members.find(m => m.memberId === collectionData.memberId);
        
        if (!member) throw new Error('Member ID not found');

        const collections = this.getCollections();
        const newCollection = {
            id: Date.now(),
            memberName: member.name,
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
        if (members.find(m => m.memberId === memberData.memberId)) {
            throw new Error('Member ID already exists');
        }
        members.push(memberData);
        localStorage.setItem('taqwa_members', JSON.stringify(members));
        return { success: true };
    }

    async saveInvestment(title, amount) {
        await this.delay();
        const investments = this.getInvestments();
        const newInvestment = {
            id: Date.now(),
            title,
            amount,
            date: new Date().toISOString().split('T')[0]
        };
        investments.push(newInvestment);
        localStorage.setItem('taqwa_investments', JSON.stringify(investments));
        return { success: true };
    }

    async updateFund(fundType, amount) {
        await this.delay();
        const funds = this.getFunds();
        funds[fundType] = parseInt(amount);
        localStorage.setItem('taqwa_funds', JSON.stringify(funds));
        return { success: true };
    }

    async sendNotification(message) {
        await this.delay();
        const notifications = this.getNotifications();
        notifications.push({
            id: Date.now(),
            message,
            date: new Date().toLocaleString()
        });
        localStorage.setItem('taqwa_notifications', JSON.stringify(notifications));
        return { success: true };
    }

    async getMemberDue(memberId) {
        await this.delay();
        const members = this.getMembers();
        const member = members.find(m => m.memberId === memberId);
        if (!member) throw new Error('Member not found');

        const collections = this.getCollections().filter(c => c.memberId === memberId);
        const totalPaid = collections.reduce((sum, c) => sum + parseInt(c.amount), 0);
        
        const joinDate = new Date(member.joinDate);
        const now = new Date();
        const monthsJoined = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth()) + 1;
        const totalExpected = monthsJoined * member.monthlyFee;
        
        return {
            paid: totalPaid,
            due: Math.max(0, totalExpected - totalPaid)
        };
    }

    async getCollectionById(id) {
        await this.delay();
        const collections = this.getCollections();
        return collections.find(c => c.id === parseInt(id));
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
        const loans = this.getLoans().filter(l => l.memberId === memberId);
        const totalLoanAmount = loans.reduce((sum, l) => sum + parseInt(l.amount), 0);
        
        return {
            ...member,
            totalPaid: dueData.paid,
            totalDue: dueData.due,
            activeLoans: loans.length,
            totalLoanAmount: totalLoanAmount
        };
    }

    // NEW: Loan Management Methods
    async applyForLoan(loanData) {
        await this.delay();
        const loans = this.getLoans();
        const members = this.getMembers();
        const member = members.find(m => m.memberId === loanData.memberId);
        
        if (!member) throw new Error('Member not found');

        const monthlyEMI = this.calculateEMI(loanData.amount, loanData.interestRate, loanData.tenureMonths);
        
        const newLoan = {
            id: Date.now(),
            memberName: member.name,
            status: 'Pending',
            monthlyEMI: monthlyEMI,
            remainingAmount: parseFloat(loanData.amount),
            totalPaid: 0,
            ...loanData
        };
        
        loans.push(newLoan);
        localStorage.setItem('taqwa_loans', JSON.stringify(loans));
        return { success: true, loan: newLoan };
    }

    calculateEMI(principal, interestRate, tenureMonths) {
        const monthlyRate = interestRate / 12 / 100;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
                   (Math.pow(1 + monthlyRate, tenureMonths) - 1);
        return Math.round(emi);
    }

    async updateLoanStatus(loanId, status) {
        await this.delay();
        const loans = this.getLoans();
        const loanIndex = loans.findIndex(l => l.id === loanId);
        
        if (loanIndex === -1) throw new Error('Loan not found');
        
        loans[loanIndex].status = status;
        localStorage.setItem('taqwa_loans', JSON.stringify(loans));
        return { success: true };
    }

    async payLoanEMI(loanId, amount) {
        await this.delay();
        const loans = this.getLoans();
        const loanIndex = loans.findIndex(l => l.id === loanId);
        
        if (loanIndex === -1) throw new Error('Loan not found');
        
        const loan = loans[loanIndex];
        loan.totalPaid += parseFloat(amount);
        loan.remainingAmount = Math.max(0, loan.remainingAmount - amount);
        
        if (loan.remainingAmount <= 0) {
            loan.status = 'Completed';
        }
        
        localStorage.setItem('taqwa_loans', JSON.stringify(loans));
        return { success: true };
    }

    // NEW: Meeting Management Methods
    async scheduleMeeting(meetingData) {
        await this.delay();
        const meetings = this.getMeetings();
        const newMeeting = {
            id: Date.now(),
            ...meetingData
        };
        
        meetings.push(newMeeting);
        localStorage.setItem('taqwa_meetings', JSON.stringify(meetings));
        return { success: true, meeting: newMeeting };
    }

    async updateMeeting(meetingId, updates) {
        await this.delay();
        const meetings = this.getMeetings();
        const meetingIndex = meetings.findIndex(m => m.id === meetingId);
        
        if (meetingIndex === -1) throw new Error('Meeting not found');
        
        meetings[meetingIndex] = { ...meetings[meetingIndex], ...updates };
        localStorage.setItem('taqwa_meetings', JSON.stringify(meetings));
        return { success: true };
    }

    // NEW: Document Management
    async uploadDocument(documentData) {
        await this.delay();
        const documents = this.getDocuments();
        const newDocument = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            ...documentData
        };
        
        documents.push(newDocument);
        localStorage.setItem('taqwa_documents', JSON.stringify(documents));
        return { success: true, document: newDocument };
    }

    // NEW: Advanced Reporting
    async getFinancialReport(startDate, endDate) {
        await this.delay();
        const collections = this.getCollections();
        const investments = this.getInvestments();
        const loans = this.getLoans();
        
        const filteredCollections = collections.filter(c => {
            const date = new Date(c.date);
            return date >= new Date(startDate) && date <= new Date(endDate);
        });
        
        const filteredInvestments = investments.filter(i => {
            const date = new Date(i.date);
            return date >= new Date(startDate) && date <= new Date(endDate);
        });
        
        const filteredLoans = loans.filter(l => {
            const date = new Date(l.startDate);
            return date >= new Date(startDate) && date <= new Date(endDate);
        });
        
        const totalCollections = filteredCollections.reduce((sum, c) => sum + parseFloat(c.amount), 0);
        const totalInvestments = filteredInvestments.reduce((sum, i) => sum + parseFloat(i.amount), 0);
        const totalLoansIssued = filteredLoans.reduce((sum, l) => sum + parseFloat(l.amount), 0);
        
        return {
            period: `${startDate} to ${endDate}`,
            totalCollections: totalCollections,
            totalInvestments: totalInvestments,
            totalLoansIssued: totalLoansIssued,
            netCashFlow: totalCollections - totalInvestments,
            collectionCount: filteredCollections.length,
            investmentCount: filteredInvestments.length,
            loanCount: filteredLoans.length
        };
    }
}

const backend = new Backend();

// --- FRONTEND LOGIC ---
let currentUser = null;
let activeTab = 'dashboard';

function switchTab(tabId) {
    activeTab = tabId;
    const tabs = document.querySelectorAll('.tab-content');
    const btns = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    btns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabId}')"]`).classList.add('active');
}

function renderLogin() {
    userInfo.style.display = 'none';
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
        <div id="msg" class="error"></div>
        
        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.8rem; color: #888;" class="text-center">
            <p>Demo Admin: 100 / 01700000000</p>
            <p>Demo Member: 101 / 01711111111</p>
        </div>
    </div>`;
}

async function login() {
    const midVal = document.getElementById("mid").value.trim();
    const mobVal = document.getElementById("mob").value.trim();
    const msgEl = document.getElementById("msg");

    if (!midVal || !mobVal) {
        msgEl.innerText = "Please fill in all fields";
        msgEl.style.display = "block";
        return;
    }

    try {
        const user = await backend.login(midVal, mobVal);
        currentUser = user;
        
        userNameSpan.innerText = user.name;
        userInfo.style.display = 'flex';

        if (user.role === "Admin") {
            await renderAdmin();
        } else {
            await renderMember(user.memberId);
        }
    } catch (err) {
        msgEl.innerText = err.message;
        msgEl.style.display = "block";
    }
}

function logout() {
    currentUser = null;
    renderLogin();
}

// --- ENHANCED ADMIN VIEWS ---

async function renderAdmin() {
    const data = await backend.getDashboardData();
    
    app.innerHTML = `
    <div class="tabs-container">
        <button class="tab-btn active" onclick="switchTab('dashboard')"><i class="fa-solid fa-chart-line"></i> Dashboard</button>
        <button class="tab-btn" onclick="switchTab('collections')"><i class="fa-solid fa-money-bill-transfer"></i> Collections</button>
        <button class="tab-btn" onclick="switchTab('members')"><i class="fa-solid fa-users"></i> Members</button>
        <button class="tab-btn" onclick="switchTab('loans')"><i class="fa-solid fa-hand-holding-dollar"></i> Loans</button>
        <button class="tab-btn" onclick="switchTab('investments')"><i class="fa-solid fa-chart-pie"></i> Investments</button>
        <button class="tab-btn" onclick="switchTab('meetings')"><i class="fa-solid fa-calendar-check"></i> Meetings</button>
        <button class="tab-btn" onclick="switchTab('reports')"><i class="fa-solid fa-file-chart-column"></i> Reports</button>
        <button class="tab-btn" onclick="switchTab('notifications')"><i class="fa-solid fa-bell"></i> Alerts</button>
    </div>

    <!-- Enhanced Dashboard Tab -->
    <div id="dashboard" class="tab-content active">
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">${data.totalMembers}</div>
                <div class="stat-label">Total Members</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">Tk. ${data.totalDeposit.toLocaleString()}</div>
                <div class="stat-label">Total Deposits</div>
            </div>
            <div class="stat-item invested">
                <div class="stat-value">Tk. ${data.totalInvested.toLocaleString()}</div>
                <div class="stat-label">Total Invested</div>
            </div>
            <div class="stat-item fund">
                <div class="stat-value">Tk. ${data.englishFund.toLocaleString()}</div>
                <div class="stat-label">English Fund</div>
            </div>
            <div class="stat-item balance">
                <div class="stat-value">Tk. ${data.availableBalance.toLocaleString()}</div>
                <div class="stat-label">Available Cash</div>
            </div>
            <div class="stat-item" style="border-top-color: #e74c3c;">
                <div class="stat-value">Tk. ${data.totalLoans.toLocaleString()}</div>
                <div class="stat-label">Active Loans</div>
            </div>
            <div class="stat-item" style="border-top-color: #8e44ad;">
                <div class="stat-value">${data.activeLoans}</div>
                <div class="stat-label">Loan Count</div>
            </div>
            <div class="stat-item" style="border-top-color: #16a085;">
                <div class="stat-value ${parseFloat(data.growthRate) >= 0 ? 'positive' : 'negative'}">
                    ${data.growthRate}%
                </div>
                <div class="stat-label">Growth Rate</div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;">
            <div class="card">
                <div class="card-header">
                    <h3><i class="fa-solid fa-chart-column"></i> Fund Distribution</h3>
                </div>
                <div style="padding: 15px;">
                    <div class="fund-item">
                        <span>English Fund</span>
                        <span>Tk. ${data.englishFund.toLocaleString()}</span>
                    </div>
                    <div class="fund-item">
                        <span>Emergency Fund</span>
                        <span>Tk. ${data.emergencyFund.toLocaleString()}</span>
                    </div>
                    <div class="fund-item">
                        <span>Welfare Fund</span>
                        <span>Tk. ${data.welfareFund.toLocaleString()}</span>
                    </div>
                    <div class="fund-item total">
                        <strong>Total Funds</strong>
                        <strong>Tk. ${data.totalFunds.toLocaleString()}</strong>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3><i class="fa-solid fa-gears"></i> Quick Actions</h3>
                </div>
                <div class="quick-actions">
                    <button onclick="exportMembers()" class="btn-secondary"><i class="fa-solid fa-file-csv"></i> Export Members</button>
                    <button onclick="exportCollections()" class="btn-secondary"><i class="fa-solid fa-file-export"></i> Export Collections</button>
                    <button onclick="generateFinancialReport()" class="btn-secondary"><i class="fa-solid fa-file-pdf"></i> Generate Report</button>
                    <button onclick="viewAllDocuments()" class="btn-secondary"><i class="fa-solid fa-folder-open"></i> View Documents</button>
                </div>
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
                        <option value="Emergency Fund">Emergency Fund</option>
                        <option value="Welfare Fund">Welfare Fund</option>
                        <option value="Investment">Investment</option>
                        <option value="Loan EMI">Loan EMI</option>
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
                    <input id="slipPhoto" type="file" accept="image/*" onchange="previewImage(this, 'slipPreview')">
                    <div id="slipPreview" style="margin-top: 10px;"></div>
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
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Email Address</label>
                    <input id="newEmail" type="email" placeholder="member@email.com">
                </div>
                <div class="form-group">
                    <label>NID Number</label>
                    <input id="newNid" placeholder="Enter NID">
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

    <!-- NEW: Loans Tab -->
    <div id="loans" class="tab-content">
        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-hand-holding-dollar"></i> Loan Management</h3>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Member ID</label>
                    <input id="loanMemberId" placeholder="e.g. 101" oninput="lookupMemberName(this.value, 'loanMemberName')">
                    <div id="loanMemberName" style="font-size: 0.8rem; color: var(--primary); font-weight: 600; margin-top: 5px;"></div>
                </div>
                <div class="form-group">
                    <label>Loan Amount (Tk)</label>
                    <input id="loanAmount" type="number" value="20000">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Interest Rate (%)</label>
                    <input id="loanInterest" type="number" value="8" step="0.1">
                </div>
                <div class="form-group">
                    <label>Tenure (Months)</label>
                    <input id="loanTenure" type="number" value="12">
                </div>
            </div>
            <div class="form-group">
                <label>Purpose</label>
                <textarea id="loanPurpose" rows="2" placeholder="Describe the purpose of loan..."></textarea>
            </div>
            <div id="loanEMIPreview" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; display: none;">
                <h4 style="margin: 0 0 10px 0;">Loan Preview</h4>
                <div id="emiDetails"></div>
            </div>
            <button onclick="calculateEMI()"><i class="fa-solid fa-calculator"></i> Calculate EMI</button>
            <button onclick="processLoan()" style="background: var(--primary);"><i class="fa-solid fa-paper-plane"></i> Approve Loan</button>
        </div>

        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-list"></i> Active Loans</h3>
            </div>
            <div class="table-container" id="loanList">Loading...</div>
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
                <input id="engFund" type="number" value="${data.englishFund}">
            </div>
            <div class="form-group">
                <label>Emergency Fund Amount (Tk)</label>
                <input id="emergencyFund" type="number" value="${data.emergencyFund}">
            </div>
            <div class="form-group">
                <label>Welfare Fund Amount (Tk)</label>
                <input id="welfareFund" type="number" value="${data.welfareFund}">
            </div>
            <button onclick="updateAllFunds()"><i class="fa-solid fa-save"></i> Update All Funds</button>
        </div>

        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-money-bill-trend-up"></i> Record Investment</h3>
            </div>
            <div class="form-group">
                <label>Investment Title</label>
                <input id="invTitle" placeholder="e.g. Land Purchase - Sector 10">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Amount (Tk)</label>
                    <input id="invAmt" type="number">
                </div>
                <div class="form-group">
                    <label>Investment Type</label>
                    <select id="invType">
                        <option value="Land">Land Purchase</option>
                        <option value="Building">Building Construction</option>
                        <option value="Business">Business</option>
                        <option value="Stock">Stock Market</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="invDesc" rows="2" placeholder="Add investment details..."></textarea>
            </div>
            <button onclick="saveInvestment()"><i class="fa-solid fa-file-invoice-dollar"></i> Save Investment</button>
        </div>
    </div>

    <!-- NEW: Meetings Tab -->
    <div id="meetings" class="tab-content">
        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-calendar-plus"></i> Schedule Meeting</h3>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Meeting Title</label>
                    <input id="meetingTitle" placeholder="e.g. Monthly General Meeting">
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input id="meetingDate" type="date">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Time</label>
                    <input id="meetingTime" type="time">
                </div>
                <div class="form-group">
                    <label>Venue</label>
                    <input id="meetingVenue" placeholder="Association Office">
                </div>
            </div>
            <div class="form-group">
                <label>Agenda</label>
                <textarea id="meetingAgenda" rows="3" placeholder="Meeting agenda points..."></textarea>
            </div>
            <button onclick="scheduleMeeting()"><i class="fa-solid fa-calendar-check"></i> Schedule Meeting</button>
        </div>

        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-clipboard-list"></i> Upcoming Meetings</h3>
            </div>
            <div id="meetingList">Loading...</div>
        </div>
    </div>

    <!-- NEW: Reports Tab -->
    <div id="reports" class="tab-content">
        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-chart-line"></i> Financial Reports</h3>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Start Date</label>
                    <input id="reportStart" type="date">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input id="reportEnd" type="date">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 15px;">
                <button onclick="generateCollectionReport()"><i class="fa-solid fa-money-bill-wave"></i> Collection Report</button>
                <button onclick="generateInvestmentReport()"><i class="fa-solid fa-chart-pie"></i> Investment Report</button>
                <button onclick="generateLoanReport()"><i class="fa-solid fa-hand-holding-dollar"></i> Loan Report</button>
            </div>
            <div id="reportResults" style="margin-top: 20px;"></div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-file-upload"></i> Document Upload</h3>
            </div>
            <div class="form-group">
                <label>Document Title</label>
                <input id="docTitle" placeholder="e.g. Meeting Minutes Oct 2023">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Document Type</label>
                    <select id="docType">
                        <option value="Legal">Legal Document</option>
                        <option value="Financial">Financial Report</option>
                        <option value="Meeting">Meeting Minutes</option>
                        <option value="Property">Property Document</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Upload File</label>
                    <input id="docFile" type="file">
                </div>
            </div>
            <button onclick="uploadDocument()"><i class="fa-solid fa-cloud-upload"></i> Upload Document</button>
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
    
    // Set default dates for reports
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    document.getElementById('reportStart').value = firstDay.toISOString().split('T')[0];
    document.getElementById('reportEnd').value = lastDay.toISOString().split('T')[0];
    document.getElementById('meetingDate').value = today.toISOString().split('T')[0];
    document.getElementById('meetingTime').value = '15:00';
    
    loadMemberList();
    loadLoanList();
    loadMeetings();
}

// --- NEW LOAN FUNCTIONS ---

async function calculateEMI() {
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const interest = parseFloat(document.getElementById('loanInterest').value);
    const tenure = parseInt(document.getElementById('loanTenure').value);
    
    if (!amount || !interest || !tenure) {
        alert('Please fill all loan details');
        return;
    }
    
    const emi = backend.calculateEMI(amount, interest, tenure);
    const totalInterest = (emi * tenure) - amount;
    const totalPayment = emi * tenure;
    
    document.getElementById('loanEMIPreview').style.display = 'block';
    document.getElementById('emiDetails').innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
                <small>Monthly EMI</small>
                <h4 style="margin: 5px 0;">Tk. ${emi.toLocaleString()}</h4>
            </div>
            <div>
                <small>Total Interest</small>
                <h4 style="margin: 5px 0;">Tk. ${totalInterest.toLocaleString()}</h4>
            </div>
            <div>
                <small>Total Payment</small>
                <h4 style="margin: 5px 0;">Tk. ${totalPayment.toLocaleString()}</h4>
            </div>
            <div>
                <small>Loan Tenure</small>
                <h4 style="margin: 5px 0;">${tenure} Months</h4>
            </div>
        </div>
    `;
}

async function processLoan() {
    const memberId = document.getElementById('loanMemberId').value.trim();
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const interest = parseFloat(document.getElementById('loanInterest').value);
    const tenure = parseInt(document.getElementById('loanTenure').value);
    const purpose = document.getElementById('loanPurpose').value.trim();
    
    if (!memberId || !amount || !interest || !tenure) {
        alert('Please fill all required fields');
        return;
    }
    
    try {
        const result = await backend.applyForLoan({
            memberId: memberId,
            amount: amount,
            interestRate: interest,
            tenureMonths: tenure,
            purpose: purpose,
            startDate: new Date().toISOString().split('T')[0]
        });
        
        alert(`Loan approved successfully! EMI: Tk. ${result.loan.monthlyEMI}`);
        loadLoanList();
        
        // Clear form
        document.getElementById('loanMemberId').value = '';
        document.getElementById('loanAmount').value = '20000';
        document.getElementById('loanInterest').value = '8';
        document.getElementById('loanTenure').value = '12';
        document.getElementById('loanPurpose').value = '';
        document.getElementById('loanEMIPreview').style.display = 'none';
        
    } catch (error) {
        alert(error.message);
    }
}

async function loadLoanList() {
    const loans = await backend.getLoans();
    let html = `<table>
        <thead>
            <tr>
                <th>Loan ID</th>
                <th>Member</th>
                <th>Amount</th>
                <th>EMI</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>`;
    
    loans.forEach(loan => {
        const statusClass = loan.status === 'Active' ? 'badge-approved' : 
                          loan.status === 'Pending' ? 'badge-pending' : 'badge-cancelled';
        
        html += `
        <tr>
            <td>#${loan.id}</td>
            <td>${loan.memberName} (${loan.memberId})</td>
            <td>Tk. ${loan.amount.toLocaleString()}</td>
            <td>Tk. ${loan.monthlyEMI.toLocaleString()}</td>
            <td><span class="badge ${statusClass}">${loan.status}</span></td>
            <td>
                <button onclick="viewLoanDetails(${loan.id})" style="width:auto; padding: 3px 8px; font-size:0.8rem;">
                    <i class="fa-solid fa-eye"></i> View
                </button>
                ${loan.status === 'Active' ? `
                <button onclick="recordLoanPayment(${loan.id})" style="width:auto; padding: 3px 8px; font-size:0.8rem; background:#27ae60;">
                    <i class="fa-solid fa-money-bill"></i> Pay
                </button>` : ''}
            </td>
        </tr>`;
    });
    
    html += `</tbody></table>`;
    document.getElementById('loanList').innerHTML = html;
}

async function viewLoanDetails(loanId) {
    const loans = await backend.getLoans();
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return;
    
    const modal = document.createElement('div');
    modal.id = 'loan-details-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="receipt-card" style="max-width: 500px;">
            <div class="receipt-header">
                <h3>Loan Details</h3>
                <p style="color: #666;">Loan ID: #${loan.id}</p>
            </div>
            <div class="receipt-body">
                <div class="loan-details-grid">
                    <div class="loan-detail-item">
                        <span>Member Name:</span>
                        <strong>${loan.memberName}</strong>
                    </div>
                    <div class="loan-detail-item">
                        <span>Member ID:</span>
                        <strong>${loan.memberId}</strong>
                    </div>
                    <div class="loan-detail-item">
                        <span>Loan Amount:</span>
                        <strong>Tk. ${loan.amount.toLocaleString()}</strong>
                    </div>
                    <div class="loan-detail-item">
                        <span>Interest Rate:</span>
                        <strong>${loan.interestRate}%</strong>
                    </div>
                    <div class="loan-detail-item">
                        <span>Monthly EMI:</span>
                        <strong>Tk. ${loan.monthlyEMI.toLocaleString()}</strong>
                    </div>
                    <div class="loan-detail-item">
                        <span>Tenure:</span>
                        <strong>${loan.tenureMonths} Months</strong>
                    </div>
                    <div class="loan-detail-item">
                        <span>Start Date:</span>
                        <strong>${loan.startDate}</strong>
                    </div>
                    <div class="loan-detail-item">
                        <span>Remaining Amount:</span>
                        <strong style="color: ${loan.remainingAmount > 0 ? '#e74c3c' : '#27ae60'}">
                            Tk. ${loan.remainingAmount.toLocaleString()}
                        </strong>
                    </div>
                    <div class="loan-detail-item">
                        <span>Total Paid:</span>
                        <strong>Tk. ${loan.totalPaid.toLocaleString()}</strong>
                    </div>
                    <div class="loan-detail-item">
                        <span>Status:</span>
                        <strong class="badge ${loan.status === 'Active' ? 'badge-approved' : 'badge-cancelled'}">
                            ${loan.status}
                        </strong>
                    </div>
                </div>
                ${loan.purpose ? `<div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                    <strong>Purpose:</strong>
                    <p>${loan.purpose}</p>
                </div>` : ''}
            </div>
            <div class="receipt-actions">
                <button onclick="document.getElementById('loan-details-modal').remove()" class="btn-secondary">
                    <i class="fa-solid fa-times"></i> Close
                </button>
                ${loan.status === 'Active' ? `
                <button onclick="recordLoanPayment(${loan.id})" class="btn-secondary" style="background:#27ae60;">
                    <i class="fa-solid fa-money-bill"></i> Record Payment
                </button>` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function recordLoanPayment(loanId) {
    const amount = prompt('Enter EMI payment amount:');
    if (!amount || isNaN(amount)) return;
    
    try {
        await backend.payLoanEMI(loanId, parseFloat(amount));
        alert('Payment recorded successfully!');
        loadLoanList();
    } catch (error) {
        alert(error.message);
    }
}

// --- NEW MEETING FUNCTIONS ---

async function scheduleMeeting() {
    const title = document.getElementById('meetingTitle').value.trim();
    const date = document.getElementById('meetingDate').value;
    const time = document.getElementById('meetingTime').value;
    const venue = document.getElementById('meetingVenue').value.trim();
    const agenda = document.getElementById('meetingAgenda').value.trim();
    
    if (!title || !date || !time || !venue) {
        alert('Please fill all required fields');
        return;
    }
    
    try {
        await backend.scheduleMeeting({
            title: title,
            date: date,
            time: time,
            venue: venue,
            agenda: agenda,
            attendees: [],
            minutes: ''
        });
        
        alert('Meeting scheduled successfully!');
        loadMeetings();
        
        // Clear form
        document.getElementById('meetingTitle').value = '';
        document.getElementById('meetingAgenda').value = '';
        
    } catch (error) {
        alert(error.message);
    }
}

async function loadMeetings() {
    const meetings = await backend.getMeetings();
    const today = new Date().toISOString().split('T')[0];
    
    let html = '<div class="meeting-list">';
    
    meetings.forEach(meeting => {
        const isPast = new Date(meeting.date) < new Date(today);
        
        html += `
        <div class="meeting-item ${isPast ? 'past' : 'upcoming'}">
            <div class="meeting-header">
                <h4>${meeting.title}</h4>
                <span class="meeting-date">
                    <i class="fa-solid fa-calendar"></i> ${meeting.date} at ${meeting.time}
                </span>
            </div>
            <div class="meeting-details">
                <p><i class="fa-solid fa-location-dot"></i> ${meeting.venue}</p>
                ${meeting.agenda ? `<p><i class="fa-solid fa-clipboard-list"></i> ${meeting.agenda}</p>` : ''}
            </div>
            <div class="meeting-actions">
                <button onclick="viewMeetingDetails(${meeting.id})" class="btn-small">
                    <i class="fa-solid fa-eye"></i> View
                </button>
                <button onclick="sendMeetingReminder(${meeting.id})" class="btn-small ${isPast ? 'disabled' : ''}" ${isPast ? 'disabled' : ''}>
                    <i class="fa-solid fa-bell"></i> Remind
                </button>
            </div>
        </div>`;
    });
    
    if (meetings.length === 0) {
        html = '<p class="text-center" style="color:#888; padding:20px;">No meetings scheduled yet.</p>';
    }
    
    html += '</div>';
    document.getElementById('meetingList').innerHTML = html;
}

async function viewMeetingDetails(meetingId) {
    const meetings = await backend.getMeetings();
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    
    const modal = document.createElement('div');
    modal.id = 'meeting-details-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="receipt-card" style="max-width: 600px;">
            <div class="receipt-header">
                <h3>${meeting.title}</h3>
                <p style="color: #666;">
                    <i class="fa-solid fa-calendar"></i> ${meeting.date} at ${meeting.time} | 
                    <i class="fa-solid fa-location-dot"></i> ${meeting.venue}
                </p>
            </div>
            <div class="receipt-body">
                ${meeting.agenda ? `<div style="margin-bottom: 20px;">
                    <h4>Agenda:</h4>
                    <p>${meeting.agenda}</p>
                </div>` : ''}
                
                ${meeting.minutes ? `<div style="margin-bottom: 20px;">
                    <h4>Meeting Minutes:</h4>
                    <p>${meeting.minutes}</p>
                </div>` : ''}
                
                <div style="margin-bottom: 20px;">
                    <h4>Attendees (${meeting.attendees ? meeting.attendees.length : 0}):</h4>
                    <div id="attendeeList">
                        ${meeting.attendees && meeting.attendees.length > 0 ? 
                            meeting.attendees.map(id => `<span class="attendee-badge">${id}</span>`).join('') : 
                            '<p>No attendees recorded yet.</p>'}
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Add Meeting Minutes</label>
                    <textarea id="meetingMinutes" rows="3" placeholder="Record meeting minutes here...">${meeting.minutes || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Add Attendee Member ID</label>
                    <div style="display: flex; gap: 10px;">
                        <input id="newAttendee" placeholder="Enter member ID">
                        <button onclick="addAttendee(${meeting.id})" style="width: auto; padding: 8px 15px;">
                            <i class="fa-solid fa-plus"></i> Add
                        </button>
                    </div>
                </div>
            </div>
            <div class="receipt-actions">
                <button onclick="saveMeetingMinutes(${meeting.id})" class="btn-secondary">
                    <i class="fa-solid fa-save"></i> Save Minutes
                </button>
                <button onclick="document.getElementById('meeting-details-modal').remove()" class="btn-secondary">
                    <i class="fa-solid fa-times"></i> Close
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function addAttendee(meetingId) {
    const memberId = document.getElementById('newAttendee').value.trim();
    if (!memberId) return;
    
    try {
        const meetings = await backend.getMeetings();
        const meeting = meetings.find(m => m.id === meetingId);
        if (!meeting) return;
        
        if (!meeting.attendees) meeting.attendees = [];
        if (!meeting.attendees.includes(memberId)) {
            meeting.attendees.push(memberId);
            await backend.updateMeeting(meetingId, { attendees: meeting.attendees });
            
            // Update UI
            const badge = document.createElement('span');
            badge.className = 'attendee-badge';
            badge.textContent = memberId;
            document.getElementById('attendeeList').appendChild(badge);
            
            document.getElementById('newAttendee').value = '';
            alert('Attendee added successfully!');
        } else {
            alert('Member already in attendees list');
        }
    } catch (error) {
        alert(error.message);
    }
}

async function saveMeetingMinutes(meetingId) {
    const minutes = document.getElementById('meetingMinutes').value.trim();
    if (!minutes) return;
    
    try {
        await backend.updateMeeting(meetingId, { minutes: minutes });
        alert('Meeting minutes saved successfully!');
    } catch (error) {
        alert(error.message);
    }
}

async function sendMeetingReminder(meetingId) {
    const meetings = await backend.getMeetings();
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;
    
    const members = await backend.getAllMembers();
    const mobileNumbers = members.map(m => m.mobile).join(', ');
    
    const message = `Reminder: ${meeting.title} on ${meeting.date} at ${meeting.time}. Venue: ${meeting.venue}`;
    
    alert(`Send SMS to members: ${mobileNumbers}\n\nMessage: ${message}`);
    
    // For demo purposes, we'll just save a notification
    await backend.sendNotification(`Meeting Reminder: ${meeting.title} - ${meeting.date}`);
    alert('Reminder notification sent!');
}

// --- NEW REPORTING FUNCTIONS ---

async function generateCollectionReport() {
    const startDate = document.getElementById('reportStart').value;
    const endDate = document.getElementById('reportEnd').value;
    
    if (!startDate || !endDate) {
        alert('Please select date range');
        return;
    }
    
    const report = await backend.getFinancialReport(startDate, endDate);
    const collections = await backend.getCollections();
    const filteredCollections = collections.filter(c => {
        const date = new Date(c.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
    });
    
    let html = `
    <div class="report-card">
        <h4>Collection Report (${report.period})</h4>
        <div class="report-stats">
            <div class="report-stat">
                <span>Total Collections</span>
                <strong>Tk. ${report.totalCollections.toLocaleString()}</strong>
            </div>
            <div class="report-stat">
                <span>Number of Transactions</span>
                <strong>${report.collectionCount}</strong>
            </div>
            <div class="report-stat">
                <span>Average Collection</span>
                <strong>Tk. ${(report.totalCollections / (report.collectionCount || 1)).toLocaleString()}</strong>
            </div>
        </div>
        
        <div style="margin-top: 20px;">
            <h5>Collection Details:</h5>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Member</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    filteredCollections.forEach(collection => {
        html += `
        <tr>
            <td>${collection.date}</td>
            <td>${collection.memberName}</td>
            <td>Tk. ${collection.amount}</td>
            <td>${collection.type || 'Monthly Fee'}</td>
            <td><span class="badge badge-${collection.status === 'Approved' ? 'approved' : 'pending'}">${collection.status}</span></td>
        </tr>`;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
        
        <div class="report-actions" style="margin-top: 20px;">
            <button onclick="exportReportToCSV('collections', '${startDate}', '${endDate}')" class="btn-secondary">
                <i class="fa-solid fa-file-export"></i> Export to CSV
            </button>
            <button onclick="printReport()" class="btn-secondary">
                <i class="fa-solid fa-print"></i> Print Report
            </button>
        </div>
    </div>`;
    
    document.getElementById('reportResults').innerHTML = html;
}

async function generateInvestmentReport() {
    const startDate = document.getElementById('reportStart').value;
    const endDate = document.getElementById('reportEnd').value;
    
    if (!startDate || !endDate) {
        alert('Please select date range');
        return;
    }
    
    const investments = await backend.getInvestments();
    const filteredInvestments = investments.filter(i => {
        const date = new Date(i.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
    });
    
    const totalInvested = filteredInvestments.reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const avgInvestment = totalInvested / (filteredInvestments.length || 1);
    
    let html = `
    <div class="report-card">
        <h4>Investment Report (${startDate} to ${endDate})</h4>
        <div class="report-stats">
            <div class="report-stat">
                <span>Total Investments</span>
                <strong>Tk. ${totalInvested.toLocaleString()}</strong>
            </div>
            <div class="report-stat">
                <span>Number of Investments</span>
                <strong>${filteredInvestments.length}</strong>
            </div>
            <div class="report-stat">
                <span>Average Investment</span>
                <strong>Tk. ${avgInvestment.toLocaleString()}</strong>
            </div>
        </div>
        
        <div style="margin-top: 20px;">
            <h5>Investment Details:</h5>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    filteredInvestments.forEach(investment => {
        html += `
        <tr>
            <td>${investment.date}</td>
            <td>${investment.title}</td>
            <td>Tk. ${investment.amount.toLocaleString()}</td>
            <td>${investment.description || '-'}</td>
        </tr>`;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
    
    document.getElementById('reportResults').innerHTML = html;
}

async function generateLoanReport() {
    const loans = await backend.getLoans();
    const activeLoans = loans.filter(l => l.status === 'Active');
    const totalLoanAmount = activeLoans.reduce((sum, l) => sum + parseFloat(l.amount), 0);
    const totalEMI = activeLoans.reduce((sum, l) => sum + parseFloat(l.monthlyEMI), 0);
    
    let html = `
    <div class="report-card">
        <h4>Loan Portfolio Report</h4>
        <div class="report-stats">
            <div class="report-stat">
                <span>Active Loans</span>
                <strong>${activeLoans.length}</strong>
            </div>
            <div class="report-stat">
                <span>Total Loan Amount</span>
                <strong>Tk. ${totalLoanAmount.toLocaleString()}</strong>
            </div>
            <div class="report-stat">
                <span>Monthly EMI Collection</span>
                <strong>Tk. ${totalEMI.toLocaleString()}</strong>
            </div>
        </div>
        
        <div style="margin-top: 20px;">
            <h5>Active Loans:</h5>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Loan ID</th>
                            <th>Member</th>
                            <th>Amount</th>
                            <th>EMI</th>
                            <th>Remaining</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    activeLoans.forEach(loan => {
        html += `
        <tr>
            <td>#${loan.id}</td>
            <td>${loan.memberName}</td>
            <td>Tk. ${loan.amount.toLocaleString()}</td>
            <td>Tk. ${loan.monthlyEMI.toLocaleString()}</td>
            <td>Tk. ${loan.remainingAmount.toLocaleString()}</td>
            <td><span class="badge badge-approved">${loan.status}</span></td>
        </tr>`;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
    
    document.getElementById('reportResults').innerHTML = html;
}

async function exportReportToCSV(type, startDate, endDate) {
    let rows = [];
    let filename = '';
    
    if (type === 'collections') {
        const collections = await backend.getCollections();
        const filteredCollections = collections.filter(c => {
            const date = new Date(c.date);
            return date >= new Date(startDate) && date <= new Date(endDate);
        });
        
        rows = [["Date", "Member ID", "Member Name", "Amount", "Type", "Status"]];
        filteredCollections.forEach(c => {
            rows.push([c.date, c.memberId, c.memberName, c.amount, c.type || 'Monthly Fee', c.status]);
        });
        filename = `collections_${startDate}_to_${endDate}.csv`;
    }
    
    exportToCSV(filename, rows);
}

function printReport() {
    window.print();
}

// --- NEW DOCUMENT FUNCTIONS ---

async function uploadDocument() {
    const title = document.getElementById('docTitle').value.trim();
    const type = document.getElementById('docType').value;
    const fileInput = document.getElementById('docFile');
    
    if (!title || !fileInput.files.length) {
        alert('Please enter title and select file');
        return;
    }
    
    const file = fileInput.files[0];
    const size = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    
    try {
        await backend.uploadDocument({
            title: title,
            type: type,
            uploadedBy: currentUser.memberId,
            size: size,
            url: URL.createObjectURL(file) // In real app, upload to server
        });
        
        alert('Document uploaded successfully!');
        
        // Clear form
        document.getElementById('docTitle').value = '';
        document.getElementById('docFile').value = '';
        
    } catch (error) {
        alert(error.message);
    }
}

async function viewAllDocuments() {
    const documents = await backend.getDocuments();
    
    let html = '<div class="document-list">';
    documents.forEach(doc => {
        html += `
        <div class="document-item">
            <div class="document-icon">
                <i class="fa-solid fa-file-pdf fa-2x" style="color: #e74c3c;"></i>
            </div>
            <div class="document-info">
                <h5>${doc.title}</h5>
                <p>
                    <span class="badge badge-${doc.type.toLowerCase()}">${doc.type}</span>
                    <span style="color: #666;">• Uploaded: ${doc.date} • Size: ${doc.size}</span>
                </p>
            </div>
            <div class="document-actions">
                <button onclick="downloadDocument('${doc.url}')" class="btn-small">
                    <i class="fa-solid fa-download"></i> Download
                </button>
                <button onclick="shareDocument('${doc.title}', '${doc.url}')" class="btn-small">
                    <i class="fa-solid fa-share"></i> Share
                </button>
            </div>
        </div>`;
    });
    
    if (documents.length === 0) {
        html = '<p class="text-center" style="color:#888; padding:20px;">No documents uploaded yet.</p>';
    }
    
    html += '</div>';
    
    const modal = document.createElement('div');
    modal.id = 'documents-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="receipt-card" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
            <div class="receipt-header">
                <h3>Association Documents</h3>
                <p style="color: #666;">Total: ${documents.length} documents</p>
            </div>
            <div class="receipt-body">
                ${html}
            </div>
            <div class="receipt-actions">
                <button onclick="document.getElementById('documents-modal').remove()" class="btn-secondary">
                    <i class="fa-solid fa-times"></i> Close
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function downloadDocument(url) {
    // In real app, this would download the actual file
    alert('Downloading document...');
}

function shareDocument(title, url) {
    // In real app, this would share via email or other methods
    alert(`Share document: ${title}`);
}

// --- UPDATED EXISTING FUNCTIONS ---

async function addNewMember() {
    const mid = document.getElementById("newMid").value.trim();
    const name = document.getElementById("newName").value.trim();
    const mob = document.getElementById("newMob").value.trim();
    const fee = document.getElementById("newFee").value.trim();
    const email = document.getElementById("newEmail").value.trim();
    const nid = document.getElementById("newNid").value.trim();

    if (!mid || !name || !mob || !fee) {
        alert("Required fields: ID, Name, Mobile, and Fee");
        return;
    }

    try {
        await backend.addMember({
            memberId: mid,
            name: name,
            mobile: mob,
            email: email,
            nid: nid,
            monthlyFee: parseInt(fee),
            role: 'Member',
            joinDate: new Date().toISOString().split('T')[0]
        });
        alert("Member added successfully!");
        renderAdmin();
    } catch (err) {
        alert(err.message);
    }
}

async function updateAllFunds() {
    const engFund = document.getElementById("engFund").value;
    const emergencyFund = document.getElementById("emergencyFund").value;
    const welfareFund = document.getElementById("welfareFund").value;
    
    try {
        await backend.updateFund('englishFund', engFund);
        await backend.updateFund('emergencyFund', emergencyFund);
        await backend.updateFund('welfareFund', welfareFund);
        alert("All funds updated successfully!");
        renderAdmin();
    } catch (err) {
        alert(err.message);
    }
}

async function saveInvestment() {
    const title = document.getElementById("invTitle").value.trim();
    const amt = document.getElementById("invAmt").value.trim();
    const type = document.getElementById("invType").value;
    const desc = document.getElementById("invDesc").value.trim();
    
    if (!title || !amt) return;
    
    try {
        await backend.saveInvestment(title, parseInt(amt));
        alert("Investment recorded successfully!");
        renderAdmin();
    } catch (err) {
        alert(err.message);
    }
}

function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; max-height: 150px; border-radius: 5px;">`;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// --- ENHANCED MEMBER VIEW ---

async function renderMember(memberId) {
    const m = await backend.getMemberProfile(memberId);
    const d = await backend.getMemberDue(memberId);
    const notifications = await backend.getNotifications();
    const loans = await backend.getLoans().filter(l => l.memberId === memberId && l.status === 'Active');
    
    app.innerHTML = `
    <div class="tabs-container">
        <button class="tab-btn active" onclick="switchTab('overview')"><i class="fa-solid fa-house-user"></i> Overview</button>
        <button class="tab-btn" onclick="switchTab('payments')"><i class="fa-solid fa-history"></i> Payments</button>
        <button class="tab-btn" onclick="switchTab('loans')"><i class="fa-solid fa-hand-holding-dollar"></i> Loans (${loans.length})</button>
        <button class="tab-btn" onclick="switchTab('deposit')"><i class="fa-solid fa-hand-holding-medical"></i> Submit Deposit</button>
        <button class="tab-btn" onclick="switchTab('meetings')"><i class="fa-solid fa-calendar"></i> Meetings</button>
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
                    <p><b>Name:</b> ${m.name}</p>
                    <p><b>Member ID:</b> ${m.memberId}</p>
                    <p><b>Mobile:</b> ${m.mobile}</p>
                </div>
                <div>
                    <p><b>Join Date:</b> ${m.joinDate}</p>
                    <p><b>Monthly Fee:</b> Tk. ${m.monthlyFee}</p>
                    <p><b>Active Loans:</b> ${m.activeLoans || 0}</p>
                </div>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">Tk. ${d.paid.toLocaleString()}</div>
                <div class="stat-label">Total Paid</div>
            </div>
            <div class="stat-item" style="border-top-color: ${d.due > 0 ? '#dc3545' : '#198754'}">
                <div class="stat-value" style="color: ${d.due > 0 ? '#dc3545' : '#198754'}">Tk. ${d.due.toLocaleString()}</div>
                <div class="stat-label">Total Due</div>
            </div>
            <div class="stat-item" style="border-top-color: #e74c3c;">
                <div class="stat-value">${m.activeLoans || 0}</div>
                <div class="stat-label">Active Loans</div>
            </div>
            <div class="stat-item" style="border-top-color: #8e44ad;">
                <div class="stat-value">Tk. ${(m.totalLoanAmount || 0).toLocaleString()}</div>
                <div class="stat-label">Loan Amount</div>
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

    <!-- NEW: Loans Tab for Members -->
    <div id="loans" class="tab-content">
        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-hand-holding-dollar"></i> My Loans</h3>
            </div>
            ${loans.length > 0 ? '' : `
            <div style="text-align: center; padding: 30px;">
                <i class="fa-solid fa-coins fa-3x" style="color: #ddd; margin-bottom: 15px;"></i>
                <p>No active loans</p>
                <button onclick="applyForLoanMember()" style="margin-top: 15px;">
                    <i class="fa-solid fa-file-signature"></i> Apply for Loan
                </button>
            </div>`}
            <div id="memberLoanList">
                ${loans.length > 0 ? 'Loading loans...' : ''}
            </div>
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
                    <input id="depAmt" type="number" value="${m.monthlyFee}">
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

    <!-- NEW: Meetings Tab for Members -->
    <div id="meetings" class="tab-content">
        <div class="card">
            <div class="card-header">
                <h3><i class="fa-solid fa-calendar"></i> Upcoming Meetings</h3>
            </div>
            <div id="memberMeetings">Loading...</div>
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
    loadMemberLoans(memberId);
    loadMemberMeetings(memberId);
}

async function applyForLoanMember() {
    const amount = prompt('Enter loan amount (Tk):');
    const tenure = prompt('Enter loan tenure (months):', '12');
    const purpose = prompt('Enter loan purpose:');
    
    if (!amount || !tenure) return;
    
    try {
        await backend.applyForLoan({
            memberId: currentUser.memberId,
            amount: parseFloat(amount),
            interestRate: 8, // Default rate
            tenureMonths: parseInt(tenure),
            purpose: purpose,
            startDate: new Date().toISOString().split('T')[0]
        });
        alert('Loan application submitted for admin approval!');
        renderMember(currentUser.memberId);
    } catch (error) {
        alert(error.message);
    }
}

async function loadMemberLoans(memberId) {
    const loans = await backend.getLoans().filter(l => l.memberId === memberId);
    if (loans.length === 0) return;
    
    let html = '<div class="loan-list">';
    loans.forEach(loan => {
        html += `
        <div class="loan-item">
            <div class="loan-header">
                <h4>Loan #${loan.id}</h4>
                <span class="badge badge-${loan.status === 'Active' ? 'approved' : 'pending'}">${loan.status}</span>
            </div>
            <div class="loan-details">
                <div class="loan-detail">
                    <span>Amount:</span>
                    <strong>Tk. ${loan.amount.toLocaleString()}</strong>
                </div>
                <div class="loan-detail">
                    <span>Monthly EMI:</span>
                    <strong>Tk. ${loan.monthlyEMI.toLocaleString()}</strong>
                </div>
                <div class="loan-detail">
                    <span>Remaining:</span>
                    <strong style="color: ${loan.remainingAmount > 0 ? '#e74c3c' : '#27ae60'}">
                        Tk. ${loan.remainingAmount.toLocaleString()}
                    </strong>
                </div>
                <div class="loan-detail">
                    <span>Total Paid:</span>
                    <strong>Tk. ${loan.totalPaid.toLocaleString()}</strong>
                </div>
            </div>
            ${loan.purpose ? `<div class="loan-purpose">${loan.purpose}</div>` : ''}
            ${loan.status === 'Active' ? `
            <div class="loan-actions">
                <button onclick="payLoanEMIMember(${loan.id})" class="btn-small">
                    <i class="fa-solid fa-money-bill"></i> Pay EMI
                </button>
                <button onclick="viewLoanDetails(${loan.id})" class="btn-small">
                    <i class="fa-solid fa-eye"></i> Details
                </button>
            </div>` : ''}
        </div>`;
    });
    html += '</div>';
    document.getElementById('memberLoanList').innerHTML = html;
}

async function payLoanEMIMember(loanId) {
    const amount = prompt('Enter EMI payment amount:');
    if (!amount || isNaN(amount)) return;
    
    try {
        await backend.payLoanEMI(loanId, parseFloat(amount));
        alert('EMI payment submitted!');
        loadMemberLoans(currentUser.memberId);
    } catch (error) {
        alert(error.message);
    }
}

async function loadMemberMeetings(memberId) {
    const meetings = await backend.getMeetings();
    const today = new Date().toISOString().split('T')[0];
    
    let html = '<div class="meeting-list">';
    meetings.forEach(meeting => {
        const isAttending = meeting.attendees && meeting.attendees.includes(memberId);
        const isPast = new Date(meeting.date) < new Date(today);
        
        html += `
        <div class="meeting-item ${isPast ? 'past' : 'upcoming'}">
            <div class="meeting-header">
                <h4>${meeting.title}</h4>
                <div>
                    <span class="meeting-date">
                        <i class="fa-solid fa-calendar"></i> ${meeting.date} at ${meeting.time}
                    </span>
                    ${isAttending ? '<span class="badge badge-approved" style="margin-left:10px;"><i class="fa-solid fa-check"></i> Attending</span>' : ''}
                </div>
            </div>
            <div class="meeting-details">
                <p><i class="fa-solid fa-location-dot"></i> ${meeting.venue}</p>
                ${meeting.agenda ? `<p><i class="fa-solid fa-clipboard-list"></i> ${meeting.agenda}</p>` : ''}
            </div>
            ${!isPast && !isAttending ? `
            <div class="meeting-actions">
                <button onclick="rsvpToMeeting(${meeting.id}, '${memberId}')" class="btn-small">
                    <i class="fa-solid fa-check"></i> RSVP
                </button>
                <button onclick="viewMeetingDetails(${meeting.id})" class="btn-small">
                    <i class="fa-solid fa-eye"></i> Details
                </button>
            </div>` : ''}
        </div>`;
    });
    
    if (meetings.length === 0) {
        html = '<p class="text-center" style="color:#888; padding:20px;">No meetings scheduled.</p>';
    }
    
    html += '</div>';
    document.getElementById('memberMeetings').innerHTML = html;
}

async function rsvpToMeeting(meetingId, memberId) {
    try {
        const meetings = await backend.getMeetings();
        const meeting = meetings.find(m => m.id === meetingId);
        if (!meeting) return;
        
        if (!meeting.attendees) meeting.attendees = [];
        if (!meeting.attendees.includes(memberId)) {
            meeting.attendees.push(memberId);
            await backend.updateMeeting(meetingId, { attendees: meeting.attendees });
            alert('RSVP confirmed! You are now attending this meeting.');
            loadMemberMeetings(memberId);
        } else {
            alert('You are already attending this meeting.');
        }
    } catch (error) {
        alert(error.message);
    }
}

// --- HELPER FUNCTIONS ---

function lookupMemberName(id, displayId) {
    const members = JSON.parse(localStorage.getItem('taqwa_members') || '[]');
    const member = members.find(m => m.memberId === id);
    const display = document.getElementById(displayId);
    if (display) {
        if (member) {
            display.innerText = `Member: ${member.name}`;
            display.style.color = 'var(--primary)';
        } else {
            display.innerText = id ? 'Member not found' : '';
            display.style.color = '#dc3545';
        }
    }
}

function toggleBankField(val, targetId) {
    const el = document.getElementById(targetId);
    if (el) {
        if (val === 'Bank Transfer') {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    }
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

// Keep all existing helper functions (showReceipt, sendWhatsApp, loadMemberHistory, exportToCSV, etc.)
// They remain unchanged from original code

// Initialize App
renderLogin();

// Add CSS for new features
const style = document.createElement('style');
style.textContent = `
.quick-actions {
    display: grid;
    gap: 10px;
    padding: 15px;
}

.fund-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.fund-item.total {
    font-weight: bold;
    border-top: 2px solid var(--primary);
    border-bottom: none;
    margin-top: 10px;
    padding-top: 10px;
}

.loan-details-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin: 15px 0;
}

.loan-detail-item {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 5px;
}

.meeting-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.meeting-item {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 15px;
    transition: all 0.3s;
}

.meeting-item.upcoming {
    border-left: 4px solid #3498db;
}

.meeting-item.past {
    border-left: 4px solid #95a5a6;
    opacity: 0.8;
}

.meeting-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
}

.meeting-header h4 {
    margin: 0;
    font-size: 1rem;
}

.meeting-date {
    font-size: 0.85rem;
    color: #666;
}

.meeting-details p {
    margin: 5px 0;
    font-size: 0.9rem;
    color: #555;
}

.meeting-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.document-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.document-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #dee2e6;
}

.document-icon {
    width: 50px;
    text-align: center;
}

.document-info {
    flex: 1;
}

.document-info h5 {
    margin: 0 0 5px 0;
    font-size: 0.95rem;
}

.document-actions {
    display: flex;
    gap: 10px;
}

.report-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #dee2e6;
    margin-bottom: 20px;
}

.report-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 20px 0;
}

.report-stat {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
}

.report-stat span {
    display: block;
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 5px;
}

.report-stat strong {
    font-size: 1.2rem;
    color: var(--primary);
}

.positive {
    color: #27ae60;
}

.negative {
    color: #e74c3c;
}

.attendee-badge {
    display: inline-block;
    background: #e8f5e9;
    color: #2e7d32;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    margin: 3px;
}

.loan-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.loan-item {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 15px;
    border-left: 4px solid #e74c3c;
}

.loan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.loan-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin-bottom: 10px;
}

.loan-detail {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 5px;
}

.loan-purpose {
    padding: 10px;
    background: #fff8e1;
    border-radius: 5px;
    margin: 10px 0;
    font-size: 0.9rem;
}

.loan-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.btn-small {
    padding: 5px 12px;
    font-size: 0.85rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: var(--primary);
    color: white;
    text-decoration: none;
    transition: all 0.3s;
}

.btn-small:hover {
    opacity: 0.9;
}

.btn-small.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.badge-pending {
    background: #fff3cd;
    color: #856404;
}

.badge-cancelled {
    background: #f8d7da;
    color: #721c24;
}

.badge-legal {
    background: #cce5ff;
    color: #004085;
}

.badge-financial {
    background: #d4edda;
    color: #155724;
}
`;
document.head.appendChild(style);
