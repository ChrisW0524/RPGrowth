import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = useAuth();

  const handleGetToken = async () => {
    const token = await getToken();
    console.log("Clerk Token:", token);
  };

  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton showName />
          </SignedIn>
          {children}
          <button onClick={handleGetToken}>Log Clerk Token</button>;
        </body>
      </html>
    </ClerkProvider>
  );
}
