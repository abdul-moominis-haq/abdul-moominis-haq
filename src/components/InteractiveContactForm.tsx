import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  MessageCircle, 
  Phone, 
  Mail, 
  Calendar, 
  Zap,
  CheckCircle,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";

const InteractiveContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    project: "",
    budget: "",
    timeline: "",
    message: ""
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps = [
    {
      title: "Let's get acquainted",
      subtitle: "Tell me about yourself",
      fields: ["name", "email", "company"]
    },
    {
      title: "Your project details",
      subtitle: "What are we building together?",
      fields: ["project", "budget", "timeline"]
    },
    {
      title: "Additional information",
      subtitle: "Anything else you'd like to share?",
      fields: ["message"]
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitted(true);
    setIsSubmitting(false);
    toast.success("Message sent! I'll get back to you within 24 hours 🚀");
  };

  const quickActions = [
    {
      icon: Phone,
      title: "Quick Call",
      desc: "Schedule a 30-min chat",
      color: "bg-green-500"
    },
    {
      icon: Mail,
      title: "Email Me",
      desc: "Send direct message",
      color: "bg-blue-500"
    },
    {
      icon: Calendar,
      title: "Book Meeting",
      desc: "Choose available slot",
      color: "bg-purple-500"
    }
  ];

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-12 bg-card-elevated border-border/50 shadow-xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">Message Received! 🎉</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for reaching out! I've received your message and will respond within 24 hours.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Expected response time: Within 24 hours
              </div>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(0);
                  setFormData({
                    name: "", email: "", company: "", project: "", budget: "", timeline: "", message: ""
                  });
                }}
                variant="outline"
                className="mt-6"
              >
                Send Another Message
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <MessageCircle className="w-4 h-4" />
                Let's Collaborate
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether it's AI innovation, full-stack development, or IoT solutions, 
                let's discuss how we can bring your vision to life.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${action.color} text-white`}>
                          <action.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{action.title}</h4>
                          <p className="text-sm text-muted-foreground">{action.desc}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              {/* Response time indicator */}
              <motion.div
                className="mt-6 p-4 bg-primary/10 rounded-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 text-primary">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Fast Response Guaranteed</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average response time: 2-4 hours during business hours
                </p>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="p-8 bg-card-elevated border-border/50 shadow-lg">
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{steps[currentStep].title}</h3>
                    <Badge variant="secondary">
                      Step {currentStep + 1} of {steps.length}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{steps[currentStep].subtitle}</p>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {currentStep === 0 && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Full Name *</label>
                              <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="John Doe"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Email Address *</label>
                              <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="john@company.com"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Company/Organization</label>
                            <Input
                              value={formData.company}
                              onChange={(e) => handleInputChange("company", e.target.value)}
                              placeholder="Your company name"
                            />
                          </div>
                        </>
                      )}

                      {currentStep === 1 && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2">Project Type *</label>
                            <Input
                              value={formData.project}
                              onChange={(e) => handleInputChange("project", e.target.value)}
                              placeholder="e.g., AI-powered web app, IoT solution, mobile app"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Budget Range</label>
                              <Input
                                value={formData.budget}
                                onChange={(e) => handleInputChange("budget", e.target.value)}
                                placeholder="$5k - $10k"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Timeline</label>
                              <Input
                                value={formData.timeline}
                                onChange={(e) => handleInputChange("timeline", e.target.value)}
                                placeholder="2-3 months"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {currentStep === 2 && (
                        <div>
                          <label className="block text-sm font-medium mb-2">Project Details</label>
                          <Textarea
                            value={formData.message}
                            onChange={(e) => handleInputChange("message", e.target.value)}
                            placeholder="Tell me more about your project, goals, and any specific requirements..."
                            rows={6}
                          />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-8">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                    >
                      Previous
                    </Button>

                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-primary to-secondary"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light"
                      >
                        {isSubmitting ? (
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        ) : (
                          <Send className="w-5 h-5 mr-2" />
                        )}
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    )}
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveContactForm;