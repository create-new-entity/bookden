

import { Routes, Route } from 'react-router-dom';


import {
    ADMIN_TOOLS, AUTH, CREATE_ADMIN_USER, HOME,
    UPDATE_PROFILE, USER, USER_MANAGEMENT, BOOK_MANAGEMENT,
    BOOK, CREATE_BOOK, SUPERADMIN,
    ADMIN, UPDATE_BOOK, BOOKS,
    UNAUTHORIZED, NOT_FOUND, WISHLIST, CART,
    CUSTOMER
} from '../constants';
import {
    RequireAuth, RequireRole
} from './guards';
import {
    CreateBookPage, UpdateBookPage, LogInPage,
    CreateAdminOrUpdateAnyUserProfilePage, UserPage, BookPage,
    AdminToolsPage, UserManagementPage, HomePage,
    UnauthorizedPage, NotFoundPage, BookCatalogPage,
    AdminBookManagementPage,
    WishListPage,
    CartPage
} from '../pages';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={AUTH} element={<LogInPage/>} />

            { /* Routes that require authentication */}
            <Route element={<RequireAuth />}>

                { /* Routes allowed for any ( customer, admin, superadmin ) logged in user */}
                <Route path={UPDATE_PROFILE} element={<CreateAdminOrUpdateAnyUserProfilePage mode='update'/>}/>
                
                { /* Routes allowed for logged in superadmin */}
                <Route element={<RequireRole allowedRoles={[SUPERADMIN]} />}>
                    <Route path={CREATE_ADMIN_USER} element={<CreateAdminOrUpdateAnyUserProfilePage mode='create'/>}/>
                </Route>

                { /* Routes allowed for logged in superadmin or admin */}
                <Route element={<RequireRole allowedRoles={[SUPERADMIN, ADMIN]} />}>
                    <Route path={ADMIN_TOOLS} element={<AdminToolsPage/>} />
                    <Route path={CREATE_BOOK} element={<CreateBookPage/>}/>
                    <Route path={UPDATE_BOOK} element={<UpdateBookPage/>}/>
                    <Route path={USER_MANAGEMENT} element={<UserManagementPage/>} />
                    <Route path={BOOK_MANAGEMENT} element={<AdminBookManagementPage/>} />
                </Route>

                { /* Routes allowed for logged in customer */ }
                <Route element={<RequireRole allowedRoles={[CUSTOMER]} />}>
                    <Route path={WISHLIST} element={<WishListPage/>} />
                </Route>
            </Route>
            
            { /* Routes that don't require authentication */}
            <Route path={USER} element={<UserPage/>}/>
            <Route path={BOOK} element={<BookPage/>}/>
            <Route path={BOOKS} element={<BookCatalogPage/>}/>
            <Route path={CART} element={<CartPage/>}/>
            <Route path={UNAUTHORIZED} element={<UnauthorizedPage/>} />
            <Route path={NOT_FOUND} element={<NotFoundPage/>} />
            <Route path={HOME} element={<HomePage/>} />
            <Route path={'*'} element={<NotFoundPage/>} />
        </Routes>
    );
};

export default AppRoutes;
