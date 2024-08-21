import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  
  return (
    <html lang={params.lang}>
      <body>
        <div style={{ display: 'flex', width: '100%' }}>
          <div style={{ flexGrow: 1 }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return [];
}