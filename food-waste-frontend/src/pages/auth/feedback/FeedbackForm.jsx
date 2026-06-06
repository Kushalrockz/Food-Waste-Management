import { useState } from "react";
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import { FaStar, FaCalendarAlt, FaUpload, FaCommentDots } from "react-icons/fa";

export default function FeedbackForm() {
  const [form, setForm] = useState({
    reviewer: "",
    donor: "",
    recycling_center: "",
    rating: "",
    comments: "",
    review_date: "",
    photo: null,
  });

  const onChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") return setForm({ ...form, [name]: files?.[0] ?? null });
    setForm({ ...form, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        reviewerId: form.reviewer ? Number(form.reviewer) : null,
        donorId: form.donor ? Number(form.donor) : null,
        recyclingCenterId: form.recycling_center ? Number(form.recycling_center) : null,
        rating: form.rating ? Number(form.rating) : 0,
        comments: form.comments,
        reviewDate: form.review_date,
        photo: form.photo ? form.photo.name : "",
      };

      const res = await api.post(ENDPOINTS.feedback, payload);

      alert("Feedback saved");
      console.log(res.data);

      setForm({
        reviewer: "",
        donor: "",
        recycling_center: "",
        rating: "",
        comments: "",
        review_date: "",
        photo: null,
      });

    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.header}>
          <FaCommentDots size={26} />
          <h2>Submit Feedback</h2>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>

          <input name="reviewer" placeholder="Reviewer ID" value={form.reviewer} onChange={onChange} style={styles.input} />

          <input name="donor" placeholder="Donor ID" value={form.donor} onChange={onChange} style={styles.input} />

          <input name="recycling_center" placeholder="Recycling Center ID" value={form.recycling_center} onChange={onChange} style={styles.input} />

          {/* RATING */}
          <div style={styles.inputGroup}>
            <FaStar />
            <input
              name="rating"
              type="number"
              placeholder="Rating (1-5)"
              value={form.rating}
              onChange={onChange}
              min="1"
              max="5"
              style={styles.input}
            />
          </div>

          {/* COMMENTS */}
          <textarea
            name="comments"
            placeholder="Write your feedback..."
            value={form.comments}
            onChange={onChange}
            style={styles.textarea}
          />

          {/* DATE */}
          <div style={styles.inputGroup}>
            <FaCalendarAlt />
            <input
              type="date"
              name="review_date"
              value={form.review_date}
              onChange={onChange}
              style={styles.input}
            />
          </div>

          {/* FILE */}
          <label style={styles.fileBox}>
            <FaUpload />
            <span>Upload Photo (optional)</span>
            <input type="file" name="photo" onChange={onChange} hidden />
          </label>

          <button type="submit" style={styles.button}>
            Submit Feedback
          </button>

        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
  },
  card: {
    width: "520px",
    padding: "25px",
    borderRadius: "12px",
    background: "#1e293b",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
    color: "white",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#334155",
    padding: "5px",
    borderRadius: "8px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    minHeight: "80px",
  },
  fileBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#334155",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  button: {
    padding: "10px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};