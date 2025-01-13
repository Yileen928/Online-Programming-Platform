import { Tooltip } from 'antd';
import { useRef } from 'react';

const YourComponent = () => {
  const elementRef = useRef(null);

  return (
    <div ref={elementRef}>
      <Tooltip title="提示文本" getPopupContainer={() => elementRef.current}>
        {/* 内容 */}
      </Tooltip>
    </div>
  );
}; 