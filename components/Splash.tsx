import { Book, Info, Bot, Sparkles, MessageSquareText } from "lucide-react";
import React from "react";

import { Button } from "./ui/button";

type SplashProps = {
  handleReady: () => void;
};

export const Splash: React.FC<SplashProps> = ({ handleReady }) => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-200 p-6">
      <div className="relative w-full max-w-5xl mx-auto">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-200 rounded-full filter blur-3xl opacity-20 -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-300 rounded-full filter blur-3xl opacity-20 -z-10" />

        <div className="flex flex-col items-center gap-12 bg-white/30 rounded-2xl p-8">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-medium text-sm mb-4">
              <Sparkles className="size-4" />
              AI-Powered Demo Platform
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
              Realtime-AI Product Demo <span className="inline-block">👩‍🚀</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Experience interactive product demonstrations powered by advanced
              AI assistants. Get real-time, intelligent responses to your
              product queries.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 w-full max-w-3xl">
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
              <Bot className="size-8 text-primary-600 mb-2" />
              <h3 className="font-semibold">AI-Powered</h3>
              <p className="text-sm text-gray-600 text-center">
                Advanced AI models for intelligent interactions
              </p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
              <MessageSquareText className="size-8 text-primary-600 mb-2" />
              <h3 className="font-semibold">Real-time Responses</h3>
              <p className="text-sm text-gray-600 text-center">
                Instant, contextual product information
              </p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
              <Sparkles className="size-8 text-primary-600 mb-2" />
              <h3 className="font-semibold">Interactive Demo</h3>
              <p className="text-sm text-gray-600 text-center">
                Engaging product demonstrations
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => handleReady()}
            size="lg"
            className="text-lg px-8 py-6 rounded-full bg-primary-600 hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Product Demo 🚀
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Splash;
