const { nanoid } = require('nanoid');
const books = require('./books');

const isNameEmpty = (name) => ((name === undefined) ? true : name.length <= 0);
const isReadPageOutnumbered = (readPage, pageCount) => (readPage > pageCount);

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (isNameEmpty(name)) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (isReadPageOutnumbered(readPage, pageCount)) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal Menambahkan Buku',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const response = h.response({
    status: 'success',
    data: {
      books:
        books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((bookN) => bookN.id === bookId)[0];

  let response;
  if (book !== undefined) {
    response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();

  let response;
  if (isNameEmpty(name)) {
    response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (isReadPageOutnumbered(readPage, pageCount)) {
    response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) {
    response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
  }

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = books.findIndex((book) => book.id === bookId);

  let response;
  if (bookIndex === -1) {
    response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  books.splice(bookIndex, 1);
  response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
