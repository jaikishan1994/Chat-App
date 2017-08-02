
const actions = (() => {
    return {
        // Redirect user to chat
        redirectUser : (shouldRedirectUser, nickname) => ({
            type: 'REDIRECT_USER',
            payload: {shouldRedirectUser, nickname}
        }),

        // Add user to group
        addUserToGroup: (groupName, groupId, usersList) => ({
            type: 'ADD_USER_TO_GROUP',
            payload: {groupName, groupId, usersList}
        }),

        // Remove user from group
        removeUserFromGroup: (groupsList, nickname) => ({
            type: 'REMOVE_USER_FROM_GROUP',
            payload: {groupsList, nickname}
        }),

        // Toggle collapse for conversations tab
        toggleCollapse: () => ({
            type: 'TOGGLE_COLLAPSE'
        }),

        // UpdateChatRoom with messages
        updateChatRoom: (msg) => ({
            type: 'UPDATE_CHAT_ROOM',
            payload: msg
        })
    }
})();

export default actions;
