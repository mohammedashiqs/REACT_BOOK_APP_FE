import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    bookId: '',
    bookName: '',
    authorName: '',
    publishedYear: '',
    price: ''
  });
  const [editingBook, setEditingBook] = useState(null);

  // Fetch all books
  useEffect(() => {
    axios.get('http://localhost:3001/books')
      .then(response => {
        setBooks(response.data.books); // response.data.books because backend returns books array
      })
      .catch(error => console.log(error));
  }, []);

  // Add new book
  const addBook = () => {
    if (newBook.bookName && newBook.authorName) {
      axios.post('http://localhost:3001/books', newBook)
        .then(response => {
          setBooks([...books, response.data]);
          setNewBook({ bookId: '', bookName: '', authorName: '', publishedYear: '', price: '' });
        })
        .catch(error => console.log(error));
    }
  };

  // Delete book (mark as deleted)
  const deleteBook = (id) => {
    axios.delete(`http://localhost:3001/books/${id}`)
      .then(() => {
        setBooks(books.filter(book => book._id !== id));
      })
      .catch(error => console.log(error));
  };

  // Edit book
  const editBook = (id) => {
    const bookToEdit = books.find(book => book._id === id);
    setEditingBook(bookToEdit);
  };

  // Update book
  const updateBook = () => {
    if (editingBook) {
      axios.put(`http://localhost:3001/books/${editingBook._id}`, editingBook)
        .then(response => {
          setBooks(books.map(book => book._id === editingBook._id ? response.data : book));
          setEditingBook(null);
        })
        .catch(error => console.log(error));
    }
  };

  // Handle change for both new and editing book fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingBook) {
      setEditingBook({ ...editingBook, [name]: value });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  return (
    <div className="App">
      <h1>CRUD Application for Books</h1>

      {/* Add / Edit Book Form */}
      <div>
        <input 
          type="text" 
          name="bookId" 
          placeholder="Book ID"
          value={editingBook ? editingBook.bookId : newBook.bookId} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="bookName" 
          placeholder="Book Name" 
          value={editingBook ? editingBook.bookName : newBook.bookName} 
          onChange={handleChange} 
        />
        <input 
          type="text" 
          name="authorName" 
          placeholder="Author Name" 
          value={editingBook ? editingBook.authorName : newBook.authorName} 
          onChange={handleChange} 
        />
        <input 
          type="number" 
          name="publishedYear" 
          placeholder="Published Year" 
          value={editingBook ? editingBook.publishedYear : newBook.publishedYear} 
          onChange={handleChange} 
        />
        <input 
          type="number" 
          name="price" 
          placeholder="Price" 
          value={editingBook ? editingBook.price : newBook.price} 
          onChange={handleChange} 
        />
        {editingBook ? (
          <button onClick={updateBook}>Update Book</button>
        ) : (
          <button onClick={addBook}>Add Book</button>
        )}
      </div>

      {/* Book List */}
      <ul>
        {books.map(book => (
          <li key={book._id}>
            <strong>{book.bookName}</strong> by {book.authorName} ({book.publishedYear}) - ${book.price}
            <button onClick={() => editBook(book._id)}>Edit</button>
            <button onClick={() => deleteBook(book._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
