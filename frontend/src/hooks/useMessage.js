import { useContext } from 'react';
import { MessageContext } from '../contexts/MessageContext';

export const useMessage = () => {
  const messageApi = useContext(MessageContext);
  if (!messageApi) {
    throw new Error('useMessage must be used within a MessageContext.Provider');
  }
  return messageApi;
}; 