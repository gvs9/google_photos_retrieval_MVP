import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google Photos Retrieval MVP",
  description: "Memory guided search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Flex:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#f3f4f6] min-h-screen flex items-center justify-center p-4" suppressHydrationWarning>
        <div className="w-full h-[100dvh] sm:h-[850px] sm:max-h-[90vh] sm:max-w-[400px] bg-surface text-on-surface relative overflow-hidden sm:rounded-[40px] shadow-2xl ring-1 ring-surface-variant flex flex-col transform translate-x-0">
          <header className="absolute top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.2)]">
            <div className="h-16 px-space-md flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <button aria-label="Navigation menu" className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-variant/40 active:bg-surface-variant/70 text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[24px]">menu</span></button>
                <div className="flex items-center gap-space-sm"><img alt="Google Photos Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1U4ESRfgZ8rKRGBsOHbOnU2bv4k8qFvwHWe7-ZldOaVrnaQpmdTWY3pUMac56hoePJ8ymMtDJG6m1XGpAnM24fVdBmQWzBg1da1oCnhf3MTlVuTt1OKgxZqvnP-YbLYBjKJb3cf95dpp7jJ5rD2IHp_QRILiuTqY3F13WrBAW6lWbntSh7ZdxXMuwGQXHRAPneotugtNgjIOTqi5z4iavsQHV5t8YcM46xW2uA8d-bi7JnWrZ4mUfeY5WM" /><span className="font-title-lg text-title-lg tracking-tight text-on-surface">Google Photos</span></div>
              </div>
              <div className="flex items-center gap-space-sm">
                <span className="hidden font-title-sm text-title-sm text-on-surface-variant">Search</span>
                <button aria-label="User account" className="w-11 h-11 p-1 rounded-full flex items-center justify-center hover:bg-surface-variant/40 active:bg-surface-variant/70 transition-colors"><img alt="Profile" className="w-8 h-8 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeU735XNmqnkVjqiTC1tsZ_TGLuQTGwlNhKhhldWj3D08vqNg2DYa6eeWgPdkveetzziqRAmBcQ0S1wAIPVgYI5BJqmsWTmZ3bZV6FqXBXGS8W4oQ-69XYLg4ZTWWorVd_tFzXIndxH8TaLLENWdqSIpJzKIlDoWvpUW8iiV5bHvsZdK2fH_u_A-UzcdbNxyQjNllc25FZKQOj5bBm8Re5dZy778gkqMSapf8eyMAUUL2HUOhuzIn5" /></button>
              </div>
            </div>
          </header>
          
          <main className="flex-1 w-full bg-surface pt-16 pb-24 overflow-y-auto no-scrollbar">
            <div className="flex flex-col w-full">
              {children}
            </div>
          </main>
          
          <nav className="absolute bottom-0 w-full z-50 pb-safe bg-surface-container/90 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.3)]">
            <div className="h-16 px-space-md flex items-center justify-around">
              <a className="flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-1 text-on-surface-variant hover:text-on-surface transition-colors" href="#"><div className="px-4 py-1 rounded-full transition-colors"><span className="material-symbols-outlined text-[24px]">photo_library</span></div><span className="font-label-md text-label-md">Photos</span></a>
              <a className="flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-1 text-on-surface-variant hover:text-on-surface transition-colors" href="#"><div className="px-4 py-1 rounded-full transition-colors"><span className="material-symbols-outlined text-[24px]">auto_awesome</span></div><span className="font-label-md text-label-md">Memories</span></a>
              <a className="flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-1 text-on-surface-variant hover:text-on-surface transition-colors" href="#"><div className="px-4 py-1 rounded-full transition-colors"><span className="material-symbols-outlined text-[24px]">collections_bookmark</span></div><span className="font-label-md text-label-md">Library</span></a>
              <a className="flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-1 text-on-surface-variant hover:text-on-surface transition-colors" href="#"><div className="px-4 py-1 rounded-full transition-colors"><span className="material-symbols-outlined text-[24px]">add</span></div><span className="font-label-md text-label-md">Create</span></a>
            </div>
          </nav>
        </div>
      </body>
    </html>
  );
}
