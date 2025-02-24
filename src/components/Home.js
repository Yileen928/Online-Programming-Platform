import React, { useEffect, useRef, useState } from 'react';
import { Avatar } from 'antd';

function Home() {
  // 使用useRef跟踪组件是否已挂载
  const isMounted = useRef(true);
  
  useEffect(() => {
    // 组件挂载时设置
    return () => {
      // 组件卸载时清理
      isMounted.current = false;
    };
  }, []);

  // 异步操作前检查组件是否仍然挂载
  const handleAsyncOperation = async () => {
    if (!isMounted.current) return;
    try {
      // 异步操作...
    } catch (error) {
      if (isMounted.current) {
        console.error('Error:', error);
      }
    }
  };

  // 确保在使用refs时进行存在性检查
  const someRef = useRef(null);
  const handleOperation = () => {
    if (someRef.current) {
      // 对ref的操作...
    }
  };

  return (
    <div>
      <Avatar.Group max={{ count: 2 }}>
        <Avatar src="user1.png" />
        <Avatar src="user2.png" />
        <Avatar src="user3.png" />
      </Avatar.Group>
    </div>
  );
}

export default Home; 