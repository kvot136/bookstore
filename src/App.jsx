import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

ModuleRegistry.registerModules([AllCommunityModule]);

function App() {
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);

  const [book, setBook] = useState({
    title: '',
    author: '',
    year: '',
    isbn: '',
    price: ''
  });

  const booksUrl = 'TEST URL/books';

  const columnDefs = [
    { field: 'title', headerName: 'Title', sortable: true, filter: true },
    { field: 'author', headerName: 'Author', sortable: true, filter: true },
    { field: 'year', headerName: 'Year', sortable: true, filter: true },
    { field: 'isbn', headerName: 'Isbn', sortable: true, filter: true },
    { field: 'price', headerName: 'Price', sortable: true, filter: true },
    {
      headerName: '',
      field: 'id',
      sortable: false,
      filter: false,
      cellRenderer: (params) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => deleteBook(params.value)}
        >
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  const fetchBooks = () => {
    fetch(`${booksUrl}.json`)
      .then(response => response.json())
      .then(data => addKeys(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addKeys = (data) => {
    if (!data) {
      setBooks([]);
      return;
    }

    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => ({
      ...item,
      id: keys[index]
    }));

    setBooks(valueKeys);
  };

  const inputChanged = (event) => {
    setBook({ ...book, [event.target.name]: event.target.value });
  };

  const addBook = () => {
    fetch(`${booksUrl}.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(book)
    })
      .then(() => fetchBooks())
      .catch(err => console.error(err));

    setBook({
      title: '',
      author: '',
      year: '',
      isbn: '',
      price: ''
    });

    setOpen(false);
  };

  const deleteBook = (id) => {
    fetch(`${booksUrl}/${id}.json`, {
      method: 'DELETE'
    })
      .then(() => fetchBooks())
      .catch(err => console.error(err));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Bookstore</Typography>
        </Toolbar>
      </AppBar>

      <div className="bookstore-content">
        <Button
          className="add-button"
          variant="outlined"
          onClick={() => setOpen(true)}
        >
          Add book
        </Button>

        <div style={{ height: 500, width: '100%' }}>
          <AgGridReact
            rowData={books}
            columnDefs={columnDefs}
          />
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>New book</DialogTitle>

        <DialogContent>
          <TextField margin="dense" label="Title" name="title" value={book.title} onChange={inputChanged} fullWidth />
          <TextField margin="dense" label="Author" name="author" value={book.author} onChange={inputChanged} fullWidth />
          <TextField margin="dense" label="Year" name="year" value={book.year} onChange={inputChanged} fullWidth />
          <TextField margin="dense" label="Isbn" name="isbn" value={book.isbn} onChange={inputChanged} fullWidth />
          <TextField margin="dense" label="Price" name="price" value={book.price} onChange={inputChanged} fullWidth />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={addBook}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;
