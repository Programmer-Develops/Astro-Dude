import React, { createContext, useReducer, useContext } from 'react';

const ChatContext = createContext();

const initialState = {
  messages: [],
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_USER_MESSAGE':
      return { ...state, messages: [...state.messages, { text: action.payload, type: 'user' }] };
    case 'ADD_AI_MESSAGE':
      return { ...state, messages: [...state.messages, { text: action.payload, type: 'ai' }] };
    default:
      return state;
  }
};

const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export { ChatProvider, useChat };