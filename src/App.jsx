// this front work without back end 
// import React, { useState, useEffect } from "react";

// function App() {
//   const [contact, setContact] = useState({ nom: "", email: "", numeroTel: "" });
//   const [contacts, setContacts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filteredContacts, setFilteredContacts] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);

//   useEffect(() => {
//     const savedContacts = localStorage.getItem("contacts");
//     const parsedContacts = savedContacts ? JSON.parse(savedContacts) : [];
//         setContacts(parsedContacts);
//   }, []);

//   useEffect(() => {
//     if (contacts.length > 0) {
//       localStorage.setItem("contacts", JSON.stringify(contacts));
//     }
//   }, [contacts]);

//   useEffect(() => {
//     setFilteredContacts(
//       contacts.filter((c) =>
//         c.nom.toLowerCase().includes(search.toLowerCase())
//       )
//     );
//   }, [search, contacts]);

//   const ajouterContact = () => {
//     if (!contact.nom || !contact.email || !contact.numeroTel) {
//       alert("Tous les champs doivent être remplis.");
//       return;
//     }

//     if (editIndex !== null) {
//       const updatedContacts = [...contacts];
//       updatedContacts[editIndex] = contact;
//       setContacts(updatedContacts);
//       setEditIndex(null);
//     } else {
//       setContacts([...contacts, contact]);
//     }

//     setContact({ nom: "", email: "", numeroTel: "" });
//   };

//   const editContact = (index) => {
//     setContact(contacts[index]);
//     setEditIndex(index);
//   };

//   const supprimerContact = (index) => {
//     const nouvellesContacts = contacts.filter((_, i) => i !== index);
//     setContacts(nouvellesContacts);
//   };

//   return (
//     <div>
//       <h1>Ma liste du contacts</h1>

//       <div>
//         <input
//           type="text"
//           value={contact.nom}
//           onChange={(e) => setContact({ ...contact, nom: e.target.value })}
//           placeholder="Nom"
//         />
//         <input
//           type="email"
//           value={contact.email}
//           onChange={(e) => setContact({ ...contact, email: e.target.value })}
//           placeholder="Email"
//         />
//         <input
//           type="text"
//           value={contact.numeroTel}
//           onChange={(e) =>
//             setContact({ ...contact, numeroTel: e.target.value })
//           }
//           placeholder="Numéro de téléphone"
//         />
//         <button onClick={ajouterContact}>
//           {editIndex !== null ? "Mettre à jour" : "Ajouter"}
//         </button>
//       </div>

//       <div>
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Rechercher par nom"
//         />
//       </div>

//       <ul>
//         {filteredContacts.map((c, index) => (
//           <li key={index} >
//             {c.nom} | {c.email} | {c.numeroTel}{" "}
//             <button onClick={() => editContact(index)}>Modifier</button>
//             <button onClick={() => supprimerContact(index)}>Supprimer</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from "react";
import { fetchContacts, fetchPaginatedContacts, addContact, deleteContact, updateContact } from "./api";

function App() {
  const [contact, setContact] = useState({ nom: "", email: "", telephone: "" });
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await fetchContacts();
        setContacts(data);
        setFilteredContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    loadContacts();
  }, []);

  useEffect(() => {
    const loadPaginatedContacts = async () => {
      try {
        const { data } = await fetchPaginatedContacts(page, limit, search);
        setFilteredContacts(data);
      } catch (error) {
        console.error("Error fetching paginated contacts:", error);
      }
    };
    loadPaginatedContacts();
  }, [page, search]);

  const ajouterContact = async () => {
    if (!contact.nom || !contact.email || !contact.telephone) {
      alert("Tous les champs doivent être remplis.");
      return;
    }

    try {
      if (editIndex !== null) {
        const updatedContact = await updateContact(contacts[editIndex].id, contact);
        const updatedContacts = [...contacts];
        updatedContacts[editIndex] = updatedContact;
        setContacts(updatedContacts);
        setFilteredContacts(updatedContacts);
        setEditIndex(null);
      } else {
        const newContact = await addContact(contact);
        setContacts([...contacts, newContact]);
        setFilteredContacts([...contacts, newContact]);
      }
      setContact({ nom: "", email: "", telephone: "" });
    } catch (error) {
      console.error("Error adding/updating contact:", error);
    }
  };

  const editContact = (index) => {
    setContact(contacts[index]);
    setEditIndex(index);
  };

  const supprimerContact = async (index) => {
    try {
      const contactId = contacts[index].id;
      await deleteContact(contactId);
      const nouvellesContacts = contacts.filter((_, i) => i !== index);
      setContacts(nouvellesContacts);
      setFilteredContacts(nouvellesContacts);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div>
      <h1>Ma liste des contacts</h1>

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
        value={contact.telephone}
        onChange={(e) => setContact({ ...contact, telephone: e.target.value })}
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
          <li key={index}>
            {c.nom} | {c.email} | {c.telephone}{" "}
            <button onClick={() => editContact(index)}>Modifier</button>
            <button onClick={() => supprimerContact(index)}>Supprimer</button>
          </li>
        ))}
      </ul>

      <div>
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Précédent
        </button>
        <button onClick={handleNextPage}>Suivant</button>
      </div>
    </div>
  );
}

export default App;
