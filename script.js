/**
 * Taqwa Property BD - Investment Management System
 * Complete solution for 100 members with share calculation, profit distribution
 */

const app = document.getElementById("app");

// Initial database setup
class InvestmentSystem {
    constructor() {
        this.initDatabase();
    }

    initDatabase() {
        // Members Database (100 members capacity)
        if (!localStorage.getItem('taqwa_members')) {
            const members = [];
            // Add admin
            members.push({
                memberId: 'ADM001',
                name: 'Admin User',
                mobile: '01700000000',
                password: 'admin123',
                role: 'Admin',
                joinDate: '2023-01-01',
                totalShares: 0,
                monthlyDeposit: 0,
                email: 'admin@taqwabd.com',
                nid: '0000000000000'
            });
            
            // Add sample members
            for (let i = 1; i <= 10; i++) {
                members.push({
                    memberId: `MEM${i.toString().padStart(3, '0')}`,
                    name: `Member ${i}`,
                    mobile: `017${i.toString().padStart(9, '0')}`,
                    password: '123456',
                    role: 'Member',
                    joinDate: '2023-01-01',
                    totalShares: 1000, // Each member starts with 1000 shares
                    monthlyDeposit: 5000,
                    email: `member${i}@gmail.com`,
                    nid: `${i.toString().padStart(13, '0')}`
                });
            }
            localStorage.setItem('taqwa_members', JSON.stringify(members));
        }

        // Projects Database
        if (!localStorage.getItem('taqwa_projects')) {
            const projects = [
                {
                    projectId: 'PROJ001',
                    name: 'Land Investment - Mirpur',
                    totalInvestment: 5000000,
                    currentValue: 6500000,
                    profit: 1500000,
                    startDate: '2023-03-15',
                    status: 'Active',
                    sharesIssued: 100000,
                    shareValue: 65 // Current value per share
                },
                {
                    projectId: 'PROJ002',
                    name: 'Commercial Building - Uttara',
                    totalInvestment: 8000000,
                    currentValue: 9200000,
                    profit: 1200000,
                    startDate: '2023-05-20',
                    status: 'Active',
                    sharesIssued: 150000,
                    shareValue: 61.33
                }
            ];
            localStorage.setItem('taqwa_projects', JSON.stringify(projects));
        }

        // Deposits Database
        if (!localStorage.getItem('taqwa_deposits')) {
            const deposits = [
                {
                    depositId: 'DEP001',
                    memberId: 'MEM001',
                    memberName: 'Member 1',
                    amount: 5000,
                    month: 'August 2023',
                    date: '2023-08-05',
                    transactionId: 'BKASH001',
                    bankName: 'Bkash',
                    slipNumber: 'SLP001',
                    status: 'Approved',
                    type: 'Monthly Deposit'
                },
                {
                    depositId: 'DEP002',
                    memberId: 'MEM001',
                    memberName: 'Member 1',
                    amount: 5000,
                    month: 'September 2023',
                    date: '2023-09-10',
                    transactionId: 'BKASH002',
                    bankName: 'Bkash',
                    slipNumber: 'SLP002',
                    status: 'Pending',
                    type: 'Monthly Deposit'
                },
                {
                    depositId: 'DEP003',
                    memberId: 'MEM002',
                    memberName: 'Member 2',
                    amount: 5000,
                    month: 'September 2023',
                    date: '2023-09-12',
                    transactionId: 'NAGAD001',
                    bankName: 'Nagad',
                    slipNumber: 'SLP003',
                    status: 'Approved',
                    type: 'Monthly Deposit'
                }
            ];
            localStorage.setItem('taqwa_deposits', JSON.stringify(deposits));
        }

        // Notifications Database
        if (!localStorage.getItem('taqwa_notifications')) {
            const notifications = [
                {
                    id: 'NOT001',
                    title: 'Monthly Meeting',
                    message: 'Monthly general meeting will be held on 25th October',
                    date: '2023-10-20',
                    type: 'Meeting'
                },
                {
                    id: 'NOT002',
                    title: 'Profit Distribution',
                    message: 'Profit for Q3 2023 will be distributed next week',
                    date: '2023-10-15',
                    type: 'Financial'
                },
                {
                    id: 'NOT003',
                    title: 'New Project',
                    message: 'New land project in Gazipur has been approved',
                    date: '2023-10-10',
                    type: 'Project'
                }
            ];
            localStorage.setItem('taqwa_notifications', JSON.stringify(notifications));
        }

        // Expenses/Vouchers Database
        if (!localStorage.getItem('taqwa_expenses')) {
            const expenses = [
                {
                    voucherId: 'VOUCH001',
                    description: 'Office Rent - October 2023',
                    amount: 25000,
                    date: '2023-10-05',
                    category: 'Office Expense',
                    approvedBy: 'ADM001'
                },
                {
                    voucherId: 'VOUCH002',
                    description: 'Land Registration Fee',
                    amount: 50000,
                    date: '2023-10-10',
                    category: 'Legal Expense',
                    approvedBy: 'ADM001'
                }
            ];
            localStorage.setItem('taqwa_expenses', JSON.stringify(expenses));
        }

        // Profit Distribution Database
        if (!localStorage.getItem('taqwa_profits')) {
            const profits = [
                {
                    id: 'PROFIT001',
                    projectId: 'PROJ001',
                    memberId: 'MEM001',
                    amount: 15000,
                    date: '2023-09-30',
                    shares: 1000,
                    perShareProfit: 15
                }
            ];
            localStorage.setItem('taqwa_profits', JSON.stringify(profits));
        }
    }

    // Get all data methods
    getMembers() {
        return JSON.parse(localStorage.getItem('taqwa_members') || '[]');
    }

    getProjects() {
        return JSON.parse(localStorage.getItem('taqwa_projects') || '[]');
    }

    getDeposits() {
        return JSON.parse(localStorage.getItem('taqwa_deposits') || '[]');
    }

