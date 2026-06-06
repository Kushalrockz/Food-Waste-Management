import { useState } from "react";
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import { FaUser, FaBuilding, FaImage } from "react-icons/fa";

export default function FoodDonorForm() {
  const [form, setForm] = useState({
    user: "",
    organization_name: "",
    donor_type: "",
    experience_years: "",
    bio: "",
    rating: "",
    location: "",
    profile_photo: null,
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
        userId: form.user ? Number(form.user) : null,
        organizationName: form.organization_name,
        donorType: form.donor_type,
        experienceYears: form.experience_years ? Number(form.experience_years) : 0,
        bio: form.bio,
        rating: form.rating ? Number(form.rating) : 0,
        location: form.location,
        profilePhoto: form.profile_photo ? form.profile_photo.name : "",
      };

      const res = await api.post(ENDPOINTS.foodDonor, payload);

      alert("Food donor saved");
      console.log(res.data);

      setForm({
        user: "",
        organization_name: "",
        donor_type: "",
        experience_years: "",
        bio: "",
        rating: "",
        location: "",
        profile_photo: null,
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
          <FaUser size={26} />
          <h2>Food Donor</h2>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>

          <input name="user" placeholder="User ID / Email" value={form.user} onChange={onChange} style={styles.input} />

          <input name="organization_name" placeholder="Organization Name" value={form.organization_name} onChange={onChange} style={styles.input} />

          <input name="donor_type" placeholder="Donor Type (Hotel, NGO...)" value={form.donor_type} onChange={onChange} style={styles.input} />

          <input name="experience_years" placeholder="Experience (years)" value={form.experience_years} onChange={onChange} style={styles.input} />

          <input name="bio" placeholder="Short Bio" value={form.bio} onChange={onChange} style={styles.input} />

          <input name="rating" placeholder="Rating (1-5)" value={form.rating} onChange={onChange} style={styles.input} />

          <input name="location" placeholder="Location" value={form.location} onChange={onChange} style={styles.input} />

          {/* FILE INPUT */}
          <label style={styles.fileBox}>
            <FaImage />
            <span>Upload Profile Photo</span>
            <input type="file" name="profile_photo" onChange={onChange} hidden />
          </label>

          <button type="submit" style={styles.button}>
            Save Donor
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
    width: "450px",
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
    marginBottom: "20px",
    justifyContent: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
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
    background: "#38bdf8",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};