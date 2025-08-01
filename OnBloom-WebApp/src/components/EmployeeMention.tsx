"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTRPC } from "@/trpc/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { EmployeeCulturalProfile } from "@/service/notion";
import { useQuery } from "@tanstack/react-query";

interface EmployeeMentionProps {
  value: string;
  onChange: (value: string) => void;
  onMention: (employee: EmployeeCulturalProfile) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

export function EmployeeMention({
  value,
  onChange,
  onMention,
  textareaRef,
}: EmployeeMentionProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mentionPosition, setMentionPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [currentMentionStart, setCurrentMentionStart] = useState(-1);

  // Get tRPC context
  const trpc = useTRPC();

  // Fetch employees using tRPC
  const { data: employees, isLoading } = useQuery(
    trpc.employee.search.queryOptions(
      {
        query: search,
      },
      {
        enabled: search.length > 0,
      },
    ),
  );

  // const { data: employees, isLoading } = trpc.employee.search.useQuery(
  //   { query: search },
  //   {
  //     enabled: search.length > 0,
  //     keepPreviousData: true,
  //   }
  // )

  // Handle text changes
  const handleTextChange = useCallback(
    (newValue: string) => {
      onChange(newValue);

      // Check for @ symbol
      const cursorPosition = textareaRef.current?.selectionStart || 0;
      const textBeforeCursor = newValue.slice(0, cursorPosition);
      const lastAtIndex = textBeforeCursor.lastIndexOf("@");

      if (lastAtIndex !== -1 && cursorPosition > lastAtIndex) {
        const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);

        // Check if there's no space after @ (still typing the mention)
        if (!textAfterAt.includes(" ")) {
          setSearch(textAfterAt);
          setCurrentMentionStart(lastAtIndex);
          setOpen(true);

          // Calculate popover position
          if (textareaRef.current) {
            const textarea = textareaRef.current;
            const textBeforeAt = newValue.substring(0, lastAtIndex);
            const lines = textBeforeAt.split("\n");
            const currentLine = lines.length;
            const currentLineText = lines[lines.length - 1];

            // Simple position calculation (can be improved)
            const lineHeight = 24; // Approximate line height
            const charWidth = 8; // Approximate character width

            const top = textarea.offsetTop + currentLine * lineHeight;
            const left =
              textarea.offsetLeft + currentLineText.length * charWidth;

            setMentionPosition({ top, left });
          }
        } else {
          setOpen(false);
          setSearch("");
          setCurrentMentionStart(-1);
        }
      } else {
        setOpen(false);
        setSearch("");
        setCurrentMentionStart(-1);
      }
    },
    [onChange, textareaRef],
  );

  // Handle employee selection
  const handleSelectEmployee = useCallback(
    (employee: EmployeeCulturalProfile) => {
      if (currentMentionStart !== -1) {
        const beforeMention = value.slice(0, currentMentionStart);
        const afterMention = value.slice(
          textareaRef.current?.selectionStart || 0,
        );
        const newValue = `${beforeMention}@${employee.name} ${afterMention}`;

        onChange(newValue);
        onMention(employee);

        // Move cursor after the mention
        setTimeout(() => {
          if (textareaRef.current) {
            const newCursorPosition =
              currentMentionStart + employee.name.length + 2;
            textareaRef.current.setSelectionRange(
              newCursorPosition,
              newCursorPosition,
            );
            textareaRef.current.focus();
          }
        }, 0);
      }

      setOpen(false);
      setSearch("");
      setCurrentMentionStart(-1);
    },
    [value, currentMentionStart, onChange, onMention, textareaRef],
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
        setCurrentMentionStart(-1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => handleTextChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !open) {
            e.preventDefault();
            // Parent component should handle form submission
          }
        }}
        placeholder="Describe the person you're shopping for and the occasion... Use @ to mention employees"
        className="w-full px-6 py-4 text-base bg-transparent resize-none outline-none min-h-[120px] max-h-[300px] placeholder:text-muted-foreground/60"
        rows={3}
      />

      {open && mentionPosition && (
        <div
          className="absolute z-50 mt-1 bg-background border border-border rounded-lg shadow-lg"
          style={{
            top: `${mentionPosition.top}px`,
            left: `${mentionPosition.left}px`,
            minWidth: "300px",
          }}
        >
          <Command className="rounded-lg">
            <CommandInput
              placeholder="Search employees..."
              value={search}
              onValueChange={setSearch}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Searching..." : "No employees found."}
              </CommandEmpty>
              {employees && employees.length > 0 && (
                <CommandGroup>
                  {employees.map((employee) => (
                    <CommandItem
                      key={employee.id}
                      value={employee.name}
                      onSelect={() => handleSelectEmployee(employee)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {employee.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground truncate">
                              {employee.role} • {employee.department}
                            </p>
                          </div>
                        </div>
                        {employee.tags &&
                          employee.tags.includes("New Hire") && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </>
  );
}
