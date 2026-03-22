
# Bookden - A portfolio e-commerce site

### Contents
- [What is bookden?](#what-is-bookden)
- [What is the tech stack of this project?](#what-is-the-tech-stack-of-this-project)
- [How to run this locally?](#how-to-run-this-locally)
- [How to run tests locally?](#how-to-run-tests-locally)
- [How to lint locally?](#how-to-lint-locally)
- [Is the project deployed somewhere online?](#is-the-project-deployed-somewhere-online)
- [What does it do?](#what-does-it-do)
- [How to use it?](#how-to-use-it)
- [Project Architecture](#project-architecture)
- [Some interesting pieces of code worth checking](#some-interesting-pieces-of-code-worth-checking)
- [Demo Screenshot/GIFs](#demo-screenshots--gifs)
- [Demo Video](#demo-video)
---

### What is bookden?
It is an e commerce platform where the "owner" of the app can list out books for sale to the potential customers. Customers
can browse through books, wishlist thme, purchase them.

Go bak to [contents](#contents)

---

### What is the tech stack of this project?

1. Frontend: React + React Query + TypeScript + Zod + Material UI
2. Backend: Node + Postgresql + Slonik + TypeScript + Zod + db-migrate ( migrations )
3. Containerzation ( Docker ) + Github Actions ( CI/CD )
4. Playwright

Go bak to [contents](#contents)

---

### How to run this locally?

1. Create env files. You can simply rename the "server.env.example" to "server.env" and so on. The example files actually contains values that can be used. There is nothing in env files that needed hiding, hence I pushed them in *.env.example files 🙃.
2. Make sure you have docker desktop in your machine.
3. From root directory, to start the project, run this command: ```npm run start:dev```
4. From root directory, to stop the project, run this command: ```npm run stop:dev```

Go bak to [contents](#contents)

###

---

### How to run tests locally?

How to run e2e tests locally:
1. From root directory, run: ```npm run e2e```
2. Once tests are done, run: ```npm run e2e:infra:down```

How to run other tests locally ( from root directory ):
1. From root directory, run: ```npm run test:server```
2. From root directory, run: ```npm run test:client```
3. To run both server and client tests in one go, run: ```npm run test```

Go bak to [contents](#contents)

---

### How to lint locally?

1. From root directory, to lint client, run: ```npm run lint:client```
2. From root directory, to lint server, run: ```npm run lint:server```
3. From root directory, to lint client and server in one go, run: ```npm run lint```

Go bak to [contents](#contents)

---

### Is the project deployed somewhere online?

Yes. Please send me a DM on [linkedIn](https://www.linkedin.com/in/md-imran-p-17725182/) if you are interested. I'll share you the link.

Go bak to [contents](#contents)

---

### What does it do?

You can think of it as such:

A business owner, owns the site. He add/remove/update books that can be sold.
He is the ```superadmin``` type. He can add/remove/update users who can add/remove/update books for him.

This second type of users are ```admin``` type.
This type of user can be thought of as employees (admin type) of the business owner (superadmin type).

The third type of users are ```customer``` type. They create their accounts by signing up from the authentication page. They can
update their profile and also delete their profile.

superadmin or admin users can delete/restore customer type accounts.
superadmin can also delete/restore admin type accounts.

Customers can wishlist books, purchase books.

There are search functionalities with different types of filter options to find users/books.
All types of users can use these search functionalities to find books/users and perform their respective add/update/delete/restore actions.

Go bak to [contents](#contents)

---

### How to use it?

1. [Start the app locally.](#how-to-run-this-locally). This will also populate the database with some [seed data](https://github.com/create-new-entity/bookden/tree/development/server/seed/seedData), so that it doesn't feel like an empty desert when the app starts. Meaning, a bunch of admin, customer users and lots of book data will already be inserted in the system. You can use any of the user to login and play in the system.
2. Without logging in you can still do the following:
    1. Browse the books in homepage
    2. Click the catalog link and browse the books there. Searching in the top nav will also lead to the catalog page.
    3. Click any of the book cover anywhere, this will lead to single book view page. You can add to cart from there.
    4. If you are in the catalog page, you can also hover and add to cart from there. If you try to wishlist any item, you should be logged in as a customer.
    5. After you add a bunch of books into cart, click the cart icon from top. This will lead to cartpage. Checkout requires logging in as a customer.
3. How to use as a ```superadmin```:
    1. Log in as the superadmin. username: ```superadmin```, password: ```password```
    2. From the top right avatar menu you can go to ```Admin Tools```
        1. ```Admin Tools``` -> ```User Management``` -> Shows all the users ( admin, customer ) details that are available in the system. All of these users have password: ```password``` ( for example, username: zoe_kendall, password: password ). You can also use any of this users and login as an admin or customer.
        2. ```Admin Tools``` -> ```Book Management``` -> Shows all the books details that are available in the system. You can use the ```Add Book``` button to create a new book in the system. You can also edit, delete and restore any book.
        3. User and Book ```delete``` actions are ```soft delete actions``` and they can be restored.

4. How to use as an ```admin```:
    1. You can find out which admin user you want to use from the previous step. You can go to admin tools -> user management as superadmin and see the list of admin users available. You need the username from here. All users have password "password". Or you can also create a new admin and use that to login.
    2. As an admin user, you can delete / restore customer account and CRUD books in the system.

5. How to use as a ```customer```:
    1. You can find out which customer user you want to use from the admin tools -> user management page. You need the username from here. All users have password "password". Or you can also sign up from the authentication page. Hit the login button from nav and this will lead you to the signin / signup page.
    2. Once you have logged in as a customer you can browse book catalog, add/remove book from wishlist, add/remove book from/to cart and also checkout.

6. The search feature in book catalog / book management / user management page has multiple filter options. The more options you select the narrower the search will become ( [getBooksInternal](https://github.com/create-new-entity/bookden/blob/development/server/services/bookService.ts#L62), [getAllUsers](https://github.com/create-new-entity/bookden/blob/development/server/services/userService.ts#L34) ).


Go bak to [contents](#contents)

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

Go bak to [contents](#contents)

---

### Some interesting pieces of code worth checking

- [getBooksInternal](https://github.com/create-new-entity/bookden/blob/development/server/services/bookService.ts#L62): Based on different contexts and options, narrows down what books should be returned to the client.

- [useDeepLinkedSearchParams](https://github.com/create-new-entity/bookden/blob/development/client/src/hooks/useDeepLinkedSearchParams.ts#L11): This is wrapped by [useBookManagementDeepLinking](https://github.com/create-new-entity/bookden/blob/development/client/src/hooks/useBookManagementDeepLinking.ts#L6) and [useUserManagementDeepLinking](https://github.com/create-new-entity/bookden/blob/development/client/src/hooks/useUserManagementDeepLinking.ts#L6). useDeepLinkedSearchParams embeds whatever filtering options have been selected to filter out books/users in books catalog page / books management page / user management page. Meaning this hook is scalable for different use cases.

- [BookListLayout.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/components/app/BookListLayout.tsx#L86): A component that renders a bunch of books. Re used in [AdminBookManagementPage.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/pages/AdminBookManagementPage.tsx#L9), [BookCatalogPage](https://github.com/create-new-entity/bookden/blob/development/client/src/pages/BookCatalogPage.tsx#L10) and  [WishListPage](https://github.com/create-new-entity/bookden/blob/development/client/src/pages/WishListPage.tsx#L11).

- [Items.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/components/app/Items.tsx#L50): A generic, decoupled, "dumb" items component. It's only purpose is to render a bunch of items, regardless of what they are. Used in [BookListLayout.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/components/app/BookListLayout.tsx#L86) and in [UserManagementPage.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/pages/UserManagementPage.tsx#L78).

- [Carousel.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/components/custom/Carousel/Carousel.tsx#L89): Visible at home page. Used in [HeroBannerCarousel.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/components/app/HeroBanner/HeroBannerCarousel.tsx#L8) and  [BooksCarousel.tsx](https://github.com/create-new-entity/bookden/blob/development/client/src/components/app/BooksCarousel.tsx#L48). It is also another "dumb" component. Given a bunch of "items" and the "know-how" of how to render those items ( through ```SlideComponent``` props ), it can render any collection of items as slides / carousel.

---

### Demo Screenshots / GIFs

![Bookden Demo mov-2026-03-22T09 19 09](https://github.com/user-attachments/assets/e50cc57e-c11d-4908-8e4c-de51adf4bd03)
![Bookden Demo mov-2026-03-22T09 18 54](https://github.com/user-attachments/assets/64f7fe5f-df2c-4a98-af06-6a07fc4a3cd2)
![Bookden Demo mov-2026-03-22T09 18 21](https://github.com/user-attachments/assets/ea2524e3-c3f8-41af-bf8b-c3e3dbf1921f)
![Bookden Demo mov-2026-03-22T09 17 36](https://github.com/user-attachments/assets/50fee929-5955-4062-bb8e-34e04c101b6f)


Go bak to [contents](#contents)

---

### Demo Video

You can watch the demo video [here](https://drive.google.com/file/d/1wsqUZ9ASxkggY5u_o6gIT_WbGqP-LRLE/view?usp=sharing).

Go bak to [contents](#contents)

---
