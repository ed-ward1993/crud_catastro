import Header from '@components/Header';
export default function MainLayout({ children }) {
  return (
    <>
      <div className="min-h-full">
        <Header />
        <main>
          <div className="max-w-full  py-6 ">{children}</div>
        </main>
       
      </div>
    </>
  );
}