import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const NavBar = () => {
  const { data: user } = useSession();

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link href="/">
          <div className="hover:cursor-pointer">
            <span className="font-semibold text-xl tracking-tight">
              Group Pray
            </span>
          </div>
        </Link>
      </div>
      <div className="flex items-center align-middle">
        {user ? (
          <>
            <a
              onClick={() => signOut()}
              className="mr-3 text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0 hover:cursor-pointer"
            >
              Log out
            </a>
            <Image
              src={
                user.user?.image ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
              }
              alt={`${user?.user?.fname} ${user?.user?.lname}` || "user"}
              width={30}
              height={30}
            />
          </>
        ) : (
          <>
            <a
              onClick={() => signIn()}
              className="mr-3 text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0 hover:cursor-pointer"
            >
              Log in
            </a>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
