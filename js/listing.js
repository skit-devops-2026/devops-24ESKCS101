// ================= GET FORM =================

const sellForm =
    document.getElementById("sell-form");


// ================= FORM FIELDS =================

const isbnInput =
    document.getElementById("isbn");

const titleInput =
    document.getElementById("book-title");

const authorInput =
    document.getElementById("author");

const categoryInput =
    document.getElementById("category");

const priceInput =
    document.getElementById("price");

const conditionInput =
    document.getElementById("condition");

const descriptionInput =
    document.getElementById("description");


// ================= PHOTO INPUTS =================

const coverInput =
    document.getElementById("cover-image");

const additionalInput =
    document.getElementById("additional-images");

const coverPreview =
    document.getElementById("cover-preview");

const additionalPreview =
    document.getElementById("additional-preview");


// ================= EDIT MODE =================

const editingBookIndex =
    localStorage.getItem("editingBookIndex");

let editingBook = null;


if (editingBookIndex !== null) {

    const books =
        JSON.parse(
            localStorage.getItem("releafBooks")
        ) || [];


    editingBook =
        books[Number(editingBookIndex)];

}


// ================= SUBMIT BUTTON =================

const submitBookButton =
    document.getElementById(
        "submit-book-btn"
    );


if (editingBook && submitBookButton) {

    submitBookButton.textContent =
        "Save Changes";

}


// ================= FILL EDIT FORM =================

if (editingBook) {

    isbnInput.value =
        editingBook.isbn || "";

    titleInput.value =
        editingBook.title || "";

    authorInput.value =
        editingBook.author || "";

    categoryInput.value =
        editingBook.category || "";

    priceInput.value =
        editingBook.price || "";

    conditionInput.value =
        editingBook.condition || "";

    descriptionInput.value =
        editingBook.description || "";


    // Get existing photos

    let photos = [];


    if (
        editingBook.photos &&
        editingBook.photos.length > 0
    ) {

        photos =
            editingBook.photos;

    }

    else if (editingBook.image) {

        photos = [
            editingBook.image
        ];

    }


    // Show existing cover

    if (photos.length > 0) {

        coverPreview.innerHTML = `

            <div class="photo-preview">

                <img
                    src="${photos[0]}"
                    alt="Current book cover"
                >

                <div class="cover-label">
                    Current Cover ⭐
                </div>

            </div>

        `;

    }


    // Show existing additional photo

    if (photos.length > 1) {

        additionalPreview.innerHTML = `

            <div class="photo-preview">

                <img
                    src="${photos[1]}"
                    alt="Current additional photo"
                >

            </div>

        `;

    }

}


// ================= COVER PREVIEW =================

coverInput.addEventListener(
    "change",
    function() {

        const image =
            coverInput.files[0];


        coverPreview.innerHTML = "";


        if (!image) {

            return;

        }


        if (
            !image.type.startsWith("image/")
        ) {

            alert(
                "Please select an image file."
            );

            coverInput.value = "";

            return;

        }


        const imageURL =
            URL.createObjectURL(image);


        coverPreview.innerHTML = `

            <div class="photo-preview">

                <img
                    src="${imageURL}"
                    alt="Book cover"
                >

                <div class="cover-label">
                    Cover ⭐
                </div>

            </div>

        `;

    }
);


// ================= ADDITIONAL PHOTO PREVIEW =================

additionalInput.addEventListener(
    "change",
    function() {

        const image =
            additionalInput.files[0];


        additionalPreview.innerHTML = "";


        if (!image) {

            return;

        }


        if (
            !image.type.startsWith("image/")
        ) {

            alert(
                "Please select an image file."
            );

            additionalInput.value = "";

            return;

        }


        const imageURL =
            URL.createObjectURL(image);


        additionalPreview.innerHTML = `

            <div class="photo-preview">

                <img
                    src="${imageURL}"
                    alt="Additional book photo"
                >

            </div>

        `;

    }
);


// ================= FORM SUBMIT =================

sellForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        // ================= GET VALUES =================

        const isbn =
            isbnInput.value.trim();

        const title =
            titleInput.value.trim();

        const author =
            authorInput.value.trim();

        const category =
            categoryInput.value;

        const price =
            priceInput.value;

        const condition =
            conditionInput.value;

        const description =
            descriptionInput.value.trim();

        const coverImage =
            coverInput.files[0];

        const additionalImage =
            additionalInput.files[0];


        // ================= VALIDATION =================

        if (isbn === "") {

            alert(
                "Please enter the ISBN."
            );

            isbnInput.focus();

            return;

        }


        if (title === "") {

            alert(
                "Please enter the book title."
            );

            titleInput.focus();

            return;

        }


        if (author === "") {

            alert(
                "Please enter the author's name."
            );

            authorInput.focus();

            return;

        }


        if (category === "") {

            alert(
                "Please select a category."
            );

            categoryInput.focus();

            return;

        }


        if (
            price === "" ||
            Number(price) <= 0
        ) {

            alert(
                "Please enter a valid selling price."
            );

            priceInput.focus();

            return;

        }


        if (condition === "") {

            alert(
                "Please select the book condition."
            );

            conditionInput.focus();

            return;

        }


        if (description === "") {

            alert(
                "Please enter a description."
            );

            descriptionInput.focus();

            return;

        }


        // Cover required only for new listing

        if (
            !coverImage &&
            !editingBook
        ) {

            alert(
                "Please upload a book cover."
            );

            coverInput.focus();

            return;

        }


        // ================= READ PHOTOS =================

        if (coverImage) {

            const coverReader =
                new FileReader();


            coverReader.onload =
                function() {

                    const coverData =
                        coverReader.result;


                    if (additionalImage) {

                        const additionalReader =
                            new FileReader();


                        additionalReader.onload =
                            function() {

                                saveBook(
                                    coverData,
                                    additionalReader.result
                                );

                            };


                        additionalReader.readAsDataURL(
                            additionalImage
                        );

                    }

                    else {

                        saveBook(
                            coverData,
                            null
                        );

                    }

                };


            coverReader.readAsDataURL(
                coverImage
            );

        }

        else {

            // Editing without
            // changing the cover

            saveBook(
                null,
                null
            );

        }

    }
);


// ================= SAVE BOOK =================

function saveBook(
    coverData,
    additionalData
) {

    const books =
        JSON.parse(
            localStorage.getItem("releafBooks")
        ) || [];


    let photos = [];


    // ================= EXISTING PHOTOS =================

    if (editingBook) {

        if (
            editingBook.photos &&
            editingBook.photos.length > 0
        ) {

            photos =
                [...editingBook.photos];

        }

        else if (editingBook.image) {

            photos = [
                editingBook.image
            ];

        }

    }


    // ================= NEW COVER =================

    if (coverData) {

        photos[0] =
            coverData;

    }


    // ================= NEW ADDITIONAL PHOTO =================

    if (additionalData) {

        photos[1] =
            additionalData;

    }


    // ================= BOOK OBJECT =================

    const newBook = {

        isbn:
            isbnInput.value.trim(),

        title:
            titleInput.value.trim(),

        author:
            authorInput.value.trim(),

        category:
            categoryInput.value,

        price:
            priceInput.value,

        condition:
            conditionInput.value,

        description:
            descriptionInput.value.trim(),

        photos:
            photos,

        // Keep cover in old field
        // for compatibility

        image:
            photos[0],

        status:
            editingBook
                ? editingBook.status || "available"
                : "available"

    };


    // ================= UPDATE OR ADD =================

    if (editingBookIndex !== null) {

        books[
            Number(editingBookIndex)
        ] = newBook;


        localStorage.removeItem(
            "editingBookIndex"
        );

    }

    else {

        books.push(
            newBook
        );

    }


    // ================= SAVE =================

    localStorage.setItem(
        "releafBooks",
        JSON.stringify(books)
    );


    // ================= SUCCESS =================

    alert(
        editingBook
            ? "Book updated successfully!"
            : "Book listed successfully!"
    );


    // ================= RETURN =================

    window.location.href =
        "sell.html";

}