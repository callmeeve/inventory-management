import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Streamline Your Inventory Management
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Acme Inventory is the ultimate solution for businesses to effortlessly track and manage their inventory.
                Say goodbye to manual processes and embrace the power of real-time insights.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button variant="default" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
          <Image
            src="/finance.png"
            width={400}
            height={400}
            alt="Finance"
            className="mx-auto overflow-hidden object-cover"
          />
        </div>
      </div>
    </section>
  );
}
