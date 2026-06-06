import { useState } from "react";
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import { FaRecycle, FaImage, FaPhone } from "react-icons/fa";

export default function RecyclingCenterForm() {
  const [form, setForm] = useState({
    manager: "",
    center_name: "",
    center_type: "",
    capacity: "",
    processing_method: "",
    location: "",
    city: "",
    contact_number: "",
    photo: null,
    is_active: true,
  });

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") return setForm({ ...form, [name]: checked });
    if (type === "file") return setForm({ ...form, [name]: files?.[0] ?? null });

    setForm({ ...form, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        managerId: form.manager ? Number(form.manager) : null,
        centerName: form.center_name,
        centerType: form.center_type,
        capacity: form.capacity ? Number(form.capacity) : 0,
        processingMethod: form.processing_method,
        location: form.location,
        city: form.city,
        contactNumber: form.contact_number,
        photo: form.photo ? form.photo.name : "",
        isActive: form.is_active,
      };

      const res = await api.post(ENDPOINTS.recyclingCenter, payload);

      alert("Recycling center saved");
      console.log(res.data);

      setForm({
        manager: "",
        center_name: "",
        center_type: "",
        capacity: "",
        processing_method: "",
        location: "",
        city: "",
        contact_number: "",
        photo: null,
        is_active: true,
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
          <FaRecycle size={26} />
          <h2>Recycling Center</h2>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>

          <input name="manager" placeholder="Manager ID" value={form.manager} onChange={onChange} style={styles.input} />

          <input name="center_name" placeholder="Center Name" value={form.center_name} onChange={onChange} style={styles.input} />

          <input name="center_type" placeholder="Center Type" value={form.center_type} onChange={onChange} style={styles.input} />

          <input name="capacity" placeholder="Capacity" value={form.capacity} onChange={onChange} style={styles.input} />

          <input name="processing_method" placeholder="Processing Method" value={form.processing_method} onChange={onChange} style={styles.input} />

          <div style={styles.row}>
            <input name="location" placeholder="Location" value={form.location} onChange={onChange} style={styles.input} />
            <input name="city" placeholder="City" value={form.city} onChange={onChange} style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <FaPhone />
            <input name="contact_number" placeholder="Contact Number" value={form.contact_number} onChange={onChange} style={styles.input} />
          </div>

          {/* FILE */}
          <label style={styles.fileBox}>
            <FaImage />
            <span>Upload Center Photo</span>
            <input type="file" name="photo" onChange={onChange} hidden />
          </label>

          {/* CHECKBOX */}
          <label style={styles.checkbox}>
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={onChange} />
            Active Center
          </label>

          <button type="submit" style={styles.button}>
            Save Center
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
  row: {
    display: "flex",
    gap: "10px",
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
  fileBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#334155",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
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