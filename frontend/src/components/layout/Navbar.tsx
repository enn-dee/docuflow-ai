
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
const Navbar = () => {
    const isAuth = localStorage.getItem("token")

    return (
        <div className="w-full bg-[#dbd9d6]/90 backdrop-blur-md border border-white/20 p-2">
            <div className="w-full flex flex-row justify-around">

                <NavigationMenu >
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink>Home</NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink>About</NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink>Contact</NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>

                    <NavigationMenuList>

                        <NavigationMenuItem className="">
                            <NavigationMenuLink>{isAuth ? "Logout" : "Signin"}</NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

        </div >
    )
}

export default Navbar