import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';

export default function Navbar() {
    const [username, setUsername] = useState('');
    const [greeting, setGreeting] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('activeUser');
        if (storedUser) {
            setUsername(storedUser);
        }
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good morning');
        } else if (hour < 18) {
            setGreeting('Good afternoon');
        } else {
            setGreeting('Good evening');
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-3 shadow-md flex justify-between items-center">
            {/* Left side: Navigation Links */}
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link to="/dashboard" className="font-semibold hover:underline">
                                Home
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link
                                to="/dashboard/add-food"
                                className="font-semibold hover:underline"
                            >
                                Add Foods
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {/* Right side: Greeting + Logout */}
            <div className="flex items-center space-x-4">
                {username && (
                    <span className="text-sm font-medium">
                        {greeting}, {username}
                    </span>
                )}

                {/* AlertDialog for Logout Confirmation */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="bg-red-500 hover:bg-red-600 text-white">Logout</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLogout}>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </nav>
    );
}
