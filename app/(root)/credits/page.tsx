import { SignedIn, auth, currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

import Header from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { plans } from "@/constants";
import { getOrCreateUser } from "@/lib/actions/user.actions";
import Checkout from "@/components/shared/Checkout";

const Credits = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const user = await getOrCreateUser(userId, {
    email: clerkUser?.emailAddresses[0]?.emailAddress || "",
    username:
      clerkUser?.username ||
      clerkUser?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
      "user",
    photo: clerkUser?.imageUrl || "",
    firstName: clerkUser?.firstName || "",
    lastName: clerkUser?.lastName || "",
  });

  return (
    <>
      <Header
        title="Buy Credits"
        subtitle="Choose a credit package that suits your needs!"
      />

      <section>
        <ul className="credits-list">
          {plans.map((plan) => (
            <li
              key={plan.name}
              className={`credits-item ${
                plan.name === "Pro Package" ? "credits-item-featured" : ""
              }`}
            >
              {plan.name === "Pro Package" && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 px-4 py-1.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(99,102,241,0.5)]">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex-center flex-col gap-3">
                <Image src={plan.icon} alt="check" width={50} height={50} />
                <p className="p-20-semibold mt-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {plan.name}
                </p>
                <p className="h1-semibold text-white">${plan.price}</p>
                <p className="p-16-regular text-cyan-300">
                  {plan.credits} Credits
                </p>
              </div>

              {/* Inclusions */}
              <ul className="flex flex-col gap-5 py-9">
                {plan.inclusions.map((inclusion) => (
                  <li
                    key={plan.name + inclusion.label}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src={`/assets/icons/${
                        inclusion.isIncluded ? "check.svg" : "cross.svg"
                      }`}
                      alt="check"
                      width={24}
                      height={24}
                      className={
                        inclusion.isIncluded
                          ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                          : ""
                      }
                    />
                    <p
                      className={`p-16-regular ${
                        inclusion.isIncluded
                          ? "text-slate-200"
                          : "text-slate-500"
                      }`}
                    >
                      {inclusion.label}
                    </p>
                  </li>
                ))}
              </ul>

              {plan.name === "Free" ? (
                <Button variant="outline" className="credits-btn">
                  Free Consumable
                </Button>
              ) : (
                <SignedIn>
                  <Checkout
                    plan={plan.name}
                    amount={plan.price}
                    credits={plan.credits}
                    buyerId={user._id}
                  />
                </SignedIn>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Credits;
