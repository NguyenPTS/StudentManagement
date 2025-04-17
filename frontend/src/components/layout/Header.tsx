import React from 'react';
import { Layout, Button, Avatar, Dropdown, Menu } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  MenuOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import type { Theme } from '../../context/ThemeContext';

interface HeaderProps {
  onToggleTheme: () => void;
  theme: Theme;
  onToggleMobileMenu: () => void;
}

const { Header: AntHeader } = Layout;

const Header: React.FC<HeaderProps> = ({ onToggleTheme, theme, onToggleMobileMenu }) => {
  const { user, logout } = useAuth();

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">
          <UserOutlined /> Hồ sơ
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={logout}>
        <LogoutOutlined /> Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="fixed w-full z-50 px-4 h-16 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onToggleMobileMenu}
          className="mr-4 md:hidden dark:text-white"
        />
        <Link to="/" className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Student Management
          </h1>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          type="text"
          icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          onClick={onToggleTheme}
          className="dark:text-white"
        />
        
        {user && (
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar icon={<UserOutlined />} />
              <span className="hidden md:inline text-gray-900 dark:text-white">
                {user.name}
              </span>
            </div>
          </Dropdown>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
