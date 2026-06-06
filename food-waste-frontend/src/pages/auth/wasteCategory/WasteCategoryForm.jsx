import { useState } from "react";
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import { FaRecycle, FaImage } from "react-icons/fa";

export default function WasteCategoryForm() {
  const [form, setForm] = useState({
    category_name: "",
    description: "",
    parent_category: "",
    image: null,
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
        categoryName: form.category_name,
        description: form.description,
        parentCategory: form.parent_category ? Number(form.parent_category) : null,
        image: form.image ? form.image.name : "",
        isActive: form.is_active,
      };

      const res = await api.post(ENDPOINTS.wasteCategory, payload);

      alert("Waste category saved");
      console.log(res.data);
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
          <FaRecycle size={28} />
          <h2>Waste Category</h2>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>

          <input
            name="category_name"
            placeholder="Category Name"
            value={form.category_name}
            onChange={onChange}
            style={styles.input}
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={onChange}
            style={styles.input}
          />

          <input
            name="parent_category"
            placeholder="Parent Category"
            value={form.parent_category}
            onChange={onChange}
            style={styles.input}
          />

          {/* FILE INPUT */}
          <label style={styles.fileBox}>
            <FaImage />
            <span>Upload Image</span>
            <input type="file" name="image" onChange={onChange} hidden />
          </label>

          {/* CHECKBOX */}
          <label style={styles.checkbox}>
            <input
              name="is_active"
              type="checkbox"
              checked={form.is_active}
              onChange={onChange}
            />
            Active
          </label>

          {/* BUTTON */}
          <button type="submit" style={styles.button}>
            Save Category
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
    width: "420px",
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