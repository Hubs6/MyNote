document.addEventListener("DOMContentLoaded", () => {
  const notesList = document.getElementById("noteslist"); // Tworzy stałą notesList, która pobiera tablicę <ul> z HTML.
  const titleInput = document.getElementById("title"); // Tworzy stałą titleInput, która pobiera pole tekstowe <input> z HTML.
  const warningSpan = document.getElementById("warning"); // Tworzy stałą warningSpan, która pobiera <span> z HTML.
  const editor = document.getElementById("editor");
  const noteContent = document.getElementById("notecontent");
  const saveNoteButton = document.getElementById("savenote");
  const quitNoteButton = document.getElementById("quitnote");

  let currentNoteIndex = null;

  // Funkcja odpowiadająca za dodawanie notatek do localStorage:

  const addNote = () => {
    const title = titleInput.value.trim(); // Tworzy stałą title (tytuł notatki), która ma wartość wpisaną do okna <input> w HTML, a trim() ucina spacje przed i po ciągu znaków.

    if (title === "") {
      warningSpan.textContent = "Uzupełnij puste pole"; // Jeśli miejsce na tytuł pozostaje puste wyskakuje komunikat o uzupełnieniu pola.
      warningSpan.style.display = "block"; // Początkowo warningSpan jest ukryty, więc ten zapis odpowiada za pokazanie go jeśli spełniony jest warunek if.
      return;
    }

    const notes = JSON.parse(localStorage.getItem("notes")) || []; // Pobiera dane o notatkach z lokalnej pamięci-> Przekształca je na obiekt lub tablicę [].
    notes.push({ title: title, content: "" }); // Dodaje nową notatkę.
    localStorage.setItem("notes", JSON.stringify(notes)); // Zapis do localStorage.
    titleInput.value = ""; // Wyczyść input.
    warningSpan.style.display = "none"; // Ukrywa warning.
    loadNotes(); // Załaduj notatki.
  };

  // Funkcja odpowiadająca za ładowanie notatek i wyświetlanie na stronie:

  const loadNotes = () => {
    notesList.innerHTML = ""; // Wyczyść listę.
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.forEach((note, index) => {
      const li = document.createElement("li");
      li.textContent = note.title;

      li.addEventListener("click", () => openEditor(index));

      // Tworzenie przycisku DELETE:

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "delete";
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteNote(index);
      });
      deleteButton.id = "delete-button";
      li.appendChild(deleteButton); // Dodaje przycisk do listy- nowo utworzonej notatki.
      notesList.appendChild(li);
    });
  };

  const openEditor = (index) => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    currentNoteIndex = index;
    noteContent.value = notes[index].content;
    editor.style.display = "block";
  };

  saveNoteButton.addEventListener("click", () => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes[currentNoteIndex].content = noteContent.value;
    localStorage.setItem("notes", JSON.stringify(notes));
    editor.style.display = "none";

    loadNotes();
  });

  quitNoteButton.addEventListener("click", () => {
    editor.style.display = "none";
    noteContent.value = "";
  });

  // Funkcja do usuwania notatek:

  const deleteNote = (index) => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.splice(index, 1); // Usunięcie notatki.
    localStorage.setItem("notes", JSON.stringify(notes)); //Zapisanie zaktualizowanej listy notatek.
    editor.style.display = "none";
    loadNotes(); // Załaduj notatki ponownie.
  };

  document.getElementById("addnote").addEventListener("click", addNote); // Nasłuchiwanie na kliknięcie by dodać notatkę.
  loadNotes(); // Początkowe załadowanie notatek.
});
