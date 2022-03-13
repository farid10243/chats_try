import Avatar from '@/Components/Avatar';
import { Link, usePage } from '@inertiajs/inertia-react';
import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Transition, Tab } from '@headlessui/react';
import { Inertia } from '@inertiajs/inertia';

const me = (user, auth) => {
    if (user.user_1 == auth.user.id) {
        return user.user_two;
    } else if (user.user_2 == auth.user.id) {
        return user.user_one;
    }
};

// const lastChatAt = (sent_at) => {
//     const now = Math.round(new Date().getTime() / 1000)
//     const diff = Math.floor((now - sent_at));
//     console.log(diff);
//     if (diff < 60) {
//         return `${diff} seconds ago`;
//     } else if (diff < 3600) {
//         return `${Math.floor(diff / 60)} minutes ago`;
//     } else if (diff < 86400) {
//         return `${Math.floor(diff / 3600)} hours ago`;
//     } else {
//         return `${Math.floor(diff / 86400)} days ago`;
//     }
// }

const lastChatAt = (sent_at_raw, sent_at) => {
    const now = Math.round(new Date().getTime() / 1000)
    const night = Math.round(new Date().setHours(0, 0, 0, 0) / 1000)
    if (sent_at_raw > night) {
        return sent_at;
    }else if (sent_at_raw > night - 86400) {
        return 'Yesterday';
    }else {
        let date = new Date(sent_at_raw * 1000)
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

}

const chatOrGroup = (idx, chat, auth) => {
    idx == 0 ? me(chat, auth).username : chat.name;
    if (idx == 0) {
        return ['chats.show', me(chat, auth).username, me(chat, auth).name];
    }else{
        return ['groups.show', chat.slug, chat.name];
    }
}

function Dropdown() {
    return (
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button title="Options" className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            <Menu.Item>
                                {({ active }) => (
                                    <Link as="button" href={route('logout')} method="POST"
                                        className={`${active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                    >
                                        {active ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                        )}
                                        Logout
                                    </Link>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
    );
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

function Tabs({ auth }) {
    const { chats, groups } = auth;
    let [tabsLabel] = useState({
        chats,
        groups,
    });

    useEffect(() => {
        console.log(auth)
        // Inertia.reload()
    }, [auth])
    return (
        <div className="w-full max-w-md px-4` sm:px-0">
            <Tab.Group>
                <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
                    {Object.keys(tabsLabel).map((category) => (
                        <Tab
                            key={category}
                            className={({ selected }) =>
                                classNames(
                                    'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
                                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                                    selected
                                        ? 'bg-white shadow'
                                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                )
                            }
                        >
                            {category}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className="mt-2">
                    {Object.values(tabsLabel).map((chats, idx) => (
                        <Tab.Panel
                            key={idx}
                            className={classNames(
                                'bg-white rounded-xl p-3',
                                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
                            )}
                        >
                                {chats.length > 0 ? chats.map((chat) => {
                                    let cog= chatOrGroup(idx, chat, auth);
                                    return (
                                        <div key={chat.id} className="p-2 bg-white border-b hover:bg-gray-200">
                                            <Link href={route(cog[0], cog[1])}>
                                                <div className='flex items-start justify-between'>
                                                    <span className={` ${route().current(cog[0], cog[1]) ? 'text-sky-700 font-semibold' : 'text-gray-900'}`}>{cog[2]}</span>
                                                    <span className='text-xs text-gray-600' >{chat.last_message && lastChatAt(chat.last_message.sent_at_raw, chat.last_message.sent_at)}</span>
                                                </div>
                                                <span className={`block ${route().current(cog[0], cog[1]) ? 'text-black font-semibold' : 'text-gray-500'}`}>{chat.last_message ? chat.last_message.message.length > 28 ? chat.last_message.message.substring(0, 28) + '...' : chat.last_message.message : 'Start chat'}</span>
                                            </Link>
                                        </div>
                                    )
                                })
                                : <div className="bg-white hover:bg-gray-200">
                                    <span className="text-gray-500">No chat</span>
                                    </div>
                                }
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}



export default function App(props) {
    const [showNewChat, setShowNewChat] = useState(false)
    const { auth } = usePage().props;
    
    return (
        <div className="flex min-h-screen">
            <div className="w-2/6">
                <div className="fixed flex flex-col w-2/6 h-full text-left border-r">
                    <div className="bg-[#202c33] flex justify-between px-5 py-4">
                        <Avatar src={auth.user && auth.user.avatar}/>
                        <div className="flex items-center gap-x-3">
                            
                            {/* <NewChat users={users} /> */}
                            <div onClick={() => showNewChat == true ? setShowNewChat(false) : setShowNewChat(true)} aria-disabled="false" role="button" tabIndex={0} className="text-gray-200" title="Chat baru" aria-label="Chat baru">
                                <span data-testid="chat" data-icon="chat">
                                    <svg viewBox="0 0 24 24" width={24} height={24}>
                                        <path fill="currentColor" d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z" />
                                    </svg>
                                </span>
                            </div>
                            <Dropdown />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-gradient-to-r from-cyan-500 to-blue-500">
                        
                        {showNewChat ? 
                            <>
                                <div className="grid py-2">
                                    <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-white via-sky-100 to-white justify-self-center">New Chats</h3>
                                </div>
                                {
                                    auth.users ? auth.users.map(user => (
                                        <div key={user.id} className="p-2 bg-white border-b hover:bg-gray-200">
                                            <Link href={route('chats.new', user.username)} method="POST" as="button"
                                                className={`block text-left w-full focus:outline-none ${route().current('chats.show', user.username) ? 'text-blcak font-semibold' : 'text-gray-600'}`} >
                                                {user.name}
                                                <span className='block'>{user.email}</span>
                                            </Link>
                                        </div>
                                    ))
                                    : ''
                                }
                            </>
                        :
                            <Tabs auth={auth} />
                        }
                    </div>
                </div>
            </div>

            <div className="w-4/6">
                {props.children}
            </div>
        </div>
    );
}