    getNotifications() {
        return JSON.parse(localStorage.getItem('taqwa_notifications') || '[]');
    }

    getExpenses() {
        return JSON.parse(localStorage.getItem('taqwa_expenses') || '[]');
    }

    getProfits() {
        return JSON.parse(localStorage.getItem('taqwa_profits') || '[]');
    }

    // Authentication
    async login(memberId, password) {
        await this.delay(500);
        const members = this.getMembers();
        const member = members.find(m => 
            m.memberId === memberId && m.password === password
        );
        
        if (member) {
            return { success: true, user: member };
        } else {
            throw new Error('Invalid Member ID or Password');
        }
    }

    // Member operations
    async submitDeposit(depositData) {
        await this.delay(500);
        const deposits = this.getDeposits();
        const members = this.getMembers();
        const member = members.find(m => m.memberId === depositData.memberId);
        
        if (!member) {
            throw new Error('Member not found');
        }

        const newDeposit = {
            depositId: 'DEP' + (deposits.length + 1).toString().padStart(3, '0'),
            memberName: member.name,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            ...depositData
        };

        deposits.push(newDeposit);
        localStorage.setItem('taqwa_deposits', JSON.stringify(deposits));
        
        // Add notification for admin
        await this.addNotification(
            'New Deposit Submission',
            `${member.name} (${member.memberId}) submitted ${depositData.amount}৳ for ${depositData.month}`,
            'Deposit'
        );

        return { success: true, deposit: newDeposit };
    }

    async approveDeposit(depositId) {
        await this.delay(500);
        const deposits = this.getDeposits();
        const depositIndex = deposits.findIndex(d => d.depositId === depositId);
        
        if (depositIndex === -1) {
            throw new Error('Deposit not found');
        }

        deposits[depositIndex].status = 'Approved';
        localStorage.setItem('taqwa_deposits', JSON.stringify(deposits));

        // Add notification for member
        const deposit = deposits[depositIndex];
        await this.addNotification(
            'Deposit Approved',
            `Your deposit of ${deposit.amount}৳ for ${deposit.month} has been approved`,
            'Financial',
            deposit.memberId
        );

        return { success: true };
    }

    async rejectDeposit(depositId) {
        await this.delay(500);
        const deposits = this.getDeposits();
        const depositIndex = deposits.findIndex(d => d.depositId === depositId);
        
        if (depositIndex === -1) {
            throw new Error('Deposit not found');
        }

        deposits[depositIndex].status = 'Rejected';
        localStorage.setItem('taqwa_deposits', JSON.stringify(deposits));

        // Add notification for member
        const deposit = deposits[depositIndex];
        await this.addNotification(
            'Deposit Rejected',
            `Your deposit of ${deposit.amount}৳ for ${deposit.month} has been rejected. Please contact admin.`,
            'Financial',
            deposit.memberId
        );

        return { success: true };
    }

    // Project operations
    async addProject(projectData) {
        await this.delay(500);
        const projects = this.getProjects();
        const newProject = {
            projectId: 'PROJ' + (projects.length + 1).toString().padStart(3, '0'),
            status: 'Active',
            sharesIssued: 0,
            shareValue: 0,
            ...projectData
        };

        projects.push(newProject);
        localStorage.setItem('taqwa_projects', JSON.stringify(projects));

        await this.addNotification(
            'New Project Added',
            `New project "${projectData.name}" has been added`,
            'Project'
        );

        return { success: true, project: newProject };
    }

    async addExpense(expenseData) {
        await this.delay(500);
        const expenses = this.getExpenses();
        const newExpense = {
            voucherId: 'VOUCH' + (expenses.length + 1).toString().padStart(3, '0'),
            date: new Date().toISOString().split('T')[0],
            approvedBy: expenseData.approvedBy,
            ...expenseData
        };

        expenses.push(newExpense);
        localStorage.setItem('taqwa_expenses', JSON.stringify(expenses));

        return { success: true, expense: newExpense };
    }

    // Notification operations
    async addNotification(title, message, type, memberId = null) {
        await this.delay(500);
        const notifications = this.getNotifications();
        const newNotification = {
            id: 'NOT' + (notifications.length + 1).toString().padStart(3, '0'),
            title,
            message,
            type,
            date: new Date().toISOString().split('T')[0],
            memberId: memberId
        };

        notifications.push(newNotification);
        localStorage.setItem('taqwa_notifications', JSON.stringify(expenses));
        return { success: true };
    }

    // Dashboard calculations
    async getDashboardStats() {
        const members = this.getMembers().filter(m => m.role === 'Member');
        const deposits = this.getDeposits();
        const expenses = this.getExpenses();
        const projects = this.getProjects();

        const totalDeposits = deposits
            .filter(d => d.status === 'Approved')
            .reduce((sum, d) => sum + d.amount, 0);

        const currentMonth = new Date().toLocaleString('bn-BD', { 
            month: 'long', 
            year: 'numeric' 
        });
        const thisMonthDeposits = deposits
            .filter(d => d.month === currentMonth && d.status === 'Approved')
            .reduce((sum, d) => sum + d.amount, 0);

        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const thisMonthExpenses = expenses
            .filter(e => {
                const expenseDate = new Date(e.date);
                return expenseDate.getMonth() === new Date().getMonth() &&
                       expenseDate.getFullYear() === new Date().getFullYear();
            })
            .reduce((sum, e) => sum + e.amount, 0);

        const totalInvested = projects.reduce((sum, p) => sum + p.totalInvestment, 0);
        const totalProfit = projects.reduce((sum, p) => sum + p.profit, 0);
        const totalCurrentValue = projects.reduce((sum, p) => sum + p.currentValue, 0);

        return {
            totalMembers: members.length,
            totalDeposits: totalDeposits,
            thisMonthDeposits: thisMonthDeposits,
            totalExpenses: totalExpenses,
            thisMonthExpenses: thisMonthExpenses,
            totalInvested: totalInvested,
            totalProfit: totalProfit,
            totalCurrentValue: totalCurrentValue,
            activeProjects: projects.length
        };
    }

