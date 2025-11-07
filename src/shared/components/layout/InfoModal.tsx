"use client";

import { useModal } from "@/shared/context/ModalProvider";
import {
  X,
  Shield,
  FileText,
  Cookie,
  HelpCircle,
  Truck,
  ShieldCheck,
  Undo2,
  MessageSquare,
} from "lucide-react";
import { useEffect } from "react";
import { ModalType } from "@/shared/types/types";
import { ContactForm } from "@/features/contact/components/ContactForm";

// Main component
export default function InfoModal() {
  const { isModalOpen, modalType, closeModal } = useModal();

  // Prevents body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Defines content for each modal type
  const modalContent: Record<
    Exclude<ModalType, null>,
    {
      icon: React.ComponentType<{ className?: string }>;
      title: string;
      content: React.ReactNode;
    }
  > = {
    contact: {
      icon: MessageSquare,
      title: "Contact Us",
      content: <ContactForm />,
    },
    privacy: {
      icon: Shield,
      title: "Privacy Policy",
      content: <PrivacyContent />,
    },
    terms: {
      icon: FileText,
      title: "Terms of Service",
      content: <TermsContent />,
    },
    cookies: {
      icon: Cookie,
      title: "Cookie Policy",
      content: <CookieContent />,
    },
    faq: {
      icon: HelpCircle,
      title: "Frequently Asked Questions",
      content: <FaqContent />,
    },
    shipping: {
      icon: Truck,
      title: "Shipping Information",
      content: <ShippingContent />,
    },
    warranty: {
      icon: ShieldCheck,
      title: "Warranty Policy",
      content: <WarrantyContent />,
    },
    returns: {
      icon: Undo2,
      title: "Return Policy",
      content: <ReturnsContent />,
    },
  };

  const CurrentContent = modalType ? modalContent[modalType] : null;
  const Icon = CurrentContent?.icon || Shield;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity
          flex items-center justify-center p-6
          ${isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeModal}
        aria-hidden="true"
      >
        {/* Animated RGB Border Wrapper */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="info-modal-title"
          onClick={(e) => e.stopPropagation()} // Prevents closing when clicking modal
          className={`relative w-full max-w-3xl transition-all duration-300 ease-out
            rounded-2xl p-0.5 overflow-hidden
            [background:linear-gradient(90deg,rgba(239,68,68,0.5),rgba(234,179,8,0.5),rgba(34,197,94,0.5),rgba(59,130,246,0.5),rgba(168,85,247,0.5),rgba(239,68,68,0.5))]
            bg-size-[300%_300%] animate-[rgb-border_3s_ease_infinite]
            ${
              isModalOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0 pointer-events-none"
            }`}
        >
          {/* Modal Window Content */}
          <div className="bg-zinc-950 rounded-[calc(1rem-2px)] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-amber-400 shrink-0" />
                <h2
                  id="info-modal-title"
                  className="text-xl md:text-2xl font-bold text-white"
                >
                  {CurrentContent?.title || ""}
                </h2>
              </div>
              <button
                onClick={closeModal}
                aria-label="Close modal"
                className="w-10 h-10 flex items-center justify-center border border-zinc-700 rounded-lg hover:border-amber-500/50 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto p-6 md:p-8">
              {CurrentContent?.content}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Content Components
const h3Class = "text-xl font-bold text-amber-400 mb-3 mt-5 first:mt-0";
const pClass = "text-gray-400 mb-4 leading-relaxed";
const ulClass = "list-disc list-inside space-y-2 mb-4 pl-4 text-gray-400";
const codeClass =
  "bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded-md font-mono text-sm";
const strongClass = "text-amber-300 font-semibold";

// Existing Content

const PrivacyContent = () => (
  <div className="text-white">
    <h3 className={h3Class}>Heads Up: This is a Portfolio Project</h3>
    <p className={pClass}>
      Thanks for checking out my privacy policy! This is a portfolio website
      (&quot;Syntax&quot;) built to demonstrate my coding skills, not a real
      e-commerce store.
    </p>
    <p className={pClass}>
      Because of that, the &quot;privacy&quot; here is pretty simple and not the
      scary legal document you&apos;re used to.
    </p>

    <h3 className={h3Class}>What I &quot;Collect&quot; (and Why)</h3>
    <ul className={ulClass}>
      <li>
        <strong className={strongClass}>Account Info:</strong> When you
        register, I store your name, email, and a hashed (scrambled) version of
        your password. I need this so the login feature actually works.
      </li>
      <li>
        <strong className={strongClass}>Cart Items:</strong> Your shopping cart
        is saved in your browser&apos;s{" "}
        <code className={codeClass}>localStorage</code>. This is so your items
        are still there if you close the tab and come back. I can&apos;t see
        this data.
      </li>
      <li>
        <strong className={strongClass}>Order History:</strong> If you
        &quot;place an order,&quot; I save that information (what you bought,
        the total price) in the database. This is just to populate the &quot;My
        Orders&quot; page for you.
      </li>
    </ul>

    <h3 className={h3Class}>How Authentication Works (The JWT Part)</h3>
    <p className={pClass}>
      This site uses JWT (JSON Web Tokens) for authentication.
    </p>
    <ul className={ulClass}>
      <li>
        When you log in, the server sends you a secure,{" "}
        <code className={codeClass}>httpOnly</code>
        cookie containing your token.
      </li>
      <li>
        This cookie is sent automatically with each request to prove you&apos;re
        logged in.
      </li>
      <li>
        <strong>What this means for you:</strong> It&apos;s a standard, secure
        way to keep you logged in. I am not using this token to track you across
        the internet, build an ad profile, or anything shady. It&apos;s just for
        session management within this one website.
      </li>
    </ul>

    <h3 className={h3Class}>tl;dr (Too Long; Didn&apos;t Read)</h3>
    <p className={pClass}>
      I&apos;m only collecting the absolute minimum data needed to make the
      website features (like login, cart, and order history) work for this demo.
      No data is sold, shared, or used for marketing.
    </p>
  </div>
);

const TermsContent = () => (
  <div className="text-white">
    <h3 className={h3Class}>Terms of Service</h3>
    <p className={pClass}>
      This is a portfolio project. By using this site, you agree not to take it
      too seriously.
    </p>
    <ul className={ulClass}>
      <li>
        Don&apos;t try to *actually* buy anything. No products will be shipped.
      </li>
      <li>Don&apos;t use a real password you use anywhere else.</li>
      <li>
        Feel free to try and break things (in a friendly way) and let me know
        what you find!
      </li>
    </ul>
  </div>
);

const CookieContent = () => (
  <div className="text-white">
    <h3 className={h3Class}>Cookie Policy</h3>
    <p className={pClass}>
      You&apos;ll be happy to know this site has a very simple cookie policy.
    </p>
    <ul className={ulClass}>
      <li>
        <strong className={strongClass}>
          <code className={codeClass}>httpOnly</code> Session Cookie:
        </strong>{" "}
        When you log in, we use one (1) secure,{" "}
        <code className={codeClass}>httpOnly</code> cookie to store your JWT
        authentication token. This is essential for keeping you logged in.
      </li>
      <li>
        <strong className={strongClass}>That&apos;s it.</strong> No analytics
        cookies, no tracking pixels, no third-party ad network cookies. Just the
        one we need for login.
      </li>
    </ul>
  </div>
);

// Content Components

const FaqContent = () => (
  <div className="text-white">
    <h3 className={h3Class}>Is this a real store?</h3>
    <p className={pClass}>
      No, this is a portfolio project to demonstrate full-stack development
      skills (Next.js, React, Node.js, Express.js, etc.). You can&apos;t
      *actually* buy anything.
    </p>

    <h3 className={h3Class}>How long does shipping take?</h3>
    <p className={pClass}>
      Shipping is &quot;virtually&quot; instantaneous! Since no products are
      real, nothing will be shipped. If this were a real store, we&apos;d
      promise 2-day shipping, of course.
    </p>

    <h3 className={h3Class}>What&apos;s your return policy?</h3>
    <p className={pClass}>
      We have a fantastic 30-day &quot;virtual&quot; return policy. If
      you&apos;re unhappy with a &quot;pending&quot; or &quot;cancelled&quot;
      order in your order history, you can delete it. It&apos;s like it never
      happened!
    </p>

    <h3 className={h3Class}>
      Why can&apos;t I delete a &apos;Processing&apos; order?
    </h3>
    <p className={pClass}>
      That&apos;s a feature! It demonstrates role-based access control and state
      management. In a real app, once an order is being processed, a user
      shouldn&apos;t be able to delete it.
    </p>
  </div>
);

const ShippingContent = () => (
  <div className="text-white">
    <h3 className={h3Class}>Shipping (The &quot;Not Really&quot; Policy)</h3>
    <p className={pClass}>
      We offer complimentary &quot;conceptual&quot; shipping on all orders.
    </p>
    <p className={pClass}>
      Your demo products will be &quot;shipped&quot; to your &quot;My
      Orders&quot; page as soon as you complete the checkout flow (which is also
      not yet implemented, but it&apos;s on the roadmap!).
    </p>
    <p className={pClass}>
      No physical items will ever be sent. This is a portfolio project.
    </p>
  </div>
);

const WarrantyContent = () => (
  <div className="text-white">
    <h3 className={h3Class}>Our Portfolio-Grade Warranty</h3>
    <p className={pClass}>
      We proudly offer a 2-Year &quot;Looks Good, Works Good&quot; warranty on
      all products displayed on this site.
    </p>
    <ul className={ulClass}>
      <li>
        <strong className={strongClass}>What&apos;s Covered:</strong> Any bugs,
        visual glitches, or slow load times you might find.
      </li>
      <li>
        <strong className={strongClass}>What&apos;s Not Covered:</strong>{" "}
        Physical hardware failure (since there is no physical hardware), damage
        from dropping your non-existent mouse, or buyer&apos;s remorse over a
        virtual purchase.
      </li>
    </ul>
    <p className={pClass}>
      If you find a bug, please &quot;file a claim&quot; by letting the
      developer know!
    </p>
  </div>
);

const ReturnsContent = () => (
  <div className="text-white">
    <h3 className={h3Class}>Our &quot;No Hassle&quot; Virtual Returns</h3>
    <p className={pClass}>Not happy with your demo order? No problem.</p>
    <p className={pClass}>
      You can &quot;return&quot; any order that has a status of{" "}
      <strong className={strongClass}>&quot;Pending&quot;</strong> or{" "}
      <strong className={strongClass}>&quot;Cancelled&quot;</strong>.
    </p>
    <ul className={ulClass}>
      <li>Go to your &quot;My Orders&quot; page.</li>
      <li>Find the order you wish to &quot;return&quot;.</li>
      <li>Click the red trash can icon to permanently delete it.</li>
    </ul>
    <p className={pClass}>
      This demonstrates the &quot;delete&quot; functionality of the API on items
      that meet a specific criteria (in this case, status). Orders marked
      &quot;Processing&quot; or &quot;Shipped&quot; cannot be deleted by a user.
    </p>
  </div>
);
