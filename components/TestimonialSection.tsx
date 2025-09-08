import React from 'react';

const testimonials = [
  {
    quote: "This platform has become indispensable for my daily document workflows. The AI analyzer, in particular, is a game-changer, saving me hours of manual work.",
    name: "Alex Johnson",
    title: "Lead Researcher",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    quote: "As a maritime logistics manager, the niche tools are incredibly useful. The compliance checker is accurate and gives me peace of mind. Highly recommended.",
    name: "Samantha Carter",
    title: "Operations Manager, Global Shipping",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
  },
  {
    quote: "An entire suite of high-quality tools in one place. It's fast, intuitive, and the design is just beautiful. It has replaced at least three other subscriptions for me.",
    name: "David Chen",
    title: "Founder, Innovatech Solutions",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
  }
];

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-slate-900 dark:text-white">
            Trusted by Professionals Worldwide
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-gray-400">
            See what our users are saying about their productivity boost.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-slate-900/50 p-8 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col">
              <p className="text-slate-600 dark:text-gray-300 flex-grow">"{testimonial.quote}"</p>
              <div className="flex items-center mt-6">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-500 dark:text-gray-400">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;