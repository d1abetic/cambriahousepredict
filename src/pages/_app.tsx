import type { AppProps } from 'next/app';
import Head from 'next/head';
import { WalletProvider, useWallet } from '@/context/WalletContext';
import { SoundProvider } from '@/context/SoundContext';
import AnimatedChainedBackground from '@/components/AnimatedChainedBackground';
import '@/styles/globals.css';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWallet();

  return (
    <div
      id="toastContainer"
      className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none max-w-sm w-full"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-xl shadow-2xl border text-sm font-medium pointer-events-auto transition-all transform duration-300 flex items-center justify-between space-x-3 ${
            toast.type === 'error'
              ? 'bg-red-950 border-red-500/50 text-red-200'
              : 'bg-cambria-900 border-amber-500/50 text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <i
              className={`fa-solid ${
                toast.type === 'error'
                  ? 'fa-circle-exclamation text-red-400'
                  : 'fa-circle-check text-amber-400'
              } text-lg flex-shrink-0`}
            ></i>
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-white transition flex-shrink-0 ml-2"
          >
            <i className="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SoundProvider>
      <WalletProvider>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Cambria</title>
          <meta
            name="description"
            content="Predict which of the 8 Noble Houses claims royalty in Cambria Genesis. Burn Silver, back your faction, and share the reward pool."
          />
          <link rel="icon" href="/svgicon.png" />
          <link rel="shortcut icon" href="/svgicon.png" />
          <link rel="apple-touch-icon" href="/svgicon.png" />
        </Head>

        <div className="min-h-screen text-gray-100 flex flex-col selection:bg-amber-500 selection:text-black relative">
          {/* Animated Chained Background with Scroll-Driven Conveyor & Screen Wrapping */}
          <AnimatedChainedBackground />

          {/* Webpage Content */}
          <div className="relative z-10 flex flex-col min-h-screen w-full">
            <Component {...pageProps} />
            <ToastContainer />
          </div>
        </div>
      </WalletProvider>
    </SoundProvider>
  );
}
