import { v4 as uuidv4 } from "uuid";

const USERS_KEY = "mock_users";
const NOTES_KEY = "mock_notes";

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

const load = (key, fallback) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

//AUTH
export async function register(username, email, password) {
  await delay();
  const users = load(USERS_KEY, []);
  if (users.some(u => u.email === email)) throw new Error("User already exists");
  const newUser = { id: uuidv4(), username, email, password };
  users.push(newUser);
  save(USERS_KEY, users);
  return { message: "Registered successfully", user: newUser };
}

let users = [
  { id: 1, username: "guest", email: "guest@gmail.com", password: "123" },
];

let fakeToken = "fake-jwt-token";

export const login = async ({ email, password }) => {
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid credentials");

  localStorage.setItem("token", fakeToken);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("isAuthenticated", "true");

  return { token: fakeToken, user };
};

export const logout = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isAuthenticated");
};

export const getCurrentUser = () => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  if (storedUser && token) {
    const user = JSON.parse(storedUser);
    return { ...user, userId: user.id }; 
  }
  return null;
};

//NOTES
export async function getNotes() {
  await delay();
  const auth = getCurrentUser();
  if (!auth) throw new Error("Not authenticated");
  const notes = load(NOTES_KEY, []);
  return notes.filter(n => n.userId === auth.userId);
}

export async function addNote(noteData) {
  await delay();
  const auth = getCurrentUser();
  if (!auth) throw new Error("Not authenticated");
  const notes = load(NOTES_KEY, []);
  const newNote = {
    id: uuidv4(),
    userId: auth.userId,
    title: noteData.title,
    description: noteData.description,
    status: noteData.status || "To Do"
  };
  notes.push(newNote);
  save(NOTES_KEY, notes);
  return newNote;
}

export async function updateNote(id, patch) {
  await delay();
  const auth = getCurrentUser();
  if (!auth) throw new Error("Not authenticated");
  const notes = load(NOTES_KEY, []);
  const idx = notes.findIndex(n => n.id === id && n.userId === auth.userId);
  if (idx === -1) throw new Error("Note not found");
  notes[idx] = { ...notes[idx], ...patch };
  save(NOTES_KEY, notes);
  return notes[idx];
}

export async function deleteNote(id) {
  await delay();
  const auth = getCurrentUser();
  if (!auth) throw new Error("Not authenticated");
  const notes = load(NOTES_KEY, []);
  const updated = notes.filter(n => !(n.id === id && n.userId === auth.userId));
  save(NOTES_KEY, updated);
}
