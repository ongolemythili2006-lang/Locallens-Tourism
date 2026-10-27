/**
 * LocalLens Tourism — Main Interactive Application Logic
 * Modern AI Travel Platform
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroPlanner();
  initAiModal();
  initArakuSampleTrip();
  initDestinationFilters();
  initFaqAccordion();
  initContactForm();
  initBackToTop();
  initPartnerModal();
});

/* ==========================================================================
   1. Navbar & Header Scroll State
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Sticky nav background transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightCurrentSection();
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isOpen = navLinks.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close menu when clicking any link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (mobileToggle) {
          mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        }
      });
    });
  }

  // Active section highlighting
  function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  }
}

/* ==========================================================================
   2. Hero Section Quick Trip Planner
   ========================================================================== */
function initHeroPlanner() {
  const quickTags = document.querySelectorAll('.quick-tag-btn');
  const heroGenerateBtn = document.getElementById('heroGenerateBtn');
  const heroDestSelect = document.getElementById('heroDestSelect');
  const heroDaysSelect = document.getElementById('heroDaysSelect');
  const heroBudgetSelect = document.getElementById('heroBudgetSelect');

  let activeVibe = 'Nature & Coffee';

  quickTags.forEach(tag => {
    tag.addEventListener('click', () => {
      quickTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      activeVibe = tag.getAttribute('data-vibe') || tag.innerText;
    });
  });

  if (heroGenerateBtn) {
    heroGenerateBtn.addEventListener('click', () => {
      const dest = heroDestSelect ? heroDestSelect.value : 'Araku Valley';
      const days = heroDaysSelect ? heroDaysSelect.value : '2 Days';
      const budget = heroBudgetSelect ? heroBudgetSelect.value : '₹3,500/day (Explorer)';

      openAiModalWithPreset({
        destination: dest,
        duration: days,
        budget: budget,
        vibe: activeVibe
      });
    });
  }
}

/* ==========================================================================
   3. AI Trip Generator Modal & Simulation
   ========================================================================== */
function initAiModal() {
  const modal = document.getElementById('aiPlannerModal');
  const openButtons = document.querySelectorAll('.btn-open-planner');
  const closeBtn = document.getElementById('closeAiModal');
  const runSimBtn = document.getElementById('runAiGenBtn');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modal);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modal));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal(modal);
    }
  });

  if (runSimBtn) {
    runSimBtn.addEventListener('click', simulateAiGeneration);
  }
}

function openModal(modalEl) {
  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  modalEl.classList.remove('active');
  document.body.style.overflow = '';
}

function openAiModalWithPreset(data) {
  const modal = document.getElementById('aiPlannerModal');
  if (!modal) return;

  const modalDest = document.getElementById('modalDestSelect');
  const modalDays = document.getElementById('modalDaysInput');
  const modalBudget = document.getElementById('modalBudgetSelect');

  if (modalDest && data.destination) modalDest.value = data.destination;
  if (modalDays && data.duration) modalDays.value = data.duration.replace(/\D/g, '') || 2;
  if (modalBudget && data.budget) modalBudget.value = data.budget;

  openModal(modal);
  simulateAiGeneration();
}

function simulateAiGeneration() {
  const formBox = document.getElementById('modalFormBox');
  const progressBox = document.getElementById('aiSimProgress');
  const resultBox = document.getElementById('aiSimResult');
  const stepText = document.getElementById('simStepText');
  const stepSub = document.getElementById('simStepSub');

  if (!formBox || !progressBox || !resultBox) return;

  const destination = document.getElementById('modalDestSelect').value;
  const days = document.getElementById('modalDaysInput').value || '2';
  const budget = document.getElementById('modalBudgetSelect').value;

  formBox.style.display = 'none';
  resultBox.style.display = 'none';
  progressBox.style.display = 'block';

  const steps = [
    { title: 'Connecting to Local Data Mesh...', sub: `Fetching hyperlocal terrain & live road conditions for ${destination}` },
    { title: 'Screening 120+ Verified Local Hosts...', sub: 'Filtering tribal guides, organic coffee estates & zero-commission homestays' },
    { title: 'Running Crowd-Dispersion Optimization...', sub: 'Scheduling peak tourist spots during quiet hours for authentic experience' },
    { title: 'Generating Dynamic Rupees Breakdown...', sub: `Allocating ${budget} intelligently to support indigenous businesses` }
  ];

  let currentStep = 0;
  const interval = setInterval(() => {
    if (currentStep < steps.length) {
      stepText.innerText = steps[currentStep].title;
      stepSub.innerText = steps[currentStep].sub;
      currentStep++;
    } else {
      clearInterval(interval);
      progressBox.style.display = 'none';
      renderSimResult(destination, days, budget);
      resultBox.style.display = 'block';
    }
  }, 650);
}

