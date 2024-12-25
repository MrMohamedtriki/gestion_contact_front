import React, { useState, useEffect } from "react";

function App() {
  const [contact, setContact] = useState({ nom: "", email: "", numeroTel: "" });
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedContacts = localStorage.getItem("contacts");
    const parsedContacts = savedContacts ? JSON.parse(savedContacts) : [];
        setContacts(parsedContacts);
  }, []);

  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem("contacts", JSON.stringify(contacts));
    }
  }, [contacts]);

  useEffect(() => {
    setFilteredContacts(
      contacts.filter((c) =>
        c.nom.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, contacts]);

  const ajouterContact = () => {
    if (!contact.nom || !contact.email || !contact.numeroTel) {
      alert("Tous les champs doivent être remplis.");
      return;
    }

    if (editIndex !== null) {
      const updatedContacts = [...contacts];
      updatedContacts[editIndex] = contact;
      setContacts(updatedContacts);
      setEditIndex(null);
    } else {
      setContacts([...contacts, contact]);
    }

    setContact({ nom: "", email: "", numeroTel: "" });
  };

  const editContact = (index) => {
    setContact(contacts[index]);
    setEditIndex(index);
  };

  const supprimerContact = (index) => {
    const nouvellesContacts = contacts.filter((_, i) => i !== index);
    setContacts(nouvellesContacts);
  };

  return (
    <div>
      <h1>Ma liste du contacts</h1>

      <div>
        <input
          type="text"
          value={contact.nom}
          onChange={(e) => setContact({ ...contact, nom: e.target.value })}
          placeholder="Nom"
        />
        <input
          type="email"
          value={contact.email}
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
          placeholder="Email"
        />
        <input
          type="text"
          value={contact.numeroTel}
          onChange={(e) =>
            setContact({ ...contact, numeroTel: e.target.value })
          }
          placeholder="Numéro de téléphone"
        />
        <button onClick={ajouterContact}>
          {editIndex !== null ? "Mettre à jour" : "Ajouter"}
        </button>
      </div>

      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom"
        />
      </div>

      <ul>
        {filteredContacts.map((c, index) => (
          <li key={index} >
            {c.nom} | {c.email} | {c.numeroTel}{" "}
            <button onClick={() => editContact(index)}>Modifier</button>
            <button onClick={() => supprimerContact(index)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
