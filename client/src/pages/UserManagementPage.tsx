
import { CustomAutoComplete } from '../components';
import useUsersList from '../hooks/useUsersList';



const UserManagementPage = () => {
    const { usersList, search, setSearch, page, setPage, sortBy, setSortBy, sortOrder, setSortOrder, userType, setUserType } = useUsersList();

    console.log('usersList', usersList.data);
    return (
        <div style={{ marginTop: '2rem', overflowY: 'auto', maxHeight: 'calc(100vh - 7rem)' }}> 
            <CustomAutoComplete id='userManagementSearchBox'/>
            {
                usersList.data?.map((user) => (
                    <div key={user.userId}>
                        <h2>{user.username}</h2>
                        <p>{user.email}</p>
                        <p>{user.userType}</p>
                        <p>{user.createdAt}</p>
                    </div>
                ))
            }
            
        </div>
    );
};

export default UserManagementPage;