function renderSimResult(destination, days, budget) {
  const resultBox = document.getElementById('aiSimResult');
  if (!resultBox) return;

  resultBox.innerHTML = `
    <div class="sim-result-header">
      <div>
        <span class="section-badge" style="margin-bottom:0.25rem;">✨ Itinerary Synthesized in 2.6s</span>
        <h4 style="font-size:1.3rem; margin-top:0.25rem;">${days}-Day Custom Experience: ${destination}</h4>
      </div>
      <button class="btn btn-secondary btn-sm" id="resetAiPlannerBtn" style="padding:0.4rem 0.85rem;">Modify Parameters</button>
    </div>

    <div style="background:#FFFFFF; border-radius:12px; padding:1.25rem; border:1px solid #E2E8F0; margin-bottom:1rem;">
      <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem; font-size:0.88rem; color:#64748B; flex-wrap:wrap; gap:0.5rem;">
        <span>🎯 Style: <strong>Authentic & Low Footprint</strong></span>
        <span>💵 Target Budget: <strong>${budget}</strong></span>
        <span>⛅ Micro-Climate: <strong>22°C Clear / Mist Mornings</strong></span>
      </div>
      <p style="font-size:0.92rem; color:#334155; line-height:1.55;">
        Your custom itinerary cuts out commercial tourist traps. <strong>94%</strong> of your expenses go directly to local guides, tribal cooks, and family-run eco-stays.
      </p>
    </div>

    <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem;">
      <div style="background:#F0FDF4; border:1px solid #BBF7D0; padding:0.85rem 1rem; border-radius:8px; display:flex; align-items:center; gap:0.75rem;">
        <span style="font-weight:700; color:#047857; font-size:0.9rem;">Day 1 Highlight:</span>
        <span style="font-size:0.88rem; color:#1E293B;">Borra Deep Caves Geological Walk + Tribal Bamboo Chicken Tasting</span>
      </div>
      <div style="background:#F0F9FF; border:1px solid #BAE6FD; padding:0.85rem 1rem; border-radius:8px; display:flex; align-items:center; gap:0.75rem;">
        <span style="font-weight:700; color:#0369A1; font-size:0.9rem;">Day 2 Highlight:</span>
        <span style="font-size:0.88rem; color:#1E293B;">Private Araku Arabica Plantation Cupping + Hidden Katiki Falls Trail</span>
      </div>
    </div>

    <div style="display:flex; gap:1rem; flex-wrap:wrap;">
      <button class="btn btn-primary btn-block" onclick="alert('Trip itinerary locked! Your dynamic offline pass has been sent to your WhatsApp/Email.')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Download AI Offline Pass & Book Direct
      </button>
    </div>
  `;

  const resetBtn = document.getElementById('resetAiPlannerBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.getElementById('modalFormBox').style.display = 'block';
      resultBox.style.display = 'none';
    });
  }
}

/* ==========================================================================
   4. Sample Trip Section (2-Day Araku Valley) Interactive Logic
   ========================================================================== */
