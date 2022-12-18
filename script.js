const body = document.getElementsByTagName("body")[0];

const clearElements = (parent) => {
  parent.childNodes.forEach((node) => {
    node.remove();
  });
};



// On First Load of the script file
(async () => {
  const res = await fetch("https://anapioficeandfire.com/api/books");
  const books = await res.json();
  const autoSuggestion = document.getElementById("datalist");
  books.map((book) => {
    
      const option = document.createElement("option");
      option.value = book.name;
      autoSuggestion.appendChild(option);
    
   
  });
})();


// Fetch Book based on the search
const fetchBook = async (filter) => {
  try {
    const res = await fetch("https://anapioficeandfire.com/api/books");
    const books = await res.json();
    const searchedBook = document.getElementById("book");
    let filteredData = books.filter(
      (book) =>
        book.name.toLowerCase().includes(filter.toLowerCase()) && filter !== ""
    );
    clearElements(searchedBook);
    if (filteredData.length > 0) {
      filteredData.map(async (book) => {
        searchedBook.innerHTML += `<div id="loading">
        <span
          class="spinner-border text-primary spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Loading...</div>`;

        const bookBox = addDiv(
          "book-container",
          "book-container p-3"
        );
        

        const bookName = document.createElement("h2");
        bookName.setAttribute("Class", "d-flex justify-content-center");
        let value = createData("title", "bold", book.name);
        value.style.color = "#B9481E";  
        bookName.appendChild(value);

        const bookISBN = addDiv(
          "bookISBN",
          "align-item-center justify-content-space-evenly bookDetail py-2"
        );
        title = createData("title", "font-weight-bold", "Book ISBN : ");
        value = createData("title", "bold", book.isbn);
        bookISBN.appendChild(title);
        bookISBN.appendChild(value);

        const bookNoOfPages = addDiv(
          "bookNoOfPages",
          "align-item-center justify-content-space-evenly bookDetail py-2"
        );
        title = createData("title", "font-weight-bold", "No of Pages : ");
        value = createData("title", "bold", book.numberOfPages);
        bookNoOfPages.appendChild(title);
        bookNoOfPages.appendChild(value);

        const bookAuthor = addDiv(
          "bookAuthor",
          "align-item-center justify-content-space-evenly bookDetail py-2"
        );
        title = createData("title", "font-weight-bold", "Authors : ");
        const authors = book.authors.map((author, i) => {
          if (i === 0) {
            return author;
          }
          return `, ${author}`;
        });
        value = createData("title", "bold", authors);
        bookAuthor.appendChild(title);
        bookAuthor.appendChild(value);

        const bookPublisher = addDiv(
          "bookPublisher",
          "align-item-center justify-content-space-evenly bookDetail py-2"
        );
        title = createData("title", "font-weight-bold", "Publisher : ");
        value = createData("title", "bold", book.publisher);
        bookPublisher.appendChild(title);
        bookPublisher.appendChild(value);

        const bookReleased = addDiv(
          "bookReleased",
          "align-item-center justify-content-space-evenly bookDetail py-2"
        );
        title = createData("title", "font-weight-bold", "Released  : ");
        value = createData("title", "bold", book.released.substring(0, 10));
        bookReleased.appendChild(title);
        bookReleased.appendChild(value);

        const bookCharacters = addDiv(
          "bookCharacters",
          "align-item-center justify-content-space-evenly bookDetail py-2"
        );
        title = createData("title", "font-weight-bold", "Characters  : ");

        const getCharacterName = async (i) => {
          try {
            const res = await fetch(book.characters[i]);
            const data = await res.json();
            return data.name;
          } catch (err) {
            alert(err);
          }
        };
        let i = 0;
        let end = 5;
        let characters = "";
        while (i < end) {
          const name = await getCharacterName(i++);
          if (name === "") {
            end++;
          } else {
            if (i !== end) characters += name + " , ";
            else characters += name;
          }
        }

        value = createData("title", "bold", characters);
        bookCharacters.appendChild(title);
        bookCharacters.appendChild(value);

        bookBox.appendChild(bookName);
        bookBox.appendChild(bookISBN);
        bookBox.appendChild(bookNoOfPages);
        bookBox.appendChild(bookAuthor);
        bookBox.appendChild(bookPublisher);
        bookBox.appendChild(bookReleased);
        bookBox.appendChild(bookCharacters);
        searchedBook.removeChild(document.getElementById("loading"));
        searchedBook.appendChild(bookBox);
      });
    }
  } catch (err) {
    alert(err);
  }
};

const searchBooks = () => {
  fetchBook(inputSearch.value);
};

// Create a Div
const addDiv = (id, className) => {
  const div = document.createElement("div");
  div.id = id;
  div.className = className;

  return div
};

// Create A Book Detail P tag
const createData = (id, className, text) => {
  const span = document.createElement("span");
  span.id = id;
  span.className = className;
  span.innerText = text;
  return span;
};

// Filter Box
const filterBox = document.createElement("form");
filterBox.id = "filter-container";
filterBox.className = "form-inline mt-5";
filterBox.onsubmit = function (e) {
  e.preventDefault();
};

// Search Box 
const formGroup = addDiv("form-group", "form-group searchBox w-50");

// Input Field form search
const inputSearch = document.createElement("input");
inputSearch.type = "search";
inputSearch.id = "search-box";
inputSearch.className = "form-control form-control-lg";
inputSearch.placeholder = "Type Book to Search";
inputSearch.setAttribute("list", "datalist");

// To display autoSuggestionBox while typing in search  using datalist
const autoSuggestionBox = document.createElement("datalist");
autoSuggestionBox.id = "datalist";


// Search Icon
const img = document.createElement("img");
img.id = "search-btn"; 
img.className = "d-flex serach-icon";
img.src  = 'search-icon.png';
img.addEventListener("click", searchBooks);

// Append input in search box 
formGroup.appendChild(inputSearch);
formGroup.appendChild(img);
formGroup.appendChild(autoSuggestionBox);

// Searched Book Box
const bookBox = addDiv("book", "book mt-5 container");

// Append Search Box and Search Button in Filter Box
filterBox.appendChild(formGroup);
filterBox.appendChild(img);

// Append Filter Box in Body
body.appendChild(filterBox);
body.appendChild(bookBox);
