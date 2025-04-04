import React, { createContext, useState } from 'react';

export const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    //Function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    }

    // Update to Clear user data (e.g , on logout)
    const clearUser = () => {
        setUser(null);
    };

    // Update User Stats
    const updateUserStats = (key, value) => {
        setUser((prev) => ({...prev, [key]: value }));
    }

    // Update totalPollsVotes count locally
    const onUserVoted = () => {
        const totalPollsVotes = user.totalPollsVotes || 0;
        updateUserStats("tatalPollsVotes" , totalPollsVotes + 1);
    }

    // Update totalPollScreated count locaaly
    const onPollCreateOrDelete = (type = "create") => {
        const totalPollscreated = user.totalPollscreated || 0;
        updateUserStats(
            "totalPollscreated",
            type == "create" ? totalPollscreated + 1 : totalPollscreated - 1
        )
    }

    // Add or remove poll id from the bookmarkedPolls
    const toggleBookmarkId = (id) => {
        const bookmarks = user.bookmarkedPolls || [];

        const index = bookmarks.indexOf(id)

        if(index === -1){
            //Add the ID if it's not in the array
            setUser((prev) => ({
                ...prev,
                bookmarkedPolls: [...bookmarks, id],
                totalPollsBookmarked: prev.totalPollsBookmarked + 1
            }))
        } else{
            //Remove the ID if it's in the array
            setUser((prev) => ({
                ...prev,
                bookmarkedPolls: bookmarks.filter((item) => item !== id),
                totalPollsBookmarked: prev.totalPollsBookmarked - 1
            }))
        }
    }

    return <UserContext.Provider
        value={{
            user,
            updateUser,
            clearUser,
            onPollCreateOrDelete,
            onUserVoted,
            toggleBookmarkId
        }}
    >
        {children}</UserContext.Provider>
}

export default UserProvider