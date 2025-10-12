import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import * as api from "../api/mockApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faSearch, faPlus, faCheckCircle, faClock, faList } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
  const [note, setNote] = useState({ title: "", description: "", status: "To Do" });
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState({ title: "", description: "" });
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchNotes = async () => {
    try {
      const data = await api.getNotes();
      setList(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchNotes();
  }, [isAuthenticated]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    
    let newError = {};
    if (!note.title.trim()) newError.title = "Title is required";
    if (!note.description.trim()) newError.description = "Description is required";

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    try {
      if (editId) {
        await api.updateNote(editId, note);
        setEditId(null);
      } else {
        await api.addNote(note);
      }
      setNote({ title: "", description: "", status: "To Do" });
      setError({});
      setShowAddForm(false);
      fetchNotes();
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const handleEdit = (n) => {
    setNote({ title: n.title, description: n.description, status: n.status });
    setEditId(n.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await api.deleteNote(id);
      fetchNotes();
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = list.filter(note =>
      note.title.toLowerCase().includes(value) ||
      note.description.toLowerCase().includes(value) ||
      note.status.toLowerCase().includes(value)
    );

    setFilteredNotes(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case "In Progress":
        return <FontAwesomeIcon icon={faClock} className="text-yellow-500" />;
      default:
        return <FontAwesomeIcon icon={faList} className="text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const displayNotes = searchTerm ? filteredNotes : list;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 pt-16">
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="text-6xl mb-6">📋</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Task Management</h1>
            <p className="text-xl text-gray-600 mb-8">Please login to access your tasks</p>
            <a
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl text-decoration-none"
            >
              Login Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {currentUser?.username}!
          </h1>
          <p className="text-lg text-gray-600">Manage your tasks efficiently</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center mx-auto"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            {showAddForm ? "Cancel" : "Add New Task"}
          </button>
        </div>

        {showAddForm && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {editId ? "Edit Task" : "Add New Task"}
              </h3>
              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter task title..."
                    value={note.title}
                    onChange={(e) => {
                      setNote({ ...note, title: e.target.value });
                      setError({});
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {error.title && (
                    <p className="text-red-500 text-sm mt-1">{error.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter task description..."
                    value={note.description}
                    onChange={(e) => {
                      setNote({ ...note, description: e.target.value });
                      setError({});
                    }}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  {error.description && (
                    <p className="text-red-500 text-sm mt-1">{error.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={note.status}
                    onChange={(e) => setNote({ ...note, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    {editId ? "Update Task" : "Add Task"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditId(null);
                      setNote({ title: "", description: "", status: "To Do" });
                      setError({});
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {displayNotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm ? "No tasks found" : "No tasks yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search terms" : "Create your first task to get started!"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {displayNotes
                .slice()
                .reverse()
                .map((task, i) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-800 mr-3">
                              {task.title}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                              {getStatusIcon(task.status)}
                              <span className="ml-1">{task.status}</span>
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">{task.description}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(task)}
                            className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                            title="Edit task"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            title="Delete task"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {list.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{list.filter(t => t.status === "To Do").length}</div>
                  <div className="text-sm text-gray-600">To Do</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{list.filter(t => t.status === "In Progress").length}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{list.filter(t => t.status === "Completed").length}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
