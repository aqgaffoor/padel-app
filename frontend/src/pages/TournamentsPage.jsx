import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users, Trophy, X, ChevronRight, CheckCircle, Clock, Star, Lock } from 'lucide-react';
import styles from './TournamentsPage.module.css';

const tournaments = [
  {
    id: 1,
    date: '2026-08-15',
    dateDisplay: '15 AUG',
    year: '2026',
    title: 'Durban North Smash',
    subtitle: 'Mixed Doubles Championship',
    description:
      'Our flagship mixed-doubles event open to intermediate and advanced players. Featuring a R10,000 prize pool, sponsored gear packs, and professional match coverage. Join the biggest padel tournament in KwaZulu-Natal.',
    location: 'Radar Drive Courts',
    category: 'Mixed Doubles',
    categoryColor: '#caff00',
    level: 'Intermediate – Advanced',
    entryFee: 'R250 per pair',
    spots: 32,
    spotsLeft: 8,
    prizePool: 'R10,000',
    featured: true,
  },
  {
    id: 2,
    date: '2026-09-06',
    dateDisplay: '06 SEP',
    year: '2026',
    title: 'Padel Zone Masters',
    subtitle: 'Weekend Masters Series',
    description:
      'A weekend-long masters event focusing on strategic play and elite competition. Entry includes a premium lunch pack, event t-shirt, and access to the post-tournament mixer.',
    location: 'Main Arena, Durban',
    category: 'Open Singles',
    categoryColor: '#7c3aed',
    level: 'Advanced',
    entryFee: 'R350 per player',
    spots: 24,
    spotsLeft: 5,
    prizePool: 'R15,000',
    featured: false,
  },
  {
    id: 3,
    date: '2026-09-27',
    dateDisplay: '27 SEP',
    year: '2026',
    title: 'Beginners\' Open',
    subtitle: 'Beginners Welcome — No Experience Needed',
    description:
      'New to padel? This is your tournament. Compete in a fun and supportive environment with players at your level. Includes a free warm-up clinic before the event, guided by our certified coaches.',
    location: 'Radar Drive Courts',
    category: 'Beginners',
    categoryColor: '#06b6d4',
    level: 'Beginner',
    entryFee: 'R150 per pair',
    spots: 40,
    spotsLeft: 22,
    prizePool: 'Prizes & Medals',
    featured: false,
  },
  {
    id: 4,
    date: '2026-11-01',
    dateDisplay: '01 NOV',
    year: '2026',
    title: 'End-of-Year Classic',
    subtitle: 'The Grand Finale of 2026',
    description:
      'Close out the year in style at the most prestigious event on the Padel Zone calendar. Professionals and elite amateurs compete for the year\'s biggest prize pool. Spectator entry is free.',
    location: 'Main Arena, Durban',
    category: 'Pro–Am',
    categoryColor: '#f59e0b',
    level: 'All levels',
    entryFee: 'R500 per pair',
    spots: 16,
    spotsLeft: 2,
    prizePool: 'R25,000',
    featured: false,
  },
];

