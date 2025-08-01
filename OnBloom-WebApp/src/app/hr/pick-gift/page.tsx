"use client";

import React, { useState, useRef } from "react";
import {
  Send,
  Sparkles,
  Users,
  Trophy,
  Briefcase,
  Cake,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmployeeMention } from "@/components/EmployeeMention";
import { GiftGrid } from "@/components/GiftGrid";
import { SourcesDisplay } from "@/components/SourcesDisplay";
import { toast } from "sonner";
import type { EmployeeCulturalProfile } from "@/service/notion";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  mentionedEmployees?: EmployeeCulturalProfile[];
  recommendations?: Array<{
    id: string;
    name: string;
    category: string;
    type: "brand" | "place" | "product";
    affinity?: number;
    explainability?: any;
  }>;
  qlooSources?: Array<{
    id: string;
    name: string;
    affinity: number;
    explainability?: any;
  }>;
}

interface SuggestedPrompt {
  id: string;
  text: string;
  icon: React.ReactNode;
  category: string;
}

export default function PickGift() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mentionedEmployees, setMentionedEmployees] = useState<
    EmployeeCulturalProfile[]
  >([]);
  const [recommendations, setRecommendations] = useState<
    Array<{
      id: string;
      name: string;
      category: string;
      type: "brand" | "place" | "product";
      affinity?: number;
      price?: number;
      image?: string;
      url?: string;
      suggestedGifts?: string[];
      explainability?: any;
    }>
  >([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [selectedGiftIds, setSelectedGiftIds] = useState<string[]>([]);
  const [showApprovalMode, setShowApprovalMode] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock gift data for demo
  const mockGifts = [
    {
      id: "mock-1",
      name: "Apple AirPods Pro",
      category: "Electronics",
      type: "brand" as const,
      price: 249,
      affinityScore: 0.92,
      suggestedGifts: ["AirPods Pro", "AppleCare+", "Wireless Charging Case"],
      popularity: 0.88,
    },
    {
      id: "mock-2",
      name: "Patagonia Better Sweater",
      category: "Apparel",
      type: "brand" as const,
      price: 139,
      affinityScore: 0.87,
      suggestedGifts: ["Better Sweater Jacket", "Fleece Vest", "Gift Card"],
      popularity: 0.75,
    },
    {
      id: "mock-3",
      name: "MasterClass Annual Subscription",
      category: "Education",
      type: "product" as const,
      price: 180,
      affinityScore: 0.85,
      suggestedGifts: ["All-Access Pass", "Individual Class", "Gift Subscription"],
      popularity: 0.82,
    },
    {
      id: "mock-4",
      name: "Moleskine Smart Writing Set",
      category: "Stationery",
      type: "brand" as const,
      priceRange: "$150 - $250",
      affinityScore: 0.78,
      suggestedGifts: ["Smart Notebook", "Smart Pen", "Digital Bundle"],
      popularity: 0.65,
    },
    {
      id: "mock-5",
      name: "Blue Bottle Coffee Subscription",
      category: "Food & Beverage",
      type: "brand" as const,
      priceRange: "$75 - $150",
      affinityScore: 0.83,
      suggestedGifts: ["3-Month Subscription", "Coffee Kit", "Gift Box"],
      popularity: 0.79,
    },
    {
      id: "mock-6",
      name: "Away The Everywhere Bag",
      category: "Travel",
      type: "brand" as const,
      price: 195,
      affinityScore: 0.81,
      suggestedGifts: ["Weekender Bag", "Toiletry Bag", "Packing Cubes"],
      popularity: 0.72,
    },
  ];

  const suggestedPrompts: SuggestedPrompt[] = [
    {
      id: "1",
      text: "Welcome gift ideas for a new team member starting next week",
      icon: <Users className="w-4 h-4" />,
      category: "Onboarding",
    },
    {
      id: "2",
      text: "Meaningful work anniversary gifts for a 5-year milestone",
      icon: <Trophy className="w-4 h-4" />,
      category: "Recognition",
    },
    {
      id: "3",
      text: "Professional farewell gifts for a departing colleague",
      icon: <Briefcase className="w-4 h-4" />,
      category: "Farewell",
    },
    {
      id: "4",
      text: "Team celebration gifts for hitting quarterly targets",
      icon: <Cake className="w-4 h-4" />,
      category: "Celebration",
    },
  ];

  const handleEmployeeMention = (employee: EmployeeCulturalProfile) => {
    setMentionedEmployees((prev) => {
      const exists = prev.some((e) => e.id === employee.id);
      if (!exists) {
        return [...prev, employee];
      }
      return prev;
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
      mentionedEmployees: [...mentionedEmployees],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call chat API
      const response = await fetch("/api/gift/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          mentionedEmployees: mentionedEmployees.map((e) => ({
            id: e.id,
            name: e.name,
          })),
          previousMessages: messages.map((m) => ({
            role: m.type,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.content,
        timestamp: new Date(),
        qlooSources: data.context?.qlooRecommendations,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Get recommendations if we have mentioned employees
      if (
        mentionedEmployees.length > 0 &&
        data.context?.mentionedEmployees?.[0]
      ) {
        setIsLoadingRecommendations(true);
        const recResponse = await fetch("/api/gift/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientId: data.context.mentionedEmployees[0].id,
            interests: data.context.giftContext?.interests,
            occasion: data.context.giftContext?.occasions?.[0],
            priceRange: data.context.giftContext?.priceRange,
          }),
        });

        const recData = await recResponse.json();
        if (recData.recommendations) {
          setRecommendations(recData.recommendations);
        }
        setIsLoadingRecommendations(false);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleSelectGift = async (gift: {
    id: string;
    name: string;
    category: string;
    price?: number;
    priceRange?: { min: number; max: number };
    image?: string;
    url?: string;
    affinityScore?: number;
    occasion?: string;
    notes?: string;
    explainability?: any;
  }) => {
    const recipient = mentionedEmployees[0];
    if (!recipient) {
      toast.error("Please mention an employee to select a gift for.");
      return;
    }

    // Log the gift selection
    console.log('Gift selected:', {
      gift,
      selectedFor: recipient,
      timestamp: new Date().toISOString(),
    });

    try {
      const response = await fetch("/api/gift/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift: {
            id: gift.id,
            name: gift.name,
            category: gift.category,
            price: gift.price,
            priceRange: gift.priceRange,
            image: gift.image,
            url: gift.url,
            affinityScore: gift.affinityScore,
          },
          selectedFor: {
            id: recipient.id,
            name: recipient.name,
          },
          occasion: gift.occasion,
          notes: gift.notes,
          qlooSources: gift.explainability,
        }),
      });

      if (response.ok) {
        setSelectedGiftIds((prev) => [...prev, gift.id]);
        toast.success(`${gift.name} has been selected for ${recipient.name}.`);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to select gift");
      }
    } catch (error) {
      console.error("Gift selection error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to select gift.",
      );
    }
  };

  const handleSendForApproval = async (gift: {
    id: string;
    name: string;
    category: string;
    price?: number;
    priceRange?: { min: number; max: number };
    occasion?: string;
    notes?: string;
  }) => {
    const recipient = mentionedEmployees[0];
    if (!recipient) {
      toast.error("Please mention an employee to select a gift for.");
      return;
    }

    // Log the approval request
    console.log('Sending gift for approval:', {
      gift,
      selectedFor: recipient,
      timestamp: new Date().toISOString(),
    });

    try {
      const response = await fetch("/api/gift/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftId: gift.id,
          giftName: gift.name,
          giftCategory: gift.category,
          giftPrice: gift.price,
          giftPriceRange: gift.priceRange,
          selectedFor: {
            id: recipient.id,
            name: recipient.name,
          },
          occasion: gift.occasion,
          notes: gift.notes,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Approval response:', result);
        toast.success(`${gift.name} has been sent for approval!`);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to send for approval");
      }
    } catch (error) {
      console.error("Approval error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send for approval.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light mb-6">Find the perfect gift</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Discover meaningful gifts for employees, colleagues, and team
            celebrations
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Powered by</span>
            <Badge
              variant="outline"
              className="text-sm font-medium px-3 py-1 border-primary/20"
            >
              qloo
            </Badge>
          </div>
        </div>

        {/* Messages */}
        {messages.length > 0 && (
          <div className="mb-8 space-y-4">
            {messages.map((message) => (
              <Card
                key={message.id}
                className={`p-4 ${
                  message.type === "user"
                    ? "ml-8 bg-primary/5 border-primary/20"
                    : "mr-8 bg-muted/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {message.type === "user" ? (
                      <span className="text-sm font-medium">You</span>
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.mentionedEmployees &&
                      message.mentionedEmployees.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.mentionedEmployees.map((emp) => (
                            <Badge
                              key={emp.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              @{emp.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </Card>
            ))}
            {isLoading && (
              <Card className="mr-8 bg-muted/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Search Input */}
        <div className="mb-12">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative bg-muted/30 border border-border rounded-2xl focus-within:border-primary/50 transition-colors">
              <EmployeeMention
                value={inputValue}
                onChange={setInputValue}
                onMention={handleEmployeeMention}
                textareaRef={textareaRef}
              />
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Use @ to mention employees</span>
                  </div>
                  {mentionedEmployees.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Shopping for:
                      </span>
                      {mentionedEmployees.map((emp) => (
                        <Badge
                          key={emp.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {emp.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="rounded-lg"
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Gift Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Gift Recommendations</h2>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowApprovalMode(!showApprovalMode)}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  {showApprovalMode ? 'Switch to Select' : 'Send for Approval'}
                </Button>
                <Badge variant="outline">
                  {recommendations.length} suggestions
                </Badge>
              </div>
            </div>
            <GiftGrid
              gifts={recommendations}
              onSelectGift={!showApprovalMode ? handleSelectGift : undefined}
              onSendForApproval={showApprovalMode ? handleSendForApproval : undefined}
              recipientName={mentionedEmployees[0]?.name}
              selectedGiftIds={selectedGiftIds}
              isLoading={isLoadingRecommendations}
              showApprovalButtons={showApprovalMode}
            />
          </div>
        )}

        {/* Sources Display */}
        {messages.some((m) => m.qlooSources?.length > 0) && (
          <div className="max-w-2xl mx-auto mb-12">
            <SourcesDisplay
              qlooSources={
                messages.find((m) => m.qlooSources?.length > 0)?.qlooSources
              }
            />
          </div>
        )}

        {/* Suggested Prompts */}
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  className="group p-4 text-left cursor-pointer hover:bg-muted/30 transition-all border border-border rounded-xl hover:border-primary/30 hover:shadow-sm"
                  onClick={() => handlePromptClick(prompt.text)}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      {prompt.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">
                        {prompt.category}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {prompt.text}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mock Gift Cards */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Featured Gift Ideas</h2>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApprovalMode(!showApprovalMode)}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                {showApprovalMode ? 'Switch to Select' : 'Send for Approval'}
              </Button>
              <Badge variant="outline">
                Mock gifts for demo
              </Badge>
            </div>
          </div>
          <GiftGrid
            gifts={mockGifts}
            onSelectGift={!showApprovalMode ? handleSelectGift : undefined}
            onSendForApproval={showApprovalMode ? handleSendForApproval : undefined}
            recipientName="Demo Employee"
            selectedGiftIds={selectedGiftIds}
            showApprovalButtons={showApprovalMode}
          />
        </div>
      </div>
    </div>
  );
}
