import UsersPageListDisplay from './UsersPageListDisplay'

const users = [
    { username: 'user1', info: 'Short info about user1' },
    { username: 'user2', info: 'Short info about user2' },
    { username: 'user3', info: 'Short info about user3' },
    { username: 'user4', info: 'Short info about user4' },
    { username: 'user5', info: 'Short info about user5' },
    { username: 'user6', info: 'Short info about user6' },
];


const UsersPage = () => {
    return UsersPageListDisplay(users);
}

export default UsersPage;