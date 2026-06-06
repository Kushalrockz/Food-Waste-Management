import { useState } from "react";
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import { FaTruck, FaCalendarAlt } from "react-icons/fa";

export default function CollectionRequestForm() {
  const [form, setForm] = useState({
    collector: "",
    waste_entry: "",
    request_date: "",
    pickup_date: "",
    pickup_time: "",
    collection_status: "",
    special_instructions: "",
    quantity_collected: "",
    tracking_number: "",
  });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        collectorId: form.collector ? Number(form.collector) : null,
        foodId: form.waste_entry ? Number(form.waste_entry) : null,
        requestDate: form.request_date || null,
        pickupDate: form.pickup_date || null,
        collectionStatus: form.collection_status?.trim().toUpperCase() || "PENDING",
        specialInstructions: form.special_instructions || null,
        quantityCollected: form.quantity_collected === "" ? null : Number(form.quantity_collected),
        trackingNumber: form.tracking_number || null,
      };

      const res = await api.post(ENDPOINTS.collectionRequest, payload);

      alert("Collection request saved");
      console.log(res.data);

      // reset form
      setForm({
        collector: "",
        waste_entry: "",
        request_date: "",
        pickup_date: "",
        pickup_time: "",
        collection_status: "",
        special_instructions: "",
        quantity_collected: "",
        tracking_number: "",
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
          <FaTruck size={26} />
          <h2>Collection Request</h2>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>

          <input name="collector" placeholder="Collector ID" value={form.collector} onChange={onChange} style={styles.input} />

          <input name="waste_entry" placeholder="Waste Entry ID" value={form.waste_entry} onChange={onChange} style={styles.input} />

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <FaCalendarAlt />
              <input type="date" name="request_date" value={form.request_date} onChange={onChange} style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <FaCalendarAlt />
              <input type="date" name="pickup_date" value={form.pickup_date} onChange={onChange} style={styles.input} />
            </div>
          </div>

          <input type="time" name="pickup_time" value={form.pickup_time} onChange={onChange} style={styles.input} />

          <input name="collection_status" placeholder="Status (Pending / Done)" value={form.collection_status} onChange={onChange} style={styles.input} />

          <input name="special_instructions" placeholder="Special Instructions" value={form.special_instructions} onChange={onChange} style={styles.input} />

          <input name="quantity_collected" placeholder="Quantity Collected" value={form.quantity_collected} onChange={onChange} style={styles.input} />

          <input name="tracking_number" placeholder="Tracking Number" value={form.tracking_number} onChange={onChange} style={styles.input} />

          <button type="submit" style={styles.button}>
            Save Request
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
    gap: "5px",
    background: "#334155",
    padding: "5px",
    borderRadius: "8px",
    flex: 1,
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
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