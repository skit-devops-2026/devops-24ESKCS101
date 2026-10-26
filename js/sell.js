// ================= GET LISTINGS =================

const listingsContainer =
    document.getElementById("listings-container");


// ================= DISPLAY BOOKS =================

function displayBooks() {

    const books =
        JSON.parse(
            localStorage.getItem("releafBooks")
        ) || [];


    listingsContainer.innerHTML = "";


    // ================= NO LISTINGS =================

    if (books.length === 0) {

        listingsContainer.innerHTML = `

            <div class="no-listings">

                <h2>
                    No Books Listed Yet
                </h2>

                <p>
                    Start selling your unused books
                    and give them a new reader.
                </p>

                <a
                    href="listing.html"
                    class="list-book-btn"
                >
                    + List Your First Book
                </a>

            </div>

        `;

        return;
    }


    // ================= CREATE LISTING CARDS =================

    books.forEach(function(book, index) {

        const bookCard =
            document.createElement("div");

        bookCard.classList.add(
            "listing-card"
        );


        // Support both old and new books

        let photos = [];

        if (
            book.photos &&
            book.photos.length > 0
        ) {

            photos = book.photos;

        }

        else if (book.image) {

            photos = [
                book.image
            ];

        }


        const coverImage =
            photos[0];


        const photoCount =
            photos.length;


        // ================= STATUS =================

        const status =
            book.status || "available";


        let statusHTML =
            "🟢 Available";


        if (status === "sold") {

            statusHTML =
                "🔵 Sold";

        }

        else if (
            status === "negotiating"
        ) {

            statusHTML =
                "🟡 Negotiating";

        }

        else if (
            status === "deal"
        ) {

            statusHTML =
                "🟠 Deal Agreed";

        }


        // ================= CARD =================

        bookCard.innerHTML = `

            <div
                class="listing-cover"
                data-book-index="${index}"
            >

                <img
                    src="${coverImage}"
                    alt="${book.title}"
                >


                ${
                    photoCount > 1

                    ? `
                        <span class="photo-count">
                            📷 ${photoCount} Photos
                        </span>
                      `

                    : ""
                }

            </div>


            <div class="listing-details">


                <p class="listing-category">
                    ${book.category || ""}
                </p>


                <h3>
                    ${book.title || ""}
                </h3>


                <p class="listing-isbn">
                    ISBN:
                    ${book.isbn || "Not available"}
                </p>


                <p class="listing-author">
                    ${book.author || ""}
                </p>


                <p class="listing-description">
                    ${book.description || ""}
                </p>


                <div class="listing-bottom">

                    <span class="listing-price">
                        ₹${book.price || ""}
                    </span>


                    <span class="listing-condition">
                        ${book.condition || ""}
                    </span>

                </div>


               <div class="listing-status-box">

    <label>
        Status:
    </label>

    <select
        class="status-select"
        data-index="${index}"
    >

        <option
            value="available"
            ${status === "available" ? "selected" : ""}
        >
            🟢 Available
        </option>


        <option
            value="negotiating"
            ${status === "negotiating" ? "selected" : ""}
        >
            🟡 Negotiating
        </option>


        <option
            value="deal"
            ${status === "deal" ? "selected" : ""}
        >
            🟠 Deal Agreed
        </option>


        <option
            value="sold"
            ${status === "sold" ? "selected" : ""}
        >
            🔵 Sold
        </option>

    </select>

</div>


                <div class="listing-actions">

                    <button
                        type="button"
                        class="edit-btn"
                        data-index="${index}"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="delete-btn"
                        data-index="${index}"
                    >
                        Delete
                    </button>

                </div>

            </div>

        `;


        listingsContainer.appendChild(
            bookCard
        );

    });


    // ================= DELETE =================

    const deleteButtons =
        document.querySelectorAll(
            ".delete-btn"
        );


    deleteButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    const books =
                        JSON.parse(
                            localStorage.getItem(
                                "releafBooks"
                            )
                        ) || [];


                    const book =
                        books[index];


                    if (!book) {

                        return;

                    }


                    // Only available books
                    // can be deleted

                    if (
                        book.status &&
                        book.status !== "available"
                    ) {

                        alert(
                            "This book cannot be deleted while it is being sold."
                        );

                        return;

                    }


                    const confirmDelete =
                        confirm(
                            `Are you sure you want to delete "${book.title}"?`
                        );


                    if (!confirmDelete) {

                        return;

                    }


                    books.splice(
                        index,
                        1
                    );


                    localStorage.setItem(
                        "releafBooks",
                        JSON.stringify(books)
                    );


                    displayBooks();

                }
            );

        }
    );


    // ================= EDIT =================

    const editButtons =
        document.querySelectorAll(
            ".edit-btn"
        );


    editButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    localStorage.setItem(
                        "editingBookIndex",
                        index
                    );


                    window.location.href =
                        "listing.html";

                }
            );

        }
    );

    // ================= STATUS CHANGE =================

    const statusSelects =
        document.querySelectorAll(
            ".status-select"
        );


    statusSelects.forEach(function(select) {

        select.addEventListener(
            "change",
            function() {

                const index =
                    Number(
                        select.dataset.index
                    );


                const books =
                    JSON.parse(
                        localStorage.getItem(
                            "releafBooks"
                        )
                    ) || [];


                if (!books[index]) {

                    return;

                }


                // Update status

                books[index].status =
                    select.value;


                // Save updated books

                localStorage.setItem(
                    "releafBooks",
                    JSON.stringify(books)
                );


                // Refresh listings

                displayBooks();

            }
        );

    });

}



