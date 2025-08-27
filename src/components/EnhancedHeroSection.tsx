import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Github, Linkedin, Mail, Phone, MapPin, Download, Sparkles, Zap, Calendar } from "lucide-react";
import { useInView } from "react-intersection-observer";

const EnhancedHeroSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle />
      </div>
      
      {/* Enhanced background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-secondary opacity-95 dark:from-primary-dark dark:via-primary dark:to-secondary-light" />
      
      {/* Animated geometric shapes */}
      <motion.div 
        className="absolute inset-0"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="absolute top-20 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-light/10 rounded-full blur-3xl"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 4 }}
        />
      </motion.div>

      {/* Floating tech icons */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 text-white/20"
          animate={{ 
            y: [-20, 20, -20],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Zap size={32} />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 text-white/20"
          animate={{ 
            y: [20, -20, 20],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Sparkles size={28} />
        </motion.div>
      </div>
      
      <div className="container mx-auto px-6 relative z-20" ref={ref}>
        <motion.div 
          className="max-w-5xl mx-auto text-center text-white"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Status badge */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
            variants={itemVariants}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Available for opportunities</span>
          </motion.div>

          {/* Main heading with typewriter effect */}
          <motion.div className="mb-8" variants={itemVariants}>
            <motion.h1 
              className="font-display text-5xl md:text-7xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              IS-HAQ ABDUL-MOOMIN
            </motion.h1>
            <motion.div 
              className="text-xl md:text-2xl text-accent-light font-medium mb-2"
              variants={itemVariants}
            >
            Full-Stack Software Engineer
            </motion.div>
            <motion.div 
              className="text-lg text-white/80 mb-6 flex items-center justify-center gap-2"
              variants={itemVariants}
            >
              <MapPin className="w-5 h-5" />
              Ghanaian Citizen
            </motion.div>
          </motion.div>

          {/* Enhanced value proposition */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <p className="text-lg md:text-xl text-white/90 mb-4 max-w-4xl mx-auto leading-relaxed">
              Transforming ideas into intelligent solutions through AI, IoT, and scalable web technologies.
            </p>
            <p className="text-base text-white/75 max-w-3xl mx-auto">
              Specializing in AgriTech, HealthAI, and FinTech innovations with 3+ years of experience 
              building impactful applications that solve real-world problems.
            </p>
          </motion.div>

          {/* Interactive stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-3xl mx-auto"
            variants={containerVariants}
          >
            {[
              { number: "10+", label: "Projects Delivered" },
              { number: "3+", label: "Years Experience" },
              { number: "100%", label: "Client Satisfaction" },
              { number: "24/7", label: "Availability" }
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 hover:bg-white/20 transition-all duration-300">
                  <div className="text-2xl font-bold text-accent-light">{stat.number}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact info cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center gap-3 text-white">
                  <Phone className="w-5 h-5 text-accent-light" />
                  <span className="font-medium">(+233) 24981 9285</span>
                </div>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center gap-3 text-white">
                  <Mail className="w-5 h-5 text-accent-light" />
                  <span className="font-medium">abdulmoominishaq21@gmail.com</span>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced action buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            variants={containerVariants}
          >
            <a 
  href="https://calendar.google.com/calendar/u/0/r/eventedit?text=Meeting+with+Ishaq+Abdul-Moomin&details=Let%27s+discuss+opportunities&location=Google+Meet&dates=20250824T120000Z/20250824T130000Z&add=abdulmoominishaq21@gmail.com" 
  target="_blank" 
  rel="noopener noreferrer"
  className="inline-block"
>
  <Button 
    size="lg" 
    variant="outline" 
    className="border-green-500 text-green-500 hover:bg-green-500/10 font-semibold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105"
  >
    <Calendar className="w-5 h-5 mr-2" />
    Schedule Meeting
  </Button>
</a>

            <motion.div variants={itemVariants}>
             <a 
  href="https://www.linkedin.com/in/ishaqabdulmoomin/" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <Button 
    size="lg" 
    variant="outline" 
    className="border-white/30 text-primary hover:bg-white/10 font-semibold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105"
  >
    <Mail className="w-5 h-5 mr-2" />
    Let's Connect
  </Button>
</a>

            </motion.div>
            <motion.div variants={itemVariants}>
              <a href="https://drive.google.com/file/d/1EGMFBZJ03HmP8cuXJoantroQCrIGvO1V/view?usp=drive_link" download className="inline-block">
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-white/10 font-semibold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105">
              <Download className="w-5 h-5 mr-2" /> Download CV
              </Button>
              </a>
              </motion.div>
              </motion.div>

          {/* Enhanced social links */}
          <motion.div 
            className="flex gap-6 justify-center"
            variants={containerVariants}
          >
            {[
              { icon: Github, href: "https://github.com/ishaqabdulmoomin", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com/in/abdul-moominis-haq", label: "LinkedIn" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:rotate-6"
                aria-label={social.label}
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: 6 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon className="w-6 h-6" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div 
          className="flex flex-col items-center gap-2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-sm font-medium">Discover My Journey</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/70 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EnhancedHeroSection;