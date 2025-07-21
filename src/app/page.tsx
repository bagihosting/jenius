

'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookCheck, BrainCircuit, Edit, ShieldCheck, UserPlus } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      title: 'AI-Powered Quizzes',
      description: 'Generate adaptive quizzes that adjust in difficulty based on your performance, making learning more effective.',
    },
    {
      icon: <Edit className="h-10 w-10 text-primary" />,
      title: 'Interactive Exercises',
      description: 'Engage with hands-on exercises for each subject, designed to make learning fun and impactful.',
    },
    {
      icon: <BookCheck className="h-10 w-10 text-primary" />,
      title: 'Offline Learning',
      description: 'Download your learning materials and access them anytime, anywhere, even without an internet connection.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 sm:py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline tracking-tight">
              Unlock Your Child's Potential with <span className="text-primary">Pintar Elementary</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              An AI learning partner that understands the curriculum, simplifies homework, and helps your child achieve top grades.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-12 text-lg px-8 w-full sm:w-auto" onClick={() => router.push('/login')}>
                Start Learning <ArrowRight className="ml-2" />
              </Button>
               <Button size="lg" variant="outline" className="h-12 text-lg px-8 w-full sm:w-auto" onClick={() => router.push('/register')}>
                <UserPlus className="mr-2"/>
                Sign Up Free
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-secondary/50 py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Everything You Need to Excel</h2>
              <p className="mt-4 text-muted-foreground text-base sm:text-lg">
                From homework help to exam prep, we provide the right tools for every academic challenge.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 bg-card">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="mt-4 font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
         <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Start in 3 Easy Steps</h2>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center relative">
                    {/* Dashed line for desktop */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-8">
                        <svg width="100%" height="2">
                            <line x1="0" y1="1" x2="100%" y2="1" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="8 8" />
                        </svg>
                    </div>
                    <div className="flex flex-col items-center z-10">
                        <div className="bg-background p-2 border-2 border-dashed border-primary rounded-full">
                           <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">1</div>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold font-headline">Create an Account</h3>
                        <p className="mt-2 text-muted-foreground">Sign up for a new account in seconds.</p>
                    </div>
                     <div className="flex flex-col items-center z-10">
                        <div className="bg-background p-2 border-2 border-dashed border-primary rounded-full">
                           <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">2</div>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold font-headline">Choose Your Grade</h3>
                        <p className="mt-2 text-muted-foreground">Select the grade level and semester you are currently in.</p>
                    </div>
                     <div className="flex flex-col items-center z-10">
                        <div className="bg-background p-2 border-2 border-dashed border-primary rounded-full">
                           <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">3</div>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold font-headline">Start Learning</h3>
                        <p className="mt-2 text-muted-foreground">Access all materials, practice questions, and homework help!</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Testimonial Section */}
        <section className="bg-secondary/50 py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <ShieldCheck className="w-16 h-16 text-accent mx-auto" />
                    <blockquote className="mt-6 text-xl md:text-2xl font-semibold italic text-foreground/80">
                        "Since using Pintar Elementary, my child's grades have improved dramatically! The explanations are much easier to understand than private tutoring. Highly recommended!"
                    </blockquote>
                    <p className="mt-4 font-semibold text-muted-foreground">- Jane Doe, Parent of a Grade 4 Student</p>
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24 text-center">
             <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Change How Your Child Learns?</h2>
                <p className="mt-4 text-muted-foreground text-base sm:text-lg">
                    Sign up for free now and access all our smart features.
                </p>
                <div className="mt-8">
                     <Button size="lg" className="h-12 text-lg px-8" onClick={() => router.push('/register')}>
                        Sign Up for Free
                     </Button>
                </div>
            </div>
        </section>

      </main>

      <footer className="text-center p-6 bg-card text-muted-foreground text-sm border-t">
        © {new Date().getFullYear()} Pintar Elementary. All rights reserved.
      </footer>
    </div>
  );
}