// ================= PHOTO GALLERY =================

const photoGallery =
    document.getElementById(
        "photo-gallery"
    );


const galleryMainImage =
    document.getElementById(
        "gallery-main-image"
    );


const galleryThumbnails =
    document.getElementById(
        "gallery-thumbnails"
    );


const closeGallery =
    document.getElementById(
        "close-gallery"
    );


// Only run gallery code if gallery exists

if (
    photoGallery &&
    galleryMainImage &&
    galleryThumbnails &&
    closeGallery
) {


    // ================= OPEN GALLERY =================

    document.addEventListener(
        "click",
        function(event) {

            const cover =
                event.target.closest(
                    ".listing-cover"
                );


            if (!cover) {

                return;

            }


            const bookIndex =
                Number(
                    cover.dataset.bookIndex
                );


            const books =
                JSON.parse(
                    localStorage.getItem(
                        "releafBooks"
                    )
                ) || [];


            const book =
                books[bookIndex];


            if (!book) {

                return;

            }


            let photos = [];


            if (
                book.photos &&
                book.photos.length > 0
            ) {

                photos =
                    book.photos;

            }

            else if (book.image) {

                photos = [
                    book.image
                ];

            }


            if (photos.length === 0) {

                return;

            }


            // First image

            galleryMainImage.src =
                photos[0];


            // Clear thumbnails

            galleryThumbnails.innerHTML =
                "";


            // Create thumbnails

            photos.forEach(
                function(photo) {

                    const thumbnail =
                        document.createElement(
                            "img"
                        );


                    thumbnail.src =
                        photo;


                    thumbnail.classList.add(
                        "gallery-thumbnail"
                    );


                    thumbnail.addEventListener(
                        "click",
                        function() {

                            galleryMainImage.src =
                                photo;

                        }
                    );


                    galleryThumbnails.appendChild(
                        thumbnail
                    );

                }
            );


            photoGallery.style.display =
                "flex";

        }
    );


    // ================= CLOSE GALLERY =================

    closeGallery.addEventListener(
        "click",
        function() {

            photoGallery.style.display =
                "none";

        }
    );


    // Close when clicking background

    photoGallery.addEventListener(
        "click",
        function(event) {

            if (
                event.target === photoGallery
            ) {

                photoGallery.style.display =
                    "none";

            }

        }
    );

}


// ================= LOAD LISTINGS =================

displayBooks();