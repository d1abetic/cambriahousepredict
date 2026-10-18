import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* FontAwesome for medieval icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        <link rel="icon" href="/svgicon.png" />
      </Head>
      <body className="bg-[#060911] text-gray-100 antialiased selection:bg-amber-500 selection:text-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
