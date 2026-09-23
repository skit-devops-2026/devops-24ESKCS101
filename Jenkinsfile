pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Code Quality') {
            steps {
                // Checks every JS file for syntax errors without executing it.
                // Catches typos/broken syntax before they reach the browser.
                bat 'for %%f in (js\\*.js) do node --check %%f'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }

        stage('Package') {
            steps {
                // Bundles the static site into a single deployable zip.
                powershell 'Compress-Archive -Path index.html,home.html,login.html,register.html,sell.html,listing.html,bought.html,sold.html,wishlist.html,css,images,js -DestinationPath releaf-book.zip -Force'
                archiveArtifacts artifacts: 'releaf-book.zip', fingerprint: true
            }
        }
    }
}