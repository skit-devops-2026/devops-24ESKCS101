/* ================= REGISTER FORM ================= */

const registerForm =
    document.getElementById("register-form");


if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const password =
            document.getElementById("register-password").value;


        const confirmPassword =
            document.getElementById("confirm-password").value;


        const message =
            document.getElementById("register-message");


        if (password !== confirmPassword) {

           
              alert("Passwords do not match.");

            return;

        }


        message.textContent =
            "Registration details are valid.";

    });

}