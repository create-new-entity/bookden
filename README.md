
# Bookden — Multi-Role E-Commerce Platform with Admin Tooling

### Contents
- [What is bookden?](#what-is-bookden)
- [Why this project](#why-this-project)
- [What is the tech stack of this project?](#what-is-the-tech-stack-of-this-project)
- [Key Features](#key-features) 📋
- [How to run this project locally?](#how-to-run-this-project-locally)
- [How to run tests locally?](#how-to-run-tests-locally)
- [How to lint locally?](#how-to-lint-locally)
- [What does it do?](#what-does-it-do)
- [How to use it?](#how-to-use-it)
- [Project Architecture](#project-architecture)
- [System Design Highlights](#system-design-highlights)
- [Some interesting places in code worth checking](#some-interesting-places-in-code-worth-checking) 👷
- [Demo Screenshot/GIFs](#demo-screenshots--gifs) 📷
- [Demo Video](#demo-video) 🎥
- [Live Demo](#live-demo) 🔗
- [Project Hours](#project-hours) 🕰️
- [Usage of generative language models](#usage-of-generative-language-models) 🤖
- [Final Review / Assessment](#final-review--assessment)
- [Other](#other)
---

### What is bookden? 📚

Bookden is a full-stack e-commerce platform designed to simulate a real-world bookstore system with multiple user roles, complex data flows, and production-style architecture.

It supports:
- Multi-role access control (superadmin, admin, customer)
- Book catalog management with search and filtering
- Cart and purchase flow
- Wishlist and user interactions
- Admin tooling for operational control

Go back to [contents](#contents)

---

### Why this project?

This project was built to demonstrate:
- End-to-end system design in a full-stack TypeScript environment
- Real-world product thinking (admin workflows, user roles, data flows)
- Production-like practices (Docker, CI/CD, E2E testing)

The emphasis is on building maintainable, scalable systems rather than isolated features.

Go back to [contents](#contents)

---

### What is the tech stack of this project?

1. Frontend: React + React Query + TypeScript + Zod + Material UI
2. Backend: Node + Postgresql + Slonik + TypeScript + Zod + db-migrate ( migrations )
3. Containerization ( Docker ) + GitHub Actions ( CI/CD )
4. E2E test: Playwright

Go back to [contents](#contents)

---

## Key Features

- Role-based access control (superadmin, admin, customer)
- Advanced search with filtering and deep linking
- Wishlist, Cart, Purchase features
- Soft-delete and restore mechanisms
- Reusable UI component system (carousel, list layouts)
- End-to-end testing with Playwright
- Dockerized development and CI/CD pipeline

Go back to [contents](#contents)

---

### How to run this project locally?

1. Create env files or You can simply rename the env example files in the env folder and that's it. For example, rename "server.env.example" to "server.env". The example files actually contains values that can be used. There is nothing in env files that needed hiding, hence I pushed them in *.env.example files 🙃.
2. Make sure you have docker desktop in your machine.
3. From root directory, to start the project, run this command: ```npm run start:dev```
4. From root directory, to stop the project, run this command: ```npm run stop:dev```

Go back to [contents](#contents)

---

### How to run tests locally?

How to run e2e tests locally:
1. From root directory, run: ```npm run e2e```
2. Once tests are done, run: ```npm run e2e:infra:down```

How to run other tests locally ( from root directory ):
1. From root directory, run: ```npm run test:server```
2. From root directory, run: ```npm run test:client```
3. To run both server and client tests in one go, run: ```npm run test```

Go back to [contents](#contents)

---

### How to lint locally?

1. From root directory, to lint client, run: ```npm run lint:client```
2. From root directory, to lint server, run: ```npm run lint:server```
3. From root directory, to lint client and server in one go, run: ```npm run lint```

Go back to [contents](#contents)

---

### What does it do?

You can think of it as such:

A business owner (```superadmin```) manages the platform.  
They can create, update, and remove books, as well as manage other users.

Admins (```admin```) act as employees of the platform.  
They can manage books and customer users. They can not create or delete other admin users.

Customers (```customer```) can sign up, browse books, add items to their wishlist or cart, and complete purchases.

There are search functionalities with different types of filter options to find users/books.
All types of users can use these search functionalities to find books/users and perform their respective add/update/delete/restore actions.

Go back to [contents](#contents)

---

### How to use it?

1. [Start the app locally.](#how-to-run-this-project-locally). This will also populate the database with some [seed data](https://github.com/create-new-entity/bookden/tree/development/server/seed/seedData), so that it doesn't feel like an empty desert when the app starts. Meaning, a bunch of admin, customer users and lots of book data will already be inserted in the system. You can use any of the user to login and play in the system. There can be only one ```superadmin``` user. ```superadmin``` user can not be created/deleted.
2. Without logging in you can still do the following:
    1. Browse the books in homepage
    2. Click the catalog link and browse the books there. Searching in the top nav will also lead to the catalog page.
    3. Click any of the book cover anywhere, this will lead to single book view page. You can add to cart from there.
    4. If you are in the catalog page, you can also hover and add to cart from there. If you try to wishlist any item, you should be logged in as a customer.
    5. After you add a bunch of books into cart, click the cart icon from top. This will lead to cart page. Checkout requires logging in as a customer.
3. How to use as a ```superadmin```:
    1. Log in as the superadmin. username: ```superadmin```, password: 
    2. From the top right avatar menu you can go to ```Admin Tools```
        1. ```Admin Tools``` -> ```User Management``` -> Shows all the users ( admin, customer ) details that are available in the system. All of these users have password:  ( for example, username: zoe_kendall, password: ). You can also use any of this users and login as an admin or customer.
        2. ```Admin Tools``` -> ```Book Management``` -> Shows all the books details that are available in the system. You can use the ```Add Book``` button to create a new book in the system. You can also edit, delete and restore any book.
        3. User and Book ```delete``` actions are ```soft delete actions``` and they can be restored.

4. How to use as an ```admin```:
    1. You can find out which admin user you want to use from the previous step. You can go to admin tools -> user management as superadmin and see the list of admin users available. You need the username from here. All users have password: . Or you can also create a new admin and use that to login.
    2. As an admin user, you can delete / restore customer account and CRUD books in the system.

5. How to use as a ```customer```:
    1. You can find out which customer user you want to use from the admin tools -> user management page. You need the username from here. All users have password: . Or you can also sign up from the authentication page. Hit the login button from nav and this will lead you to the signin / signup page.
    2. Once you have logged in as a customer you can browse book catalog, add/remove book from wishlist, add/remove book from/to cart and also checkout.

6. The search feature in book catalog / book management / user management page has multiple filter options. The more options you select the narrower the search will become ( [getBooksInternal](https://github.com/create-new-entity/bookden/blob/development/server/services/bookService.ts#L62), [getAllUsers](https://github.com/create-new-entity/bookden/blob/development/server/services/userService.ts#L34) ).


Go back to [contents](#contents)

---

### Project Architecture

```
bookden/
│
├── client/                        # React + TypeScript frontend (Vite)
│   ├── public/                   # Static assets (served directly)
│   │   └── assets/
│   │       ├── hero-banners/
│   │       └── images/
│   │           └── errors/
│   │
│   ├── src/
│   │   ├── api/                  # HTTP layer (Axios clients)
│   │   ├── actions/              # Client-side actions / orchestration
│   │   ├── components/
│   │   │   ├── app/              # Domain components (BookCard, HeroBanner, etc.)
│   │   │   └── custom/           # Reusable UI primitives (Carousel, etc.)
│   │   │
│   │   ├── hooks/                # Data fetching + business hooks
│   │   │   ├── useBook/
│   │   │   └── useBookCover/
│   │   │
│   │   ├── pages/                # Route-level pages
│   │   │   ├── BookPage/
│   │   │   ├── CartPage/
│   │   │   ├── AdminToolsPage/
│   │   │   └── ErrorPages/
│   │   │
│   │   ├── routes/               # Routing + guards
│   │   │   └── guards/
│   │   │
│   │   ├── contexts/             # Global state (Auth, Cart, etc.)
│   │   ├── constants/            # App constants
│   │   ├── data/                 # Static data (e.g., hero banners)
│   │   ├── theme/                # MUI theme system
│   │   ├── types/                # TypeScript types
│   │   ├── utility/              # Helper functions
│   │   └── validations/          # Zod schemas
│   │
│   └── tests/                   # Frontend unit/integration tests
│
├── server/                      # Node.js + Express backend
│   ├── controllers/            # Route handlers
│   ├── services/               # Business logic layer
│   ├── routes/                 # Express route definitions
│   ├── middlewares/            # Auth, error handling, etc.
│   ├── validation/             # Request validation (Zod)
│   ├── errors/                 # Custom error classes
│   ├── utilities/              # Shared backend utilities
│   ├── types/                  # Backend types
│   ├── typeAliases/            # Slonik type aliases
│   │
│   ├── configs/                # DB, Redis, app configs
│   ├── migrations/             # SQL migrations
│   │   └── sqls/
│   ├── seed/                   # Seed scripts + datasets
│   │   ├── dataToCollect/
│   │   └── seedData/
│   │
│   ├── requests/               # API request examples (Postman-style)
│   │   ├── books/
│   │   ├── users/
│   │   ├── orders/
│   │   └── avatar/
│   │
│   ├── scripts/                # Utility scripts
│   └── tests/                  # Backend tests (unit + integration)
│       ├── book/
│       ├── user/
│       ├── order/
│       └── testUtils/
│
├── e2e/                        # Playwright end-to-end tests
│   ├── auth/
│   ├── admin-tools/
│   ├── book/
│   ├── profile/
│   └── constants/
│
├── env/                        # Environment configurations
│   ├── dev/
│   ├── test/
│   ├── e2e/
│   └── prod/
│
├── docker-compose.*.yml        # Environment-specific orchestration
│   ├── dev / test / e2e / prod
│   └── CI variants
│
├── Dockerfile.client.prod      # Production build (frontend)
├── Dockerfile.server.prod      # Production build (backend)
│
├── .github/
│   └── workflows/
│       └── bookden-ci-cd.yaml  # CI/CD pipeline
│
└── package.json                # Monorepo root config
```

Go back to [contents](#contents)

---

### System Design Highlights

- Clear separation of concerns (controllers → services → data layer)
- Type-safe validation using Zod across client and server
- Dynamic SQL query composition using Slonik
- Deep-linkable search state via URL-driven filters
- Reusable, decoupled UI components (e.g., generic Items, Carousel)
- Soft-delete strategy with restore capability
- Multi-environment Docker setup (dev, test, e2e, prod)
- CI/CD pipeline with automated testing

Go back to [contents](#contents)

---

### Some interesting places in code worth checking

- [getBooksInternal](https://github.com/create-new-entity/bookden/blob/development/server/services/bookService.ts#L62): Based on different contexts and options, narrows down what books should be returned to the client.

- [useDeepLinkedSearchParams](https://github.com/create-new-entity/bookden/blob/development/client/src/hooks/useDeepLinkedSearchParams.ts#L11): This is wrapped by [useBookManagementDeepLinking](https://github.com/create-new-entity/bookden/blob/development/client/src/hooks/useBookManagementDeepLinking.ts#L6) and [useUserManagementDeepLinking](https://github.com/create-new-entity/bookden/blob/development/client/src/hooks/useUserManagementDeepLinking.ts#L6). useDeepLinkedSearchParams embeds whatever filtering options have been selected to filter out books/users in books catalog page / books management page / user management page. Meaning this hook is scalable for different use cases.

- [BookListLayout.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/components/app/BookListLayout.tsx#L86): A component that renders a bunch of books. Re used in [AdminBookManagementPage.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/pages/AdminBookManagementPage.tsx#L9), [BookCatalogPage](https://github.com/create-new-entity/bookden/blob/development/client/src/pages/BookCatalogPage.tsx#L10) and  [WishListPage](https://github.com/create-new-entity/bookden/blob/development/client/src/pages/WishListPage.tsx#L11).

- [Items.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/components/app/Items.tsx#L50): A generic, decoupled, "dumb" items component. It's only purpose is to render a bunch of items, regardless of what they are. Used in [BookListLayout.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/components/app/BookListLayout.tsx#L86) and in [UserManagementPage.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/pages/UserManagementPage.tsx#L78).

- [Carousel.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/components/custom/Carousel/Carousel.tsx#L89): Visible at home page. Used in [HeroBannerCarousel.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/components/app/HeroBanner/HeroBannerCarousel.tsx#L8) and  [BooksCarousel.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/components/app/BooksCarousel.tsx#L48). It is also another "dumb" component. Given a bunch of "items" and the "know-how" of how to render those items ( through ```SlideComponent``` props ), it can render any collection of items as slides / carousel.

Go back to [contents](#contents)

---

### Demo Screenshots / GIFs

![Bookden Demo mov-2026-03-22T09 17 36](https://github.com/user-attachments/assets/50fee929-5955-4062-bb8e-34e04c101b6f)

![Bookden Demo mov-2026-03-22T09 18 21](https://github.com/user-attachments/assets/ea2524e3-c3f8-41af-bf8b-c3e3dbf1921f)

![Bookden Demo mov-2026-03-22T09 18 54](https://github.com/user-attachments/assets/64f7fe5f-df2c-4a98-af06-6a07fc4a3cd2)

![Bookden Demo mov-2026-03-22T09 19 09](https://github.com/user-attachments/assets/e50cc57e-c11d-4908-8e4c-de51adf4bd03)


Go back to [contents](#contents)

---

### Demo Video

You can watch the demo video [here](https://drive.google.com/file/d/1wsqUZ9ASxkggY5u_o6gIT_WbGqP-LRLE/view?usp=sharing).

Go back to [contents](#contents)

---

### Live Demo

You can try the app online here: https://mdimranpavel.com/projects/bookden/

Go back to [contents](#contents)

---

### Project Hours

Listed in this [google sheet](https://docs.google.com/spreadsheets/d/1vPSLy_XRG4CI-X7Amg12En3yJ-e00_dkvOvxsOblBgs/edit?usp=sharing).

Go back to [contents](#contents)

---

### Usage of generative language models

None of the code files in the repo is entirely generated by AI.
However, I did take assistance while developing to achieve things faster.
This means: conceptualize what to achieve -> chat + refactor + fine tune until the solution is good enough. Sometimes some parts of the code, sometimes the architecture. I mostly used chatgpt plus. I also used cursor. Cursor mostly
assisted with faster autocomplete / refactors.

Go back to [contents](#contents)

---

### Final Review / Assessment

Review can be seen [here](https://github.com/create-new-entity/bookden/issues/58).

Summary of the review:

```
Bookden is a highly ambitious and well-executed fullstack project that
convincingly simulates a real e-commerce platform with a multi-role system.
The project architecture is well thought out and the code is clearly organized.
This is an excellent portfolio project that demonstrates
broad expertise across frontend, backend, and DevOps.

Great work!
```

Go back to [contents](#contents)

---

### Other

Thanks for coming by 🙂. You may also wanna browse [this repo](https://github.com/create-new-entity/fso-open).

Go back to [contents](#contents)

---