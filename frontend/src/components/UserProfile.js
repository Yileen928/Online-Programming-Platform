import { userApi } from '../api/user';

const UserProfile = () => {
  const handleLogin = async () => {
    try {
      const loginData = {
        username: 'test',
        password: '123456'
      };
      const result = await userApi.login(loginData);
      console.log('登录成功：', result);
    } catch (error) {
      console.error('登录失败：', error);
    }
  };
  
  return (
    <button onClick={handleLogin}>登录</button>
  );
};

export default UserProfile;
