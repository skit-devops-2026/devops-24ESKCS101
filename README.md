# Releaf-Book — DevOps Project

## Author

| Roll No. | Name | GitHub username |
|---|---|---|
| 24ESKCS101 | Chitranshi Modi | Chitra121-i |

## About

Releaf-Book is a second-hand book buying and selling website, originally built as a
Full Stack Development group project. It lets users register, log in, list books for
sale, buy books from other users, track bought and sold items, maintain a wishlist,
and chat with other users. This repository is the individual DevOps project built on
top of that application: the application code is shared with my FSD teammates, but all
versioning, CI/CD, containerization, deployment, and monitoring work in this repository
is my own.

## Features

- User registration and login
- Book listing (sell a book)
- Buying books from other listings
- Bought books and sold books tracking
- Wishlist
- In-app chat between users
- Book browsing with images and details

## Tech stack

- Frontend: HTML, CSS, JavaScript (static, no framework)
- Backend: None — Releaf-Book is a static site; all logic runs client-side in the browser
- Database: None currently used

## Project structure

```
css/                Stylesheets, one per page
images/              Book cover images and static assets
js/                  Page-specific JavaScript
index.html           Landing page
home.html            Home / browse page
login.html           Login page
register.html        Registration page
sell.html            List a book for sale
listing.html         Book listing detail
bought.html          Bought books page
sold.html            Sold books page
wishlist.html        Wishlist page
chat.html            Chat page
.github/workflows/   CI pipeline definitions
scripts/             Helper scripts (repository hygiene check)
docs/                Project documentation (added as needed)
monitoring/          Monitoring configuration (added in MT2)
k8s/                 Kubernetes manifests (added in MT2)
```

## How to run locally

Releaf-Book is a static site with no build step or server dependency. Open
`index.html` directly in a browser, or serve the folder with any static file server,
for example:

```powershell
npx serve .
```

Then visit the local address it prints (typically `http://localhost:3000`).

## DevOps tools

| Tool | Purpose | Status |
|---|---|---|
| Git / GitHub | Version control, branching, pull requests | In progress (M1, M2) |
| GitHub Actions | CI pipeline, automated tests, repository hygiene checks | In progress (M3) |
| Jenkins | Local build pipeline | In progress (M4) |
| Docker | Containerization | Planned (M5, MT2) |
| Kubernetes | Deployment | Planned (M6, MT2) |
| Monitoring | Metrics / observability | Planned (M6, MT2) |

## CI

A GitHub Actions workflow at `.github/workflows/ci.yml` runs on every push and pull
request. It currently runs a repository hygiene check (`scripts/hygiene.sh`) that
verifies the README is filled in, `.gitignore` is present, no build artifacts or
secrets are tracked, and commit messages are reasonably descriptive. The
build-and-test job will be added once the test suite (below) is in place.

## Testing

Test strategy and test files will be documented here once implemented (M3).

## Jenkins

Jenkins pipeline setup and stages will be documented here once implemented (M4).

## Deployment

Not yet implemented. Planned for MT2 (M5), including containerization with Docker.

## Kubernetes

Not yet implemented. Planned for MT2 (M6).

## Monitoring

Not yet implemented. Planned for MT2 (M6).

## Live URL

Not yet deployed. Will be added once M5 is complete.
