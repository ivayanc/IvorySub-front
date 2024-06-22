import UsersPageListDisplay from './UsersPageListDisplay'



const users = [
    { username: 'user1', info: 'Short info about user1' },
    { username: 'user2', info: 'Short info about user2' },
    { username: 'user3', info: 'Short info about user3' },
    { username: 'user5', info: 'Short info about user5' },
];

const UserSubscriptionsPage = () => {
    return UsersPageListDisplay(users);
}

export default UserSubscriptionsPage;