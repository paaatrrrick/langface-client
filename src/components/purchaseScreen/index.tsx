import React from "react";
import "./purchaseScreen.css";
import {createCheckoutSession} from '../../utils/getJwt';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useDispatch, useSelector } from 'react-redux';
import { setBannerMessage } from "../../store";
import constants from "../../constants";
import { actions, RootState } from '../../store';
import { CheckIcon } from '@heroicons/react/20/solid';


const firebaseConfig = {
    apiKey: "AIzaSyBdOHXmq235jFOtiAg7KtnXE6zriN8r6xU",
    authDomain: "bloggergpt-154c3.firebaseapp.com",
    projectId: "bloggergpt-154c3",
    storageBucket: "bloggergpt-154c3.appspot.com",
    messagingSenderId: "556522585513",
    appId: "1:556522585513:web:8a525a15f80d0a680898b8",
    measurementId: "G-FW09N6MY24"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

interface PurchaseScreenProps {
    tryDemo?: boolean;
    openDemo?: () => void;
    launch: () => Promise<void>;
    dark?: boolean;
}




function classNames(...classes : any[]) {
  return classes.filter(Boolean).join(' ')
}

const PurchaseScreen = ({ tryDemo, openDemo, launch, dark } : PurchaseScreenProps) => {
    const isLoggedIn = useSelector((state : RootState) => state.main.isLoggedIn);
    const dispatch = useDispatch();

    const handleGoogle = async () => {
        var result = null;
        try {
            result = await signInWithPopup(auth, provider);
        } catch (err) {
            dispatch(setBannerMessage({type: "error", message: "Error logging in with google"}));
            return false;
        }
        const res = await fetch(`${constants.url}/auth/google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken: result.user.uid, email: result.user.email, photoURL: result.user.photoURL, name: result.user.displayName }),
        });
        const data = await res.json();
        if (!res.ok) {
            dispatch(setBannerMessage({type: "error", message: "Error logging in with google"}));
            return false;
        }
        window.localStorage.setItem("langface-auth", data.token);
        launch();
        return true;
    };

    const enterpriseLetsChat = () => {
        const recipient = "patrick@langface.ai"
        const subject = encodeURIComponent("Hello 👋");
        const body = encodeURIComponent(
          "Hey Patrick,\n\nI'd love to hear more about SEO with langface.ai. What's your availability this week?"
        );
        const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;
        window.open(mailtoLink, "_blank");
    }

    const payment = async () => {
        if (!isLoggedIn) {
            const google = await handleGoogle();
            if (!google) return;
        }
        const res = await createCheckoutSession();
        if (typeof res === 'boolean') {
            dispatch(actions.setBannerMessage  ({message: "Payment failed. Reach out in the discord if you have any questions", type: "error"}));
        } else {
            dispatch(actions.setBannerMessage({message: "Payment succeeded. ", type: "success", timeout: 25000}));
            dispatch(actions.addBlogAgent(res))
            dispatch(actions.setCurrentView("home"));
        }
    };

    const tiers = [
        {
          name: 'Hobbyist',
          id: 'tier-hobbyist',
          href: () => {},
          priceMonthly: 'Free',
          description: 'Demo & get high-quality articles, fast.',
          features: ['3 Articles / Day', 'Standard on-page SEO', 'Keyword generation', 'Images', 'Post to Wordpress & Blogger.com'],
          mostPopular: false,
          buttonText: ''
        },
        {
          name: 'Professional',
          id: 'tier-Professional',
          href: payment,
          priceMonthly: '$30',
          description: `Scale your blog over a period of time.`,
          features: [
            '450 Articles / Month',
            'Internal links for optimal sitemap',
            'Run continously to build a large site',
            'Everything in Hobbyist',
            'Coming soon: Niche research'
          ],
          mostPopular: true,
          buttonText: 'Hire agent'
        },
        {
          name: 'Enterprise',
          id: 'tier-enterprise',
          href: enterpriseLetsChat,
          priceMonthly: 'Contact us',
          description: 'Blanket a whole niche.',
          features: [
            'Pay on per Article basis',
            'Tailored workflow for your business',
            '1-1 customer support',
            'Everything in Professional',
          ],
          mostPopular: false,
          buttonText: 'Let\'s chat'
        },
    ]

    return (
        <div className={classNames('PurchaseScreen', dark && 'dark')}>
            <div className="bg-white">
                <div className="mx-auto max-w-7xl px-12 dark:bg-mainDark">
                    <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-brandColor-600">Pricing</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                        Supercharge your web traffic
                    </p>
                    </div>
                    <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600 dark:text-gray-50">
                    Hire an AI agent that works autonomously to help you with blog marketing
                    </p>
                    <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {tiers.map((tier, tierIdx) => (
                        <div
                        key={tier.id}
                        className={classNames(
                            tier.mostPopular ? 'lg:z-10 lg:rounded-b-none' : 'lg:mt-8',
                            tierIdx === 0 ? 'lg:rounded-r-none' : '',
                            tierIdx === tiers.length - 1 ? 'lg:rounded-l-none' : '',
                            'flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 dark:ring-white dark:bg-mainDark'
                        )}
                        >
                        <div>
                            <div className="flex items-center justify-between gap-x-4">
                            <h3
                                id={tier.id}
                                className={classNames(
                                tier.mostPopular ? 'text-brandColor-600' : 'text-gray-900 dark:text-white',
                                'text-lg font-semibold leading-8'
                                )}
                            >
                                {tier.name}
                            </h3>
                            {tier.mostPopular ? (
                                <p className="rounded-full bg-brandColor-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-brandColor-600">
                                Recommended
                                </p>
                            ) : null}
                            </div>
                            <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-white">{tier.description}</p>
                            <p className="mt-6 flex items-baseline gap-x-1">
                            {tier.id !== 'tier-enterprise' && <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{tier.priceMonthly}</span>}
                            {tier.id !== 'tier-hobbyist' && <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-50">
                                {tier.id === 'tier-enterprise' ? 'Contact Us' : '/month'}
                            </span>}

                            </p>
                            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-50">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex gap-x-3">
                                <CheckIcon className="h-6 w-5 flex-none text-brandColor-600" aria-hidden="true" />
                                {feature}
                                </li>
                            ))}
                            </ul>
                        </div>
                        {tier.buttonText &&<button
                            onClick={tier.href}
                            aria-describedby={tier.id}
                            className={classNames(
                            tier.mostPopular
                                ? 'bg-brandColor-600 text-white shadow-sm hover:bg-brandColor-500'
                                : 'text-brandColor-600 ring-1 ring-inset ring-brandColor-200 hover:ring-brandColor-300',
                            'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brandColor-600'
                            )}
                        >
                            {tier.buttonText}
                        </button>}
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default PurchaseScreen;
