import React from 'react';
import styles from './TournamentsPage.module.css';

const tournaments = [
  {
    id: 1,
    date: '15 JAN 2026',
    title: 'Durban North Smash',
    description: 'Our flagship mixed-doubles event. Open to intermediate and advanced players. Fantastic prizes up for grabs.',
    location: 'Radar Drive Courts'
  },
  {
    id: 2,
    date: '02 FEB 2026',
    title: 'Padel Zone Masters',
    description: 'A weekend-long masters event focusing on strategic play. Includes a lunch pack and event t-shirt.',
    location: 'Main Arena Durban'
  }
];

const TournamentsPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>UPCOMING TOURNAMENTS</h1>
        <p className={styles.description}>
          Test your skills against the best in the city. Our tournaments are categorized by skill level to ensure competitive play for everyone.
        </p>
      </div>

      <div className={styles.grid}>
        {tournaments.map((tournament) => {
          const [day, ...rest] = tournament.date.split(' ');
          const monthYear = rest.join(' ');
          
          return (
            <div key={tournament.id} className={styles.card}>
              <div className={styles.dateBox}>
                <span className={styles.dateDay}>{day}</span>
                <span className={styles.dateMonthYear}>{monthYear}</span>
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{tournament.title}</h2>
                <p className={styles.cardDescription}>{tournament.description}</p>
                <div className={styles.cardFooter}>
                  <div className={styles.location}>
                    <span>📍</span> {tournament.location}
                  </div>
                  <button className={`btn-primary ${styles.enterBtn}`}>
                    Enter Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TournamentsPage;