    // Member-specific calculations
    async getMemberStats(memberId) {
        const member = this.getMembers().find(m => m.memberId === memberId);
        if (!member) throw new Error('Member not found');

        const deposits = this.getDeposits().filter(d => d.memberId === memberId);
        const approvedDeposits = deposits.filter(d => d.status === 'Approved');
        const pendingDeposits = deposits.filter(d => d.status === 'Pending');
        
        const totalDeposited = approvedDeposits.reduce((sum, d) => sum + d.amount, 0);
        const currentMonth = new Date().toLocaleString('bn-BD', { 
            month: 'long', 
            year: 'numeric' 
        });
        const thisMonthDeposit = approvedDeposits
            .filter(d => d.month === currentMonth)
            .reduce((sum, d) => sum + d.amount, 0);

        // Calculate due (assuming 5000/month as standard)
        const joinDate = new Date(member.joinDate);
        const currentDate = new Date();
        const monthsSinceJoin = (currentDate.getFullYear() - joinDate.getFullYear()) * 12 + 
                               (currentDate.getMonth() - joinDate.getMonth());
        const expectedAmount = monthsSinceJoin * member.monthlyDeposit;
        const dueAmount = Math.max(0, expectedAmount - totalDeposited);

        // Calculate profit
        const profits = this.getProfits().filter(p => p.memberId === memberId);
        const totalProfit = profits.reduce((sum, p) => sum + p.amount, 0);

        // Share information
        const totalShares = member.totalShares || 0;
        const projects = this.getProjects();
        const shareValue = projects.reduce((sum, p) => sum + (p.shareValue || 0), 0) / (projects.length || 1);
        const shareWorth = totalShares * shareValue;

        return {
            member: member,
            totalDeposited: totalDeposited,
            thisMonthDeposit: thisMonthDeposit,
            dueAmount: dueAmount,
            pendingDeposits: pendingDeposits.length,
            totalProfit: totalProfit,
            totalShares: totalShares,
            shareValue: shareValue,
            shareWorth: shareWorth
        };
    }

