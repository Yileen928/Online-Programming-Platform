import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { List, Card, Button, message, Tag } from 'antd';
import { GithubOutlined, ImportOutlined, SyncOutlined } from '@ant-design/icons';
import axios from '../../utils/axios';

const RepoList = forwardRef((props, ref) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchRepos = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      console.log(`Fetching page ${pageNum}`);
      const response = await axios.get(`/api/github/repos?page=${pageNum}&per_page=30`);
      
      if (response.data) {
        const totalCount = parseInt(response.headers['x-total-count']);
        setTotal(totalCount);

        if (reset || pageNum === 1) {
          setRepos(response.data);
        } else {
          setRepos(prevRepos => [...prevRepos, ...response.data]);
        }
        
        const currentTotal = reset || pageNum === 1 ? 
          response.data.length : 
          repos.length + response.data.length;
          
        setHasMore(currentTotal < totalCount);
        
        console.log(`Loaded ${currentTotal}/${totalCount} repositories`);
      }
    } catch (error) {
      console.error('Error fetching repos:', error);
      message.error('获取仓库列表失败：' + (error.response?.data?.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    if (scrollHeight - scrollTop - clientHeight < 20 && !loading && hasMore) {
      console.log('Loading next page...');
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRepos(nextPage, false);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    fetchRepos(1, true);
  };

  const handleImport = async (repoId) => {
    try {
      await axios.post(`/api/github/import/${repoId}`);
      message.success('项目导入成功！');
    } catch (error) {
      message.error('导入失败：' + error.response?.data?.message || '未知错误');
    }
  };

  useImperativeHandle(ref, () => ({
    fetchRepos: handleRefresh
  }));

  useEffect(() => {
    fetchRepos(1, true);
  }, []);

  return (
    <div style={{ height: 'calc(100vh - 300px)', backgroundColor: '#1e1e1e', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        color: 'white'
      }}>
        <h2 style={{ color: 'white', margin: 0 }}>
          <GithubOutlined /> GitHub 仓库
        </h2>
        <div>
          <span style={{ marginRight: '16px', color: '#8b949e' }}>
            已加载: {repos.length} / 总数: {total}
          </span>
          <Button 
            icon={<SyncOutlined />} 
            onClick={handleRefresh}
            loading={loading}
          >
            刷新
          </Button>
        </div>
      </div>

      <div 
        style={{ 
          height: 'calc(100vh - 380px)', 
          overflowY: 'auto',
          paddingRight: '10px',
        }}
        onScroll={handleScroll}
      >
        <List
          dataSource={repos}
          split={false}
          renderItem={repo => (
            <List.Item
              style={{
                backgroundColor: '#2d2d2d',
                marginBottom: '10px',
                padding: '16px',
                borderRadius: '8px',
              }}
              actions={[
                <Button 
                  type="primary"
                  icon={<ImportOutlined />}
                  onClick={() => handleImport(repo.id)}
                >
                  导入
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<GithubOutlined style={{ 
                  color: repo.isPrivate ? '#f56a00' : '#1890ff',
                  fontSize: '20px'
                }} />}
                title={
                  <div>
                    <a 
                      href={repo.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#1890ff' }}
                    >
                      {repo.name}
                    </a>
                    {repo.isPrivate && 
                      <Tag color="orange" style={{ marginLeft: 8 }}>私有</Tag>
                    }
                  </div>
                }
                description={
                  <div style={{ color: '#8b949e' }}>
                    <div>{repo.description || '暂无描述'}</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      所有者: {repo.owner}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#8b949e' }}>
            加载中...
          </div>
        )}
        {!hasMore && repos.length > 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#8b949e' }}>
            已加载全部仓库
          </div>
        )}
      </div>
    </div>
  );
});

export default RepoList; 