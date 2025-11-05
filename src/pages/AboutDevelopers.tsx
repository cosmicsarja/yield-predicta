import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Mail, Github, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const developers = [
  {
    name: "Shivalingsarj M Desai",
    usn: "2AG24AD406",
    role: "Full Stack Developer, AI integration",
    avatar: "IMG_0008.JPG",
  },
  {
    name: "Vaibhav Balekundri",
    usn: "2AG23AD053",
    role: "ML Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vaibhav",
  },
  {
    name: "Arzaan Khan",
    usn: "2AG23AD007",
    role: "Frontend Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arzaan",
  },
  {
    name: "Aishwarya Byati",
    usn: "2AG23AD002",
    role: "Documentation",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aishwarya",
  },
];

export default function AboutDevelopers() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2 mb-4">
          <Users className="h-10 w-10 text-primary" />
          About the Developers
        </h1>
        <p className="text-muted-foreground text-lg">
          AI-Powered Smart Agriculture Advisor
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Institution</p>
              <p className="font-semibold">Angadi Institute of Technology and Management</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-semibold">Belagavi, Karnataka</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-semibold">Artificial Intelligence and Data Science</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Semester</p>
              <p className="font-semibold">5th Semester</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {developers.map((dev, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="w-16 h-16 rounded-full border-2 border-primary"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-lg">{dev.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge variant="secondary" className="text-xs">
                        USN: {dev.usn}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-primary mb-3">{dev.role}</p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title="Email"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Objective</h3>
            <p className="text-sm text-muted-foreground">
              To develop an AI-powered web application that assists farmers in making data-driven 
              decisions through intelligent crop recommendations, yield predictions, and fertilizer 
              advisory based on soil parameters, weather conditions, and historical data.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Key Features</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• AI-based crop recommendation system</li>
              <li>• Yield prediction using machine learning models</li>
              <li>• Smart fertilizer planning and nutrient management</li>
              <li>• Real-time weather integration and mapping</li>
              <li>• Historical data tracking and analysis</li>
              <li>• User authentication and personalized dashboard</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Technologies Used</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge>React</Badge>
              <Badge>TypeScript</Badge>
              <Badge>Tailwind CSS</Badge>
              <Badge>Supabase</Badge>
              <Badge>OpenStreetMap</Badge>
              <Badge>Machine Learning</Badge>
              <Badge>Weather APIs</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