    // Utility
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the system
const system = new InvestmentSystem();
let currentUser = null;
let currentTab = 'dashboard';

// Render Functions
function renderLogin() {
    app.innerHTML = `
    <div class="login-container">
        <div class="login-logo">
            <i class="fas fa-landmark"></i>
        </div>
        <h2 class="login-title">Taqwa Property BD</h2>
        <p style="color: #666; margin-bottom: 30px;">Investment Management System</p>
        
        <div class="form-group">
            <label><i class="fas fa-id-card"></i> Member ID</label>
            <input type="text" id="loginMemberId" placeholder="Enter your Member ID" value="MEM001">
        </div>
        
        <div class="form-group">
            <label><i class="fas fa-lock"></i> Password</label>
            <input type="password" id="loginPassword" placeholder="Enter your password" value="123456">
        </div>
        
        <button onclick="handleLogin()" style="width: 100%;">
            <i class="fas fa-sign-in-alt"></i> Login
        </button>
        
        <div id="loginError" class="error" style="display: none;"></div>
        
        <div class="demo-accounts">
            <p><strong>Demo Accounts:</strong></p>
            <p>Admin: ADM001 / admin123</p>
            <p>Member: MEM001 / 123456</p>
        </div>
    </div>`;
}

async function handleLogin() {
    const memberId = document.getElementById('loginMemberId').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.style.display = 'none';
    
    if (!memberId || !password) {
        errorDiv.textContent = 'Please enter Member ID and Password';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        const result = await system.login(memberId, password);
        currentUser = result.user;
        
        if (currentUser.role === 'Admin') {
            renderAdminDashboard();
        } else {
            renderMemberDashboard();
        }
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

function logout() {
    currentUser = null;
    renderLogin();
}

// Admin Dashboard
async function renderAdminDashboard() {
    const stats = await system.getDashboardStats();
    const deposits = system.getDeposits();
    const pendingDeposits = deposits.filter(d => d.status === 'Pending');
    const members = system.getMembers().filter(m => m.role === 'Member');
    
    app.innerHTML = `
    <header>
        <div class="logo">
            <i class="fas fa-building"></i>
            <div>
                <h1>Taqwa Property BD</h1>
                <span>Admin Dashboard</span>
            </div>
        </div>
        <div class="user-info">
            <span>Welcome, ${currentUser.name}</span>
            <button class="logout-btn" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </div>
    </header>
    
    <div class="tabs-container">
        <button class="tab-btn active" onclick="switchTab('admin-dashboard')">
            <i class="fas fa-chart-line"></i> Dashboard
        </button>
        <button class="tab-btn" onclick="switchTab('admin-members')">
            <i class="fas fa-users"></i> Members
        </button>
        <button class="tab-btn" onclick="switchTab('admin-deposits')">
            <i class="fas fa-money-check-alt"></i> Deposits
        </button>
        <button class="tab-btn" onclick="switchTab('admin-projects')">
            <i class="fas fa-project-diagram"></i> Projects
        </button>
        <button class="tab-btn" onclick="switchTab('admin-expenses')">
            <i class="fas fa-file-invoice-dollar"></i> Expenses
        </button>
        <button class="tab-btn" onclick="switchTab('admin-notifications')">
            <i class="fas fa-bell"></i> Notifications
        </button>
    </div>
    
    <div class="main-content">
        <!-- Dashboard Tab -->
        <div id="admin-dashboard" class="tab-content active">
            <div class="stats-grid">
                <div class="stat-item" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <div class="stat-value">${stats.totalMembers}</div>
                    <div class="stat-label">Total Members</div>
                </div>
                <div class="stat-item" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <div class="stat-value">৳${stats.totalDeposits.toLocaleString()}</div>
                    <div class="stat-label">Total Deposits</div>
                </div>
                <div class="stat-item" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <div class="stat-value">৳${stats.thisMonthDeposits.toLocaleString()}</div>
                    <div class="stat-label">This Month Deposits</div>
                </div>
                <div class="stat-item" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                    <div class="stat-value">${stats.activeProjects}</div>
                    <div class="stat-label">Active Projects</div>
                </div>
                <div class="stat-item" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                    <div class="stat-value">৳${stats.totalInvested.toLocaleString()}</div>
                    <div class="stat-label">Total Invested</div>
                </div>
                <div class="stat-item" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);">
                    <div class="stat-value">৳${stats.totalProfit.toLocaleString()}</div>
                    <div class="stat-label">Total Profit</div>
                </div>
                <div class="stat-item" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
                    <div class="stat-value">৳${stats.totalExpenses.toLocaleString()}</div>
                    <div class="stat-label">Total Expenses</div>
                </div>
                <div class="stat-item" style="background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);">
                    <div class="stat-value">${pendingDeposits.length}</div>
                    <div class="stat-label">Pending Deposits</div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-chart-bar"></i> Quick Actions</h3>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                    <button onclick="showAddProjectModal()" class="btn-success">
                        <i class="fas fa-plus"></i> Add New Project
                    </button>
                    <button onclick="showAddExpenseModal()" class="btn-warning">
                        <i class="fas fa-file-invoice"></i> Add Expense
                    </button>
                    <button onclick="showAddNotificationModal()" class="btn-secondary">
                        <i class="fas fa-bullhorn"></i> Send Notification
                    </button>
                    <button onclick="showAddMemberModal()" class="btn-success">
                        <i class="fas fa-user-plus"></i> Add Member
                    </button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-clock"></i> Pending Deposits (${pendingDeposits.length})</h3>
                </div>
                <div class="deposit-history">
                    ${pendingDeposits.length > 0 ? pendingDeposits.map(deposit => `
                    <div class="deposit-item pending">
                        <div class="deposit-info">
                            <h5>${deposit.memberName} (${deposit.memberId})</h5>
                            <div class="deposit-date">${deposit.month} • ${deposit.date}</div>
                            <div>Transaction: ${deposit.transactionId}</div>
                        </div>
                        <div>
                            <div class="deposit-amount">৳${deposit.amount}</div>
                            <div style="display: flex; gap: 10px; margin-top: 10px;">
                                <button onclick="approveDeposit('${deposit.depositId}')" class="btn-success" style="padding: 5px 15px;">
                                    <i class="fas fa-check"></i> Approve
                                </button>
                                <button onclick="rejectDeposit('${deposit.depositId}')" class="btn-danger" style="padding: 5px 15px;">
                                    <i class="fas fa-times"></i> Reject
                                </button>
                            </div>
                        </div>
                    </div>
                    `).join('') : '<p style="text-align: center; color: #666; padding: 20px;">No pending deposits</p>'}
                </div>
            </div>
        </div>
        
        <!-- Members Tab -->
        <div id="admin-members" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-users"></i> All Members (${members.length})</h3>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Member ID</th>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Total Shares</th>
                                <th>Monthly Deposit</th>
                                <th>Join Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${members.map(member => `
                            <tr>
                                <td><strong>${member.memberId}</strong></td>
                                <td>${member.name}</td>
                                <td>${member.mobile}</td>
                                <td>${member.totalShares.toLocaleString()}</td>
                                <td>৳${member.monthlyDeposit}</td>
                                <td>${member.joinDate}</td>
                                <td><span class="badge badge-member">Active</span></td>
                                <td>
                                    <button onclick="viewMemberDetails('${member.memberId}')" style="padding: 5px 10px; font-size: 0.9rem;">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Deposits Tab -->
        <div id="admin-deposits" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-history"></i> All Deposits</h3>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Deposit ID</th>
                                <th>Member</th>
                                <th>Amount</th>
                                <th>Month</th>
                                <th>Date</th>
                                <th>Transaction ID</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${deposits.map(deposit => `
                            <tr>
                                <td><strong>${deposit.depositId}</strong></td>
                                <td>${deposit.memberName}<br><small>${deposit.memberId}</small></td>
                                <td class="deposit-amount">৳${deposit.amount}</td>
                                <td>${deposit.month}</td>
                                <td>${deposit.date}</td>
                                <td>${deposit.transactionId}</td>
                                <td>
                                    ${deposit.status === 'Approved' ? 
                                        '<span class="badge badge-approved">Approved</span>' : 
                                        deposit.status === 'Pending' ? 
                                        '<span class="badge badge-pending">Pending</span>' : 
                                        '<span class="badge badge-rejected">Rejected</span>'
                                    }
                                </td>
                                <td>
                                    ${deposit.status === 'Pending' ? `
                                    <div style="display: flex; gap: 5px;">
                                        <button onclick="approveDeposit('${deposit.depositId}')" style="padding: 5px 10px; font-size: 0.9rem;">
                                            <i class="fas fa-check"></i>
                                        </button>
                                        <button onclick="rejectDeposit('${deposit.depositId}')" style="padding: 5px 10px; font-size: 0.9rem;">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                    ` : ''}
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <!-- Projects Tab -->
        <div id="admin-projects" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-project-diagram"></i> All Projects</h3>
                </div>
                <div class="project-list">
                    ${system.getProjects().map(project => `
                    <div class="project-card">
                        <div class="project-header">
                            <span class="project-id">${project.projectId}</span>
                            <span class="badge badge-approved">${project.status}</span>
                        </div>
                        <h4 style="margin-bottom: 15px;">${project.name}</h4>
                        <div style="margin-bottom: 10px;">
                            <strong>Investment: </strong>৳${project.totalInvestment.toLocaleString()}
                        </div>
                        <div style="margin-bottom: 10px;">
                            <strong>Current Value: </strong>৳${project.currentValue.toLocaleString()}
                        </div>
                        <div style="margin-bottom: 10px;">
                            <strong>Profit: </strong>
                            <span class="profit-amount">৳${project.profit.toLocaleString()}</span>
                        </div>
                        <div style="margin-bottom: 10px;">
                            <strong>Shares Issued: </strong>${project.sharesIssued.toLocaleString()}
                        </div>
                        <div style="margin-bottom: 10px;">
                            <strong>Share Value: </strong>৳${project.shareValue.toFixed(2)}
                        </div>
                        <div style="margin-bottom: 15px;">
                            <strong>Start Date: </strong>${project.startDate}
                        </div>
                        <button onclick="distributeProjectProfit('${project.projectId}')" class="btn-success" style="width: 100%;">
                            <i class="fas fa-money-bill-wave"></i> Distribute Profit
                        </button>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <!-- Expenses Tab -->
        <div id="admin-expenses" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-file-invoice-dollar"></i> All Expenses</h3>
                </div>
                <div class="voucher-list">
                    ${system.getExpenses().map(expense => `
                    <div class="voucher-item">
                        <div>
                            <div class="voucher-id">${expense.voucherId}</div>
                            <div>${expense.description}</div>
                            <div style="color: #666; font-size: 0.9rem;">${expense.date} • ${expense.category}</div>
                        </div>
                        <div class="voucher-amount">৳${expense.amount}</div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <!-- Notifications Tab -->
        <div id="admin-notifications" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-bullhorn"></i> Send Notification</h3>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-heading"></i> Notification Title</label>
                    <input type="text" id="notificationTitle" placeholder="Enter notification title">
                </div>
                <div class="form-group">
                    <label><i class="fas fa-envelope"></i> Message</label>
                    <textarea id="notificationMessage" rows="4" placeholder="Enter notification message"></textarea>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-filter"></i> Type</label>
                    <select id="notificationType">
                        <option value="General">General</option>
                        <option value="Financial">Financial</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Project">Project</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                </div>
                <button onclick="sendNotificationToAll()" style="width: 100%;">
                    <i class="fas fa-paper-plane"></i> Send to All Members
                </button>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-history"></i> Notification History</h3>
                </div>
                <div class="notification-list">
                    ${system.getNotifications().map(notification => `
                    <div class="notification-item">
                        <div class="notification-msg">
                            <strong>${notification.title}</strong> - ${notification.type}
                        </div>
                        <div>${notification.message}</div>
                        <div class="notification-time">${notification.date}</div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>`;
}

// Member Dashboard
async function renderMemberDashboard() {
    const memberStats = await system.getMemberStats(currentUser.memberId);
    const deposits = system.getDeposits().filter(d => d.memberId === currentUser.memberId);
    const notifications = system.getNotifications();
    
    app.innerHTML = `
    <header>
        <div class="logo">
            <i class="fas fa-user-circle"></i>
            <div>
                <h1>Taqwa Property BD</h1>
                <span>Member Portal</span>
            </div>
        </div>
        <div class="user-info">
            <span>${currentUser.name} (${currentUser.memberId})</span>
            <button class="logout-btn" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </div>
    </header>
    
    <div class="tabs-container">
        <button class="tab-btn active" onclick="switchTab('member-dashboard')">
            <i class="fas fa-home"></i> Dashboard
        </button>
        <button class="tab-btn" onclick="switchTab('member-deposit')">
            <i class="fas fa-hand-holding-usd"></i> Submit Deposit
        </button>
        <button class="tab-btn" onclick="switchTab('member-history')">
            <i class="fas fa-history"></i> Deposit History
        </button>
        <button class="tab-btn" onclick="switchTab('member-shares')">
            <i class="fas fa-chart-pie"></i> My Shares
        </button>
        <button class="tab-btn" onclick="switchTab('member-notifications')">
            <i class="fas fa-bell"></i> Notifications
            ${notifications.length > 0 ? `<span style="background: var(--danger); color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;">${notifications.length}</span>` : ''}
        </button>
    </div>
    
    <div class="main-content">
        <!-- Dashboard Tab -->
        <div id="member-dashboard" class="tab-content active">
            <div class="share-info">
                <div class="share-item">
                    <div class="share-value">${memberStats.totalShares.toLocaleString()}</div>
                    <div class="share-label">Total Shares</div>
                </div>
                <div class="share-item">
                    <div class="share-value">৳${memberStats.shareValue.toFixed(2)}</div>
                    <div class="share-label">Current Share Value</div>
                </div>
                <div class="share-item">
                    <div class="share-value">৳${memberStats.shareWorth.toLocaleString()}</div>
                    <div class="share-label">Share Worth</div>
                </div>
                <div class="share-item">
                    <div class="share-value">৳${memberStats.totalProfit.toLocaleString()}</div>
                    <div class="share-label">Total Profit Received</div>
                </div>
            </div>
            
            <div class="stats-grid">
                <div class="stat-item" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <div class="stat-value">৳${memberStats.totalDeposited.toLocaleString()}</div>
                    <div class="stat-label">Total Deposited</div>
                </div>
                <div class="stat-item" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <div class="stat-value">৳${memberStats.thisMonthDeposit.toLocaleString()}</div>
                    <div class="stat-label">This Month Deposit</div>
                </div>
                <div class="stat-item" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                    <div class="stat-value">${memberStats.pendingDeposits}</div>
                    <div class="stat-label">Pending Deposits</div>
                </div>
                <div class="stat-item" style="background: ${memberStats.dueAmount > 0 ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'};">
                    <div class="stat-value">৳${memberStats.dueAmount.toLocaleString()}</div>
                    <div class="stat-label">Due Amount</div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-user-circle"></i> My Information</h3>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <div>
                        <p><strong>Member ID:</strong> ${currentUser.memberId}</p>
                        <p><strong>Name:</strong> ${currentUser.name}</p>
                        <p><strong>Mobile:</strong> ${currentUser.mobile}</p>
                        <p><strong>Email:</strong> ${currentUser.email || 'N/A'}</p>
                    </div>
                    <div>
                        <p><strong>Monthly Deposit:</strong> ৳${currentUser.monthlyDeposit}</p>
                        <p><strong>Join Date:</strong> ${currentUser.joinDate}</p>
                        <p><strong>Total Shares:</strong> ${memberStats.totalShares.toLocaleString()}</p>
                        <p><strong>Status:</strong> <span class="badge badge-member">Active</span></p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Submit Deposit Tab -->
        <div id="member-deposit" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-hand-holding-usd"></i> Submit Monthly Deposit</h3>
                </div>
                <p style="color: #666; margin-bottom: 20px;">Submit your monthly deposit. After submission, admin will verify and approve.</p>
                
                <div class="form-group">
                    <label><i class="fas fa-calendar-alt"></i> Month</label>
                    <select id="depositMonth">
                        <option value="">Select Month</option>
                        ${generateMonthOptions()}
                    </select>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-money-bill-wave"></i> Amount (৳)</label>
                    <input type="number" id="depositAmount" value="${currentUser.monthlyDeposit}" min="500">
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-university"></i> Payment Method</label>
                    <select id="paymentMethod" onchange="toggleBankField()">
                        <option value="Bkash">Bkash</option>
                        <option value="Nagad">Nagad</option>
                        <option value="Rocket">Rocket</option>
                        <option value="Bank">Bank Transfer</option>
                        <option value="Cash">Cash</option>
                    </select>
                </div>
                
                <div class="form-group" id="bankField" style="display: none;">
                    <label><i class="fas fa-landmark"></i> Bank Name</label>
                    <input type="text" id="bankName" placeholder="Enter bank name">
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-receipt"></i> Transaction ID</label>
                    <input type="text" id="transactionId" placeholder="Enter transaction ID">
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-file-invoice"></i> Deposit Slip No.</label>
                    <input type="text" id="slipNumber" placeholder="Enter deposit slip number">
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-sticky-note"></i> Notes (Optional)</label>
                    <textarea id="depositNotes" rows="3" placeholder="Any additional information"></textarea>
                </div>
                
                <button onclick="submitMemberDeposit()" style="width: 100%;">
                    <i class="fas fa-paper-plane"></i> Submit Deposit
                </button>
                
                <div id="depositMessage" class="success" style="display: none;"></div>
            </div>
        </div>
        
        <!-- Deposit History Tab -->
        <div id="member-history" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-history"></i> My Deposit History</h3>
                </div>
                <div class="deposit-history">
                    ${deposits.length > 0 ? deposits.map(deposit => `
                    <div class="deposit-item ${deposit.status === 'Approved' ? '' : deposit.status === 'Pending' ? 'pending' : 'rejected'}">
                        <div class="deposit-info">
                            <h5>${deposit.month}</h5>
                            <div class="deposit-date">${deposit.date}</div>
                            <div>${deposit.transactionId} • ${deposit.bankName}</div>
                            ${deposit.status === 'Pending' ? '<div style="color: var(--warning); font-size: 0.9rem;"><i class="fas fa-clock"></i> Waiting for admin approval</div>' : ''}
                        </div>
                        <div>
                            <div class="deposit-amount">৳${deposit.amount}</div>
                            <div style="margin-top: 5px;">
                                ${deposit.status === 'Approved' ? 
                                    '<span class="badge badge-approved"><i class="fas fa-check"></i> Approved</span>' : 
                                    deposit.status === 'Pending' ? 
                                    '<span class="badge badge-pending"><i class="fas fa-clock"></i> Pending</span>' : 
                                    '<span class="badge badge-rejected"><i class="fas fa-times"></i> Rejected</span>'
                                }
                            </div>
                        </div>
                    </div>
                    `).join('') : '<p style="text-align: center; color: #666; padding: 20px;">No deposit history found</p>'}
                </div>
            </div>
        </div>
        
        <!-- My Shares Tab -->
        <div id="member-shares" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-chart-pie"></i> My Shares & Profit</h3>
                </div>
                <div style="padding: 20px; background: #f8f9fa; border-radius: 10px; margin-bottom: 20px;">
                    <h4 style="color: var(--primary); margin-bottom: 15px;">Share Information</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div>
                            <div style="font-size: 0.9rem; color: #666;">Total Shares</div>
                            <div style="font-size: 1.5rem; font-weight: 700;">${memberStats.totalShares.toLocaleString()}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.9rem; color: #666;">Current Share Value</div>
                            <div style="font-size: 1.5rem; font-weight: 700;">৳${memberStats.shareValue.toFixed(2)}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.9rem; color: #666;">Total Share Worth</div>
                            <div style="font-size: 1.5rem; font-weight: 700;">৳${memberStats.shareWorth.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <h4 style="color: var(--primary); margin-bottom: 15px;">Profit History</h4>
                    ${system.getProfits().filter(p => p.memberId === currentUser.memberId).map(profit => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border: 1px solid #eee; border-radius: 8px; margin-bottom: 10px;">
                        <div>
                            <div style="font-weight: 600;">Project: ${profit.projectId}</div>
                            <div style="color: #666; font-size: 0.9rem;">${profit.date} • ${profit.shares} shares</div>
                        </div>
                        <div>
                            <div style="font-size: 1.2rem; font-weight: 700; color: var(--success);">৳${profit.amount}</div>
                            <div style="text-align: right; color: #666; font-size: 0.9rem;">৳${profit.perShareProfit}/share</div>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <!-- Notifications Tab -->
        <div id="member-notifications" class="tab-content">
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-bell"></i> Notifications</h3>
                </div>
                <div class="notification-list">
                    ${notifications.map(notification => `
                    <div class="notification-item">
                        <div class="notification-msg">
                            <strong>${notification.title}</strong>
                        </div>
                        <div>${notification.message}</div>
                        <div class="notification-time">
                            <i class="far fa-clock"></i> ${notification.date} • ${notification.type}
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>`;
}

// Utility Functions
function switchTab(tabId) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected tab
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
    
    currentTab = tabId;
}

function generateMonthOptions() {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const monthName = date.toLocaleString('bn-BD', { month: 'long', year: 'numeric' });
        months.push(`<option value="${monthName}">${monthName}</option>`);
    }
    
    return months.join('');
}

function toggleBankField() {
    const method = document.getElementById('paymentMethod').value;
    const bankField = document.getElementById('bankField');
    bankField.style.display = method === 'Bank' ? 'block' : 'none';
}

// Member Functions
async function submitMemberDeposit() {
    const month = document.getElementById('depositMonth').value;
    const amount = document.getElementById('depositAmount').value;
    const method = document.getElementById('paymentMethod').value;
    const transactionId = document.getElementById('transactionId').value;
    const slipNumber = document.getElementById('slipNumber').value;
    const bankName = method === 'Bank' ? document.getElementById('bankName').value : method;
    const notes = document.getElementById('depositNotes').value;
    
    const messageDiv = document.getElementById('depositMessage');
    messageDiv.style.display = 'none';
    
    if (!month || !amount || !transactionId) {
        messageDiv.textContent = 'Please fill all required fields';
        messageDiv.className = 'error';
        messageDiv.style.display = 'block';
        return;
    }
    
    try {
        const result = await system.submitDeposit({
            memberId: currentUser.memberId,
            amount: parseFloat(amount),
            month: month,
            transactionId: transactionId,
            bankName: bankName,
            slipNumber: slipNumber,
            type: 'Monthly Deposit',
            notes: notes
        });
        
        messageDiv.textContent = `Deposit submitted successfully! Your Deposit ID: ${result.deposit.depositId}`;
        messageDiv.className = 'success';
        messageDiv.style.display = 'block';
        
        // Clear form
        document.getElementById('transactionId').value = '';
        document.getElementById('slipNumber').value = '';
        document.getElementById('depositNotes').value = '';
        
        // Refresh dashboard
        setTimeout(() => {
            renderMemberDashboard();
            switchTab('member-history');
        }, 2000);
        
    } catch (error) {
        messageDiv.textContent = error.message;
        messageDiv.className = 'error';
        messageDiv.style.display = 'block';
    }
}

// Admin Functions
async function approveDeposit(depositId) {
    if (confirm('Are you sure you want to approve this deposit?')) {
        try {
            await system.approveDeposit(depositId);
            alert('Deposit approved successfully!');
            renderAdminDashboard();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

async function rejectDeposit(depositId) {
    if (confirm('Are you sure you want to reject this deposit?')) {
        try {
            await system.rejectDeposit(depositId);
            alert('Deposit rejected!');
            renderAdminDashboard();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

async function sendNotificationToAll() {
    const title = document.getElementById('notificationTitle').value;
    const message = document.getElementById('notificationMessage').value;
    const type = document.getElementById('notificationType').value;
    
    if (!title || !message) {
        alert('Please enter title and message');
        return;
    }
    
    try {
        await system.addNotification(title, message, type);
        alert('Notification sent to all members!');
        
        // Clear form
        document.getElementById('notificationTitle').value = '';
        document.getElementById('notificationMessage').value = '';
        
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function distributeProjectProfit(projectId) {
    const project = system.getProjects().find(p => p.projectId === projectId);
    if (!project) return;
    
    const profitPerShare = project.profit / project.sharesIssued;
    const members = system.getMembers().filter(m => m.role === 'Member');
    
    // Distribute profit to all members based on shares
    members.forEach(async member => {
        const memberProfit = profitPerShare * (member.totalShares || 0);
        if (memberProfit > 0) {
            const profits = system.getProfits();
            profits.push({
                id: 'PROFIT' + (profits.length + 1).toString().padStart(3, '0'),
                projectId: projectId,
                memberId: member.memberId,
                amount: memberProfit,
                date: new Date().toISOString().split('T')[0],
                shares: member.totalShares || 0,
                perShareProfit: profitPerShare
            });
            localStorage.setItem('taqwa_profits', JSON.stringify(profits));
        }
    });
    
    alert(`Profit distributed successfully! ${profitPerShare.toFixed(2)}৳ per share`);
}

// Modal Functions
function showAddProjectModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-plus"></i> Add New Project</h3>
                <button class="close-modal" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="form-group">
                <label>Project Name</label>
                <input type="text" id="projectName" placeholder="Enter project name">
            </div>
            <div class="form-group">
                <label>Total Investment (৳)</label>
                <input type="number" id="projectInvestment" placeholder="Enter investment amount">
            </div>
            <div class="form-group">
                <label>Current Value (৳)</label>
                <input type="number" id="projectCurrentValue" placeholder="Enter current value">
            </div>
            <div class="form-group">
                <label>Shares Issued</label>
                <input type="number" id="projectShares" placeholder="Enter number of shares">
            </div>
            <div class="form-group">
                <label>Start Date</label>
                <input type="date" id="projectStartDate" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <button onclick="addNewProject()" style="width: 100%;">
                <i class="fas fa-save"></i> Save Project
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

async function addNewProject() {
    const name = document.getElementById('projectName').value;
    const investment = document.getElementById('projectInvestment').value;
    const currentValue = document.getElementById('projectCurrentValue').value;
    const shares = document.getElementById('projectShares').value;
    const startDate = document.getElementById('projectStartDate').value;
    
    if (!name || !investment || !currentValue || !shares) {
        alert('Please fill all fields');
        return;
    }
    
    const profit = parseFloat(currentValue) - parseFloat(investment);
    const shareValue = parseFloat(currentValue) / parseFloat(shares);
    
    try {
        await system.addProject({
            name: name,
            totalInvestment: parseFloat(investment),
            currentValue: parseFloat(currentValue),
            profit: profit,
            sharesIssued: parseInt(shares),
            shareValue: shareValue,
            startDate: startDate
        });
        
        alert('Project added successfully!');
        document.querySelector('.modal-overlay').remove();
        renderAdminDashboard();
        
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function showAddExpenseModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-file-invoice"></i> Add Expense</h3>
                <button class="close-modal" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" id="expenseDescription" placeholder="Enter expense description">
            </div>
            <div class="form-group">
                <label>Amount (৳)</label>
                <input type="number" id="expenseAmount" placeholder="Enter amount">
            </div>
            <div class="form-group">
                <label>Category</label>
                <select id="expenseCategory">
                    <option value="Office Expense">Office Expense</option>
                    <option value="Legal Expense">Legal Expense</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Others">Others</option>
                </select>
            </div>
            <div class="form-group">
                <label>Date</label>
                <input type="date" id="expenseDate" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <button onclick="addNewExpense()" style="width: 100%;">
                <i class="fas fa-save"></i> Save Expense
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

async function addNewExpense() {
    const description = document.getElementById('expenseDescription').value;
    const amount = document.getElementById('expenseAmount').value;
    const category = document.getElementById('expenseCategory').value;
    const date = document.getElementById('expenseDate').value;
    
    if (!description || !amount) {
        alert('Please fill all required fields');
        return;
    }
    
    try {
        await system.addExpense({
            description: description,
            amount: parseFloat(amount),
            category: category,
            date: date,
            approvedBy: currentUser.memberId
        });
        
        alert('Expense added successfully!');
        document.querySelector('.modal-overlay').remove();
        renderAdminDashboard();
        
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function showAddNotificationModal() {
    // This will switch to notifications tab and focus on the form
    switchTab('admin-notifications');
    document.getElementById('notificationTitle').focus();
}

function showAddMemberModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-user-plus"></i> Add New Member</h3>
                <button class="close-modal" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="newMemberName" placeholder="Enter full name">
            </div>
            <div class="form-group">
                <label>Mobile Number</label>
                <input type="text" id="newMemberMobile" placeholder="Enter mobile number">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="newMemberEmail" placeholder="Enter email address">
            </div>
            <div class="form-group">
                <label>NID Number</label>
                <input type="text" id="newMemberNid" placeholder="Enter NID number">
            </div>
            <div class="form-group">
                <label>Monthly Deposit (৳)</label>
                <input type="number" id="newMemberDeposit" value="5000">
            </div>
            <div class="form-group">
                <label>Initial Shares</label>
                <input type="number" id="newMemberShares" value="1000">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="newMemberPassword" value="123456">
            </div>
            <button onclick="addNewMember()" style="width: 100%;">
                <i class="fas fa-user-plus"></i> Add Member
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}

async function addNewMember() {
    const name = document.getElementById('newMemberName').value;
    const mobile = document.getElementById('newMemberMobile').value;
    const email = document.getElementById('newMemberEmail').value;
    const nid = document.getElementById('newMemberNid').value;
    const deposit = document.getElementById('newMemberDeposit').value;
    const shares = document.getElementById('newMemberShares').value;
    const password = document.getElementById('newMemberPassword').value;
    
    if (!name || !mobile || !password) {
        alert('Please fill all required fields');
        return;
    }
    
    const members = system.getMembers();
    const newMemberId = 'MEM' + (members.filter(m => m.role === 'Member').length + 1).toString().padStart(3, '0');
    
    const newMember = {
        memberId: newMemberId,
        name: name,
        mobile: mobile,
        password: password,
        role: 'Member',
        joinDate: new Date().toISOString().split('T')[0],
        totalShares: parseInt(shares),
        monthlyDeposit: parseInt(deposit),
        email: email,
        nid: nid
    };
    
    members.push(newMember);
    localStorage.setItem('taqwa_members', JSON.stringify(members));
    
    alert(`Member added successfully! Member ID: ${newMemberId}`);
    document.querySelector('.modal-overlay').remove();
    renderAdminDashboard();
}

function viewMemberDetails(memberId) {
    const member = system.getMembers().find(m => m.memberId === memberId);
    if (!member) return;
    
    const deposits = system.getDeposits().filter(d => d.memberId === memberId);
    const totalDeposited = deposits.filter(d => d.status === 'Approved').reduce((sum, d) => sum + d.amount, 0);
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-user"></i> Member Details</h3>
                <button class="close-modal" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 2rem; background: var(--primary); color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
                    ${member.name.charAt(0)}
                </div>
                <h3>${member.name}</h3>
                <p style="color: #666;">${member.memberId}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                        <div style="font-size: 0.9rem; color: #666;">Mobile</div>
                        <div style="font-weight: 600;">${member.mobile}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.9rem; color: #666;">Email</div>
                        <div style="font-weight: 600;">${member.email || 'N/A'}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.9rem; color: #666;">Join Date</div>
                        <div style="font-weight: 600;">${member.joinDate}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.9rem; color: #666;">Monthly Deposit</div>
                        <div style="font-weight: 600;">৳${member.monthlyDeposit}</div>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 style="margin-bottom: 15px;">Financial Summary</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div style="text-align: center; padding: 15px; background: white; border: 1px solid #eee; border-radius: 8px;">
                        <div style="font-size: 0.9rem; color: #666;">Total Deposited</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">৳${totalDeposited.toLocaleString()}</div>
                    </div>
                    <div style="text-align: center; padding: 15px; background: white; border: 1px solid #eee; border-radius: 8px;">
                        <div style="font-size: 0.9rem; color: #666;">Total Shares</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${member.totalShares.toLocaleString()}</div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px;">
                <button onclick="this.parentElement.parentElement.remove()" style="width: 100%;">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Initialize the application
function initApp() {
    renderLogin();
}

// Start the application
initApp();
