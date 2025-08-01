"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  Mail,
  MapPin,
  Calendar,
  Building2,
  User,
  Filter,
  Grid3X3,
  List,
  Clock,
  Users,
  Badge as BadgeIcon,
  Hash,
  Plus,
  X,
  CheckCircle,
  Globe,
  UserPlus,
  Edit,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeCulturalProfile } from "@/service/notion";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type CreateEmployeeData = Omit<EmployeeCulturalProfile, "id">;

interface GridPatternCardProps {
  children: React.ReactNode;
  className?: string;
  patternClassName?: string;
  gradientClassName?: string;
  onClick?: () => void;
}

function GridPatternCard({
  children,
  className,
  patternClassName,
  gradientClassName,
  onClick,
}: GridPatternCardProps) {
  return (
    <motion.div
      className={cn(
        "border w-full rounded-lg overflow-hidden",
        "bg-white dark:bg-zinc-950",
        "border-zinc-200 dark:border-zinc-800",
        "hover:shadow-lg transition-all duration-300",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      onClick={onClick}
    >
      <div
        className={cn(
          "size-full bg-gradient-to-br from-white via-gray-50/50 to-white",
          "dark:from-zinc-950 dark:via-zinc-900/50 dark:to-zinc-950",
          gradientClassName
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}

function GridPatternCardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-left p-6", className)} {...props} />;
}

interface EmployeeCardProps {
  employee: EmployeeCulturalProfile;
  viewMode: "grid" | "list";
  onClick: (employee: EmployeeCulturalProfile) => void;
}

function EmployeeCard({ employee, viewMode, onClick }: EmployeeCardProps) {
  const router = useRouter();
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const generateAvatarUrl = (name: string) => {
    const seed = name.toLowerCase().replace(/\s+/g, "");
    return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=6366f1&textColor=ffffff&radius=50`;
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-onbloom-primary/20"
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 ring-2 ring-onbloom-primary/10">
            <AvatarImage
              src={generateAvatarUrl(employee.name)}
              alt={employee.name}
            />
            <AvatarFallback className="bg-onbloom-primary text-white">
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-onbloom-primary truncate mb-1">
              {employee.name}
            </h3>
            <p className="text-sm text-onbloom-dark-purple font-medium">
              {employee.role}
            </p>
          </div>

          <div className="hidden lg:flex flex-col gap-1 text-xs text-onbloom-dark-purple min-w-0">
            {employee.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-onbloom-accent-pink" />
                <span className="truncate">{employee.email}</span>
              </div>
            )}
            {employee.department && (
              <div className="flex items-center gap-2">
                <Building2 className="h-3 w-3 text-onbloom-accent-pink" />
                <span>{employee.department}</span>
              </div>
            )}
            {employee.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-onbloom-accent-pink" />
                <span>{employee.location}</span>
              </div>
            )}
            {employee.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-onbloom-accent-pink" />
                <span>Started {formatDate(employee.startDate)}</span>
              </div>
            )}
          </div>

          <div className="ml-auto flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/hr/initiate-onboarding?employeeId=${employee.id}`);
              }}
              className="flex-1 bg-onbloom-primary hover:bg-onbloom-primary/90 text-white"
            >
              Initiate Onboarding
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClick(employee);
              }}
              className="hover:bg-onbloom-primary hover:text-white transition-colors"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <GridPatternCard className="h-full">
      <GridPatternCardBody className="h-full flex flex-col">
        <div className="mb-4">
          <Avatar className="h-16 w-16 ring-2 ring-onbloom-primary/10">
            <AvatarImage
              src={generateAvatarUrl(employee.name)}
              alt={employee.name}
            />
            <AvatarFallback className="text-lg bg-onbloom-primary text-white">
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-lg text-onbloom-primary mb-1 line-clamp-1">
            {employee.name}
          </h3>
          <p className="text-sm text-onbloom-dark-purple mb-3 line-clamp-2 font-medium">
            {employee.role}
          </p>

          <div className="space-y-2 mb-4">
            {employee.email && (
              <div className="flex items-center gap-2 text-sm text-onbloom-dark-purple">
                <Mail className="h-4 w-4 flex-shrink-0 text-onbloom-accent-pink" />
                <span className="truncate">{employee.email}</span>
              </div>
            )}
            {employee.department && (
              <div className="flex items-center gap-2 text-sm text-onbloom-dark-purple">
                <Building2 className="h-4 w-4 flex-shrink-0 text-onbloom-accent-pink" />
                <span>{employee.department}</span>
              </div>
            )}
            {employee.location && (
              <div className="flex items-center gap-2 text-sm text-onbloom-dark-purple">
                <MapPin className="h-4 w-4 flex-shrink-0 text-onbloom-accent-pink" />
                <span className="truncate">{employee.location}</span>
              </div>
            )}
            {employee.startDate && (
              <div className="flex items-center gap-2 text-sm text-onbloom-dark-purple">
                <Calendar className="h-4 w-4 flex-shrink-0 text-onbloom-accent-pink" />
                <span>Started {formatDate(employee.startDate)}</span>
              </div>
            )}
            {employee.timeZone && (
              <div className="flex items-center gap-2 text-sm text-onbloom-dark-purple">
                <Clock className="h-4 w-4 flex-shrink-0 text-onbloom-accent-pink" />
                <span>{employee.timeZone}</span>
              </div>
            )}
            {employee.employeeId && (
              <div className="flex items-center gap-2 text-sm text-onbloom-dark-purple">
                <Hash className="h-4 w-4 flex-shrink-0 text-onbloom-accent-pink" />
                <span>{employee.employeeId}</span>
              </div>
            )}
          </div>

          <div className="mt-auto">
            {employee.culturalHeritage?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-onbloom-dark-purple mb-2 flex items-center gap-1">
                  <BadgeIcon className="h-3 w-3 text-onbloom-accent-pink" />
                  Cultural Heritage:
                </p>
                <div className="flex flex-wrap gap-1">
                  {employee.culturalHeritage.map((heritage, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-onbloom-accent-pink/20 text-onbloom-primary border-onbloom-accent-pink/30"
                    >
                      {heritage}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/hr/initiate-onboarding?employeeId=${employee.id}`);
                }}
                className="flex-1 bg-onbloom-primary hover:bg-onbloom-primary/90 text-white"
              >
                Initiate Onboarding
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(employee);
                }}
                className="hover:bg-onbloom-primary hover:text-white transition-colors"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </GridPatternCardBody>
    </GridPatternCard>
  );
}

// Onboarding Form Component
interface OnboardEmployeeModalProps {
  onEmployeeAdded: () => void;
}

interface FormErrors {
  [key: string]: string;
}

const departments = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Analytics",
  "Security",
  "Operations",
  "Finance",
  "Human Resources",
];

const ageRanges = [
  "18-24",
  "25-29",
  "30-34",
  "35-39",
  "40-44",
  "45-49",
  "50-54",
  "55-59",
  "60+",
  "Prefer not to say",
];

const genderIdentities = [
  "Man",
  "Woman",
  "Non-binary",
  "Genderfluid",
  "Transgender",
  "Other",
  "Prefer not to say",
];

const culturalHeritageOptions = [
  "African",
  "African American",
  "Asian",
  "Caribbean",
  "East Asian",
  "European",
  "Hispanic/Latino",
  "Indigenous",
  "Middle Eastern",
  "Native American",
  "Pacific Islander",
  "South Asian",
  "Southeast Asian",
  "Mixed Heritage",
  "Other",
];

const timeZones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Vancouver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

function OnboardEmployeeModal({ onEmployeeAdded }: OnboardEmployeeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedCulturalHeritage, setSelectedCulturalHeritage] = useState<
    string[]
  >([]);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createEmployeeMutation = useMutation(
    trpc.employee.create.mutationOptions({
      onSuccess: () => {
        setIsSubmitted(true);
        onEmployeeAdded();
        // Invalidate and refetch employee queries
        queryClient.invalidateQueries({ queryKey: [["employee"]] });
      },
      onError: (error) => {
        console.error("Failed to create employee:", error);
        setErrors({ submit: "Failed to create employee. Please try again." });
      },
    })
  );

  // const createEmployeeMutation = useMutation({
  //   mutationFn: (data: CreateEmployeeData) =>
  //     trpc.employee.create(data),
  //   onSuccess: () => {
  //     setIsSubmitted(true)
  //     onEmployeeAdded()
  //     // Invalidate and refetch employee queries
  //     queryClient.invalidateQueries({ queryKey: [['employee']] })
  //   },
  //   onError: (error) => {
  //     console.error('Failed to create employee:', error)
  //     setErrors({ submit: 'Failed to create employee. Please try again.' })
  //   },
  // })

  const [formData, setFormData] = useState<CreateEmployeeData>({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    role: "",
    startDate: "",
    location: "",
    timeZone: "",
    ageRange: "",
    genderIdentity: "",
    culturalHeritage: [],
  });

  const totalSteps = 3;

  const stepTitles = [
    "Personal & Contact Information",
    "Job Details & Location",
    "Demographics & Cultural Information",
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        if (!formData.employeeId.trim())
          newErrors.employeeId = "Employee ID is required";
        break;
      case 2:
        if (!formData.role.trim()) newErrors.role = "Role is required";
        if (!formData.department)
          newErrors.department = "Department is required";
        if (!formData.startDate) newErrors.startDate = "Start date is required";
        if (!formData.location.trim())
          newErrors.location = "Location is required";
        if (!formData.timeZone) newErrors.timeZone = "Time zone is required";
        break;
      case 3:
        // Optional fields - no validation required
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CreateEmployeeData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCulturalHeritageToggle = (heritage: string) => {
    const updated = selectedCulturalHeritage.includes(heritage)
      ? selectedCulturalHeritage.filter((h) => h !== heritage)
      : [...selectedCulturalHeritage, heritage];

    setSelectedCulturalHeritage(updated);
    handleInputChange("culturalHeritage", updated);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    createEmployeeMutation.mutate(formData);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      employeeId: "",
      department: "",
      role: "",
      startDate: "",
      location: "",
      timeZone: "",
      ageRange: "",
      genderIdentity: "",
      culturalHeritage: [],
    });
    setSelectedCulturalHeritage([]);
    setCurrentStep(1);
    setErrors({});
    setIsSubmitted(false);
    setIsOpen(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-onbloom-dark-purple" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-onbloom-dark-purple" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-onbloom-dark-purple" />
                <Input
                  id="employeeId"
                  placeholder="EMP001"
                  value={formData.employeeId}
                  onChange={(e) =>
                    handleInputChange("employeeId", e.target.value)
                  }
                  className={`pl-10 ${
                    errors.employeeId ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.employeeId && (
                <p className="text-sm text-red-500">{errors.employeeId}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role/Position *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-onbloom-dark-purple" />
                <Input
                  id="role"
                  placeholder="Software Engineer"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className={`pl-10 ${errors.role ? "border-red-500" : ""}`}
                />
              </div>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  handleInputChange("department", value)
                }
              >
                <SelectTrigger
                  className={errors.department ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-sm text-red-500">{errors.department}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-onbloom-dark-purple" />
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className={`pl-10 ${
                    errors.startDate ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-onbloom-dark-purple" />
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
                />
              </div>
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Time Zone *</Label>
              <Select
                value={formData.timeZone}
                onValueChange={(value) => handleInputChange("timeZone", value)}
              >
                <SelectTrigger
                  className={errors.timeZone ? "border-red-500" : ""}
                >
                  <Clock className="h-4 w-4 mr-2 text-onbloom-dark-purple" />
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map((zone) => (
                    <SelectItem key={zone} value={zone}>
                      {zone.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timeZone && (
                <p className="text-sm text-red-500">{errors.timeZone}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Age Range (Optional)</Label>
              <Select
                value={formData.ageRange}
                onValueChange={(value) => handleInputChange("ageRange", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  {ageRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gender Identity (Optional)</Label>
              <Select
                value={formData.genderIdentity}
                onValueChange={(value) =>
                  handleInputChange("genderIdentity", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender identity" />
                </SelectTrigger>
                <SelectContent>
                  {genderIdentities.map((identity) => (
                    <SelectItem key={identity} value={identity}>
                      {identity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cultural Heritage (Optional - Select multiple)</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {culturalHeritageOptions.map((heritage) => (
                  <label
                    key={heritage}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCulturalHeritage.includes(heritage)}
                      onChange={() => handleCulturalHeritageToggle(heritage)}
                      className="rounded border-gray-300 text-onbloom-primary focus:ring-onbloom-primary"
                    />
                    <span className="text-sm">{heritage}</span>
                  </label>
                ))}
              </div>
              {selectedCulturalHeritage.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedCulturalHeritage.map((heritage) => (
                    <Badge
                      key={heritage}
                      variant="secondary"
                      className="text-xs bg-onbloom-accent-pink/20 text-onbloom-primary"
                    >
                      {heritage}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-onbloom-primary hover:bg-onbloom-primary/90 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Onboard Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-onbloom-primary">
            Employee Onboarding
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-onbloom-dark-purple">
                  <span>
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span>
                    {Math.round((currentStep / totalSteps) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-onbloom-neutral rounded-full h-2">
                  <motion.div
                    className="bg-onbloom-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-onbloom-primary">
                  {stepTitles[currentStep - 1]}
                </h3>
              </div>

              {/* Form Content */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-onbloom-primary hover:bg-onbloom-primary/90"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={createEmployeeMutation.isPending}
                    className="bg-onbloom-primary hover:bg-onbloom-primary/90"
                  >
                    {createEmployeeMutation.isPending ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : null}
                    {createEmployeeMutation.isPending
                      ? "Creating Employee..."
                      : "Create Employee"}
                  </Button>
                )}
              </div>

              {/* Submit Error Display */}
              {errors.submit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-onbloom-primary">
                Employee Created Successfully!
              </h3>
              <p className="text-onbloom-dark-purple">
                {formData.name} has been added to the system and will receive
                their onboarding materials shortly.
              </p>
              <div className="flex gap-3 justify-center pt-4">
                <Button variant="outline" onClick={resetForm}>
                  Add Another Employee
                </Button>
                <Button onClick={() => setIsOpen(false)}>Close</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// Edit Employee Modal Component
interface EditEmployeeModalProps {
  employee: EmployeeCulturalProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onEmployeeUpdated: () => void;
}

function EditEmployeeModal({ 
  employee, 
  isOpen, 
  onClose, 
  onEmployeeUpdated 
}: EditEmployeeModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedCulturalHeritage, setSelectedCulturalHeritage] = useState<string[]>([]);
  
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  
  const updateEmployeeMutation = useMutation(
    trpc.employee.update.mutationOptions({
      onSuccess: () => {
        setIsSubmitted(true);
        onEmployeeUpdated();
        // Invalidate and refetch employee queries
        queryClient.invalidateQueries({ queryKey: [["employee"]] });
      },
      onError: (error) => {
        console.error("Failed to update employee:", error);
        setErrors({ submit: "Failed to update employee. Please try again." });
      },
    })
  );

  const [formData, setFormData] = useState<CreateEmployeeData>({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    role: "",
    startDate: "",
    location: "",
    timeZone: "",
    ageRange: "",
    genderIdentity: "",
    culturalHeritage: [],
  });

  // Update form data when employee prop changes
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        employeeId: employee.employeeId || "",
        department: employee.department || "",
        role: employee.role || "",
        startDate: employee.startDate || "",
        location: employee.location || "",
        timeZone: employee.timeZone || "",
        ageRange: employee.ageRange || "",
        genderIdentity: employee.genderIdentity || "",
        culturalHeritage: employee.culturalHeritage || [],
      });
      setSelectedCulturalHeritage(employee.culturalHeritage || []);
    }
  }, [employee]);

  const totalSteps = 3;

  const stepTitles = [
    "Personal & Contact Information",
    "Job Details & Location",
    "Demographics & Cultural Information",
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email";
        }
        if (!formData.employeeId.trim())
          newErrors.employeeId = "Employee ID is required";
        break;
      case 2:
        if (!formData.role.trim()) newErrors.role = "Role is required";
        if (!formData.department)
          newErrors.department = "Department is required";
        if (!formData.startDate) newErrors.startDate = "Start date is required";
        if (!formData.location.trim())
          newErrors.location = "Location is required";
        if (!formData.timeZone) newErrors.timeZone = "Time zone is required";
        break;
      case 3:
        // Optional fields - no validation required
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CreateEmployeeData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCulturalHeritageToggle = (heritage: string) => {
    const updated = selectedCulturalHeritage.includes(heritage)
      ? selectedCulturalHeritage.filter((h) => h !== heritage)
      : [...selectedCulturalHeritage, heritage];

    setSelectedCulturalHeritage(updated);
    handleInputChange("culturalHeritage", updated);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep) || !employee) return;

    updateEmployeeMutation.mutate({
      id: employee.id,
      data: formData,
    });
  };

  const handleClose = () => {
    setCurrentStep(1);
    setErrors({});
    setIsSubmitted(false);
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-onbloom-dark-purple" />
                <Input
                  id="edit-name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-onbloom-dark-purple" />
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="john.doe@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-employeeId">Employee ID *</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-onbloom-dark-purple" />
                <Input
                  id="edit-employeeId"
                  placeholder="EMP001"
                  value={formData.employeeId}
                  onChange={(e) =>
                    handleInputChange("employeeId", e.target.value)
                  }
                  className={`pl-10 ${
                    errors.employeeId ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.employeeId && (
                <p className="text-sm text-red-500">{errors.employeeId}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role/Position *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-onbloom-dark-purple" />
                <Input
                  id="edit-role"
                  placeholder="Software Engineer"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className={`pl-10 ${errors.role ? "border-red-500" : ""}`}
                />
              </div>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  handleInputChange("department", value)
                }
              >
                <SelectTrigger
                  className={errors.department ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-sm text-red-500">{errors.department}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Start Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-onbloom-dark-purple" />
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className={`pl-10 ${
                    errors.startDate ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-onbloom-dark-purple" />
                <Input
                  id="edit-location"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
                />
              </div>
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Time Zone *</Label>
              <Select
                value={formData.timeZone}
                onValueChange={(value) => handleInputChange("timeZone", value)}
              >
                <SelectTrigger
                  className={errors.timeZone ? "border-red-500" : ""}
                >
                  <Clock className="h-4 w-4 mr-2 text-onbloom-dark-purple" />
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map((zone) => (
                    <SelectItem key={zone} value={zone}>
                      {zone.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timeZone && (
                <p className="text-sm text-red-500">{errors.timeZone}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Age Range (Optional)</Label>
              <Select
                value={formData.ageRange}
                onValueChange={(value) => handleInputChange("ageRange", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent>
                  {ageRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gender Identity (Optional)</Label>
              <Select
                value={formData.genderIdentity}
                onValueChange={(value) =>
                  handleInputChange("genderIdentity", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender identity" />
                </SelectTrigger>
                <SelectContent>
                  {genderIdentities.map((identity) => (
                    <SelectItem key={identity} value={identity}>
                      {identity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cultural Heritage (Optional - Select multiple)</Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                {culturalHeritageOptions.map((heritage) => (
                  <label
                    key={heritage}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCulturalHeritage.includes(heritage)}
                      onChange={() => handleCulturalHeritageToggle(heritage)}
                      className="rounded border-gray-300 text-onbloom-primary focus:ring-onbloom-primary"
                    />
                    <span className="text-sm">{heritage}</span>
                  </label>
                ))}
              </div>
              {selectedCulturalHeritage.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedCulturalHeritage.map((heritage) => (
                    <Badge
                      key={heritage}
                      variant="secondary"
                      className="text-xs bg-onbloom-accent-pink/20 text-onbloom-primary"
                    >
                      {heritage}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-onbloom-primary">
            Edit Employee - {employee?.name}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-onbloom-dark-purple">
                  <span>
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span>
                    {Math.round((currentStep / totalSteps) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-onbloom-neutral rounded-full h-2">
                  <motion.div
                    className="bg-onbloom-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-onbloom-primary">
                  {stepTitles[currentStep - 1]}
                </h3>
              </div>

              {/* Form Content */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStepContent()}
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-onbloom-primary hover:bg-onbloom-primary/90"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={updateEmployeeMutation.isPending}
                    className="bg-onbloom-primary hover:bg-onbloom-primary/90"
                  >
                    {updateEmployeeMutation.isPending ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : null}
                    {updateEmployeeMutation.isPending
                      ? "Updating Employee..."
                      : "Update Employee"}
                  </Button>
                )}
              </div>

              {/* Submit Error Display */}
              {errors.submit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-onbloom-primary">
                Employee Updated Successfully!
              </h3>
              <p className="text-onbloom-dark-purple">
                {formData.name}&apos;s information has been updated in the system.
              </p>
              <div className="flex gap-3 justify-center pt-4">
                <Button onClick={handleClose}>Close</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

interface EmployeeDirectoryClientProps {
  employees: EmployeeCulturalProfile[];
  onRefresh?: () => void;
}

export function EmployeeDirectoryClient({
  employees,
  onRefresh,
}: EmployeeDirectoryClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeCulturalProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleEmployeeAdded = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // Fallback: Force a refresh by incrementing the key
      setRefreshKey((prev) => prev + 1);
    }
  };

  const handleEmployeeClick = (employee: EmployeeCulturalProfile) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleEmployeeUpdated = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      // Fallback: Force a refresh by incrementing the key
      setRefreshKey((prev) => prev + 1);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        // Fallback: Force a refresh by incrementing the key
        setRefreshKey((prev) => prev + 1);
      }
    } finally {
      // Keep the spinning animation for a minimum time for better UX
      setTimeout(() => {
        setIsSyncing(false);
      }, 1000);
    }
  };

  const departments = useMemo(() => {
    const depts = Array.from(
      new Set(
        employees.filter((emp) => emp.department).map((emp) => emp.department)
      )
    );
    return ["all", ...depts.sort()];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.email &&
          employee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (employee.department &&
          employee.department
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (employee.location &&
          employee.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDepartment =
        departmentFilter === "all" || employee.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchTerm, departmentFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-onbloom-neutral via-white to-onbloom-neutral/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-onbloom-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-onbloom-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-onbloom-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-onbloom-primary">
                  {employees.length}
                </p>
                <p className="text-sm text-onbloom-dark-purple font-secondary">
                  Total Employees
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm border-onbloom-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-onbloom-accent-pink/10 rounded-lg">
                <Building2 className="h-6 w-6 text-onbloom-accent-pink" />
              </div>
              <div>
                <p className="text-2xl font-bold text-onbloom-primary">
                  {departments.length - 1}
                </p>
                <p className="text-sm text-onbloom-dark-purple font-secondary">
                  Departments
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur-sm border-onbloom-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-onbloom-accent-pink/10 rounded-lg">
                <BadgeIcon className="h-6 w-6 text-onbloom-accent-pink" />
              </div>
              <div>
                <p className="text-2xl font-bold text-onbloom-primary">
                  {
                    Array.from(
                      new Set(
                        employees.flatMap((emp) => emp.culturalHeritage || [])
                      )
                    ).length
                  }
                </p>
                <p className="text-sm text-onbloom-dark-purple font-secondary">
                  Cultural Backgrounds
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="font-title text-4xl font-bold text-onbloom-primary mb-2">
            New Hires
          </h1>
          <p className="text-lg text-onbloom-dark-purple font-secondary">
            Welcome our newest team members and track their onboarding journey
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-onbloom-dark-purple" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-onbloom-primary/20 focus:border-onbloom-primary bg-white/80 backdrop-blur-sm"
                />
              </div>

              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-full sm:w-48 border-onbloom-primary/20 bg-white/80 backdrop-blur-sm">
                  <Filter className="h-4 w-4 mr-2 text-onbloom-accent-pink" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <OnboardEmployeeModal onEmployeeAdded={handleEmployeeAdded} />
              
              <Button
                variant="outline"
                onClick={handleSync}
                disabled={isSyncing}
                className="border-onbloom-primary/20 hover:bg-onbloom-primary/10"
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", isSyncing && "animate-spin")} />
                {isSyncing ? "Syncing..." : "Sync from Notion"}
              </Button>

              <div className="flex gap-2 ml-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "bg-onbloom-primary hover:bg-onbloom-primary/90"
                      : ""
                  }
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "bg-onbloom-primary hover:bg-onbloom-primary/90"
                      : ""
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-onbloom-dark-purple font-secondary">
            <span>
              Showing {filteredEmployees.length} of {employees.length} employees
            </span>
          </div>
        </motion.div>

        {/* Employee Grid/List */}
        {filteredEmployees.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <User className="h-12 w-12 text-onbloom-dark-purple mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-onbloom-primary mb-2 font-title">
              No employees found
            </h3>
            <p className="text-onbloom-dark-purple font-secondary">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        ) : (
          <div
            className={cn(
              "gap-6",
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col space-y-4"
            )}
          >
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <EmployeeCard 
                  employee={employee} 
                  viewMode={viewMode} 
                  onClick={handleEmployeeClick}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        employee={selectedEmployee}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onEmployeeUpdated={handleEmployeeUpdated}
      />
    </div>
  );
}
