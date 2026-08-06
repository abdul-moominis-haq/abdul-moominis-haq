import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, Bell, Sparkles, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribed(true);
    setIsLoading(false);
    toast.success("Welcome to the innovation journey! 🚀");
    
    // Reset after animation
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail("");
    }, 3000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 dark:from-primary/10 dark:via-secondary/10 dark:to-accent/10">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Stay Updated
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Join the Innovation Network
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get exclusive insights on AI breakthroughs, cutting-edge projects, and tech innovations. 
              Be the first to know about new opportunities and collaborations.
            </p>
          </motion.div>

          {/* Subscription Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 bg-card-elevated border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <div className="flex-1">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 px-4 text-base border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="h-12 px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light transform hover:scale-105 transition-all duration-300"
                    >
                      {isLoading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>
                          <Mail className="w-5 h-5 mr-2" />
                          Subscribe
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    {[
                      { icon: Bell, title: "Project Updates", desc: "Latest innovations and launches" },
                      { icon: Sparkles, title: "Tech Insights", desc: "AI and development trends" },
                      { icon: Mail, title: "Opportunities", desc: "Collaboration invitations" }
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      >
                        <benefit.icon className="w-8 h-8 text-primary mb-2" />
                        <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                        <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </form>
              ) : (
                <motion.div
                  className="text-center py-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Welcome Aboard! 🚀</h3>
                  <p className="text-muted-foreground">
                    You're now part of the innovation network. Check your email for confirmation!
                  </p>
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-sm text-muted-foreground mb-2">
              Join 500+ developers, recruiters, and tech enthusiasts
            </p>
            <p className="text-xs text-muted-foreground">
              No spam, unsubscribe anytime. Your email is safe with us.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSubscription;