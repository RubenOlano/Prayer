import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const NavBar = () => {
  const { data: user } = useSession();

  return (
    <nav className="grid bg-teal-500 py-4 md:py-6 px-3 align-center ">
      <div className="col-start-1 col-end-4 md:col-end-3 items-center flex-shrink-0 text-white ">
        <Link href="/">
          <div className="hover:cursor-pointer">
            <span className="font-semibold text-lg md:text-xl tracking-tight">
              Group Pray
            </span>
          </div>
        </Link>
      </div>
      <div className="col-start-5  md:col-start-7 col-end-9 items-center grid grid-cols-7">
        {user ? (
          <>
            <a
              onClick={() => signOut()}
              className="text-center mr-3 text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0 hover:cursor-pointer col-start-3  md:col-start-4 col-end-7"
            >
              Log out
            </a>
            <div className="col-start-7 col-end-7 align-middle justify-center items-center flex">
              <Image
                src={
                  user.user?.image ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png"
                }
                alt={`${user.user?.name}` || "user"}
                width={30}
                height={30}
                className="rounded-full"
              />
            </div>
          </>
        ) : (
          <>
            <a
              onClick={() => signIn()}
              className="col-start-4 col-end-7 mr-3 text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white lg:mt-0 hover:cursor-pointer col-auto"
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
