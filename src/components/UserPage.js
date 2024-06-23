import { useEffect, useState } from 'react';
import UsersPageListDisplay from './UsersPageListDisplay';
import { useGun } from '../utils/GunContext';
import { useAccount } from '../utils/AccountContext';

const UsersPage = () => {
    const gun = useGun();
    const [users, setUsers] = useState({});
    const { account } = useAccount();
    
    useEffect(() => {
        if (gun) {
            const user = gun.get('users');
            user.map().on((u, id) => {
                if (u) {
                    setUsers(prevUsers => ({ ...prevUsers, [id]: { ...u, id } }));
                } else {
                    setUsers(prevUsers => {
                        const newUsers = { ...prevUsers };
                        delete newUsers[id];
                        return newUsers;
                    });
                }
            });

            return () => user.off();
        }
    }, [gun]);

    // Filter out the current account from the users list
    const filteredUsers = Object.values(users).filter(user => user.id !== account);

    return (
        <div>
            <UsersPageListDisplay users={filteredUsers} />
        </div>
    );
};

export default UsersPage;
