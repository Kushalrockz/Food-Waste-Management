import { useState } from "react";
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import { FaUtensils, FaImage, FaMapMarkerAlt } from "react-icons/fa";

export default function FoodWasteEntryForm() {
  const [form, setForm] = useState({
    donor: "",
    category: "",
    food_item_name: "",
    description: "",
    quantity: "",
    unit: "",
    expiry_date: "",
    condition: "",
    pickup_address: "",
    pickup_city: "",
    photo: null,
    is_available: true,
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
        donorId: form.donor ? Number(form.donor) : null,
        foodItemName: form.food_item_name,
        description: form.description,
        quantity: form.quantity,
        expiryDate: form.expiry_date,
        pickupAddress: form.pickup_address,
        pickupCity: form.pickup_city,
        isAvailable: form.is_available,
      };

      const res = await api.post(ENDPOINTS.foodWasteEntry, payload);

      alert("Waste entry saved");
      console.log(res.data);

      setForm({
        donor: "",
        category: "",
        food_item_name: "",
        description: "",
        quantity: "",
        unit: "",
        expiry_date: "",
        condition: "",
        pickup_address: "",
        pickup_city: "",
        photo: null,
        is_available: true,
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
          <FaUtensils size={26} />
          <h2>Food Waste Entry</h2>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>

          <input name="donor" placeholder="Donor ID" value={form.donor} onChange={onChange} style={styles.input} />

          <input name="category" placeholder="Category" value={form.category} onChange={onChange} style={styles.input} />

          <input name="food_item_name" placeholder="Food Item Name" value={form.food_item_name} onChange={onChange} style={styles.input} />

          <input name="description" placeholder="Description" value={form.description} onChange={onChange} style={styles.input} />

          <input name="quantity" placeholder="Quantity" value={form.quantity} onChange={onChange} style={styles.input} />

          <input name="unit" placeholder="Unit (kg, plates...)" value={form.unit} onChange={onChange} style={styles.input} />

          <input name="expiry_date" type="date" value={form.expiry_date} onChange={onChange} style={styles.input} />

          <input name="condition" placeholder="Condition (Fresh / Stale)" value={form.condition} onChange={onChange} style={styles.input} />

          <div style={styles.row}>
            <input name="pickup_address" placeholder="Pickup Address" value={form.pickup_address} onChange={onChange} style={styles.input} />
            <input name="pickup_city" placeholder="City" value={form.pickup_city} onChange={onChange} style={styles.input} />
          </div>

          {/* FILE */}
          <label style={styles.fileBox}>
            <FaImage />
            <span>Upload Food Image</span>
            <input type="file" name="photo" onChange={onChange} hidden />
          </label>

          {/* CHECKBOX */}
          <label style={styles.checkbox}>
            <input type="checkbox" name="is_available" checked={form.is_available} onChange={onChange} />
            Available for Pickup
          </label>

          <button type="submit" style={styles.button}>
            Save Entry
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
    width: "500px",
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
  row: {
    display: "flex",
    gap: "10px",
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