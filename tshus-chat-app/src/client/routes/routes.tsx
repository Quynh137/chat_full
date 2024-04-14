import Main from '@/common/layout/frontend';
import Chat from '@/client/pages/chat';
import Phonebook from '@/client/pages/phonebook';
import { AddressBook, WechatLogo } from '@phosphor-icons/react';


// Client route
const publicClientRoutes: any = [
  {
    name: 'Trò chuyện',
    path: '/',
    component: Chat,
    layout: Main,
    icon: WechatLogo,
  },
  {
    name: 'Danh bạ',
    path: '/contact',
    component: Phonebook,
    layout: Main,
    icon: AddressBook,
  },
];


const privateClientRoute: any = [];

// Admin route
const adminRoute: any = [];

export { publicClientRoutes, privateClientRoute, adminRoute };
