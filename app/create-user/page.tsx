"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client once outside the component
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AddNotePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");

  const addNote = async (newNote: {
    name: string;
    phone: number;
    email: string;
    age: number;
  }) => {
    const { error } = await supabase.from("contact_info").insert([newNote]);
    if (error) {
      setMessage("Failed to add note");
      console.error("Error adding note:", error.message);
    } else {
      setMessage("Note added successfully!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const note = { name, phone: parseInt(phone), email, age: parseInt(age) };
    await addNote(note);
    setName("");
    setPhone("");
    setEmail("");
    setAge("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <button type="submit">Add Note</button>
      </form>

      {message && <p>{message}</p>}
 
    </div>
  );
}