function initArakuSampleTrip() {
  const day1Btn = document.getElementById('day1TabBtn');
  const day2Btn = document.getElementById('day2TabBtn');
  const day1Content = document.getElementById('day1Content');
  const day2Content = document.getElementById('day2Content');
  const replanToggle = document.getElementById('replanToggle');
  const slotKatiki = document.getElementById('slotKatikiWaterfalls');

  if (day1Btn && day2Btn && day1Content && day2Content) {
    day1Btn.addEventListener('click', () => {
      day1Btn.classList.add('active');
      day2Btn.classList.remove('active');
      day1Content.style.display = 'flex';
      day2Content.style.display = 'none';
    });

    day2Btn.addEventListener('click', () => {
      day2Btn.classList.add('active');
      day1Btn.classList.remove('active');
      day1Content.style.display = 'none';
      day2Content.style.display = 'flex';
    });
  }

  // Dynamic Replanning Simulator Toggle
  if (replanToggle && slotKatiki) {
    replanToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        // Automatically switch to Day 2 where Katiki is located so user sees effect
        if (day2Btn && day2Content) {
          day2Btn.click();
        }

        slotKatiki.classList.add('replanned');
        slotKatiki.innerHTML = `
          <div class="timeline-time-box">
            <span class="time-slot">11:00 AM</span>
            <span class="time-badge">Day 2 (Replanned)</span>
          </div>
          <div class="timeline-detail">
            <div class="replanned-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"></path><path d="M16 14v6"></path><path d="M8 14v6"></path><path d="M12 16v6"></path></svg>
              ⚡ Dynamic AI Trigger: 85% Flash Rain Probability detected in Katiki Gorge
            </div>
            <div class="detail-header">
              <h4>Indoor Tribal Coffee Roastery Experience & Terracotta Pottery Studio</h4>
              <span class="detail-tag culture">Dry Shelter AI Alt</span>
            </div>
            <p class="timeline-desc">
              To keep your morning enjoyable and safe, LocalLens AI immediately pivoted your Katiki waterfall trek to Araku's sheltered artisan quarter. You'll roast indigenous beans over embers with master roaster Subba Rao and shape clay pottery with local Gondi craftswomen.
            </p>
            <div class="timeline-perks">
              <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Zero wait time</span>
              <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Dry weather safety verified</span>
              <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Free fresh brew tasting included</span>
            </div>
          </div>
        `;
        showToast('🌦️ Weather Alert Handled: LocalLens AI smoothly rerouted Katiki trek to indoor Roastery!');
      } else {
        slotKatiki.classList.remove('replanned');
        slotKatiki.innerHTML = `
          <div class="timeline-time-box">
            <span class="time-slot">11:00 AM</span>
            <span class="time-badge">Day 2 (Original)</span>
          </div>
          <div class="timeline-detail">
            <div class="detail-header">
              <h4>Hidden Katiki Waterfalls Trek & Forest Stream Dip</h4>
              <span class="detail-tag nature">Hidden Gem</span>
            </div>
            <p class="timeline-desc">
              Hike along the lesser-known forested trail to Katiki Falls through lush fern canopies. Timed precisely during the quiet morning window to avoid tourist jeeps. Crystal mountain water from Gosthani River.
            </p>
            <div class="timeline-perks">
              <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Certified Naturalist Guide</span>
              <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Crowd Density: Low (AI-Timed)</span>
              <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Forest entry pass included</span>
            </div>
          </div>
        `;
      }
    });
  }
}

/* ==========================================================================
   5. Destinations Filter Navigation
   ========================================================================== */
function initDestinationFilters() {
  const filterButtons = document.querySelectorAll('.dest-filter-btn');
  const cards = document.querySelectorAll('.dest-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'flex';
        } else {
          const category = card.getAttribute('data-category');
          if (category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
}

/* ==========================================================================
   6. FAQ Accordion Logic
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAns = otherItem.querySelector('.faq-answer');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // Open first item by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstAns = firstItem.querySelector('.faq-answer');
    firstItem.classList.add('active');
    if (firstAns) firstAns.style.maxHeight = firstAns.scrollHeight + 'px';
  }
}

/* ==========================================================================
   7. Contact Form & Toast
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const newsletterForm = document.getElementById('newsletterForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');

      const name = nameInput ? nameInput.value : 'Explorer';
      showToast(`✨ Thanks ${name}! Your inquiry is logged. Our travel AI concierge will reach out in <15 mins.`);
      contactForm.reset();
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('💌 Subscribed! You’ll receive our weekly hidden-gem guide & travel updates.');
      newsletterForm.reset();
    });
  }
}

/* Toast Message Helper */
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 20);

  // Remove toast after 4.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

/* ==========================================================================
   8. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backBtn = document.getElementById('backToTopBtn');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   9. Partner Modal Logic
   ========================================================================== */
function initPartnerModal() {
  const partnerModal = document.getElementById('partnerModal');
  const openButtons = document.querySelectorAll('.btn-open-partner-modal');
  const closeBtn = document.getElementById('closePartnerModal');
  const partnerForm = document.getElementById('partnerApplicationForm');

  if (!partnerModal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(partnerModal);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(partnerModal));
  }

  partnerModal.addEventListener('click', (e) => {
    if (e.target === partnerModal) closeModal(partnerModal);
  });

  if (partnerForm) {
    partnerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal(partnerModal);
      showToast('🤝 Welcome to the network! Our partner onboarding team will verify your business within 24 hours.');
      partnerForm.reset();
    });
  }
}
