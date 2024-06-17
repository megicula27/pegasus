"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

const SignOutOnUnload = () => {
  useEffect(() => {
    const handleBeforeUnload = async (event: any) => {
      // Prevent the default behavior of the event
      event.preventDefault();
      // Call the signOut function from next-auth/react
      await signOut({ redirect: false });
      // Optionally, add a confirmation dialog (not recommended for sign out action)
      // event.returnValue = 'Are you sure you want to leave?';
    };

    // Add event listener for beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default SignOutOnUnload;
