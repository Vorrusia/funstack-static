import styles from "./NotFound.module.css";

export const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.description}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href={import.meta.env.BASE_URL} className={styles.homeButton}>
        Go Home
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
};
