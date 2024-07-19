const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Helper function to check if an ObjectId is valid
const isValidObjectId = (id) => {
  return ObjectId.isValid(id);
};

// Helper function to check existence of a referenced document
const checkExistence = async (collectionName, id) => {
  const result = await mongodb.getDb().db().collection(collectionName).findOne({ _id: ObjectId(id) });
  return result !== null;
};

// Helper function to add book ID to author's booksWritten field
const addBookToAuthor = async (authorId, bookId) => {
  if (isValidObjectId(authorId) && isValidObjectId(bookId)) {
    await mongodb.getDb().db().collection('authors').updateOne(
      { _id: ObjectId(authorId) },
      { $addToSet: { booksWritten: ObjectId(bookId) } }
    );
  }
};

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await mongodb.getDb().db().collection('books').find().toArray();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single book by ID
const getBookById = async (req, res) => {
  const bookId = req.params.id;
  
  if (!isValidObjectId(bookId)) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }

  try {
    const book = await mongodb.getDb().db().collection('books').findOne({ _id: ObjectId(bookId) });
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error(`Error fetching book with id ${bookId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new book
const createBook = async (req, res) => {
  const { title, authorId, genreId, publishedYear, summary } = req.body;

  if (!isValidObjectId(authorId) || !isValidObjectId(genreId)) {
    return res.status(400).json({ error: 'Invalid author ID or genre ID' });
  }

  // Check if author and genre exist
  const authorExists = await checkExistence('authors', authorId);
  const genreExists = await checkExistence('genres', genreId);

  if (!authorExists) {
    // Create a new author if it does not exist
    const newAuthor = {
      firstName: 'Unknown',
      lastName: 'Unknown',
      booksWritten: [ObjectId()],
    };
    const authorResponse = await mongodb.getDb().db().collection('authors').insertOne(newAuthor);
    if (authorResponse.acknowledged) {
      authorId = authorResponse.insertedId;
    } else {
      return res.status(500).json({ error: 'Error creating author' });
    }
  }

  if (!genreExists) {
    return res.status(404).json({ error: 'Genre not found' });
  }

  try {
    const newBook = {
      title,
      authorId: ObjectId(authorId),
      genreId: ObjectId(genreId),
      publishedYear,
      summary,
    };

    const response = await mongodb.getDb().db().collection('books').insertOne(newBook);
    if (response.acknowledged) {
      await addBookToAuthor(authorId, response.insertedId);
      res.status(201).json(response);
    } else {
      res.status(500).json({ error: 'Some error occurred while creating the book.' });
    }
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an existing book
const updateBook = async (req, res) => {
  const bookId = req.params.id;
  const { title, authorId, genreId, publishedYear, summary } = req.body;

  if (!isValidObjectId(bookId) || !isValidObjectId(authorId) || !isValidObjectId(genreId)) {
    return res.status(400).json({ error: 'Invalid IDs' });
  }

  try {
    // Update book
    const response = await mongodb.getDb().db().collection('books').updateOne(
      { _id: ObjectId(bookId) },
      { $set: { title, authorId: ObjectId(authorId), genreId: ObjectId(genreId), publishedYear, summary } }
    );

    if (response.modifiedCount > 0) {
      // Update the author if needed
      await addBookToAuthor(authorId, bookId);
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error(`Error updating book with id ${bookId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  const bookId = req.params.id;

  if (!isValidObjectId(bookId)) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }

  try {
    // Remove book
    const response = await mongodb.getDb().db().collection('books').deleteOne({ _id: ObjectId(bookId) });
    if (response.deletedCount > 0) {
      // Optionally remove the book ID from the author's booksWritten field
      await mongodb.getDb().db().collection('authors').updateMany(
        {},
        { $pull: { booksWritten: ObjectId(bookId) } }
      );
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    console.error(`Error deleting book with id ${bookId}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
