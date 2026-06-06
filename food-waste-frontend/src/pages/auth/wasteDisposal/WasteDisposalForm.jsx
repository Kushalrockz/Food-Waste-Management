import { useState } from "react";
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import { FaTrashAlt, FaCalendarAlt } from "react-icons/fa";

export default function WasteDisposalForm() {
  const [form, setForm] = useState({
    collection_request: "",
    recycling_center: "",
    disposal_method: "",
    disposal_date: "",
    quantity_processed: "",
    composted_output: "",
    status: "",
    remarks: "",
  });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        quantity_processed:
          form.quantity_processed === "" ? null : Number(form.quantity_processed),
        composted_output:
          form.composted_output === "" ? null : Number(form.composted_output),
      };

      const res = await api.post(ENDPOINTS.wasteDisposal, payload);

      alert("Waste disposal saved");
      console.log(res.data);

      // reset form
      setForm({
        collection_request: "",
        recycling_center: "",
        disposal_method: "",
        disposal_date: "",
        quantity_processed: "",
        composted_output: "",
        status: "",
        remarks: "",
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
          <FaTrashAlt size={26} />
          <h2>Waste Disposal</h2>
        </div>

        <form onSubmit={onSubmit} style={styles.form}>

          <input name="collection_request" placeholder="Collection Request ID" value={form.collection_request} onChange={onChange} style={styles.input} />

          <input name="recycling_center" placeholder="Recycling Center ID" value={form.recycling_center} onChange={onChange} style={styles.input} />

          <input name="disposal_method" placeholder="Disposal Method (Recycle / Compost)" value={form.disposal_method} onChange={onChange} style={styles.input} />

          <div style={styles.inputGroup}>
            <FaCalendarAlt />
            <input type="date" name="disposal_date" value={form.disposal_date} onChange={onChange} style={styles.input} />
          </div>

          <input name="quantity_processed" placeholder="Quantity Processed" value={form.quantity_processed} onChange={onChange} style={styles.input} />

          <input name="composted_output" placeholder="Composted Output" value={form.composted_output} onChange={onChange} style={styles.input} />

          <input name="status" placeholder="Status (Completed / Pending)" value={form.status} onChange={onChange} style={styles.input} />

          <input name="remarks" placeholder="Remarks" value={form.remarks} onChange={onChange} style={styles.input} />

          <button type="submit" style={styles.button}>
            Save Disposal
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
  button: {
    padding: "10px",
    background: "#38bdf8",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};