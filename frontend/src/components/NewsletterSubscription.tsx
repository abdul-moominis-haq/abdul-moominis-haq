import { useState } from "react";
import toast from "react-hot-toast";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const base = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
      const response = await fetch(`${base}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Subscription failed");
      }

      setIsSubscribed(true);
      toast.success("You're subscribed.");
    } catch (error) {
      console.error("Subscription error", error);
      toast.error("Could not subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="print-section newsletter-section">
      <div className="section-inner newsletter-section__inner">
        <div className="section-heading">
          <h1>Notes from the work.</h1>
          <p>Subscribe for updates on projects and engineering work.</p>
        </div>

        {isSubscribed ? (
          <div className="form-feedback" role="status">
            <h2>Subscription received.</h2>
            <p>Thank you for joining the newsletter.</p>
            <button
              type="button"
              className="text-link"
              onClick={() => {
                setIsSubscribed(false);
                setEmail("");
              }}
            >
              Subscribe another address
            </button>
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <label htmlFor="newsletter-email">Email address</label>
            <div className="newsletter-form__row">
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Sending…" : "Subscribe"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSubscription;
