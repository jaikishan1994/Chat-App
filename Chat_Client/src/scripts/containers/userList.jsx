import React from 'react';
import {Collapse, Button} from 'reactstrap';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import config from '../utilities/config';
import actions from '../actions/userActions.js';
import UserListInterface from '../components/userListInterface.jsx';

class UserList extends React.Component {

    constructor(props) {
        super(props);
        this.socket = config.socket;
        this.defaultGroup = '';
        this.setDefaultGroup = this.setDefaultGroup.bind(this);
    }

    componentDidMount() {
        let { addUserToGroup, removeUserFromGroup, setActiveChatState, nickname } = this.props;
        
        // Add user to default group
        this.socket.on('setActiveUsersList', (groupName, groupId, usersList) => {
            this.setDefaultGroup(groupId);
            addUserToGroup(groupName, groupId, usersList);
            setActiveChatState(groupId, groupName);    
        });
        
        // Update active users list when a new user gets connected
        this.socket.on('newUserJoined', (groupName, groupId, connectedUser) => {
            this.setDefaultGroup(groupId);
            addUserToGroup(groupName, groupId, [connectedUser]); 
        });

        // Update active users list when user is disconnected
        this.socket.on('userDisconnected', (groupsList, nickname) => {
            removeUserFromGroup(groupsList, nickname);
        });

        // Fetch list of active users
        this.socket.emit('getActiveUsersList');
    }

    // Set default group name for users
    setDefaultGroup(groupId) {
        this.defaultGroup = this.defaultGroup.length === 0 ? groupId : this.defaultGroup; 
    }


    render() {
        let {toggleCollapse, 
             isCollapsed,
             nickname,
             messageObject,
             userGroups,
             updateUnseenMsgCount,
             setActiveChatState} = this.props;

        return (
            <div id = 'conversations-tab'>
                <div className = {!isCollapsed ? 'overlay show': 'overlay hide'}
                     onClick = {toggleCollapse}>
                </div>
                <Button color = 'primary' onClick = {toggleCollapse}>
                    Conversations
                </Button>
                <Collapse isOpen = {!isCollapsed} delay = {{show:0}}>
                    <UserListInterface 
                        userGroups = {userGroups} 
                        chatObject = {messageObject}
                        defaultGroup = {this.defaultGroup}
                        nickname = {nickname}
                        toggleCollapse = {toggleCollapse}
                        setActiveChatState = {setActiveChatState}
                        updateUnseenMsgCount = {updateUnseenMsgCount}
                    />
                </Collapse>            
            </div>
        );
    }
}

const mapStateToProps = ({conversationListReducer, loginReducer, chatroomReducer}) => {
    return {
        isCollapsed: conversationListReducer.isCollapsed,
        userGroups: conversationListReducer.userGroups,
        nickname: loginReducer.nickname,
        messageObject: chatroomReducer.messageObject
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addUserToGroup: (groupName, groupId, usersList) => {
            dispatch(actions.addUserToGroup(groupName, groupId, usersList));
        },

        removeUserFromGroup: (groupsList, nickname) => {
            dispatch(actions.removeUserFromGroup(groupsList, nickname));
        },

        setActiveChatState: (id, name) => {
            dispatch(actions.setActiveChatState(id, name));
        },

        toggleCollapse: () => {
            dispatch(actions.toggleCollapse());
        },

        updateUnseenMsgCount: (chatId, type) => {
            dispatch(actions.updateUnseenMsgCount(chatId, type));
        }
    }
}

// Typechecking for props
UserList.propTypes = {
    nickname: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList);