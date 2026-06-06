export default function FormCard({ title, children }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{title}</h2>
      {children}
    </div>
  );
}

const styles = {
  card: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "25px",
    borderRadius: "12px",
    background: "#1e293b",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
  },
  title: {
    marginBottom: "20px",
    textAlign: "center",
  },
};