(() => {
    'use strict';

    const DB_KEYS = {
        users: 'ccsk_users',
        sessions: 'ccsk_sessions',
        speakers: 'ccsk_speakers',
        exhibitors: 'ccsk_exhibitors',
        posters: 'ccsk_posters',
        votes: 'ccsk_votes',
        lostfound: 'ccsk_lostfound',
        checkins: 'ccsk_checkins',
        myschedule: 'ccsk_myschedule',
        notifications: 'ccsk_notifications',
        settings: 'ccsk_settings',
        leads: 'ccsk_leads',
        polls: 'ccsk_polls',
        pollResponses: 'ccsk_poll_responses'
    };

    const CONFERENCE = {
        name: '13th CCSK Annual Scientific Conference',
        dates: 'May 13-15, 2026',
        venue: 'Argyles Grand Hotel, Nairobi',
        theme: 'Frugal Innovation: Evidence-Based, Locally Driven Solutions for a Global Future'
    };

    const DATES = { 1: '2026-05-13', 2: '2026-05-14', 3: '2026-05-15' };

    let currentUser = null;
    let currentView = 'home';
    let selectedDay = 1;
    let notificationPermission = 'default';

    const db = {
        get: (key) => {
            try { return JSON.parse(localStorage.getItem(key) || '[]'); }
            catch { return []; }
        },
        set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
        getSettings: () => JSON.parse(localStorage.getItem(DB_KEYS.settings) || '{}'),
        setSettings: (data) => localStorage.setItem(DB_KEYS.settings, JSON.stringify(data))
    };

    function init() {
        try {
            console.log('Initializing app...');
            const settings = db.getSettings();
            if (!settings || Object.keys(settings).length === 0) {
                loadDefaultSchedule();
                loadDefaultSpeakers();
                loadDefaultPosters();
                loadExhibitors();
            }
            console.log('Checking auth...');
            checkAuth();
            setupRouter();
            setupEventListeners();
            requestNotificationPermission();
            checkSessionReminders();
            
            setTimeout(() => applySettings(settings), 100);
            console.log('App initialized');
        } catch (e) {
            console.error('Init error:', e);
            alert('Error loading app: ' + e.message);
        }
    }

    function loadDefaultSchedule() {
        // No pre-loaded data - admin uploads from CSV
        if (!localStorage.getItem(DB_KEYS.sessions)) {
            db.set(DB_KEYS.sessions, []);
        }
    }

    function loadDefaultSpeakers() {
        // No pre-loaded data - admin adds manually
        if (!localStorage.getItem(DB_KEYS.speakers)) {
            db.set(DB_KEYS.speakers, []);
        }
    }

    function loadDefaultPosters() {
        // No pre-loaded data - admin adds manually
        if (!localStorage.getItem(DB_KEYS.posters)) {
            db.set(DB_KEYS.posters, []);
        }
    }

    function loadExhibitors() {
        // No pre-loaded data - admin adds manually
        if (!localStorage.getItem(DB_KEYS.exhibitors)) {
            db.set(DB_KEYS.exhibitors, []);
        }
    }

    function checkAuth() {
        try {
            const user = JSON.parse(localStorage.getItem('ccsk_current_user'));
            // Validate user exists in users array or is admin
            const users = db.get(DB_KEYS.users);
            const validUser = user && (user.id === 'admin' || users.some(u => u.id === user.id));
            
            if (validUser) {
                currentUser = user;
                showMainApp();
            } else {
                localStorage.removeItem('ccsk_current_user');
                showAuth();
            }
        } catch (e) {
            localStorage.removeItem('ccsk_current_user');
            showAuth();
        }
    }

    function showAuth() {
        document.getElementById('auth-screen').classList.remove('d-none');
        document.getElementById('main-screen').classList.add('d-none');
    }

    function showMainApp() {
        document.getElementById('auth-screen').classList.add('d-none');
        document.getElementById('main-screen').classList.remove('d-none');
        document.getElementById('user-name').textContent = currentUser.name;
        if (currentUser.role === 'admin') {
            document.getElementById('admin-nav').style.display = 'block';
        }
        router.navigate('home');
    }

    const router = {
        navigate: (hash) => {
            const view = hash.replace('#', '') || 'home';
            currentView = view;
            document.querySelectorAll('.view').forEach(v => v.classList.add('d-none'));
            document.getElementById(`view-${view}`)?.classList.remove('d-none');
            document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
            document.querySelector(`.sidebar .nav-link[href="#${view}"]`)?.classList.add('active');
            renderView(view);
            window.location.hash = view;
        }
    };

    function renderView(view) {
        const views = {
            home: renderHome,
            schedule: renderSchedule,
            myschedule: renderMySchedule,
            speakers: renderSpeakers,
            exhibitors: renderExhibitors,
            floorplan: renderFloorPlan,
            posters: renderPosters,
            attendees: renderAttendees,
            leads: renderLeads,
            polls: renderPolls,
            lostfound: renderLostFound,
            profile: renderProfile,
            admin: renderAdmin
        };
        views[view]?.();
    }

    function renderHome() {
        const sessions = db.get(DB_KEYS.sessions).filter(s => s.day === 1).slice(0, 5);
        const container = document.getElementById('home-sessions');
        container.innerHTML = sessions.map(s => `
            <div class="list-group-item session-card session-${s.track}">
                <div class="d-flex justify-content-between">
                    <div>
                        <strong>${s.title}</strong>
                        <br><small>${s.startTime} - ${s.endTime} | ${s.room}</small>
                    </div>
                    <span class="badge session-track">${s.track === 'all' ? 'All' : 'Track ' + s.track}</span>
                </div>
            </div>
        `).join('');
    }

    function renderSchedule() {
        // Generate day tabs dynamically
        const settings = db.getSettings();
        const days = settings?.days || 3;
        const dayTabs = document.getElementById('day-tabs');
        if (dayTabs) {
            dayTabs.innerHTML = '';
            for (let d = 1; d <= days; d++) {
                const date = settings?.startDate ? new Date(new Date(settings.startDate).getTime() + (d-1)*86400000).toLocaleDateString('en-US', {month:'short', day:'numeric'}) : `May ${12 + d}`;
                const btn = document.createElement('button');
                btn.className = `nav-link ${d === selectedDay ? 'active' : ''}`;
                btn.dataset.day = d;
                btn.textContent = `Day ${d}: ${date}`;
                dayTabs.appendChild(btn);
            }
            
            // Re-attach event listeners
            dayTabs.querySelectorAll('.nav-link').forEach(tab => {
                tab.addEventListener('click', () => {
                    dayTabs.querySelectorAll('.nav-link').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    selectedDay = parseInt(tab.dataset.day);
                    renderSchedule();
                });
            });
        }
        
        const sessions = db.get(DB_KEYS.sessions).filter(s => s.day === selectedDay);
        const showA = document.getElementById('track-a')?.checked ?? true;
        const showB = document.getElementById('track-b')?.checked ?? true;
        const showC = document.getElementById('track-c')?.checked ?? true;
        const showPlenary = document.getElementById('track-plenary')?.checked ?? true;
        
        const filtered = sessions.filter(s => {
            if (s.track === 'A' && !showA) return false;
            if (s.track === 'B' && !showB) return false;
            if (s.track === 'C' && !showC) return false;
            if (s.track === 'all' && !showPlenary) return false;
            return true;
        }).sort((a, b) => a.startTime.localeCompare(b.startTime));

        // Generate track filters dynamically
        const trackFilters = document.getElementById('track-filters');
        if (trackFilters) {
            const tracks = settings?.tracks || 3;
            let filtersHTML = '<div class="btn-group" role="group">';
            for (let t = 1; t <= tracks; t++) {
                filtersHTML += `<input type="checkbox" class="btn-check" id="track-${String.fromCharCode(64+t)}" checked><label class="btn btn-outline-primary btn-sm" for="track-${String.fromCharCode(64+t)}">Track ${String.fromCharCode(64+t)}</label>`;
            }
            filtersHTML += '<input type="checkbox" class="btn-check" id="track-plenary" checked><label class="btn btn-outline-primary btn-sm" for="track-plenary">Plenary</label>';
            filtersHTML += '</div>';
            trackFilters.innerHTML = filtersHTML;
            
            // Re-attach event listeners
            trackFilters.querySelectorAll('.btn-check').forEach(cb => {
                cb.addEventListener('change', renderSchedule);
            });
        }

        const container = document.getElementById('schedule-container');
        container.innerHTML = filtered.map(s => {
            const isFav = db.get(DB_KEYS.myschedule).some(m => m.userId === currentUser?.id && m.sessionId === s.id);
            return `
                <div class="card session-card session-${s.type === 'plenary' ? 'plenary' : s.track.toLowerCase()} mb-2">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1">${s.title}</h6>
                                <p class="mb-1"><small>${s.speaker || 'N/A'}</small></p>
                                <p class="mb-0"><small><i class="fas fa-clock"></i> ${s.startTime} - ${s.endTime} | <i class="fas fa-map-marker"></i> ${s.room}</small></p>
                            </div>
                            <div class="text-end">
                                <span class="badge session-track">${s.track === 'all' ? 'All' : 'Track ' + s.track}</span>
                                <button class="btn-favorite ${isFav ? 'active' : ''}" onclick="app.toggleFavorite(${s.id})">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderMySchedule() {
        const mySched = db.get(DB_KEYS.myschedule).filter(m => m.userId === currentUser?.id);
        const sessions = db.get(DB_KEYS.sessions);
        const container = document.getElementById('my-schedule-container');
        
        if (mySched.length === 0) {
            container.innerHTML = '<p class="text-muted">No sessions saved yet.</p>';
            return;
        }

        container.innerHTML = mySched.map(m => {
            const s = sessions.find(s => s.id === m.sessionId);
            if (!s) return '';
            return `
                <div class="card session-card mb-2">
                    <div class="card-body">
                        <h6>${s.title}</h6>
                        <p><small>${s.startTime} - ${s.endTime} | ${s.room}</small></p>
                        <button class="btn btn-sm btn-outline-danger" onclick="app.removeFavorite(${s.id})"><i class="fas fa-trash"></i> Remove</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderSpeakers() {
        const speakers = db.get(DB_KEYS.speakers);
        const container = document.getElementById('speakers-container');
        container.innerHTML = speakers.map(s => `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center" style="width:50px;height:50px">
                                <span class="text-white fw-bold">${s.name.charAt(0)}</span>
                            </div>
                            <div class="ms-2">
                                <h6 class="mb-0">${s.name}</h6>
                                <small class="text-muted">${s.title}</small>
                            </div>
                        </div>
                        <p class="mb-0"><small>${s.organization}</small></p>
                        <p><small>${s.bio}</small></p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderExhibitors() {
        const exhibitors = db.get(DB_KEYS.exhibitors);
        const tiers = ['platinum', 'gold', 'silver', 'bronze'];
        tiers.forEach(tier => {
            const container = document.getElementById(`exhibitors-${tier}`);
            const items = exhibitors.filter(e => e.tier === tier);
            
            if (items.length === 0) {
                container.innerHTML = tier === 'bronze' ? '' : 
                    `<h6 class="text-uppercase text-muted">${tier} Sponsors</h6><p class="text-muted">No ${tier} sponsors yet.</p>`;
                return;
            }
            
            container.innerHTML = `<h6 class="text-uppercase text-muted">${tier} Sponsors</h6>
                <div class="row g-3">
                    ${items.map(e => `
                        <div class="col-md-6">
                            <div class="card exhibitor-card ${tier}">
                                <div class="card-body">
                                    <h6>${e.company}</h6>
                                    <p><small>${e.description || 'N/A'}</small></p>
                                    <p><small><i class="fas fa-map-marker"></i> ${e.booth || 'N/A'}</small></p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>`;
        });
    }

    function renderFloorPlan() {
        document.querySelectorAll('.room').forEach(room => {
            room.onclick = () => {
                document.getElementById('room-info').innerHTML = `
                    <div class="alert alert-info">
                        <h6>${room.dataset.room}</h6>
                        <p>Click to see sessions in this room</p>
                    </div>
                `;
            };
        });
    }

    function renderPosters() {
        const posters = db.get(DB_KEYS.posters);
        const category = document.getElementById('poster-category-filter').value;
        const filtered = category ? posters.filter(p => p.category === category) : posters;
        const userVotes = db.get(DB_KEYS.votes).filter(v => v.userId === currentUser?.id).map(v => v.posterId);
        
        document.getElementById('posters-container').innerHTML = filtered.map(p => `
            <div class="col-md-6">
                <div class="card poster-card">
                    <div class="card-body">
                        <h6>${p.title}</h6>
                        <p><small>${p.author}</small></p>
                        <span class="badge bg-secondary">${p.category}</span>
                        <p class="mt-2">${p.abstract}</p>
                        <button class="btn btn-sm ${userVotes.includes(p.id) ? 'poster-vote-btn voted' : 'btn-outline-primary poster-vote-btn'}" 
                            onclick="app.votePoster(${p.id})" ${userVotes.includes(p.id) ? 'disabled' : ''}>
                            <i class="fas fa-thumbs-up"></i> ${p.votes} votes
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        const totalVotes = db.get(DB_KEYS.votes).length;
        document.getElementById('poster-votes').innerHTML = `<small class="text-muted">Total votes: ${totalVotes}</small>`;
    }

    function renderAttendees() {
        const users = db.get(DB_KEYS.users);
        const search = document.getElementById('attendee-search')?.value?.toLowerCase() || '';
        const filtered = users.filter(u => u.name?.toLowerCase().includes(search) || u.email?.toLowerCase().includes(search) || u.organization?.toLowerCase().includes(search));
        
        document.getElementById('attendees-container').innerHTML = filtered.map(u => `
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h6>${u.name}</h6>
                        <p><small>${u.email}</small></p>
                        <p><small>${u.organization || ''}</small></p>
                        <span class="badge bg-primary">${u.type}</span>
                    </div>
                </div>
            </div>
        `).join('') || '<p class="text-muted">No attendees yet</p>';
    }

    function renderLeads() {
        const leads = db.get(DB_KEYS.leads);
        document.getElementById('leads-container').innerHTML = leads.length ? leads.map(l => `
            <div class="border-bottom py-2">
                <strong>${l.name}</strong><br>
                <small>${l.email} | ${l.organization}</small><br>
                <small class="text-muted">Collected: ${new Date(l.collectedAt).toLocaleString()}</small>
            </div>
        `).join('') : '<p class="text-muted">No leads collected yet</p>';
    }

    function renderPolls() {
        const polls = db.get(DB_KEYS.polls);
        const responses = db.get(DB_KEYS.pollResponses);
        const activePolls = document.getElementById('active-polls');
        
        activePolls.innerHTML = polls.filter(p => p.active).length ? 
            `<span class="badge bg-success">${polls.filter(p => p.active).length} Active Poll(s)</span>` : '';
        
        document.getElementById('polls-container').innerHTML = polls.map(p => {
            const pollResponses = responses.filter(r => r.pollId === p.id);
            const options = p.options.map(o => {
                const count = pollResponses.filter(r => r.answer === o).length;
                const pct = pollResponses.length ? Math.round(count / pollResponses.length * 100) : 0;
                return `<div class="mb-2">
                    <div class="d-flex justify-content-between"><small>${o}</small><small>${count} votes (${pct}%)</small></div>
                    <div class="progress mb-2" style="height:20px">
                        <div class="progress-bar" style="width:${pct}%">${pct > 10 ? pct + '%' : ''}</div>
                    </div>
                </div>`;
            }).join('');
            
            return `<div class="card mb-3">
                <div class="card-header d-flex justify-content-between">
                    <strong>${p.question}</strong>
                    <button class="btn btn-sm btn-${p.active ? 'danger' : 'success'}" onclick="app.togglePoll(${p.id})">
                        ${p.active ? 'Close' : 'Open'}
                    </button>
                </div>
                <div class="card-body">
                    ${options}
                    <button class="btn btn-outline-primary btn-sm mt-2" onclick="app.votePoll(${p.id})">Vote</button>
                </div>
            </div>`;
        }).join('') || '<p class="text-muted">No polls yet</p>';
    }

    function renderLostFound() {
        const type = document.querySelector('#view-lostfound .nav-link.active')?.dataset.type || 'lost';
        const items = db.get(DB_KEYS.lostfound).filter(i => i.type === type);
        const container = document.getElementById('lostfound-container');
        
        if (items.length === 0) {
            container.innerHTML = `<p class="text-muted">No ${type} items found.</p>`;
            return;
        }

        container.innerHTML = items.map(i => `
            <div class="card lostfound-item ${type} mb-2">
                <div class="card-body">
                    <h6>${i.description}</h6>
                    <p><small>Contact: ${i.contact}</small></p>
                    <span class="badge bg-${type === 'lost' ? 'danger' : 'success'}">${type.toUpperCase()}</span>
                    <span class="badge bg-${i.status === 'claimed' ? 'secondary' : 'warning'}">${i.status || 'open'}</span>
                </div>
            </div>
        `).join('');
    }

    function renderProfile() {
        document.getElementById('profile-name').textContent = currentUser.name;
        document.getElementById('profile-org').textContent = currentUser.organization || '';
        document.getElementById('profile-type').textContent = currentUser.type;

        const qrContainer = document.getElementById('qrcode-display');
        qrContainer.innerHTML = '';
        new QRCode(qrContainer, {
            text: `CCSK2026-${currentUser.id}-${currentUser.email}`,
            width: 150,
            height: 150
        });

        const checkins = db.get(DB_KEYS.checkins).filter(c => c.userId === currentUser.id);
        document.getElementById('checkin-history').innerHTML = checkins.length ? 
            checkins.map(c => `<p><small>${new Date(c.timestamp).toLocaleString()}</small> - ${c.sessionTitle || 'Check-in'}</p>`).join('') :
            '<p class="text-muted">No check-ins yet.</p>';
    }

    function renderAdmin() {
        document.getElementById('stat-attendees').textContent = db.get(DB_KEYS.users).length;
        document.getElementById('stat-checkins').textContent = db.get(DB_KEYS.checkins).length;
        document.getElementById('stat-sessions').textContent = db.get(DB_KEYS.sessions).length;
        document.getElementById('stat-votes').textContent = db.get(DB_KEYS.votes).length;
        
        // Generate website QR code
        const qrContainer = document.getElementById('website-qr');
        if (qrContainer && !qrContainer.querySelector('canvas')) {
            new QRCode(qrContainer, {
                text: 'https://ccsk2026.vercel.app',
                width: 150,
                height: 150
            });
        }
    }

    function setupRouter() {
        window.addEventListener('hashchange', () => router.navigate(window.location.hash || '#home'));
        if (window.location.hash) router.navigate(window.location.hash);
    }

    function setupEventListeners() {
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        document.getElementById('register-form').addEventListener('submit', handleRegister);
        document.getElementById('logout-btn').addEventListener('click', handleLogout);
        
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                router.navigate(link.getAttribute('href').replace('#', ''));
            });
        });

        document.querySelectorAll('#day-tabs .nav-link').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('#day-tabs .nav-link').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                selectedDay = parseInt(tab.dataset.day);
                renderSchedule();
            });
        });

        document.querySelectorAll('#track-a, #track-b, #track-c, #track-plenary').forEach(cb => {
            cb.addEventListener('change', renderSchedule);
        });

        document.getElementById('poster-category-filter').addEventListener('change', renderPosters);

        document.querySelectorAll('#view-lostfound .nav-link').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('#view-lostfound .nav-link').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderLostFound();
            });
        });

        document.getElementById('exhibitor-form').addEventListener('submit', handleAddExhibitor);
        document.getElementById('lostfound-form').addEventListener('submit', handleAddLostFound);
        document.getElementById('import-csv-btn').addEventListener('click', handleCSVImport);
        document.getElementById('send-notif-btn').addEventListener('click', handleSendNotification);
        document.getElementById('clear-data-btn').addEventListener('click', handleClearData);
        document.getElementById('scanner-btn').addEventListener('click', openScanner);
        document.getElementById('register-attendee-btn').addEventListener('click', handleAdminRegister);
        document.getElementById('qr-input').addEventListener('change', previewCSV);
        document.getElementById('notification-btn').addEventListener('click', openNotificationSettings);
        document.getElementById('save-settings-btn').addEventListener('click', handleSaveSettings);
        document.getElementById('conf-logo').addEventListener('change', handleLogoUpload);
        document.getElementById('add-session-btn').addEventListener('click', handleAddSession);
        document.getElementById('add-speaker-btn').addEventListener('click', handleAddSpeaker);
        document.getElementById('attendee-search')?.addEventListener('input', renderAttendees);
        document.getElementById('poll-form').addEventListener('submit', handleCreatePoll);
        document.getElementById('start-lead-scan-btn')?.addEventListener('click', startLeadScanner);
    }

    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }
        
        const users = db.get(DB_KEYS.users);
        let user = users.find(u => u.email === email && u.password === password);
        
        // Auto-create user if not found (for testing)
        if (!user) {
            user = { id: Date.now().toString(), name: email.split('@')[0], email, type: 'delegate', password };
            users.push(user);
            db.set(DB_KEYS.users, users);
        }
        
        currentUser = user;
        localStorage.setItem('ccsk_current_user', JSON.stringify(user));
        showMainApp();
        alert('Welcome ' + user.name + '!');
    }

    function handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const org = document.getElementById('reg-org').value;
        const type = document.getElementById('reg-type').value;
        const password = document.getElementById('reg-password').value;

        const users = db.get(DB_KEYS.users);
        if (users.some(u => u.email === email)) {
            showToast('Email already registered');
            return;
        }

        const user = { id: Date.now().toString(), name, email, organization: org, type, password, registeredAt: Date.now() };
        users.push(user);
        db.set(DB_KEYS.users, users);
        
        currentUser = user;
        localStorage.setItem('ccsk_current_user', JSON.stringify(user));
        showMainApp();
        showToast('Registration successful!');
    }

    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('ccsk_current_user');
        showAuth();
    }

    function handleAddExhibitor(e) {
        e.preventDefault();
        const exhibitor = {
            id: Date.now().toString(),
            company: document.getElementById('ex-company').value,
            description: document.getElementById('ex-desc').value,
            tier: document.getElementById('ex-tier').value,
            booth: document.getElementById('ex-booth').value,
            email: document.getElementById('ex-email').value
        };
        
        const exhibitors = db.get(DB_KEYS.exhibitors);
        exhibitors.push(exhibitor);
        db.set(DB_KEYS.exhibitors, exhibitors);
        
        bootstrap.Modal.getInstance(document.getElementById('add-exhibitor-modal')).hide();
        renderExhibitors();
        showToast('Exhibitor added!');
    }

    function handleAddLostFound(e) {
        e.preventDefault();
        const item = {
            id: Date.now().toString(),
            type: document.getElementById('lf-type').value,
            description: document.getElementById('lf-desc').value,
            contact: document.getElementById('lf-contact').value,
            postedBy: currentUser?.id,
            postedAt: Date.now(),
            status: 'open'
        };
        
        const items = db.get(DB_KEYS.lostfound);
        items.push(item);
        db.set(DB_KEYS.lostfound, items);
        
        bootstrap.Modal.getInstance(document.getElementById('add-item-modal')).hide();
        renderLostFound();
        showToast('Item posted!');
    }

    function previewCSV() {
        const file = document.getElementById('csv-input').files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n').slice(0, 5);
            document.getElementById('csv-preview').innerHTML = '<pre class="small text-start">' + lines.join('\n') + '</pre>';
        };
        reader.readAsText(file);
    }

    function handleCSVImport() {
        const file = document.getElementById('csv-input').files[0];
        if (!file) {
            showToast('Please select a CSV file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const sessions = parseCSVSchedule(text);
            
            const existing = db.get(DB_KEYS.sessions);
            const maxId = existing.length > 0 ? Math.max(...existing.map(s => s.id)) : 0;
            
            sessions.forEach((s, i) => s.id = maxId + i + 1);
            existing.push(...sessions);
            db.set(DB_KEYS.sessions, existing);
            
            renderSchedule();
            renderAdmin();
            showToast(`Imported ${sessions.length} sessions!`);
        };
        reader.readAsText(file);
    }

    function parseCSVSchedule(text) {
        const lines = text.split('\n').filter(l => l.trim() && !l.startsWith('SCIENTIFIC') && !l.startsWith('13TH') && !l.startsWith('THEME') && !l.startsWith('DAY'));
        const sessions = [];
        let sessionId = 1;
        let currentDay = 1;
        
        lines.forEach(line => {
            const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, '')).filter(c => c);
            if (cols.length < 3) return;
            
            const timeMatch = cols[0].match(/(\d{4})-(\d{4})/);
            if (timeMatch) {
                const startTime = timeMatch[1].slice(0,2) + ':' + timeMatch[1].slice(2);
                const endTime = timeMatch[2].slice(0,2) + ':' + timeMatch[2].slice(2);
                
                let day = currentDay;
                if (cols[0].includes('2026-05-14') || line.includes('DAY 1') || (line.includes('CONFERENCE') && !line.includes('DAY 2'))) day = 2;
                if (cols[0].includes('2026-05-15') || line.includes('DAY 2')) day = 3;
                if (cols[0].includes('2026-05-13') || (line.includes('PRE-CONFERENCE') || line.includes('13TH'))) day = 1;
                
                sessions.push({
                    id: sessionId++,
                    day: day,
                    date: DATES[day],
                    startTime: startTime,
                    endTime: endTime,
                    title: cols[1] || 'Session',
                    speaker: cols[2] || '',
                    type: determineType(cols[1]),
                    track: determineTrack(cols),
                    room: cols[3] || 'TBD'
                });
                
                currentDay = day;
            }
        });
        
        return sessions;
    }

    function determineType(title) {
        if (!title) return 'lecture';
        const t = title.toLowerCase();
        if (t.includes('workshop')) return 'workshop';
        if (t.includes('plenary')) return 'plenary';
        if (t.includes('registration')) return 'registration';
        if (t.includes('tea') || t.includes('coffee')) return 'coffee';
        if (t.includes('lunch')) return 'meal';
        if (t.includes('gala')) return 'gala';
        if (t.includes('agm')) return 'agm';
        if (t.includes('symposium')) return 'symposium';
        return 'lecture';
    }

    function determineTrack(cols) {
        const room = (cols[cols.length - 1] || '').toLowerCase();
        if (room.includes('victoria hall 1')) return 'A';
        if (room.includes('victoria hall 2') || room.includes('victoria hall 3')) return 'B';
        if (cols[0].includes('Victoria Hall 3')) return 'B';
        return 'all';
    }

    function handleSendNotification() {
        const title = document.getElementById('notif-title').value;
        const message = document.getElementById('notif-message').value;
        
        if (!title || !message) {
            showToast('Please enter title and message');
            return;
        }
        
        if (notificationPermission === 'granted') {
            new Notification(title, { body: message, icon: '/favicon.ico' });
        }
        
        const notifs = db.get(DB_KEYS.notifications);
        notifs.push({ title, message, timestamp: Date.now(), sentBy: currentUser?.id });
        db.set(DB_KEYS.notifications, notifs);
        
        showToast('Notification sent!');
        document.getElementById('notif-title').value = '';
        document.getElementById('notif-message').value = '';
    }

    function handleSaveSettings() {
        const settings = {
            name: document.getElementById('conf-name').value,
            startDate: document.getElementById('conf-start-date').value,
            endDate: document.getElementById('conf-end-date').value,
            venue: document.getElementById('conf-venue').value,
            theme: document.getElementById('conf-theme').value,
            days: parseInt(document.getElementById('conf-days').value),
            tracks: parseInt(document.getElementById('conf-tracks').value),
            sessionsPerTrack: parseInt(document.getElementById('conf-sessions').value),
            color: document.getElementById('conf-color').value,
            logo: localStorage.getItem('ccsk_logo') || ''
        };
        
        db.setSettings(settings);
        applySettings(settings);
        showToast('Settings saved!');
    }

    function handleAddSession() {
        const day = parseInt(document.getElementById('session-day').value);
        const time = document.getElementById('session-time').value;
        const title = document.getElementById('session-title').value;
        const speaker = document.getElementById('session-speaker').value;
        const type = document.getElementById('session-type').value;
        const track = document.getElementById('session-track').value;
        const room = document.getElementById('session-room').value;
        
        if (!day || !time || !title) {
            showToast('Please fill in Day, Time and Title');
            return;
        }
        
        const [startTime, endTime] = time.split('-');
        const settings = db.getSettings();
        
        const session = {
            id: Date.now(),
            day,
            date: settings?.startDate ? new Date(new Date(settings.startDate).getTime() + (day - 1) * 86400000).toISOString().split('T')[0] : `2026-05-${12 + day}`,
            startTime: startTime.trim(),
            endTime: endTime ? endTime.trim() : startTime.trim(),
            title,
            speaker,
            type,
            track: track === 'all' ? 'all' : track,
            room: room || 'TBD'
        };
        
        const sessions = db.get(DB_KEYS.sessions);
        sessions.push(session);
        db.set(DB_KEYS.sessions, sessions);
        
        // Clear form
        document.getElementById('session-day').value = '';
        document.getElementById('session-time').value = '';
        document.getElementById('session-title').value = '';
        document.getElementById('session-speaker').value = '';
        document.getElementById('session-room').value = '';
        
        renderSchedule();
        renderAdmin();
        showToast('Session added!');
    }

    function handleAddSpeaker() {
        const name = document.getElementById('speaker-name').value;
        const title = document.getElementById('speaker-title').value;
        const org = document.getElementById('speaker-org').value;
        const bio = document.getElementById('speaker-bio').value;
        
        if (!name) {
            showToast('Please enter speaker name');
            return;
        }
        
        const speaker = {
            id: Date.now(),
            name,
            title,
            organization: org,
            bio
        };
        
        const speakers = db.get(DB_KEYS.speakers);
        speakers.push(speaker);
        db.set(DB_KEYS.speakers, speakers);
        
        // Clear form
        document.getElementById('speaker-name').value = '';
        document.getElementById('speaker-title').value = '';
        document.getElementById('speaker-org').value = '';
        document.getElementById('speaker-bio').value = '';
        
        renderSpeakers();
        showToast('Speaker added!');
    }

    function handleCreatePoll(e) {
        e.preventDefault();
        const question = document.getElementById('poll-question').value;
        const options = Array.from(document.querySelectorAll('.poll-option')).map(o => o.value).filter(v => v);
        
        if (!question || options.length < 2) {
            showToast('Enter question and at least 2 options');
            return;
        }
        
        const poll = {
            id: Date.now(),
            question,
            options,
            active: false,
            createdAt: Date.now()
        };
        
        const polls = db.get(DB_KEYS.polls);
        polls.push(poll);
        db.set(DB_KEYS.polls, polls);
        
        document.getElementById('poll-question').value = '';
        document.querySelectorAll('.poll-option').forEach(o => o.value = '');
        
        bootstrap.Modal.getInstance(document.getElementById('create-poll-modal')).hide();
        renderPolls();
        showToast('Poll created!');
    }

    function startLeadScanner() {
        // Simplified - just show prompt for QR code
        const result = document.getElementById('lead-scan-result');
        const attendeeEmail = prompt('Enter attendee email or scan QR code:');
        if (!attendeeEmail) return;
        
        const users = db.get(DB_KEYS.users);
        const attendee = users.find(u => u.email === attendeeEmail);
        
        if (!attendee) {
            showToast('Attendee not found');
            return;
        }
        
        const leads = db.get(DB_KEYS.leads);
        if (leads.some(l => l.email === attendeeEmail)) {
            showToast('Lead already collected');
            return;
        }
        
        leads.push({
            id: Date.now(),
            name: attendee.name,
            email: attendee.email,
            organization: attendee.organization,
            collectedAt: Date.now()
        });
        db.set(DB_KEYS.leads, leads);
        
        renderLeads();
        showToast('Lead collected!');
    }

    function applySettings(s) {

    function applySettings(s) {
        if (!s) s = db.getSettings();
        if (!s || Object.keys(s).length === 0) {
            s = { name: '13th CCSK Annual Scientific Conference', startDate: '2026-05-13', endDate: '2026-05-15', venue: 'Argyles Grand Hotel, Nairobi', theme: 'Frugal Innovation', days: 3, tracks: 3, sessionsPerTrack: 10, color: '#1e88e5', logo: '' };
        }
        
        document.getElementById('conf-name').value = s.name || '';
        document.getElementById('conf-start-date').value = s.startDate || '';
        document.getElementById('conf-end-date').value = s.endDate || '';
        document.getElementById('conf-venue').value = s.venue || '';
        document.getElementById('conf-theme').value = s.theme || '';
        document.getElementById('conf-days').value = s.days || 3;
        document.getElementById('conf-tracks').value = s.tracks || 3;
        document.getElementById('conf-sessions').value = s.sessionsPerTrack || 10;
        document.getElementById('conf-color').value = s.color || '#1e88e5';
        
        if (s.logo) {
            document.getElementById('conf-logo-preview').innerHTML = `<img src="${s.logo}" style="height:50px">`;
            const logoImg = document.getElementById('conf-logo-img');
            if (logoImg) logoImg.src = s.logo;
        } else {
            document.getElementById('conf-logo-img').src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect fill="%231e88e5" width="80" height="80"/><text fill="white" font-size="40" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">C</text></svg>';
        }
        
        // Update UI with settings
        document.documentElement.style.setProperty('--primary', s.color || '#1e88e5');
        
        // Update auth screen
        const authTitle = document.querySelector('#auth-screen h4');
        if (authTitle) authTitle.textContent = s.name || 'Conference';
        
        const authSubtitle = document.querySelector('#auth-screen .text-muted');
        if (authSubtitle) authSubtitle.textContent = `${s.startDate || ''} - ${s.endDate || ''} | ${s.venue || ''}`;
        
        // Update jumbotron
        const jumbotronTitle = document.querySelector('#view-home h1');
        if (jumbotronTitle) jumbotronTitle.textContent = s.name || 'Conference';
        
        // Regenerate schedule based on new settings
        generateScheduleFromSettings(s);
        
        // Update website QR code
        const qrContainer = document.getElementById('website-qr');
        if (qrContainer) {
            qrContainer.innerHTML = '';
            new QRCode(qrContainer, {
                text: window.location.origin,
                width: 150,
                height: 150
            });
        }
    }

    function generateScheduleFromSettings(s) {
        if (!s) s = db.getSettings();
        if (!s.days || !s.tracks) return;
        
        const sessions = [];
        let id = 1;
        const venue = s.venue || 'TBD';
        
        for (let day = 1; day <= s.days; day++) {
            const date = s.startDate ? new Date(new Date(s.startDate).getTime() + (day - 1) * 86400000).toISOString().split('T')[0] : `2026-05-${12 + day}`;
            
            // Registration
            sessions.push({ id: id++, day, date, startTime: '08:00', endTime: '08:30', title: 'Registration', speaker: '', type: 'registration', track: 'all', room: venue });
            
            // Sessions per track
            for (let t = 1; t <= s.tracks; t++) {
                const trackLetter = String.fromCharCode(64 + t);
                for (let i = 0; i < s.sessionsPerTrack; i++) {
                    const hour = 8 + Math.floor(i / 2) + 1;
                    const minute = (i % 2) * 30;
                    const endHour = minute === 30 ? hour + 1 : hour;
                    const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    const endTime = `${endHour.toString().padStart(2, '0')}:${minute === 30 ? '00' : '30'}`;
                    
                    sessions.push({
                        id: id++,
                        day,
                        date,
                        startTime,
                        endTime,
                        title: `Session ${i + 1}`,
                        speaker: '',
                        type: 'lecture',
                        track: trackLetter,
                        room: `Room ${t}`
                    });
                }
            }
            
            // Tea/Coffee breaks and meals
            sessions.push({ id: id++, day, date, startTime: '10:30', endTime: '11:00', title: 'Coffee Break', speaker: '', type: 'coffee', track: 'all', room: venue });
            sessions.push({ id: id++, day, date, startTime: '13:00', endTime: '14:00', title: 'Lunch', speaker: '', type: 'meal', track: 'all', room: venue });
            sessions.push({ id: id++, day, date, startTime: '15:30', endTime: '16:00', title: 'Tea Break', speaker: '', type: 'coffee', track: 'all', room: venue });
        }
        
        db.set(DB_KEYS.sessions, sessions);
    }

    function handleLogoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            localStorage.setItem('ccsk_logo', event.target.result);
            document.getElementById('conf-logo-preview').innerHTML = `<img src="${event.target.result}" style="height:50px">`;
        };
        reader.readAsDataURL(file);
    }

    function handleAdminRegister() {
        const name = document.getElementById('admin-name').value;
        const email = document.getElementById('admin-email').value;
        const org = document.getElementById('admin-org').value;
        const type = document.getElementById('admin-type').value;
        
        if (!name || !email) {
            showToast('Please enter name and email');
            return;
        }
        
        const password = Math.random().toString(36).slice(-6);
        const users = db.get(DB_KEYS.users);
        
        if (users.some(u => u.email === email)) {
            showToast('Email already registered');
            return;
        }
        
        const user = { id: Date.now().toString(), name, email, organization: org, type, password, registeredAt: Date.now() };
        users.push(user);
        db.set(DB_KEYS.users, users);
        
        document.getElementById('badge-result').innerHTML = `
            <div class="badge-preview">
                <div class="badge-preview-header">
                    <strong>13th CCSK Annual Scientific Conference</strong><br>
                    <small>May 13-15, 2026 | Argyles Grand Hotel</small>
                </div>
                <div class="badge-preview-name">${name}</div>
                <span class="badge-preview-type ${type}">${type}</span>
                <div class="badge-preview-org">${org || ''}</div>
                <div class="badge-preview-qr" id="badge-qr"></div>
                <div class="badge-preview-footer">
                    <small>Scan QR for entry to sessions</small>
                </div>
            </div>
            <div class="alert alert-success mt-2">
                <strong>Credentials:</strong><br>
                Email: ${email}<br>
                Password: ${password}<br>
                <div class="mt-2 d-flex gap-2 flex-wrap">
                    <button class="btn btn-sm btn-outline-primary" onclick="sendLoginEmail('${name}', '${email}', '${password}')">
                        <i class="fas fa-envelope"></i> Email
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="copyCredentials('${email}', '${password}')">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                    <a href="https://wa.me/?text=CCSK%20Conference%20Login:%20${email}%20Password:${password}%20https://ccsk2026.vercel.app" class="btn btn-sm btn-success" target="_blank">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                </div>
            </div>
        `;
        
        new QRCode(document.getElementById('badge-qr'), {
            text: `CCSK2026-${user.id}-${email}`,
            width: 100,
            height: 100
        });
        
        document.getElementById('admin-name').value = '';
        document.getElementById('admin-email').value = '';
        document.getElementById('admin-org').value = '';
        
        renderAdmin();
        showToast('Attendee registered!');
    }

    function handleClearData() {
        if (confirm('Clear ALL data? This cannot be undone.')) {
            Object.values(DB_KEYS).forEach(key => localStorage.removeItem(key));
            loadDefaultSchedule();
            loadDefaultSpeakers();
            loadDefaultPosters();
            loadExhibitors();
            renderAdmin();
            showToast('All data cleared!');
        }
    }

    function openScanner() {
        const modal = new bootstrap.Modal(document.getElementById('qr-scanner-modal'));
        modal.show();
    }

    function openNotificationSettings() {
        if (notificationPermission === 'default') {
            requestNotificationPermission();
        } else if (notificationPermission === 'denied') {
            showToast('Notifications blocked. Enable in browser settings.');
        } else {
            showToast('Notifications enabled!');
        }
    }

    async function requestNotificationPermission() {
        if (!('Notification' in window)) return;
        
        notificationPermission = Notification.permission;
        
        if (notificationPermission === 'default') {
            try {
                notificationPermission = await Notification.requestPermission();
            } catch (e) {
                console.log('Notification permission denied');
            }
        }
    }

    function checkSessionReminders() {
        if (notificationPermission !== 'granted') return;
        
        setInterval(() => {
            const now = new Date();
            const sessions = db.get(DB_KEYS.sessions);
            
            sessions.forEach(s => {
                const [hour, min] = s.startTime.split(':');
                const sessionTime = new Date(s.date + 'T' + s.startTime + ':00');
                const diff = sessionTime - now;
                
                if (diff > 0 && diff < 10 * 60 * 1000) {
                    const sent = db.get(DB_KEYS.settings)?.reminderSent?.[s.id];
                    if (!sent) {
                        new Notification(`${s.title} starting soon`, {
                            body: `${s.startTime} - ${s.room}`,
                            icon: '/favicon.ico'
                        });
                        
                        const settings = db.getSettings();
                        settings.reminderSent = settings.reminderSent || {};
                        settings.reminderSent[s.id] = true;
                        db.setSettings(settings);
                    }
                }
            });
        }, 60000);
    }

    function showToast(message) {
        const container = document.querySelector('.toast-container') || document.createElement('div');
        container.className = 'toast-container';
        if (!container.parentNode) document.body.appendChild(container);
        
        const toast = document.createElement('div');
        toast.className = 'toast show bg-dark text-white mt-2';
        toast.textContent = message;
        container.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }

    window.app = {
        toggleFavorite: (sessionId) => {
            if (!currentUser) return;
            const mySched = db.get(DB_KEYS.myschedule);
            const existing = mySched.findIndex(m => m.userId === currentUser.id && m.sessionId === sessionId);
            
            if (existing >= 0) {
                mySched.splice(existing, 1);
            } else {
                mySched.push({ userId: currentUser.id, sessionId, addedAt: Date.now() });
            }
            db.set(DB_KEYS.myschedule, mySched);
            renderSchedule();
        },
        removeFavorite: (sessionId) => {
            const mySched = db.get(DB_KEYS.myschedule).filter(m => !(m.userId === currentUser.id && m.sessionId === sessionId));
            db.set(DB_KEYS.myschedule, mySched);
            renderMySchedule();
        },
        votePoster: (posterId) => {
            if (!currentUser) return;
            const votes = db.get(DB_KEYS.votes);
            if (votes.some(v => v.userId === currentUser.id && v.posterId === posterId)) {
                showToast('You have already voted!');
                return;
            }
            votes.push({ userId: currentUser.id, posterId, timestamp: Date.now() });
            db.set(DB_KEYS.votes, votes);
            
            const posters = db.get(DB_KEYS.posters);
            const poster = posters.find(p => p.id === posterId);
            if (poster) poster.votes = (poster.votes || 0) + 1;
            db.set(DB_KEYS.posters, posters);
            
            renderPosters();
            showToast('Vote recorded!');
        },
        togglePoll: (pollId) => {
            const polls = db.get(DB_KEYS.polls);
            const poll = polls.find(p => p.id === pollId);
            if (poll) poll.active = !poll.active;
            db.set(DB_KEYS.polls, polls);
            renderPolls();
        },
        votePoll: async (pollId) => {
            if (!currentUser) {
                showToast('Please login first');
                return;
            }
            const poll = db.get(DB_KEYS.polls).find(p => p.id === pollId);
            if (!poll || !poll.active) {
                showToast('Poll is closed');
                return;
            }
            
            const answer = prompt('Enter your vote (option number):');
            const optionIndex = parseInt(answer) - 1;
            if (isNaN(optionIndex) || !poll.options[optionIndex]) {
                showToast('Invalid option');
                return;
            }
            
            const responses = db.get(DB_KEYS.pollResponses);
            if (responses.some(r => r.pollId === pollId && r.userId === currentUser.id)) {
                showToast('Already voted!');
                return;
            }
            
            responses.push({ pollId, userId: currentUser.id, answer: poll.options[optionIndex], timestamp: Date.now() });
            db.set(DB_KEYS.pollResponses, responses);
            
            renderPolls();
            showToast('Vote recorded!');
        },
        db: db,
        DB_KEYS: DB_KEYS,
        CONFERENCE: CONFERENCE
    };

    init();
})();