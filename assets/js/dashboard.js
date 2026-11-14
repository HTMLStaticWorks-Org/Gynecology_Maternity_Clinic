/**
 * BLOOM & CRADLE CLINIC — PATIENT & ADMIN DASHBOARD CONTROLLER (assets/js/dashboard.js)
 * Client-side demo state persisted in localStorage.
 * TODO: Replace client-side localStorage session guard with real backend JWT/session authentication.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. CLIENT-SIDE AUTH GUARD (Demo Session Management)
     ------------------------------------------------------------------------ */
  const isLoggedOut = localStorage.getItem('bc_auth_logged_out') === 'true';
  let session = null;
  try {
    session = JSON.parse(localStorage.getItem('bc_auth_session') || 'null');
  } catch (_) {
    session = null;
  }

  if (isLoggedOut && !session) {
    window.location.replace('../login.html');
    return;
  }

  if (!session) {
    const isAdminPage = window.location.pathname.includes('/admin/');
    session = {
      email: isAdminPage ? 'admin@demo.com' : 'patient@demo.com',
      name: isAdminPage ? 'Sophia Brooks' : 'Elena Rostova',
      role: isAdminPage ? 'admin' : 'patient',
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem('bc_auth_session', JSON.stringify(session));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const toast = window.showBloomToast || function () {};

    /* ----------------------------------------------------------------------
       2. SIDEBAR TOGGLE & LOGOUT
       ---------------------------------------------------------------------- */
    const sidebar = document.querySelector('.dashboard-sidebar');
    document.querySelectorAll('[data-sidebar-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!sidebar) return;
        const open = sidebar.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });
    });

    document.querySelectorAll('[data-logout-btn]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('bc_auth_session');
        localStorage.setItem('bc_auth_logged_out', 'true');
        toast('Signed out securely. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '../login.html';
        }, 450);
      });
    });

    /* ----------------------------------------------------------------------
       3. PATIENT CHECKUP BOOKING & .ICS CALENDAR GENERATOR
       ---------------------------------------------------------------------- */
    const dashBookForm = document.getElementById('dashboard-book-form');
    if (dashBookForm) {
      dashBookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const service = document.getElementById('db-service')?.value || '28-Week Antenatal & Growth Scan';
        const doctor = document.getElementById('db-doctor')?.value || 'Dr. Amara Okafor';
        const date = document.getElementById('db-date')?.value || '2026-11-24';
        const time = document.getElementById('db-time')?.value || '10:30 AM';

        const list = JSON.parse(localStorage.getItem('bc_appointments') || '[]');
        list.unshift({ id: Date.now(), service, doctor, date, time, status: 'Confirmed' });
        localStorage.setItem('bc_appointments', JSON.stringify(list));

        toast(`Checkup booked with ${doctor} on ${date} at ${time}!`);
        const confirmCard = document.getElementById('db-booking-confirmed');
        if (confirmCard) {
          confirmCard.hidden = false;
        }
      });
    }

    const icsBtn = document.getElementById('download-ics-btn');
    if (icsBtn) {
      icsBtn.addEventListener('click', () => {
        const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Bloom & Cradle Clinic//Patient Portal//EN',
          'BEGIN:VEVENT',
          'SUMMARY:Antenatal Checkup - Bloom & Cradle Clinic',
          'DESCRIPTION:Scheduled prenatal consultation with Dr. Amara Okafor.',
          'LOCATION:Bloom & Cradle Women\'s Health & Maternity Clinic, Suite 400',
          'DTSTART:20261124T103000',
          'DTEND:20261124T111500',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bloom-cradle-checkup.ics';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast('Calendar invite (.ics) downloaded.');
      });
    }

    /* ----------------------------------------------------------------------
       4. APPOINTMENTS CANCEL / RESCHEDULE ACTIONS
       ---------------------------------------------------------------------- */
    document.querySelectorAll('[data-cancel-appt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr, .tilt-card, .card');
        const badge = row ? row.querySelector('.badge') : null;
        if (badge) {
          badge.className = 'badge badge-gold';
          badge.textContent = 'Cancelled';
        }
        toast('Appointment status updated to Cancelled.');
      });
    });

    document.querySelectorAll('[data-reschedule-appt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        toast('Reschedule request opened — select a new slot in Book Checkup.');
      });
    });

    /* ----------------------------------------------------------------------
       5. PREGNANCY TRACKER: MILESTONES, SYMPTOM JOURNAL, KICK & CONTRACTION TIMERS
       ---------------------------------------------------------------------- */
    const savedMilestones = JSON.parse(localStorage.getItem('bc_milestones') || '{}');
    document.querySelectorAll('[data-milestone-check]').forEach((checkbox) => {
      const key = checkbox.getAttribute('data-milestone-check');
      if (savedMilestones[key] !== undefined) {
        checkbox.checked = Boolean(savedMilestones[key]);
      }
      const parent = checkbox.closest('.milestone-item');
      if (parent) parent.classList.toggle('is-completed', checkbox.checked);

      checkbox.addEventListener('change', () => {
        savedMilestones[key] = checkbox.checked;
        localStorage.setItem('bc_milestones', JSON.stringify(savedMilestones));
        if (parent) parent.classList.toggle('is-completed', checkbox.checked);
        toast(checkbox.checked ? 'Milestone marked complete!' : 'Milestone unchecked.');
      });
    });

    const journalForm = document.getElementById('symptom-journal-form');
    if (journalForm) {
      journalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const mood = document.getElementById('journal-mood')?.value || 'Calm & Rested';
        const note = document.getElementById('journal-note')?.value || '';
        const listEl = document.getElementById('journal-entries-list');
        if (listEl && note.trim()) {
          const item = document.createElement('div');
          item.className = 'milestone-item';
          item.innerHTML = `<div><strong>Today (${mood})</strong><p>${note}</p></div><span class="badge badge-success">Logged</span>`;
          listEl.prepend(item);
        }
        journalForm.reset();
        toast('Symptom & mood entry saved to your prenatal log.');
      });
    }

    const trackerKickBtn = document.getElementById('tracker-kick-btn');
    if (trackerKickBtn) {
      let kicks = parseInt(localStorage.getItem('bc_dash_kicks') || '6', 10);
      const display = document.getElementById('tracker-kick-count');
      if (display) display.textContent = String(kicks);
      trackerKickBtn.addEventListener('click', () => {
        kicks += 1;
        localStorage.setItem('bc_dash_kicks', String(kicks));
        if (display) display.textContent = String(kicks);
        toast(`Movement #${kicks} logged at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      });
    }

    const contractionBtn = document.getElementById('contraction-timer-btn');
    if (contractionBtn) {
      let timing = false;
      let startTime = 0;
      let intervalId = null;
      const timerDisplay = document.getElementById('contraction-timer-display');
      const logList = document.getElementById('contraction-log-list');

      contractionBtn.addEventListener('click', () => {
        if (!timing) {
          timing = true;
          startTime = Date.now();
          contractionBtn.textContent = 'Stop Contraction';
          intervalId = setInterval(() => {
            const secs = Math.floor((Date.now() - startTime) / 1000);
            if (timerDisplay) timerDisplay.textContent = `${secs}s`;
          }, 250);
        } else {
          timing = false;
          clearInterval(intervalId);
          const durationSecs = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
          contractionBtn.textContent = 'Start Contraction';
          if (timerDisplay) timerDisplay.textContent = `Last: ${durationSecs}s`;
          if (logList) {
            const li = document.createElement('div');
            li.className = 'milestone-item';
            li.innerHTML = `<span>Contraction recorded (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span><span class="badge badge-plum">${durationSecs} sec</span>`;
            logList.prepend(li);
          }
          toast(`Contraction duration (${durationSecs}s) saved.`);
        }
      });
    }

    /* ----------------------------------------------------------------------
       6. REPORTS PREVIEW & DOWNLOAD
       ---------------------------------------------------------------------- */
    const reportModal = document.getElementById('report-preview-modal');
    const reportModalTitle = document.getElementById('report-modal-title');
    const reportModalBody = document.getElementById('report-modal-body');
    const reportModalClose = document.getElementById('report-modal-close');

    document.querySelectorAll('[data-preview-report]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-preview-report') || 'Clinical Report Summary';
        const summary = btn.getAttribute('data-report-summary') || 'All maternal and fetal parameters are within normal physiological reference ranges.';
        if (reportModalTitle) reportModalTitle.textContent = title;
        if (reportModalBody) reportModalBody.textContent = summary;
        if (reportModal) reportModal.hidden = false;
      });
    });

    if (reportModalClose && reportModal) {
      reportModalClose.addEventListener('click', () => {
        reportModal.hidden = true;
      });
    }

    document.querySelectorAll('[data-download-report]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-download-report') || 'clinical-report';
        toast(`Downloading ${name}.pdf...`);
      });
    });

    /* ----------------------------------------------------------------------
       7. DOCTOR MESSAGING THREADS & COMPOSER
       ---------------------------------------------------------------------- */
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-send-form');
    const chatInput = document.getElementById('chat-input');
    const activeDocTitle = document.getElementById('chat-active-doctor');

    document.querySelectorAll('[data-thread-doctor]').forEach((item) => {
      item.addEventListener('click', () => {
        document.querySelectorAll('[data-thread-doctor]').forEach((i) => i.classList.remove('is-active'));
        item.classList.add('is-active');
        const docName = item.getAttribute('data-thread-doctor') || 'Dr. Amara Okafor';
        if (activeDocTitle) activeDocTitle.textContent = docName;
        toast(`Switched conversation to ${docName}.`);
      });
    });

    if (chatForm && chatMessages && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble chat-bubble--patient';
        bubble.textContent = text;
        chatMessages.appendChild(bubble);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
          const reply = document.createElement('div');
          reply.className = 'chat-bubble chat-bubble--doctor';
          reply.textContent = 'Thank you for your message, Elena. I have reviewed your note and everything sounds reassuring. We will also check this during your Tuesday visit.';
          chatMessages.appendChild(reply);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 900);
      });
    }

    /* ----------------------------------------------------------------------
       8. SETTINGS DATA EXPORT & ADMIN CRUD ACTIONS
       ---------------------------------------------------------------------- */
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const payload = {
          patient: 'Elena Rostova',
          gestationalAge: '28 Weeks, 3 Days',
          estimatedDueDate: '2027-02-04',
          exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bloom-cradle-patient-records.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        toast('Personal health record archive exported.');
      });
    }

    document.querySelectorAll('[data-admin-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const msg = btn.getAttribute('data-admin-action') || 'Record updated.';
        toast(msg);
      });
    });
  });
})();
