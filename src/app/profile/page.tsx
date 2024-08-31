import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "@/lib/auth";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <>
      <section className="bg-blue-600 min-h-screen pt-20">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-md h-[20rem] flex justify-center items-center">
          <div>
            <p className="mb-3 text-5xl text-center font-semibold">
              Profile Page
            </p>
            {!user ? (
              <p>Loading...</p>
            ) : (
              <div className="flex items-center gap-8">
                <div>
                    <Image
                        src="/avatar.png"
                        alt="Avatar"
                        width={100}
                        height={100}
                        className="rounded-full"
                    />
                </div>
                <div className="mt-8">
                  <p className="mb-3">Name: {user.name}</p>
                  <p className="mb-3">Email: {user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}