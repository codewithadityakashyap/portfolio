"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronDown,
  Github,
  Linkedin,
  Instagram,
  Mail,
  ExternalLink,
  Calendar,
  MapPin,
  GraduationCap,
  Award,
  BookOpen,
  TrendingUp,
  Code,
  Database,
  Brain,
  Microscope,
  Upload,
  FileText,
  Trash2,
  Download,
  Eye,
} from "lucide-react"

// Function to scroll to a section
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

// Floating particles component
const FloatingParticles = () => {
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = particlesRef.current
    if (!container) return

    const particles = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "particle animate-particle"
      particle.style.left = Math.random() * 100 + "%"
      particle.style.top = Math.random() * 100 + "%"
      particle.style.animationDelay = Math.random() * 6 + "s"
      particle.style.animationDuration = Math.random() * 4 + 4 + "s"
      container.appendChild(particle)
      particles.push(particle)
    }

    return () => {
      particles.forEach((particle) => particle.remove())
    }
  }, [])

  return <div ref={particlesRef} className="particles" />
}

// Typewriter effect component
const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(
      () => {
        if (currentIndex < text.length) {
          setDisplayText((prev) => prev + text[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        }
      },
      delay + currentIndex * 25,
    )

    return () => clearTimeout(timer)
  }, [currentIndex, text, delay])

  return (
    <span className="inline-block">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// SGPA Chart component
const SGPAChart = ({ sgpaData }: { sgpaData: number[] }) => {
  const [animatedData, setAnimatedData] = useState<number[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData(sgpaData)
    }, 500)
    return () => clearTimeout(timer)
  }, [sgpaData])

  const maxSGPA = Math.max(...sgpaData)
  const chartHeight = 200

  return (
    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
      <h4 className="text-sm font-medium mb-4 text-center">SGPA Progress</h4>
      <div className="flex items-end justify-center gap-4" style={{ height: chartHeight }}>
        {sgpaData.map((sgpa, index) => {
          const height = animatedData[index] ? (animatedData[index] / maxSGPA) * (chartHeight - 40) : 0
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="text-xs font-medium text-primary">{animatedData[index] ? sgpa.toFixed(1) : ""}</div>
              <div
                className="bg-gradient-to-t from-primary to-accent rounded-t transition-all duration-1000 ease-out"
                style={{
                  width: "24px",
                  height: `${height}px`,
                  minHeight: animatedData[index] ? "20px" : "0px",
                }}
              />
              <div className="text-xs text-muted-foreground">Sem {index + 1}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero")
  const [showCGPA, setShowCGPA] = useState(false)
  const [currentCertIndex, setCurrentCertIndex] = useState(0)
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({})

  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadPassword, setUploadPassword] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [loadingFiles, setLoadingFiles] = useState(false)

  const sgpaData = [6.2, 8.0, 8.92, 8.18]

  const fetchFiles = async () => {
    setLoadingFiles(true)
    try {
      const response = await fetch("/api/files")
      const data = await response.json()
      if (data.files) {
        setUploadedFiles(data.files)
      }
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setLoadingFiles(false)
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !uploadPassword) {
      alert("Please select a file and enter password")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("password", uploadPassword.trim()) // Trim whitespace from password

      console.log("[v0] Uploading file:", selectedFile.name)
      console.log("[v0] Password length:", uploadPassword.length)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      console.log("[v0] Upload response:", data)

      if (response.ok) {
        alert("File uploaded successfully!")
        setSelectedFile(null)
        setUploadPassword("")
        setShowUploadForm(false)
        fetchFiles() // Refresh file list
      } else {
        alert(data.error || "Upload failed")
      }
    } catch (error) {
      console.error("[v0] Upload error:", error)
      alert("Upload failed: " + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteFile = async (url: string) => {
    const password = prompt("Enter password to delete:")
    if (!password) return

    try {
      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, password }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("File deleted successfully!")
        fetchFiles() // Refresh file list
      } else {
        alert(data.error || "Delete failed")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Delete failed")
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "hero",
        "about",
        "projects",
        "skills",
        "experience",
        "education",
        "certifications",
        "dashboards",
        "blog",
        "contact",
      ]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }

      // Intersection observer for animations
      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          const isInView = rect.top < window.innerHeight && rect.bottom > 0
          setIsVisible((prev) => ({ ...prev, [section]: isInView }))
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial call
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    fetchFiles()
  }, [])

  // Auto-sliding certifications
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCertIndex((prev) => (prev + 1) % certifications.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const projects = [
    {
      name: "VidSnapAI",
      description:
        "AI-powered video analysis and summarization tool using machine learning algorithms to extract key insights from video content.",
      techStack: ["Python", "TensorFlow", "OpenCV", "Flask"],
      github: "#",
      demo: "#",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      name: "Deloitte Data Analytics Dashboard",
      description:
        "Comprehensive business intelligence dashboard for data visualization and analytics, featuring interactive charts and real-time insights.",
      techStack: ["Power BI", "Python", "SQL", "Excel"],
      github: "#",
      demo: "#",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      name: "NewsApp",
      description:
        "Modern news aggregation application with personalized content delivery and real-time updates from multiple sources.",
      techStack: ["React", "Node.js", "API Integration", "CSS"],
      github: "#",
      demo: "#",
      icon: <Code className="w-6 h-6" />,
    },
    {
      name: "AI ChatBot",
      description:
        "Intelligent conversational AI system with natural language processing capabilities for customer service automation.",
      techStack: ["Python", "NLP", "Machine Learning", "Flask"],
      github: "#",
      demo: "#",
      icon: <Brain className="w-6 h-6" />,
    },
    {
      name: "Netflix Clone",
      description:
        "Full-stack streaming platform replica with user authentication, content management, and responsive design.",
      techStack: ["React", "Node.js", "MongoDB", "CSS"],
      github: "#",
      demo: "#",
      icon: <Code className="w-6 h-6" />,
    },
  ]

  const skills = [
    { name: "Python", icon: <Code className="w-4 h-4" /> },
    { name: "Power BI", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Tableau", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Flask", icon: <Code className="w-4 h-4" /> },
    { name: "HTML", icon: <Code className="w-4 h-4" /> },
    { name: "CSS", icon: <Code className="w-4 h-4" /> },
    { name: "C", icon: <Code className="w-4 h-4" /> },
    { name: "SQL", icon: <Database className="w-4 h-4" /> },
    { name: "Microsoft Excel", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Microsoft Word", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Data Science", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Generative AI", icon: <Brain className="w-4 h-4" /> },
    { name: "Machine Learning", icon: <Brain className="w-4 h-4" /> },
  ]

  const certifications = [
    {
      name: "Data Analytics Job Simulation",
      issuer: "Deloitte",
      date: "July 2025",
      description: "Completed practical tasks in data analysis and forensic technology",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      name: "Cyber Job Simulation",
      issuer: "Deloitte",
      date: "July 2025",
      description: "Completed practical tasks in cyber security",
      icon: <Award className="w-6 h-6" />,
    },
    {
      name: "Power BI for Beginners",
      issuer: "Simplilearn",
      date: "July 2025",
      description: "Fundamentals of business intelligence and data visualization",
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Glassmorphism Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-serif font-bold text-xl text-foreground">Aditya Raj</div>
            <div className="hidden md:flex space-x-8">
              {["About", "Projects", "Skills", "Experience", "Education", "Dashboards", "Blog", "Contact"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-105 text-slate-50 ${
                      activeSection === item.toLowerCase() ? "text-primary font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center bg-gradient-hero animate-gradient relative overflow-hidden"
      >
        <FloatingParticles />
        <div className="absolute inset-0 bg-[url('/abstract-biotech-dna.png')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${isVisible.hero ? "animate-fade-in-up" : "opacity-0"}`}>
            <h1 className="font-serif font-bold text-6xl md:text-8xl mb-6 drop-shadow-lg text-white">Aditya Raj</h1>
            <div className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed h-16">
              <TypewriterText
                text="Undergraduate Biotechnology Student | Bioinformatics, Data Analytics & AI Application Enthusiast"
                delay={300}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => scrollToSection("projects")}
                className="font-medium neon-glow hover-lift bg-white text-primary hover:bg-white/90"
              >
                View My Work
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection("contact")}
                className="font-medium border-white hover:bg-white hover:text-primary hover-lift text-black"
              >
                Get In Touch
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
          <ChevronDown
            className="w-8 h-8 text-white/80 cursor-pointer hover:text-white transition-colors hover:scale-110"
            onClick={() => scrollToSection("about")}
          />
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="py-20 bg-gradient-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`font-serif font-bold text-5xl text-foreground mb-4 transition-all duration-1000 ${isVisible.about ? "animate-fade-in-up" : "opacity-0"}`}
            >
              About Me
            </h2>
            <p
              className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible.about ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Passionate about bridging biology and technology through innovative solutions
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-6 transition-all duration-1000 delay-300 ${isVisible.about ? "animate-fade-in-left" : "opacity-0"}`}
            >
              <div className="w-80 h-80 mx-auto md:mx-0 rounded-full bg-gradient-card flex items-center justify-center overflow-hidden hover-lift neon-glow">
                <img src="/aditya-new-profile.jpg" alt="Aditya Raj" className="w-full h-full object-cover" />
              </div>
            </div>
            <div
              className={`space-y-6 transition-all duration-1000 delay-500 ${isVisible.about ? "animate-fade-in-right" : "opacity-0"}`}
            >
              <p className="text-foreground leading-relaxed text-lg">
                I'm a dedicated Biotechnology undergraduate at Delhi Technological University with a passion for
                leveraging technology to solve biological challenges. My journey combines traditional biological
                sciences with cutting-edge computational tools and data analytics.
              </p>
              <p className="text-foreground leading-relaxed text-lg">
                Through various projects and internships, I've developed expertise in bioinformatics, data
                visualization, and AI applications. I'm particularly interested in how machine learning can accelerate
                drug discovery and improve healthcare outcomes.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Bioinformatics", "Data Analytics", "AI Applications", "Biotechnology"].map((tag, index) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className={`px-4 py-2 text-sm font-medium bg-gradient-card hover-lift transition-all duration-300 delay-${index * 100}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Projects Section */}
      <section id="projects" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`font-serif font-bold text-5xl text-foreground mb-4 transition-all duration-1000 ${isVisible.projects ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Featured Projects
            </h2>
            <p
              className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible.projects ? "animate-fade-in-up" : "opacity-0"}`}
            >
              A showcase of my work in bioinformatics, data analytics, and software development
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className={`group hover-lift neon-glow transition-all duration-500 delay-${index * 100} ${isVisible.projects ? "animate-slide-in-up" : "opacity-0"} bg-gradient-card`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">{project.icon}</div>
                    <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="outline"
                        className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 hover-lift bg-transparent">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                    <Button size="sm" className="flex-1 hover-lift">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Skills Section */}
      <section id="skills" className="py-20 bg-gradient-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`font-serif font-bold text-5xl text-foreground mb-4 transition-all duration-1000 ${isVisible.skills ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Technical Skills
            </h2>
            <p
              className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible.skills ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Technologies and tools I use to bring ideas to life
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <div
                key={index}
                className={`group p-4 bg-gradient-card rounded-lg hover-lift neon-glow transition-all duration-500 delay-${index * 50} ${isVisible.skills ? "animate-pop-in" : "opacity-0"} cursor-default`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-primary group-hover:scale-110 transition-transform">{skill.icon}</div>
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {skill.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Experience Section */}
      <section id="experience" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`font-serif font-bold text-5xl text-foreground mb-4 transition-all duration-1000 ${isVisible.experience ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Experience
            </h2>
            <p
              className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible.experience ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Professional experience and practical learning
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div
              className={`timeline-item transition-all duration-1000 delay-300 ${isVisible.experience ? "animate-slide-in-up" : "opacity-0"}`}
            >
              <Card className="hover-lift neon-glow bg-gradient-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Microscope className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-serif text-xl">Pharmacy Intern</CardTitle>
                        <CardDescription className="text-primary font-medium">Ravi Medical Hall</CardDescription>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        June 2025 - July 2025
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      Assisted in pharmaceutical operations and customer service
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      Gained hands-on experience in medication management and inventory control
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      Developed understanding of pharmaceutical regulations and patient care
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Education Section */}
      <section id="education" className="py-20 bg-gradient-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`font-serif font-bold text-5xl text-foreground mb-4 transition-all duration-1000 ${isVisible.education ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Education
            </h2>
            <p
              className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible.education ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Academic journey and achievements
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            <div
              className={`timeline-item transition-all duration-1000 delay-300 ${isVisible.education ? "animate-slide-in-up" : "opacity-0"}`}
            >
              <Card className="hover-lift neon-glow bg-gradient-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-serif text-xl">Bachelor of Technology - Biotechnology</CardTitle>
                        <button
                          onClick={() => setShowCGPA(!showCGPA)}
                          className="text-primary font-medium hover:underline transition-all duration-300 hover:scale-105"
                        >
                          Delhi Technological University (2023–2027)
                        </button>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Current
                    </Badge>
                  </div>
                </CardHeader>
                {showCGPA && (
                  <CardContent className="animate-fade-in-up">
                    <div className="p-4 bg-muted/50 rounded-lg mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-2">CGPA: 7.885</div>
                        <div className="text-sm text-muted-foreground">Current Academic Performance</div>
                      </div>
                    </div>
                    <SGPAChart sgpaData={sgpaData} />
                  </CardContent>
                )}
              </Card>
            </div>

            <div
              className={`timeline-item transition-all duration-1000 delay-400 ${isVisible.education ? "animate-slide-in-up" : "opacity-0"}`}
            >
              <Card className="hover-lift neon-glow bg-gradient-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-serif text-xl">Class XII - 85%</CardTitle>
                        <CardDescription className="text-muted-foreground">Higher Secondary Education</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </CardHeader>
              </Card>
            </div>

            <div
              className={`timeline-item transition-all duration-1000 delay-500 ${isVisible.education ? "animate-slide-in-up" : "opacity-0"}`}
            >
              <Card className="hover-lift neon-glow bg-gradient-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-serif text-xl">Class X - 86.2%</CardTitle>
                        <CardDescription className="text-muted-foreground">Secondary Education</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-sliding Certifications Carousel */}
      <section id="certifications" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`font-serif font-bold text-5xl text-foreground mb-4 transition-all duration-1000 ${isVisible.certifications ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Certifications
            </h2>
            <p
              className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible.certifications ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Professional certifications and continuous learning
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentCertIndex * 100}%)` }}
              >
                {certifications.map((cert, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className="hover-lift neon-glow bg-gradient-card">
                      <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                          <div className="text-primary">{cert.icon}</div>
                        </div>
                        <CardTitle className="font-serif text-2xl mb-2">{cert.name}</CardTitle>
                        <CardDescription className="text-primary font-medium mb-2">{cert.issuer}</CardDescription>
                        <div className="text-sm text-muted-foreground mb-4">{cert.date}</div>
                        <p className="text-foreground leading-relaxed">{cert.description}</p>
                      </CardHeader>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-6 gap-2">
              {certifications.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCertIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentCertIndex ? "bg-primary scale-125" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Showcase Section */}
      <section id="dashboards" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`font-serif font-bold text-5xl text-foreground mb-4 transition-all duration-1000 ${isVisible.dashboards ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Dashboard Showcase
            </h2>
            <p
              className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible.dashboards ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Interactive dashboards and data visualizations
            </p>
          </div>

          {/* Admin Upload Section */}
          <div className="mb-12 text-center">
            <Button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="hover-lift neon-glow"
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Admin Upload
            </Button>
          </div>

          {showUploadForm && (
            <Card className="max-w-md mx-auto mb-12 hover-lift neon-glow bg-gradient-card">
              <CardHeader>
                <CardTitle className="font-serif text-xl">Upload Dashboard File</CardTitle>
                <CardDescription>Upload PowerBI (.pbix), Tableau (.twbx), PDF, or image files</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div>
                    <Input
                      type="password"
                      placeholder="Enter password: aditya2025"
                      value={uploadPassword}
                      onChange={(e) => setUploadPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">Password: aditya2025</p>
                  </div>

                  <div>
                    <Input
                      type="file"
                      accept=".pbix,.twbx,.pdf,.png,.jpg,.jpeg,.pptx,.xlsx"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={uploading} className="flex-1">
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Files Grid */}
          {loadingFiles ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading files...</p>
            </div>
          ) : uploadedFiles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uploadedFiles.map((file, index) => (
                <Card
                  key={index}
                  className={`group hover-lift neon-glow transition-all duration-500 delay-${index * 100} ${isVisible.dashboards ? "animate-slide-in-up" : "opacity-0"} bg-gradient-card`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="font-serif text-lg truncate max-w-[200px]">{file.filename}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {file.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={file.url} download>
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteFile(file.url)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">No dashboard files uploaded yet</p>
              <p className="text-muted-foreground text-sm">
                Upload your first PowerBI or Tableau dashboard to get started
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-gradient-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`font-serif font-bold text-5xl text-foreground mb-4 transition-all duration-1000 ${isVisible.blog ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Blog & Updates
            </h2>
            <p
              className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible.blog ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Insights, learnings, and updates from my journey
            </p>
          </div>

          <div
            className={`max-w-4xl mx-auto text-center transition-all duration-1000 delay-300 ${isVisible.blog ? "animate-fade-in-up" : "opacity-0"}`}
          >
            <Card className="hover-lift neon-glow bg-gradient-card">
              <CardHeader className="pb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-serif text-2xl mb-4">Coming Soon</CardTitle>
                <CardDescription className="text-lg">
                  I'm working on sharing my insights about biotechnology, data analytics, and AI applications. Stay
                  tuned for articles about my projects, learning experiences, and industry trends.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="hover-lift neon-glow">Subscribe for Updates</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`font-serif font-bold text-5xl text-foreground mb-4 transition-all duration-1000 ${isVisible.contact ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Get In Touch
            </h2>
            <p
              className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible.contact ? "animate-fade-in-up" : "opacity-0"}`}
            >
              Let's connect and discuss opportunities in biotechnology and data analytics
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div
              className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible.contact ? "animate-fade-in-left" : "opacity-0"}`}
            >
              <div>
                <h3 className="font-serif font-semibold text-2xl text-foreground mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-gradient-card rounded-lg hover-lift">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-lg">Email</p>
                      <p className="text-muted-foreground">theadityakashyap311@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-card rounded-lg hover-lift">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-lg">Location</p>
                      <p className="text-muted-foreground">Delhi, India</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-serif font-semibold text-2xl text-foreground mb-6">Social Links</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.linkedin.com/in/aditya-raj-054bb1205/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-gradient-card rounded-lg flex items-center justify-center hover-lift neon-glow transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="w-6 h-6 text-primary" />
                  </a>
                  <a
                    href="#"
                    className="w-14 h-14 bg-gradient-card rounded-lg flex items-center justify-center hover-lift neon-glow transition-all duration-300 hover:scale-110"
                  >
                    <Instagram className="w-6 h-6 text-primary" />
                  </a>
                  <a
                    href="https://github.com/codewithadityakashyap/dataset"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-gradient-card rounded-lg flex items-center justify-center hover-lift neon-glow transition-all duration-300 hover:scale-110"
                  >
                    <Github className="w-6 h-6 text-primary" />
                  </a>
                </div>
              </div>
            </div>
            <div
              className={`transition-all duration-1000 delay-500 ${isVisible.contact ? "animate-fade-in-right" : "opacity-0"}`}
            >
              <Card className="hover-lift neon-glow bg-gradient-card">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Send a Message</CardTitle>
                  <CardDescription className="text-lg">
                    I'd love to hear from you. Send me a message and I'll respond as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Name
                        </label>
                        <Input id="name" placeholder="Your name" className="hover-lift transition-all duration-300" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="hover-lift transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        placeholder="What's this about?"
                        className="hover-lift transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Your message..."
                        rows={4}
                        className="hover-lift transition-all duration-300"
                      />
                    </div>
                    <Button type="submit" className="w-full hover-lift neon-glow text-lg py-3">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-hero py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-white/80 text-sm">© 2025 Aditya Raj. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              {["About", "Projects", "Dashboards", "Blog", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-sm text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
