/* =====================================
   RELEAF-BOOK WISHLIST PAGE
===================================== */


/* =====================================
   SEARCH + CATEGORY FILTER
===================================== */

const searchInput =
    document.getElementById("searchInput");


const categoryFilter =
    document.getElementById("categoryFilter");


const books =
    document.querySelectorAll(".book-card");


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


        const author =
            book.dataset.author.toLowerCase();


        const category =
            book.dataset.category;


        const matchesSearch =
            title.includes(searchText) ||
            author.includes(searchText);


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
   REMOVE FROM WISHLIST
===================================== */

const removeButtons =
    document.querySelectorAll(".remove-wishlist");


removeButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const card =
                button.closest(".book-card");


            const title =
                card.dataset.title;


            const confirmRemove =
                confirm(
                    "Remove \"" +
                    title +
                    "\" from your wishlist?"
                );


            if (confirmRemove) {

                card.remove();


                updateBookCount();

                filterBooks();

            }

        }
    );

});



/* =====================================
   UPDATE BOOK COUNT
===================================== */

function updateBookCount() {

    const remainingBooks =
        document.querySelectorAll(
            ".book-card"
        ).length;


    const countText =
        document.querySelector(
            ".wishlist-top p"
        );


    if (remainingBooks === 1) {

        countText.textContent =
            "1 book in your wishlist";

    } else {

        countText.textContent =
            remainingBooks +
            " books in your wishlist";

    }

}



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


const modalPrice =
    document.getElementById("modalPrice");


const modalCondition =
    document.getElementById("modalCondition");


const modalDescription =
    document.getElementById("modalDescription");


function openDetails(
    title,
    author,
    category,
    price,
    condition,
    description
) {

    modalTitle.textContent =
        title;


    modalAuthor.textContent =
        author;


    modalCategory.textContent =
        category;


    modalPrice.textContent =
        price;


    modalCondition.textContent =
        condition;


    modalDescription.textContent =
        description;


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