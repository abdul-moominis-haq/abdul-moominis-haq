import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  Coffee, 
  Briefcase,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MeetingScheduler = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    meetingType: "",
    proposedDate: "",
    duration: 30,
    agenda: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const meetingTypes = [
    {
      id: "consultation",
      name: "Free Consultation",
      icon: Coffee,
      duration: 30,
      description: "Discuss your project ideas"
    },
    {
      id: "technical",
      name: "Technical Discussion",
      icon: Briefcase,
      duration: 45,
      description: "Deep dive into technical requirements"
    },
    {
      id: "demo",
      name: "Project Demo",
      icon: Video,
      duration: 30,
      description: "Review existing work or prototypes"
    },
    {
      id: "discovery",
      name: "Discovery Call",
      icon: Phone,
      duration: 60,
      description: "Comprehensive project planning"
    }
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMeetingTypeSelect = (type: any) => {
    setFormData(prev => ({
      ...prev,
      meetingType: type.name,
      duration: type.duration
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('meeting-request', {
        body: {
          name: formData.name,
          email: formData.email,
          company: formData.company,
          meeting_type: formData.meetingType,
          proposed_date: new Date(formData.proposedDate).toISOString(),
          duration: formData.duration,
          agenda: formData.agenda,
          message: formData.message
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setIsSubmitted(true);
      toast({
        title: "Meeting Request Sent!",
        description: "You'll receive confirmation within 24 hours.",
      });
    } catch (error) {
      console.error("Meeting request error:", error);
      toast({
        title: "Error",
        description: "Failed to submit meeting request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 16);

  if (isSubmitted) {
    return (
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="p-12 bg-card border-border shadow-xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-4">Meeting Request Submitted! 🎉</h3>
          <p className="text-muted-foreground mb-6">
            Thank you for requesting a meeting! I'll review your request and respond within 24 hours with confirmation or alternative time slots.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <Clock className="w-4 h-4" />
            You'll receive an email confirmation shortly
          </div>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: "", email: "", company: "", meetingType: "", 
                proposedDate: "", duration: 30, agenda: "", message: ""
              });
            }}
            variant="outline"
          >
            Schedule Another Meeting
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.9 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            Schedule a Meeting
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Meet and Discuss Your Project
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Book a personalized session to explore how we can bring your ideas to life. 
            Choose the meeting type that best fits your needs.
          </p>
        </motion.div>
      </div>

      <Card className="p-8 bg-card border-border shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Meeting Type Selection */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Choose Meeting Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meetingTypes.map((type) => (
                <motion.div
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`p-4 cursor-pointer transition-all duration-300 ${
                      formData.meetingType === type.name 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleMeetingTypeSelect(type)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <type.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{type.name}</h4>
                          <Badge variant="secondary">{type.duration}min</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            {!formData.meetingType && (
              <p className="text-sm text-amber-600 flex items-center gap-2 mt-2">
                <AlertCircle className="w-4 h-4" />
                Please select a meeting type to continue
              </p>
            )}
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Meeting Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Date & Time *</label>
              <Input
                type="datetime-local"
                value={formData.proposedDate}
                onChange={(e) => handleInputChange("proposedDate", e.target.value)}
                min={minDate}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Times are in your local timezone
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", parseInt(e.target.value))}
                min={15}
                max={120}
                step={15}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meeting Agenda</label>
            <Textarea
              value={formData.agenda}
              onChange={(e) => handleInputChange("agenda", e.target.value)}
              placeholder="What would you like to discuss? Any specific topics or questions?"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Message</label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Any additional information about your project or special requirements..."
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !formData.meetingType || !formData.name || !formData.email || !formData.proposedDate}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            {isSubmitting ? (
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <Calendar className="w-5 h-5 mr-2" />
            )}
            {isSubmitting ? "Submitting Request..." : "Schedule Meeting"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default MeetingScheduler;