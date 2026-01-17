

import { Routes, Route } from 'react-router-dom';


import {
    ADMIN_TOOLS, AUTH, CREATE_ADMIN_USER, HOME,
    UPDATE_PROFILE, USER, USER_MANAGEMENT, BOOK_MANAGEMENT,
    BOOK, CREATE_BOOK, SUPERADMIN,
    ADMIN, UPDATE_BOOK,
    UNAUTHORIZED,
    NOT_FOUND
} from '../constants';
import {
    RequireAuth, RequireRole
} from './guards';
import {
    CreateBookPage, UpdateBookPage, LogInPage,
    CreateAdminOrUpdateAnyUserProfilePage, UserPage, BookPage,
    AdminToolsPage, UserManagementPage, BookManagementPage, HomePage,
    UnauthorizedPage,
    NotFoundPage
} from '../pages';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path={AUTH} element={<LogInPage/>} />
            
            <Route element={<RequireAuth />}>
                <Route path={UPDATE_PROFILE} element={<CreateAdminOrUpdateAnyUserProfilePage mode='update'/>}/>
            </Route>
            
            <Route path={USER} element={<UserPage/>}/>
            <Route path={BOOK} element={<BookPage/>}/>

            <Route element={<RequireRole allowedRoles={[SUPERADMIN]} />}>
                <Route path={CREATE_ADMIN_USER} element={<CreateAdminOrUpdateAnyUserProfilePage mode='create'/>}/>
            </Route>

            <Route element={<RequireRole allowedRoles={[SUPERADMIN, ADMIN]} />}>
                <Route path={ADMIN_TOOLS} element={<AdminToolsPage/>} />
                <Route path={CREATE_BOOK} element={<CreateBookPage/>}/>
                <Route path={UPDATE_BOOK} element={<UpdateBookPage/>}/>
                <Route path={USER_MANAGEMENT} element={<UserManagementPage/>} />
                <Route path={BOOK_MANAGEMENT} element={<BookManagementPage/>} />
            </Route>

            <Route path={HOME} element={<HomePage/>} />
            <Route path={UNAUTHORIZED} element={<UnauthorizedPage/>} />
            <Route path={NOT_FOUND} element={<NotFoundPage/>} />
            <Route path={'*'} element={<NotFoundPage/>} />
        </Routes>
    );
};

export default AppRoutes;
