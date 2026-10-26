/* =====================================
   RELEAF-BOOK SOLD BOOKS
===================================== */


/* =====================================
   SEARCH + CATEGORY FILTER
===================================== */

const searchInput =
    document.getElementById("searchInput");


const categoryFilter =
    document.getElementById("categoryFilter");


const books =
    document.querySelectorAll(".sold-card");


const noResults =
    document.getElementById("noResults");


function filterBooks() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        categoryFilter.value;


    let visibleBooks = 0;


    books.forEach(function(book) {

        const title =
            book.dataset.title.toLowerCase();


        const buyer =
            book.dataset.buyer.toLowerCase();


        const category =
            book.dataset.category;


        const matchesSearch =
            title.includes(searchText) ||
            buyer.includes(searchText);


        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;


        if (
            matchesSearch &&
            matchesCategory
        ) {

            book.style.display = "";

            visibleBooks++;

        } else {

            book.style.display = "none";

        }

    });


    if (visibleBooks === 0) {

        noResults.style.display = "block";

    } else {

        noResults.style.display = "none";

    }

}


searchInput.addEventListener(
    "input",
    filterBooks
);


categoryFilter.addEventListener(
    "change",
    filterBooks
);



/* =====================================
   BOOK DETAILS MODAL
===================================== */

const modal =
    document.getElementById("bookModal");


const modalTitle =
    document.getElementById("modalTitle");


const modalAuthor =
    document.getElementById("modalAuthor");


const modalCategory =
    document.getElementById("modalCategory");


const modalBuyer =
    document.getElementById("modalBuyer");


const modalDate =
    document.getElementById("modalDate");


const modalPrice =
    document.getElementById("modalPrice");


function openDetails(
    title,
    author,
    category,
    buyer,
    date,
    price
) {

    modalTitle.textContent =
        title;


    modalAuthor.textContent =
        author;


    modalCategory.textContent =
        category;


    modalBuyer.textContent =
        buyer;


    modalDate.textContent =
        date;


    modalPrice.textContent =
        price;


    modal.classList.add("show");


    document.body.style.overflow =
        "hidden";

}



function closeDetails() {

    modal.classList.remove("show");


    document.body.style.overflow =
        "";

}



/* =====================================
   CLOSE MODAL OUTSIDE
===================================== */

modal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === modal
        ) {

            closeDetails();

        }

    }
);



/* =====================================
   ESCAPE KEY
===================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            modal.classList.contains("show")
        ) {

            closeDetails();

        }

    }
);



/* =====================================
   LOGOUT
===================================== */

const logoutButton =
    document.querySelector(".logout-btn");


logoutButton.addEventListener(
    "click",
    function() {

        window.location.href =
            "index.html";

    }
);