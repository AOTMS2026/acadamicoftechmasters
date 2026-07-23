import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./App.css";

import { HelmetProvider } from "react-helmet-async";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { SpeedInsights } from "@vercel/speed-insights/react";

const reCaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const AppRoot = () => (
    <>
        <App />
        <SpeedInsights />
    </>
);

createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
        {reCaptchaKey ? (
            <GoogleReCaptchaProvider
                reCaptchaKey={reCaptchaKey}
                container={{
                    parameters: {
                        badge: 'bottomleft'
                    }
                }}
            >
                <AppRoot />
            </GoogleReCaptchaProvider>
        ) : (
            <AppRoot />
        )}
    </HelmetProvider>
);
