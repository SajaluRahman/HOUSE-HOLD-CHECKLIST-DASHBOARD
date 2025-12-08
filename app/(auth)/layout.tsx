export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen flex items-center justify-center ">
      {/* Optional background or container */}
      <div className="w-full bg-white shadow-lg rounded-2xl ">
        {children}
      </div>
    </section>
  );
}