/* ═══════════════════ REGISTRATION MODAL ═══════════════════ */
const RegistrationModal = ({ tournament, onClose }) => {
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    partnerName: '',
    skillLevel: '',
    heardAbout: '',
    dietaryNeeds: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const overlayRef = useRef(null);

  /* Close on backdrop click */
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (tournament.category.includes('Doubles') && !form.partnerName.trim()) e.partnerName = 'Partner name required';
    if (!form.skillLevel) e.skillLevel = 'Please select your skill level';
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to the terms';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    /* Simulate submission */
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const isDoubles = tournament.category.includes('Doubles');

  return (
    <div className={styles.modalOverlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div>
            <span className={styles.modalBadge} style={{ background: tournament.categoryColor + '22', color: tournament.categoryColor, borderColor: tournament.categoryColor + '44' }}>
              {tournament.category}
            </span>
            <h2 className={styles.modalTitle}>{tournament.title}</h2>
            <p className={styles.modalSubtitle}>{tournament.dateDisplay} {tournament.year} · {tournament.location}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {step === 1 ? (
          <form className={styles.modalForm} onSubmit={handleSubmit} noValidate>
            {/* Registration info strip */}
            <div className={styles.infoStrip}>
              <div className={styles.infoItem}>
                <Trophy size={14} />
                <span>{tournament.prizePool}</span>
              </div>
              <div className={styles.infoItem}>
                <Users size={14} />
                <span>{tournament.spotsLeft} spots left</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.feeTag}>{tournament.entryFee}</span>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionLabel}>Your Details</h3>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>First Name *</label>
                  <input
                    className={`${styles.formInput} ${errors.firstName ? styles.inputError : ''}`}
                    type="text"
                    placeholder="Abdul"
                    value={form.firstName}
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  />
                  {errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Last Name *</label>
                  <input
                    className={`${styles.formInput} ${errors.lastName ? styles.inputError : ''}`}
                    type="text"
                    placeholder="Smith"
                    value={form.lastName}
                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  />
                  {errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Email Address *</label>
                  <input
                    className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Phone Number *</label>
                  <input
                    className={`${styles.formInput} ${errors.phone ? styles.inputError : ''}`}
                    type="tel"
                    placeholder="+27 82 000 0000"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                  {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                </div>
              </div>
            </div>

            {isDoubles && (
              <div className={styles.formSection}>
                <h3 className={styles.sectionLabel}>Partner Details</h3>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Partner Full Name *</label>
                  <input
                    className={`${styles.formInput} ${errors.partnerName ? styles.inputError : ''}`}
                    type="text"
                    placeholder="Your partner's name"
                    value={form.partnerName}
                    onChange={e => setForm(f => ({ ...f, partnerName: e.target.value }))}
                  />
                  {errors.partnerName && <span className={styles.fieldError}>{errors.partnerName}</span>}
                </div>
              </div>
            )}

            <div className={styles.formSection}>
              <h3 className={styles.sectionLabel}>Playing Information</h3>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>Skill Level *</label>
                  <select
                    className={`${styles.formSelect} ${errors.skillLevel ? styles.inputError : ''}`}
                    value={form.skillLevel}
                    onChange={e => setForm(f => ({ ...f, skillLevel: e.target.value }))}
                  >
                    <option value="">Select level…</option>
                    <option value="beginner">Beginner (0–1 year)</option>
                    <option value="intermediate">Intermediate (1–3 years)</option>
                    <option value="advanced">Advanced (3–5 years)</option>
                    <option value="pro">Pro / Competitive</option>
                  </select>
                  {errors.skillLevel && <span className={styles.fieldError}>{errors.skillLevel}</span>}
                </div>
                <div className={styles.formField}>
                  <label className={styles.fieldLabel}>How did you hear about us?</label>
                  <select
                    className={styles.formSelect}
                    value={form.heardAbout}
                    onChange={e => setForm(f => ({ ...f, heardAbout: e.target.value }))}
                  >
                    <option value="">Select…</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="friend">Friend / Word of Mouth</option>
                    <option value="playtomic">Playtomic</option>
                    <option value="google">Google Search</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Dietary Requirements (optional)</label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="e.g. Vegetarian, Halaal, None"
                  value={form.dietaryNeeds}
                  onChange={e => setForm(f => ({ ...f, dietaryNeeds: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.termsRow}>
              <label className={`${styles.checkboxLabel} ${errors.agreeTerms ? styles.checkboxError : ''}`}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={form.agreeTerms}
                  onChange={e => setForm(f => ({ ...f, agreeTerms: e.target.checked }))}
                />
                <span>I agree to the <a href="#" className={styles.termsLink}>tournament rules & conditions</a> and confirm all details are accurate.</span>
              </label>
              {errors.agreeTerms && <span className={styles.fieldError}>{errors.agreeTerms}</span>}
            </div>

            <div className={styles.modalFooter}>
              <p className={styles.paymentNote}>
                <Lock size={12} /> Payment of <strong>{tournament.entryFee}</strong> is collected at check-in on the day.
              </p>
              <button type="submit" className={styles.submitRegBtn} disabled={loading}>
                {loading ? (
                  <span className={styles.loadingDots}>Submitting<span>.</span><span>.</span><span>.</span></span>
                ) : (
                  <>Complete Registration <ChevronRight size={18} /></>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* ─── SUCCESS STATE ─── */
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <CheckCircle size={56} />
            </div>
            <h2 className={styles.successTitle}>You're Registered!</h2>
            <p className={styles.successSubtitle}>
              Thank you, <strong>{form.firstName}</strong>! Your spot for <strong>{tournament.title}</strong> has been reserved.
            </p>
            <div className={styles.successDetails}>
              <div className={styles.successDetailItem}>
                <Calendar size={16} />
                <span>{tournament.dateDisplay} {tournament.year}</span>
              </div>
              <div className={styles.successDetailItem}>
                <MapPin size={16} />
                <span>{tournament.location}</span>
              </div>
              <div className={styles.successDetailItem}>
                <Clock size={16} />
                <span>Check-in opens 30 mins before</span>
              </div>
            </div>
            <p className={styles.successEmail}>
              A confirmation has been sent to <strong>{form.email}</strong>
            </p>
            <button className={styles.successCloseBtn} onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════ TOURNAMENT CARD ═══════════════════ */
const TournamentCard = ({ tournament, onRegister }) => {
  const spotsPercent = Math.round(((tournament.spots - tournament.spotsLeft) / tournament.spots) * 100);
  const isSoldOut = tournament.spotsLeft === 0;
  const isAlmostFull = tournament.spotsLeft <= 5 && !isSoldOut;

  return (
    <div className={`${styles.card} ${tournament.featured ? styles.featuredCard : ''}`}>
      {tournament.featured && (
        <div className={styles.featuredBadge}>
          <Star size={12} fill="currentColor" /> Featured Event
        </div>
      )}

      {/* Date Column */}
      <div className={styles.dateBox}>
        <span className={styles.dateDay}>{tournament.dateDisplay.split(' ')[0]}</span>
        <span className={styles.dateMonth}>{tournament.dateDisplay.split(' ')[1]}</span>
        <span className={styles.dateYear}>{tournament.year}</span>
      </div>

      {/* Content */}
      <div className={styles.cardContent}>
        <div className={styles.cardTop}>
          <div className={styles.cardMeta}>
            <span
              className={styles.categoryBadge}
              style={{ background: tournament.categoryColor + '18', color: tournament.categoryColor, borderColor: tournament.categoryColor + '40' }}
            >
              {tournament.category}
            </span>
            <span className={styles.levelBadge}>{tournament.level}</span>
          </div>
          <h2 className={styles.cardTitle}>{tournament.title}</h2>
          <p className={styles.cardSubtitle}>{tournament.subtitle}</p>
          <p className={styles.cardDescription}>{tournament.description}</p>
        </div>

        <div className={styles.cardStats}>
          <div className={styles.statItem}>
            <Trophy size={14} className={styles.statIcon} />
            <span className={styles.statValue}>{tournament.prizePool}</span>
            <span className={styles.statLabel}>Prize Pool</span>
          </div>
          <div className={styles.statItem}>
            <Users size={14} className={styles.statIcon} />
            <span className={styles.statValue}>{tournament.spotsLeft}</span>
            <span className={styles.statLabel}>Spots Left</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.feeValue}>{tournament.entryFee}</span>
            <span className={styles.statLabel}>Entry Fee</span>
          </div>
        </div>

        {/* Spots progress bar */}
        <div className={styles.spotsBar}>
          <div className={styles.spotsBarLabel}>
            <span>{tournament.spots - tournament.spotsLeft} of {tournament.spots} spots filled</span>
            {isAlmostFull && <span className={styles.almostFull}>⚡ Almost full!</span>}
            {isSoldOut && <span className={styles.soldOut}>Sold Out</span>}
          </div>
          <div className={styles.progressTrack}>
            <div
              className={`${styles.progressFill} ${spotsPercent > 80 ? styles.progressHot : ''}`}
              style={{ width: `${spotsPercent}%` }}
            />
          </div>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.locationChip}>
            <MapPin size={13} />
            <span>{tournament.location}</span>
          </div>
          <button
            className={`${styles.enterBtn} ${isSoldOut ? styles.enterBtnSoldOut : ''}`}
            onClick={() => !isSoldOut && onRegister(tournament)}
            disabled={isSoldOut}
          >
            {isSoldOut ? 'Sold Out' : 'Register Now'}
            {!isSoldOut && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════ PAGE ═══════════════════ */
const TournamentsPage = () => {
  const [selectedTournament, setSelectedTournament] = useState(null);

  return (
    <>
      <div className={styles.pageContainer}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>Padel Zone Events</p>
          <h1 className={styles.title}>Upcoming Tournaments</h1>
          <p className={styles.description}>
            Test your skills against the best in the city. Our tournaments are organised by skill level
            to ensure competitive, fair, and exciting play for everyone — from beginners to seasoned pros.
          </p>
        </div>

        {/* Tournament List */}
        <div className={styles.grid}>
          {tournaments.map(t => (
            <TournamentCard key={t.id} tournament={t} onRegister={setSelectedTournament} />
          ))}
        </div>

        {/* Info Footer */}
        <div className={styles.infoFooter}>
          <div className={styles.infoCard}>
            <Trophy size={20} className={styles.infoIcon} />
            <h3>Why Compete?</h3>
            <p>Win prize money, gear, and earn rankings on the Padel Zone leaderboard.</p>
          </div>
          <div className={styles.infoCard}>
            <Users size={20} className={styles.infoIcon} />
            <h3>All Levels Welcome</h3>
            <p>We have events for beginners, intermediates, and pro-level players every season.</p>
          </div>
          <div className={styles.infoCard}>
            <MapPin size={20} className={styles.infoIcon} />
            <h3>On-Site Facilities</h3>
            <p>Pro shop, coaching warm-ups, catering, and live match commentary available.</p>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {selectedTournament && (
        <RegistrationModal
          tournament={selectedTournament}
          onClose={() => setSelectedTournament(null)}
        />
      )}
    </>
  );
};

export default TournamentsPage;
