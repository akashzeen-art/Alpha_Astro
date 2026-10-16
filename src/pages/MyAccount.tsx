import Layout from "@/components/Layout";

const MyAccount = () => (
  <Layout>
    <div className="grahveda-page max-w-lg mx-auto">
      <div className="grahveda-panel p-8 text-center">
        <h1 className="font-display text-2xl font-bold text-amber-50 mb-1">My Account</h1>
        <p className="text-amber-400 text-sm font-medium mb-6">Sign In</p>
        <p className="text-orange-100/70 text-base font-medium mb-2">Access your account</p>
        <p className="text-orange-100/40 text-sm mb-8">
          Sign in with your registered email to access your readings, subscription, and consultation history.
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-auth-modal"))}
          className="w-full grahveda-btn-primary py-3 rounded-xl font-semibold text-sm uppercase tracking-widest mb-3"
        >
          Sign In / Subscribe
        </button>
        <p className="text-orange-200/30 text-xs">New here? Subscribe now to get started.</p>
      </div>
    </div>
  </Layout>
);

export default MyAccount;
