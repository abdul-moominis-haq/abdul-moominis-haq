import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  Github, 
  ChevronLeft, 
  ChevronRight,
  Code,
  Zap,
  Brain,
  Leaf,
  Heart,
  TrendingUp,
  Users,
  Award
} from "lucide-react";
import { useInView } from "react-intersection-observer";

const InteractiveProjectShowcase = () => {
  const [selectedProject, setSelectedProject] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const projects = [
    {
      id: 1,
      title: "SmartAgri - AI-Powered Farming",
      category: "AgriTech",
      icon: Leaf,
      color: "from-green-500 to-emerald-600",
      image: "🌱",
      description: "Revolutionary IoT and AI platform transforming traditional farming through intelligent automation and predictive analytics.",
      longDescription: "SmartAgri combines cutting-edge IoT sensors, machine learning algorithms, and real-time data analytics to optimize crop yields, reduce water consumption, and predict weather patterns. The platform helps farmers make data-driven decisions while promoting sustainable agriculture practices.",
      technologies: ["Python", "IoT", "Machine Learning", "React", "Node.js", "MongoDB", "TensorFlow"],
      features: [
        "Real-time soil monitoring",
        "Weather prediction AI",
        "Automated irrigation control",
        "Crop health analytics",
        "Yield optimization",
        "Mobile dashboard"
      ],
      metrics: {
        impact: "40% yield increase",
        users: "500+ farmers",
        coverage: "10,000+ acres"
      },
      status: "Live in Production",
      github: "https://github.com/ishaq",
      demo: "https://smartagri-demo.com"
    },
    {
      id: 2,
      title: "HealthAI Diagnostic Platform",
      category: "HealthTech",
      icon: Heart,
      color: "from-red-500 to-pink-600",
      image: "❤️",
      description: "AI-powered diagnostic tool for early disease detection using computer vision and machine learning algorithms.",
      longDescription: "This platform leverages advanced computer vision and deep learning to analyze medical imagery for early disease detection. It provides healthcare professionals with AI-assisted diagnostics, reducing diagnosis time and improving accuracy rates.",
      technologies: ["Python", "TensorFlow", "OpenCV", "React", "FastAPI", "PostgreSQL", "Docker"],
      features: [
        "Medical image analysis",
        "Early disease detection",
        "AI-powered diagnostics",
        "Patient data management",
        "Real-time reporting",
        "Healthcare dashboard"
      ],
      metrics: {
        accuracy: "94% diagnostic accuracy",
        time: "60% faster diagnosis",
        patients: "1000+ analyzed"
      },
      status: "Beta Testing",
      github: "https://github.com/ishaq",
      demo: "https://healthai-demo.com"
    },
    {
      id: 3,
      title: "FinTech Investment Analyzer",
      category: "FinTech", 
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-600",
      image: "📈",
      description: "ML-powered platform analyzing market trends and providing real-time investment recommendations.",
      longDescription: "Advanced financial analysis platform that uses machine learning algorithms to analyze market patterns, predict trends, and provide personalized investment recommendations. Features real-time portfolio optimization and risk assessment tools.",
      technologies: ["Python", "React", "Node.js", "ML Models", "Redis", "PostgreSQL", "AWS"],
      features: [
        "Market trend analysis",
        "Investment recommendations",
        "Portfolio optimization",
        "Risk assessment",
        "Real-time alerts",
        "Performance tracking"
      ],
      metrics: {
        accuracy: "87% prediction accuracy",
        returns: "23% avg returns",
        users: "300+ investors"
      },
      status: "Live in Production",
      github: "https://github.com/ishaq",
      demo: "https://fintech-analyzer.com"
    },
    {
      id: 4,
      title: "Real Estate CRM Platform",
      category: "PropTech",
      icon: Users,
      color: "from-purple-500 to-violet-600", 
      image: "🏢",
      description: "Comprehensive real estate management system with CRM, valuation models, and automated reporting.",
      longDescription: "Full-featured real estate platform combining customer relationship management, property valuation algorithms, and automated reporting systems. Streamlines operations for real estate professionals while providing data-driven insights.",
      technologies: ["React", "Node.js", "MongoDB", "Express", "JWT", "Stripe", "AWS S3"],
      features: [
        "Client management",
        "Property valuations",
        "Automated reporting",
        "Document management",
        "Communication tools",
        "Analytics dashboard"
      ],
      metrics: {
        efficiency: "50% time savings",
        properties: "2000+ managed",
        agents: "150+ users"
      },
      status: "Live in Production",
      github: "https://github.com/ishaq",
      demo: "https://realestate-crm.com"
    }
  ];

  const nextProject = () => {
    setSelectedProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setSelectedProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[selectedProject];
  const ProjectIcon = currentProject.icon;

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-background via-primary/5 to-secondary/10" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Code className="w-4 h-4" />
            Featured Projects
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Innovation in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore cutting-edge solutions that blend AI, IoT, and full-stack development 
            to solve real-world challenges across multiple industries.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          {/* Project Navigation */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex gap-2 p-2 bg-muted/20 rounded-lg">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(index)}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    index === selectedProject
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <project.icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Project Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Project Visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="p-8 bg-card-elevated border-border/50 shadow-xl relative overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${currentProject.color} opacity-10`} />
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="text-8xl mb-4">{currentProject.image}</div>
                    <Badge className="mb-4" variant="secondary">
                      {currentProject.category}
                    </Badge>
                    <h3 className="text-2xl font-bold mb-2">{currentProject.title}</h3>
                    <p className="text-muted-foreground">{currentProject.description}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {Object.entries(currentProject.metrics).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        className="text-center p-3 bg-background/50 rounded-lg"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <div className="text-lg font-bold text-primary">{value}</div>
                        <div className="text-xs text-muted-foreground capitalize">{key}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevProject}
                      className="rounded-full"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex gap-2">
                      {projects.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedProject(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === selectedProject ? "bg-primary w-6" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextProject}
                      className="rounded-full"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Project Details */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedProject}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${currentProject.color} text-white`}>
                      <ProjectIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{currentProject.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{currentProject.status}</Badge>
                        <Badge variant="secondary">{currentProject.category}</Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {currentProject.longDescription}
                  </p>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-8">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      Key Features
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {currentProject.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-4">
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                    <Button variant="outline">
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Project Grid Preview */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className={`cursor-pointer transition-all duration-300 ${
                  index === selectedProject ? "scale-105" : "hover:scale-105"
                }`}
                onClick={() => setSelectedProject(index)}
                whileHover={{ y: -5 }}
              >
                <Card className={`p-4 h-full ${
                  index === selectedProject 
                    ? "bg-primary/10 border-primary/30 shadow-lg" 
                    : "bg-card hover:bg-card-elevated"
                }`}>
                  <div className="text-center">
                    <div className="text-3xl mb-2">{project.image}</div>
                    <h4 className="font-semibold text-sm mb-1">{project.title}</h4>
                    <p className="text-xs text-muted-foreground">{project.category}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveProjectShowcase;